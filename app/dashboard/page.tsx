"use client";

import { useState, useEffect, useCallback } from "react";
import { createApiClient } from "@/lib/api";
import type {
  DocumentCategoryHierarchical,
  DocumentRead,
  DocumentReadDetail,
  PagedResponse,
} from "@/lib/api/types";

import Sidebar from "./_components/Sidebar";
import CategoryTree from "./_components/CategoryTree";
import DocumentCard from "./_components/DocumentCard";
import DocumentView from "./_components/DocumentView";
import UploadModal from "./_components/UploadModal";
import AddCategoryModal from "./_components/AddCategoryModal";
import StatusFilter from "./_components/StatusFilter";
import type { StatusFilterValue } from "./_components/StatusFilter";
import ChatPanel from "./_components/ChatPanel";
import LinkedDocumentsModal from "./_components/LinkedDocumentsModal";

const api = createApiClient();
const PAGE_SIZE = 10;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findCategoryPath(
  categories: DocumentCategoryHierarchical[],
  categoryId: number,
): string[] {
  for (const cat of categories) {
    if (cat.id === categoryId) return [cat.name];
    if (cat.children.length > 0) {
      const childPath = findCategoryPath(cat.children, categoryId);
      if (childPath.length > 0) return [cat.name, ...childPath];
    }
  }
  return [];
}

function findCategory(
  categories: DocumentCategoryHierarchical[],
  categoryId: number,
): DocumentCategoryHierarchical | null {
  for (const cat of categories) {
    if (cat.id === categoryId) return cat;
    if (cat.children.length > 0) {
      const found = findCategory(cat.children, categoryId);
      if (found) return found;
    }
  }
  return null;
}

function getCategoryName(
  categories: DocumentCategoryHierarchical[],
  categoryId: number | null,
): string {
  if (categoryId === null) return "All Documents";
  const cat = findCategory(categories, categoryId);
  return cat?.name ?? "Documents";
}

