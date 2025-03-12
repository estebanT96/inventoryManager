import { AppProvider } from "@toolpad/core/AppProvider";
import Dashboard from "./pages/Dashboard";
import Box from '@mui/material/Box';

function App() {
  return (
    <AppProvider>
      <Box sx={{ bgcolor: '#212a33', minHeight: '100vh' }}>
        <Dashboard />
      </Box>
    </AppProvider>
  );
}

export default App;