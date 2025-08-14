import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/currencies`

const initialState = {
  currencies: [],
  fetchingCurrencies: false,
  fetchCurrReqId: undefined,
  currencyListErrors: {
    currencyCode: '',
    currencyName: '',
    currencySymbol: '',
    multiplier: '',
  },
  showCurrListReqId: undefined,
  showingCurrlistError: false,
  storeCurrListReqId: undefined,
  creatingCurrList: false,
}

const fetchCurrencies = createAsyncThunk('currencies/fetchCurrencies', async (_, thunkAPI) => {
  const { fetchCurrReqId, fetchingCurrencies } = thunkAPI.getState().currency
  if (!fetchingCurrencies || thunkAPI.requestId !== fetchCurrReqId) {
    return
  }
  try {
    const res = await api().get(`${ApiUrl}`)
    return thunkAPI.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunkAPI.rejectWithValue(err.response.data)
  }
})

const storeCurrencyList = createAsyncThunk('currency/storeCurrencyList', async (field, thunk) => {
  const { storeCurrListReqId, creatingCurrList } = thunk.getState().currency
  if (!creatingCurrList || thunk.requestId !== storeCurrListReqId) {
    return false
  }
  try {
    const res = await api().post(`${ApiUrl}`, field)
    console.log(res.data)
    return thunk.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunk.rejectWithValue(err.response.data)
  }
})

const showFinitemError = createAsyncThunk('currency/showFinitemError', async (field, thunk) => {
  const { showCurrListReqId, showingCurrlistError } = thunk.getState().currency
  if (!showingCurrlistError || thunk.requestId !== showCurrListReqId) {
    return false
  }

  return thunk.fulfillWithValue(field)
})

const clearFinitemError = createAsyncThunk('currency/clearFinitemError', async (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

export const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchCurrencies.pending]: (state, action) => {
      if (!state.fetchingCurrencies) {
        state.fetchingCurrencies = true
        state.fetchCurrReqId = action.meta.requestId
      }
    },
    [fetchCurrencies.fulfilled]: (state, action) => {
      if (state.fetchingCurrencies && state.fetchCurrReqId === action.meta.requestId) {
        state.fetchingCurrencies = false
        state.fetchCurrReqId = undefined
      }
      if (action.payload) {
        state.currencies = action.payload
      }
    },
    [fetchCurrencies.rejected]: (state, action) => {
      if (state.fetchingCurrencies) {
        state.fetchingCurrencies = false
        state.fetchCurrReqId = action.meta.requestId
      }
    },
    [clearFinitemError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errCurrList') {
        state.currencyListErrors = {
          ...state.currencyListErrors,
          [action.payload.type]: '',
        }
      }
    },
    [showFinitemError.pending]: (state, action) => {
      if (!state.showingCurrlistError) {
        state.showingCurrlistError = true
        state.showCurrListReqId = action.meta.requestId
      }
    },
    [showFinitemError.fulfilled]: (state, action) => {
      if (state.showingCurrlistError && state.showCurrListReqId === action.meta.requestId) {
        state.showingCurrlistError = false
        state.showCurrListReqId = undefined
      }
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errCurrList':
            state.currencyListErrors = {
              ...state.currencyListErrors,
              [action.payload.type]: 'This field is required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [showFinitemError.rejected]: (state, action) => {
      if (state.showingCurrlistError) {
        state.showingCurrlistError = false
        state.showCurrListReqId = action.meta.requestId
      }
    },
    [storeCurrencyList.pending]: (state, action) => {
      if (!state.creatingCurrList) {
        state.creatingCurrList = true
        state.storeCurrListReqId = action.meta.requestId
      }
    },
    [storeCurrencyList.fulfilled]: (state, action) => {
      if (state.creatingCurrList && state.storeCurrListReqId === action.meta.requestId) {
        state.creatingCurrList = false
        state.storeCurrListReqId = undefined
      }
      if (action.payload) {
        state.currencies = [action.payload, ...state.currencies]
        state.currencyListErrors = {
          currencyCode: '',
          currencyName: '',
          currencySymbol: '',
          multiplier: '',
        }
      }
    },
    [storeCurrencyList.rejected]: (state, action) => {
      if (state.creatingCurrList) {
        state.creatingCurrList = false
        state.storeCurrListReqId = action.meta.requestId
      }
      if (action.payload) {
        if (action.payload.errors) {
          for (const [key, value] of Object.entries(action.payload.errors)) {
            state.currencyListErrors = {
              ...state.currencyListErrors,
              [key]: value,
            }
          }
        }
      }
    },
  },
})

export { fetchCurrencies, storeCurrencyList, clearFinitemError, showFinitemError }
export default currencySlice.reducer
