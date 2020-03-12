export const toReal = price => {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};
