import React, { createRef, useCallback, useEffect, useState } from "react";
import Quill, { BoundsStatic, RangeStatic, StringMap } from "quill";
import ReactQuill from "react-quill";
import { useQuery } from "@tanstack/react-query";
import { throttle } from "lodash";

import { CustomBlot, IgnoreBlot } from "./blots";
import { SuggestionsDropdown } from "./SuggestionsDropdown";
import { Lang } from "./App";

const regex = /\S+(?=\s)*/g;

Quill.register("formats/error", CustomBlot);
Quill.register("formats/ignore", IgnoreBlot);

type Token = {
  token: string;
  index: number;
  length: number;
  range: [number, number];
  format?: StringMap & { error?: true };
};
type SuggestionMenuData = {
  range: RangeStatic;
  bounds: BoundsStatic;
  misspelledWord?: string;
};
type SuggestionResponse = { original: string; suggestions: string[] }[];

type EditorProps = {
  lang: Lang;
  placeholder?: string;
  defaultValue?: string;
};
export const Editor: React.FC<EditorProps> = ({
  lang,
  placeholder,
  defaultValue,
}) => {
  const [tokens, setTokens] = useState<Token[]>([]);

  const [inMisspelledWordRange, setInMisspelledWordRange] = useState(false);
  const [suggestionsMenuData, setSuggestionsMenuData] = useState<
    SuggestionMenuData | undefined
  >();

  const [suggestions, setSuggestions] = useState<SuggestionResponse>([]);

  const [dictionary, setDictionary] = useState<string[]>([]);

  const quillRef = createRef<ReactQuill>();

  const { refetch } = useQuery(
    ["search", tokens.map((t) => t.token)],
    () => {
      const formData = new FormData();
      formData.append("lang", lang);
      formData.append(
        "text",
        quillRef.current?.editor?.getText().slice(0, -1) || ""
      );

      const url = "/search";
      // const url = "http://35.197.120.214:5000/api/v1/spell";
      // const url = "http://localhost:8000/spell/check";

      return fetch(url, {
        method: "POST",
        body: formData,
      }).then((r) => r.json());
    },
    {
      enabled: false,
    }
  );

  useEffect(() => {
    const editor = quillRef.current?.editor;
    if (suggestions?.length) {
      for (const token of tokens) {
        if (
          !dictionary.includes(token.token) &&
          suggestions.find((s) => s.original === token.token)
        ) {
          editor?.formatText(token.index, token.length, "error", true);
        } else {
          quillRef.current?.editor?.removeFormat(token.index, token.length);
        }
      }
    }
  }, [quillRef, tokens, suggestions, dictionary]);

  // const handleContextMenu = useCallback(
  //   (e: MouseEvent) => {
  //     if (inMisspelledWordRange) {
  //       e.preventDefault();
  //     }
  //   },
  //   [quillRef, inMisspelledWordRange]
  // );

  useEffect(() => {
    const editor = quillRef.current?.editor;

    editor?.root.setAttribute("spellcheck", "false");

    editor?.clipboard.addMatcher(Node.ELEMENT_NODE, (node) => {
      const Delta2 = Quill.import("delta");
      return new Delta2().insert(node.innerText);
    });

    // editor?.root.addEventListener("contextmenu", handleContextMenu);
  }, [quillRef]);

  const getSuggestions = useCallback(
    throttle(
      async () => {
        const { data } = await refetch();
        // console.log(data);
        setSuggestions(data);
      },
      1500,
      { trailing: true, leading: false }
    ),
    []
  );

  const onEditorChange: ReactQuill["onEditorChangeText"] = (
    content,
    delta,
    source,
    { getText}
  ) => {
    if (
      delta.ops?.[1]?.insert === " " &&
      delta.ops?.[1]?.attributes?.["error"]
    ) {
      quillRef.current?.editor?.formatText(
        delta.ops?.[0].retain || 0,
        1,
        "error",
        false
      );
    }

    const matches = getText().slice(0, -1).matchAll(regex)!;

    const result: typeof tokens = [];
    for (const match of matches) {
      result.push({
        token: match[0],
        index: match.index!,
        length: match[0].length,
        range: [match.index!, match.index! + match[0].length],
        format: quillRef.current?.editor?.getFormat(
          match.index!,
          match[0].length
        ),
      });
    }
    setTokens(result);
    console.log(result);

    getSuggestions();
  };

  const onSelectionChange: ReactQuill["onEditorChangeSelection"] = (
    selection,
    source,
    { getBounds }
  ) => {
    if (!selection?.index || selection.length) {
      setInMisspelledWordRange(false);
      setSuggestionsMenuData(undefined);
      return;
    }

    const format: (StringMap & { error?: boolean }) | undefined =
      quillRef.current?.editor?.getFormat(selection);
    const bounds = getBounds(selection?.index);
    const token = tokens.find(
      (t) => t.range[0] <= selection.index && selection.index <= t.range[1]
    );
    const text = token?.token;

    console.log(format);

    const clientRect = quillRef.current?.editor?.root.getBoundingClientRect();

    setInMisspelledWordRange(Boolean(format && format["error"]));
    setSuggestionsMenuData({
      range: { index: token?.index || 0, length: token?.length || 0 },
      bounds: {
        ...bounds,
        left: (clientRect?.left || 0) + bounds.left,
        top: (clientRect?.top || 0) + bounds.top,
      },
      misspelledWord: text,
    });
  };

  const handleSuggestionClick = useCallback(
    (text: string, range: RangeStatic) => {
      const editor = quillRef.current?.editor;
      editor?.deleteText(range.index, range.length, "user");
      editor?.insertText(range.index, text, "user");
      editor?.setSelection(range.index + text.length, 0, "user");
      setSuggestionsMenuData(undefined);
    },
    [quillRef]
  );

  const handleAddToDictionaryClick = useCallback((text: string) => {
    setDictionary((state) => [...state, text]);
    setSuggestionsMenuData(undefined);
  }, []);

  const handleIgnoreClick = useCallback(
    (range: RangeStatic) => {
      console.log(range);
      // quillRef.current?.editor?.removeFormat(range.index, range.length);
      quillRef.current?.editor?.formatText(range, "ignore", "user");
      setSuggestionsMenuData(undefined);
    },
    [quillRef]
  );

  return (
    <>
      {inMisspelledWordRange && suggestionsMenuData && (
        <>
          <SuggestionsDropdown
            text={suggestionsMenuData.misspelledWord || ""}
            range={suggestionsMenuData.range}
            bounds={suggestionsMenuData.bounds}
            items={
              suggestions
                ?.find(
                  ({ original }) =>
                    original === suggestionsMenuData.misspelledWord
                )
                ?.suggestions.map((s) => ({ suggestion: s })) || []
            }
            onSelectSuggestion={handleSuggestionClick}
            onAddToDictionary={handleAddToDictionaryClick}
            onIgnore={handleIgnoreClick}
          />
        </>
      )}

      <ReactQuill
        ref={quillRef}
        theme="snow"
        placeholder={placeholder}
        modules={{ toolbar: false }}
        formats={["underline", "error", "ignore"]}
        onChange={onEditorChange}
        onChangeSelection={onSelectionChange}
        onBlur={() => setSuggestionsMenuData(undefined)}
        defaultValue={defaultValue}
      />
    </>
  );
};
