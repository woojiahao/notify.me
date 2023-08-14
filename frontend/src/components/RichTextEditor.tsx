import { Editor } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

export default function RichTextEditor({
  onChange,
}: {
  onChange: (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent
  ) => void;
}) {
  return (
    <Editor
      height="100%"
      defaultLanguage="markdown"
      className="rounded-md"
      options={{
        fontSize: 16,
        fontFamily: "Fira Code",
        fontLigatures: true,
      }}
      onChange={onChange}
    />
  );
}
