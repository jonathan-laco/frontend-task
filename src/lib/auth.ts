import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "completed";
  userId: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export class AuthService {
  static getToken(): string | null {
    if (typeof window === "undefined") return null;
    return Cookies.get("token") || null;
  }

  static setToken(token: string): void {
    Cookies.set("token", token, { expires: 1 });
  }

  static removeToken(): void {
    Cookies.remove("token");
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static getUserData(): User | null {
    const userJSON = localStorage.getItem("user");
    if (!userJSON) return null;

    try {
      return JSON.parse(userJSON) as User;
    } catch {
      return null;
    }
  }

  static setUserData(user: User): void {
    localStorage.setItem("user", JSON.stringify(user));
  }

  static removeUserData(): void {
    localStorage.removeItem("user");
  }

  static async login(data: LoginData): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao fazer login");
    }

    const result = await response.json();
    this.setToken(result.token);
    this.setUserData(result.user);
    return result;
  }

  static async register(
    data: RegisterData
  ): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao criar conta");
    }

    const result = await response.json();
    this.setToken(result.token);
    this.setUserData(result.user);
    return result;
  }

  static async getTasks(): Promise<Task[]> {
    const token = this.getToken();
    if (!token) throw new Error("Token não encontrado");

    const response = await fetch(`${API_URL}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar tarefas");
    }

    const tasks = await response.json();

    return tasks.map((task: any) => ({
      ...task,
      status: task.status === "PENDING" ? "pending" : "completed",
    }));
  }

  static async createTask(task: Omit<Task, "id" | "userId">): Promise<Task> {
    const token = this.getToken();
    if (!token) throw new Error("Token não encontrado");

    const taskData = {
      ...task,
      status: task.status === "pending" ? "PENDING" : "DONE",
    };

    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar tarefa");
    }

    return response.json();
  }

  static async updateTask(id: string, task: Partial<Task>): Promise<void> {
    const token = this.getToken();
    if (!token) throw new Error("Token não encontrado");

    console.log("Updating task with ID:", id, "Data:", task);

    const updateData: any = {};
    if (task.title !== undefined) updateData.title = task.title;
    if (task.description !== undefined)
      updateData.description = task.description;
    if (task.status !== undefined) {
      updateData.status = task.status === "pending" ? "PENDING" : "DONE";
    }
    if (task.dueDate !== undefined) updateData.dueDate = task.dueDate;

    console.log("Sending update data:", updateData);

    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Update task error response:", errorText);
      throw new Error("Erro ao atualizar tarefa");
    }

    const result = await response.json();
    console.log("Update response:", result);
  }

  static async deleteTask(id: string): Promise<void> {
    const token = this.getToken();
    if (!token) throw new Error("Token não encontrado");

    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar tarefa");
    }
  }

  static logout(): void {
    this.removeToken();
    this.removeUserData();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  }
}
