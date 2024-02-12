import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  onEdit: () => void;
  onDelete: () => void;
}

const RowActions = ({ onEdit, onDelete }: Props) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Tooltip title="Edit">
        <IconButton onClick={onEdit}>
          <EditIcon sx={{ color: "#4C5258" }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton onClick={onDelete}>
          <DeleteIcon sx={{ color: "#CC1212" }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default RowActions;
