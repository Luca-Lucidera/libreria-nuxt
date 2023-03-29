import ITableHeaders from "~~/interface/table/tableHeaders";

export const fetchBooksTableHeaders = async () => {
  try {
    return await $fetch<ITableHeaders[]>("/api/table/headers", { credentials: "include" });
  } catch (error) {
    return handleErrorApi(error);
  }
};
