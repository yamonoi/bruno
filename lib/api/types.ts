export type DocumentStatus = "draft" | "active";

export interface DocumentRead {
  id: number;
  user_id: string;
  name: string;
  mime_type: string;
  filename: string;
  tags: string[] | null;
  status: DocumentStatus;
  category_id: number;
  created_at: string;
  summary_text?: string | null;
}

export interface DocumentReadDetail extends DocumentRead {
  summary_text: string | null;
}

export interface DocumentPartialUpdate {
  name?: string | null;
  status?: DocumentStatus | null;
}

export interface DocumentUploadParams {
  name: string;
  category_id: number;
  file: File;
  tags?: string[] | null;
}

export interface PagedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ListDocumentsParams {
  category_id?: number | null;
  parent_category_id?: number | null;
  doc_status?: DocumentStatus | null;
  page?: number;
  size?: number;
}

export interface DocumentCategoryRead {
  id: number;
  name: string;
  user_id?: string | null;
  description?: string | null;
  parent_id?: number | null;
}

export interface DocumentCategoryHierarchical extends DocumentCategoryRead {
  children: DocumentCategoryHierarchical[];
}

export interface DocumentCategoryCreate {
  name: string;
  user_id?: string | null;
  description?: string | null;
  parent_id?: number | null;
}

export interface DocumentCategoryPartialUpdate {
  name?: string | null;
  description?: string | null;
}

export interface ApiError {
  detail?: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
    input?: unknown;
    ctx?: Record<string, unknown>;
  }>;
}
