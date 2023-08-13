import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Collection from "../models/collection";

function CollectionTableView({ collection }: { collection: Collection }) {
  // Generate the table dynamically using the columns and the values, for columns with optional
  // values, we simply replace with blanks if not present in current entry
  const columns = collection.columns;
  const parsedContents = collection.entries.map((entry) =>
    JSON.parse(entry.contents)
  );

  return (
    <div className="overflow-x-auto rounded-md shadow-md bg-white">
      <table className="w-full rounded-md border-collapse border-black border-x-2">
        <tr>
          {columns.map((col) => (
            <th className="border-collapse rounded-md border-x-2 border-black p-4">
              {col}
            </th>
          ))}
        </tr>
        {parsedContents.map((contents) => (
          <tr>
            {columns.map((col) => (
              <td className="border-collapse rounded-md border-black border-x-2 border-y-2 p-4">
                {contents[col]}
              </td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
}

export default function CollectionPage() {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState<Collection | null>(null);

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
        <h1>Collection</h1>
        <p className="text-center my-8">
          We are loading the collection, please be patient!
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="mb-4">Collection</h1>
      <CollectionTableView collection={collection} />
    </Layout>
  );
}
