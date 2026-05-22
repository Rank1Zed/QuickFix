import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api, ChatEscalation, ProfessionalData } from "../app/api";
import { Badge } from "../app/components/ui/badge";
import { Button } from "../app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../app/components/ui/card";
import { Input } from "../app/components/ui/input";
import { Textarea } from "../app/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../app/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../app/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, MessageSquare, Search, UserCheck, XCircle } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState<ProfessionalData[]>([]);
  const [escalations, setEscalations] = useState<ChatEscalation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "pendente" | "aprovado" | "reprovado">("");
  const [replies, setReplies] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pros, esc] = await Promise.all([
        api.listProfessionalsAdmin(statusFilter || undefined),
        api.listEscalations("aberta"),
      ]);
      setProfessionals(pros.professionals);
      setEscalations(esc.escalations);
    } catch {
      toast.error("Erro ao carregar dados. Verifique se o backend esta rodando.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleReview = async (id: number, status: "aprovado" | "reprovado") => {
    try {
      await api.reviewProfessional(id, status);
      toast.success(status === "aprovado" ? "Profissional aprovado!" : "Cadastro reprovado.");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao atualizar.");
    }
  };

  const handleReply = async (escId: number) => {
    const text = (replies[escId] || "").trim();
    if (!text) {
      toast.error("Digite uma resposta.");
      return;
    }
    try {
      await api.replyEscalation(escId, text);
      toast.success("Resposta enviada. O bot aprendeu com esta resposta.");
      setReplies((r) => ({ ...r, [escId]: "" }));
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao responder.");
    }
  };

  const filtered = professionals.filter(
    (p) =>
      p.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.cpf || "").includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Button variant="ghost" onClick={() => navigate("/")} className="mb-2 -ml-2">
              <ArrowLeft className="mr-2 size-4" /> Voltar
            </Button>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <UserCheck className="text-green-600 size-8" /> Painel Admin
            </h1>
            <p className="text-muted-foreground">Avaliacao de profissionais e atendimento do chatbot.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar nome ou CPF..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card><CardHeader className="py-3"><CardDescription>Total</CardDescription><CardTitle>{professionals.length}</CardTitle></CardHeader></Card>
          <Card><CardHeader className="py-3"><CardDescription>Pendentes</CardDescription><CardTitle>{professionals.filter((p) => p.status === "pendente").length}</CardTitle></CardHeader></Card>
          <Card><CardHeader className="py-3"><CardDescription>Aprovados</CardDescription><CardTitle>{professionals.filter((p) => p.status === "aprovado").length}</CardTitle></CardHeader></Card>
          <Card><CardHeader className="py-3"><CardDescription>Chat pendentes</CardDescription><CardTitle>{escalations.length}</CardTitle></CardHeader></Card>
        </div>

        <Tabs defaultValue="professionals">
          <TabsList>
            <TabsTrigger value="professionals">Profissionais</TabsTrigger>
            <TabsTrigger value="chat">
              <MessageSquare className="size-4 mr-1" /> Chat ({escalations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="professionals" className="mt-4">
            <div className="flex gap-2 mb-4">
              {(["", "pendente", "aprovado", "reprovado"] as const).map((s) => (
                <Button key={s || "all"} size="sm" variant={statusFilter === s ? "default" : "outline"} onClick={() => setStatusFilter(s)}>
                  {s || "Todos"}
                </Button>
              ))}
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profissional</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Acoes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8">Carregando...</TableCell></TableRow>
                    ) : filtered.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Nenhum cadastro.</TableCell></TableRow>
                    ) : (
                      filtered.map((prof) => (
                        <TableRow key={prof.id}>
                          <TableCell>
                            <div className="font-semibold text-sm">{prof.nomeCompleto}</div>
                            <div className="text-xs text-muted-foreground">Nasc: {prof.dataNascimento || "-"}</div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{prof.cpf}</TableCell>
                          <TableCell>
                            <div className="text-xs">{prof.email}</div>
                            <div className="text-xs">{prof.telefone}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={prof.status === "aprovado" ? "default" : prof.status === "reprovado" ? "destructive" : "secondary"}>
                              {prof.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {prof.status === "pendente" && prof.id && (
                              <div className="flex justify-end gap-1">
                                <Button size="sm" variant="ghost" className="text-green-600" onClick={() => handleReview(prof.id!, "aprovado")}>
                                  <CheckCircle className="size-5" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleReview(prof.id!, "reprovado")}>
                                  <XCircle className="size-5" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="mt-4 space-y-4">
            {escalations.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">Nenhuma duvida pendente.</CardContent></Card>
            ) : (
              escalations.map((esc) => (
                <Card key={esc.id}>
                  <CardHeader>
                    <CardTitle className="text-base">Pergunta do usuario</CardTitle>
                    <CardDescription>{esc.userQuestion}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      placeholder="Sua resposta (o bot usara nas proximas vezes)..."
                      value={replies[esc.id] || ""}
                      onChange={(e) => setReplies((r) => ({ ...r, [esc.id]: e.target.value }))}
                    />
                    <Button onClick={() => handleReply(esc.id)}>Enviar e ensinar o bot</Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
