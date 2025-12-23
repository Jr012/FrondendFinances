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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import  { Dayjs } from "dayjs";

import type { Category } from "../../../Categories/domain/models/Category";
import { CategoryApiRepository } from "../../../Categories/infrastructure/api/CategoryApiRepository";
import { useTransactions } from "../hooks/useTransactions";

interface Props {
  open: boolean;
  onClose: () => void;
  onFilter: (categoryId?: number, month?: number, year?: number) => Promise<void>;  
}

export const TransactionsFilters: React.FC<Props> = ({
  open,
  onClose,
  onFilter,
}) => {
    
  const { filterTransactions } = useTransactions();
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const [month, setMonth] = React.useState<number | null>(null);
  const [year, setYear] = React.useState<number | null>(null);

  const [listroot, setListRoot] = useState<Category[][]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (open) {
      loadRootCategories();
      setValue(null);
      setMonth(null);
      setYear(null);
      setSelectedCategories([]);
    }
  }, [open]);


  const loadRootCategories = async () => {
    const repo = new CategoryApiRepository();
    const roots = await repo.getRootCategory();
    setListRoot([roots]);
    setSelectedCategories([]);
  };

  const loadChildren = async (parentId: number, levelIndex: number) => {
    const repo = new CategoryApiRepository();
    const children = await repo.getChildrensByParentId(parentId);

    const newLevels = listroot.slice(0, levelIndex + 1);
    if (children.length > 0) newLevels.push(children);
    setListRoot(newLevels);

    setSelectedCategories((prev) => {
      const copy = [...prev];
      copy.length = levelIndex + 1;
      return copy;
    });
  };

  const handleCategoryChange = async (levelIndex: number, cat: Category | null) => {
    setSelectedCategories((prev) => {
      const newSelected = [...prev];
      newSelected[levelIndex] = cat!;
      return newSelected;
    });

    if (cat) await loadChildren(cat.id, levelIndex);
  };

  const handleChange = (newValue: Dayjs | null) => {
  setValue(newValue);
  if (newValue) {
    setMonth(newValue.month() + 1); 
    setYear(newValue.year());
  } else {
    setMonth(null);
    setYear(null);
  }
};

  const handleFilter = async (categoryId: number, month?: number, year?: number) => {
    await filterTransactions(categoryId, month, year);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Filtrar Transacciones</DialogTitle>
      <DialogContent>
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
            views={["year", "month"]}
            value={value}
            onChange={handleChange}
        />
        </LocalizationProvider>

        {listroot.map((categories, idx) => {
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
        <Button
        variant="contained"
        color="primary"
        onClick={async () => {
            const lastSelectedCat = selectedCategories[selectedCategories.length - 1];
            const idToSend = lastSelectedCat ? lastSelectedCat.id : undefined;

            await onFilter(idToSend, month ?? undefined, year ?? undefined);
            onClose();
        }}
        >
        Guardar
        </Button>
      </DialogActions>
    </Dialog>

    
  );
};
