import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/finitems`

const initialState = {
  finitems: [],
  fetchingFinitems: false,
  fetchFinitemReqId: undefined,
  finitemErrors: {
    Code: '',
    Name: '',
    InvolineType: '',
    ItemType: '',
    Status: '',
    NameForeign: '',
    IntegrationNames: '',
    Salable: '',
    Purchasable: '',
    SalesPrice: '',
    SalesCurr: '',
    PurchasePrice: '',
    PurchaseNotes: '',
    AutoCalcRate: '',
    PurchaseControllRate: '',
    PurchaseCurr: '',
    PurchaseTaxId: '',
    SalesControllRate: '',
    SalesNotes: '',
    SalesTaxId: '',
    ExtsServiceId: '',
    AutoCalcFinitemId: '',
  },
  showFinitemReqId: undefined,
  showingFinitemError: false,
  createFinitemReqId: undefined,
  creatingFinitem: false,
  destFinitemReqId: undefined,
  deletingFinitem: false,
}

const fetchFinitems = createAsyncThunk('finitems/fetchFinitems', async (_, thunkAPI) => {
  const { fetchFinitemReqId, fetchingFinitems } = thunkAPI.getState().finitem
  if (!fetchingFinitems || thunkAPI.requestId !== fetchFinitemReqId) {
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

const createFinitem = createAsyncThunk('finitem/createFinitem', async (field, thunk) => {
  const { createFinitemReqId, creatingFinitem } = thunk.getState().finitem
  if (!creatingFinitem || thunk.requestId !== createFinitemReqId) {
    return false
  }
  try {
    const res = await api().post(`${ApiUrl}`, field)
    return thunk.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunk.rejectWithValue(err.response.data)
  }
})

const destroyFinitem = createAsyncThunk('finitem/destroyFinitem', async (field, thunk) => {
  const { destFinitemReqId, deletingFinitem } = thunk.getState().finitem
  if (!deletingFinitem || thunk.requestId !== destFinitemReqId) {
    return false
  }
  try {
    const res = await api().delete(`${ApiUrl}/${field}`)
    return thunk.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunk.rejectWithValue(err.response.data)
  }
})

const showFinitemError = createAsyncThunk('finitem/showFinitemError', async (field, thunk) => {
  return thunk.fulfillWithValue(field)
})

const clearFinitemError = createAsyncThunk('finitem/clearFinitemError', async (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

export const finitemSlice = createSlice({
  name: 'finitem',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchFinitems.pending]: (state, action) => {
      if (!state.fetchingFinitems) {
        state.fetchingFinitems = true
        state.fetchFinitemReqId = action.meta.requestId
      }
    },
    [fetchFinitems.fulfilled]: (state, action) => {
      if (state.fetchingFinitems && state.fetchFinitemReqId === action.meta.requestId) {
        state.fetchingFinitems = false
        state.fetchFinitemReqId = undefined
      }
      if (action.payload) {
        state.finitems = action.payload
      }
    },
    [fetchFinitems.rejected]: (state, action) => {
      if (state.fetchingFinitems) {
        state.fetchingFinitems = false
        state.fetchFinitemReqId = action.meta.requestId
      }
    },
    [clearFinitemError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errFinitem') {
        state.finitemErrors = {
          ...state.finitemErrors,
          [action.payload.type]: '',
        }
      }
    },
    [showFinitemError.fulfilled]: (state, action) => {
      if (state.showingFinitemError && state.showFinitemReqId === action.meta.requestId) {
        state.showingFinitemError = false
        state.showFinitemReqId = undefined
      }
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errFinitem':
            state.finitemErrors = {
              ...state.finitemErrors,
              [action.payload.type]: 'This field is required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [createFinitem.pending]: (state, action) => {
      if (!state.creatingFinitem) {
        state.creatingFinitem = true
        state.createFinitemReqId = action.meta.requestId
      }
    },
    [createFinitem.fulfilled]: (state, action) => {
      if (state.creatingFinitem && state.createFinitemReqId === action.meta.requestId) {
        state.creatingFinitem = false
        state.createFinitemReqId = undefined
      }
      if (action.payload) {
        state.finitems = [...state.finitems, action.payload]
      }
    },
    [createFinitem.rejected]: (state, action) => {
      if (state.creatingFinitem) {
        state.creatingFinitem = false
        state.createFinitemReqId = action.meta.requestId
      }
      if (action.payload) {
        if (action.payload.errors) {
          for (const [key, value] of Object.entries(action.payload.errors)) {
            state.finitemErrors = {
              ...state.finitemErrors,
              [key]: value,
            }
          }
        }
      }
    },
    [destroyFinitem.pending]: (state, action) => {
      if (!state.deletingFinitem) {
        state.deletingFinitem = true
        state.destFinitemReqId = action.meta.requestId
      }
    },
    [destroyFinitem.fulfilled]: (state, action) => {
      if (state.deletingFinitem && state.destFinitemReqId === action.meta.requestId) {
        state.deletingFinitem = false
        state.destFinitemReqId = undefined
      }
      if (action.payload) {
        state.finitems = state.finitems.filter((x) => x.id !== action.payload.id)
      }
    },
    [destroyFinitem.rejected]: (state, action) => {
      if (!state.deletingFinitem) {
        state.deletingFinitem = false
        state.destFinitemReqId = action.meta.requestId
      }
    },
  },
})

export { fetchFinitems, createFinitem, destroyFinitem, clearFinitemError, showFinitemError }
export default finitemSlice.reducer
