import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider, Container } from "@chakra-ui/react";

import App from "./App";

if (process.env.NODE_ENV === "development") {
  // const { worker } = await import("./mocks/browser");
  // worker.start();
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Container style={{ paddingTop: 120 }}>
          <App />
        </Container>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
