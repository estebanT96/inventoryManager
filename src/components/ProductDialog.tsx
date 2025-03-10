import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField, SelectChangeEvent } from '@mui/material';

interface ProductDialogProps {
  open: boolean;
  handleClose: () => void;
  handleSave: () => void;
  newProduct: { name: string; category: string; stock: string; price: string; expiration: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: SelectChangeEvent<string>) => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ open, handleClose, handleSave, newProduct, handleInputChange, handleSelectChange }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent>
        <TextField
          label="Product Name"
          autoFocus
          margin="dense"
          name="name"
          onChange={handleInputChange}
          type="text"
          fullWidth
          variant="outlined"
          value={newProduct.name}
        />
        <FormControl fullWidth variant="outlined" margin="dense">
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={newProduct.category}
            onChange={handleSelectChange}
            label="Category"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Clothing">Clothing</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          name="stock"
          label="Stock"
          type="number"
          fullWidth
          variant="outlined"
          value={newProduct.stock}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="price"
          label="Unit Price"
          type="number"
          fullWidth
          variant="outlined"
          value={newProduct.price}
          onChange={handleInputChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        {newProduct.category === "Food" && (
          <TextField
            margin="dense"
            name="expiration"
            label="Expiration Date"
            type="date"
            fullWidth
            variant="outlined"
            value={newProduct.expiration}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDialog;