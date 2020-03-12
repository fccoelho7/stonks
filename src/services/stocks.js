import axios from "axios";
import groupBy from "lodash/groupBy";

import data from "./data.json";

const Stocks = {
  addTransaction(stocks, transaction) {
    const { idt, date, quantity, amount, category, type } = transaction;
    const { code } = this.getStockCodeByIdt(transaction.idt);
    const id = Date.now();

    return [
      ...stocks,
      {
        id,
        idt: +idt,
        type,
        code,
        quantity: +quantity,
        amount: +amount,
        category,
        date,
        currentPrice: 0
      }
    ];
  },

  removeTransaction(stocks, id) {
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

  calculateAveragePricePercentage(averagePrice, currentPrice) {
    return ((averagePrice * 100) / currentPrice - 100).toFixed(1);
  },

  calculateTotalPercentage(stocks) {
    return stocks.reduce((acc, stock) => acc + +stock.averagePricePercentage, 0).toFixed(2);
  },

  getWallet(transactions) {
    const transactionsByCode = groupBy(transactions, "code");

    const data = Object.values(transactionsByCode).map(transactions => {
      const [transaction] = transactions;
      const code = transaction.code;
      const currentPrice = transaction.currentPrice;
      const category = transaction.category;
      const totalQuantity = transactions.reduce((acc, transaction) => acc + transaction.quantity, 0);
      const totalAmount = transactions.reduce((acc, transaction) => acc + transaction.amount * transaction.quantity, 0);
      const averagePrice = this.calculateAveragePrice(totalAmount, totalQuantity);
      const averagePricePercentage = this.calculateAveragePricePercentage(averagePrice, currentPrice);
      const total = (totalQuantity * averagePrice).toFixed(2);

      return {
        code,
        category,
        totalQuantity,
        currentPrice,
        averagePrice,
        averagePricePercentage,
        total
      };
    });

    const totalPercentage = this.calculateTotalPercentage(data);

    return { data, totalPercentage };
  }
};

export default Stocks;
