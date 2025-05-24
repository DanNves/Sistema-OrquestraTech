export interface Avaliacao {
  id: string;
  eventoId: string; // ID of the Evento
  avaliadorId: string; // ID of the Usuario (avaliador)
  equipeId: string; // ID of the Equipe being evaluated
  notas: Record<string, number>; // Example: { "criterio1": 10, "criterio2": 8 }
  comentarios?: string;
  dataAvaliacao: Date;
  // Adicionar outros campos relevantes conforme necessário
}
