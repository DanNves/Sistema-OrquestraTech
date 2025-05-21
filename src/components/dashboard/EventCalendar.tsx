
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
    confirmado: { backgroundColor: '#1a3d1a', borderColor: '#4ade80', color: '#fff' },
    pendente: { backgroundColor: '#3f3415', borderColor: '#fde68a', color: '#fff' },
    cancelado: { backgroundColor: '#3d1a1a', borderColor: '#f87171', color: '#fff' },
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
        <CardTitle className="text-lg font-semibold text-white">Calendário de Eventos</CardTitle>
        <CalendarCheck className="h-5 w-5 text-blue-400" />
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-row gap-6">
          {/* Calendar - Expanded to take more width */}
          <div className="flex-1">
            <Popover open={showPopover} onOpenChange={setShowPopover}>
              <PopoverTrigger asChild>
                <div className="cursor-default w-full">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    className="p-0 w-full max-w-none text-gray-200"
                    showOutsideDays={true}
                    modifiers={modifiers}
                    modifiersStyles={modifiersStyles}
                  />
                </div>
              </PopoverTrigger>
              {selectedDate && (
                <PopoverContent className="w-auto p-3 bg-[#131b2e] border border-[#1f2b45] shadow-lg rounded-md" sideOffset={5}>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm mb-2 text-white">Eventos em {selectedDate.getDate()}/{selectedDate.getMonth() + 1}</h4>
                    {getEventsForDate(selectedDate).map((event, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-gray-200">{event.name}</span>
                        <Badge 
                          variant={
                            event.status === 'Confirmado' ? 'default' : 
                            event.status === 'Pendente' ? 'outline' : 'destructive'
                          }
                          className={
                            event.status === 'Confirmado' ? 'bg-green-900/50 text-green-400 border-green-400' : 
                            event.status === 'Pendente' ? 'bg-yellow-900/50 text-yellow-400 border-yellow-400' : 
                            'bg-red-900/50 text-red-400 border-red-400'
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
          
          {/* Legend for calendar events - Moved to the right */}
          <div className="flex flex-col justify-start mt-4 space-y-3 min-w-[120px]">
            <h3 className="text-sm font-medium text-gray-200">Legenda</h3>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-900/50 border-2 border-green-500 mr-2"></div>
              <span className="text-sm text-gray-300">Confirmado</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-yellow-900/50 border-2 border-yellow-400 mr-2"></div>
              <span className="text-sm text-gray-300">Pendente</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-900/50 border-2 border-red-500 mr-2"></div>
              <span className="text-sm text-gray-300">Cancelado</span>
            </div>
            <div className="mt-4 text-xs text-gray-400">
              Clique em uma data para ver os eventos agendados.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCalendar;
