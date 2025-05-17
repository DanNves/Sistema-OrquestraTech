
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CalendarCheck } from "lucide-react";

const EventCalendar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Card className="transition-all duration-300 card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-800">Calendário de Eventos</CardTitle>
        <CalendarCheck className="h-5 w-5 text-primary-600" />
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="p-3 pointer-events-auto border rounded-md bg-white"
            showOutsideDays={true}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCalendar;
