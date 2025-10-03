import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import EditIcon from '@mui/icons-material/Edit';
import TablePagination from "@mui/material/TablePagination";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { WindowsConfirmation } from "../../../shared/Components/WindowsConfirmation";
import { CategoryFormDialog } from "./CategoryFormDialog";

import { GetRootCategories } from "../../aplication/use-cases/GetRootCategories";
import { GetChildrensByParentId } from "../../aplication/use-cases/GetChildrenByParentId";
import { DeleteCategory } from "../../aplication/use-cases/DeleteCategory";
import type { Category } from "../../domain/models/Category";
import { CategoryApiRepository } from "../../infrastructure/api/CategoryApiRepository";

function EnhancedTableHead(props: {
  numSelected: number;
  rowCount: number;
  onSelectAllClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        <TableCell>CATEGORY</TableCell>
        <TableCell align="right">PERCENTAGE</TableCell>
        <TableCell align="center">INGRESAR</TableCell>
        <TableCell align="center">EDITAR</TableCell>
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  handleDelete: () => void;
}

export const SubCategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [alert, setAlert] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const [description, setDescription] = useState<string>("");
  const [parentId, setParentId] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const loadCategories = async () => {
    const useCase = new GetRootCategories(new CategoryApiRepository());
    const data = await useCase.execute();
    setCategories(data);
  };

const handleChangePage = (_: unknown, newPage: number) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0); 
};

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, handleDelete } = props;


  return (
    <Toolbar
      sx={[
        { pl: { sm: 2 }, pr: { xs: 1, sm: 1 } },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: "1 1 100%" }} variant="h6" component="div">
          {description}
          { parentId === 0 ? "CATEGORIAS"  : ``}
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton onClick={() => setOpenConfirm(true)} >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}



  useEffect(() => {
    loadCategories();
  }, []);

  const saveparentId = (id: number, description: string) => {
    setParentId(id);
    setDescription(description);
  };

  const handleIngresar = async (parentId: number) => {
    const useCase = new GetChildrensByParentId(new CategoryApiRepository());
    const data = await useCase.execute(parentId);
    setCategories(data ?? []);
  };

  const handleDelete = async () => {
    try {
      const useCase = new DeleteCategory(new CategoryApiRepository());
      for (const id of selected) {
        await useCase.execute(id);
      }
      if (parentId === 0) {
      await loadCategories();
    } else {
      await handleIngresar(parentId);
    }
      setSelected([]);
      setAlert({ open: true, type: "success", message: "Categoría eliminada correctamente" });
    } catch (error: any) {
      setAlert({ open: true, type: "error", message: error.message || "Error al eliminar" });
    }finally {
      setOpenConfirm(false); 
    }
  };

  const handleNewCategory = () => {
    setSelectedCategory(undefined);
    setOpenDialog(true);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = selected.concat(id);
    } else if (selectedIndex === 0) {
      newSelected = selected.slice(1);
    } else if (selectedIndex === selected.length - 1) {
      newSelected = selected.slice(0, -1);
    } else if (selectedIndex > 0) {
      newSelected = [...selected.slice(0, selectedIndex), ...selected.slice(selectedIndex + 1)];
    }
    setSelected(newSelected);
  };

  return (
    <Box sx={{ width: "100%" }}>
      
      {parentId !== 0 && (
        <Button variant="contained" color="success" sx={{ mb: 2 }} onClick={handleNewCategory}>
          Nueva Categoría
        </Button>
      )}

      <Paper sx={{ width: "100%", mb: 2, border: "2px solid #e1e1e1ff" }}>
        <EnhancedTableToolbar numSelected={selected.length} handleDelete={handleDelete} />
        <TableContainer>
          <Table sx={{ minWidth: 100 }}>
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={(e) =>
                e.target.checked ? setSelected(categories.map((c) => c.id)) : setSelected([])
              }
              rowCount={categories.length}
            />
            <TableBody>
              {categories
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((cat) => {
                const isItemSelected = selected.includes(cat.id);
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, cat.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={cat.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" checked={isItemSelected} />
                    </TableCell>
                    <TableCell>{cat.description}</TableCell>
                    <TableCell align="right">{(cat.percentage ?? 0) + "%"}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<KeyboardArrowDownIcon />}
                        color="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIngresar(cat.id)
                          saveparentId(cat.id, cat.description);
                        }}
                      >
                        Ingresar
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        endIcon={<EditIcon />}
                        color="info"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(cat); setOpenDialog(true); ;
                        }}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={categories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}/>
                
      </Paper>

      {/* ✅ Snackbar con Alert */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          severity={alert.type}
          onClose={() => setAlert({ ...alert, open: false })}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      {/* ✅ Formulario en modal */}
      <CategoryFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSuccess={() => handleIngresar(parentId!)}
        category={selectedCategory}
        parentId={parentId}
      />
      <WindowsConfirmation
        open={openConfirm}
        title="Eliminar SubCategoría"
        message="¿Está seguro que desea eliminar la(s) subcategoría(s) seleccionada(s)?"
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleDelete}
/>
    </Box>
  );
};
