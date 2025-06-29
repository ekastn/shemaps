interface AuthenticatedFetchOptions extends RequestInit {
    token?: string | null;
    deviceId?: string | null;
}

export const authenticatedFetch = async (url: string, options: AuthenticatedFetchOptions = {}) => {
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
