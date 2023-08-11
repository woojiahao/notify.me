import User from "./user";

export interface Project {
  id: string;
  name: string;
  created_by: User;
  created_at: Date;
  updated_by?: User;
  updated_at?: Date;
  users: ProjectUser[];
}

export interface ProjectUser extends User {
  role: "admin" | "member" | "viewer";
}
