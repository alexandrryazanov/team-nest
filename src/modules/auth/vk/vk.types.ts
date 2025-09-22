export interface VkAuthSuccessResponse {
  response: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

export interface VkAuthErrorResponse {
  error: { error_code: number; error_msg: string };
}
