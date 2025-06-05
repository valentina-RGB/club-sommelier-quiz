import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import AuthClient from '../client/axios'
import { LoginRequest, LoginResponse } from '../types/login.type'
import { setAuthStorage } from '@/common/storage/permission-store'

const apiClient = new AuthClient()

export function useLogin() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      try {
        const response = await apiClient.post<LoginResponse>(
          '/auth/login',
          credentials
        )
        return response
      } catch (error) {
        console.error('Error logging in:', error)
        throw error
      }
    },
    onSuccess: (data) => {      
      setAuthStorage(data.token, data.admin)
      navigate('/admin')
    },
    onError: (error: Error) => {
      console.error('Error de login:', error.message)
    },
  })
}