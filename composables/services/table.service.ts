import ITableHeaders from "~~/interface/tableHeaders";

export const fetchTableHeaders = async () => {
  try {
    return await $fetch<ITableHeaders[]>("/api/table", { credentials: "include" });
  } catch (error) {
    return handleErrorApi(error);
  }
};
