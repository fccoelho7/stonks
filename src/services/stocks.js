import axios from "axios";
import groupBy from "lodash/groupBy";

import data from "../data.json";

const Stocks = {
  operations: {
    buy: "buy",
    sell: "sell"
  },

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

  calculateTotalQuantity(transactions) {
    return transactions.reduce(
      (acc, transaction) => (transaction.type === "buy" ? acc + transaction.quantity : acc - transaction.quantity),
      0
    );
  },

  calculateAveragePrice(transactions, totalQuantity) {
    return transactions.reduce((acc, transaction) => {
      const result = (transaction.quantity * transaction.amount) / totalQuantity;
      return transaction.type === "buy" ? acc + result : acc - result;
    }, 0);
  },

  calculateAveragePricePercentage(averagePrice, currentPrice) {
    return ((averagePrice * 100) / currentPrice - 100).toFixed(2);
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
    let data = [];

    codes.forEach(code => {
      const currentPrice = quotes[code]?.price;
      const transactions = transactionsByCode[code];
      /* TODO: Receive categories from another entity. */
      const { category } = transactions[0];
      const totalQuantity = this.calculateTotalQuantity(transactions);

      if (totalQuantity === 0) return;

      const averagePrice = this.calculateAveragePrice(transactions, totalQuantity);
      const averagePricePercentage = this.calculateAveragePricePercentage(averagePrice, currentPrice);
      const total = totalQuantity * averagePrice;

      data = [
        ...data,
        {
          code,
          category,
          totalQuantity,
          currentPrice,
          averagePrice,
          averagePricePercentage,
          total
        }
      ];
    });

    const totalPercentage = this.calculateTotalPercentage(data);

    return { data, totalPercentage };
  },

  getWalletComposition(transactions) {
    const transactionsByCategory = groupBy(transactions, "category");
    const compositions = {};

    Object.keys(transactionsByCategory).forEach(category => {
      const stocks = transactionsByCategory[category];
      const quantity = stocks.reduce((acc, stock) => (stock.type === "buy" ? acc + 1 : acc - 1), 0);
      compositions[category] = quantity;
    });

    return compositions;
  }
};

export default Stocks;
