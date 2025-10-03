import type { Transaction } from "../../domain/models/Transaction";
import type { TransactionRepository } from "../../domain/ports/TransactionRepository";

export class GetFiltersTransactions {
  private repo: TransactionRepository;

  constructor(repo: TransactionRepository) {
    this.repo = repo;
  }

  async execute(categoryId: number, month: number, year: number): Promise<Transaction[]> {
    try {
      return await this.repo.getFiltersTransactions(categoryId, month, year);
    } catch (error) {
      throw new Error("getFiltersTransactions error: " + (error as Error).message);
    }
  }
}
