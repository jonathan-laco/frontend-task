import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/lib/auth';
import { Calendar, Trash2, Edit, Check, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: 'pending' | 'completed') => void;
}

export function TaskCard({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleStatus = async () => {
    setIsLoading(true);
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await onToggleStatus(task.id, newStatus);
    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return dateString;
    }
  };

  const isOverdue = () => {
    try {
      const dueDate = parseISO(task.dueDate);
      const today = new Date();
      return dueDate < today && task.status === 'pending';
    } catch (error) {
      console.error("Erro ao verificar se está atrasada:", error);
      return false;
    }
  };

  const overdue = isOverdue();

  return (
    <Card className={`transition-all hover:shadow-md ${task.status === 'completed' ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className={`text-lg ${task.status === 'completed' ? 'line-through' : ''}`}>
              {task.title}
            </CardTitle>
            <CardDescription className="mt-1">
              {task.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Badge variant={task.status === 'completed' ? 'default' : overdue ? 'destructive' : 'secondary'}>
              {task.status === 'completed' ? 'Concluída' : overdue ? 'Atrasada' : 'Pendente'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Vencimento: {formatDate(task.dueDate)}</span>
            {overdue && <Clock className="h-4 w-4 text-destructive" />}
          </div>
          
          <div className="flex items-center gap-2">
            {/* <Button
              variant={task.status === 'completed' ? "outline" : "default"}
              size="sm"
              onClick={handleToggleStatus}
              disabled={isLoading}
              className="gap-1"
            >
              <Check className="h-4 w-4" />
              {task.status === 'completed' ? 'Reabrir' : 'Concluir'}
            </Button> */}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(task)}
              className="gap-1"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="gap-1 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
