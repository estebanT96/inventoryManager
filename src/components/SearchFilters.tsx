import React from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, SelectChangeEvent } from '@mui/material';
import Grid2 from '@mui/material/Grid2';

interface SearchFiltersProps {
  searchFilters: { name: string; category: string; availability: string };
  updateSearchFilters: (field: string, value: string | string[]) => void;
  handleSearch: () => void;
  handleClearSearch: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ searchFilters, updateSearchFilters, handleSearch, handleClearSearch }) => {
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    updateSearchFilters("category", value);
  };

  return (
    <Box component="form" sx={{ mb: 4 }}>
      <Grid2 container spacing={2} alignItems="center">
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <TextField
            label="Enter Product Name..."
            variant="outlined"
            fullWidth
            value={searchFilters.name}
            onChange={(e) => updateSearchFilters("name", e.target.value)}
            sx={{ height: "56px", fontStyle: "italic"}}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <FormControl variant="outlined" fullWidth sx={{ height: "56px" }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={searchFilters.category}
              onChange={handleCategoryChange}
              label="Category"
              MenuProps={{
                PaperProps: {
                  sx: {
                    '& .Mui-selected': {
                      backgroundColor: 'rgba(0, 0, 255, 0.1)', // Light blue background for selected items
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 255, 0.2)', // Darker blue background on hover
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Food">Food</MenuItem>
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Clothing">Clothing</MenuItem>
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <FormControl variant="outlined" fullWidth sx={{ height: "56px" }}>
            <InputLabel>Availability</InputLabel>
            <Select
              value={searchFilters.availability}
              onChange={(e) => updateSearchFilters("availability", e.target.value)}
              label="Availability"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ fontWeight: "bold", height: "56px" }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 1 }}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ fontWeight: "bold", height: "56px" }}
            onClick={handleClearSearch}
          >
            Clear
          </Button>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default SearchFilters;