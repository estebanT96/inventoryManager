import { AppProvider } from "@toolpad/core/AppProvider";
import Dashboard from "./pages/Dashboard";
import Box from '@mui/material/Box';

function App() {
  return (
    <AppProvider>
      <Box sx={{ display:"flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: '#212a33',
        bgcolor: '#212a33', minHeight: '100vh' }}>
        <Dashboard />
      </Box>
    </AppProvider>
  );
}

export default App;