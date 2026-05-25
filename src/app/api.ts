const configuredApiUrl = (import.meta.env.VITE_API_URL || "").trim();
const defaultApiUrl = import.meta.env.DEV ? "http://127.0.0.1:8000/api" : "/_/backend/api";
export const API_BASE_URL = (configuredApiUrl || defaultApiUrl).replace(/\/+$/, "");
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || "quickfix-admin-dev";

export interface ClientData {
  id?: number;
  nomeCompleto: string;
  email: string;
  telefone: string;
  empresa?: string;
  cnpj?: string;
  cpf?: string;
  dataNascimento?: string;
  endereco?: string;
}

export interface DiplomaFile {
  id: number;
  name: string;
  url: string;
}

export interface ProfessionalData {
  id?: number;
  nomeCompleto: string;
  email: string;
  telefone: string;
  cpf?: string;
  dataNascimento?: string;
  registro?: string;
  curriculo?: string;
  resumeUrl?: string;
  diplomas?: DiplomaFile[];
  senha?: string;
  status?: "pendente" | "aprovado" | "reprovado";
  rejectionReason?: string;
  reviewedAt?: string;
  createdAt?: string;
}

export interface ChatReply {
  sessionKey: string;
  reply: string;
  needsEscalation: boolean;
  escalationId?: number;
}

export interface ChatEscalation {
  id: number;
  sessionKey: string;
  userQuestion: string;
  status: "aberta" | "resolvida";
  adminReply: string;
  createdAt: string;
}

export interface QuestionnaireResult {
  serviceType: string;
  serviceName: string;
  answers: Record<string, string>;
  description: string;
  totalScore: number;
  averageScore: number;
  answersCount: number;
  timestamp: string;
}

export interface Order {
  id: number;
  title: string;
  type: "Hardware" | "Redes";
  status: "analise" | "em_andamento" | "concluido";
  priority: "baixa" | "media" | "alta" | "urgente";
  professional: string;
  estimatedTime: string;
  createdAt: string;
  questionnaireData?: QuestionnaireResult;
  client?: ClientData | null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const msg = (body as { error?: string; errors?: string[] }).error
      || (body as { errors?: string[] }).errors?.join(", ")
      || `API ${response.status}`;
    throw new Error(msg);
  }
  return body as T;
}

function adminHeaders(): HeadersInit {
  return { "X-Admin-Token": ADMIN_TOKEN };
}

export const api = {
  saveClient(data: ClientData) {
    return request<ClientData>("/clients/", { method: "POST", body: JSON.stringify(data) });
  },
  registerClient(data: ClientData) {
    return request<ClientData>("/clients/register/", { method: "POST", body: JSON.stringify(data) });
  },
  loginProfessional(email: string, senha: string) {
    return request<ProfessionalData>("/professionals/", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    });
  },
  registerProfessional(data: ProfessionalData) {
    return request<ProfessionalData>("/professionals/register/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async registerProfessionalForm(form: FormData) {
    const response = await fetch(`${API_BASE_URL}/professionals/register/`, {
      method: "POST",
      body: form,
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      const msg =
        (body as { error?: string }).error ||
        (body as { errors?: string[] }).errors?.join(", ") ||
        `API ${response.status}`;
      throw new Error(msg);
    }
    return body as ProfessionalData;
  },
  getProfessionalAdmin(id: number) {
    return request<ProfessionalData>(`/admin/professionals/${id}/`, { headers: adminHeaders() });
  },
  async listOrders() {
    const data = await request<{ orders: Order[] }>("/orders/");
    return data.orders;
  },
  createOrder(data: Omit<Order, "id" | "createdAt"> & { client?: ClientData | null }) {
    return request<Order>("/orders/", { method: "POST", body: JSON.stringify(data) });
  },
  updateOrder(orderId: number, data: Partial<Pick<Order, "status" | "professional">>) {
    return request<Order>(`/orders/${orderId}/`, { method: "PATCH", body: JSON.stringify(data) });
  },
  createChatSession(sessionKey?: string, userEmail?: string) {
    return request<{ sessionKey: string }>("/chat/sessions/", {
      method: "POST",
      body: JSON.stringify({ sessionKey, userEmail }),
    });
  },
  sendChatMessage(sessionKey: string, message: string, userEmail?: string) {
    return request<ChatReply>("/chat/messages/", {
      method: "POST",
      body: JSON.stringify({ sessionKey, message, userEmail }),
    });
  },
  listProfessionalsAdmin(status?: string) {
    const q = status ? `?status=${encodeURIComponent(status)}` : "";
    return request<{ professionals: ProfessionalData[] }>(`/admin/professionals/${q}`, {
      headers: adminHeaders(),
    });
  },
  reviewProfessional(id: number, status: "aprovado" | "reprovado", rejectionReason = "") {
    return request<ProfessionalData>("/admin/professionals/", {
      method: "PATCH",
      headers: adminHeaders(),
      body: JSON.stringify({ id, status, rejectionReason }),
    });
  },
  listEscalations(status = "aberta") {
    return request<{ escalations: ChatEscalation[] }>(`/chat/escalations/?status=${status}`, {
      headers: adminHeaders(),
    });
  },
  replyEscalation(id: number, adminReply: string) {
    return request<ChatEscalation>("/chat/escalations/", {
      method: "PATCH",
      headers: adminHeaders(),
      body: JSON.stringify({ id, adminReply }),
    });
  },
};
