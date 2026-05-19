# 📦 Quick Fix - Todos os Códigos do Sistema

## 📚 Índice Completo
1. [Configuração do Projeto](#1-configuração-do-projeto)
2. [Estrutura de Rotas](#2-estrutura-de-rotas)
3. [Estilos (CSS)](#3-estilos-css)
4. [Dados e Tipos](#4-dados-e-tipos)
5. [Páginas Principais](#5-páginas-principais)
6. [Componentes Customizados](#6-componentes-customizados)
7. [Componentes de UI](#7-componentes-de-ui)

---

## 1. Configuração do Projeto

### 📄 package.json
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
    "react-countup": "6.5.3",
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

## 2. Estrutura de Rotas

### 📄 /src/app/App.tsx
```tsx
import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return <RouterProvider router={router} />;
}
```

### 📄 /src/app/routes.ts
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

## 3. Estilos (CSS)

### 📄 /src/styles/fonts.css
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
```

### 📄 /src/styles/tailwind.css
```css
@import 'tailwindcss' source(none);
@source '../**/*.{js,ts,jsx,tsx}';

@import 'tw-animate-css';
```

### 📄 /src/styles/theme.css
```css
@custom-variant dark (&:is(.dark *));

:root {
  --font-size: 16px;
  --font-family-base: 'Inter', system-ui, -apple-system, sans-serif;
  --font-family-heading: 'Sora', system-ui, -apple-system, sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
  --card: #ffffff;
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: #2563eb;
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.95 0.0058 264.53);
  --secondary-foreground: #030213;
  --muted: #ececf0;
  --muted-foreground: #717182;
  --accent: #e9ebef;
  --accent-foreground: #030213;
  --destructive: #d4183d;
  --destructive-foreground: #ffffff;
  --border: rgba(0, 0, 0, 0.1);
  --input: transparent;
  --input-background: #f3f3f5;
  --switch-background: #cbced4;
  --font-weight-medium: 500;
  --font-weight-normal: 400;
  --ring: oklch(0.708 0 0);
  --radius: 0.625rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --border: oklch(0.269 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
    font-family: var(--font-family-base);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-family-heading);
  }

  code, pre, .font-mono {
    font-family: var(--font-family-mono);
  }
}
```

---

## 4. Dados e Tipos

### 📄 /src/app/data/questions.ts

**Estrutura das Perguntas:**
- 4 áreas de serviço: Manutenção, Redes, Desenvolvimento Web, Desenvolvimento Mobile
- 10 perguntas por área
- Sistema de pontuação de 1 a 5 por resposta

```typescript
export interface Question {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    score: number; // 1-5 (1=baixa complexidade, 5=alta complexidade)
  }[];
}

export const questionsByService: Record<string, Question[]> = {
  manutencao: [
    // Exemplo de pergunta
    {
      id: "q1",
      question: "Qual é o tipo de serviço que você precisa?",
      options: [
        { value: "limpeza", label: "Limpeza e manutenção preventiva", score: 1 },
        { value: "diagnostico", label: "Diagnóstico de problemas", score: 2 },
        { value: "reparo", label: "Reparo de componentes", score: 3 },
        { value: "upgrade", label: "Upgrade de hardware", score: 3 },
        { value: "recuperacao", label: "Recuperação de dados", score: 5 },
      ],
    },
    // ... mais 9 perguntas
  ],
  redes: [
    // ... 10 perguntas sobre redes
  ],
  "dev-web": [
    // ... 10 perguntas sobre desenvolvimento web
  ],
  "dev-mobile": [
    // ... 10 perguntas sobre desenvolvimento mobile
  ],
};
```

**Temas das Perguntas por Área:**

**Manutenção de Computadores:**
1. Tipo de serviço necessário
2. Nível de urgência
3. Quantidade de equipamentos
4. Status do equipamento (liga ou não)
5. Tipo de uso
6. Impacto na produtividade
7. Status do backup
8. Sistema operacional
9. Tipo de problema principal
10. Orçamento disponível

**Rede de Computadores:**
1. Tipo de serviço de rede
2. Quantidade de dispositivos
3. Tamanho da área
4. Velocidade da internet
5. Necessidade de rede cabeada
6. Nível de segurança
7. Status atual da rede
8. Necessidade de servidor/NAS
9. Urgência do serviço
10. Orçamento estimado

**Desenvolvimento Web:**
1. Tipo de website
2. Status do design
3. Quantidade de páginas
4. Funcionalidades necessárias
5. Painel administrativo
6. E-commerce
7. Prazo desejado
8. Conteúdo pronto
9. SEO e otimização
10. Orçamento estimado

**Desenvolvimento Mobile:**
1. Tipo de aplicativo
2. Plataformas (Android/iOS)
3. Modo offline
4. Sistema de login
5. Funcionalidades principais
6. Painel web administrativo
7. Design/protótipo
8. Integrações necessárias
9. Prazo de lançamento
10. Orçamento estimado

---

## 5. Páginas Principais

### 📄 /src/app/pages/ServiceSelection.tsx

**Propósito:** Seleção de área de serviço após login

```tsx
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Computer, Wifi, Globe, Smartphone, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function ServiceSelection() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      navigate("/");
      return;
    }
    const user = JSON.parse(userData);
    setUserName(user.nomeCompleto.split(" ")[0]);
  }, [navigate]);

  const services = [
    {
      id: "manutencao",
      title: "Manutenção de Computadores",
      description: "Reparo, limpeza, upgrade e diagnóstico de hardware e software",
      icon: Computer,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      id: "redes",
      title: "Rede de Computadores",
      description: "Configuração, segurança e otimização de infraestrutura de rede",
      icon: Wifi,
      gradient: "from-green-500 to-green-600",
    },
    {
      id: "dev-web",
      title: "Desenvolvimento Web",
      description: "Criação de websites, sistemas web e e-commerce",
      icon: Globe,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      id: "dev-mobile",
      title: "Desenvolvimento Mobile",
      description: "Aplicativos nativos e multiplataforma para iOS e Android",
      icon: Smartphone,
      gradient: "from-orange-500 to-orange-600",
    },
  ];

  const handleServiceSelect = (serviceId: string) => {
    navigate(`/questionnaire/${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Quick Fix</h1>
              <p className="text-sm text-muted-foreground">Olá, {userName}!</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="size-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Qual área de serviço deseja contratar hoje?
            </h2>
            <p className="text-xl text-muted-foreground">
              Selecione uma opção abaixo para iniciar o diagnóstico personalizado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.id}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary"
                  onClick={() => handleServiceSelect(service.id)}
                >
                  <CardHeader>
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${service.gradient} w-fit mb-4`}>
                      <Icon className="size-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Selecionar Serviço
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="py-6">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Dica:</strong> Após selecionar o serviço, você responderá 10 perguntas objetivas 
                  para que possamos gerar um diagnóstico preciso e definir o nível de prioridade do seu atendimento.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
```

**Veja também:**
- [LoginPage.tsx](#loginpage) - Página de login/cadastro
- [HomePage.tsx](#homepage) - Página inicial com vitrine
- [Dashboard.tsx](#dashboard) - Dashboard do usuário
- [QuestionnaireFlow.tsx](#questionnaireflow) - Fluxo de questionário
- [ResultPage.tsx](#resultpage) - Página de resultados
- [ProfessionalsPage.tsx](#professionalspage) - Página de profissionais
- [OrdersKanban.tsx](#orderskanban) - Dashboard Kanban de pedidos

---

## 6. Componentes Customizados

Os componentes customizados estão localizados em `/src/app/components/`:

### Lista de Componentes Principais:
1. **AnimatedBackground.tsx** - Background com partículas animadas
2. **AnimatedProgress.tsx** - Barra de progresso animada
3. **ChatbotWidget.tsx** - Widget de chatbot flutuante
4. **InfiniteSlider.tsx** - Slider infinito de logos
5. **LiveCounter.tsx** - Contador animado em tempo real
6. **ROICalculator.tsx** - Calculadora de ROI interativa
7. **SystemStatus.tsx** - Status do sistema em tempo real

### Estrutura Básica de um Componente:
```tsx
// Exemplo: LiveCounter.tsx
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';

interface LiveCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

export function LiveCounter({ end, suffix = '', prefix = '', duration = 2.5 }: LiveCounterProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <CountUp
      start={0}
      end={end}
      duration={duration}
      suffix={suffix}
      prefix={prefix}
      separator=","
      decimal=","
      decimals={0}
    />
  );
}
```

---

## 7. Componentes de UI

Os componentes de UI estão em `/src/app/components/ui/` e são baseados em:
- **Radix UI** - Para funcionalidades acessíveis
- **Tailwind CSS** - Para estilização
- **Shadcn/ui** - Padrões de design

### Lista Completa de Componentes UI:
1. accordion.tsx
2. alert-dialog.tsx
3. alert.tsx
4. aspect-ratio.tsx
5. avatar.tsx
6. badge.tsx
7. breadcrumb.tsx
8. button.tsx
9. calendar.tsx
10. card.tsx
11. carousel.tsx
12. chart.tsx
13. checkbox.tsx
14. collapsible.tsx
15. command.tsx
16. context-menu.tsx
17. dialog.tsx
18. drawer.tsx
19. dropdown-menu.tsx
20. form.tsx
21. hover-card.tsx
22. input-otp.tsx
23. input.tsx
24. label.tsx
25. menubar.tsx
26. navigation-menu.tsx
27. pagination.tsx
28. popover.tsx
29. progress.tsx
30. radio-group.tsx
31. resizable.tsx
32. scroll-area.tsx
33. select.tsx
34. separator.tsx
35. sheet.tsx
36. sidebar.tsx
37. skeleton.tsx
38. slider.tsx
39. sonner.tsx
40. switch.tsx
41. table.tsx
42. tabs.tsx
43. textarea.tsx
44. toggle-group.tsx
45. toggle.tsx
46. tooltip.tsx

---

## 📊 Tecnologias e Bibliotecas

### Core
- **React 18.3.1** + **TypeScript**
- **React Router 7.13.0** (Data Router)
- **Vite 6.3.5** (Build tool)

### UI & Styling
- **Tailwind CSS 4.1.12**
- **Radix UI** (Componentes primitivos)
- **Material UI 7.3.5**
- **Lucide React** (Ícones)

### Formulários & Validação
- **React Hook Form 7.55.0**

### Animações
- **Motion 12.23.24** (Framer Motion)
- **React CountUp**
- **Canvas Confetti**

### Gráficos
- **Recharts 2.15.2**

### Drag & Drop
- **React DnD 16.0.1**

### Notificações
- **Sonner**

---

## 🎨 Design System

### Paleta de Cores
```css
/* Primary */
--primary: #2563eb (blue-600)
--primary-foreground: #ffffff

/* Background */
--background: #ffffff (light) / #1e1e1e (dark)
--foreground: #0a0a0a (light) / #fafafa (dark)

/* Accent Colors */
- Blue: #3b82f6
- Cyan: #06b6d4
- Green: #10b981
- Purple: #a855f7
- Orange: #f97316
```

### Tipografia
```css
--font-family-base: 'Inter'
--font-family-heading: 'Sora'
--font-family-mono: 'JetBrains Mono'
```

### Espaçamento
```css
--radius: 0.625rem (10px)
```

---

## 🚀 Funcionalidades Implementadas

### ✅ Sistema de Vitrine
- Homepage com apresentação de serviços
- Catálogo de produtos
- Informações institucionais
- Call-to-actions

### ✅ Autenticação Simplificada
- Login/cadastro via formulário
- Persistência em localStorage
- Validação de campos

### ✅ Sistema de Anamnese
- 4 áreas de serviço
- 10 perguntas objetivas por área
- Sistema de pontuação 1-5
- Campo de descrição detalhada

### ✅ Cálculos Automáticos
- Complexidade (Baixa, Média, Alta, Muito Alta)
- Prioridade (Baixa, Normal, Alta, Urgente)
- Nível de serviço (Residencial até Enterprise)
- Prazo estimado (dias, semanas, meses)
- Investimento estimado (faixas de valores)

### ✅ Dashboard Kanban
- Visualização de pedidos
- Status: Novo, Em Análise, Em Andamento, Concluído
- Drag & Drop
- Filtros por tipo

### ✅ Página de Profissionais
- Lista de profissionais
- Status em tempo real
- Especialidades
- Métricas (projetos, avaliação)

### ✅ Componentes Interativos
- Background animado com partículas
- Contadores ao vivo
- Slider infinito
- Widget de chatbot
- Calculadora de ROI
- Status do sistema

### ✅ Avisos e Transparência
- Aviso sobre mudança de valores
- Explicação de estimativas
- Próximos passos claros

---

## 📱 Responsividade

O sistema é totalmente responsivo com breakpoints:
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

---

## 💾 Armazenamento de Dados

### LocalStorage
```javascript
// Dados do usuário
localStorage.setItem("userData", JSON.stringify({
  nomeCompleto: string,
  email: string,
  telefone: string,
  empresa: string,
  cnpj?: string
}));

// Resultado do questionário
localStorage.setItem("questionnaireResult", JSON.stringify({
  serviceType: string,
  serviceName: string,
  answers: Record<string, string>,
  description: string,
  totalScore: number,
  averageScore: number,
  answersCount: number,
  timestamp: string
}));
```

---

## 🎯 Fluxo de Navegação

```
1. / (HomePage)
   ↓
2. /login (LoginPage)
   ↓
3. /dashboard (Dashboard) ou /service-selection (ServiceSelection)
   ↓
4. /questionnaire/:serviceType (QuestionnaireFlow)
   ↓
5. /result (ResultPage)
   ↓
6. /dashboard (Dashboard)

Páginas Auxiliares:
- /professionals (ProfessionalsPage)
- /orders (OrdersKanban)
```

---

## 📋 Checklist de Funcionalidades

- ✅ Sistema de vitrine (navegação livre)
- ✅ Login/cadastro simplificado
- ✅ 4 áreas de serviço
- ✅ 10 perguntas objetivas por área
- ✅ Sistema de pontuação 1-5
- ✅ Campo descrição detalhada
- ✅ Cálculo de complexidade
- ✅ Cálculo de prioridade
- ✅ Estimativa de prazo
- ✅ Estimativa de investimento
- ✅ Aviso sobre mudança de valores
- ✅ Dashboard de usuário
- ✅ Histórico de anamneses
- ✅ Dashboard Kanban
- ✅ Página de profissionais
- ✅ Dark theme
- ✅ Glassmorphism
- ✅ Animações fluidas
- ✅ Componentes interativos
- ✅ Responsividade completa

---

## 🎨 Guia de Estilo Visual

### Efeitos Visuais
1. **Glassmorphism**: `backdrop-blur-lg bg-white/10`
2. **Gradientes**: `bg-gradient-to-br from-blue-500 to-cyan-500`
3. **Sombras Coloridas**: `shadow-lg shadow-blue-500/50`
4. **Hover States**: Transições suaves de 300ms
5. **Animações**: Motion com fade-in e slide-up

### Componentes de Card
```tsx
<Card className="bg-white/10 backdrop-blur-lg border-white/20">
  {/* Conteúdo */}
</Card>
```

### Botões com Gradiente
```tsx
<Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
  Texto do Botão
</Button>
```

---

## 📝 Observações Finais

Este sistema foi desenvolvido como uma plataforma completa de vitrine e anamnese para serviços de TI, com foco em:

1. **Experiência do Usuário**: Interface moderna e intuitiva
2. **Performance**: Componentes otimizados e lazy loading
3. **Acessibilidade**: Componentes Radix UI acessíveis
4. **Manutenibilidade**: Código bem estruturado e documentado
5. **Escalabilidade**: Arquitetura modular e componentizada

---

**Quick Fix - Soluções em Tecnologia**
*Sistema desenvolvido com React + TypeScript + Tailwind CSS*
*© 2026 - Todos os direitos reservados*
