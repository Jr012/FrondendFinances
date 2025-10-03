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
import TablePagination from "@mui/material/TablePagination";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";

import { WindowsConfirmation } from "../../../shared/Components/WindowsConfirmation";
import { TransactionForms } from "./TransactionForms"; // ✅ Importamos el formulario

import type { Transaction } from "../../domain/models/Transaction";
import { TransactionApiRepository } from "../../infrastructure/api/TransactionApiRepository";
import { GetAllTransactions } from "../../aplication/use-case/getAllTransactions";
import { DeleteTransaction } from "../../aplication/use-case/deleteTransaction";

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
        <TableCell>FECHA</TableCell>
        <TableCell align="right">VALOR</TableCell>
        <TableCell align="center">SUB CATEGORIA</TableCell>
        <TableCell align="center">DESCRIPCIÓN</TableCell>
        <TableCell align="center">EDITAR</TableCell>
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  handleDelete: () => void;
}

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
          {numSelected} seleccionadas
        </Typography>
      ) : (
        <Typography sx={{ flex: "1 1 100%" }} variant="h6" component="div">
          TRANSACCIONES
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="Eliminar">
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [alert, setAlert] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const [openConfirm, setOpenConfirm] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ✅ Estado para modal de formulario
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();

  const loadTransactions = async () => {
    const useCase = new GetAllTransactions(new TransactionApiRepository());
    const data = await useCase.execute();
    setTransactions(data);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async () => {
    try {
      const useCase = new DeleteTransaction(new TransactionApiRepository());
      for (const id of selected) {
        await useCase.execute(id);
      }
      await loadTransactions();
      setSelected([]);
      setAlert({ open: true, type: "success", message: "Transacción eliminada correctamente" });
    } catch (error: any) {
      setAlert({ open: true, type: "error", message: error.message || "Error al eliminar" });
    } finally {
      setOpenConfirm(false);
    }
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

  const handleNewTransaction = () => {
    setSelectedTransaction(undefined);
    setOpenDialog(true);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* ✅ Botón siempre activo */}
      <Button
        variant="contained"
        color="success"
        sx={{ mb: 2 }}
        onClick={handleNewTransaction}
      >
        Nueva Transacción
      </Button>

      <Paper sx={{ width: "100%", mb: 2, border: "2px solid #e1e1e1ff" }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          handleDelete={() => setOpenConfirm(true)}
        />
        <TableContainer>
          <Table sx={{ minWidth: 100 }}>
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={(e) =>
                e.target.checked ? setSelected(transactions.map((t) => t.id)) : setSelected([])
              }
              rowCount={transactions.length}
            />
            <TableBody>
              {transactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((tx) => {
                  const isItemSelected = selected.includes(tx.id);
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, tx.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={tx.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox color="primary" checked={isItemSelected} />
                      </TableCell>
                      <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                      <TableCell align="right">{tx.value.toLocaleString()}</TableCell>
                      <TableCell align="center">{tx.category?.description}</TableCell>
                      <TableCell align="center">{tx.description}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          size="small"
                          endIcon={<EditIcon />}
                          color="info"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTransaction(tx);
                            setOpenDialog(true);
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
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
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

      {/* ✅ Confirmación de eliminación */}
      <WindowsConfirmation
        open={openConfirm}
        title="Eliminar Transacciones"
        message="¿Está seguro que desea eliminar la(s) transacción(es) seleccionada(s)?"
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleDelete}
      />

      {/* ✅ Modal de formulario */}
      <TransactionForms
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSuccess={loadTransactions}
        transaction={selectedTransaction}
      />
    </Box>
  );
};
