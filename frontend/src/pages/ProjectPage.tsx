import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import Layout from "../components/Layout";
import { Project } from "../models/project";
import { FiEdit } from "react-icons/fi";
import Collection from "../models/collection";

function CollectionItem({ collection }: { collection: Collection }) {
  return (
    <div className="bg-slate-100 p-4 rounded-md hover:cursor-pointer shadow hover:shadow-md">
      <p className="font-bold mb-2">{collection.name}</p>
      <p className="text-sm text-gray-500">
        Entries: <span>{collection.entries.length}</span>
      </p>
      <p className="text-sm text-gray-500">
        {collection.entry_identifiers.join(" - ")}
      </p>
    </div>
  );
}

function CollectionsSection({ collections }: { collections: Collection[] }) {
  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h2>Collections</h2>
        <button type="button" className="p-2 px-4 bg-aquamarine rounded-md">
          Create collection
        </button>
      </div>
      {collections.length === 0 ? (
        <div className="text-center bg-white p-4 rounded-md mt-4 shadow-md">
          <p>You have no collections.</p>
          <p>Create one above!</p>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-md mt-4 grid grid-cols-3 gap-4 shadow-md">
          {collections.map((collection) => (
            <CollectionItem collection={collection} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get(`/project/${projectId}`);
        if (response.status === 200) {
          const body = response.data as Project;
          setProject(body);
        }
      } catch (e) {
        navigate({
          pathname: "/",
          search: "?error=Project not found",
        });
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setCollections([
        {
          id: "1",
          name: "Mentors",
          entry_identifiers: ["First Name", "Last Name"],
          project_id: "2",
          entries: [
            {
              id: "1",
              contents: JSON.stringify({
                "First Name": "John",
                "Last Name": "Doe",
                Email: "john@gmail.com",
              }),
              collection_id: "1",
            },
            {
              id: "2",
              contents: JSON.stringify({
                "First Name": "Mary",
                "Last Name": "Anne",
                Email: "mary@gmail.com",
              }),
              collection_id: "1",
            },
          ],
        },
        {
          id: "2",
          name: "Mentors",
          entry_identifiers: ["First Name", "Last Name"],
          project_id: "2",
          entries: [
            {
              id: "1",
              contents: JSON.stringify({
                "First Name": "John",
                "Last Name": "Doe",
                Email: "john@gmail.com",
              }),
              collection_id: "2",
            },
          ],
        },
      ]);
    })();
  }, []);

  if (project === null) {
    return (
      <Layout>
        <h1>Project</h1>
        <p className="text-center my-8">
          We are loading the project, please be patient!
        </p>
      </Layout>
    );
  }

  // TODO: Add statistics monitoring below collections section
  return (
    <Layout>
      <div className="flex flex-row justify-between items-center mb-8">
        <h1>{project.name}</h1>
        <div className="p-3 bg-white rounded-full shadow-md hover:cursor-pointer hover:shadow-lg">
          <FiEdit size={24} />
        </div>
      </div>

      <CollectionsSection collections={collections} />
    </Layout>
  );
}
