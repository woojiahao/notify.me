import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import Layout from "../components/Layout";
import { Project } from "../models/project";
import api from "../api/api";
import { useUserContext } from "../contexts/UserContext";

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <div className="flex flex-row justify-between items-center mb-2">
        <p className="text-xl font-bold">{project.name}</p>
        <FiEdit size={20} />
      </div>
      <p>{project.users.length} users involved</p>
      <p className="italic text-gray-500">
        Created by: {project.created_by.name}
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
    <div className="grid grid-cols-3 gap-x-4 gap-y-4">
      {projects.map((project) => (
        <ProjectCard project={project} key={project.id} />
      ))}
    </div>
  );
}

export default function Home() {
  const { user, isLoading } = useUserContext();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!isLoading) {
      (async () => {
        try {
          const response = await api.get(`/user/${user.id}/projects`);
          if (response.status === 200) {
            const body = response.data as Project[];
            setProjects(body);
          }
        } catch (e) {
          setProjects([]);
        }
      })();
    }
  }, [isLoading]);

  return (
    <Layout>
      <h1 className="mb-4">Projects</h1>
      <ProjectGrid projects={projects} />
    </Layout>
  );
}
