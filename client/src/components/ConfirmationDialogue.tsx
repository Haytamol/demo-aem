import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  buttonText: string;
  titleText: string;
  contentText: string;
}

const ConfirmationDialogue = ({
  open,
  onClose,
  onConfirm,
  buttonText,
  titleText,
  contentText,
}: Props) => {
  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{titleText}</DialogTitle>
        <DialogContent>
          <DialogContentText>{contentText}</DialogContentText>
        </DialogContent>
        <DialogActions style={{ margin: 13 }}>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={onConfirm}
            color="error"
            autoFocus
          >
            {buttonText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmationDialogue;
