type SuccessResult<T> = {
  success: true;
  successData: T;
};

type ErrorResult<T> = {
  success: false;
  errorData: T;
};

export type Result<TSuccess, TError> =
  | SuccessResult<TSuccess>
  | ErrorResult<TError>;