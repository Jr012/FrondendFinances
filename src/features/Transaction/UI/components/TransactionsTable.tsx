import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import type { Transaction } from "../../domain/models/Transaction";

interface Props {
  transactions: Transaction[];
  selected: readonly number[];
  onSelect: (id: number) => void;
  onEdit: (tx: Transaction) => void;
}

export const TransactionsTable = ({
  transactions,
  selected,
  onSelect,
  onEdit,
}: Props) => {
  // 🔹 Estados locales para la paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  
  const paginatedTransactions = transactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>FECHA</TableCell>
              <TableCell align="right">VALOR</TableCell>
              <TableCell align="center">SUB CATEGORIA</TableCell>
              <TableCell align="center">DESCRIPCIÓN</TableCell>
              <TableCell align="center">EDITAR</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedTransactions.map((tx) => {
              const isSelected = selected.includes(tx.id);
              return (
                <TableRow
                  key={tx.id}
                  hover
                  selected={isSelected}
                  onClick={() => onSelect(tx.id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={isSelected} />
                  </TableCell>
                  <TableCell>
                    {new Date(tx.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    {tx.value.toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    {tx.category?.description}
                  </TableCell>
                  <TableCell align="center">{tx.description}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      color="info"
                      endIcon={<EditIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(tx);
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

      {/* 🔹 Componente de paginación */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={transactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página"
      />
    </>
  );
};
