import useStore from '../store';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const InventoryMetrics = () => {
  const { getTotalProductsInStock, getTotalValueInStock, getAveragePriceInStock } = useStore();

  const categories = ['Food', 'Clothing', 'Electronics', 'Overall'];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Inventory Metrics
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(130, 150, 170, .5)' }}>
              <TableCell sx={{ fontSize: '1rem' }}>Category</TableCell>
              <TableCell sx={{ fontSize: '1rem' }}>Total Products in Stock</TableCell>
              <TableCell sx={{ fontSize: '1rem' }}>Total Value in Stock</TableCell>
              <TableCell sx={{ fontSize: '1rem' }}>Average Price in Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow
              key={category}
              sx={
                category === 'Overall'
                  ? {
                      fontWeight: 'bold',
                      borderTop: '3px solid rgba(130, 150, 170, .5)', // Thicker border
                      bgcolor: '#181f26' , // Inner color
                    }
                  : { bgcolor: '#181f26' } // Inner color for other rows
              }
            >
                <TableCell sx={category === 'Overall' ? { fontWeight: 'bold', fontSize: '1rem' } : { fontSize: '1rem' }}>{category}</TableCell>
                <TableCell sx={category === 'Overall' ? { fontWeight: 'bold', fontSize: '1rem' } : { fontSize: '1rem' }}>{getTotalProductsInStock(category)}</TableCell>
                <TableCell sx={category === 'Overall' ? { fontWeight: 'bold', fontSize: '1rem' } : { fontSize: '1rem' }}>${getTotalValueInStock(category).toFixed(2)}</TableCell>
                <TableCell sx={category === 'Overall' ? { fontWeight: 'bold', fontSize: '1rem' } : { fontSize: '1rem' }}>${getAveragePriceInStock(category).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InventoryMetrics;