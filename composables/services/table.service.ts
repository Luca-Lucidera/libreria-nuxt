import ITableHeaders from "~~/interface/tableHeaders";

export const fetchTableHeaders = async () => {
  try {
    return await $fetch<ITableHeaders[]>("/api/table/headers", { credentials: "include" });
  } catch (error) {
    return handleErrorApi(error);
  }
};
