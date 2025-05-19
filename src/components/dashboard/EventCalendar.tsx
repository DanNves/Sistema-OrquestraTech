
import React, { useState } from 'react';
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
  name: string;
  date: Date;
  status: 'Confirmado' | 'Pendente' | 'Cancelado';
}

const EventCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  
  // Sample events data with actual Date objects
  const events: EventWithDate[] = [
    {
      name: 'Workshop de Mixagem',
      date: new Date(2025, 4, 21), // May 21, 2025
      status: 'Confirmado',
    },
    {
      name: 'Curso de Produção',
      date: new Date(2025, 4, 24), // May 24, 2025
      status: 'Pendente',
    },
    {
      name: 'Encontro Técnico',
      date: new Date(2025, 4, 27), // May 27, 2025
      status: 'Confirmado',
    },
    {
      name: 'Webinar Audio',
      date: new Date(2025, 4, 19), // May 19, 2025
      status: 'Cancelado',
    },
  ];

  // Function to add custom styling to dates with events
  const modifiersStyles = {
    confirmado: { backgroundColor: '#F2FCE2', borderColor: '#4ade80', color: '#166534' },
    pendente: { backgroundColor: '#FEF7CD', borderColor: '#fde68a', color: '#854d0e' },
    cancelado: { backgroundColor: '#FEE2E2', borderColor: '#f87171', color: '#991b1b' },
  };

  // Create modifiers for the calendar to apply styles to specific dates
  const modifiers = {
    confirmado: events
      .filter(event => event.status === 'Confirmado')
      .map(event => new Date(event.date)),
    pendente: events
      .filter(event => event.status === 'Pendente')
      .map(event => new Date(event.date)),
    cancelado: events
      .filter(event => event.status === 'Cancelado')
      .map(event => new Date(event.date))
  };

  // Helper function to get events for a specific date
  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return events.filter(event => 
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

  return (
    <Card className="transition-all duration-300 card-hover h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-800">Calendário de Eventos</CardTitle>
        <CalendarCheck className="h-5 w-5 text-primary-600" />
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-row gap-2">
          {/* Calendar - Expanded with more width */}
          <div className="flex-grow w-[85%]">
            <Popover open={showPopover} onOpenChange={setShowPopover}>
              <PopoverTrigger asChild>
                <div className="cursor-default w-full">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    className="p-4 pointer-events-auto border rounded-md bg-white w-full max-w-none scale-110 origin-left"
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
          
          {/* Legend for calendar events - Further reduced width */}
          <div className="flex flex-col justify-start mt-4 space-y-3 min-w-[80px] w-[15%]">
            <h3 className="text-sm font-medium text-gray-700">Legenda</h3>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-100 border-2 border-green-500 mr-2"></div>
              <span className="text-xs">Confirmado</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-100 border-2 border-yellow-400 mr-2"></div>
              <span className="text-xs">Pendente</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-100 border-2 border-red-500 mr-2"></div>
              <span className="text-xs">Cancelado</span>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Clique em uma data para ver os eventos.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCalendar;
