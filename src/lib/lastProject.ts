const LAST_PROJECT_KEY = "reflectai_last_project";

export const lastProjectStorage = {
  get(): string | null {
    return localStorage.getItem(LAST_PROJECT_KEY);
  },
  set(projectId: string): void {
    localStorage.setItem(LAST_PROJECT_KEY, projectId);
  },
  clear(): void {
    localStorage.removeItem(LAST_PROJECT_KEY);
  },
};
