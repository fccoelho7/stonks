import axios from "axios";

import data from "./data.json";

const Stocks = {
  add(stocks, props) {
    const { idt, date, quantity, paidPrice, category } = props;
    const { code } = this.getStockCodeByIdt(props.idt);
    const id = Date.now();

    return [
      ...stocks,
      {
        category,
        code,
        currentPrice: 0,
        date,
        id,
        idt,
        paidPrice: +paidPrice,
        quantity
      }
    ];
  },

  remove(stocks, id) {
    return stocks.filter(stock => stock.id !== id);
  },

  async updateStocksQuote(stocks) {
    const ids = stocks.map(stock => stock.idt).join(",");

    const { data: quotes } = await axios.get(
      `/.netlify/functions/quotes?ids=${ids}`
    );

    return stocks.map(stock => {
      const quote = quotes.find(quote => +quote.idt === +stock.idt);

      return {
        ...stock,
        currentPrice: quote.price,
        total: +stock.quantity * +quote.price
      };
    });
  },

  getStockCodeByIdt(idt) {
    return this.getAllStocks().find(stock => stock.idt === +idt);
  },

  getAllStocks() {
    return data;
  }
};

export default Stocks;
