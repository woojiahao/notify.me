import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import Layout from "../components/Layout";
import { Project } from "../models/project";

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <div className="flex flex-row justify-between items-center mb-2">
        <p className="text-xl font-bold">{project.name}</p>
        <FiEdit size={20} />
      </div>
      <p>{project.users.length} users involved</p>
      <p className="italic text-gray-500">
        Created by: {project.createdBy.name}
      </p>
    </div>
  );
}

function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <div className="text-center">
        <p>You do not have any projects, let's change that!</p>
        <button
          type="button"
          className="mt-6 p-2 px-4 bg-aquamarine rounded-md font-bold"
        >
          Create Project
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-x-4">
      {projects.map((project) => (
        <ProjectCard project={project} key={project.id} />
      ))}
    </div>
  );
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async () => {
      setProjects([
        {
          id: "1",
          name: "Project Mentor AY23/24",
          createdBy: {
            id: "1",
            name: "John",
            email: "john@gmail.com",
          },
          createdAt: new Date(),
          users: [
            {
              id: "1",
              name: "John",
              email: "john@gmail.com",
              role: "member",
            },
          ],
        },
        {
          id: "2",
          name: "Project Mentor AY23/24",
          createdBy: {
            id: "1",
            name: "John",
            email: "john@gmail.com",
          },
          createdAt: new Date(),
          users: [
            {
              id: "1",
              name: "John",
              email: "john@gmail.com",
              role: "member",
            },
          ],
        },
        {
          id: "3",
          name: "Project Mentor AY23/24",
          createdBy: {
            id: "1",
            name: "John",
            email: "john@gmail.com",
          },
          createdAt: new Date(),
          users: [
            {
              id: "1",
              name: "John",
              email: "john@gmail.com",
              role: "member",
            },
          ],
        },
      ]);
    };
  }, []);

  return (
    <Layout>
      <h1 className="mb-4">Projects</h1>
      <ProjectGrid projects={projects} />
    </Layout>
  );
}
