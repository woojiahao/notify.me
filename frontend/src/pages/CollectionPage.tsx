import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout, { LayoutTitle } from "../components/Layout";
import Collection from "../models/collection";
import CollectionTableView from "../components/CollectionTableView";
import api from "../api/api";
export default function CollectionPage() {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState<Collection | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get(`/collection/${collectionId}`);
        if (response.status === 404) {
          // Not found
          navigate({
            pathname: "/",
            search: `?error=Collection ${collectionId} not found`,
          });
        } else if (response.status === 200) {
          const collection = response.data as Collection;
          console.log(response.data);
          setCollection(collection);
        }
      } catch (e) {
        navigate({
          pathname: "/",
          search: `?error=Invalid collection ${collectionId}`,
        });
      }
    })();
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
