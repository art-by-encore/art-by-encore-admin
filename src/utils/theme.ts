import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#e14807",
    },
    secondary: {
      main: "#ffffff4d",
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
