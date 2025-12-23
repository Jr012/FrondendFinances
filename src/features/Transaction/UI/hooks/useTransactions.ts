import { useState, useEffect } from "react";
import type{ Transaction } from "../../domain/models/Transaction";
import { TransactionApiRepository } from "../../infrastructure/api/TransactionApiRepository";
import { GetAllTransactions } from "../../aplication/use-case/getAllTransactions";
import { DeleteTransaction } from "../../aplication/use-case/deleteTransaction";
import { GetFiltersTransactions } from "../../aplication/use-case/getFiltersTransactions";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadTransactions = async () => {
    const useCase = new GetAllTransactions(new TransactionApiRepository());
    const data = await useCase.execute();
    setTransactions(data);
  };

  const filterTransactions = async (categoryId?: number, month?: number, year?: number) => {
    const useCase = new GetFiltersTransactions(new TransactionApiRepository());
    const results = await useCase.execute(categoryId, month, year);
    setTransactions(results);
  };

  const deleteTransactions = async (ids: number[]) => {
    const useCase = new DeleteTransaction(new TransactionApiRepository());
    for (const id of ids) {
      await useCase.execute(id);
    }
    await loadTransactions();
  };

    useEffect(() => {
      loadTransactions();
    }, []);


    

  return { transactions, loadTransactions, filterTransactions, deleteTransactions };
};
