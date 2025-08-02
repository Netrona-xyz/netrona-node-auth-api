export function stdErrorMsg (code, message) {
    const error = new Error(message || 'Error interno');
    error.status = code || 500;
    return error;
}
