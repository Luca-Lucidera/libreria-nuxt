import { TableHeaders } from ".prisma/client";
import { defineStore } from "pinia";
import IBookTableFilter from "~~/interface/table/bookTableFilter";

export const useTableStore = defineStore("table", () => {
  const headers = ref<TableHeaders[]>([]);
  const getHeaders = computed(() => headers.value);
  const fetchBooksTableHeaders = async () => {
    if (getHeaders.value.length === 0) {
      headers.value = await retriveBooksTableHeaders();
    }
  };

  const filters = ref<IBookTableFilter | null>(null);
  const getFilters = computed(() => filters.value);
  const fetchBooksTableFilters = async () => {
    if (!getFilters.value) {
      const type = await getType()!;
      const status = await getStatus()!;
      const editor = await getEditor()!;
      filters.value = {
        type: type!,
        status: status!,
        publisher: editor!,
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
