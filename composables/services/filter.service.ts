
export const getEditor = async () => {
  try {
    return await $fetch("/api/filter/publisher");
  } catch (error) {
    handleErrorApi(error)
  }
}

export const getStatus = async () => {
  try {
    return await $fetch("/api/filter/status");
  } catch (error) {
    handleErrorApi(error);
  }
};


export const getType = async () => {
  try {
    return await $fetch("/api/filter/type");
  } catch (error) {
    handleErrorApi(error);
  }
};