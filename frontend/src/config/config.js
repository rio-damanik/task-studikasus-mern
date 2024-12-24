const API_BASE_URL = 'http://localhost:8000/api';

export const config = {
  API_BASE_URL,
  endpoints: {
    products: `${API_BASE_URL}/products`,
    orders: `${API_BASE_URL}/orders`,
    auth: `${API_BASE_URL}/auth`
  }
};

export default config;
