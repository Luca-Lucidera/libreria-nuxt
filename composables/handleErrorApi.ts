export const handleErrorApi = (error: any) => {
  if (error.status !== 500) {
    throw new Error(error.statusMessage);
  }
  throw new Error("Something went wrong");
};