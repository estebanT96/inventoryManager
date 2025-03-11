import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface Product {
  id: number; // Add a unique identifier for each product
  category: string;
  name: string;
  price: number;
  expiration: string | null;
  stock: number;
  checked: boolean;
}

type SortOrder = "asc" | "desc";

interface InventoryTableProps {
  paginatedData: Product[];
  sortField: keyof Product;
  sortOrder: SortOrder;
  handleSort: (field: keyof Product) => void;
  handleCheckboxChange: (id: number) => void; // Change to use the unique identifier
  handleEdit: (id: number) => void; // Change to use the unique identifier
  handleDelete: (id: number) => void; // Change to use the unique identifier
  getRowBackground: (expiration: string | null) => { color: string; daysUntilExpiration: number | null };
  getStockCellColor: (stock: number) => string;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ paginatedData, sortField, sortOrder, handleSort, handleCheckboxChange, handleEdit, handleDelete, getRowBackground, getStockCellColor }) => {
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleCheckboxToggle = (id: number) => {
    handleCheckboxChange(id);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteId(null);
  };

  const handleConfirmDelete = () => {
    if (deleteId !== null) {
      handleDelete(deleteId);
    }
    handleClose();
  };

  return (
    <>
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
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No items to be displayed.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => {
                const { color, daysUntilExpiration } = getRowBackground(item.expiration);
                return (
                  <TableRow
                    key={item.id}
                    sx={{ textDecoration: item.stock === 0 ? "line-through" : "none" }}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleCheckboxToggle(item.id)}
                        style={{ accentColor: item.checked ? 'blue' : 'initial' }}
                      />
                    </TableCell>
                    <TableCell sx={{ backgroundColor: item.stock === 0 ? "transparent" : color }}>
                      {item.category}
                    </TableCell>
                    <TableCell sx={{ backgroundColor: item.stock === 0 ? "transparent" : color }}>
                      {item.name}
                    </TableCell>
                    <TableCell sx={{ backgroundColor: item.stock === 0 ? "transparent" : color }}>
                      ${Number(item.price).toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ backgroundColor: item.stock === 0 ? "transparent" : color }}>
                      {item.category === "Food" ? (
                        <>
                          {item.expiration || "-"}
                          {daysUntilExpiration !== null && (
                            <Typography variant="caption" color="black" sx={{ fontWeight: "bold", fontStyle: "italic" }}>
                              {` (expiring in ${daysUntilExpiration} days)`}
                            </Typography>
                          )}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: item.stock === 0 ? "transparent" : getStockCellColor(item.stock),
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
                        onClick={() => handleEdit(item.id)}
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
                        onClick={() => handleDeleteClick(item.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InventoryTable;