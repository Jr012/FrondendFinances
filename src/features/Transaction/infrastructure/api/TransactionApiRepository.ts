import type { TransactionRepository } from "../../domain/ports/TransactionRepository";
import type { Transaction } from "../../domain/models/Transaction";

export class TransactionApiRepository implements TransactionRepository {
  private apiUrl: string = "http://localhost:8085/transaction";


  async getAllTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${this.apiUrl}/all`);
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }
    return response.json();
  }

  async getTransactionById(id: number): Promise<Transaction | null> {
    const response = await fetch(`${this.apiUrl}/transactions/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch transaction");
    }
    return response.json();
  }

  async getFiltersTransactions(categoryId?: number, month?: number, year?: number): Promise<Transaction[]> {
  const params = new URLSearchParams();
  const par = "";

  if (categoryId){
    if (categoryId !== undefined) params.append("categoryId", categoryId.toString());
  }else{par}
  if (month && month){
    if (month !== undefined) params.append("month", month.toString());
    if (year !== undefined) params.append("year", year.toString());
  }else{par}

  const response = await fetch(`${this.apiUrl}/getFilters?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch filtered transactions");
  }
  return response.json();
}

  async getTransationsByMonthYear(month: number, year: number): Promise<Transaction[]> {
  const response = await fetch(`${this.apiUrl}/transactions/getByDatemonth/${month}/${year}`);
  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }
  return response.json();
}

  async create(transaction: Transaction): Promise<Transaction> {
    const response = await fetch(`${this.apiUrl}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });
    if (!response.ok) {
      throw new Error("Failed to create transaction");
    }
    return response.json();
  }

async update(id: number, transaction: any): Promise<Transaction> {
  const payload = {
    date: transaction.date,
    value: transaction.value,
    description: transaction.description,
    categoryId: transaction.categoryId ?? transaction.category?.id,
    userId: transaction.userId,
  };

  const response = await fetch(`${this.apiUrl}/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update transaction");
  }

  return response.json();
}




  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.apiUrl}/delete/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete transaction");
    }
  }
}