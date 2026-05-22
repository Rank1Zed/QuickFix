import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Progress } from "../components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { questionsByService } from "../data/questions";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { api } from "../api";

const serviceNames: Record<string, string> = {
  manutencao: "Manutenção de Computadores",
  redes: "Rede de Computadores",
};

const descriptionConfig: Record<string, { title: string; description: string; placeholder: string; examples: string[] }> = {
  manutencao: {
    title: "Descreva o Problema e Suas Necessidades",
    description: "Forneça detalhes sobre o problema técnico, sintomas observados e expectativas para o serviço de manutenção",
    placeholder: "Exemplo: O computador está muito lento ao inicializar, demora cerca de 10 minutos para ficar utilizável. Já tentei limpar arquivos tempor��rios mas não resolveu. Preciso que fique mais rápido pois uso para trabalho diariamente...",
    examples: [
      "Descreva os sintomas do problema em detalhes",
      "Quando o problema começou?",
      "Já tentou alguma solução? Qual foi o resultado?",
      "Qual a urgência? Por que precisa resolver isso agora?",
      "Há dados importantes que precisam ser preservados?",
    ],
  },
  redes: {
    title: "Descreva Sua Infraestrutura e Necessidades de Rede",
    description: "Explique a situação atual da sua rede, problemas enfrentados e objetivos que deseja alcançar",
    placeholder: "Exemplo: Preciso instalar rede Wi-Fi em um escritório de 150m² com 2 andares. Atualmente a internet chega por cabo apenas no térreo e o sinal não alcança o andar superior. Temos 15 funcionários que precisam de conexão estável o dia todo...",
    examples: [
      "Qual a estrutura física do local (tamanho, andares, divisões)?",
      "Quais problemas de rede você enfrenta atualmente?",
      "Qual a velocidade de internet contratada?",
      "Quantos dispositivos precisam se conectar simultaneamente?",
      "Há necessidades específicas de segurança ou acesso remoto?",
    ],
  },
};

export default function QuestionnaireFlow() {
  const { serviceType } = useParams<{ serviceType: string }>();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [description, setDescription] = useState("");
  const [showDescription, setShowDescription] = useState(false);

  const questions = serviceType ? questionsByService[serviceType] || [] : [];
  const serviceName = serviceType ? serviceNames[serviceType] : "";

  if (!serviceType || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="py-12">
            <p>Serviço não encontrado</p>
            <Button onClick={() => navigate("/dashboard")} className="mt-4">
              Voltar para Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: value,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowDescription(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = async () => {
    // Calcular pontuação total
    let totalScore = 0;
    let answersCount = 0;

    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find((q) => q.id === questionId);
      if (question) {
        const option = question.options.find((opt) => opt.value === answer);
        if (option) {
          totalScore += option.score;
          answersCount++;
        }
      }
    });

    const averageScore = answersCount > 0 ? totalScore / answersCount : 0;

    // Salvar resultado
    const result = {
      serviceType,
      serviceName,
      answers,
      description,
      totalScore,
      averageScore,
      answersCount,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("questionnaireResult", JSON.stringify(result));

    // Salvar como order também
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const newOrder = {
      id: Date.now(),
      title: serviceName,
      type: serviceType === "manutencao" ? "Hardware" : "Redes",
      status: "analise",
      priority: averageScore <= 1.5 ? "baixa" : averageScore <= 2.5 ? "media" : averageScore <= 3.5 ? "alta" : "urgente",
      professional: "Aguardando atribuição",
      estimatedTime: getEstimatedTime(averageScore, serviceType),
      createdAt: new Date().toISOString(),
      questionnaireData: result,
    };
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "null");
      const savedOrder = await api.createOrder({ ...newOrder, client: userData });
      orders.push(savedOrder);
      localStorage.setItem("lastOrderId", String(savedOrder.id));
      localStorage.setItem("orders", JSON.stringify(orders));
    } catch (error) {
      orders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(orders));
    }

    // Direcionar para a página de resultado
    navigate("/result");
  };

  const getEstimatedTime = (score: number, serviceType: string) => {
    const baseTime: Record<string, number> = {
      manutencao: 1,
      redes: 3,
    };

    const base = baseTime[serviceType] || 3;
    const multiplier = score / 2;
    const days = Math.round(base * multiplier);

    if (days <= 1) return "1 dia";
    if (days <= 7) return `${days} dias`;
    if (days <= 30) return `${Math.round(days / 7)} semanas`;
    return `${Math.round(days / 30)} meses`;
  };

  const currentAnswer = answers[questions[currentQuestion].id];
  const canProceed = !!currentAnswer;

  if (showDescription) {
    const config = descriptionConfig[serviceType] || descriptionConfig["manutencao"];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <header className="bg-white dark:bg-gray-800 border-b shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-2xl font-bold truncate">Quick Fix</h1>
                <p className="text-xs md:text-sm text-muted-foreground truncate">{serviceName}</p>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground flex-shrink-0">
                <span className="hidden sm:inline">Etapa Final</span>
                <Badge variant="secondary" className="text-xs md:text-sm">{questions.length}/{questions.length} Respondidas ✓</Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">{config.title}</CardTitle>
                <CardDescription className="text-base">
                  {config.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Guia de perguntas */}
                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      O que incluir na descrição?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {config.examples.map((example, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary font-bold flex-shrink-0">•</span>
                          <span className="text-sm">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Campo de descrição */}
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-lg">
                    Descrição Detalhada do Serviço *
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={config.placeholder}
                    rows={12}
                    className="resize-none text-base"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {description.length > 0 ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          ✓ {description.length} caracteres
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400">
                          Campo opcional, mas recomendado para um diagnóstico mais preciso
                        </span>
                      )}
                    </p>
                    {description.length >= 100 && (
                      <Badge variant="default">Descrição completa ✓</Badge>
                    )}
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowDescription(false)}
                    className="flex-1"
                  >
                    <ArrowLeft className="size-4 mr-2" />
                    Revisar Respostas
                  </Button>
                  <Button onClick={handleFinish} className="flex-1" size="lg">
                    Finalizar e Ver Diagnóstico
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Informação adicional */}
            <Card>
              <CardContent className="py-4">
                <p className="text-sm text-center text-muted-foreground">
                  🔒 Suas informações são confidenciais e serão usadas apenas para análise do serviço solicitado
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold truncate">Quick Fix</h1>
              <p className="text-xs md:text-sm text-muted-foreground truncate">{serviceName}</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/dashboard")} className="flex-shrink-0">
              <ArrowLeft className="size-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Pergunta {currentQuestion + 1} de {questions.length}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{questions[currentQuestion].question}</CardTitle>
              <CardDescription>Selecione a opção que melhor se adequa à sua situação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={currentAnswer} onValueChange={handleAnswer}>
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-all hover:bg-accent ${
                        currentAnswer === option.value ? "border-primary bg-accent" : ""
                      }`}
                      onClick={() => handleAnswer(option.value)}
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              {/* Navigation */}
              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="flex-1"
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Anterior
                </Button>
                <Button onClick={handleNext} disabled={!canProceed} className="flex-1">
                  {currentQuestion === questions.length - 1 ? "Continuar" : "Próxima"}
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Question Counter */}
          <div className="mt-6 flex justify-center gap-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`size-2 rounded-full transition-all ${
                  index === currentQuestion
                    ? "bg-primary w-8"
                    : index < currentQuestion
                    ? "bg-primary/50"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
