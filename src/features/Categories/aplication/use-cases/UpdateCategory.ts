import type { Category } from "../../domain/models/Category";
import type { CategoryRepository } from "../../domain/ports/CategoryRepository";

export class UpdateCategory {
  private repo: CategoryRepository;

  constructor(repo: CategoryRepository) {
    this.repo = repo;
  }

  async execute(category: Category): Promise<Category> {
    try {
      return await this.repo.update(category);
    } catch (error) {
      throw new Error("Error actualizando categoría: " + (error as Error).message);
    }
  }
}
