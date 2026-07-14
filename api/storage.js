import { get, put, del } from "@vercel/blob";

const COLLECTION_PATHS = {
  quotations: "ember-pricing/v1/quotations.json",
  pricingRules: "ember-pricing/v1/pricing-rules.json",
  categories: "ember-pricing/v1/categories.json",
  shippingMethods: "ember-pricing/v1/shipping-methods.json",
  appPreferences: "ember-pricing/v1/app-preferences.json",
};

function createJsonResponse(response, status = 200) {
  return new Response(JSON.stringify(response), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function sendJson(response, payload, status = 200) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

function getCollectionPath(requestUrl) {
  const { searchParams } = new URL(requestUrl);
  const collection = searchParams.get("collection");
  return COLLECTION_PATHS[collection];
}

async function readJsonBlob(pathname) {
  try {
    const result = await get(pathname, {
      access: "private",
      useCache: false,
    });

    if (!result || result.statusCode === 404) {
      return null;
    }

    const text = await new Response(result.stream).text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    if (error?.statusCode === 404 || error?.name === "BlobNotFoundError") {
      return null;
    }

    throw error;
  }
}

async function readNodeRequestBody(request) {
  if (request.body) {
    return typeof request.body === "string" ? JSON.parse(request.body) : request.body;
  }

  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => {
      const text = Buffer.concat(chunks).toString("utf8");
      resolve(text ? JSON.parse(text) : {});
    });
    request.on("error", reject);
  });
}

function getNodeRequestUrl(request) {
  if (request.url.startsWith("http")) {
    return request.url;
  }

  const host = request.headers.host ?? "localhost";
  return `https://${host}${request.url}`;
}

async function handleStorageRequest({ url, method, body }) {
  const pathname = getCollectionPath(url);

  if (!pathname) {
    return { payload: { error: "Unknown storage collection." }, status: 400 };
  }

  try {
    if (method === "GET") {
      const data = await readJsonBlob(pathname);
      return { payload: { data }, status: 200 };
    }

    if (method === "PUT") {
      await put(pathname, JSON.stringify(body.data ?? null), {
        access: "private",
        allowOverwrite: true,
        contentType: "application/json",
        cacheControlMaxAge: 60,
      });
      return { payload: { ok: true }, status: 200 };
    }

    if (method === "DELETE") {
      await del(pathname);
      return { payload: { ok: true }, status: 200 };
    }

    return { payload: { error: "Method not allowed." }, status: 405 };
  } catch (error) {
    console.error("Vercel Blob storage error", error);
    return {
      payload: {
        error:
          "Storage is unavailable. Check that the Vercel Blob store is connected and credentials are configured.",
      },
      status: 503,
    };
  }
}

export async function handleWebStorageRequest(request) {
  const body = request.method === "PUT" ? await request.json() : undefined;
  const result = await handleStorageRequest({
    url: request.url,
    method: request.method,
    body,
  });

  return createJsonResponse(result.payload, result.status);
}

export default async function handler(request, response) {
  if (!response) {
    return handleWebStorageRequest(request);
  }

  const body = request.method === "PUT" ? await readNodeRequestBody(request) : undefined;
  const result = await handleStorageRequest({
    url: getNodeRequestUrl(request),
    method: request.method,
    body,
  });

  sendJson(response, result.payload, result.status);
}
