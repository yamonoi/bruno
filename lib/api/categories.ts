import type { ApiClient } from "./client";
import type {
  DocumentCategoryRead,
  DocumentCategoryHierarchical,
  DocumentCategoryCreate,
  DocumentCategoryPartialUpdate,
} from "./types";

export function categoriesApi(client: ApiClient) {
  return {
    list(): Promise<DocumentCategoryHierarchical[]> {
      return client.get("/api/v1/conversation/document-categories");
    },

    get(categoryId: number): Promise<DocumentCategoryRead> {
      return client.get(`/api/v1/conversation/document-categories/${categoryId}`);
    },

    create(data: DocumentCategoryCreate): Promise<DocumentCategoryRead> {
      return client.post("/api/v1/conversation/document-categories", data);
    },

    update(categoryId: number, data: DocumentCategoryPartialUpdate): Promise<DocumentCategoryRead> {
      return client.patch(`/api/v1/conversation/document-categories/${categoryId}`, data);
    },

    delete(categoryId: number): Promise<unknown> {
      return client.delete(`/api/v1/conversation/document-categories/${categoryId}`);
    },
  };
}
