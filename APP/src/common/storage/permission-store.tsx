export const setAuthStorage = (token: string, user: any) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('admin', JSON.stringify(user));
}

export const clearAuthStorage = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('admin');
}


export const getAuthStorage = () => {
    return {
        token: localStorage.getItem('authToken'),
        user: JSON.parse(localStorage.getItem('admin') || 'null')
    };
};
