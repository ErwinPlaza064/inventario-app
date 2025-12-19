export type TaskStatus = "Pendiente" | "EnProceso" | "Completada";

export interface Tarea {
  id?: number;
  titulo: string;
  descripcion?: string;
  estado: TaskStatus;
  fechaCreacion?: string;
}
