import type { Category } from "../../domain/models/Category";
import type { CategoryRepository } from "../../domain/ports/CategoryRepository";

export class UpdateCategory {
  private repo: CategoryRepository;

  constructor(repo: CategoryRepository) {
    this.repo = repo;
  }

  async execute(id: number,category: Partial<Category> | any): Promise<void> {
    try {
      await this.repo.update(id, category);
    } catch (error) {
      throw new Error("Error actualizando categoría: " + (error as Error).message);
    }
  }
}
