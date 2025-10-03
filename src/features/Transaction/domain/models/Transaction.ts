import type {Category} from "../../../Categories/domain/models/Category";

export interface Transaction {
    id: number;
    date: string;
    value: number;
    description: string;
    category: Category;
    userId: number;
}