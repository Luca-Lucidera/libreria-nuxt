import { TableHeaders } from "@prisma/client";
import { defineStore } from "pinia";
import IBookTableFilter from "~~/interface/table/bookTableFilter";

export const useTableStore = defineStore("table", () => {
  const headers = ref<TableHeaders[]>([]);
  const getHeaders = computed(() => headers.value);
  const fetchBooksTableHeaders = async () => {
    const { data, error } = await useLazyFetch("/api/table/headers");
    if (error.value) {
      throw error.value;
    }

    if (data.value) {
      headers.value = data.value;
    }
  };

  const filters = ref<IBookTableFilter | null>(null);
  const getFilters = computed(() => filters.value);
  const fetchBooksTableFilters = async () => {
    const {
      data: types,
      error: typesError,
      pending: typesPending,
    } = await useLazyFetch("/api/filter/type");
    if (typesError.value) {
      throw typesError.value;
    }

    const {
      data: status,
      error: statusError,
      pending: statusPending,
    } = await useLazyFetch("/api/filter/status");
    if (statusError.value) {
      throw statusError.value;
    }

    const {
      data: publisher,
      error: publisherError,
      pending: publisherPending,
    } = await useLazyFetch("/api/filter/publisher");
    if (publisherError.value) {
      throw publisherError.value;
    }

    if (
      (!status.value ||
        !types.value ||
        !publisher.value ||
        status.value.length === 0 ||
        types.value.length === 0 ||
        publisher.value.length === 0) &&
      !typesPending.value &&
      !statusPending.value &&
      !publisherPending.value
    ) {
      throw createError({
        statusCode: 404,
        statusMessage: "books status not found",
      });
    }

    filters.value = {
      type: types.value!,
      status: status.value!,
      publisher: publisher.value!,
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
