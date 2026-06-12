import http from '@/lib/http';
import type { Task } from '@/components/task-manager/types';

export const TaskService = {
  async list(): Promise<Task[]> {
    const { data } = await http.get<{ tasks: Task[] }>('/tasks');
    return data.tasks;
  },

  async create(
    title: string,
    description: string,
    actor: string,
  ): Promise<Task> {
    const { data } = await http.post<{ task: Task }>('/tasks', {
      title,
      description,
      actor,
    });
    return data.task;
  },

  async updateStatus(
    taskId: string,
    status: string,
    actor: string,
  ): Promise<Task> {
    const { data } = await http.put<{ task: Task }>(`/tasks/${taskId}/status`, {
      status,
      actor,
    });
    return data.task;
  },

  async remove(taskId: string): Promise<void> {
    await http.delete(`/tasks/${taskId}`);
  },
};
