import { TableHeaders } from "@prisma/client";
import { defineStore } from "pinia";
import {BookTableFilter} from "~/types/bookTableFilter";

export const useTableStore = defineStore("table", () => {
  const headers = ref<TableHeaders[]>([]);

  const getHeaders = computed(() => headers.value);
  const fetchBooksTableHeaders = async () => {
    try {
      const data = await $fetch<TableHeaders[]>("/api/table/headers");
      if (data) {
        headers.value = data;
      }
    } catch (error) {
      throw error;
    }
  };

  const filters = ref<BookTableFilter | null>(null);

  const getFilters = computed(() => filters.value);

  const fetchBooksTableFilters = async () => {
    const [status, types, publisher] = await Promise.all([
      $fetch<string[]>("/api/filter/status", { method: "GET" }),
      $fetch<string[]>("/api/filter/type", { method: "GET" }),
      $fetch<string[]>("/api/filter/publisher", {
        method: "GET",
      }),
    ]);

    filters.value = {
      type: types,
      status: status,
      publisher: publisher,
    };
  };

  return {
    filters,
    headers,
    getHeaders,
    fetchBooksTableHeaders,
    getFilters,
    fetchBooksTableFilters,
  };
});
