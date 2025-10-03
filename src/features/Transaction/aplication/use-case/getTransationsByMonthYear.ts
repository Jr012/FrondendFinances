import type { Transaction } from "../../domain/models/Transaction";
import type { TransactionRepository } from "../../domain/ports/TransactionRepository";

export class GetTransactionsByMonthYear {
  private repo: TransactionRepository;

  constructor(repo: TransactionRepository) {
    this.repo = repo;
  }

  async execute(month: number, year: number): Promise<Transaction[]> {
    try {
      return await this.repo.getTransationsByMonthYear(month, year);
    } catch (error) {
      throw new Error("getTransationsByMonthYear error: " + (error as Error).message);
    }
  }
}
