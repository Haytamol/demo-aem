import { Box, Button, Divider, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface Props {
  onClick?: () => void;
  pageTitle: string;
  buttonText?: string;
}
const PageHeader = ({ onClick, pageTitle, buttonText }: Props) => {
  return (
    <Box display="flex" flexDirection="column" marginBottom={4}>
      <Box display="flex" justifyContent="space-between" marginY={4}>
        <Typography variant="h2">{pageTitle}</Typography>
        {buttonText && (
          <Button
            onClick={onClick}
            variant="contained"
            startIcon={<AddIcon />}
            style={{
              textTransform: "none",
              fontSize: "0.9rem",
            }}
          >
            {buttonText}
          </Button>
        )}
      </Box>
      <Divider />
    </Box>
  );
};

export default PageHeader;
