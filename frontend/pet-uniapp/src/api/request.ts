export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface RequestOptions {
  url: string
  method?: HttpMethod
  data?: Record<string, unknown> | string | ArrayBuffer
  header?: Record<string, string>
  auth?: boolean
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export function request<T = unknown>(options: RequestOptions): Promise<ApiResponse<T>> {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token') as string
    const header: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.header
    }

    if (options.auth && token) {
      header.Authorization = `Bearer ${token}`
    }

    uni.request({
      url: `${API_BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data,
      header,
      success(response) {
        const body = response.data as ApiResponse<T>

        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(body)
          return
        }

        reject(body)
      },
      fail(error) {
        reject(error)
      }
    })
  })
}
