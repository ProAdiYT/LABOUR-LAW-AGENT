import io
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models import User, Complaint
from app.schemas import ComplaintCreate, ComplaintResponse
from app.auth import get_current_user
from app.services.elastic_ai import elastic_ai_service

# ReportLab imports for PDF generation
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

router = APIRouter(prefix="/complaints", tags=["Complaint Generator"])

@router.get("/history", response_model=List[ComplaintResponse])
def get_complaint_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    complaints = db.query(Complaint).filter(Complaint.user_id == current_user.id).order_by(Complaint.timestamp.desc()).all()
    return complaints

@router.post("/generate", response_model=ComplaintResponse)
def generate_complaint(
    complaint_in: ComplaintCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Call Elastic AI to generate English and Hindi complaints
    generated_letters = elastic_ai_service.generate_complaint(
        employer=complaint_in.employer_name,
        issue=complaint_in.issue,
        date=complaint_in.date,
        description=complaint_in.description
    )

    db_complaint = Complaint(
        user_id=current_user.id,
        employer_name=complaint_in.employer_name,
        issue=complaint_in.issue,
        date=complaint_in.date,
        description=complaint_in.description,
        content_en=generated_letters["en"],
        content_hi=generated_letters["hi"]
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

@router.get("/{complaint_id}/download")
def download_complaint_pdf(
    complaint_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(
        Complaint.id == complaint_id, 
        Complaint.user_id == current_user.id
    ).first()
    
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Complaint not found"
        )

    # Generate PDF in-memory
    buffer = io.BytesIO()
    
    # Setup document
    doc = SimpleDocTemplate(
        buffer, 
        pagesize=letter,
        rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#2563EB'),
        spaceAfter=15
    )
    
    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=15,
        spaceAfter=10
    )
    
    meta_label_style = ParagraphStyle(
        'MetaLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#475569')
    )
    
    meta_value_style = ParagraphStyle(
        'MetaValue',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#0F172A')
    )
    
    body_style = ParagraphStyle(
        'ComplaintBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#334155'),
        spaceBefore=8,
        spaceAfter=8
    )

    story = []

    # Title
    story.append(Paragraph("ShramikMitra AI - Labour Complaint Draft", title_style))
    story.append(Spacer(1, 10))

    # Metadata Table
    meta_data = [
        [
            Paragraph("Employer Name:", meta_label_style), Paragraph(complaint.employer_name, meta_value_style),
            Paragraph("Date of Incident:", meta_label_style), Paragraph(complaint.date, meta_value_style)
        ],
        [
            Paragraph("Issue Category:", meta_label_style), Paragraph(complaint.issue, meta_value_style),
            Paragraph("Generated On:", meta_label_style), Paragraph(complaint.timestamp.strftime("%Y-%m-%d"), meta_value_style)
        ]
    ]
    
    meta_table = Table(meta_data, colWidths=[100, 160, 100, 160])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#F1F5F9')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    
    story.append(meta_table)
    story.append(Spacer(1, 15))

    # English Section
    story.append(Paragraph("Formal Complaint Draft (English)", heading_style))
    
    for line in complaint.content_en.split('\n'):
        if line.strip():
            story.append(Paragraph(line, body_style))
        else:
            story.append(Spacer(1, 4))
            
    story.append(Spacer(1, 20))

    # Hindi Section
    story.append(Paragraph("शिकायत प्रारूप (Hindi Translation)", heading_style))
    
    note_style = ParagraphStyle(
        'HindiNote',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#D97706'),
        spaceAfter=10
    )
    story.append(Paragraph("Note: If the Hindi text below does not render properly in your PDF reader, please copy the Hindi text directly from the ShramikMitra web app dashboard.", note_style))

    for line in complaint.content_hi.split('\n'):
        if line.strip():
            try:
                story.append(Paragraph(line, body_style))
            except Exception:
                story.append(Paragraph("[Hindi Text - View / Copy from Dashboard]", body_style))
        else:
            story.append(Spacer(1, 4))

    # Build PDF
    try:
        doc.build(story)
    except Exception as e:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        story = [
            Paragraph("ShramikMitra AI - Complaint Export Error", title_style),
            Paragraph(f"An error occurred while compiling the bilingual PDF layout: {str(e)}", body_style),
            Paragraph("Please view and copy the English and Hindi complaint drafts directly from your dashboard.", body_style)
        ]
        doc.build(story)

    buffer.seek(0)
    
    filename = f"complaint_{complaint_id}.pdf"
    headers = {
        'Content-Disposition': f'attachment; filename="{filename}"'
    }
    
    return StreamingResponse(buffer, media_type="application/pdf", headers=headers)
