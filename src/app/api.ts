export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

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

export interface ProfessionalData {
  id?: number;
  nomeCompleto: string;
  email: string;
  telefone: string;
  cpf?: string;
  registro?: string;
  curriculo?: string;
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

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  saveClient(data: ClientData) {
    return request<ClientData>("/clients/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  registerClient(data: ClientData) {
    return request<ClientData>("/clients/register/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  saveProfessional(data: ProfessionalData) {
    return request<ProfessionalData>("/professionals/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  registerProfessional(data: ProfessionalData) {
    return request<ProfessionalData>("/professionals/register/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async listOrders() {
    const data = await request<{ orders: Order[] }>("/orders/");
    return data.orders;
  },
  createOrder(data: Omit<Order, "id" | "createdAt"> & { client?: ClientData | null }) {
    return request<Order>("/orders/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  updateOrder(orderId: number, data: Partial<Pick<Order, "status" | "professional">>) {
    return request<Order>(`/orders/${orderId}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};
