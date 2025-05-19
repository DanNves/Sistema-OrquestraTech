
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define event types with status and dates
interface EventWithDate {
  name: string;
  date: Date;
  status: 'Confirmado' | 'Pendente' | 'Cancelado';
}

const EventCalendar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
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
      date: new Date(2025, 4, 19), // May 19, 2025 (today)
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

  return (
    <Card className="transition-all duration-300 card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-800">Calendário de Eventos</CardTitle>
        <CalendarCheck className="h-5 w-5 text-primary-600" />
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="p-3 pointer-events-auto border rounded-md bg-white"
              showOutsideDays={true}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
            />
          </div>
          
          {/* Legend for calendar events */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-100 border border-green-500 mr-2"></div>
              <span className="text-xs">Confirmado</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-400 mr-2"></div>
              <span className="text-xs">Pendente</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-100 border border-red-500 mr-2"></div>
              <span className="text-xs">Cancelado</span>
            </div>
          </div>
          
          {/* Show event for selected date if it exists */}
          {date && events.some(event => 
            event.date.getDate() === date.getDate() && 
            event.date.getMonth() === date.getMonth() && 
            event.date.getFullYear() === date.getFullYear()
          ) && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <h4 className="font-medium text-sm">Eventos nesta data:</h4>
              {events
                .filter(event => 
                  event.date.getDate() === date.getDate() && 
                  event.date.getMonth() === date.getMonth() && 
                  event.date.getFullYear() === date.getFullYear()
                )
                .map((event, index) => (
                  <div key={index} className="flex items-center justify-between mt-2">
                    <span className="text-sm">{event.name}</span>
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
                ))
              }
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCalendar;
