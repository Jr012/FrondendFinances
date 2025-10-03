import type { Category } from "../../domain/models/Category";
import type { CategoryRepository } from "../../domain/ports/CategoryRepository";

export class GetRootCategories {
  private repo: CategoryRepository;

  constructor(repo: CategoryRepository) {
    this.repo = repo;
  }
  
  async execute(): Promise<Category[]> {
    try {
      return this.repo.getRootCategory();
    } catch (error) {
      throw new Error("getRootCategories error: " + (error as Error).message);
    }
  }
}