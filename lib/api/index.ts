export { createClient, ApiClientError } from "./client";
export { documentsApi } from "./documents";
export { categoriesApi } from "./categories";
export type * from "./types";

import { createClient } from "./client";
import { documentsApi } from "./documents";
import { categoriesApi } from "./categories";

export function createApiClient(token?: string) {
  const client = createClient(token);
  return {
    documents: documentsApi(client),
    categories: categoriesApi(client),
  };
}
