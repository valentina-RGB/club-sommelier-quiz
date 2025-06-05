import { getAuthStorage } from "@/common/storage/permission-store";
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

export default class AuthClient {

    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: import.meta.env.VITE_API_URL,

            headers: {
                'Content-Type': 'application/json'
            }
        })
        this.client.interceptors.request.use(
            (config) => {
                const { token } = getAuthStorage();
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        )

    }
    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.client.get<T>(url, config);
            return response.data;
        } catch (error) {
            console.log(`GET ${url}`);
            throw error;
        }
    }

    public async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.client.post<T>(url, data, config);
            return response.data;
        } catch (error) {
            console.log(`POST ${url}`);
            throw error;
        }
    }

    public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.client.put<T>(url, data, config);
            return response.data;
        } catch (error) {
            console.log(`PUT ${url}`);
            throw error;
        }
    }

    public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.client.patch<T>(url, data, config);
            return response.data;
        } catch (error) {
            console.log(`PATCH ${url}`);
            throw error;
        }
    }

    public async delete<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.client.delete<T>(url, {
                ...config,
                data: data
            });
            return response.data;
        } catch (error) {
            console.log(`DELETE ${url}`);
            throw error;
        }
    }


}