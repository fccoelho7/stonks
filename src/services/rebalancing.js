import axios from "axios";
import groupBy from "lodash/groupBy";

const Rebalacing = {
  async getStocksQuotes(symbols = []) {
    const symbolsByComma = symbols.join(",");
    const { data: quotes } = await axios.get(`/.netlify/functions/quotes?codes=${symbolsByComma}`);
    return quotes;
  },

  async getWallet(store = []) {
    const symbols = Object.keys(groupBy(store, "symbol"));
    const quotes = await this.getStocksQuotes(symbols);
    const assetsByCategory = groupBy(store, "category");

    Object.keys(assetsByCategory).forEach(category => {
      const categoryAssets = assetsByCategory[category];
      const totalWeight = categoryAssets.reduce((acc, asset) => acc + asset.weight, 0);

      assetsByCategory[category] = categoryAssets.map(item => {
        const price = quotes[item.symbol]?.price || item.price || 0;
        const total = item.quantity * price;
        const percentage = (item.weight * 100) / totalWeight;

        return { ...item, price, total, percentage, selected: false };
      });
    });

    return assetsByCategory;
  }
};

export default Rebalacing;
