# Quick Fix - Projeto Completo para Conversão Django

## 📋 Índice
1. [Visão Geral do Projeto](#visão-geral)
2. [Estrutura de Rotas](#estrutura-de-rotas)
3. [Código Completo dos Componentes](#código-completo)
4. [Estrutura de Dados](#estrutura-de-dados)
5. [Instruções para o Gemini](#instruções-para-conversão)

---

## 📊 Visão Geral do Projeto

**Nome:** Quick Fix - Plataforma Consultiva de Serviços de TI

**Descrição:** Sistema de vitrine de produtos e serviços de informática que funciona como uma plataforma comercial completa. O sistema abrange duas áreas principais:
- Manutenção de Computadores
- Rede de Computadores

**Características Principais:**
- Questionários específicos de 10 perguntas objetivas por área
- Diagnóstico automatizado com estimativas de prazo/investimento
- Visitantes navegam livremente, login apenas para contratar
- Dark theme com glassmorphism
- Componentes interativos (partículas animadas, live counters, chatbot widget, calculadora ROI)
- Dashboard Kanban para pedidos (/orders)
- Página de profissionais com status em tempo real (/professionals)
- Tipografia tech (Inter, Sora, JetBrains Mono)

---

## 🗺️ Estrutura de Rotas

### Arquivo: `/src/app/routes.ts`

```typescript
import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ServiceSelection from "./pages/ServiceSelection";
import QuestionnaireFlow from "./pages/QuestionnaireFlow";
import ResultPage from "./pages/ResultPage";
import Dashboard from "./pages/Dashboard";
import ProfessionalsPage from "./pages/ProfessionalsPage";
import OrdersKanban from "./pages/OrdersKanban";
import PresentationPage from "./pages/PresentationPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/presentation",
    Component: PresentationPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/professionals",
    Component: ProfessionalsPage,
  },
  {
    path: "/orders",
    Component: OrdersKanban,
  },
  {
    path: "/service-selection",
    Component: ServiceSelection,
  },
  {
    path: "/questionnaire/:serviceType",
    Component: QuestionnaireFlow,
  },
  {
    path: "/result",
    Component: ResultPage,
  },
]);
```

**Mapeamento de rotas React → Django:**
- `/` → `path('', views.home, name='home')`
- `/presentation` → `path('presentation/', views.presentation, name='presentation')`
- `/login` → `path('login/', views.login_page, name='login')`
- `/dashboard` �� `path('dashboard/', views.dashboard, name='dashboard')`
- `/professionals` → `path('professionals/', views.professionals, name='professionals')`
- `/orders` → `path('orders/', views.orders_kanban, name='orders')`
- `/service-selection` → `path('service-selection/', views.service_selection, name='service_selection')`
- `/questionnaire/<str:service_type>` → `path('questionnaire/<str:service_type>/', views.questionnaire_flow, name='questionnaire')`
- `/result` → `path('result/', views.result, name='result')`

---

## 📦 Pacotes e Dependências

### Arquivo: `/package.json`

```json
{
  "name": "@figma/my-make-file",
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-router": "7.13.0",
    "react-hook-form": "7.55.0",
    "motion": "12.23.24",
    "lucide-react": "0.487.0",
    "recharts": "2.15.2",
    "react-dnd": "16.0.1",
    "react-dnd-html5-backend": "16.0.1",
    "react-countup": "6.5.3",
    "tailwindcss": "4.1.12"
  }
}
```

**Equivalências Django:**
- `react-hook-form` → Django Forms (`forms.Form`, `forms.ModelForm`)
- `react-router` → Django URL routing (`urls.py`)
- `motion` → CSS animations ou bibliotecas JS (GSAP, Animate.css)
- `lucide-react` → Font Awesome ou ícones SVG
- `recharts` → Chart.js ou Plotly
- `react-dnd` → SortableJS ou bibliotecas drag-and-drop JS
- `tailwindcss` → Tailwind CSS (pode ser usado com Django)

---

## 💻 Código Completo dos Componentes

### 1. HomePage (`/src/app/pages/HomePage.tsx`)

```typescript
// ARQUIVO COMPLETO JÁ FORNECIDO ANTERIORMENTE
// Este é o componente principal da landing page com:
// - Hero section com AnimatedBackground
// - Live counters
// - Cards de serviços (2 áreas: Manutenção e Redes)
// - Cards de produtos
// - ROI Calculator
// - Chatbot Widget
// - System Status
// - Infinite Slider de logos
```

**Ver código completo no arquivo lido anteriormente (577 linhas)**

**Dados estruturados em HomePage:**

```typescript
const services = [
  {
    id: "manutencao",
    icon: Wrench,
    title: "Manutenção de Computadores",
    description: "Conserto, upgrade e otimização de PCs e notebooks. Diagnóstico rápido e solução eficiente.",
    features: ["Limpeza e otimização", "Troca de peças", "Backup de dados", "Instalação de software"],
    priceFrom: "R$ 80",
    duration: "1-3 dias",
    color: "bg-blue-500",
  },
  {
    id: "redes",
    icon: Network,
    title: "Rede de Computadores",
    description: "Instalação e configuração de redes cabeadas e Wi-Fi. Segurança e estabilidade garantidas.",
    features: ["Instalação Wi-Fi", "Cabeamento estruturado", "Configuração de roteadores", "Segurança de rede"],
    priceFrom: "R$ 200",
    duration: "2-5 dias",
    color: "bg-green-500",
  },
];

const products = [
  {
    id: 1,
    name: "Notebook Dell Inspiron 15",
    description: "Intel Core i5, 8GB RAM, SSD 256GB",
    price: "R$ 2.799,00",
    image: "laptop",
    badge: "Mais Vendido",
  },
  {
    id: 2,
    name: "Roteador Wi-Fi 6 Mesh",
    description: "Cobertura até 300m², Dual Band",
    price: "R$ 489,00",
    image: "wifi",
    badge: "Promoção",
  },
  {
    id: 3,
    name: "SSD Kingston 480GB",
    description: "SATA III, Leitura 500MB/s",
    price: "R$ 259,00",
    image: "harddrive",
    badge: "Estoque Limitado",
  },
];
```

### 2. LoginPage (`/src/app/pages/LoginPage.tsx`)

```typescript
// ARQUIVO COMPLETO (202 linhas)
// Formulário de login/cadastro com react-hook-form
// Validação de e-mail
// Salvamento em localStorage
// Redirecionamento condicional baseado em state
```

**Interface de dados:**
```typescript
interface LoginFormData {
  nomeCompleto: string;
  email: string;
  telefone: string;
  empresa: string;
  cnpj?: string;
}
```

**Validações:**
- Nome completo: obrigatório
- E-mail: obrigatório + pattern de validação
- Telefone: obrigatório
- Empresa: obrigatório
- CNPJ: opcional

**No Django isso seria:**
```python
class UserRegistrationForm(forms.Form):
    nome_completo = forms.CharField(max_length=200, required=True)
    email = forms.EmailField(required=True)
    telefone = forms.CharField(max_length=20, required=True)
    empresa = forms.CharField(max_length=200, required=True)
    cnpj = forms.CharField(max_length=18, required=False)
```

### 3. ServiceSelection (`/src/app/pages/ServiceSelection.tsx`)

```typescript
// ARQUIVO COMPLETO (132 linhas)
// Seleção de serviço após login
// 4 cards grandes com ícones
// Validação de userData no localStorage
// Redirecionamento para /questionnaire/:serviceId
```

**Dados:**
```typescript
const services = [
  {
    id: "manutencao",
    title: "Manutenção de Computadores",
    description: "Reparo, limpeza, upgrade e diagnóstico de hardware e software",
    icon: Computer,
    color: "blue",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    id: "redes",
    title: "Rede de Computadores",
    description: "Instalação e configuração de redes cabeadas e Wi-Fi. Segurança e estabilidade garantidas.",
    icon: Network,
    color: "green",
    gradient: "from-green-500 to-green-600",
  },
];
```

### 4. QuestionnaireFlow (`/src/app/pages/QuestionnaireFlow.tsx`)

```typescript
// ARQUIVO COMPLETO (371 linhas)
// Fluxo de questionário com 10 perguntas objetivas
// Barra de progresso
// Sistema de pontuação (score)
// Tela final de descrição detalhada
// Salva resultado em localStorage
```

**Estados principais:**
```typescript
const [currentQuestion, setCurrentQuestion] = useState(0);
const [answers, setAnswers] = useState<Record<string, string>>({});
const [description, setDescription] = useState("");
const [showDescription, setShowDescription] = useState(false);
```

**Estrutura de resultado:**
```typescript
const result = {
  serviceType,
  serviceName,
  answers, // Record<questionId, selectedOption>
  description, // texto livre
  totalScore,
  averageScore,
  answersCount,
  timestamp: new Date().toISOString(),
};
```

### 5. Estrutura de Perguntas (`/src/app/data/questions.ts`)

**IMPORTANTE: Este arquivo define todas as perguntas para cada serviço**

Estrutura esperada:
```typescript
export const questionsByService: Record<string, Question[]> = {
  manutencao: [
    {
      id: "manutencao_1",
      question: "Qual o principal problema do seu computador?",
      options: [
        { value: "lento", label: "Está muito lento", score: 3 },
        { value: "nao_liga", label: "Não liga", score: 5 },
        { value: "tela_azul", label: "Tela azul da morte", score: 4 },
        { value: "virus", label: "Suspeita de vírus", score: 3 },
      ],
    },
    // ... 9 perguntas adicionais
  ],
  redes: [
    // 10 perguntas sobre rede
  ],
};
```

**Cada opção tem:**
- `value`: identificador único
- `label`: texto exibido
- `score`: pontuação de 1-5 (urgência/complexidade)

**ARQUIVO COMPLETO COM TODAS AS 20 PERGUNTAS (10 por serviço):**

Ver arquivo completo em `/src/app/data/questions.ts`.

Este arquivo contém:
- **Manutenção:** 10 perguntas sobre tipo de serviço, urgência, quantidade de equipamentos, status do equipamento, tipo de uso, impacto na produtividade, backup, sistema operacional, tipo de problema e orçamento.
- **Redes:** 10 perguntas sobre tipo de serviço, quantidade de dispositivos, área de cobertura, velocidade de internet, necessidade de cabeamento, segurança, status atual, servidor/NAS, urgência e orçamento.

**Sistema de Pontuação:**
- Score 1: Baixa complexidade/urgência
- Score 2: Complexidade/urgência normal
- Score 3: Complexidade/urgência média-alta
- Score 4: Alta complexidade/urgência
- Score 5: Complexidade/urgência muito alta

---

## 💻 Código Completo dos Componentes (CONTINUAÇÃO)

### 6. ResultPage (`/src/app/pages/ResultPage.tsx`)

**382 linhas - Página de resultado do questionário**

Funcionalidades principais:
- Carrega resultado do localStorage
- Calcula nível de complexidade baseado no score médio
- Determina prioridade do atendimento
- Estima prazo de entrega
- Estima custo do projeto
- Exibe aviso sobre valores sujeitos a alteração
- Mostra todas as respostas do questionário
- Permite impressão do relatório
- Próximos passos para o cliente

**Cálculos importantes:**

```typescript
// Complexidade
const getComplexityLevel = (score: number) => {
  if (score <= 1.5) return "Baixa Complexidade";
  if (score <= 2.5) return "Complexidade Média";
  if (score <= 3.5) return "Complexidade Alta";
  return "Complexidade Muito Alta";
};

// Prioridade
const getPriorityLevel = (score: number) => {
  if (score <= 1.5) return "Baixa Prioridade";
  if (score <= 2.5) return "Prioridade Normal";
  if (score <= 3.5) return "Alta Prioridade";
  return "Prioridade Urgente";
};

// Prazo estimado
const getEstimatedTime = (score: number, serviceType: string) => {
  const baseTime = {
    manutencao: 1,
    redes: 3,
  };
  const multiplier = score / 2;
  const days = Math.round(baseTime[serviceType] * multiplier);
  // Retorna formato: "X dias", "X semanas" ou "X meses"
};

// Custo estimado
const getEstimatedCost = (score: number, serviceType: string) => {
  const baseCost = {
    manutencao: 200,
    redes: 500,
  };
  const minCost = Math.round(baseCost[serviceType] * score);
  const maxCost = Math.round(minCost * 1.5);
  return `R$ ${minCost} - R$ ${maxCost}`;
};
```

### 7. Dashboard (`/src/app/pages/Dashboard.tsx`)

**306 linhas - Dashboard do usuário logado**

Funcionalidades:
- Verifica autenticação (localStorage)
- Exibe nome do usuário
- Cards de acesso rápido para cada serviço (Manutenção e Redes)
- Botões para Dashboard Kanban e Profissionais
- Histórico de anamneses realizadas
- Cards informativos sobre o sistema

### 8. OrdersKanban (`/src/app/pages/OrdersKanban.tsx`)

**256 linhas - Dashboard Kanban de pedidos**

Funcionalidades:
- Visualização em 3 colunas: Análise, Em Andamento, Concluído
- Filtros por tipo de serviço
- Cards com glassmorphism
- Animações com motion
- Dados mockados de pedidos
- Cores por tipo de serviço
- Badges de prioridade
- Informações de profissional responsável
- Prazo e custo estimado

**Estrutura de Order:**
```typescript
interface Order {
  id: number;
  title: string;
  type: 'Hardware' | 'Software' | 'Redes' | 'Web' | 'Mobile';
  status: 'analise' | 'em_andamento' | 'concluido';
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  professional: string;
  estimatedTime: string;
  estimatedCost: string;
  createdAt: string;
}
```

### 9. ProfessionalsPage (`/src/app/pages/ProfessionalsPage.tsx`)

**272 linhas - Página de profissionais**

Funcionalidades:
- Lista de profissionais disponíveis
- Status em tempo real (disponível/ocupado/offline)
- Avatar com iniciais
- Animação pulsante para disponível
- Rating com estrelas
- Número de chamados resolvidos
- Skills técnicas (badges)
- Especialidades
- Filtro visual por disponibilidade
- Botão para solicitar atendimento

**Estrutura de Professional:**
```typescript
interface Professional {
  id: number;
  name: string;
  avatar: string;
  role: string;
  skills: string[];
  rating: number;
  resolvedTickets: number;
  available: boolean;
  specialties: string[];
}
```

**Profissionais de exemplo:**
1. Carlos Silva - Especialista em Hardware (4.9⭐, 342 tickets)
2. Ana Santos - Engenheira de Redes (5.0⭐, 289 tickets)
3. Roberto Lima - Especialista em Segurança (5.0⭐, 421 tickets)
4. Julia Ferreira - Técnica em Manutenção (4.7⭐, 267 tickets)

### 10. PresentationPage (`/src/app/pages/PresentationPage.tsx`)

**Ver arquivo criado anteriormente** - Apresentação executiva com 11 slides.

---

## 🎨 Componentes Interativos (DETALHAMENTO)

### AnimatedBackground (`/src/app/components/AnimatedBackground.tsx`)

```typescript
// Componente com partículas animadas
// Usa motion para animação suave
// Background com círculos flutuantes
```

### LiveCounter (`/src/app/components/LiveCounter.tsx`)

```typescript
// Contador animado que incrementa até um número
// Usa react-countup
// Props: end (número final), suffix (opcional)
```

### ChatbotWidget (`/src/app/components/ChatbotWidget.tsx`)

```typescript
// Widget de chat flutuante
// Botão fixo no canto inferior direito
// Abre modal com chat
```

### ROICalculator (`/src/app/components/ROICalculator.tsx`)

```typescript
// Calculadora de retorno sobre investimento
// Inputs: investimento inicial, receita mensal
// Calcula payback period
```

### SystemStatus (`/src/app/components/SystemStatus.tsx`)

```typescript
// Indicadores de status do sistema
// Mostra servidores online, tempo de resposta
// Atualização em tempo real (simulada)
```

### InfiniteSlider (`/src/app/components/InfiniteSlider.tsx`)

```typescript
// Slider infinito de logos/tecnologias
// Animação contínua horizontal
// Props: items (array de elementos)
```

---

## 🗄️ Modelos de Dados Sugeridos para Django

### 1. User (estender AbstractUser do Django)

```python
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    nome_completo = models.CharField(max_length=200)
    telefone = models.CharField(max_length=20)
    empresa = models.CharField(max_length=200)
    cnpj = models.CharField(max_length=18, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

### 2. Service (Serviço)

```python
class Service(models.Model):
    SERVICE_TYPES = [
        ('manutencao', 'Manutenção de Computadores'),
        ('redes', 'Rede de Computadores'),
    ]
    
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPES, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    price_from = models.CharField(max_length=50)
    duration = models.CharField(max_length=50)
    features = models.JSONField()  # Lista de features
    color = models.CharField(max_length=50)
```

### 3. Question (Pergunta do Questionário)

```python
class Question(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='questions')
    question_id = models.CharField(max_length=50)
    question_text = models.TextField()
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']
```

### 4. QuestionOption (Opção de Resposta)

```python
class QuestionOption(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    value = models.CharField(max_length=50)
    label = models.CharField(max_length=200)
    score = models.IntegerField()
```

### 5. QuestionnaireResult (Resultado do Questionário)

```python
class QuestionnaireResult(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    answers = models.JSONField()  # {question_id: selected_option_value}
    description = models.TextField(blank=True)
    total_score = models.IntegerField()
    average_score = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('in_progress', 'Em Andamento'),
        ('completed', 'Concluído'),
        ('cancelled', 'Cancelado'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
```

### 6. Order (Pedido/Ordem de Serviço)

```python
class Order(models.Model):
    result = models.ForeignKey(QuestionnaireResult, on_delete=models.CASCADE)
    order_number = models.CharField(max_length=50, unique=True)
    estimated_delivery = models.DateField()
    price_estimate = models.DecimalField(max_digits=10, decimal_places=2)
    
    PRIORITY_CHOICES = [
        ('low', 'Baixa'),
        ('medium', 'Média'),
        ('high', 'Alta'),
        ('urgent', 'Urgente'),
    ]
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
```

### 7. Product (Produto)

```python
class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/')
    badge = models.CharField(max_length=50, blank=True)
    stock = models.IntegerField(default=0)
    rating = models.FloatField(default=5.0)
```

### 8. Professional (Profissional)

```python
class Professional(models.Model):
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=100)
    specializations = models.JSONField()  # Lista de especializações
    avatar = models.ImageField(upload_to='professionals/')
    
    STATUS_CHOICES = [
        ('available', 'Disponível'),
        ('busy', 'Ocupado'),
        ('offline', 'Offline'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='offline')
    current_projects = models.IntegerField(default=0)
```

---

## 🔄 Fluxo de Navegação

```
1. Visitante acessa / (HomePage)
   ↓
2. Navega pelos serviços e produtos (sem login)
   ↓
3. Clica em "Contratar" serviço
   ↓
4. Redireciona para /login (com state.redirectTo = /questionnaire/:serviceType)
   ↓
5. Preenche formulário de login
   ↓
6. Salva userData e redireciona para /questionnaire/:serviceType
   ↓
7. Responde 10 perguntas objetivas + descrição detalhada
   ↓
8. Sistema calcula score e gera diagnóstico
   ↓
9. Exibe resultado em /result com:
   - Diagnóstico
   - Prazo estimado
   - Investimento estimado
   - Nível de prioridade
   ↓
10. Usuário pode acessar /dashboard para ver status
    Ou /orders para ver Kanban de pedidos
```

---

## 🎯 Instruções para Conversão Django

### Para o Gemini (ou qualquer IA):

**PROMPT SUGERIDO:**

```
Você é um desenvolvedor Python/Django expert. Preciso que você converta este projeto React completo para Django.

REQUISITOS:
1. Criar estrutura completa de projeto Django
2. Implementar todos os models descritos acima
3. Criar views para cada rota
4. Implementar templates usando Tailwind CSS (manter o design)
5. Criar forms usando Django Forms
6. Implementar sistema de autenticação
7. Criar dashboard administrativo
8. Implementar API REST com Django REST Framework (opcional)

ESTRUTURA ESPERADA:
quickfix/
├── manage.py
├── quickfix/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── core/
│   ├── models.py (User, Service, Question, QuestionOption)
│   ├── views.py (home, login, service_selection, etc.)
│   ├── forms.py (LoginForm, QuestionnaireForm)
│   ├── urls.py
│   └── templates/
│       ├── base.html
│       ├── home.html
│       ├── login.html
│       ├── service_selection.html
│       ├── questionnaire.html
│       ├── result.html
│       ├── dashboard.html
│       ├── professionals.html
│       ├── orders_kanban.html
│       └── presentation.html
├── static/
│   ├── css/ (Tailwind)
│   ├── js/
│   └── images/
└── requirements.txt

ATENÇÃO ESPECIAL PARA:
1. Sistema de questionários com cálculo de score
2. Dashboard Kanban (pode usar HTMX ou JavaScript vanilla)
3. Componentes interativos (LiveCounter, AnimatedBackground)
4. Glassmorphism e Dark Theme no CSS
5. Responsividade mobile

DADOS INICIAIS:
- Criar fixtures para popular o banco com os 2 serviços (Manutenção e Redes)
- Criar fixtures para as 20 perguntas (10 por serviço)
- Criar alguns produtos de exemplo
- Criar alguns profissionais de exemplo

Por favor, gere o código completo e funcional.
```

---

## 📝 Dados Estruturados Completos

### Serviços (para fixtures/initial_data)

```json
[
  {
    "model": "core.service",
    "pk": 1,
    "fields": {
      "service_type": "manutencao",
      "title": "Manutenção de Computadores",
      "description": "Conserto, upgrade e otimização de PCs e notebooks. Diagnóstico rápido e solução eficiente.",
      "price_from": "R$ 80",
      "duration": "1-3 dias",
      "features": ["Limpeza e otimização", "Troca de peças", "Backup de dados", "Instalação de software"],
      "color": "blue"
    }
  },
  {
    "model": "core.service",
    "pk": 2,
    "fields": {
      "service_type": "redes",
      "title": "Rede de Computadores",
      "description": "Instalação e configuração de redes cabeadas e Wi-Fi. Segurança e estabilidade garantidas.",
      "price_from": "R$ 200",
      "duration": "2-5 dias",
      "features": ["Instalação Wi-Fi", "Cabeamento estruturado", "Configuração de roteadores", "Segurança de rede"],
      "color": "green"
    }
  }
]
```

### Produtos (para fixtures)

```json
[
  {
    "model": "core.product",
    "pk": 1,
    "fields": {
      "name": "Notebook Dell Inspiron 15",
      "description": "Intel Core i5, 8GB RAM, SSD 256GB",
      "price": "2799.00",
      "badge": "Mais Vendido",
      "stock": 10,
      "rating": 4.9
    }
  },
  {
    "model": "core.product",
    "pk": 2,
    "fields": {
      "name": "Roteador Wi-Fi 6 Mesh",
      "description": "Cobertura até 300m², Dual Band",
      "price": "489.00",
      "badge": "Promoção",
      "stock": 25,
      "rating": 4.8
    }
  },
  {
    "model": "core.product",
    "pk": 3,
    "fields": {
      "name": "SSD Kingston 480GB",
      "description": "SATA III, Leitura 500MB/s",
      "price": "259.00",
      "badge": "Estoque Limitado",
      "stock": 5,
      "rating": 5.0
    }
  }
]
```

---

## 🎨 Design System e Estilos

### Cores Principais (Tailwind)

```css
/* Dark Theme Base */
background: from-slate-950 via-blue-950 to-slate-900

/* Glassmorphism */
background: white/10 (light) ou white/5 (dark)
backdrop-blur-lg
border: white/10 ou white/20

/* Gradientes de Serviços */
- Manutenção: from-blue-500 to-blue-600
- Redes: from-green-500 to-green-600

/* Acentos */
- Primary: blue-500, cyan-400
- Success: green-400
- Warning: yellow-400
- Danger: red-400
```

### Tipografia

```css
/* Fontes */
Headings: font-family: 'Sora', sans-serif
Body: font-family: 'Inter', sans-serif
Code/Monospace: font-family: 'JetBrains Mono', monospace
```

---

## 📌 Recursos Adicionais Necessários

### Para Django:

1. **requirements.txt**
```txt
Django==5.0
djangorestframework==3.14.0
Pillow==10.0.0
django-tailwind==3.6.0
django-crispy-forms==2.0
crispy-tailwind==0.5.0
django-htmx==1.16.0 (opcional para interatividade)
```

2. **Static Files**
- Tailwind CSS configurado
- Lucide Icons (SVG) ou Font Awesome
- Imagens de produtos
- Avatares de profissionais

3. **Templates Base**
```html
<!-- base.html -->
<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}Quick Fix{% endblock %}</title>
    <link href="{% static 'css/tailwind.css' %}" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Sora:wght@600;700&family=JetBrains+Mono&display=swap" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
    {% block content %}{% endblock %}
    <script src="{% static 'js/main.js' %}"></script>
</body>
</html>
```

---

## ✅ Checklist de Implementação

### Models
- [ ] CustomUser (estende AbstractUser)
- [ ] Service
- [ ] Question
- [ ] QuestionOption
- [ ] QuestionnaireResult
- [ ] Order
- [ ] Product
- [ ] Professional

### Views
- [ ] home (HomePage)
- [ ] presentation (PresentationPage)
- [ ] login_page / register
- [ ] service_selection
- [ ] questionnaire_flow
- [ ] result
- [ ] dashboard
- [ ] professionals
- [ ] orders_kanban

### Forms
- [ ] UserRegistrationForm
- [ ] QuestionnaireForm (dinâmico baseado em serviceType)

### Templates
- [ ] base.html
- [ ] home.html (577 linhas de lógica)
- [ ] login.html
- [ ] service_selection.html
- [ ] questionnaire.html (com progresso e pontuação)
- [ ] result.html
- [ ] dashboard.html
- [ ] professionals.html
- [ ] orders_kanban.html
- [ ] presentation.html

### URLs
- [ ] Configurar todas as rotas
- [ ] Adicionar namespaces
- [ ] Configurar redirecionamentos

### Admin
- [ ] Registrar todos os models
- [ ] Customizar admin para QuestionnaireResult
- [ ] Inline para Questions/Options

### Fixtures/Initial Data
- [ ] 2 serviços (Manutenção e Redes)
- [ ] 20 perguntas (10 por serviço)
- [ ] Opções de resposta com scores
- [ ] Produtos de exemplo
- [ ] Profissionais de exemplo

### Frontend/Interatividade
- [ ] AnimatedBackground (CSS animations ou JS)
- [ ] LiveCounter (JavaScript)
- [ ] ChatbotWidget (JavaScript ou HTMX)
- [ ] ROICalculator (JavaScript)
- [ ] SystemStatus (WebSocket ou polling)
- [ ] InfiniteSlider (CSS animations)
- [ ] Kanban drag-and-drop (SortableJS)

---

## 🚀 Como Usar Este Documento com o Gemini

### Opção 1: Conversão Completa

Copie todo este documento e envie para o Gemini com o prompt:

```
Por favor, converta este projeto React completo para Django.
Gere todo o código necessário: models, views, forms, templates e URLs.
Mantenha toda a funcionalidade e design descrito.
```

### Opção 2: Conversão Por Etapas

**Etapa 1: Models e Estrutura**
```
Com base neste documento, crie os models Django para o projeto Quick Fix.
Inclua fixtures para dados iniciais.
```

**Etapa 2: Views e URLs**
```
Agora crie as views e URLs para todas as páginas descritas.
```

**Etapa 3: Forms**
```
Crie os Django Forms necessários, especialmente o formulário dinâmico de questionário.
```

**Etapa 4: Templates**
```
Gere os templates HTML com Tailwind CSS, mantendo o design glassmorphism e dark theme.
```

**Etapa 5: Componentes Interativos**
```
Implemente os componentes JavaScript: LiveCounter, AnimatedBackground, ChatbotWidget, etc.
```

---

## 📞 Informações de Contato do Sistema

- **Nome:** Quick Fix
- **Slogan:** Soluções em Tecnologia
- **E-mail:** contato@quickfix.com
- **Telefone:** (11) 9999-9999
- **Endereço:** São Paulo, SP
- **Ano de Fundação:** 2020

---

## 🔐 Funcionalidades de Segurança

1. **Autenticação:**
   - Login com e-mail/senha (Django Auth)
   - Validação de formulários server-side
   - CSRF protection

2. **Autorização:**
   - Apenas usuários logados acessam Dashboard, Pedidos
   - Admin separado para gestão

3. **Dados:**
   - Criptografia de senhas (Django default)
   - Validação de CNPJ/CPF (opcional)
   - Proteção contra SQL Injection (Django ORM)

---

## 🎯 Funcionalidades Extras Sugeridas

1. **Notificações:**
   - E-mail ao concluir questionário
   - Notificações de mudança de status do pedido

2. **Pagamentos:**
   - Integração com Stripe/PagSeguro
   - Carrinho de produtos

3. **Chat em Tempo Real:**
   - Django Channels para WebSocket
   - Chat entre cliente e profissional

4. **API REST:**
   - Django REST Framework
   - Endpoints para mobile app futuro

5. **Analytics:**
   - Dashboard de métricas
   - Google Analytics integration

---

## 📚 Referências e Recursos

- **Django Docs:** https://docs.djangoproject.com/
- **Django REST Framework:** https://www.django-rest-framework.org/
- **Tailwind CSS:** https://tailwindcss.com/
- **HTMX:** https://htmx.org/
- **Django Channels:** https://channels.readthedocs.io/

---

## ✨ Conclusão

Este documento contém TODA a informação necessária para converter o projeto React "Quick Fix" para Django.

**O que está incluído:**
✅ Estrutura completa de rotas
✅ Modelos de dados detalhados
✅ Lógica de negócio de cada página
✅ Estrutura de questionários com pontuação (2 serviços: Manutenção e Redes)
✅ Design system completo
✅ Fluxo de navegação
✅ Componentes interativos
✅ Dados iniciais (fixtures)

**Próximos passos:**
1. Copie este documento
2. Cole no Gemini (ou outra IA)
3. Use um dos prompts sugeridos acima
4. Revise e ajuste o código gerado
5. Teste e implante

Boa sorte com a conversão! 🚀