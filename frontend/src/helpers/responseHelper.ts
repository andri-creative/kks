// Global helper untuk memproses response sukses
export const handleApiResponse = <T>(response: any, defaultErrorMessage: string): T => {
    if (response.data && response.data.status === 'success') {
        return response.data.data;
    }
    throw new Error(response.data?.message || defaultErrorMessage);
};

// Global helper untuk memproses & memetakan error Axios dari backend
export const handleApiError = (error: any, defaultMessage: string): never => {
    console.error(defaultMessage, error);
    const message = error.response?.data?.message || error.message || defaultMessage;
    throw new Error(message);
};
