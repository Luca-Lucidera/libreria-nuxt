export default interface Result<TSuccess, TError> {
  success: boolean;
  successData?: TSuccess;
  errorData?: TError;
}