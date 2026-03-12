import { apiRequest } from "@/api/client";
import type { Project, CreateProjectValues } from "../schemas/project";

export async function getProjectsApi(): Promise<Project[]> {
  return apiRequest<Project[]>("/projects");
}

export async function getProjectApi(id: string): Promise<Project> {
  return apiRequest<Project>(`/projects/${id}`);
}

export async function createProjectApi(values: CreateProjectValues): Promise<Project> {
  return apiRequest<Project>("/projects", {
    method: "POST",
    body: JSON.stringify(values),
  });
}
