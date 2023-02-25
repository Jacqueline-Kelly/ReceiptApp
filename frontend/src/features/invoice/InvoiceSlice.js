import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import invoiceService from "./InvoiceService";

const initialState = {
    invoice: {},
    isLoading: false,
    isSuccess: false,
    isError: false,
    isFormDone: false,
    isViewsDone: false,
    message: ''
}

export const createInvoice = createAsyncThunk('invoice/createInvoice', 
    async(file, thunkAPI) => {
        try {
            return await invoiceService.createInvoice(file) ;
        } catch(error) {
            const message = (error.response.data) ;
            return thunkAPI.rejectWithValue(message) ;      
        }
})

export const uploadInvoiceForm = createAsyncThunk('invoice/uploadInvoiceForm',
    async(form, thunkAPI) => {
            try {
                return await invoiceService.uploadInvoiceForm(form) ;
            } catch (error) {
                const message = (error.response.data) ;
                return thunkAPI.rejectWithValue(message) ;
            }
    }
)

export const viewInvoices = createAsyncThunk('invoice/viewInvoices', 
    async(dates, thunkAPI) => {
        try {
            return await invoiceService.viewInvoices(dates) ;
        } catch (error) {
            const message = (error.response.data) ;
            return thunkAPI.rejectWithValue(message) ;
        }   ;
    } 
) ;

export const invoiceSlice = createSlice({
    name:'invoice',
    initialState,
    reducers: {
        resetInvoice: (state) => {
            state.invoice = {}
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.isFormDone = false
            state.isViewsDone = false
        }
    },
    extraReducers(builder) {
        builder
            .addCase(createInvoice.pending,  (state) =>{
                state.isLoading = true
            }) 
            .addCase(createInvoice.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(createInvoice.fulfilled, (state, action) => {
                state.isLoading = false
                state.invoice = action.payload
                state.isSuccess = true
            })
            .addCase(uploadInvoiceForm.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isFormDone = true
            })
            .addCase(uploadInvoiceForm.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(uploadInvoiceForm.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(viewInvoices.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isViewsDone = true
                state.invoice = action.payload // set the invoice store to the array of invoice objects that match query parameters 
            })
            .addCase(viewInvoices.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(viewInvoices.pending, (state, action) => {
                state.isLoading = true
            })
    }
})


export const { resetInvoice } = invoiceSlice.actions
export default invoiceSlice.reducer