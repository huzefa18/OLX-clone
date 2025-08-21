import { GetJSON, API_BASE} from "../baseApi";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCategories=createAsyncThunk (
    'categories/fetchAll',
    async()=>
    {
        const data=await GetJSON(`${API_BASE}/categories`);
        return data;
    }
)
const categoriesSlice=createSlice(
    {
        name:'categories',
        initialState:{
            list:[],
            status:'idle',
            error:null 
        },
        reducers:{},
        extraReducers:(builder)=>
        {
            builder
            .addCase(fetchCategories.pending,(state)=>
            {
                state.status='loading';
                state.error=null;

            })
            .addCase(fetchCategories.fulfilled,(state,action)=>
            {
                state.list=action.payload;
                state.status='success'
            })
            .addCase(fetchCategories.rejected , (state,action)=>
            {
                state.error=action.payload;
                state.status='failed'
            })
        }
        
    }

);
export default categoriesSlice.reducer;
