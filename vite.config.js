import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import storageHandler from "./api/storage.js";

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => resolve(Buffer.concat(chunks)));
    request.on("error", reject);
  });
}

function apiStorageDevPlugin() {
  return {
    name: "api-storage-dev",
    configureServer(server) {
      server.middlewares.use("/api/storage", async (request, response) => {
        try {
          const origin = `http://${request.headers.host ?? "127.0.0.1:5173"}`;
          const headers = new Headers();
          Object.entries(request.headers).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              headers.set(key, value.join(", "));
            } else if (value !== undefined) {
              headers.set(key, value);
            }
          });
          const body = ["GET", "HEAD"].includes(request.method)
            ? undefined
            : await readRequestBody(request);
          const requestUrl = request.originalUrl ?? `/api/storage${request.url ?? ""}`;
          const webRequest = new Request(`${origin}${requestUrl}`, {
            method: request.method,
            headers,
            body,
          });
          const webResponse = await storageHandler(webRequest);
          response.statusCode = webResponse.status;
          webResponse.headers.forEach((value, key) => response.setHeader(key, value));
          response.end(Buffer.from(await webResponse.arrayBuffer()));
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
