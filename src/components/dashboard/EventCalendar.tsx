import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from "@/components/ui/popover";

// Define event types with status and dates
interface EventWithDate {
  id?: string;
  nome?: string;
  name?: string;
  dataInicio?: string;
  date?: Date;
  status: 'Confirmado' | 'Pendente' | 'Cancelado' | 'Em Andamento' | string;
}

interface EventCalendarProps {
  events: EventWithDate[];
}

function DigitalClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[120px]">
      <span className="text-4xl font-mono font-bold text-blue-700 tracking-widest">
        {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
      <span className="text-sm text-gray-500 mt-1">
        {time.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
      </span>
    </div>
  );
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  
  // Adaptar datas para o calendário
  const eventsWithDate = events.map(ev => ({
    ...ev,
    date: ev.dataInicio ? new Date(ev.dataInicio) : ev.date
  }));

  // Function to add custom styling to dates with events
  const modifiersStyles = {
    confirmado: { backgroundColor: '#F2FCE2', borderColor: '#4ade80', color: '#166534' },
    pendente: { backgroundColor: '#FEF7CD', borderColor: '#fde68a', color: '#854d0e' },
    cancelado: { backgroundColor: '#FEE2E2', borderColor: '#f87171', color: '#991b1b' },
  };

  // Modifiers para o calendário
  const modifiers = {
    confirmado: eventsWithDate.filter(event => event.status === 'Confirmado').map(event => event.date),
    pendente: eventsWithDate.filter(event => event.status === 'Pendente').map(event => event.date),
    cancelado: eventsWithDate.filter(event => event.status === 'Cancelado').map(event => event.date),
    andamento: eventsWithDate.filter(event => event.status === 'Em Andamento').map(event => event.date),
  };

  // Helper para eventos do dia
  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return eventsWithDate.filter(event =>
      event.date &&
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  // Handle date selection
  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setSelectedDate(newDate);
      // Only show popover if there are events for this date
      setShowPopover(getEventsForDate(newDate).length > 0);
    } else {
      setShowPopover(false);
    }
  };

  // Calcular resumo do mês
  const total = eventsWithDate.length;
  const confirmados = eventsWithDate.filter(e => e.status === 'Confirmado').length;
  const pendentes = eventsWithDate.filter(e => e.status === 'Pendente').length;
  const cancelados = eventsWithDate.filter(e => e.status === 'Cancelado').length;

  return (
    <Card className="transition-all duration-300 card-hover h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-800">Calendário de Eventos</CardTitle>
        <CalendarCheck className="h-5 w-5 text-primary-600" />
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch w-full">
          {/* Calendário à esquerda */}
          <div className="flex-1 flex justify-center items-center">
            <Popover open={showPopover} onOpenChange={setShowPopover}>
              <PopoverTrigger asChild>
                <div className="cursor-default w-full">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    className="p-0 w-full max-w-none"
                    showOutsideDays={true}
                    modifiers={modifiers}
                    modifiersStyles={modifiersStyles}
                  />
                </div>
              </PopoverTrigger>
              {selectedDate && (
                <PopoverContent className="w-auto p-3 bg-white shadow-lg rounded-md" sideOffset={5}>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm mb-2">Eventos em {selectedDate.getDate()}/{selectedDate.getMonth() + 1}</h4>
                    {getEventsForDate(selectedDate).map((event, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium">{event.name}</span>
                        <Badge 
                          variant={
                            event.status === 'Confirmado' ? 'default' : 
                            event.status === 'Pendente' ? 'outline' : 'destructive'
                          }
                          className={
                            event.status === 'Confirmado' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                            event.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800 border-yellow-400 hover:bg-yellow-200' : 
                            'bg-red-100 text-red-800 hover:bg-red-200'
                          }
                        >
                          {event.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              )}
            </Popover>
          </div>
          {/* Relógio digital centralizado */}
          <div className="hidden lg:flex w-72 mx-4 items-center justify-center">
            <DigitalClock />
          </div>
          {/* Resumo do mês à direita */}
          <div className="w-full lg:w-1/3 mt-6 lg:mt-0 lg:ml-8 flex flex-col items-center justify-center">
            <div className="bg-white border border-blue-100 rounded-2xl px-8 py-6 text-center w-full max-w-xs transition-all">
              <div className="font-bold text-lg text-blue-700 mb-2 tracking-wide">Resumo do mês</div>
              <div className="flex flex-col gap-2 text-base">
                <span className="text-gray-700">Total: <b>{total}</b></span>
                <span className="text-green-600">Confirmados: <b>{confirmados}</b></span>
                <span className="text-yellow-600">Pendentes: <b>{pendentes}</b></span>
                <span className="text-red-600">Cancelados: <b>{cancelados}</b></span>
              </div>
            </div>
          </div>
        </div>
        {/* Legenda abaixo do calendário */}
        <div className="flex flex-row gap-6 justify-center w-full mt-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-400 inline-block"></span>
            <span>Confirmado</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
            <span>Pendente</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
            <span>Cancelado</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2 mb-2 text-center">Clique em uma data para ver os eventos agendados.</div>
      </CardContent>
    </Card>
  );
};

export default EventCalendar;