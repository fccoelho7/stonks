import { useLocalStorage } from "react-use";
import StockService from "../services/stocks";
import { useState } from "react";

function useStocks(initialValues = []) {
  const [transactions, setTransactions] = useLocalStorage("stocks", initialValues);
  const [wallet, setWallet] = useState({});

  const addTransaction = async transaction => setTransactions(StockService.addTransaction(transactions, transaction));

  const removeTransaction = id => setTransactions(StockService.removeTransaction(transactions, id));

  const getWallet = async () => setWallet(await StockService.getWallet(transactions));

  const allCompanies = StockService.getAllStocks();

  const composition = StockService.getWalletComposition(transactions);

  return { transactions, addTransaction, removeTransaction, wallet, getWallet, allCompanies, composition };
}

export default useStocks;
