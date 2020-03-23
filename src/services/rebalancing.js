import axios from "axios";
import groupBy from "lodash/groupBy";

function totalByProp(list, prop, initial = 0) {
  return list.reduce((acc, item) => acc + item[prop], initial);
}

function formatPercentage(value) {
  return +value.toFixed(2);
}

const Rebalacing = {
  async getStocksQuotes(symbols = []) {
    const symbolsByComma = symbols.join(",");
    const { data: quotes } = await axios.get(`/.netlify/functions/quotes?codes=${symbolsByComma}`);
    return quotes;
  },

  async getWallet(store = []) {
    const symbols = Object.keys(groupBy(store, "symbol"));
    const quotes = await this.getStocksQuotes(symbols);
    const updatedAssets = store.map(asset => {
      const currentPrice = quotes[asset.symbol]?.price || asset.currentPrice || 0;
      const currentAmount = currentPrice * asset.quantity;

      return {
        ...asset,
        currentPrice,
        currentAmount
      };
    });

    const totalAssetsAmount = totalByProp(updatedAssets, "currentAmount");

    const assetsByCategory = groupBy(updatedAssets, "category");

    Object.keys(assetsByCategory).forEach(category => {
      const categoryAssets = assetsByCategory[category];
      const totalCategoryAmount = totalByProp(categoryAssets, "currentAmount", 0);
      const totalCategoryWeight = totalByProp(categoryAssets, "weight", 0);
      const totalCategoryPercentage = formatPercentage((totalCategoryAmount * 100) / totalAssetsAmount);

      assetsByCategory[category] = {
        assets: categoryAssets.map(asset => {
          const { currentAmount, weight } = asset;
          const idealPercentage = (weight * 100) / totalCategoryWeight;
          const idealAmount = (idealPercentage / 100) * totalCategoryAmount;
          const currentPercentage = formatPercentage((currentAmount / totalCategoryAmount) * 100);
          const amountMissing = idealAmount - currentAmount;

          return {
            ...asset,
            currentPercentage,
            idealPercentage,
            currentAmount,
            idealAmount,
            amountMissing,
            selected: false
          };
        }),
        totalCategoryAmount,
        totalCategoryPercentage
      };
    });

    return assetsByCategory;
  }
};

export default Rebalacing;
