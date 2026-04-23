import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

const initialState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchItems = createAsyncThunk(
    'items/fetchAll',
    async (_, thunkAPI) => {
        try {
            const response = await API.get('/items');
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const searchItems = createAsyncThunk(
    'items/search',
    async (name, thunkAPI) => {
        try {
            const response = await API.get(`/items/search?name=${name}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const addItem = createAsyncThunk(
    'items/add',
    async (itemData, thunkAPI) => {
        try {
            const response = await API.post('/items', itemData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateItem = createAsyncThunk(
    'items/update',
    async ({ id, itemData }, thunkAPI) => {
        try {
            const response = await API.put(`/items/${id}`, itemData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteItem = createAsyncThunk(
    'items/delete',
    async (id, thunkAPI) => {
        try {
            await API.delete(`/items/${id}`);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const itemSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => { state.loading = true; })
            .addCase(fetchItems.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
            .addCase(fetchItems.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(searchItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(addItem.fulfilled, (state, action) => { state.items.unshift(action.payload); })
            .addCase(updateItem.fulfilled, (state, action) => {
                const index = state.items.findIndex((i) => i._id === action.payload._id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(deleteItem.fulfilled, (state, action) => {
                state.items = state.items.filter((i) => i._id !== action.payload);
            });
    },
});

export default itemSlice.reducer;
