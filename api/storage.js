import { get, put, del } from "@vercel/blob";

export const config = {
  runtime: "edge",
};

const COLLECTION_PATHS = {
  quotations: "ember-pricing/v1/quotations.json",
  pricingRules: "ember-pricing/v1/pricing-rules.json",
  categories: "ember-pricing/v1/categories.json",
  shippingMethods: "ember-pricing/v1/shipping-methods.json",
  appPreferences: "ember-pricing/v1/app-preferences.json",
};

function json(response, status = 200) {
  return new Response(JSON.stringify(response), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
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

export default async function handler(request) {
  const pathname = getCollectionPath(request.url);

  if (!pathname) {
    return json({ error: "Unknown storage collection." }, 400);
  }

  try {
    if (request.method === "GET") {
      const data = await readJsonBlob(pathname);
      return json({ data });
    }

    if (request.method === "PUT") {
      const body = await request.json();
      await put(pathname, JSON.stringify(body.data ?? null), {
        access: "private",
        allowOverwrite: true,
        contentType: "application/json",
        cacheControlMaxAge: 60,
      });
      return json({ ok: true });
    }

    if (request.method === "DELETE") {
      await del(pathname);
      return json({ ok: true });
    }

    return json({ error: "Method not allowed." }, 405);
  } catch (error) {
    console.error("Vercel Blob storage error", error);
    return json(
      {
        error:
          "Storage is unavailable. Check that the Vercel Blob store is connected and credentials are configured.",
      },
      503,
    );
  }
}
