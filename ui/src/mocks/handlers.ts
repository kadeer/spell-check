import { rest } from "msw";

type SearchRequest = { lang: string; text: string };
type SearchResponse = { original: string; suggestions: string[] }[];

export const handlers = [
  rest.post<SearchRequest, any, SearchResponse>(
    "/search",
    async (req, res, context) => {
      const { text } = await req?.body;

      const regex = /\S+(?=\s)*/g;
      const parts = text.match(regex) || [];

      let response: SearchResponse = [];
      if (parts.includes("abd")) {
        response = [
          {
            original: "abd",
            suggestions: ["bad", "and", "abs", "ab", "ad"],
          },
        ];
      }

      return res(context.status(200), context.json(response));
    }
  ),
];
