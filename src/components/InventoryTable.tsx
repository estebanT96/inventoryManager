import React from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography, Paper } from '@mui/material';

interface InventoryItem {
  category: string;
  name: string;
  price: number;
  expiration: string | null;
  stock: number;
  checked: boolean;
}

interface InventoryTableProps {
  paginatedData: InventoryItem[];
  sortField: keyof InventoryItem;
  sortOrder: "asc" | "desc";
  handleSort: (field: keyof InventoryItem) => void;
  handleCheckboxChange: (index: number) => void;
  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;
  getRowBackground: (expiration: string | null) => { color: string; daysUntilExpiration: number | null };
  getStockCellColor: (stock: number) => string;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ paginatedData, sortField, sortOrder, handleSort, handleCheckboxChange, handleEdit, handleDelete, getRowBackground, getStockCellColor }) => {
  const handleCheckboxToggle = (index: number) => {
    handleCheckboxChange(index);
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 4, mb: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>✔</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === "category"}
                direction={sortOrder}
                onClick={() => handleSort("category")}
              >
                Category
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === "name"}
                direction={sortOrder}
                onClick={() => handleSort("name")}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === "price"}
                direction={sortOrder}
                onClick={() => handleSort("price")}
              >
                Price
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === "expiration"}
                direction={sortOrder}
                onClick={() => handleSort("expiration")}
              >
                Expiration Date
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === "stock"}
                direction={sortOrder}
                onClick={() => handleSort("stock")}
              >
                Stock
              </TableSortLabel>
            </TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((item, index) => {
            const { color, daysUntilExpiration } = getRowBackground(item.expiration);
            return (
              <TableRow
                key={index}
                sx={{ textDecoration: item.stock === 0 ? "line-through" : "none" }}
              >
                <TableCell>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleCheckboxToggle(index)}
                  />
                </TableCell>
                <TableCell sx={{ backgroundColor: color }}>
                  {item.category}
                </TableCell>
                <TableCell sx={{ backgroundColor: color }}>
                  {item.name}
                </TableCell>
                <TableCell sx={{ backgroundColor: color }}>
                  ${Number(item.price).toFixed(2)}
                </TableCell>
                <TableCell sx={{ backgroundColor: color }}>
                  {item.expiration || "-"}
                  {daysUntilExpiration !== null && daysUntilExpiration >= 7 && daysUntilExpiration <= 14 && (
                    <Typography variant="caption" color="error">
                      {` (expiring in ${daysUntilExpiration} days)`}
                    </Typography>
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: getStockCellColor(item.stock),
                    fontWeight: "bold",
                    borderLeft: "0.5px solid black",
                    borderRight: "0.5px solid black",
                  }}
                >
                  {item.stock}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ mr: 1, fontWeight: "bold" }}
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#e85831",
                      "&:hover": {
                        backgroundColor: "#d64b24",
                      },
                      fontWeight: "bold",
                    }}
                    size="small"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InventoryTable;