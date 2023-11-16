import type { TableHeaders } from "@prisma/client";
import { defineStore } from "pinia";
import type { BookTableFilter } from "~/types/book/bookTableFilter";
import { FetchError } from "ofetch";
import type { Result } from "~/types/result";

export const useTableStore = defineStore("table", () => {
  const headers = ref<TableHeaders[]>([]);
  const getHeaders = computed(() => headers.value);
  const fetchBooksTableHeaders = async (): Promise<Result<null, string>> => {
    try {
      headers.value = await $fetch<TableHeaders[]>("/api/table/headers");
      return {
        success: true,
        successData: null,
      };
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(
          `Errore in table.store.ts fetchBooksTableHeaders(), DATA: ${error.data}, statusCode: ${error.statusCode}, statusMessage: ${error.statusMessage}`
        );
        return {
          success: false,
          errorData: error.statusMessage!,
        };
      }
      console.error(
        `Errore non gestito table.store.ts fetchBooksTableHeaders() ${JSON.stringify(
          error,
          null,
          4
        )}`
      );
      return {
        success: false,
        errorData:
          "Errore non gestito nel prendere gli headers, riprovare più darti",
      };
    }
  };

  const filters = ref<BookTableFilter>({ type: [], status: [], publisher: [] });
  const getFilters = computed(() => filters.value);
  const fetchBooksTableFilters = async (): Promise<Result<null, string>> => {
    try {
      const [status, types, publisher] = await Promise.all([
        $fetch<string[]>("/api/filter/status"),
        $fetch<string[]>("/api/filter/type"),
        $fetch<string[]>("/api/filter/publisher"),
      ]);

      filters.value = {
        type: types,
        status: status,
        publisher: publisher,
      };

      return {
        success: true,
        successData: null,
      };
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(
          `Errore in table.store.ts fetchBooksTableFilters(), DATA: ${error.data}, statusCode: ${error.statusCode}, statusMessage: ${error.statusMessage}`
        );
        return {
          success: false,
          errorData: error.statusMessage!,
        };
      }
      console.error(
        `Errore non gestito table.store.ts fetchBooksTableFilters() ${JSON.stringify(
          error,
          null,
          4
        )}`
      );
      return {
        success: false,
        errorData:
          "Errore non gestito nel prendere i filtri, riprovare più darti",
      };
    }
  };
  const areFiltersReady = () =>
    filters.value.publisher.length > 0 &&
    filters.value.status.length > 0 &&
    filters.value.type.length > 0;

  return {
    filters,
    headers,
    getHeaders,
    fetchBooksTableHeaders,
    getFilters,
    fetchBooksTableFilters,
    areFiltersReady,
  };
});
