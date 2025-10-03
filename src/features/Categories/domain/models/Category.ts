export interface Category{
    id: number;
    description: string;
    percentage: number | null;
    parent?: number;
}