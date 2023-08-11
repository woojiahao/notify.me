export default interface Collection {
  id: string;
  name: string;
  entry_identifiers: string[];
  project_id: string;
  entries: Entry[];
}

export interface Entry {
  id: string;
  contents: string;
  collection_id: string;
}
