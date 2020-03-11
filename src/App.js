import React, { useEffect } from "react";
import { useLocalStorage } from "react-use";
import { useForm } from "react-hook-form";

import StockService from "./services/stocks";
import Stocks from "./services/stocks";

function App() {
  const [stocks, setStocks] = useLocalStorage("stocks", []);
  const { handleSubmit, register } = useForm();

  useEffect(() => {
    async function updateStocks() {
      await StockService.updateStocksQuote(stocks);
    }

    updateStocks();
  }, []);

  const onSubmitStock = async values => {
    const updatedStocks = await StockService.updateStocksQuote(
      StockService.add(stocks, values)
    );

    setStocks(updatedStocks);
  };

  const toReal = price =>
    price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="App">
      <h2>Extrato de Ações</h2>
      <form onSubmit={handleSubmit(onSubmitStock)}>
        <select name="idt" ref={register}>
          {StockService.getAllStocks().map(stock => (
            <option value={stock?.idt} key={stock?.idt}>
              {stock?.code} - {stock?.companyAbvName}
            </option>
          ))}
        </select>
        <input name="quantity" type="number" ref={register} />
        <input name="paidPrice" ref={register} />
        <input name="date" type="date" ref={register} />
        <select name="category" ref={register}>
          <option value="acoes-br">Ações BR</option>
          <option value="acoes-us">Ações US</option>
          <option value="fii">FII</option>
          <option value="caixa">Caixa</option>
        </select>
        <button type="submit">Cadastrar</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Cód.</th>
            <th>Quantidade</th>
            <th>Preço Atual</th>
            <th>Preço Pago</th>
            <th>Total</th>
            <th>-</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, key) => (
            <tr key={key}>
              <td>{stock?.code}</td>
              <td>{stock?.quantity}</td>
              <td>{toReal(stock?.paidPrice)}</td>
              <td>{toReal(stock?.currentPrice)}</td>
              <td>{toReal(stock?.total)}</td>
              <td>
                <button
                  type="button"
                  onClick={() => setStocks(Stocks.remove(stocks, stock.id))}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
