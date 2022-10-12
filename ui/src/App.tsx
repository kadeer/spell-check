import React from "react";

import { Editor } from "./Editor";

import "react-quill/dist/quill.snow.css";
import "./App.css";

export type Lang = "en" | "fr" | "it";

const config: {
  lang: Lang;
  label: string;
  initialValue?: string;
}[] = [
  {
    lang: "fr",
    label: "Entrez du texte",
    initialValue: "merce",
  },
  {
    lang: "en",
    label: "Enter some text here",
    initialValue: "spedy and abd smoky spedy",
  },
  { lang: "it", label: "Inserisci del testo" },
];

function App() {
  return (
    <div className="App">
      {config.map(({ lang, label, initialValue }) => (
        <div key={lang} style={{ marginBottom: 32 }}>
          <div style={{ textAlign: "right" }}>
            <strong
              style={{
                backgroundColor: "#eee",
                padding: 2,
              }}
            >
              {lang}
            </strong>
          </div>
          <Editor lang={lang} placeholder={label} defaultValue={initialValue} />
        </div>
      ))}
    </div>
  );
}

export default App;