function getBreadcrumbSegments(
  categories: DocumentCategoryHierarchical[],
  categoryId: number | null,
): string[] {
  if (categoryId === null) return ["All Documents"];
  return findCategoryPath(categories, categoryId);
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const [categories, setCategories] = useState<DocumentCategoryHierarchical[]>([]);
  const [documents, setDocuments] = useState<PagedResponse<DocumentRead> | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [chatOpen, setChatOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentReadDetail | null>(null);
  const [linkedDocsDocument, setLinkedDocsDocument] = useState<DocumentRead | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [docCountMap, setDocCountMap] = useState<Record<number, number>>({});
  const [allDocsTotal, setAllDocsTotal] = useState(0);

  // -----------------------------------------------------------------------
  // Data fetching
  // -----------------------------------------------------------------------

  const fetchDocCountMap = useCallback(async () => {
    try {
      // Fetch enough docs to build per-category counts
      const data = await api.documents.list({ size: 500 });
      setAllDocsTotal(data.total);
      const map: Record<number, number> = {};
      for (const doc of data.items) {
        map[doc.category_id] = (map[doc.category_id] ?? 0) + 1;
      }
      setDocCountMap(map);
    } catch {
      // non-critical, ignore
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.categories.list();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, []);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cat = selectedCategoryId !== null
        ? findCategory(categories, selectedCategoryId)
        : null;

      const isParent = cat ? cat.children.length > 0 : false;

      const params: Record<string, unknown> = {
        page: currentPage,
        size: PAGE_SIZE,
      };

      if (selectedCategoryId !== null) {
        if (isParent) {
          params.parent_category_id = selectedCategoryId;
        } else {
          params.category_id = selectedCategoryId;
        }
      }

      if (statusFilter === "active") {
        params.doc_status = "active";
      } else if (statusFilter === "in_process" || statusFilter === "new") {
        params.doc_status = "draft";
      }

      const data = await api.documents.list(params);
      setDocuments(data);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setError("Failed to load documents. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedCategoryId, statusFilter, currentPage, categories]);

  useEffect(() => {
    fetchCategories();
    fetchDocCountMap();
  }, [fetchCategories, fetchDocCountMap]);

  useEffect(() => {
    if (categories.length > 0 || selectedCategoryId === null) {
      fetchDocuments();
    }
  }, [fetchDocuments, categories.length, selectedCategoryId]);

  // -----------------------------------------------------------------------
  // Handlers
  // -----------------------------------------------------------------------

  const handleSelectCategory = (id: number | null) => {
    setSelectedCategoryId(id);
    setCurrentPage(1);
    setSelectedDocument(null);
  };

  const handleStatusChange = (status: StatusFilterValue) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleViewDocument = async (id: number) => {
    try {
      setLoading(true);
      const doc = await api.documents.get(id);
      setSelectedDocument(doc);
    } catch (err) {
      console.error("Failed to fetch document:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (params: {
    name: string;
    category_ids: number[];
    file: File;
  }) => {
    for (const category_id of params.category_ids) {
      await api.documents.upload({ name: params.name, category_id, file: params.file });
    }
    setUploadOpen(false);
    await fetchDocuments();
    await fetchCategories();
    await fetchDocCountMap();
  };

  const handleAddCategory = async (params: {
    name: string;
    parent_id?: number;
  }) => {
    await api.categories.create(params);
    setAddCategoryOpen(false);
    await fetchCategories();
  };

  // -----------------------------------------------------------------------
  // Derived
  // -----------------------------------------------------------------------

  const breadcrumb = getBreadcrumbSegments(categories, selectedCategoryId);
  const pageTitle = getCategoryName(categories, selectedCategoryId);
  const totalDocuments = documents?.total ?? 0;
  const totalPages = documents?.pages ?? 1;

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div
      className="flex min-h-screen"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        background: "#f9fafb",
      }}
    >
      {/* Narrow sidebar */}
      <Sidebar chatOpen={chatOpen} onToggleChat={() => setChatOpen((v) => !v)} />

      {/* Category tree panel */}
      <CategoryTree
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleSelectCategory}
        onAddCategory={() => setAddCategoryOpen(true)}
        allDocsTotal={allDocsTotal}
        docCountMap={docCountMap}
      />

      {/* Main content */}
      {selectedDocument ? (
        <DocumentView
          document={selectedDocument}
          categoryPath={findCategoryPath(categories, selectedDocument.category_id)}
          onBack={() => setSelectedDocument(null)}
        />
      ) : (
        <div className="flex-1 overflow-y-auto" style={{ background: "#f9fafb" }}>
          {/* Header area */}
          <div
            className="px-6 py-4 border-b border-[#e5e7eb]"
            style={{ background: "#ffffff" }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 text-xs mb-2" style={{ color: "#6b7280" }}>
              {breadcrumb.map((seg, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9ca3af"
                      strokeWidth="2.5"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                  <span
                    style={{
                      color: i === breadcrumb.length - 1 ? "#111827" : "#6b7280",
                      fontWeight: i === breadcrumb.length - 1 ? 500 : 400,
                    }}
                  >
                    {seg}
                  </span>
                </span>
              ))}
            </div>

            {/* Title row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1
                  className="text-lg font-semibold"
                  style={{ color: "#111827" }}
                >
                  {pageTitle}
                </h1>
                <StatusFilter
                  value={statusFilter}
                  onChange={handleStatusChange}
                  totalCount={totalDocuments}
                />
              </div>
              <button
                onClick={() => setUploadOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
                style={{
                  background: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Document
              </button>
            </div>
          </div>

          {/* Document list */}
          <div className="p-6">
            {loading && !documents && (
              <div className="flex items-center justify-center py-16">
                <div className="text-sm" style={{ color: "#6b7280" }}>
                  Loading documents...
                </div>
              </div>
            )}

            {error && (
              <div
                className="border rounded-lg p-4 mb-4 text-sm"
                style={{
                  background: "#fef2f2",
                  borderColor: "#fecaca",
                  color: "#dc2626",
                }}
              >
                {error}
              </div>
            )}

            {documents && documents.items.length === 0 && (
              <div className="text-center py-16">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#d1d5db"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto mb-3"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <p className="text-sm font-medium" style={{ color: "#6b7280" }}>
                  No documents found
                </p>
                <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
                  Upload a document to get started
                </p>
              </div>
            )}

            {documents &&
              documents.items.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  categoryPath={findCategoryPath(categories, doc.category_id)}
                  onView={handleViewDocument}
                  onLinkedDocs={(d) => setLinkedDocsDocument(d)}
                />
              ))}

            {/* Pagination */}
            {documents && totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#e5e7eb]">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors"
                  style={{
                    background: "#ffffff",
                    color: currentPage <= 1 ? "#d1d5db" : "#374151",
                    border: "1px solid #e5e7eb",
                    cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Previous
                </button>
                <span className="text-sm" style={{ color: "#6b7280" }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors"
                  style={{
                    background: "#ffffff",
                    color: currentPage >= totalPages ? "#d1d5db" : "#374151",
                    border: "1px solid #e5e7eb",
                    cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  Next
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat panel (toggleable) */}
      {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}

      {/* Modals */}
      {uploadOpen && (
        <UploadModal
          categories={categories}
          onClose={() => setUploadOpen(false)}
          onUpload={handleUpload}
        />
      )}

      {addCategoryOpen && (
        <AddCategoryModal
          categories={categories}
          onClose={() => setAddCategoryOpen(false)}
          onAdd={handleAddCategory}
        />
      )}

      {linkedDocsDocument && (
        <LinkedDocumentsModal
          document={linkedDocsDocument}
          onClose={() => setLinkedDocsDocument(null)}
        />
      )}
    </div>
  );
}
