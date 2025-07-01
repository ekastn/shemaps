const apiURL = window.env?.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

interface AuthenticatedFetchOptions extends RequestInit {
    token?: string | null;
    deviceId?: string | null;
}

export const authenticatedFetch = async (path: string, options: AuthenticatedFetchOptions = {}) => {
    const url = `${apiURL}${path}`;

    const headers = new Headers(options.headers);

    if (options.token) {
        headers.set("Authorization", `Bearer ${options.token}`);
    }
    if (options.deviceId) {
        headers.set("X-Device-ID", options.deviceId);
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
    }

    return response.json();
};

export const apiFetch = async (path: string, options: RequestInit = {}) => {
    const url = `${apiURL}${path}`;
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
    }
    return response.json();
};
