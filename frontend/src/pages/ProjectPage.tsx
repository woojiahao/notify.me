import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  HiOutlineDownload,
  HiOutlinePencil,
  HiOutlineTrash,
  HiSelector,
} from "react-icons/hi";
import { Link, useNavigate, useParams } from "react-router-dom";
import Popup from "reactjs-popup";
import api from "../api/api";
import Layout, { LayoutBody, LayoutTitle } from "../components/Layout";
import Collection from "../models/collection";
import { Project } from "../models/project";

function UploadCollectionButton() {
  const [open, setOpen] = useState(false);
  const collectionNameRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(<T extends File>(acceptedFiles: T[]) => {
    // Do something with the files
    setFile(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
  });

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        type="button"
        className="p-2 px-4 border-2 border-kelly-green rounded-md font-bold hover:bg-kelly-green hover:text-white transition-all"
      >
        Upload Collection
      </button>
      <Popup open={open} modal>
        <div className="modal-background" onClick={() => setOpen(false)}>
          <div
            className="modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div>
              <h1>Upload Collection</h1>
              <p className="text-gray-400">
                Configure how to handle the collection.
              </p>
              <p className="text-gray-400">
                notify.me supports <strong>.csv</strong> files only at the
                moment
              </p>
            </div>

            <div>
              <label
                htmlFor="collectionNameInput"
                className="font-bold text-xl"
              >
                Collection Name
              </label>
              <input
                type="text"
                name="collectionNameInput"
                id="collectionNameInput"
                ref={collectionNameRef}
                placeholder="Collection name"
                required
              />
            </div>

            <div>
              <label htmlFor="fileDropzone" className="font-bold text-xl">
                Drop File
              </label>
              <p className="text-gray-400">
                notify.me supports <strong>.csv</strong> files only at the
                moment
              </p>
              <div
                {...getRootProps()}
                className="p-4 py-12 font-bold text-lg border-dotted border-8 bg-slate-100 rounded-md text-center hover:cursor-pointer"
              >
                <input {...getInputProps()} />
                {!file &&
                  (isDragActive ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  ))}
                {file && <p>Uploaded {file.name}. Click to replace.</p>}
              </div>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
}

function CollectionsSection({ collections }: { collections: Collection[] }) {
  return (
    <div>
      {collections.length === 0 ? (
        <div className="text-center bg-white p-4 rounded-md shadow-md">
          <p>You have no collections.</p>
          <p>Create one above!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-y-4 w-full">
          <div className="w-full">
            <input
              className="w-full p-2 px-4 rounded-md border-2 border-slate-200"
              type="text"
              name="searchNameInput"
              id="searchNameInput"
              placeholder="Search collections by name"
            />
          </div>

          <div className="w-full bg-white rounded-md">
            <table className="w-full">
              <thead>
                <tr>
                  <th>
                    <div className="flex flex-row gap-x-2 items-center">
                      Name <HiSelector />
                    </div>
                  </th>
                  <th>
                    <div className="flex flex-row gap-x-2 items-center">
                      # of Entries <HiSelector />
                    </div>
                  </th>
                  <th>
                    <div className="flex flex-row gap-x-2 items-center">
                      Identifiers <HiSelector />
                    </div>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {collections.map((collection) => (
                  <tr>
                    <td>
                      <Link
                        className="underline text-aquamarine"
                        to={`/collections/${collection.id}`}
                      >
                        {collection.name}
                      </Link>
                    </td>
                    <td>{collection.entries.length}</td>
                    <td>{collection.entry_identifiers.join(", ")}</td>
                    <td>
                      <div className="flex flex-row items-center gap-x-2">
                        <HiOutlinePencil
                          className="hover:cursor-pointer"
                          size={18}
                        />
                        <HiOutlineTrash
                          className="hover:cursor-pointer"
                          size={18}
                        />
                        <HiOutlineDownload
                          className="hover:cursor-pointer"
                          size={18}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
          columns: ["First Name", "Last Name", "Email"],
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
          columns: ["First Name", "Last Name", "Email"],
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
      <LayoutTitle title={`Project: ${project.name}`}>
        <UploadCollectionButton />
        <button
          type="button"
          className="p-2 px-4 border-2 border-aquamarine rounded-md font-bold hover:bg-aquamarine hover:text-white transition-all"
        >
          Edit Project
        </button>
      </LayoutTitle>
      <LayoutBody>
        <CollectionsSection collections={collections} />
      </LayoutBody>
    </Layout>
  );
}
