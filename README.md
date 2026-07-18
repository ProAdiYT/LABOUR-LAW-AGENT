# ShramikMitra AI

**Your AI-powered Labour Rights Assistant for Migrant Workers in Delhi.**

ShramikMitra AI is a modern Government-Tech platform built as a hackathon prototype. It helps migrant and unorganized laborers in Delhi NCT understand their rights, log their daily wages and hours in a Worker Diary, automatically generate formal complaints in Hindi and English, analyze salary slips/contracts using Elastic AI, and locate nearby help centers.

---

## Tech Stack

### Frontend
*   **Framework:** Next.js 15 (App Router, Tailwind CSS, TypeScript)
*   **UI Libraries:** React 19, Lucide Icons, Framer Motion
*   **State Management:** React Hook Form, Custom Auth & Theme Context Hooks
*   **Integrations:** Web Speech API (dictation), Local Storage theme syncing

### Backend
*   **Framework:** FastAPI (Python 3.12)
*   **Database:** SQLite using SQLAlchemy ORM (auto-migrating on startup)
*   **Authentication:** JWT Token Security & frictionless Guest Mode bypass
*   **AI Integration:** Elastic AI (using `elasticsearch` Python SDK)
*   **Utility:** ReportLab (automated dual-language PDF complaint generation)

---

## Directory Structure

```
shramik-mitra-ai/
├── shared/
│   ├── rights_library.json     # Delhi labour laws local database
│   └── schemes.json            # Delhi & Central welfare schemes
├── backend/
│   ├── app/
│   │   ├── services/
│   │   │   └── elastic_ai.py   # Reusable Elastic AI Service (with active client + offline mock fallbacks)
│   │   ├── routers/
│   │   │   ├── auth.py         # JWT and guest endpoints
│   │   │   ├── chat.py         # AI chatbot session endpoints
│   │   │   ├── complaints.py   # Complaint drafts and PDF downloads
│   │   │   └── ...             # rights, schemes, diary, profile, upload
│   │   ├── main.py             # FastAPI entrypoint & CORS config
│   │   ├── config.py           # Settings manager
│   │   ├── database.py         # SQLite connection setup
│   │   └── models.py           # SQLAlchemy tables schema
│   ├── requirements.txt        # Backend python dependencies
│   └── .env.example            # Environment variables template
└── frontend/
    ├── src/
    │   ├── app/                # Next.js pages (Landing, Login, Dashboard, Chat, etc.)
    │   ├── components/         # Common navigation sidebar layouts
    │   ├── hooks/              # useAuth, useTheme, useSpeech (Web speech API)
    │   └── lib/
    │       └── api.ts          # Type-safe API client helper
    ├── package.json            # Node JS packages definitions
    ├── tsconfig.json           # TypeScript configuration
    └── ...
```

---

## Getting Started

### Prerequisites
*   Python 3.12+
*   Node.js 18+ & NPM

### Step 1: Run the Backend API

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Create and activate a Python virtual environment:
    ```bash
    python -m venv venv
    
    # Windows PowerShell:
    .\venv\Scripts\Activate.ps1
    # Linux/Mac:
    source venv/bin/activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Configure environment variables:
    *   Rename `.env.example` to `.env` or create `.env` manually.
    *   Add your **Elastic AI Configurations**:
        ```env
        DATABASE_URL=sqlite:///./shramikmitra.db
        SECRET_KEY=super-secret-key-for-shramik-mitra-ai-2026
        ELASTIC_URL=http://localhost:9200
        ELASTIC_API_KEY=your_elastic_api_key_here
        ELASTIC_MODEL_ID=elastic-chat-completion
        ```
    *   *Note: If `ELASTIC_API_KEY` is not provided or empty, the application automatically runs in **MOCK Mode**, serving comprehensive, context-aware fallback data so you can fully audit all features offline.*

5.  Run the Uvicorn local server:
    ```bash
    uvicorn app.main:app --reload --port 8000
    ```
    *   The server will start at: `http://localhost:8000`
    *   Automatic SQLite database migrations run on startup, creating the local file `shramikmitra.db`.
    *   API Docs will be available at: `http://localhost:8000/docs`

---

### Step 2: Run the Frontend (Next.js)

1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```

2.  Install packages:
    ```bash
    npm install
    ```

3.  Configure local environment variables:
    *   Make sure `frontend/.env.local` points to your backend instance (defaults to `http://localhost:8000`):
        ```env
        NEXT_PUBLIC_API_URL=http://localhost:8000
        ```

4.  Run local development server:
    ```bash
    npm run dev
    ```
    *   The web app will run at: `http://localhost:3000`

---

## Features Verification Walkthrough

1.  **Landing Page & Guest Login:**
    *   Open `http://localhost:3000`. Click "Get Started" to enter directly via **Guest Mode** (frictionless entry without credentials creation).
2.  **Worker Diary CRUD:**
    *   Go to "Worker Diary", click "Add Work Log", enter employer details, select hours, and save. Add multiple entries and observe total statistics updates. Try editing or deleting log entries.
3.  **AI Assistant Chat:**
    *   Go to "AI Assistant". Ask a question in English, Hindi, or Hinglish: *"My employer hasn't paid me for 3 weeks, what should I do?"* or click one of the suggested prompts. Try using the microphone button (Chrome/Edge/Safari support Web Speech dictation).
4.  **Welfare Schemes Finder:**
    *   Go to "Welfare Schemes". Enter worker demographics (e.g., Age: 25, Gender: Female, Occupation: Construction, State: Delhi). The system matches schemes locally and prints custom AI explanations on why they qualify.
5.  **Formal Complaint Generator:**
    *   Go to "Complaint Maker", fill out the contractor details and issue parameters, click generate, and preview the formal dual-language (English/Hindi) complaints. Click "Download PDF" to get a compiled PDF draft.
6.  **Document Compliance Analyzer:**
    *   Go to "Document Analyzer". Upload a sample salary slip image or employment PDF contract. The AI reads it, flags alert risks (e.g. wages below Delhi's unskilled limit of ₹17,494), extracts figures, and reports missing clauses.
7.  **Interactive Local Help Directory:**
    *   Go to "Nearby Help Map". Filter local centers by category, select pins to reveal address details, or click "Get Directions" to locate them on Google Maps.
8.  **Profile Preferences:**
    *   Navigate to "Profile Settings" to toggle UI language (English/Hindi), swap theme (Light/Dark mode), or update passwords.
