import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

export interface AnamneseData {
  id: string;
  createdAt: string;
  
  // Dados Pessoais
  nomeCompleto: string;
  dataNascimento: string;
  idade: string;
  sexo: string;
  estadoCivil: string;
  profissao: string;
  telefone: string;
  email: string;
  endereco: string;
  
  // Queixa Principal
  queixaPrincipal: string;
  
  // História da Doença Atual
  historiaDoencaAtual: string;
  dataInicio: string;
  evolucao: string;
  
  // Antecedentes Pessoais
  doencasPreexistentes: string;
  cirurgiasAnteriores: string;
  alergias: string;
  medicamentosUso: string;
  internacoes: string;
  
  // Antecedentes Familiares
  historiaFamiliar: string;
  
  // Hábitos de Vida
  tabagismo: string;
  etilismo: string;
  atividadeFisica: string;
  alimentacao: string;
  sono: string;
  
  // Revisão de Sistemas
  cardiovascular: string;
  respiratorio: string;
  gastrointestinal: string;
  geniturinario: string;
  neurologico: string;
  musculoesqueletico: string;
  
  // Observações
  observacoes: string;
}

interface AnamneseFormProps {
  onSubmit: (data: AnamneseData) => void;
  onCancel: () => void;
}

export function AnamneseForm({ onSubmit, onCancel }: AnamneseFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Omit<AnamneseData, 'id' | 'createdAt'>>();

  const onFormSubmit = (data: Omit<AnamneseData, 'id' | 'createdAt'>) => {
    const anamneseData: AnamneseData = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    onSubmit(anamneseData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Tabs defaultValue="pessoais" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="pessoais">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="queixa">Queixa</TabsTrigger>
          <TabsTrigger value="antecedentes">Antecedentes</TabsTrigger>
          <TabsTrigger value="habitos">Hábitos</TabsTrigger>
          <TabsTrigger value="revisao">Revisão</TabsTrigger>
          <TabsTrigger value="obs">Observações</TabsTrigger>
        </TabsList>

        {/* Dados Pessoais */}
        <TabsContent value="pessoais" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
              <CardDescription>Informações básicas do paciente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                  <Input
                    id="nomeCompleto"
                    {...register("nomeCompleto", { required: true })}
                    placeholder="Nome completo do paciente"
                  />
                  {errors.nomeCompleto && <span className="text-sm text-red-500">Campo obrigatório</span>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    {...register("dataNascimento", { required: true })}
                  />
                  {errors.dataNascimento && <span className="text-sm text-red-500">Campo obrigatório</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idade">Idade</Label>
                  <Input
                    id="idade"
                    {...register("idade")}
                    placeholder="Ex: 35 anos"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sexo</Label>
                  <RadioGroup defaultValue="masculino" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="masculino" id="masculino" {...register("sexo")} />
                      <Label htmlFor="masculino">Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="feminino" id="feminino" {...register("sexo")} />
                      <Label htmlFor="feminino">Feminino</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estadoCivil">Estado Civil</Label>
                  <Input
                    id="estadoCivil"
                    {...register("estadoCivil")}
                    placeholder="Ex: Solteiro(a)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profissao">Profissão</Label>
                  <Input
                    id="profissao"
                    {...register("profissao")}
                    placeholder="Profissão do paciente"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    {...register("telefone", { required: true })}
                    placeholder="(00) 00000-0000"
                  />
                  {errors.telefone && <span className="text-sm text-red-500">Campo obrigatório</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    {...register("endereco")}
                    placeholder="Endereço completo"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Queixa e História */}
        <TabsContent value="queixa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Queixa Principal</CardTitle>
              <CardDescription>Motivo da consulta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="queixaPrincipal">Queixa Principal *</Label>
                <Textarea
                  id="queixaPrincipal"
                  {...register("queixaPrincipal", { required: true })}
                  placeholder="Descreva o principal motivo da consulta"
                  rows={3}
                />
                {errors.queixaPrincipal && <span className="text-sm text-red-500">Campo obrigatório</span>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>História da Doença Atual</CardTitle>
              <CardDescription>Detalhes sobre a condição atual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="historiaDoencaAtual">História da Doença Atual</Label>
                <Textarea
                  id="historiaDoencaAtual"
                  {...register("historiaDoencaAtual")}
                  placeholder="Descrição detalhada da história da doença atual"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataInicio">Data de Início</Label>
                  <Input
                    id="dataInicio"
                    type="date"
                    {...register("dataInicio")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evolucao">Evolução</Label>
                  <Input
                    id="evolucao"
                    {...register("evolucao")}
                    placeholder="Ex: Progressiva, Estável, Regressiva"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Antecedentes */}
        <TabsContent value="antecedentes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Antecedentes Pessoais</CardTitle>
              <CardDescription>História médica pregressa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doencasPreexistentes">Doenças Preexistentes</Label>
                <Textarea
                  id="doencasPreexistentes"
                  {...register("doencasPreexistentes")}
                  placeholder="Ex: Hipertensão, Diabetes, etc."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cirurgiasAnteriores">Cirurgias Anteriores</Label>
                <Textarea
                  id="cirurgiasAnteriores"
                  {...register("cirurgiasAnteriores")}
                  placeholder="Descreva cirurgias realizadas anteriormente"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alergias">Alergias</Label>
                <Textarea
                  id="alergias"
                  {...register("alergias")}
                  placeholder="Alergias medicamentosas, alimentares, etc."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicamentosUso">Medicamentos em Uso</Label>
                <Textarea
                  id="medicamentosUso"
                  {...register("medicamentosUso")}
                  placeholder="Liste os medicamentos em uso contínuo"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="internacoes">Internações Anteriores</Label>
                <Textarea
                  id="internacoes"
                  {...register("internacoes")}
                  placeholder="Histórico de internações"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Antecedentes Familiares</CardTitle>
              <CardDescription>História de doenças na família</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="historiaFamiliar">História Familiar</Label>
                <Textarea
                  id="historiaFamiliar"
                  {...register("historiaFamiliar")}
                  placeholder="Doenças importantes na família (pais, irmãos, avós)"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hábitos de Vida */}
        <TabsContent value="habitos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hábitos de Vida</CardTitle>
              <CardDescription>Estilo de vida e hábitos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tabagismo">Tabagismo</Label>
                  <Textarea
                    id="tabagismo"
                    {...register("tabagismo")}
                    placeholder="Ex: Não fumante / Fumante (quantidade/dia)"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="etilismo">Etilismo</Label>
                  <Textarea
                    id="etilismo"
                    {...register("etilismo")}
                    placeholder="Ex: Não etilista / Uso social / Frequência"
                    rows={2}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="atividadeFisica">Atividade Física</Label>
                <Textarea
                  id="atividadeFisica"
                  {...register("atividadeFisica")}
                  placeholder="Tipo e frequência de atividades físicas"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alimentacao">Alimentação</Label>
                <Textarea
                  id="alimentacao"
                  {...register("alimentacao")}
                  placeholder="Padrão alimentar e restrições"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sono">Sono</Label>
                <Textarea
                  id="sono"
                  {...register("sono")}
                  placeholder="Qualidade e quantidade de sono"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revisão de Sistemas */}
        <TabsContent value="revisao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revisão de Sistemas</CardTitle>
              <CardDescription>Sintomas por sistemas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardiovascular">Sistema Cardiovascular</Label>
                <Textarea
                  id="cardiovascular"
                  {...register("cardiovascular")}
                  placeholder="Dor precordial, palpitações, edema, etc."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="respiratorio">Sistema Respiratório</Label>
                <Textarea
                  id="respiratorio"
                  {...register("respiratorio")}
                  placeholder="Tosse, dispneia, chiado, etc."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gastrointestinal">Sistema Gastrointestinal</Label>
                <Textarea
                  id="gastrointestinal"
                  {...register("gastrointestinal")}
                  placeholder="Náuseas, vômitos, diarreia, constipação, etc."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="geniturinario">Sistema Geniturinário</Label>
                <Textarea
                  id="geniturinario"
                  {...register("geniturinario")}
                  placeholder="Disúria, hematúria, alterações menstruais, etc."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neurologico">Sistema Neurológico</Label>
                <Textarea
                  id="neurologico"
                  {...register("neurologico")}
                  placeholder="Cefaleia, tonturas, parestesias, etc."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="musculoesqueletico">Sistema Musculoesquelético</Label>
                <Textarea
                  id="musculoesqueletico"
                  {...register("musculoesqueletico")}
                  placeholder="Dores articulares, limitações de movimento, etc."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Observações */}
        <TabsContent value="obs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Observações Gerais</CardTitle>
              <CardDescription>Informações adicionais relevantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  {...register("observacoes")}
                  placeholder="Informações adicionais, impressões clínicas, etc."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar Anamnese
        </Button>
      </div>
    </form>
  );
}
