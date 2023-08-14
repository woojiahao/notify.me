import { useEffect, useRef, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { useParams } from "react-router-dom";
import Popup from "reactjs-popup";
import CollectionTableView from "../components/CollectionTableView";
import Layout, {
  LayoutBody,
  LayoutTitle,
  LayoutTitleWithTitleActions,
} from "../components/Layout";
import Collection from "../models/collection";
import RichTextEditor from "../components/RichTextEditor";
import * as monaco from "monaco-editor";

function PreviewCollectionButton({ collection }: { collection: Collection }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setOpen((o) => !o)}>
        <AiFillEye size={24} />
      </button>
      <Popup open={open} modal>
        <div
          className="w-screen h-screen backdrop-blur-sm flex justify-center items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white p-8 rounded-md shadow-md flex flex-col h-fit gap-y-8 my-16 w-[80%] mx-auto"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div>
              <h1>Preview {collection.name}</h1>
              <p className="text-gray-400">Contents of {collection.name}</p>
            </div>

            <CollectionTableView collection={collection} />

            <button
              type="button"
              className="bg-salmon p-2 px-4 rounded-md"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
}

export default function CreateBlast() {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState<Collection | null>(null);
  const blastNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log(collectionId);
    setCollection({
      id: "1",
      name: "Mentors",
      entry_identifiers: ["First Name", "Last Name"],
      project_id: "2",
      columns: ["First Name", "Last Name", "Telegram", "Email"],
      entries: [
        {
          id: "1",
          contents: JSON.stringify({
            "First Name": "John",
            "Last Name": "Doe",
            Telegram: "@dearjohn",
            Email: "john@gmail.com",
          }),
          collection_id: "1",
        },
        {
          id: "2",
          contents: JSON.stringify({
            "First Name": "Mary",
            "Last Name": "Anne",
            Telegram: "@annabanna",
            Email: "mary@gmail.com",
          }),
          collection_id: "1",
        },
      ],
    });
  }, []);

  if (!collection) {
    return (
      <Layout>
        <LayoutTitle title="Collection"></LayoutTitle>
        <p className="text-center my-8">
          We are loading the collection, please be patient!
        </p>
      </Layout>
    );
  }

  function handleEditorChange(
    value: string | undefined,
    editor: monaco.editor.IModelContentChangedEvent
  ) {
    console.log(value);
    console.log(editor);
    // TODO: Save this as draft into the system
  }

  return (
    <Layout className="h-screen">
      <LayoutTitleWithTitleActions
        titleActions={
          <input
            ref={blastNameInputRef}
            type="text"
            name="blastNameInput"
            id="blastNameInput"
            placeholder="Enter blast name"
            defaultValue={`Blast for "${collection.name}"`}
            className="hover:cursor-pointer focus:hover:cursor-text font-bold w-full text-2xl bg-transparent focus:outline-none"
          />
        }
      >
        <PreviewCollectionButton collection={collection} />
        <button
          type="button"
          className="p-2 px-4 border-2 border-kelly-green rounded-md font-bold hover:bg-kelly-green hover:text-white transition-all"
        >
          Create
        </button>
        <button
          type="button"
          className="p-2 px-4 border-2 border-aquamarine rounded-md font-bold hover:bg-aquamarine hover:text-white transition-all"
        >
          Save Draft
        </button>
        <button
          type="button"
          className="p-2 px-4 border-2 border-salmon rounded-md font-bold hover:bg-salmon hover:text-white transition-all"
        >
          Discard
        </button>
      </LayoutTitleWithTitleActions>
      <LayoutBody className="h-full flex-grow">
        <RichTextEditor onChange={handleEditorChange} />
      </LayoutBody>
    </Layout>
  );
}
