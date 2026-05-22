import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} 

from "../components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  FileText, 
  UserCheck, 
  Search, 
  ArrowLeft,
  Filter
} from "lucide-react";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface Professional {
  nomeCompleto: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  status: "pendente" | "aprovado" | "reprovado";
  curriculo?: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Carrega os dados salvos pelo formulário de cadastro
  useEffect(() => {
    const savedData = localStorage.getItem("professionalRegisterData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Se for um único objeto (como seu formulário envia), transformamos em array
        const list = Array.isArray(parsed) ? parsed : [{ ...parsed, status: "pendente" }];
        setProfessionals(list);
      } catch (e) {
        console.error("Erro ao carregar dados do admin", e);
      }
    }
  }, []);

  const handleUpdateStatus = (index: number, newStatus: "aprovado" | "reprovado") => {
    const updated = [...professionals];
    updated[index].status = newStatus;
    setProfessionals(updated);
    
    // Simula persistência no localStorage
    localStorage.setItem("professionalRegisterData", JSON.stringify(updated));

    if (newStatus === "aprovado") {
      toast.success(`Profissional ${updated[index].nomeCompleto} aprovado com sucesso!`);
    } else {
      toast.error(`Cadastro de ${updated[index].nomeCompleto} foi reprovado.`);
    }
  };

  const filteredProfessionals = professionals.filter(p => 
    p.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.cpf.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")} 
              className="mb-2 -ml-2 text-muted-foreground"
            >
              <ArrowLeft className="mr-2 size-4" /> Voltar ao Início
            </Button>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <UserCheck className="text-green-600 size-8" /> 
              Painel de Avaliação
            </h1>
            <p className="text-muted-foreground">
              Análise de novos especialistas para a plataforma Quick Fix.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nome ou CPF..." 
                className="pl-9 bg-white dark:bg-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="size-4" />
            </Button>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardHeader className="py-4">
              <CardDescription>Total Recebido</CardDescription>
              <CardTitle className="text-2xl">{professionals.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-yellow-500 shadow-sm">
            <CardHeader className="py-4">
              <CardDescription>Aguardando Análise</CardDescription>
              <CardTitle className="text-2xl">
                {professionals.filter(p => p.status === 'pendente').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-green-500 shadow-sm">
            <CardHeader className="py-4">
              <CardDescription>Aprovados</CardDescription>
              <CardTitle className="text-2xl">
                {professionals.filter(p => p.status === 'aprovado').length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tabela de Dados */}
        <Card className="shadow-md border-none">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-100 dark:bg-gray-900">
                <TableRow>
                  <TableHead className="font-bold">Profissional</TableHead>
                  <TableHead className="font-bold">Documentação</TableHead>
                  <TableHead className="font-bold">Contato</TableHead>
                  <TableHead className="font-bold">Currículo</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right font-bold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfessionals.length > 0 ? (
                  filteredProfessionals.map((prof, index) => (
                    <TableRow key={index} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                      <TableCell>
                        <div className="font-bold uppercase text-sm">{prof.nomeCompleto}</div>
                        <div className="text-xs text-muted-foreground">Nasc: {prof.dataNascimento}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{prof.cpf}</TableCell>
                      <TableCell>
                        <div className="text-xs">{prof.email}</div>
                        <div className="text-xs font-semibold">{prof.telefone}</div>
                      </TableCell>
                      <TableCell>
                        {prof.curriculo ? (
                          <Button variant="outline" size="sm" className="h-8 gap-2 text-blue-600 border-blue-200">
                            <FileText className="size-3" /> PDF
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Não enviado</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={prof.status === "aprovado" ? "default" : prof.status === "reprovado" ? "destructive" : "secondary"}
                          className="capitalize"
                        >
                          {prof.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {prof.status === "pendente" && (
                          <div className="flex justify-end gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-green-600 hover:bg-green-50"
                              onClick={() => handleUpdateStatus(index, "aprovado")}
                            >
                              <CheckCircle className="size-5" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleUpdateStatus(index, "reprovado")}
                            >
                              <XCircle className="size-5" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      Nenhum profissional encontrado para avaliação.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}