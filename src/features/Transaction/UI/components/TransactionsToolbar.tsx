import { Toolbar, Typography, IconButton, Tooltip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  numSelected: number;
  onDelete: () => void;
}

export const TransactionsToolbar = ({ numSelected, onDelete }: Props) => {
  return (
    <Toolbar
      sx={[
        { pl: { sm: 2 }, pr: { xs: 1, sm: 1 } },
        numSelected > 0  && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1">
          {numSelected} seleccionadas
        </Typography>
      ) : (
        <Typography sx={{ flex: "1 1 100%" }} variant="h6">
          TRANSACCIONES
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="Eliminar">
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};
