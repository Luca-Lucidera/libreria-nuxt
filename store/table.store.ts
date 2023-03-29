import { defineStore } from "pinia";
import IBookTableFilter from "~~/interface/table/bookTableFilter";
import ITableHeaders from "~~/interface/table/tableHeaders";

export const useBooksTableStore = defineStore("books-table", () => {
  const headers = ref<ITableHeaders[]>([]);
  const getHeaders = computed(() => headers.value);
  const fetchBooksHeaders = async () => {
    if (getHeaders.value.length === 0) {
      headers.value = await fetchBooksTableHeaders();
    }
  };

  const filters = ref<IBookTableFilter | null>(null);
  const getFilters = computed(() => filters.value);
  const fetchBooksFilters = async () => {
    if (!getFilters.value) {
      const type = await getType()!;
      const status = await getStatus()!;
      const editor = await getEditor()!;
      filters.value = {
        type: type!,
        status: status!,
        editor: editor!,
      }
    }
  };
  return {
    getHeaders,
    fetchBooksHeaders,
    getFilters,
    fetchBooksFilters,
  };
});
