import { AppProvider } from "@toolpad/core/AppProvider";
import Dashboard from "./pages/Dashboard";
import Box from "@mui/material/Box";

function App() {
  return (
    <AppProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          width: "100vw",
        }}
      >
        <Dashboard />
      </Box>
    </AppProvider>
  );
}

export default App;
