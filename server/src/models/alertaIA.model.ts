export interface AlertaIA {
  id: string;
  tipo: 'Ausência' | 'Baixa Pontuação' | 'Inscrição Baixa' | 'Sugestão';
  mensagem: string;
  data: Date;
  eventoRelacionadoId?: string;
  read: boolean;
  created_at: Date;
}
