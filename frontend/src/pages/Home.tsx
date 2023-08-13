import { FormEvent, useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Popup from "reactjs-popup";
import api from "../api/api";
import Layout, { LayoutTitle } from "../components/Layout";
import { useUserContext } from "../contexts/UserContext";
import { Project } from "../models/project";

function CreateProjectButton({
  setReload,
}: {
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user, isLoading } = useUserContext();
  const [open, setOpen] = useState(false);

  async function submitHandler(e: FormEvent) {
    e.preventDefault();
    setOpen(false);
    if (!isLoading) {
      const data = e.target as typeof e.target & {
        nameInput: { value: string };
      };
      try {
        const response = await api.post("/project", {
          name: data.nameInput.value,
          user_id: user.id,
        });
        if (response.status === 200) {
          const body = response.data as Project;
          toast(`Project "${body.name}" created!`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setReload(true);
        }
      } catch (e) {
        toast.error(
          "Something went wrong with the project creation. Please contact me@woojiahao.com for more assistance.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      }
    }
  }

  return (
    <div>
      <button
        type="button"
        className="p-2 px-4 border-2 font-bold border-aquamarine rounded-md hover:bg-aquamarine hover:text-white transition-all"
        onClick={() => setOpen((o) => !o)}
      >
        Create Project
      </button>
      <Popup open={open} modal>
        <div
          className="w-screen h-screen backdrop-blur-sm flex justify-center items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white p-8 rounded-md shadow-md flex flex-col h-fit gap-y-8 my-16 w-[50%] mx-auto"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div>
              <h1>Create Project</h1>
              <p className="text-gray-400">
                Creating a new project makes you the admin!
              </p>
            </div>

            <form
              action="post"
              onSubmit={submitHandler}
              className="flex flex-col gap-y-8"
            >
              <div className="flex flex-col">
                <label htmlFor="nameInput">Project Name</label>
                <input
                  id="nameInput"
                  type="name"
                  className="border rounded-md p-2 text-gray-500"
                  required
                />
              </div>

              <div className="flex flex-row justify-between items-center">
                <button
                  type="button"
                  className="bg-salmon p-2 px-4 rounded-md"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-aquamarine p-2 px-4 rounded-md"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </Popup>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate();

  return (
    <div
      className="p-4 bg-white rounded-md shadow-md hover:shadow-lg hover:cursor-pointer"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
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
        <p>Click on the "Create Project" button above and get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-x-4 gap-y-4">
      {projects.map((project) => (
        <ProjectCard project={project} key={project.id} />
      ))}
    </div>
  );
}

export default function Home() {
  const { user, isLoading } = useUserContext();
  const [projects, setProjects] = useState<Project[]>([]);
  const [reload, setReload] = useState(false);
  const [searchParams] = useSearchParams();

  async function loadProjects() {
    try {
      const response = await api.get(`/user/${user.id}/projects`);
      if (response.status === 200) {
        const body = response.data as Project[];
        setProjects(body);
      }
    } catch (e) {
      setProjects([]);
    }
  }

  useEffect(() => {
    if (searchParams.has("error")) {
      toast.error(`Error occurred: ${searchParams.get("error")}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setReload(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (reload) {
      (async () => {
        await loadProjects();
        setReload(false);
      })();
    }
  }, [reload]);

  return (
    <Layout>
      <LayoutTitle title="Projects">
        <CreateProjectButton setReload={setReload} />
      </LayoutTitle>
      <div className="p-4">
        <ProjectGrid projects={projects} />
      </div>
    </Layout>
  );
}
