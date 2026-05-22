import { Button } from "../app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../app/components/ui/card";
import { Badge } from "../app/components/ui/badge";
import { Progress } from "../app/components/ui/progress";
import { ArrowRight, Wrench, Network, Laptop, HardDrive, Wifi, Shield, ChevronRight, Star, CheckCircle2, Clock, Zap } from "lucide-react";
import { AnimatedBackground } from "../app/components/AnimatedBackground";
import { LiveCounter } from "../app/components/LiveCounter";
import { InfiniteSlider } from "../app/components/InfiniteSlider";
import { ChatbotWidget } from "../app/components/ChatbotWidget";
import { SystemStatus } from "../app/components/SystemStatus";
import { motion } from "motion/react";

const services = [
  {
    id: "manutencao",
    icon: Wrench,
    title: "Manutenção de Computadores",
    description: "Conserto, upgrade e otimização de PCs e notebooks. Diagnóstico rápido e solução eficiente.",
    features: ["Limpeza e otimização", "Troca de peças", "Backup de dados", "Instalação de software"],
    color: "bg-blue-500",
  },
  {
    id: "redes",
    icon: Network,
    title: "Rede de Computadores",
    description: "Instalação e configuração de redes cabeadas e Wi-Fi. Segurança e estabilidade garantidas.",
    features: ["Instalação Wi-Fi", "Cabeamento estruturado", "Configuração de roteadores", "Segurança de rede"],
    color: "bg-green-500",
  },
];

const techLogos = [
  { name: 'Nvidia', logo: <div className="text-4xl font-bold text-green-400">Nvidia</div> },
  { name: 'Intel', logo: <div className="text-4xl font-bold text-blue-600">Intel</div> },
  { name: 'Microsoft', logo: <div className="text-4xl font-bold text-blue-500">Microsoft</div> },
  { name: 'Kingston', logo: <div className="text-4xl font-bold text-red-500">Kingston</div> },
  { name: 'Apple', logo: <div className="text-4xl font-bold text-gray-300">Apple</div> },
  { name: 'AMD', logo: <div className="text-4xl font-bold text-red-400">AMD</div> },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Header/Navbar com Glassmorphism */}
      <header className="bg-white/10 dark:bg-white/5 backdrop-blur-lg border-b border-white/10 shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
                className="size-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50"
              >
                <Wrench className="size-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Quick Fix
                </h1>
                <p className="text-xs text-blue-200">Soluções em Tecnologia</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#servicos" className="text-sm font-medium hover:text-blue-400 transition-colors">
                Serviços
              </a>
              <a href="#sobre" className="text-sm font-medium hover:text-blue-400 transition-colors">
                Sobre
              </a>
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <a href="/professional-login">
                  Área do Profissional
                </a>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <a href="/login">
                  Área do Cliente
                </a>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section com Background Animado */}
      <section className="py-20 px-4 relative overflow-hidden">
        <AnimatedBackground />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="text-sm bg-blue-500/20 text-blue-300 border-blue-400/50">
                <Zap className="size-3 mr-1" />
                Entrega rápida e qualidade garantida
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent"
            >
              Soluções Tecnológicas
              <br />
              Rápidas e Eficientes
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-blue-100 max-w-2xl mx-auto"
            >
              Especialistas em manutenção de computadores e redes.
              Serviços personalizados para sua necessidade com garantia de qualidade.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center pt-4"
            >
              <Button 
                size="lg" 
                className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/50" 
                onClick={() => document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver Serviços <ArrowRight className="size-5" />
              </Button>
            </motion.div>
          </div>

          {/* Stats com Live Counter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-blue-400">
                    <LiveCounter end={500} suffix="+" />
                  </div>
                  <p className="text-sm text-blue-200 mt-2">Clientes Atendidos</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-green-400">
                    <LiveCounter end={98} suffix="%" />
                  </div>
                  <p className="text-sm text-blue-200 mt-2">Satisfação</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-orange-400">24h</div>
                  <p className="text-sm text-blue-200 mt-2">Suporte Médio</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* System Status */}
      <section className="px-4 pb-12">
        <div className="container mx-auto max-w-6xl">
          <SystemStatus />
        </div>
      </section>

      {/* Services Section com Bento Grid */}
      <section id="servicos" className="py-20 px-4 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-blue-500/20 text-blue-300 border-blue-400/50">
              Nossos Serviços
            </Badge>
            <h2 className="text-4xl font-bold mb-4">O que fazemos de melhor</h2>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              Oferecemos soluções completas em tecnologia com qualidade e agilidade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a
                    href={`/login?redirectTo=/questionnaire/${service.id}`}
                    className="group block no-underline h-full"
                  >
                    <Card className="hover:shadow-2xl hover:shadow-blue-500/20 transition-all bg-white/5 backdrop-blur-lg border-white/10 h-full">
                      <CardHeader>
                        <div className={`size-12 ${service.color} rounded-lg flex items-center justify-center mb-4 shadow-lg`}>
                          <Icon className="size-6 text-white" />
                        </div>
                        <CardTitle className="text-2xl group-hover:text-blue-400 transition-colors text-white">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="text-base text-blue-200">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 mb-4">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-blue-100">
                              <CheckCircle2 className="size-4 text-green-400 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-4 border-t border-white/10">
                          <div className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2.5 text-white font-medium transition-all group-hover:from-blue-600 group-hover:to-cyan-600">
                            Contratar <ArrowRight className="size-4" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Partners - Infinite Slider */}
      <section className="py-16 px-4 border-y border-white/10">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-center text-sm font-mono text-blue-300 mb-8 uppercase tracking-wider">
            {'>'} Marcas que utilizamos
          </h3>
          <InfiniteSlider items={techLogos} />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Por que escolher a Quick Fix?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="size-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/50">
                <Shield className="size-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Garantia Total</h3>
              <p className="text-blue-200">
                Todos os serviços com garantia estendida e suporte completo
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="size-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/50">
                <Clock className="size-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Agilidade</h3>
              <p className="text-blue-200">
                Atendimento rápido e prazos que cabem na sua agenda
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="size-16 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/50">
                <Star className="size-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Qualidade</h3>
              <p className="text-blue-200">
                Profissionais certificados e equipamentos de primeira linha
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 border-0 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
            <CardContent className="py-12 text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto para começar?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Faça login ou cadastre-se para solicitar orçamentos personalizados
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="gap-2 bg-white text-blue-600 hover:bg-gray-100"
              >
                <a href="/login">
                  Acessar Área do Cliente <ArrowRight className="size-5" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="gap-2 bg-white text-blue-600 hover:bg-gray-100"
              >
                <a href="/professional-login">
                  Acessar Área do Profissional <ArrowRight className="size-5" />
                </a>
              </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer id="sobre" className="bg-slate-950 border-t border-white/10 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="size-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                  <Wrench className="size-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Quick Fix</h3>
              </div>
              <p className="text-sm text-blue-200">
                Soluções tecnológicas com qualidade e agilidade desde 2020.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Serviços</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li>Manutenção de Computadores</li>
                <li>Redes de Computadores</li>
                <li>Suporte Técnico</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li>Sobre nós</li>
                <li>Contato</li>
                <li>Trabalhe conosco</li>
                <li>Parceiros</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contato</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li>📧 contato@quickfix.com</li>
                <li>📱 (11) 9999-9999</li>
                <li>📍 Manaus, AM</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-blue-300">
            <p>&copy; 2026 Quick Fix. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
}
