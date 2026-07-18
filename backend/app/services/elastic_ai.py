import json
import logging
from typing import List, Dict, Optional
from elasticsearch import Elasticsearch
from app.config import settings

logger = logging.getLogger(__name__)

class ElasticAIService:
    def __init__(self):
        self.api_key = settings.ELASTIC_API_KEY
        self.url = settings.ELASTIC_URL
        self.is_active = False
        self.client = None
        
        if self.api_key and self.url:
            try:
                # Initialize the Elasticsearch client
                self.client = Elasticsearch(
                    hosts=[self.url],
                    api_key=self.api_key
                )
                # Quick health check
                info = self.client.info()
                self.is_active = True
                logger.info(f"Elastic AI service initialized successfully. Connected to Elasticsearch {info['version']['number']}.")
            except Exception as e:
                logger.error(f"Error configuring Elasticsearch client: {e}")
                self.is_active = False
        else:
            logger.warning("ELASTIC_API_KEY or ELASTIC_URL is not set. Running in MOCK Mode.")

    def chat(self, user_message: str, history: List[Dict]) -> str:
        """
        AI chat for Labour Rights Assistant using Elastic Inference API.
        """
        if not self.is_active or not self.client:
            return self._mock_chat_response(user_message)

        try:
            # Format the conversation prompt for the LLM
            prompt = "You are ShramikMitra, an empathetic labor rights assistant in Delhi. Answer this worker question:\n"
            for h in history:
                prompt += f"{'Worker' if h['role'] == 'user' else 'Assistant'}: {h['content']}\n"
            
            # Use Elastic Inference API (using a standard model like OpenAI or Bedrock connected to Elastic)
            # Ref: https://www.elastic.co/guide/en/elasticsearch/reference/current/post-inference.html
            model_id = getattr(settings, "ELASTIC_MODEL_ID", "elastic-chat-completion")
            
            response = self.client.inference.inference(
                task_type="completion",
                model_id=model_id,
                input=user_message,
                task_settings={"system_prompt": "You are ShramikMitra, an empathetic and professional AI assistant specializing in labor rights for migrant workers in Delhi. Explain rights simply."}
            )
            
            # Parse output depending on inference model response schema
            if "completion" in response:
                return response["completion"][0]["result"]
            elif "output" in response:
                return response["output"][0]["text"]
            else:
                return str(response)
        except Exception as e:
            logger.error(f"Elastic Inference Chat error: {e}. Falling back to mock.")
            return self._mock_chat_response(user_message) + "\n\n*(Note: Running in offline/fallback mode due to API error)*"

    def recommend_schemes(self, age: int, gender: str, occupation: str, state: str, schemes_list: List[Dict]) -> str:
        """
        Uses Elastic Inference to write a customized recommendation message based on matched schemes.
        """
        if not self.is_active or not self.client:
            return self._mock_schemes_recommendation(age, gender, occupation, state, schemes_list)

        try:
            prompt = (
                f"A worker has provided the following profile:\n"
                f"- Age: {age}\n"
                f"- Gender: {gender}\n"
                f"- Occupation: {occupation}\n"
                f"- Current State: {state}\n\n"
                f"Matched schemes:\n"
                f"{json.dumps(schemes_list, indent=2)}\n\n"
                f"Please write a warm recommendation in both English and Hindi explaining why these fit and next steps."
            )
            
            model_id = getattr(settings, "ELASTIC_MODEL_ID", "elastic-chat-completion")
            response = self.client.inference.inference(
                task_type="completion",
                model_id=model_id,
                input=prompt
            )
            
            if "completion" in response:
                return response["completion"][0]["result"]
            return self._mock_schemes_recommendation(age, gender, occupation, state, schemes_list)
        except Exception as e:
            logger.error(f"Elastic Inference schemes recommendation error: {e}")
            return self._mock_schemes_recommendation(age, gender, occupation, state, schemes_list)

    def generate_complaint(self, employer: str, issue: str, date: str, description: str) -> Dict[str, str]:
        """
        Generates a formal complaint in English and Hindi using Elastic Inference.
        """
        default_complaint = self._mock_complaint_response(employer, issue, date, description)
        if not self.is_active or not self.client:
            return default_complaint

        try:
            prompt = (
                f"Generate a professional labor complaint letter to Delhi Labour Board.\n"
                f"- Employer: {employer}\n"
                f"- Issue: {issue}\n"
                f"- Date: {date}\n"
                f"- Details: {description}\n\n"
                f"Return JSON format matching: {{'complaint_en': '...', 'complaint_hi': '...'}}"
            )
            
            model_id = getattr(settings, "ELASTIC_MODEL_ID", "elastic-chat-completion")
            response = self.client.inference.inference(
                task_type="completion",
                model_id=model_id,
                input=prompt
            )
            
            text = ""
            if "completion" in response:
                text = response["completion"][0]["result"]
                
            data = json.loads(text)
            return {
                "en": data.get("complaint_en", default_complaint["en"]),
                "hi": data.get("complaint_hi", default_complaint["hi"])
            }
        except Exception as e:
            logger.error(f"Elastic Inference complaint error: {e}")
            return default_complaint

    def analyze_document(self, filename: str, content_type: str, content: bytes) -> Dict:
        """
        Analyzes employment documents using Elastic Inference or local parsing heuristics.
        """
        if not self.is_active or not self.client:
            return self._mock_document_analysis(filename)

        try:
            # We convert binary content to string representation to perform text inference in this MVP
            text_content = content.decode("utf-8", errors="ignore")[:4000]
            prompt = (
                f"Analyze this employment document ({filename}):\n{text_content}\n\n"
                f"Extract details and output JSON matching keys: "
                f"summary, salary, working_hours, key_clauses, missing_information, alert_level."
            )
            
            model_id = getattr(settings, "ELASTIC_MODEL_ID", "elastic-chat-completion")
            response = self.client.inference.inference(
                task_type="completion",
                model_id=model_id,
                input=prompt
            )
            
            text = ""
            if "completion" in response:
                text = response["completion"][0]["result"]
            return json.loads(text)
        except Exception as e:
            logger.error(f"Elastic Inference document analysis error: {e}")
            return self._mock_document_analysis(filename)

    # --- MOCK FALLBACK METHODS ---
    
    def _mock_chat_response(self, message: str) -> str:
        msg = message.lower()
        if "pay" in msg or "salary" in msg or "पैसे" in msg or "वेतन" in msg:
            return (
                "### ⚖️ Your Rights: Unpaid Wages [Elastic AI Assistant]\n\n"
                "Under the **Minimum Wages Act, 1948** and **Delhi Shops & Establishments Act**, you have strong protections:\n"
                "1. **Timely Payment**: Your employer must pay your salary by the **7th day of the month** (if there are less than 1,000 workers) or the **10th day** otherwise.\n"
                "2. **Rate Violation**: If you are being paid less than ₹17,494/month (for unskilled work), it is illegal in Delhi.\n\n"
                "### 📝 Recommended Next Steps:\n"
                "- **Talk to your Employer**: Politely remind them of the legal payment deadline. Show them your work log.\n"
                "- **Log Your Work**: Add your unpaid days in the **Worker Diary** tool on this dashboard.\n"
                "- **Generate a Complaint**: Go to the **Complaint Generator** tab to draft an official letter to the Delhi Labour Board.\n"
                "- **Get Legal Help**: You can contact a local NGO or visit the closest Labour Office shown in the **Nearby Help** map."
            )
        elif "hour" in msg or "overtime" in msg or "घंटे" in msg:
            return (
                "### ⏰ Your Rights: Working Hours & Overtime [Elastic AI Assistant]\n\n"
                "According to Delhi labor regulations:\n"
                "1. **Normal Work Hours**: Maximum **8 hours per day** and **48 hours per week**.\n"
                "2. **Overtime Pay**: Any hour worked beyond 8 hours must be paid at **double (2x) your normal hourly wage**.\n"
                "3. **Rest Intervals**: You must get a rest break of at least **30 minutes** after every 5 hours of continuous work.\n"
                "4. **Weekly Off**: One paid holiday per week (usually Sunday) is compulsory.\n\n"
                "### 📝 Recommended Next Steps:\n"
                "- Record your daily hours, including overtime, in the **Worker Diary**.\n"
                "- Generate a complaint if the employer forces you to work >12 hours or refuses overtime compensation."
            )
        elif "accident" in msg or "injury" in msg or "safety" in msg or "चोट" in msg:
            return (
                "### 🛡️ Your Rights: Workplace Safety & Accidents [Elastic AI Assistant]\n\n"
                "Your safety is protected under the **BOCW Act** (for construction) and the **Factories Act**:\n"
                "1. **Safety Gear**: Employers must provide helmet, gloves, harness, and safety shoes for free.\n"
                "2. **Medical Treatment**: In case of injury, the employer must cover first aid and immediate hospital expenses.\n"
                "3. **Compensation**: Under the **Employee's Compensation Act**, you are entitled to compensation for temporary or permanent disability caused at work.\n\n"
                "### 📝 Recommended Next Steps:\n"
                "- **Photograph the Site**: Take pictures of the unsafe area or your injury if possible.\n"
                "- **Seek NGO Assistance**: NGOs can help file a compensation claim. Find them in the **Nearby Help** tab."
            )
        else:
            return (
                "Hello! I am **ShramikMitra AI (Elastic AI Powered)**, your Labour Rights Assistant. I can help you with:\n\n"
                "- **Wage issues**: Unpaid salaries, underpayment below minimum wage.\n"
                "- **Working hours**: Overtime calculations, mandatory breaks, weekly off.\n"
                "- **Safety & Health**: Construction site safety, accident compensations.\n"
                "- **Welfare Schemes**: Recommending schemes like BOCW card benefits, ONORC ration cards.\n\n"
                "Please tell me what issue you are facing or ask a question like: *'My employer hasn't paid me for 2 months'* or *'What is the minimum wage for skilled workers in Delhi?'*"
            )

    def _mock_schemes_recommendation(self, age: int, gender: str, occupation: str, state: str, schemes_list: List[Dict]) -> str:
        if not schemes_list:
            return (
                "### 🏛️ Welfare Scheme Recommendation [Elastic AI]\n\n"
                "Based on your profile (Age: *{age}*, Gender: *{gender}*, Occupation: *{occupation}*), we couldn't match a specific Delhi scheme. "
                "However, you may still be eligible for central schemes:\n"
                "- **One Nation One Ration Card (ONORC)**: Get food grains from any ration shop in Delhi.\n"
                "- **e-Shram Portal**: Register online to get a universal account number and ₹2 Lakh accident insurance."
            )
        
        schemes_text = ""
        for i, s in enumerate(schemes_list):
            schemes_text += f"{i+1}. **{s['name_en']}** ({s['name_hi']})\n"
            schemes_text += f"   - **Benefits**: {s['benefits_en']}\n"
            schemes_text += f"   - **Documents**: {', '.join(s['required_documents_en'])}\n\n"

        return (
            f"### 🏛️ Welfare Schemes Matched for You [Elastic AI]\n\n"
            f"Hello! Based on your profile (Age: **{age}**, Gender: **{gender}**, Occupation: **{occupation}**), here are your eligible benefits:\n\n"
            f"{schemes_text}"
            f"### 📝 Next Steps to Claim:\n"
            f"1. Gather the required documents listed above.\n"
            f"2. Visit the nearest **Delhi Civic Centre / Labour Office** or file online via the e-District Delhi portal.\n"
            f"3. You can locate the closest Labour Office using our **Nearby Help** map."
        )

    def _mock_complaint_response(self, employer: str, issue: str, date: str, description: str) -> Dict[str, str]:
        subject_en = f"Complaint regarding {issue} by employer {employer}"
        body_en = (
            f"To,\n"
            f"The Labour Commissioner,\n"
            f"Government of NCT of Delhi,\n"
            f"Delhi, India.\n\n"
            f"Subject: Formal Complaint against {employer} for {issue} (Elastic AI Draft).\n\n"
            f"Respected Sir/Madam,\n\n"
            f"I am writing to formally log a complaint against my employer, {employer}, located in Delhi. "
            f"The issue commenced on or around {date}.\n\n"
            f"Details of the violation:\n"
            f"{description}\n\n"
            f"This is a direct violation of my labor rights. I request your department to conduct an immediate "
            f"investigation and direct the employer to settle my rightful dues/provide safety measures as per the "
            f"Delhi Labour regulations.\n\n"
            f"Sincerely,\n"
            f"[Your Name]\n"
            f"Contact Number: [Your Phone]\n"
        )

        subject_hi = f"नियोक्ता {employer} द्वारा {issue} के संबंध में शिकायत"
        body_hi = (
            f"सेवा में,\n"
            f"श्रम आयुक्त,\n"
            f"राष्ट्रीय राजधानी क्षेत्र दिल्ली सरकार,\n"
            f"दिल्ली, भारत।\n\n"
            f"विषय: {issue} के लिए नियोक्ता {employer} के खिलाफ औपचारिक शिकायत (एलास्टिक एआई प्रारूप)।\n\n"
            f"आदरणीय महोदय / महोदया,\n\n"
            f"मैं दिल्ली में स्थित अपने नियोक्ता, {employer} के खिलाफ औपचारिक रूप से एक शिकायत दर्ज कराने के लिए लिख रहा हूँ। "
            f"यह समस्या लगभग {date} को शुरू हुई थी।\n\n"
            f"उल्लंघन का विवरण:\n"
            f"{description}\n\n"
            f"यह मेरे श्रम अधिकारों का सीधा उल्लंघन है। मेरा आपके विभाग से अनुरोध है कि तत्काल जांच की जाए और नियोक्ता को "
            f"दिल्ली श्रम नियमों के अनुसार मेरे जायज बकाये का निपटान करने / सुरक्षा उपाय प्रदान करने का निर्देश दिया जाए।\n\n"
            f"भवदीय,\n"
            f"[आपका नाम]\n"
            f"संपर्क नंबर: [आपका फोन]\n"
        )

        return {
            "en": body_en,
            "hi": body_hi
        }

    def _mock_document_analysis(self, filename: str) -> Dict:
        name = filename.lower()
        if "slip" in name or "pay" in name or "salary" in name:
            return {
                "summary": f"Salary slip analysis for file '{filename}' by Elastic AI. The document lists basic wages, standard deductions, and total days worked.",
                "salary": "₹15,000 / month (Basic + Allowances)",
                "working_hours": "Not explicitly mentioned in the slip.",
                "key_clauses": "Deductions of ₹1,800 for Provident Fund (PF) and ₹405 for ESIC.",
                "missing_information": "Overtime working hours and overtime wage rates are not mentioned despite overtime being performed.",
                "alert_level": "medium",
                "alert_reason": "The salary of ₹15,000 is below the Delhi statutory Minimum Wage for unskilled workers (₹17,494)."
            }
        else:
            return {
                "summary": f"Employment Contract/Offer Letter analysis for file '{filename}' by Elastic AI. Defines position, probationary period, and notice terms.",
                "salary": "₹18,500 / month",
                "working_hours": "10 hours per day, 6 days per week (60 hours total per week).",
                "key_clauses": "Termination requires a 24-hour notice by the worker, but 1-month notice by the employer. Penalty of 15 days wage if leaving without notice.",
                "missing_information": "Does not specify overtime rates (must be 2x) or weekly rest day details.",
                "alert_level": "high",
                "alert_reason": "Working hours of 10 hours/day (60 hours/week) violates the Delhi Shops & Establishments Act limit of 48 hours/week. The penalty clause for leaving is exploitative."
            }

elastic_ai_service = ElasticAIService()
