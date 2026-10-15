import { useState } from "react";
import { createProduct, updateProduct } from "../api/productsApi";
import type {
  ProductModalProps,
  NewProduct,
  ProductFormValues,
} from "../types/productType";
import { validationSchema } from "../validation/productSchema";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { unitOptions } from "../constants/unitOptions";

export const ProductModal = ({
  onClose,
  onSaved,
  product,
  mode,
}: ProductModalProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  // INITIAL VALUES
  const initialValues: ProductFormValues =
    mode === "create"
      ? { companyId: "1", name: "", unit: "", cost: "" }
      : {
          companyId: product.companyId,
          name: product.name,
          unit: product.unit,
          cost: product.cost,
        };

  // HANDLE SUBMIT
  const handleSubmit = async (values: ProductFormValues) => {
    setSubmitError(null);

    const data: NewProduct = {
      ...values,
      name: values.name.trim(),
      unit: values.unit.trim(),
      cost: Number(values.cost),
    };

    try {
      if (mode === "create") {
        onSaved(await createProduct(data));
      } else {
        onSaved(await updateProduct({ ...data, id: product.id }));
      }
      onClose();
    } catch (error) {
      console.error(error);
      setSubmitError(
        mode === "create" ? "Erro ao cadastrar item" : "Erro ao atualizar item",
      );
    }
  };
  // RENDER
  return (
    <div>
      {mode === "create" ? <h1>Cadastrar item</h1> : <h1>Editar item</h1>}
      {submitError && <p className="text-red-500">{submitError}</p>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, dirty }) => (
          <Form>
            <div className="flex flex-col gap-4">
              <label htmlFor="name">Nome</label>
              <Field name="name" id="name" type="text" />
              <ErrorMessage name="name" />

              <label htmlFor="unit">Unidade</label>
              <Field as="select" name="unit" id="unit">
                <option value="">Selecione uma unidade</option>
                {unitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Field>

              <ErrorMessage name="unit" />

              <label htmlFor="cost">Custo</label>
              <Field name="cost" id="cost" type="number" />
              <ErrorMessage name="cost" />
            </div>

            <button
              className=" cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={isSubmitting || !dirty}
            >
              {mode === "create" ? "Cadastrar" : "Salvar"}
            </button>
            <button
              className="cursor-pointer"
              type="button"
              onClick={() => {
                onClose();
              }}
            >
              X
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
