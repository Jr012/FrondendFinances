import type { Transaction } from "../../domain/models/Transaction";
import type { TransactionRepository } from "../../domain/ports/TransactionRepository";

export class GetTransactionById {
  private repo: TransactionRepository;

  constructor(repo: TransactionRepository) {
    this.repo = repo;
  }

  async execute(id: number): Promise<Transaction | null> {
    try {
      return await this.repo.getTransactionById(id);
    } catch (error) {
      throw new Error("getTransactionById error: " + (error as Error).message);
    }
  }
}