import type { ApiClient } from "./client";
import type {
  DocumentRead,
  DocumentReadDetail,
  DocumentPartialUpdate,
  DocumentUploadParams,
  ListDocumentsParams,
  PagedResponse,
} from "./types";

export function documentsApi(client: ApiClient) {
  return {
    upload(params: DocumentUploadParams): Promise<DocumentRead> {
      const form = new FormData();
      form.append("name", params.name);
      form.append("category_id", String(params.category_id));
      form.append("file", params.file);
      if (params.tags) {
        params.tags.forEach((tag) => form.append("tags", tag));
      }
      return client.postForm("/api/v1/conversation/documents/upload", form);
    },

    list(params: ListDocumentsParams = {}): Promise<PagedResponse<DocumentRead>> {
      const query = new URLSearchParams();
      if (params.category_id != null) query.set("category_id", String(params.category_id));
      if (params.parent_category_id != null) query.set("parent_category_id", String(params.parent_category_id));
      if (params.doc_status != null) query.set("doc_status", params.doc_status);
      if (params.page != null) query.set("page", String(params.page));
      if (params.size != null) query.set("size", String(params.size));
      const qs = query.toString();
      return client.get(`/api/v1/conversation/documents${qs ? `?${qs}` : ""}`);
    },

    get(documentId: number): Promise<DocumentReadDetail> {
      return client.get(`/api/v1/conversation/documents/${documentId}`);
    },

    update(documentId: number, data: DocumentPartialUpdate): Promise<DocumentRead> {
      return client.patch(`/api/v1/conversation/documents/${documentId}`, data);
    },

    delete(documentId: number): Promise<void> {
      return client.delete(`/api/v1/conversation/documents/${documentId}`);
    },
  };
}
