import type { ProductType } from "../types/ProductType";
import { api } from "./api";

export const showProducts = async (name: string | undefined = undefined) => {
  const response = await api.get<ProductType[]>("/products", {
    params: {
      ...(name && { "name:contains": name }),
    },
  });

  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
