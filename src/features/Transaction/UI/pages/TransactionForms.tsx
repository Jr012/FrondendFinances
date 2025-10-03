import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

import type { Transaction } from "../../domain/models/Transaction";
import type { Category } from "../../../Categories/domain/models/Category"; 
import { TransactionApiRepository } from "../../infrastructure/api/TransactionApiRepository";
import { CreateTransaction } from "../../aplication/use-case/createTransaction";
import { UpdateTransaction } from "../../aplication/use-case/updateTransaction";
import { CategoryApiRepository } from "../../../Categories/infrastructure/api/CategoryApiRepository";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction?: Transaction;
}

export const TransactionForms: React.FC<Props> = ({
  open,
  onClose,
  onSuccess,
  transaction,
}) => {
  const [date, setDate] = useState("");
  const [value, setValue] = useState<number>(0);
  const [description, setDescription] = useState("");

  // 🔹 Manejo dinámico de categorías
  const [levels, setLevels] = useState<Category[][]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (transaction) {
      setDate(transaction.date);
      setValue(transaction.value);
      setDescription(transaction.description);
      setSelectedCategories([transaction.category]);
    } else {
      setDate("");
      setValue(0);
      setDescription("");
      setSelectedCategories([]);
    }
  }, [transaction]);

  // 👉 al abrir el modal, cargo las categorías raíz
  useEffect(() => {
    if (open) {
      loadRootCategories();
    }
  }, [open]);

  const loadRootCategories = async () => {
    const repo = new CategoryApiRepository();
    const roots = await repo.getRootCategory();
    setLevels([roots]);
    setSelectedCategories([]);
  };

  const loadChildren = async (parentId: number, levelIndex: number) => {
  const repo = new CategoryApiRepository();
  const children = await repo.getChildrensByParentId(parentId);

  const newLevels = levels.slice(0, levelIndex + 1);
  if (children.length > 0) {
    newLevels.push(children);
  }
  setLevels(newLevels);

  // ❌ antes: cortabas la selección
  // const newSelected = selectedCategories.slice(0, levelIndex + 1);
  // setSelectedCategories(newSelected);

  // ✅ ahora: conserva lo que ya seleccionaste
  setSelectedCategories((prev) => {
    const copy = [...prev];
    copy.length = levelIndex + 1; // mantiene hasta el nivel actual
    return copy;
  });
};


  const handleCategoryChange = async (levelIndex: number, cat: Category | null) => {
  setSelectedCategories((prev) => {
    const newSelected = [...prev];
    newSelected[levelIndex] = cat!;
    return newSelected;
  });

  if (cat) {
    await loadChildren(cat.id, levelIndex);
  }
};

  const handleSubmit = async () => {
    try {
      const lastCategory = selectedCategories[selectedCategories.length - 1];
      const categoryId = lastCategory?.id;

      const payload = {
        date,
        value,
        description,
        categoryId,
        userId: 1,
      };

      const repo = new TransactionApiRepository();

      if (transaction) {
        const useCase = new UpdateTransaction(repo);
        await useCase.execute(transaction.id, payload as any);
      } else {
        const useCase = new CreateTransaction(repo);
        await useCase.execute(payload as any);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("❌ Error guardando transacción:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {transaction ? "Editar Transacción" : "Nueva Transacción"}
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Fecha"
          type="date"
          fullWidth
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          margin="dense"
          label="Valor"
          type="number"
          fullWidth
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <TextField
          margin="dense"
          label="Descripción"
          type="text"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* 🔹 Selects dinámicos con Autocomplete */}
        {levels.map((categories, idx) => {
          const selectedCat = selectedCategories[idx] ?? null;

          return (
            <Autocomplete
              key={idx}
              options={categories}
              getOptionLabel={(option) => option.description}
              value={selectedCat}
              onChange={(event, newValue) =>
                handleCategoryChange(idx, newValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                   margin="dense"
                  fullWidth
                  label={idx === 0 ? "Categoría raíz" : `Subcategoría nivel ${idx}`}
                  placeholder={selectedCat ? selectedCat.description : "Seleccione..."}
                />
              )}
            />
          );
        })}
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
