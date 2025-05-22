
import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Edit, Trash2, Check, X, MoreHorizontal } from 'lucide-react';

interface Event {
  name: string;
  date: string;
  team: string;
  status: {
    text: string;
    bgColor: string;
    textColor: string;
  };
}

interface EventTableProps {
  events: Event[];
}

const EventTable: React.FC<EventTableProps> = ({ events }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Equipe
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {events.map((event, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-800">{event.name}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  {event.date}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  {event.team}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${event.status.bgColor} ${event.status.textColor}`}
                >
                  {event.status.text}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <div className="p-1 rounded-full hover:bg-gray-200">
                      <MoreHorizontal className="h-5 w-5 text-gray-500" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                      <Edit className="h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-600">
                      <Trash2 className="h-4 w-4" /> Excluir
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-green-600">
                      <Check className="h-4 w-4" /> Ativar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-gray-600">
                      <X className="h-4 w-4" /> Desativar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
