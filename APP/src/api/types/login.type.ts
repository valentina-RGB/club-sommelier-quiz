export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  admin: {
    id: string
    name: string
    email: string
  }
}

export interface LoginError {
  message: string
  status: number
}