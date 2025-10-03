import type { Category } from "../models/Category";

export interface CategoryRepository{

    getRootCategory(): Promise<Category[]>;
    getChildrensByParentId(id: number): Promise<Category []>;  
    getCategoryById(id: number): Promise<Category | null>;   
    create(category: Category): Promise<Category>;
    update(category: Category): Promise<Category>;
    delete(id: number): Promise<void>;

}