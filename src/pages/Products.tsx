import { useState, useEffect } from "react";
import { deleteProduct, searchProducts } from "../api/productsApi";
import { ProductModal } from "../components/ProductModal";
import type {
  Product,
  ModalState,
} from "../types/productType";

import type { RequestState } from "../types/shareTypes";

export const Products = () => {
  const [search, setSearch] = useState("");
  const [response, setResponse] = useState<RequestState<Product[]>>({
    status: "loading",
  });
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });

  // SHOW PRODUCTS
  useEffect(() => {
    setResponse({ status: "loading" });
    setDeleteError(null);

    let ignore = false;

    const timer = setTimeout(() => {
      const fetchProducts = async () => {
        try {
          const products = await searchProducts(search);

          if (ignore) return;

          setResponse({ status: "success", data: products });
        } catch (error) {
          if (ignore) return;

          console.error(error);
          setResponse({
            status: "error",
            error: "Erro ao buscar produtos",
          });
        }
      };

      fetchProducts();
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [search]);

  // DELETE PRODUCTS
  const handleDelete = async (id: string) => {
    if (response.status !== "success") return;

    const item = response.data.find((product) => product.id === id);

    if (!item) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o item ${item.name}?`,
    );

    if (!confirmed) return;

    setDeleteError(null);
    setDeletingId(id);

    try {
      await deleteProduct(id);
      setResponse((prev) => {
        if (prev.status === "success") {
          return {
            data: prev.data.filter((product) => product.id !== id),
            status: "success",
          };
        }
        return prev;
      });
    } catch (error) {
      console.error(error);
      setDeleteError("Erro ao excluir produto");
    } finally {
      setDeletingId(null);
    }
  };

  // SHOW MESSAGES
  const getStatusMessage = () => {
    if (response.status === "loading") return "Buscando...";
    if (response.status === "error") return response.error;
    if (response.status === "success")
      return response.data.length === 0
        ? "Nenhum produto encontrado"
        : `Total de produtos encontrados: ${response.data.length}`;
  };

  // HANDLE NEW PRODUCT
  const handleProductCreated = (newProduct: Product) => {
    setResponse((prev) => {
      if (prev.status === "success") {
        return {
          data: [...prev.data, newProduct],
          status: "success",
        };
      }
      return prev;
    });
    setSearch("");
  };

  // HANDLE EDIT PRODUCT
  const handleProductUpdated = (updatedProduct: Product) => {
    setResponse((prev) => {
      if (prev.status === "success") {
        return {
          data: prev.data.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product,
          ),
          status: "success",
        };
      }
      return prev;
    });
  };

  // RENDER
  return (
    <>
      <div className="flex flex-col gap-2 p-4 self-center">
        <button
          onClick={() => setModal({ mode: "create" })}
          className="cursor-pointer "
        >
          Cadastrar novo produto
        </button>
        <label htmlFor="search">Buscar produtos</label>
        <input
          type="text"
          id="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Digite o nome do produto"
        />
        <p>{getStatusMessage()}</p>

        {deleteError && <p>{deleteError}</p>}
      </div>

      <div className="flex flex-col gap-4 p-4">
        {response.status === "success" &&
          response.data.map((product) => (
            <div key={product.id}>
              <h2>
                {product.name} - {product.unit}
              </h2>
              <p>
                {product.cost.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
              <button
                className="cursor-pointer"
                onClick={() => {
                  setModal({ mode: "edit", product });
                }}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                disabled={deletingId === product.id}
                className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                Excluir
              </button>
            </div>
          ))}
      </div>

      {modal.mode === "create" && (
        <ProductModal
          mode={modal.mode}
          onSaved={handleProductCreated}
          onClose={() => {
            setModal({ mode: "closed" });
          }}
        />
      )}

      {modal.mode === "edit" && (
        <ProductModal
          key={modal.product.id}
          mode={modal.mode}
          product={modal.product}
          onSaved={handleProductUpdated}
          onClose={() => {
            setModal({ mode: "closed" });
          }}
        />
      )}
    </>
  );
};
