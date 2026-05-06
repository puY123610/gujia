export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export function ok<T>(data: T, message = '操作成功'): ApiResponse<T> {
  return {
    code: 200,
    message,
    data,
  }
}
