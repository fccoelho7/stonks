import axios from "axios";
import groupBy from "lodash/groupBy";

const Rebalacing = {
  async getStocksQuotes(symbols = []) {
    const { data: quotes } = await axios.get(`/.netlify/functions/quotes?codes=${symbols.join(",")}`);
    return quotes;
  },

  async getWallet(store = []) {
    const symbols = Object.keys(groupBy(store, "symbol"));
    const quotes = await this.getStocksQuotes(symbols);

    const assets = store.map(item => {
      const price = quotes[item.symbol]?.price || item.price || 0;
      const total = item.quantity * price;

      return { ...item, price, total, selected: false };
    });

    const assetsByCategory = groupBy(assets, "category");

    return assetsByCategory;
  }
};

export default Rebalacing;
