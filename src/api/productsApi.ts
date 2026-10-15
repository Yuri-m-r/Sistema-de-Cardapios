import type { Product, NewProduct } from "../types/productType";
import { api } from "./api";

export const searchProducts = async (name: string | undefined = undefined) => {
  const response = await api.get<Product[]>("/products", {
    params: {
      ...(name && { "name:contains": name }),
    },
  });

  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete<Product>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (product: NewProduct) => {
  const response = await api.post<Product>("/products", product);
  return response.data;
}

export const updateProduct = async (product: Product) => {
  const response = await api.put<Product>(`/products/${product.id}`, product);
  return response.data;
}
