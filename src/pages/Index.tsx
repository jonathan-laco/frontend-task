import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { AuthService, Task } from "@/lib/auth";
import { TaskDialog } from "@/components/TaskDialog";
import { TaskCard } from "@/components/TaskCard";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, LogOut, Plus } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [userData, setUserData] = useState(AuthService.getUserData());
  
  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    const currentUser = AuthService.getUserData();
    if (currentUser) {
      setUserData(currentUser);
    }
    
    loadTasks();
  }, [navigate]);

  const loadTasks = async () => {
    try {
      const taskData = await AuthService.getTasks();
      setTasks(taskData);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as tarefas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'userId'>) => {
    try {
      console.log('Creating task:', taskData);
      await AuthService.createTask(taskData);
      toast({
        title: "Sucesso",
        description: "Tarefa criada com sucesso!",
      });
      loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a tarefa",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (taskData: Omit<Task, 'id' | 'userId'>, taskId: string) => {
    try {
      console.log('Updating task with ID:', taskId, 'Data:', taskData);
      await AuthService.updateTask(taskId, taskData);
      toast({
        title: "Sucesso",
        description: "Tarefa atualizada com sucesso!",
      });
      loadTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    
    try {
      await AuthService.deleteTask(id);
      toast({
        title: "Sucesso",
        description: "Tarefa excluída com sucesso!",
      });
      loadTasks();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a tarefa",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (id: string, status: 'pending' | 'completed') => {
    try {
      console.log('Toggling status for task ID:', id, 'New status:', status);
      await AuthService.updateTask(id, { status });
      toast({
        title: "Sucesso",
        description: `Tarefa ${status === 'completed' ? 'concluída' : 'reaberta'}!`,
      });
      loadTasks();
    } catch (error) {
      console.error('Error toggling task status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da tarefa",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = (task: Task) => {
    console.log('Setting task for editing:', task);
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'userId'>, taskId?: string) => {
    console.log('handleSaveTask called with:', { taskData, taskId, editingTask });
    
    if (editingTask && editingTask.id) {
      await handleUpdateTask(taskData, editingTask.id);
    } else if (taskId) {
      await handleUpdateTask(taskData, taskId);
    } else {
      await handleCreateTask(taskData);
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    pending: tasks.filter(task => task.status === 'pending').length,
    overdue: tasks.filter(task => 
      new Date(task.dueDate) < new Date() && task.status === 'pending'
    ).length,
  };

  const getInitials = (name: string): string => {
    if (!name) return "U";
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = () => {
    AuthService.logout();
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando tarefas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Task Manager
              </h1>
              <p className="text-sm text-muted-foreground">
                Organize suas atividades
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Nova Tarefa
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{userData ? getInitials(userData.name) : "U"}</AvatarFallback>
                    </Avatar>
                    <span>{userData?.name || "Usuário"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">tarefas cadastradas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">tarefas finalizadas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">tarefas em andamento</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              <p className="text-xs text-muted-foreground">tarefas vencidas</p>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Suas Tarefas</h2>
            {tasks.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {tasks.length} tarefa{tasks.length !== 1 ? 's' : ''} encontrada{tasks.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {tasks.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="mb-2">Nenhuma tarefa encontrada</CardTitle>
                <CardDescription className="mb-4">
                  Comece criando sua primeira tarefa para organizar suas atividades.
                </CardDescription>
                <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Criar primeira tarefa
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Task Dialog */}
      <TaskDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        task={editingTask}
        onSave={handleSaveTask}
      />
    </div>
  );
}
