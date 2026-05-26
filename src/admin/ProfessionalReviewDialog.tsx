import type { ProfessionalData } from "../app/api";
import { Badge } from "../app/components/ui/badge";
import { Button } from "../app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../app/components/ui/dialog";
import { ExternalLink, FileText, CheckCircle, XCircle } from "lucide-react";

interface Props {
  professional: ProfessionalData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReview: (id: number, status: "aprovado" | "reprovado") => void;
}

export function ProfessionalReviewDialog({ professional, open, onOpenChange, onReview }: Props) {
  if (!professional) return null;

  const hasResume = !!professional.resumeUrl;
  const diplomas = professional.diplomas || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{professional.nomeCompleto}</DialogTitle>
          <DialogDescription>
            Avaliacao completa do cadastro — {professional.email}
          </DialogDescription>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div><span className="text-muted-foreground">CPF:</span> {professional.cpf}</div>
          <div><span className="text-muted-foreground">Telefone:</span> {professional.telefone}</div>
          <div><span className="text-muted-foreground">Nascimento:</span> {professional.dataNascimento || "-"}</div>
          <div>
            <span className="text-muted-foreground">Status:</span>{" "}
            <Badge className="ml-1 capitalize">{professional.status}</Badge>
          </div>
          {professional.createdAt && (
            <div className="sm:col-span-2">
              <span className="text-muted-foreground">Cadastrado em:</span>{" "}
              {new Date(professional.createdAt).toLocaleString("pt-BR")}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <FileText className="size-4" /> Curriculo
          </h3>
          {hasResume ? (
            <>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={professional.resumeUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="size-4 mr-1" /> Abrir PDF em nova aba
                  </a>
                </Button>
              </div>
              <iframe
                title="Curriculo PDF"
                src={professional.resumeUrl}
                className="w-full h-80 rounded-lg border bg-white"
              />
            </>
          ) : (
            <p className="text-muted-foreground text-sm">
              {professional.curriculo
                ? `Arquivo informado apenas pelo nome: ${professional.curriculo} (refaca o cadastro com PDF).`
                : "Nenhum curriculo enviado."}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Diplomas e certificados</h3>
          {diplomas.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {diplomas.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-lg border overflow-hidden hover:ring-2 ring-primary transition"
                >
                  <img src={doc.url} alt={doc.name} className="w-full h-36 object-cover" />
                  <p className="text-xs p-2 truncate text-muted-foreground">{doc.name}</p>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Nenhuma imagem de diploma enviada.</p>
          )}
        </div>

        {professional.status === "pendente" && professional.id && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              className="text-red-600"
              onClick={() => onReview(professional.id!, "reprovado")}
            >
              <XCircle className="size-4 mr-1" /> Reprovar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => onReview(professional.id!, "aprovado")}
            >
              <CheckCircle className="size-4 mr-1" /> Aprovar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}