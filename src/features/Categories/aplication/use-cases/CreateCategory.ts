  import type { Category } from "../../domain/models/Category";
  import type { CategoryRepository } from "../../domain/ports/CategoryRepository";

  export class CreateCategory {
    private repo: CategoryRepository;

    constructor(repo: CategoryRepository) {
      this.repo = repo;
    }

    async execute(category: Category): Promise<Category> {
      try {
        return await this.repo.create(category);
      } catch (error) {
        throw new Error("createCategory error: " + (error as Error).message);
      }
    }
  }
