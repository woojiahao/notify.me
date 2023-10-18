import Collection from "../models/collection";

export default function CollectionTableView({
  collection,
}: {
  collection: Collection;
}) {
  // Generate the table dynamically using the columns and the values, for columns with optional
  // values, we simply replace with blanks if not present in current entry
  const columns = collection.columns;
  const contents = collection.entries.map((entry) => entry.contents);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="w-full">
        <input
          className="w-full p-2 px-4 rounded-md border-2 border-slate-200"
          type="text"
          name="searchNameInput"
          id="searchNameInput"
          placeholder="Search collection by name"
        />
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full rounded-md bg-white">
          <thead>
            <tr>
              {columns.map((col) => (
                <th>
                  {`${col}${
                    collection.entry_identifiers.includes(col) ? "*" : ""
                  }`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contents.map((c) => (
              <tr>
                {columns.map((col) => (
                  <td>{c[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
