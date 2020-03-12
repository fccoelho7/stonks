import { useLocalStorage } from "react-use";
import StockService from "../services/stocks";

function useStocks(initialValues = []) {
  const [transactions, setTransactions] = useLocalStorage("stocks", initialValues);

  const addTransaction = async transaction =>
    setTransactions(await StockService.updateStocksQuote(StockService.addTransaction(transactions, transaction)));

  const removeTransaction = id => setTransactions(StockService.removeTransaction(transactions, id));

  const refreshQuotes = async () => setTransactions(await StockService.updateStocksQuote(transactions));

  const wallet = StockService.getWallet(transactions);

  const allCompanies = StockService.getAllStocks();

  return { transactions, addTransaction, removeTransaction, refreshQuotes, wallet, allCompanies };
}

export default useStocks;
