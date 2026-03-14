import { create } from "zustand";
import { SearchEngine } from "@understand-anything/core/search";
import type { SearchResult } from "@understand-anything/core/search";
import type { KnowledgeGraph } from "@understand-anything/core/types";

interface DashboardStore {
  graph: KnowledgeGraph | null;
  selectedNodeId: string | null;
  searchQuery: string;
  searchResults: SearchResult[];
  searchEngine: SearchEngine | null;

  setGraph: (graph: KnowledgeGraph) => void;
  selectNode: (nodeId: string | null) => void;
  setSearchQuery: (query: string) => void;
}

export const useDashboardStore = create<DashboardStore>()((set, get) => ({
  graph: null,
  selectedNodeId: null,
  searchQuery: "",
  searchResults: [],
  searchEngine: null,

  setGraph: (graph) => {
    const searchEngine = new SearchEngine(graph.nodes);
    const query = get().searchQuery;
    const searchResults = query.trim() ? searchEngine.search(query) : [];
    set({ graph, searchEngine, searchResults });
  },
  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),
  setSearchQuery: (query) => {
    const engine = get().searchEngine;
    if (!engine || !query.trim()) {
      set({ searchQuery: query, searchResults: [] });
      return;
    }
    const searchResults = engine.search(query);
    set({ searchQuery: query, searchResults });
  },
}));
