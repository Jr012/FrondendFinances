import { useState } from "react";
import { Box, Button, Snackbar, Alert, Paper } from "@mui/material";
import { TransactionsTable } from "../components/TransactionsTable";
import { TransactionsToolbar } from "../components/TransactionsToolbar";
import { TransactionsFilters } from "../components/TransactionsFilters";
import { WindowsConfirmation } from "../../../shared/Components/WindowsConfirmation";
import { TransactionForms } from "../components/TransactionForms";
import { useTransactions } from "../hooks/useTransactions";
import type { Transaction } from "../../domain/models/Transaction";

export const TransactionsPage = () => {
  const { transactions, deleteTransactions, filterTransactions } = useTransactions();
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [alert, setAlert] = useState({ open: false, type: "success" as "success" | "error", message: "" });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();

  const handleDelete = async () => {
    try {
      await deleteTransactions([...selected]);
      setSelected([]);
      setAlert({ open: true, type: "success", message: "Eliminado con éxito" });
    } catch (e: any) {
      setAlert({ open: true, type: "error", message: e.message });
    } finally {
      setOpenConfirm(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Button variant="contained" color="success" sx={{ mb: 2 }} onClick={() => setOpenDialog(true)}>
        Nueva Transacción
      </Button>


      <Button variant="contained" color="success" sx={{ mb: 15 }} onClick={() => setOpenFilter(true)}>
        Filtrar
      </Button>

     <TransactionsFilters
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        onFilter={filterTransactions}
        
      />
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TransactionsToolbar numSelected={selected.length} onDelete={() => setOpenConfirm(true)} />
        <TransactionsTable
          transactions={transactions}
          selected={selected}
          onSelect={(id) => setSelected((prev) => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))}
          onEdit={(tx) => {
            setSelectedTransaction(tx);
            setOpenDialog(true);
          }}
        />
      </Paper>

      <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert({ ...alert, open: false })}>
        <Alert severity={alert.type}>{alert.message}</Alert>
      </Snackbar>

      <WindowsConfirmation
        open={openConfirm}
        title="Eliminar"
        message="¿Seguro de eliminar?"
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleDelete}
      />

      <TransactionForms
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSuccess={() => console.log("Filtrado aplicado")}
        transaction={selectedTransaction}
      />
    </Box>
  );
};
