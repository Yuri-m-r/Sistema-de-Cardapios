export type ProductType = {
  id: string;
  companyId: string;
  name: string;
  unit: string;
  cost: number;
};

export type RequestState<T> = 
    | { status: "loading" }
    | { status: "success"; data: T }
    | { status: "error"; error: string };