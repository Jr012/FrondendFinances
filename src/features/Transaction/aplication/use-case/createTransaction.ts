import type { Transaction } from "../../domain/models/Transaction";
import type { TransactionRepository } from "../../domain/ports/TransactionRepository";

export class CreateTransaction {
  private repo: TransactionRepository;

    constructor(repo: TransactionRepository) {
    this.repo = repo;
  }

  async execute(transaction: Transaction): Promise<void> {
    try {
      await this.repo.create(transaction);
    } catch (error) {
      throw new Error("createTransaction error: " + (error as Error).message);
    }
  }
}