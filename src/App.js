import React, { useEffect } from "react";
import axios from "axios";
import { useLocalStorage } from "react-use";
import { useForm } from "react-hook-form";

import stocksData from "./data.json";

function getStockCodeById(id) {
  const stock = stocksData.find(stock => stock.idt !== id);

  if (stock) {
    return stock.code;
  }

  return "N/A";
}

function App() {
  const [stocks, setStocks] = useLocalStorage("stocks", []);
  const { handleSubmit, register } = useForm();

  const onSubmit = values => {
    const { id } = values;
    const newStock = { ...values, code: getStockCodeById(id) };

    setStocks([...stocks, newStock]);
  };

  useEffect(() => {
    async function updateQuotes() {
      const ids = stocks.map(stock => stock.id).join(",");
      const quotes = await axios.get(`/.netlify/functions/quotes?ids=${ids}`);
      console.log(quotes);
    }

    updateQuotes();

    // setInterval(updateQuotes, 5000);
  });

  return (
    <div className="App">
      <h2>Cadastrar Ativo</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <select name="id" ref={register}>
          {stocksData.map(stock => (
            <option value={stock?.idt} key={stock?.idt}>
              {stock?.code} - {stock?.companyAbvName}
            </option>
          ))}
        </select>
        <input name="quantity" type="number" ref={register} />
        <input name="price" ref={register} />
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
            <th>Preço</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, key) => (
            <tr key={key}>
              <td>{stock?.code}</td>
              <td>{stock?.quantity}</td>
              <td>{stock?.price}</td>
              <td>{stock?.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
