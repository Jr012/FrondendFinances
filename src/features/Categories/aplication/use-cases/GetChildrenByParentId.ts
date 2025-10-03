import type { Category } from "../../domain/models/Category";
import type { CategoryRepository } from "../../domain/ports/CategoryRepository";

export class GetChildrensByParentId {
  private repo: CategoryRepository;

  constructor(repo: CategoryRepository) {
    this.repo = repo;
  }

   async execute(parentId: number): Promise<Category[]> {
    try {
      const result = this.repo.getChildrensByParentId(parentId);
      return result === null ? [] : result; 
    } catch (error) {
      throw new Error("getChildrensByParentId error: " + (error as Error).message);
    }
  }
}