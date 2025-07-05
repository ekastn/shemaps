import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL;

interface AuthenticatedFetchOptions {
    token?: string | null;
    deviceId?: string | null;
    method?: string;
    headers?: Record<string, string>;
    data?: any;
    params?: Record<string, any>;
}

export const authenticatedFetch = async (path: string, options: AuthenticatedFetchOptions = {}) => {
    const url = `${apiURL}${path}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    if (options.token) {
        headers["Authorization"] = `Bearer ${options.token}`;
    }
    if (options.deviceId) {
        headers["X-Device-ID"] = options.deviceId;
    }

    try {
        const response = await axios({
            method: options.method || 'get',
            url,
            headers,
            data: options.data,
            params: options.params,
        });
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
        throw new Error(errorMessage);
    }
};

export const apiFetch = async (path: string, options: AuthenticatedFetchOptions = {}) => {
    const url = `${apiURL}${path}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    const currentUrl = window.location.href;

    try {
        const response = await axios({
            method: options.method || 'get',
            url,
            headers,
            data: options.data,
            params: options.params,
        });
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
        throw new Error(errorMessage);
    }
};
