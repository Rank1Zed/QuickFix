import { AnamneseData } from "./AnamneseForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { X, Printer } from "lucide-react";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";

interface AnamneseViewProps {
  anamnese: AnamneseData;
  onClose: () => void;
}

export function AnamneseView({ anamnese, onClose }: AnamneseViewProps) {
  const dataFormatada = new Date(anamnese.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );

  const InfoField = ({ label, value }: { label: string; value?: string }) => {
    if (!value) return null;
    return (
      <div className="grid grid-cols-3 gap-2">
        <span className="text-sm text-muted-foreground">{label}:</span>
        <span className="text-sm col-span-2">{value}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="container max-w-4xl mx-auto py-6 px-4 h-full">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Anamnese - {anamnese.nomeCompleto}</CardTitle>
                <CardDescription>Registrado em {dataFormatada}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="size-4 mr-2" />
                  Imprimir
                </Button>
                <Button variant="outline" size="sm" onClick={onClose}>
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <ScrollArea className="flex-1">
            <CardContent className="space-y-6">
              {/* Dados Pessoais */}
              <InfoSection title="Dados Pessoais">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField label="Nome Completo" value={anamnese.nomeCompleto} />
                  <InfoField label="Data de Nascimento" value={anamnese.dataNascimento ? new Date(anamnese.dataNascimento).toLocaleDateString('pt-BR') : undefined} />
                  <InfoField label="Idade" value={anamnese.idade} />
                  <InfoField label="Sexo" value={anamnese.sexo === 'masculino' ? 'Masculino' : 'Feminino'} />
                  <InfoField label="Estado Civil" value={anamnese.estadoCivil} />
                  <InfoField label="Profissão" value={anamnese.profissao} />
                  <InfoField label="Telefone" value={anamnese.telefone} />
                  <InfoField label="E-mail" value={anamnese.email} />
                  <InfoField label="Endereço" value={anamnese.endereco} />
                </div>
              </InfoSection>

              <Separator />

              {/* Queixa Principal */}
              {anamnese.queixaPrincipal && (
                <>
                  <InfoSection title="Queixa Principal">
                    <p className="text-sm whitespace-pre-wrap">{anamnese.queixaPrincipal}</p>
                  </InfoSection>
                  <Separator />
                </>
              )}

              {/* História da Doença Atual */}
              {(anamnese.historiaDoencaAtual || anamnese.dataInicio || anamnese.evolucao) && (
                <>
                  <InfoSection title="História da Doença Atual">
                    {anamnese.historiaDoencaAtual && (
                      <p className="text-sm whitespace-pre-wrap">{anamnese.historiaDoencaAtual}</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <InfoField label="Data de Início" value={anamnese.dataInicio ? new Date(anamnese.dataInicio).toLocaleDateString('pt-BR') : undefined} />
                      <InfoField label="Evolução" value={anamnese.evolucao} />
                    </div>
                  </InfoSection>
                  <Separator />
                </>
              )}

              {/* Antecedentes Pessoais */}
              {(anamnese.doencasPreexistentes || anamnese.cirurgiasAnteriores || anamnese.alergias || anamnese.medicamentosUso || anamnese.internacoes) && (
                <>
                  <InfoSection title="Antecedentes Pessoais">
                    {anamnese.doencasPreexistentes && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Doenças Preexistentes:</p>
                        <p className="text-sm whitespace-pre-wrap text-muted-foreground">{anamnese.doencasPreexistentes}</p>
                      </div>
                    )}
                    {anamnese.cirurgiasAnteriores && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Cirurgias Anteriores:</p>
                        <p className="text-sm whitespace-pre-wrap text-muted-foreground">{anamnese.cirurgiasAnteriores}</p>
                      </div>
                    )}
                    {anamnese.alergias && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Alergias:</p>
                        <p className="text-sm whitespace-pre-wrap text-muted-foreground">{anamnese.alergias}</p>
                      </div>
                    )}
                    {anamnese.medicamentosUso && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Medicamentos em Uso:</p>
                        <p className="text-sm whitespace-pre-wrap text-muted-foreground">{anamnese.medicamentosUso}</p>
                      </div>
                    )}
                    {anamnese.internacoes && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Internações Anteriores:</p>
                        <p className="text-sm whitespace-pre-wrap text-muted-foreground">{anamnese.internacoes}</p>
                      </div>
                    )}
                  </InfoSection>
                  <Separator />
                </>
              )}

              {/* Antecedentes Familiares */}
              {anamnese.historiaFamiliar && (
                <>
                  <InfoSection title="Antecedentes Familiares">
                    <p className="text-sm whitespace-pre-wrap">{anamnese.historiaFamiliar}</p>
                  </InfoSection>
                  <Separator />
                </>
              )}

              {/* Hábitos de Vida */}
              {(anamnese.tabagismo || anamnese.etilismo || anamnese.atividadeFisica || anamnese.alimentacao || anamnese.sono) && (
                <>
                  <InfoSection title="Hábitos de Vida">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {anamnese.tabagismo && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Tabagismo:</p>
                          <p className="text-sm whitespace-pre-wrap text-muted-foreground">{anamnese.tabagismo}</p>
                        </div>
                      )}
                      {anamnese.etilismo && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Etilismo:</p>
                          <p className="text-sm whitespace-pre-wrap text-muted-foreground">{anamnese.etilismo}</p>
                        </div>
                      )}
                    </div>
                    {anamnese.atividadeFisica && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Atividade Física:</p>
                        <p className="text-sm whitespace-pre-wrap text-muted-foreground">{anamnese.atividadeFisica}</p>
                      </div>
                    )}
                    {anamnese.alimentacao && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Alimentação:</p>
                        <p className="text-sm whitespace-pre-wrap text-muted-foreground">{anamnese.alimentacao}</p>
                      </div>
                    )}
                    {anamnese.sono && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Sono:</p>
                        <p className="text-sm whitespace-pre-wrap text-muted-foreground">{anamnese.sono}</p>
                      </div>
                    )}
                  </InfoSection>
                  <Separator />
                </>
              )}

              {/* Revisão de Sistemas */}
              {(anamnese.cardiovascular || anamnese.respiratorio || anamnese.gastrointestinal || anamnese.geniturinario || anamnese.neurologico || anamnese.musculoesqueletico) && (
                <>
                  <InfoSection title="Revisão de Sistemas">
                    {anamnese.cardiovascular && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Sistema Cardiovascular:</p>
                        <p className="text-sm whitespace-pre-wrap text-muted-foreground">{anamnese.cardiovascular}</p>
                      </div>
                    )}
                    {anamnese.respiratorio && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Sistema Respiratório:</p>
                        <p className="text-sm whitespace-pre-wrap text-muted-foreground">{anamnese.respiratorio}</p>
                      </div>
                    )}
                    {anamnese.gastrointestinal && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Sistema Gastrointestinal:</p>
                        <p className="text-sm whitespace-pre-wrap text-muted-foreground">{anamnese.gastrointestinal}</p>
                      </div>
                    )}
                    {anamnese.geniturinario && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Sistema Geniturinário:</p>
                        <p className="text-sm whitespace-pre-wrap text-muted-foreground">{anamnese.geniturinario}</p>
                      </div>
                    )}
                    {anamnese.neurologico && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Sistema Neurológico:</p>
                        <p className="text-sm whitespace-pre-wrap text-muted-foreground">{anamnese.neurologico}</p>
                      </div>
                    )}
                    {anamnese.musculoesqueletico && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Sistema Musculoesquelético:</p>
                        <p className="text-sm whitespace-pre-wrap text-muted-foreground">{anamnese.musculoesqueletico}</p>
                      </div>
                    )}
                  </InfoSection>
                  <Separator />
                </>
              )}

              {/* Observações */}
              {anamnese.observacoes && (
                <InfoSection title="Observações Gerais">
                  <p className="text-sm whitespace-pre-wrap">{anamnese.observacoes}</p>
                </InfoSection>
              )}
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
