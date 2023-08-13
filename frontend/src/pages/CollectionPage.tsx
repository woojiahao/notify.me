import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout, { LayoutTitle } from "../components/Layout";
import Collection from "../models/collection";
import CollectionTableView from "../components/CollectionTableView";
export default function CollectionPage() {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState<Collection | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(collectionId);
    setCollection({
      id: "1",
      name: "Mentors",
      entry_identifiers: ["First Name", "Last Name"],
      project_id: "2",
      columns: [
        "First Name",
        "Last Name",
        "Telegram",
        "Email",
        "Email1",
        "Email2",
        "Email3",
        "Email4",
        "Email5",
        "Email6",
        "Email7",
      ],
      entries: [
        {
          id: "1",
          contents: JSON.stringify({
            "First Name": "John",
            "Last Name": "Doe",
            Telegram: "@dearjohn",
            Email: "john@gmail.com",
            Email1: "john@gmail.com",
            Email2: "john@gmail.com",
            Email3: "john@gmail.com",
            Email4: "john@gmail.com",
            Email5: "john@gmail.com",
            Email6: "john@gmail.com",
            Email7: "john@gmail.com",
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

  return (
    <Layout>
      <LayoutTitle title={`Collection: ${collection.name}`}>
        <button
          onClick={() => navigate(`/collections/${collection.id}/blast/create`)}
          type="button"
          className="p-2 px-4 border-2 border-kelly-green rounded-md font-bold hover:bg-kelly-green hover:text-white transition-all"
        >
          Create Blast
        </button>
        <button
          type="button"
          className="p-2 px-4 border-2 border-aquamarine rounded-md font-bold hover:bg-aquamarine hover:text-white transition-all"
        >
          Edit Collection
        </button>
        <button
          type="button"
          className="p-2 px-4 border-2 border-salmon rounded-md font-bold hover:bg-salmon hover:text-white transition-all"
        >
          Delete Collection
        </button>
      </LayoutTitle>
      <div className="p-4">
        <CollectionTableView collection={collection} />
      </div>
    </Layout>
  );
}
