import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import storageHandler from "./api/storage.js";

function apiStorageDevPlugin() {
  return {
    name: "api-storage-dev",
    configureServer(server) {
      server.middlewares.use("/api/storage", async (request, response) => {
        try {
          request.url = request.originalUrl ?? `/api/storage${request.url ?? ""}`;
          await storageHandler(request, response);
        } catch (error) {
          response.statusCode = 500;
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify({ error: error.message }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiStorageDevPlugin()],
});
