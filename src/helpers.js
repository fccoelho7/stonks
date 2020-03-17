export const toReal = price => {
  return price && price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};
