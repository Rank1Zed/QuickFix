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
    {
      id: "q2",
      question: "Qual o nível de urgência do problema?",
      options: [
        { value: "nao-urgente", label: "Não urgente (pode esperar alguns dias)", score: 1 },
        { value: "normal", label: "Normal (precisa em até 1 semana)", score: 2 },
        { value: "urgente", label: "Urgente (precisa em 1-2 dias)", score: 4 },
        { value: "critico", label: "Crítico (precisa hoje/amanhã)", score: 5 },
      ],
    },
    {
      id: "q3",
      question: "Quantos equipamentos precisam de atendimento?",
      options: [
        { value: "1", label: "1 equipamento", score: 1 },
        { value: "2-5", label: "2 a 5 equipamentos", score: 2 },
        { value: "6-10", label: "6 a 10 equipamentos", score: 3 },
        { value: "11-20", label: "11 a 20 equipamentos", score: 4 },
        { value: "20+", label: "Mais de 20 equipamentos", score: 5 },
      ],
    },
    {
      id: "q4",
      question: "O equipamento está ligando?",
      options: [
        { value: "normal", label: "Sim, funciona normalmente", score: 1 },
        { value: "lento", label: "Sim, mas está muito lento", score: 2 },
        { value: "problemas", label: "Sim, mas com problemas/erros", score: 3 },
        { value: "intermitente", label: "Às vezes liga, às vezes não", score: 4 },
        { value: "nao-liga", label: "Não está ligando", score: 5 },
      ],
    },
    {
      id: "q5",
      question: "Qual o tipo de uso do equipamento?",
      options: [
        { value: "pessoal", label: "Uso pessoal/residencial", score: 1 },
        { value: "home-office", label: "Home office", score: 2 },
        { value: "pequena-empresa", label: "Pequena empresa", score: 3 },
        { value: "empresa", label: "Empresa (crítico para operação)", score: 4 },
        { value: "servidor", label: "Servidor/Infraestrutura crítica", score: 5 },
      ],
    },
    {
      id: "q7",
      question: "Há backup dos dados importantes?",
      options: [
        { value: "backup-recente", label: "Sim, backup recente e atualizado", score: 1 },
        { value: "backup-antigo", label: "Sim, mas desatualizado", score: 2 },
        { value: "backup-parcial", label: "Backup parcial", score: 3 },
        { value: "sem-backup", label: "Não tenho backup", score: 4 },
        { value: "dados-criticos", label: "Não tenho backup e há dados críticos", score: 5 },
      ],
    },
    {
      id: "q8",
      question: "Qual o sistema operacional?",
      options: [
        { value: "windows", label: "Windows", score: 1 },
        { value: "mac", label: "MacOS", score: 2 },
        { value: "linux", label: "Linux", score: 2 },
        { value: "servidor", label: "Windows Server/Linux Server", score: 4 },
      ],
    },
    {
      id: "q9",
      question: "Tipo de problema principal:",
      options: [
        { value: "lentidao", label: "Lentidão geral do sistema", score: 2 },
        { value: "virus", label: "Suspeita de vírus/malware", score: 3 },
        { value: "hardware", label: "Problema de hardware (peças)", score: 3 },
        { value: "software", label: "Erro de software/sistema", score: 2 },
        { value: "tela-azul", label: "Tela azul/travamentos constantes", score: 4 },
      ],
    },
  ],

  redes: [
    {
      id: "q1",
      question: "Qual tipo de serviço de rede você precisa?",
      options: [
        { value: "configuracao-basica", label: "Configuração básica de Wi-Fi", score: 1 },
        { value: "instalacao", label: "Instalação de rede cabeada", score: 2 },
        { value: "otimizacao", label: "Otimização de rede existente", score: 2 },
        { value: "infraestrutura", label: "Infraestrutura completa", score: 4 },
        { value: "seguranca", label: "Segurança e firewall avançado", score: 5 },
      ],
    },
    {
      id: "q2",
      question: "Quantos dispositivos usam a rede?",
      options: [
        { value: "1-5", label: "1 a 5 dispositivos", score: 1 },
        { value: "6-15", label: "6 a 15 dispositivos", score: 2 },
        { value: "16-30", label: "16 a 30 dispositivos", score: 3 },
        { value: "31-50", label: "31 a 50 dispositivos", score: 4 },
        { value: "50+", label: "Mais de 50 dispositivos", score: 5 },
      ],
    },
    {
      id: "q3",
      question: "Qual o tamanho da área a ser coberta?",
      options: [
        { value: "pequena", label: "Residência pequena (até 80m²)", score: 1 },
        { value: "media", label: "Residência média (80-150m²)", score: 2 },
        { value: "grande", label: "Residência grande/Escritório pequeno (150-300m²)", score: 3 },
        { value: "comercial", label: "Estabelecimento comercial (300-600m²)", score: 4 },
        { value: "corporativo", label: "Empresa grande/Múltiplos andares (600m²+)", score: 5 },
      ],
    },
    {
      id: "q4",
      question: "Qual a velocidade da sua internet?",
      options: [
        { value: "ate-100", label: "Até 100 Mbps", score: 1 },
        { value: "100-300", label: "100 a 300 Mbps", score: 2 },
        { value: "300-600", label: "300 a 600 Mbps", score: 3 },
        { value: "600-1000", label: "600 Mbps a 1 Gbps", score: 4 },
        { value: "1gb+", label: "Acima de 1 Gbps", score: 5 },
      ],
    },
    {
      id: "q5",
      question: "Você precisa de rede cabeada (cabo)?",
      options: [
        { value: "nao", label: "Não, só Wi-Fi", score: 1 },
        { value: "pontos-poucos", label: "Sim, poucos pontos (1-3)", score: 2 },
        { value: "pontos-varios", label: "Sim, vários pontos (4-10)", score: 3 },
        { value: "completa", label: "Sim, rede cabeada completa (10-20 pontos)", score: 4 },
        { value: "estruturada", label: "Sim, cabeamento estruturado empresarial (20+ pontos)", score: 5 },
      ],
    },
    {
      id: "q6",
      question: "Qual o nível de segurança necessário?",
      options: [
        { value: "basico", label: "Básico (senha Wi-Fi)", score: 1 },
        { value: "intermediario", label: "Intermediário (controle de acesso)", score: 2 },
        { value: "avancado", label: "Avançado (firewall, VPN)", score: 3 },
        { value: "corporativo", label: "Corporativo (múltiplas VLANs, autenticação)", score: 4 },
        { value: "enterprise", label: "Enterprise (segurança máxima, compliance)", score: 5 },
      ],
    },
    {
      id: "q7",
      question: "A rede está funcionando atualmente?",
      options: [
        { value: "normal", label: "Sim, funcionando bem", score: 1 },
        { value: "lenta", label: "Sim, mas muito lenta", score: 2 },
        { value: "instavel", label: "Sim, mas instável/cai muito", score: 3 },
        { value: "parcial", label: "Funciona parcialmente", score: 4 },
        { value: "nao-funciona", label: "Não está funcionando", score: 5 },
      ],
    },
    {
      id: "q8",
      question: "Você precisa de servidor/NAS?",
      options: [
        { value: "nao", label: "Não preciso", score: 1 },
        { value: "compartilhamento", label: "Sim, para compartilhar arquivos", score: 2 },
        { value: "backup", label: "Sim, para backup centralizado", score: 3 },
        { value: "aplicacoes", label: "Sim, para rodar aplicações", score: 4 },
        { value: "critico", label: "Sim, servidor crítico para negócio", score: 5 },
      ],
    },
    {
      id: "q9",
      question: "Nível de urgência do serviço:",
      options: [
        { value: "planejamento", label: "Planejamento futuro", score: 1 },
        { value: "semanas", label: "Pode aguardar algumas semanas", score: 2 },
        { value: "dias", label: "Preciso em poucos dias", score: 3 },
        { value: "urgente", label: "Urgente (1-2 dias)", score: 4 },
        { value: "emergencia", label: "Emergência (hoje/amanhã)", score: 5 },
      ],
    },
  ],
};
