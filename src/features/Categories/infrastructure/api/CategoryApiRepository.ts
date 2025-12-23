import type { CategoryRepository } from "../../domain/ports/CategoryRepository";
import type { Category } from "../../domain/models/Category";

export class CategoryApiRepository implements CategoryRepository{
    private baseUrl: string = "http://localhost:8085/category";

    async getRootCategory(): Promise<Category[]> {
        const response = await fetch(`${this.baseUrl}/RootCategory`);
        const data = await response.json();
        return data;  
    }


    async getChildrensByParentId(id: number): Promise<Category []> {
    const response = await fetch(`${this.baseUrl}/childrensByparendId/${id}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
    }

  async getCategoryById(id: number): Promise<Category | null> {
    const res = await fetch(`${this.baseUrl}/childrensByparendId/${id}`);
    if (!res.ok) return null;
    return res.json();
  }

  async create(category: Category): Promise<Category> {
    const res = await fetch(`${this.baseUrl}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });

    if (!res.ok) {
      throw new Error(`Error creando categoría: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }


  async update(id: number, category: Category): Promise<Category> {
    const payload = { 
      description: category.description,
      percentage: category.percentage,
      parent: category.parent
    };
    const res = await fetch(`${this.baseUrl}/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  async delete(id: number): Promise<void> {
     const res = await fetch(`${this.baseUrl}/delete/${id}`, {
      method: "DELETE",
    });
    if (res.status === 204) {
    // éxito → simplemente retornamos
    return;
  } else if (res.status === 404) {
    throw new Error("La categoría no existe.");
  } else if (res.status === 500) {
    throw new Error("No se puede eliminar la categoría porque tiene dependencias.");
  } else {
    throw new Error(`Error inesperado: ${res.status}`);
  }
    
  }



}