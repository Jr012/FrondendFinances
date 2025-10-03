import type { CategoryRepository } from "../../domain/ports/CategoryRepository";

export class DeleteCategory {
  private repo: CategoryRepository;

  constructor(repo: CategoryRepository) {
    this.repo = repo;
  }

  async execute(id: number): Promise<void> {
    try {
      await this.repo.delete(id);
    } catch (error) {
      throw new Error("deleteCategory error: " + (error as Error).message);
    }
  }
}
