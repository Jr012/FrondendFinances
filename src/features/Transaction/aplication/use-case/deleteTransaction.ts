import type { TransactionRepository } from "../../domain/ports/TransactionRepository";

export class DeleteTransaction {
  private repo: TransactionRepository;
  
    constructor(repo: TransactionRepository) {
      this.repo = repo;
    }

  async execute(id: number): Promise<void> {
    try {
      await this.repo.delete(id);
    } catch (error) {
      throw new Error("deleteTransaction error: " + (error as Error).message);
    }
  }
}