const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface User {
  id: number;
  username: str;
  role: "user" | "guest";
  preferred_language: "en" | "hi";
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface DiaryEntry {
  id: number;
  user_id: number;
  date: string;
  employer: string;
  hours_worked: number;
  salary_earned: number;
  notes?: string;
}

export interface ChatMessage {
  id: number;
  message: string;
  response: string;
  timestamp: string;
}

export interface Complaint {
  id: number;
  employer_name: string;
  issue: string;
  date: string;
  description: string;
  content_en: string;
  content_hi: string;
  timestamp: string;
}

export interface Scheme {
  id: string;
  name_en: string;
  name_hi: string;
  description_en: string;
  description_hi: string;
  benefits_en: string;
  benefits_hi: string;
  required_documents_en: string[];
  required_documents_hi: string[];
}

export interface SchemeRecommendation {
  schemes: Scheme[];
  ai_recommendation: string;
}

class ApiClient {
  private getHeaders(isMultipart = false): HeadersInit {
    const headers: Record<string, string> = {};
    if (!isMultipart) {
      headers["Content-Type"] = "application/json";
    }
    
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("shramik_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isMultipart = options.body instanceof FormData;
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(isMultipart),
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      let errorMsg = "Something went wrong";
      try {
        const errorData = await response.json();
        errorMsg = errorData.detail || errorMsg;
      } catch (e) {
        // failed to parse json error
      }
      throw new Error(errorMsg);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  // Auth
  async login(username: string, password: string): Promise<Token> {
    return this.request<Token>("/api/auth/login-json", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async register(username: string, password: string): Promise<User> {
    return this.request<User>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async guestLogin(): Promise<Token> {
    return this.request<Token>("/api/auth/guest", {
      method: "POST",
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>("/api/auth/me");
  }

  async updateProfile(data: { username?: string; preferred_language?: "en" | "hi"; password?: string }): Promise<User> {
    return this.request<User>("/api/profile/", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // AI Chat
  async getChatHistory(): Promise<ChatMessage[]> {
    return this.request<ChatMessage[]>("/api/chat/");
  }

  async sendChatMessage(message: string): Promise<ChatMessage> {
    return this.request<ChatMessage>("/api/chat/", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  }

  async clearChatHistory(): Promise<void> {
    return this.request<void>("/api/chat/clear", {
      method: "DELETE",
    });
  }

  // Labour Rights Library
  async getAllRights(): Promise<any[]> {
    return this.request<any[]>("/api/rights/");
  }

  // Schemes
  async getRecommendedSchemes(age: number, gender: string, occupation: string, state: string): Promise<SchemeRecommendation> {
    return this.request<SchemeRecommendation>("/api/schemes/recommend", {
      method: "POST",
      body: JSON.stringify({ age, gender, occupation, state }),
    });
  }

  // Complaints
  async getComplaintHistory(): Promise<Complaint[]> {
    return this.request<Complaint[]>("/api/complaints/history");
  }

  async generateComplaint(data: { employer_name: string; issue: string; date: string; description: string }): Promise<Complaint> {
    return this.request<Complaint>("/api/complaints/generate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  getComplaintPdfUrl(complaintId: number): string {
    const token = typeof window !== "undefined" ? localStorage.getItem("shramik_token") : "";
    return `${API_BASE_URL}/api/complaints/${complaintId}/download?token=${token}`;
  }

  // Worker Diary
  async getDiaryEntries(): Promise<DiaryEntry[]> {
    return this.request<DiaryEntry[]>("/api/diary/");
  }

  async createDiaryEntry(data: Omit<DiaryEntry, "id" | "user_id">): Promise<DiaryEntry> {
    return this.request<DiaryEntry>("/api/diary/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateDiaryEntry(id: number, data: Omit<DiaryEntry, "id" | "user_id">): Promise<DiaryEntry> {
    return this.request<DiaryEntry>(`/api/diary/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteDiaryEntry(id: number): Promise<void> {
    return this.request<void>(`/api/diary/${id}`, {
      method: "DELETE",
    });
  }

  // Document Analyzer
  async uploadDocument(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    return this.request<any>("/api/upload/", {
      method: "POST",
      body: formData,
    });
  }
}

export const api = new ApiClient();
