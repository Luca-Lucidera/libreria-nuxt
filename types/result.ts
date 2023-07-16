export type Result<TSuccess, TError> = {
  success: boolean;
  successData?: TSuccess;
  errorData?: TError;
}