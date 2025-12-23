import { ProductType } from "../types";
import { apiFetch } from "./apiClient";

const PRODUCT_BASE_URL = "/products";

export const productService = {
  getAll(): Promise<ProductType[]> {
    return apiFetch.get(`${PRODUCT_BASE_URL}`);
  },

  getById(id: string): Promise<ProductType | null> {
    return apiFetch.get(`${PRODUCT_BASE_URL}/${id}`);
  },
};
