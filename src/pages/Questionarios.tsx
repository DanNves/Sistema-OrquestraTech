import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Mock de eventos para vincular
const eventosMock = [
  { id: 1, nome: 'Ensaio Geral' },
  { id: 2, nome: 'Culto Jovem' },
  { id: 3, nome: 'Reunião de Equipe' },
];

const tiposPergunta = [
  { value: 'texto', label: 'Resposta em Texto' },
  { value: 'multipla', label: 'Múltipla Escolha' },
  { value: 'checkbox', label: 'Caixa de Seleção (várias opções)' },
  { value: 'data', label: 'Data' },
  { value: 'nota', label: 'Nota/Escala' },
];

const Questionarios = () => {
  const [questionarios, setQuestionarios] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [novoQuestionario, setNovoQuestionario] = useState({
    titulo: '',
    eventoId: '',
    perguntas: [
      { texto: '', tipo: 'texto', opcoes: [''] }
    ]
  });

  // Adiciona nova pergunta
  const addPergunta = () => {
    setNovoQuestionario(q => ({
      ...q,
      perguntas: [...q.perguntas, { texto: '', tipo: 'texto', opcoes: [''] }]
    }));
  };

  // Remove pergunta
  const removePergunta = (idx: number) => {
    setNovoQuestionario(q => ({
      ...q,
      perguntas: q.perguntas.filter((_, i) => i !== idx)
    }));
  };

  // Atualiza pergunta
  const updatePergunta = (idx: number, field: string, value: any) => {
    setNovoQuestionario(q => {
      const perguntas = [...q.perguntas];
      perguntas[idx] = { ...perguntas[idx], [field]: value };
      // Limpa opções se mudar para texto
      if (field === 'tipo' && value === 'texto') perguntas[idx].opcoes = [''];
      return { ...q, perguntas };
    });
  };

  // Atualiza opção de múltipla escolha
  const updateOpcao = (idxPergunta: number, idxOpcao: number, value: string) => {
    setNovoQuestionario(q => {
      const perguntas = [...q.perguntas];
      const opcoes = [...perguntas[idxPergunta].opcoes];
      opcoes[idxOpcao] = value;
      perguntas[idxPergunta].opcoes = opcoes;
      return { ...q, perguntas };
    });
  };

  // Adiciona opção
  const addOpcao = (idxPergunta: number) => {
    setNovoQuestionario(q => {
      const perguntas = [...q.perguntas];
      perguntas[idxPergunta].opcoes.push('');
      return { ...q, perguntas };
    });
  };

  // Remove opção
  const removeOpcao = (idxPergunta: number, idxOpcao: number) => {
    setNovoQuestionario(q => {
      const perguntas = [...q.perguntas];
      perguntas[idxPergunta].opcoes = perguntas[idxPergunta].opcoes.filter((_, i) => i !== idxOpcao);
      return { ...q, perguntas };
    });
  };

  // Salva questionário
  const handleSalvar = () => {
    setQuestionarios(qs => [...qs, { ...novoQuestionario, id: Date.now() }]);
    setNovoQuestionario({ titulo: '', eventoId: '', perguntas: [{ texto: '', tipo: 'texto', opcoes: [''] }] });
    setIsDialogOpen(false);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <CardTitle className="text-2xl font-bold">Questionários</CardTitle>
            <CardDescription>Crie e gerencie questionários vinculados a eventos</CardDescription>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground mb-1">(Em desenvolvimento)</span>
            <Button variant="outline" className="border-dashed border-2 border-primary-300 text-primary-700 bg-primary-50 hover:bg-primary-100" disabled>
              <i className="fas fa-file-upload mr-2"></i>
              Importar Questionário via Arquivo
            </Button>
          </div>
          <Button className="md:self-end" onClick={() => setIsDialogOpen(true)}>
            Novo Questionário
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            {questionarios.length === 0 ? (
              <div className="text-muted-foreground">Nenhum questionário cadastrado ainda.</div>
            ) : (
              <div className="text-sm text-muted-foreground">Total de questionários: {questionarios.length}</div>
            )}
          </CardHeader>
          <CardContent>
            {questionarios.length === 0 ? (
              <div className="text-muted-foreground">Nenhum questionário cadastrado ainda.</div>
            ) : (
              <ul className="space-y-2">
                {questionarios.map(q => (
                  <li key={q.id} className="border rounded p-3">
                    <div className="font-semibold">{q.titulo}</div>
                    <div className="text-sm text-muted-foreground">Evento: {eventosMock.find(e => e.id === Number(q.eventoId))?.nome || '-'}</div>
                    <div className="text-xs mt-2">Perguntas: {q.perguntas.length}</div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Dialog de novo questionário */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Questionário</DialogTitle>
              <DialogDescription>Monte o questionário e vincule a um evento</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título do Questionário</label>
                <Input value={novoQuestionario.titulo} onChange={e => setNovoQuestionario(q => ({ ...q, titulo: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Evento Vinculado</label>
                <Select value={novoQuestionario.eventoId} onValueChange={eventoId => setNovoQuestionario(q => ({ ...q, eventoId }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o evento" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventosMock.map(ev => (
                      <SelectItem key={ev.id} value={String(ev.id)}>{ev.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Perguntas</label>
                <div className="space-y-4">
                  {novoQuestionario.perguntas.map((p, idx) => (
                    <div key={idx} className="border rounded p-4 bg-muted/30 shadow-sm">
                      <div className="flex flex-col md:flex-row gap-2 items-center mb-2">
                        <Input
                          className="flex-1"
                          placeholder={`Pergunta ${idx + 1}`}
                          value={p.texto}
                          onChange={e => updatePergunta(idx, 'texto', e.target.value)}
                        />
                        <Select value={p.tipo} onValueChange={tipo => updatePergunta(idx, 'tipo', tipo)}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {tiposPergunta.map(tp => (
                              <SelectItem key={tp.value} value={tp.value}>{tp.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {novoQuestionario.perguntas.length > 1 && (
                          <Button variant="destructive" size="icon" onClick={() => removePergunta(idx)} title="Remover pergunta">-</Button>
                        )}
                      </div>
                      {/* Opções para múltipla escolha e checkbox */}
                      {(p.tipo === 'multipla' || p.tipo === 'checkbox') && (
                        <div className="space-y-2 ml-2">
                          {p.opcoes.map((op: string, i: number) => (
                            <div key={i} className="flex gap-2 items-center">
                              <Input
                                className="flex-1"
                                placeholder={`Opção ${i + 1}`}
                                value={op}
                                onChange={e => updateOpcao(idx, i, e.target.value)}
                              />
                              {p.opcoes.length > 1 && (
                                <Button variant="destructive" size="icon" onClick={() => removeOpcao(idx, i)} title="Remover opção">-</Button>
                              )}
                            </div>
                          ))}
                          <Button variant="outline" size="sm" onClick={() => addOpcao(idx)}>Adicionar opção</Button>
                        </div>
                      )}
                      {/* Tipo data */}
                      {p.tipo === 'data' && (
                        <div className="ml-2 text-xs text-muted-foreground">O usuário deverá selecionar uma data.</div>
                      )}
                      {/* Tipo nota/escala */}
                      {p.tipo === 'nota' && (
                        <div className="ml-2 text-xs text-muted-foreground">O usuário deverá selecionar uma nota de 1 a 5.</div>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" onClick={addPergunta}>Adicionar Pergunta</Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSalvar}>Salvar Questionário</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Questionarios; 