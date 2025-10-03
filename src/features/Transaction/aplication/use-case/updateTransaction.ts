import type { Transaction } from "../../domain/models/Transaction";
import type { TransactionRepository } from "../../domain/ports/TransactionRepository";

export class UpdateTransaction {
  private repo: TransactionRepository;

  constructor(repo: TransactionRepository) {
    this.repo = repo;
  }

  async execute(id: number, data: Partial<Transaction> | any): Promise<void> {
    try {
      await this.repo.update(id, data);
    } catch (error) {
      throw new Error("updateTransaction error: " + (error as Error).message);
    }
  }
}
