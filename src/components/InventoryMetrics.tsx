import React from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

interface InventoryMetricsProps {
  calculateMetrics: () => { category: string; totalStock: number; totalValue: number; avgPrice: number }[];
}

const InventoryMetrics: React.FC<InventoryMetricsProps> = ({ calculateMetrics }) => {
  return (
    <Box component={Paper} sx={{ mt: 2, mb: 2, p: 3, bgcolor: "#f9f9f9", borderRadius: 2 }}>
      <Typography
        variant="h6"
        sx={{
          color: "black",
          fontWeight: "bold",
          textDecoration: "underline",
        }}
      >
        Inventory Metrics
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>
              Total Products in Stock
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>
              Total Value in Stock
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>
              Average Price in Stock
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {calculateMetrics().map(
            ({ category, totalStock, totalValue, avgPrice }) => (
              <TableRow
                key={category}
                sx={{
                  borderTop:
                    category === "Overall" ? "1.5px solid gray" : "none",
                  fontWeight: category === "Overall" ? "bold" : "normal",
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: category === "Overall" ? "bold" : "normal",
                  }}
                >
                  {category}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: category === "Overall" ? "bold" : "normal",
                  }}
                >
                  {totalStock}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: category === "Overall" ? "bold" : "normal",
                  }}
                >
                  ${totalValue.toFixed(2)}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: category === "Overall" ? "bold" : "normal",
                  }}
                >
                  ${avgPrice.toFixed(2)}
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default InventoryMetrics;