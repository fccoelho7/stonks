import axios from "axios";
import groupBy from "lodash/groupBy";

import data from "../data.json";

const Stocks = {
  addTransaction(stocks, transaction) {
    const { code, date, quantity, amount, category, type } = transaction;
    const id = Date.now();

    return [
      ...stocks,
      {
        id,
        code,
        type,
        quantity,
        amount: +amount,
        category,
        date
      }
    ];
  },

  removeTransaction(stocks, id) {
    return stocks.filter(stock => stock.id !== id);
  },

  getAllStocks() {
    return data;
  },

  calculateAveragePrice(price, quantity) {
    return (price / quantity).toFixed(2);
  },

  calculateAveragePricePercentage(averagePrice, currentPrice) {
    if (currentPrice === 0) return 0;
    return ((averagePrice * 100) / currentPrice - 100).toFixed(1);
  },

  calculateTotalPercentage(stocks) {
    return stocks.reduce((acc, stock) => acc + +stock.averagePricePercentage, 0).toFixed(2);
  },

  async getStocksQuotes(codes) {
    const { data: quotes } = await axios.get(`/.netlify/functions/quotes?codes=${codes}`);
    return quotes;
  },

  async getWallet(transactions) {
    const transactionsByCode = groupBy(transactions, "code");
    const codes = Object.keys(transactionsByCode);
    const quotes = await this.getStocksQuotes(codes.join(","));

    const data = codes.map(code => {
      const currentPrice = quotes[code]?.price || 0;
      const transactions = transactionsByCode[code];
      /* TODO: Receive categories from another entity. */
      const { category } = transactions[0];
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
