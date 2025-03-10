import Dashboard from "./components/Dashboard";
import {Box} from "@mui/material";

function App () {
  return (
    <Box
    sx = {{
      display: "flex",
      justifyContent: "center",
      height: "100vh",
      width: "100vw",
      bgcolor: "f5f5f5"
    }}
    >
      <Dashboard/>
    </Box>
  );
}

export default App;