import { AnamneseData } from "./AnamneseForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { FileText, Eye, Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";

interface AnamneseListProps {
  anamneses: AnamneseData[];
  onView: (anamnese: AnamneseData) => void;
  onDelete: (id: string) => void;
}

export function AnamneseList({ anamneses, onView, onDelete }: AnamneseListProps) {
  if (anamneses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="size-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            Nenhuma anamnese cadastrada ainda.
            <br />
            Clique em "Nova Anamnese" para começar.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {anamneses.map((anamnese) => {
        const dataFormatada = new Date(anamnese.createdAt).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <Card key={anamnese.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {anamnese.nomeCompleto}
                    {anamnese.sexo && (
                      <Badge variant="outline">
                        {anamnese.sexo === 'masculino' ? 'M' : 'F'}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Data da consulta: {dataFormatada}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(anamnese)}
                  >
                    <Eye className="size-4 mr-2" />
                    Visualizar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(anamnese.id)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Idade:</span>{' '}
                  {anamnese.idade || anamnese.dataNascimento ? (
                    anamnese.idade || new Date().getFullYear() - new Date(anamnese.dataNascimento).getFullYear()
                  ) : 'Não informada'}
                </div>
                <div>
                  <span className="text-muted-foreground">Telefone:</span>{' '}
                  {anamnese.telefone || 'Não informado'}
                </div>
                {anamnese.profissao && (
                  <div>
                    <span className="text-muted-foreground">Profissão:</span>{' '}
                    {anamnese.profissao}
                  </div>
                )}
                {anamnese.estadoCivil && (
                  <div>
                    <span className="text-muted-foreground">Estado Civil:</span>{' '}
                    {anamnese.estadoCivil}
                  </div>
                )}
              </div>
              {anamnese.queixaPrincipal && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Queixa Principal:</p>
                  <p className="text-sm line-clamp-2">{anamnese.queixaPrincipal}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
