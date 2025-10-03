import type { Transaction } from "../models/Transaction";

export interface TransactionRepository{

    getAllTransactions(): Promise<Transaction[]>;
    getTransactionById(id: number): Promise<Transaction | null>;  
    getFiltersTransactions(categoryId: number, month: number, year: number): Promise<Transaction[]>; 
    getTransationsByMonthYear(month: number, year: number): Promise<Transaction[]>;
    create(transaction: Transaction): Promise<Transaction>;
    update(id: number, transaction: Transaction): Promise<Transaction>;
    delete(id: number): Promise<void>;  

}