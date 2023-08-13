import { Editor } from "@monaco-editor/react";

export default function RichTextEditor() {
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
    />
  );
}
