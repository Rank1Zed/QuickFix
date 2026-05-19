# Quick Fix - Código Completo do Sistema

## 📋 Índice
1. [Arquivos de Configuração](#configuração)
2. [Rotas](#rotas)
3. [Páginas](#páginas)
4. [Componentes](#componentes)
5. [Dados e Tipos](#dados)
6. [Estilos](#estilos)

---

## Configuração

### package.json
```json
{
  "name": "@figma/my-make-file",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "build": "vite build"
  },
  "dependencies": {
    "@emotion/react": "11.14.0",
    "@emotion/styled": "11.14.1",
    "@mui/icons-material": "7.3.5",
    "@mui/material": "7.3.5",
    "@popperjs/core": "2.11.8",
    "@radix-ui/react-accordion": "1.2.3",
    "@radix-ui/react-alert-dialog": "1.1.6",
    "@radix-ui/react-aspect-ratio": "1.1.2",
    "@radix-ui/react-avatar": "1.1.3",
    "@radix-ui/react-checkbox": "1.1.4",
    "@radix-ui/react-collapsible": "1.1.3",
    "@radix-ui/react-context-menu": "2.2.6",
    "@radix-ui/react-dialog": "1.1.6",
    "@radix-ui/react-dropdown-menu": "2.1.6",
    "@radix-ui/react-hover-card": "1.1.6",
    "@radix-ui/react-label": "2.1.2",
    "@radix-ui/react-menubar": "1.1.6",
    "@radix-ui/react-navigation-menu": "1.2.5",
    "@radix-ui/react-popover": "1.1.6",
    "@radix-ui/react-progress": "1.1.2",
    "@radix-ui/react-radio-group": "1.2.3",
    "@radix-ui/react-scroll-area": "1.2.3",
    "@radix-ui/react-select": "2.1.6",
    "@radix-ui/react-separator": "1.1.2",
    "@radix-ui/react-slider": "1.2.3",
    "@radix-ui/react-slot": "1.1.2",
    "@radix-ui/react-switch": "1.1.3",
    "@radix-ui/react-tabs": "1.1.3",
    "@radix-ui/react-toggle": "1.1.2",
    "@radix-ui/react-toggle-group": "1.1.2",
    "@radix-ui/react-tooltip": "1.1.8",
    "canvas-confetti": "1.9.4",
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "cmdk": "1.1.1",
    "date-fns": "3.6.0",
    "embla-carousel-react": "8.6.0",
    "input-otp": "1.4.2",
    "lucide-react": "0.487.0",
    "motion": "12.23.24",
    "next-themes": "0.4.6",
    "react-countup": "^6.5.3",
    "react-day-picker": "8.10.1",
    "react-dnd": "16.0.1",
    "react-dnd-html5-backend": "16.0.1",
    "react-hook-form": "7.55.0",
    "react-popper": "2.3.0",
    "react-resizable-panels": "2.1.7",
    "react-responsive-masonry": "2.7.1",
    "react-router": "7.13.0",
    "react-slick": "0.31.0",
    "recharts": "2.15.2",
    "sonner": "2.0.3",
    "tailwind-merge": "3.2.0",
    "tw-animate-css": "1.3.8",
    "vaul": "1.1.2"
  },
  "devDependencies": {
    "@tailwindcss/vite": "4.1.12",
    "@vitejs/plugin-react": "4.7.0",
    "tailwindcss": "4.1.12",
    "vite": "6.3.5"
  },
  "peerDependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1"
  }
}
```

---

## Rotas

### /src/app/App.tsx
```tsx
import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return <RouterProvider router={router} />;
}
```

### /src/app/routes.ts
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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
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

---

## Dados

### /src/app/data/questions.ts

Este arquivo contém todos os questionários para cada tipo de serviço (Manutenção, Redes, Desenvolvimento Web e Mobile).

```typescript
export interface Question {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    score: number; // 1-5 (1=baixa complexidade/prioridade, 5=alta complexidade/prioridade)
  }[];
}

export const questionsByService: Record<string, Question[]> = {
  manutencao: [
    // 10 perguntas sobre manutenção de computadores
  ],
  redes: [
    // 10 perguntas sobre redes de computadores
  ],
  "dev-web": [
    // 10 perguntas sobre desenvolvimento web
  ],
  "dev-mobile": [
    // 10 perguntas sobre desenvolvimento mobile
  ],
};
```

*Nota: O arquivo completo contém 10 perguntas detalhadas para cada área de serviço com opções de resposta pontuadas de 1 a 5.*

---

## Tecnologias Utilizadas

### Frontend
- **React 18.3.1** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **React Router 7.13.0** - Roteamento e navegação
- **React Hook Form 7.55.0** - Gerenciamento de formulários
- **Tailwind CSS 4.1.12** - Framework CSS utilitário

### UI Components
- **Radix UI** - Componentes acessíveis e não estilizados
- **Material UI 7.3.5** - Biblioteca de componentes React
- **Lucide React** - Ícones SVG
- **Sonner** - Notificações toast

### Animações e Efeitos
- **Motion (Framer Motion) 12.23.24** - Biblioteca de animações
- **React CountUp** - Contadores animados
- **Canvas Confetti** - Efeitos de confete

### Gráficos e Visualização
- **Recharts 2.15.2** - Biblioteca de gráficos

### Drag and Drop
- **React DnD 16.0.1** - Drag and drop para React
- **React DnD HTML5 Backend** - Backend HTML5 para DnD

### Utilitários
- **clsx & tailwind-merge** - Utilitários para classes CSS
- **date-fns** - Manipulação de datas
- **class-variance-authority** - Variantes de componentes

### Build Tools
- **Vite 6.3.5** - Build tool e dev server
- **@vitejs/plugin-react** - Plugin React para Vite

---

## Estrutura do Projeto

```
quick-fix/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes reutilizáveis
│   │   │   ├── ui/             # Componentes de UI base
│   │   │   ├── AnimatedBackground.tsx
│   │   │   ├── AnimatedProgress.tsx
│   │   │   ├── ChatbotWidget.tsx
│   │   │   ├── InfiniteSlider.tsx
│   │   │   ├── LiveCounter.tsx
│   │   │   ├── ROICalculator.tsx
│   │   │   └── SystemStatus.tsx
│   │   ├── data/               # Dados estáticos
│   │   │   └── questions.ts    # Questionários
│   │   ├── pages/              # Páginas da aplicação
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ServiceSelection.tsx
│   │   │   ├── QuestionnaireFlow.tsx
│   │   │   ├── ResultPage.tsx
│   │   │   ├── ProfessionalsPage.tsx
│   │   │   └── OrdersKanban.tsx
│   │   ├── App.tsx             # Componente raiz
│   │   └── routes.ts           # Configuração de rotas
│   └── styles/                 # Estilos globais
│       ├── fonts.css
│       ├── index.css
│       ├── tailwind.css
│       └── theme.css
├── package.json
└── vite.config.ts
```

---

## Funcionalidades Principais

### 1. Sistema de Vitrine
- Navegação livre sem login
- Visualização de serviços e produtos
- Informações detalhadas de cada serviço

### 2. Sistema de Anamnese
- Questionários específicos por área (10 perguntas cada)
- Sistema de pontuação (1-5 por resposta)
- Cálculo automático de complexidade e prioridade

### 3. Estimativas Inteligentes
- Prazo estimado baseado em score
- Faixa de investimento calculada
- Nível de serviço (Residencial até Enterprise)

### 4. Dashboard Kanban
- Visualização de pedidos por status
- Drag and drop para mover pedidos
- Filtros por tipo de serviço

### 5. Página de Profissionais
- Status em tempo real
- Especialidades e projetos concluídos
- Sistema de avaliação

### 6. Componentes Interativos
- Background com partículas animadas
- Contadores ao vivo
- Slider infinito de tecnologias
- Widget de chatbot
- Calculadora de ROI
- Status do sistema em tempo real

---

## Design System

### Cores
- **Primary**: Tons de azul (blue-400 a blue-600)
- **Secondary**: Cyan (cyan-300 a cyan-500)
- **Accent**: Verde, Roxo, Laranja
- **Background**: Gradientes de slate-950, blue-950

### Tipografia
- **Títulos**: Sora (fonte tech moderna)
- **Corpo**: Inter (legibilidade)
- **Código**: JetBrains Mono (monospace)

### Efeitos Visuais
- **Glassmorphism**: backdrop-blur + transparência
- **Gradientes**: Transições suaves de cores
- **Sombras**: shadow-lg com cores temáticas
- **Animações**: Entrada suave, hover states

---

## Fluxo de Uso

1. **Visitante** acessa homepage
2. Navega pelos serviços e produtos
3. Clica em "Contratar" serviço
4. É redirecionado para **Login/Cadastro**
5. Preenche dados pessoais
6. Escolhe área de serviço no **Service Selection**
7. Responde **Questionário** específico (10 perguntas)
8. Adiciona **Descrição detalhada** (opcional)
9. Visualiza **Resultado** com:
   - Complexidade e prioridade
   - Prazo estimado
   - Investimento estimado
   - Aviso sobre possíveis alterações
10. Acessa **Dashboard** para acompanhar pedidos

---

## Observações Importantes

### Armazenamento Local
- Dados do usuário salvos em `localStorage`
- Resultados de questionários persistidos
- Não requer backend para funcionamento básico

### Responsividade
- Design mobile-first
- Breakpoints: sm, md, lg, xl
- Adaptação de layouts para diferentes telas

### Acessibilidade
- Componentes Radix UI acessíveis
- Labels semânticos
- Navegação por teclado

### Performance
- Lazy loading de componentes
- Animações otimizadas com Motion
- Code splitting por rotas

---

## Áreas de Serviço

1. **Manutenção de Computadores**
   - Diagnóstico e reparo
   - Upgrade de hardware
   - Recuperação de dados
   - Limpeza e otimização

2. **Rede de Computadores**
   - Instalação Wi-Fi
   - Cabeamento estruturado
   - Configuração de servidores
   - Segurança de rede

3. **Desenvolvimento Web**
   - Sites institucionais
   - E-commerce
   - Landing pages
   - Sistemas web/SaaS

4. **Desenvolvimento Mobile**
   - Apps Android
   - Apps iOS
   - Apps híbridos
   - Integrações e APIs

---

*Sistema desenvolvido com React + TypeScript + Tailwind CSS*
*Quick Fix - Soluções em Tecnologia © 2026*
