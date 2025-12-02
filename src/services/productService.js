import { apiFetch } from "./apiClient";

const PRODUCT_BASE_URL = "/products";

export const productService = {
  getAll() {
    return apiFetch.get(`${PRODUCT_BASE_URL}`);
  },

  getById(id) {
    return apiFetch.get(`${PRODUCT_BASE_URL}/${id}`);
  },
};
