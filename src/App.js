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
    const updatedStocks = await StockService.updateStocksQuote(StockService.add(stocks, values));

    setStocks(updatedStocks);
  };

  const toReal = price => price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const wallet = StockService.getWallet(stocks);

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
      <hr />
      <h2>Carteira</h2>
      <h3>Rendimentos: {wallet?.totalPercentage}%</h3>
      <table>
        <thead>
          <tr>
            <th>Cód.</th>
            <th>Quantidade</th>
            <th>PM (R$)</th>
            <th>PM (%)</th>
            <th>Total</th>
            <th>-</th>
          </tr>
        </thead>
        <tbody>
          {wallet.data.map((stock, key) => (
            <tr key={key}>
              <td>{stock?.code}</td>
              <td>{stock?.totalQuantity}</td>
              <td>{toReal(+stock?.averagePrice)}</td>
              <td>{stock?.averagePercentage}%</td>
              <td>{toReal(+stock?.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <h2>Extrato</h2>
      <table>
        <thead>
          <tr>
            <th>Cód.</th>
            <th>Quantidade</th>
            <th>Preço Pago</th>
            <th>Data</th>
            <th>-</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, key) => (
            <tr key={key}>
              <td>{stock?.code}</td>
              <td>{stock?.quantity}</td>
              <td>{toReal(+stock?.paidPrice)}</td>
              <td>{stock?.date}</td>
              <td>
                <button type="button" onClick={() => setStocks(Stocks.remove(stocks, stock?.id))}>
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
