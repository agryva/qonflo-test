import http from '@/lib/http';
import type { AuditLog } from '@/components/task-manager/types';

export const AuditService = {
  async getAll(): Promise<AuditLog[]> {
    const { data } = await http.get<{ logs: AuditLog[] }>('/audit-logs');
    return data.logs;
  },

  async getByTask(taskId: string): Promise<AuditLog[]> {
    const { data } = await http.get<{ logs: AuditLog[] }>(
      `/tasks/${taskId}/audit-logs`,
    );
    return data.logs;
  },
};
