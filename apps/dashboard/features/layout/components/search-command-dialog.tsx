"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  SlidersHorizontal,
  Clock,
  FileText,
  Sparkles,
  RotateCcw,
  Trash2,
  X,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardQueries } from "@/features/dashboard/queries/dashboard.queries";
import { ViewArchiveModal } from "@/features/archives/components/ui/view-archive-modal";

interface SearchCommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RECENT_SEARCHES_KEY = "digital_archive_recent_searches";

const QUICK_FILTERS = [
  { label: "Menunggu Verifikasi", type: "status", value: "menunggu_verifikasi" },
  { label: "Terverifikasi", type: "status", value: "terverifikasi" },
  { label: "Ditolak", type: "status", value: "tidak_terverifikasi" },
  { label: "Nilai", type: "document_type", value: "nilai" },
  { label: "Transkrip", type: "document_type", value: "transkrip" },
  { label: "Ijazah", type: "document_type", value: "ijazah" },
  { label: "Berita Acara Sidang", type: "document_type", value: "berita_acara_sidang" },
];

export function SearchCommandDialog({ open, onOpenChange }: SearchCommandDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedDocType, setSelectedDocType] = useState<string | undefined>(undefined);

  const [viewDocId, setViewDocId] = useState<number | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSearch(searchTerm);
      if (searchTerm.trim().length >= 2) {
        saveRecentSearch(searchTerm);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (open) {
      try {
        const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setRecentSearches(parsed);
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Failed to read recent searches from localStorage:", error);
        }
      }
    }
  }, [open]);

  const saveRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;
    const updated = [trimmed, ...recentSearches.filter((item) => item !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Failed to save recent search to localStorage:", error);
      }
    }
  };

  const removeRecentSearch = (query: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item !== query);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Failed to remove recent search from localStorage:", error);
      }
    }
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Failed to clear recent searches from localStorage:", error);
      }
    }
  };

  const queryParams: Record<string, any> = {
    per_page: 8,
  };
  if (activeSearch.trim()) queryParams.search = activeSearch.trim();
  if (selectedStatus) queryParams.status = selectedStatus;
  if (selectedDocType) queryParams.document_type = selectedDocType;

  const isQueryActive = !!activeSearch.trim() || !!selectedStatus || !!selectedDocType;

  const searchResultsQuery = useQuery({
    ...dashboardQueries.documents(queryParams),
    enabled: isQueryActive,
  });

  const handleSelectRecent = (term: string) => {
    setSearchTerm(term);
    setActiveSearch(term);
    saveRecentSearch(term);
  };

  const handleTogglePill = (filter: { label: string; type: string; value: string }) => {
    if (filter.type === "status") {
      setSelectedStatus((prev) => (prev === filter.value ? undefined : filter.value));
    } else if (filter.type === "document_type") {
      setSelectedDocType((prev) => (prev === filter.value ? undefined : filter.value));
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setActiveSearch("");
    setSelectedStatus(undefined);
    setSelectedDocType(undefined);
  };

  const handleOpenDocView = (docId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (searchTerm.trim()) {
      saveRecentSearch(searchTerm);
    }
    setViewDocId(docId);
    setViewModalOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl md:max-w-5xl sm:max-w-4xl w-[90vw] md:w-[75vw] lg:w-[67vw] max-w-[1150px] p-0 overflow-hidden border-border/60 shadow-2xl rounded-2xl">
          <div className="bg-gradient-to-r from-[#F54A00] to-[#D94200] p-6 text-white relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur shrink-0">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white tracking-tight">
                    Pencarian Lanjutan Dokumen
                  </DialogTitle>
                  <p className="text-xs text-white/80 mt-0.5">
                    Live searching berdasarkan NIM, Nama Mahasiswa, Mata Kuliah, Tipe Dokumen, atau Status
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 absolute left-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Ketik NIM, Nama, atau Mata Kuliah (pencarian langsung)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-28 h-12 text-sm rounded-xl border-border/60 focus-visible:ring-[#F54A00]"
                  autoFocus
                />
                <div className="absolute right-3 flex items-center gap-2">
                  {isQueryActive && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleResetFilters}
                      className="h-8 text-xs px-2.5 text-muted-foreground hover:text-foreground"
                      title="Reset Filter"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      Reset
                    </Button>
                  )}
                  {searchResultsQuery.isFetching && (
                    <Badge variant="secondary" className="bg-[#F54A00]/10 text-[#F54A00] text-[10px] animate-pulse">
                      Mencari...
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-muted-foreground font-medium mr-1 flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3" />
                  Filter Cepat:
                </span>
                {QUICK_FILTERS.map((pill, idx) => {
                  const isActive =
                    (pill.type === "status" && selectedStatus === pill.value) ||
                    (pill.type === "document_type" && selectedDocType === pill.value);

                  return (
                    <Button
                      key={idx}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTogglePill(pill)}
                      className={
                        isActive
                          ? "h-7 text-xs rounded-lg bg-[#F54A00] text-white font-medium shadow-xs"
                          : "h-7 text-xs rounded-lg bg-muted/40 hover:bg-muted font-normal text-muted-foreground hover:text-foreground"
                      }
                    >
                      {pill.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {isQueryActive ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#F54A00]" />
                    Hasil Pencarian Real-Time ({searchResultsQuery.data?.data?.length ?? 0})
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Klik item untuk melihat langsung detail dokumen
                  </span>
                </div>

                {searchResultsQuery.isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-14 w-full rounded-xl" />
                    <Skeleton className="h-14 w-full rounded-xl" />
                    <Skeleton className="h-14 w-full rounded-xl" />
                  </div>
                ) : searchResultsQuery.data?.data?.length ? (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {searchResultsQuery.data.data.map((doc) => {
                      const statusStr = String(doc.status);
                      const isVerified = statusStr === "verified" || statusStr === "terverifikasi";
                      const isRejected = statusStr === "rejected" || statusStr === "tidak_terverifikasi";

                      return (
                        <div
                          key={doc.id}
                          onClick={(e) => handleOpenDocView(doc.id, e)}
                          className="p-3.5 rounded-xl border border-border/60 hover:bg-muted/50 transition-colors flex items-center justify-between cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600 dark:bg-orange-950 dark:text-orange-400 shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs font-semibold text-foreground group-hover:text-[#F54A00] transition-colors">
                                {doc.title || doc.file_name || `Dokumen #${doc.id}`}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {doc.category || doc.document_type || "Dokumen Arsip"} • Uploaded {new Date(doc.created_at).toLocaleDateString("id-ID")}
                                {doc.uploader?.name ? ` oleh ${doc.uploader.name}` : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="secondary"
                              className={
                                isVerified
                                  ? "bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]"
                                  : isRejected
                                    ? "bg-rose-100 text-rose-700 border-rose-200 text-[10px]"
                                    : "bg-amber-100 text-amber-700 border-amber-200 text-[10px]"
                              }
                            >
                              {statusStr.toUpperCase()}
                            </Badge>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => handleOpenDocView(doc.id, e)}
                              className="h-8 text-xs gap-1.5 text-[#F54A00] hover:bg-[#F54A00]/10 font-medium"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-muted-foreground border border-dashed rounded-xl space-y-1">
                    <p className="font-medium text-foreground">Dokumen tidak ditemukan</p>
                    <p>Tidak ada dokumen yang sesuai dengan kata kunci.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    Pencarian Terakhir
                  </span>
                  {recentSearches.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllRecentSearches}
                      className="h-6 text-[11px] text-muted-foreground hover:text-rose-600 px-2"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Hapus Riwayat
                    </Button>
                  )}
                </div>

                {recentSearches.length > 0 ? (
                  <div className="space-y-2">
                    {recentSearches.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => handleSelectRecent(item)}
                        className="p-3 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <Search className="w-4 h-4 text-muted-foreground group-hover:text-[#F54A00] transition-colors" />
                          <span className="text-xs text-foreground font-medium">{item}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => removeRecentSearch(item, e)}
                            className="h-6 w-6 text-muted-foreground hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Hapus"
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
                    Belum ada riwayat pencarian. Ketik kata kunci di atas untuk mencari secara langsung.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-3.5 bg-muted/40 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground px-6">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5">
                <kbd className="px-2 py-0.5 rounded bg-background border border-border/80 text-[10px] font-mono shadow-xs">
                  Ctrl + K
                </kbd>
                Buka pencarian
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-2 py-0.5 rounded bg-background border border-border/80 text-[10px] font-mono shadow-xs">
                  Esc
                </kbd>
                Tutup
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {viewDocId && (
        <ViewArchiveModal
          id={viewDocId}
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
        />
      )}
    </>
  );
}
