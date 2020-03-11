import React, { useEffect } from "react";
import axios from "axios";
import { useLocalStorage } from "react-use";
import { useForm } from "react-hook-form";

import "./App.css";

function App() {
  const [stocks, setStocks] = useLocalStorage("stocks", []);
  const { handleSubmit, register } = useForm();
  const onSubmit = values => setStocks([...stocks, values]);

  useEffect(() => {
    async function updateQuotes() {
      const names = stocks.map(stock => stock.name).join(",");
      const quotes = await axios.get(
        `https://api.hgbrasil.com/finance/stock_price?key=ab40b5d7&symbol=${names}`
      );
      console.log(quotes);
    }

    updateQuotes();

    // setInterval(updateQuotes, 5000);
  });

  return (
    <div className="App">
      <h2>Cadastrar Ativo</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input name="name" ref={register} />
        <input name="quantity" type="number" ref={register} />
        <input name="price"  ref={register} />
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
            <th>Ativo</th>
            <th>Quantidade</th>
            <th>Preço</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, key) => (
            <tr key={key}>
              <td>{stock?.name}</td>
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
