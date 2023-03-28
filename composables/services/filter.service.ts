import IFilter from "~~/interface/filter";

export const getEditor = async () => {
  try {
    return await $fetch<IFilter[]>("/api/filter/editor");
  } catch (error) {
    handleErrorApi(error)
  }
}

export const getStatus = async () => {
  try {
    return await $fetch<IFilter[]>("/api/filter/status");
  } catch (error) {
    handleErrorApi(error);
  }
};


export const getType = async () => {
  try {
    return await $fetch<IFilter[]>("/api/filter/type");
  } catch (error) {
    handleErrorApi(error);
  }
};