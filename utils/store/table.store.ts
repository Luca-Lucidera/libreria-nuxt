import {TableHeaders} from "@prisma/client";
import {defineStore} from "pinia";
import {BookTableFilter} from "~/types/bookTableFilter";
import {FetchError} from "ofetch";
import {Result} from "~/types/result";

export const useTableStore = defineStore("table", () => {
  const headers = ref<TableHeaders[]>([]);
  const getHeaders = computed(() => headers.value);
  const fetchBooksTableHeaders = async (): Promise<Result<void, string>> => {
    try {
      headers.value = await $fetch<TableHeaders[]>("/api/table/headers");
      return {
        success: true
      }
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(`Errore in table.store.ts fetchBooksTableHeaders(), DATA: ${error.data}, statusCode: ${error.statusCode}, statusMessage: ${error.statusMessage}`)
        return {
          success: false,
          errorData: error.statusMessage
        }
      }
      console.error(`Errore non gestito table.store.ts fetchBooksTableHeaders() ${JSON.stringify(error, null, 4)}`)
      return {
        success: false,
        errorData: "Errore non gestito nel prendere gli headers, riprovare più darti"
      }
    }
  };

  const filters = ref<BookTableFilter | null>(null);
  const getFilters = computed(() => filters.value);
  const fetchBooksTableFilters = async (): Promise<Result<void, string>> => {
    try {
      const [status, types, publisher] = await Promise.all([
        $fetch<string[]>("/api/filter/status", {method: "GET"}),
        $fetch<string[]>("/api/filter/type", {method: "GET"}),
        $fetch<string[]>("/api/filter/publisher", {
          method: "GET",
        }),
      ]);

      filters.value = {
        type: types,
        status: status,
        publisher: publisher,
      };

      return {
        success: true
      }
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(`Errore in table.store.ts fetchBooksTableFilters(), DATA: ${error.data}, statusCode: ${error.statusCode}, statusMessage: ${error.statusMessage}`)
        return {
          success: false,
          errorData: error.statusMessage
        }
      }
      console.error(`Errore non gestito table.store.ts fetchBooksTableFilters() ${JSON.stringify(error, null, 4)}`)
      return {
        success: false,
        errorData: "Errore non gestito nel prendere i filtri, riprovare più darti"
      }
    }
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
