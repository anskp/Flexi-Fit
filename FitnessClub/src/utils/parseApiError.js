// src/utils/parseApiError.js
const parseApiError = (error) => {
  if (error.response && error.response.data && typeof error.response.data.message === 'string') {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};
export default parseApiError;