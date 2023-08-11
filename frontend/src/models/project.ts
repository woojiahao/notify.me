import User from "./user";

export interface Project {
  id: string;
  name: string;
  createdBy: User;
  createdAt: Date;
  updatedBy?: User;
  updatedAt?: Date;
  users: ProjectUser[];
}

export interface ProjectUser extends User {
  role: "admin" | "member" | "viewer";
}
