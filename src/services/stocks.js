import axios from "axios";
import groupBy from "lodash/groupBy";

import data from "./data.json";

const Stocks = {
  add(stocks, props) {
    const { idt, date, quantity, paidPrice, category } = props;
    const { code } = this.getStockCodeByIdt(props.idt);
    const id = Date.now();

    return [
      ...stocks,
      {
        id,
        idt: +idt,
        code,
        quantity: +quantity,
        paidPrice: +paidPrice,
        category,
        date,
        currentPrice: 0
      }
    ];
  },

  remove(stocks, id) {
    return stocks.filter(stock => stock.id !== id);
  },

  async updateStocksQuote(stocks) {
    const ids = stocks.map(stock => stock.idt).join(",");

    const { data: quotes } = await axios.get(`/.netlify/functions/quotes?ids=${ids}`);

    return stocks.map(stock => {
      const quote = quotes.find(quote => +quote.idt === stock.idt);

      return {
        ...stock,
        currentPrice: quote.price,
        total: stock.quantity * +quote.price
      };
    });
  },

  getStockCodeByIdt(idt) {
    return this.getAllStocks().find(stock => stock.idt === +idt);
  },

  getAllStocks() {
    return data;
  },

  calculateAveragePrice(price, quantity) {
    return (price / quantity).toFixed(2);
  },

  calculateAveragePercentage(averagePrice, currentPrice) {
    return ((averagePrice * 100) / currentPrice - 100).toFixed(1);
  },

  calculateTotalPercentage(stocks) {
    return stocks.reduce((acc, stock) => acc + +stock.averagePercentage, 0).toFixed(2);
  },

  getWallet(stocks) {
    const groupedStocks = groupBy(stocks, "code");

    const data = Object.values(groupedStocks).map(stocks => {
      const [stock] = stocks;
      const code = stock.code;
      const currentPrice = stock.currentPrice;
      const totalQuantity = stocks.reduce((acc, stock) => acc + stock.quantity, 0);
      const totalPaidPrice = stocks.reduce((acc, stock) => acc + stock.paidPrice * stock.quantity, 0);
      const averagePrice = this.calculateAveragePrice(totalPaidPrice, totalQuantity);
      const averagePercentage = this.calculateAveragePercentage(averagePrice, currentPrice);
      const total = (totalQuantity * averagePrice).toFixed(2);

      return { code, totalQuantity, averagePrice, averagePercentage, total };
    });

    const totalPercentage = this.calculateTotalPercentage(data);

    return { data, totalPercentage };
  }
};

export default Stocks;
