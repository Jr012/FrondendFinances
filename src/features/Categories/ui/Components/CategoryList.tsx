import React, { useEffect, useState } from "react";
import type { Category } from "../../domain/models/Category";
import { GetRootCategories } from "../../aplication/use-cases/GetRootCategories";
import { CategoryApiRepository } from "../../infrastructure/api/CategoryApiRepository";

const repo = new CategoryApiRepository();
const getRootCategories = new GetRootCategories(repo);

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getRootCategories.execute().then(setCategories);
  }, []);

  return (
    <div>
      <h1>Categorías</h1>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>
            {cat.description}
          </li>
        ))}
      </ul>
    </div>
  );
}