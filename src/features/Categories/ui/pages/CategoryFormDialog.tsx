import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

import type { Category } from "../../domain/models/Category";
import { CategoryApiRepository } from "../../infrastructure/api/CategoryApiRepository";
import { CreateCategory } from "../../aplication/use-cases/CreateCategory";
import { UpdateCategory } from "../../aplication/use-cases/UpdateCategory";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () =>  void;
  category?: Category;      // si viene → editar
  parentId?: number | null; // id del padre (para crear dentro de una jerarquía)
}

export const CategoryFormDialog: React.FC<Props> = ({
  open,
  onClose,
  onSuccess,
  category,
  parentId,
}) => {
  const [description, setDescription] = useState("");
  const [percentage, setPercentage] = useState<number>(0);

  useEffect(() => {
    if (category) {
      setDescription(category.description);
      setPercentage(category.percentage ?? 0);
    } else {
      setDescription("");
      setPercentage(0);
    }
  }, [category]);

  const handleSubmit = async () => {
    try {

      let payload: Partial<Category>;

      if (category) {
        payload = {
          id: category.id,
          description,
          percentage,
          parent: parentId ?? undefined,
        };
        // Editar
        console.log("Categoría actualizada:", payload);
        const useCase = new UpdateCategory(new CategoryApiRepository());
        await useCase.execute(category.id, payload as Category);
      } else {
        payload = {
          description,
          percentage,
          parent: parentId ?? undefined,
        };
        // Crear
         console.log("Categoría creada:", payload);
        const useCase = new CreateCategory(new CategoryApiRepository());
        await useCase.execute(payload as Category);   
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error guardando categoría:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {category ? "Editar Categoría" : "Nueva Categoría"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Descripción"
          type="text"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Porcentaje"
          type="number"
          fullWidth
          value={percentage}
          onChange={(e) => setPercentage(Number(e.target.value))}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};