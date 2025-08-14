import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/invoices`
const checkInvApi = `/v1/adminapi/orgs/${utxId}/check_invoice_company`
const fetchInvApi = `/v1/adminapi/orgs/${utxId}/fetch_invoices`
const filterApi = `/v1/adminapi/orgs/${utxId}/searches`

const initialState = {
  invoices: [],
  insights: null,
  invoiceErrors: {
    invoiceCompanyId: '',
    invoiceUseAccount: false,
    invoiceName: '',
    dueDate: '',
    invoiceDate: '',
    invoiceCurr: '',
    branchId: '',
    workType: '',
    operationId: '',
    profitCenterId: '',
    invoiceCurrRate: '',
    invoiceAddress: '',
    invoiceItemsErrors: [],
    notes: '',
    accountType: '',
    accountId: '',
    salerId: '',
    placeId: '',
    companyId: null,
    checkInvoiceItems: false,
  },
  showingError: false,
  crntInvcErrId: undefined,
  checkingCompanyInvoice: false,
  checkConfReqId: undefined,
  errorCalloutText: '',
  errorCallout: true,
  creatingInvoice: false,
  createInvReqId: undefined,
  fetchingInvoices: false,
  fetchInvReqId: undefined,
  findInvReqId: undefined,
  findingInvoice: false,
  showInvoice: {},
  confirmInvReqId: undefined,
  confirmingInvoices: false,
  destInvReqId: undefined,
  deletingInvoice: false,
  fetchInvInsightReqId: undefined,
  fetchingInvInsight: false,
  filteringInvoice: false,
  filtInvReqId: undefined,
}

const fetchInvoices = createAsyncThunk('invoice/fetchInvoices', async (field, thunkAPI) => {
  const { fetchInvReqId, fetchingInvoices } = thunkAPI.getState().invoice
  if (!fetchingInvoices || thunkAPI.requestId !== fetchInvReqId) {
    return
  }
  try {
    const res = await api().post(`${fetchInvApi}`, field)
    return thunkAPI.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunkAPI.rejectWithValue(err.response.data)
  }
})

const findInvoice = createAsyncThunk('invoice/findInvoice', async (Id, thunkAPI) => {
  const { findInvReqId, findingInvoice } = thunkAPI.getState().invoice
  if (!findingInvoice || thunkAPI.requestId !== findInvReqId) {
    return false
  }
  try {
    const res = await api().get(`${ApiUrl}/${Id}`)
    return thunkAPI.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunkAPI.rejectWithValue(err.response.data)
  }
})

const createInvoice = createAsyncThunk('invoice/createInvoice', async (field, thunkAPI) => {
  const { createInvReqId, creatingInvoice } = thunkAPI.getState().invoice
  if (!creatingInvoice || thunkAPI.requestId !== createInvReqId) {
    return false
  }
  try {
    const res = await api().post(`${ApiUrl}`, field)
    // console.log(res.data)
    return thunkAPI.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunkAPI.rejectWithValue(err.response.data)
  }
})

const confirmInvoiceStatus = createAsyncThunk(
  'invoice/confirmInvoiceStatus',
  async (field, thunkAPI) => {
    const { confirmInvReqId, confirmingInvoices } = thunkAPI.getState().invoice
    if (!confirmingInvoices || thunkAPI.requestId !== confirmInvReqId) {
      return false
    }
    try {
      const res = await api().post(`${ApiUrl}/confirm_status`, field)
      return thunkAPI.fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return thunkAPI.rejectWithValue(err.response.data)
    }
  },
)

const checkInvoiceCompany = createAsyncThunk(
  'invoice/checkInvoiceCompany',
  async (field, thunkAPI) => {
    const { checkConfReqId, checkingCompanyInvoice } = thunkAPI.getState().invoice
    if (!checkingCompanyInvoice || thunkAPI.requestId !== checkConfReqId) {
      return false
    }
    try {
      const res = await api().post(`${checkInvApi}`, field)
      return thunkAPI.fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return thunkAPI.rejectWithValue(err.response.data)
    }
  },
)

const destroyInvoice = createAsyncThunk('invoice/destroyInvoice', async (field, thunk) => {
  const { destInvReqId, deletingInvoice } = thunk.getState().invoice
  if (!deletingInvoice || thunk.requestId !== destInvReqId) {
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

const fetchInvoiceInsights = createAsyncThunk(
  'invoice/fetchInvoiceInsights',
  async (field, thunkAPI) => {
    const { fetchInvInsightReqId, fetchingInvInsight } = thunkAPI.getState().invoice
    if (!fetchingInvInsight || thunkAPI.requestId !== fetchInvInsightReqId) {
      return
    }
    try {
      const res = await api().post(`${ApiUrl}/insights`, field)
      return thunkAPI.fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return thunkAPI.rejectWithValue(err.response.data)
    }
  },
)

const filterInvoice = createAsyncThunk('invoice/filterInvoice', async (field, thunkAPI) => {
  const { filtInvReqId, filteringInvoice } = thunkAPI.getState().invoice
  if (!filteringInvoice || thunkAPI.requestId !== filtInvReqId) {
    return
  }
  try {
    const res = await api().post(`${filterApi}/tables`, field)
    return thunkAPI.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunkAPI.rejectWithValue(err.response.data)
  }
})

const showInvoiceError = createAsyncThunk('invoice/showInvoiceError', (field, thunkAPI) => {
  const { crntInvcErrId, showingError } = thunkAPI.getState().invoice
  if (!showingError || thunkAPI.requestId !== crntInvcErrId) {
    return false
  }

  return thunkAPI.fulfillWithValue(field)
})

const clearInvoiceError = createAsyncThunk('invoice/clearInvoiceError', (err, thunkAPI) => {
  return thunkAPI.fulfillWithValue(err)
})

export const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {},
  extraReducers: {
    [confirmInvoiceStatus.pending]: (state, action) => {
      if (!state.confirmingInvoices) {
        state.confirmingInvoices = true
        state.confirmInvReqId = action.meta.requestId
      }
    },
    [confirmInvoiceStatus.fulfilled]: (state, action) => {
      if (state.confirmingInvoices && state.confirmInvReqId === action.meta.requestId) {
        state.confirmingInvoices = false
        state.confirmInvReqId = undefined
      }

      if (action.payload) {
        if (action.payload.length > 0) {
          state.invoices = state.invoices.map((c) => {
            for (let i = 0; i < action.payload.length; i++) {
              if (action.payload[i].id === c.id) {
                return Object.assign({}, c, action.payload[i])
              }
            }
            return c
          })
        }
      }
    },
    [confirmInvoiceStatus.rejected]: (state, action) => {
      if (state.confirmingInvoices) {
        state.confirmingInvoices = false
        state.confirmInvReqId = action.meta.requestId
      }
    },
    [destroyInvoice.pending]: (state, action) => {
      if (!state.deletingInvoice) {
        state.deletingInvoice = true
        state.destInvReqId = action.meta.requestId
      }
    },
    [destroyInvoice.fulfilled]: (state, action) => {
      if (state.deletingInvoice && state.destInvReqId === action.meta.requestId) {
        state.deletingInvoice = false
        state.destInvReqId = undefined
      }
      if (action.payload) {
        state.invoices = state.invoices.filter((cont) => cont.id !== action.payload.id)
      }
    },
    [destroyInvoice.rejected]: (state, action) => {
      if (!state.deletingInvoice) {
        state.deletingInvoice = false
        state.destInvReqId = action.meta.requestId
      }
    },
    [fetchInvoices.pending]: (state, action) => {
      if (!state.fetchingInvoices) {
        state.fetchingInvoices = true
        state.fetchInvReqId = action.meta.requestId
      }
    },
    [fetchInvoices.fulfilled]: (state, action) => {
      if (state.fetchingInvoices && state.fetchInvReqId === action.meta.requestId) {
        state.fetchingInvoices = false
        state.fetchInvReqId = undefined
      }
      state.invoices = action.payload
    },
    [fetchInvoices.rejected]: (state, action) => {
      if (state.fetchingInvoices) {
        state.fetchingInvoices = false
        state.fetchInvReqId = action.meta.requestId
      }
    },
    [findInvoice.pending]: (state, action) => {
      if (!state.findingInvoice) {
        state.findingInvoice = true
        state.findInvReqId = action.meta.requestId
      }
    },
    [findInvoice.fulfilled]: (state, action) => {
      if (state.findingInvoice && state.findInvReqId === action.meta.requestId) {
        state.findingInvoice = false
        state.findInvReqId = undefined
      }
      state.showInvoice = action.payload
    },
    [findInvoice.rejected]: (state, action) => {
      if (state.findingInvoice) {
        state.findingInvoice = false
        state.findInvReqId = action.meta.requestId
      }
    },
    [checkInvoiceCompany.pending]: (state, action) => {
      if (!state.checkingCompanyInvoice) {
        state.checkingCompanyInvoice = true
        state.checkConfReqId = action.meta.requestId
      }
    },
    [checkInvoiceCompany.fulfilled]: (state, action) => {
      if (state.checkingCompanyInvoice && state.checkConfReqId === action.meta.requestId) {
        state.checkingCompanyInvoice = false
        state.checkConfReqId = undefined
      }
      state.errorCallout = false
      state.errorCalloutText = ''
    },
    [checkInvoiceCompany.rejected]: (state, action) => {
      if (state.checkingCompanyInvoice) {
        state.checkingCompanyInvoice = false
        state.checkConfReqId = action.meta.requestId
      }
      if (action.payload) {
        if (action.payload.errors) {
          for (const [key, value] of Object.entries(action.payload.errors)) {
            state.invoiceErrors = {
              ...state.invoiceErrors,
              [key]: value,
            }
          }
        }
        if (action.payload.error400) {
          state.errorCalloutText = action.payload.error400
          state.errorCallout = true
        }
      }
    },
    [clearInvoiceError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errInvoice') {
        if (action.payload.type !== 'invoiceItemsErrors') {
          state.invoiceErrors = {
            ...state.invoiceErrors,
            [action.payload.type]: '',
          }
        }
      }
    },
    [showInvoiceError.pending]: (state, action) => {
      if (!state.showingError) {
        state.showingError = true
        state.crntInvcErrId = action.meta.requestId
      }
    },
    [showInvoiceError.fulfilled]: (state, action) => {
      if (state.showingError && state.crntInvcErrId === action.meta.requestId) {
        state.showingError = false
        state.crntInvcErrId = undefined
      }
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errInvoice':
            state.invoiceErrors = {
              ...state.invoiceErrors,
              [action.payload.type]: 'This field is required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [showInvoiceError.rejected]: (state, action) => {
      if (!state.showingError) {
        state.showingError = true
        state.crntInvcErrId = action.meta.requestId
      }
    },
    [filterInvoice.pending]: (state, action) => {
      if (!state.filteringInvoice) {
        state.filteringInvoice = true
        state.filtInvReqId = action.meta.requestId
      }
    },
    [filterInvoice.fulfilled]: (state, action) => {
      if (state.filteringInvoice && state.filtInvReqId === action.meta.requestId) {
        state.filteringInvoice = false
        state.filtInvReqId = undefined
      }
      if (action.payload) {
        const result = action.payload
        if (result.record.form === 'invoice') {
          state.invoices = result.filterd
        }
      }
    },
    [filterInvoice.rejected]: (state, action) => {
      if (state.filteringInvoice) {
        state.filteringInvoice = false
        state.filtInvReqId = action.meta.requestId
      }
    },
    [createInvoice.pending]: (state, action) => {
      if (!state.creatingInvoice) {
        state.creatingInvoice = true
        state.createInvReqId = action.meta.requestId
      }
    },
    [createInvoice.fulfilled]: (state, action) => {
      if (state.creatingInvoice && state.createInvReqId === action.meta.requestId) {
        state.creatingInvoice = false
        state.createInvReqId = undefined
      }

      if (action.payload) {
        state.invoices = [action.payload, ...state.invoices]

        state.errorCalloutText = ''
        state.errorCallout = false
      }
    },
    [createInvoice.rejected]: (state, action) => {
      if (state.creatingInvoice) {
        state.creatingInvoice = false
        state.createInvReqId = action.meta.requestId
      }
      if (action.payload) {
        if (action.payload.errors) {
          for (const [key, value] of Object.entries(action.payload.errors)) {
            state.invoiceErrors = {
              ...state.invoiceErrors,
              [key]: value,
            }
          }
        }

        if (action.payload.error400) {
          if (action.payload.error400.err === 'dueDate') {
            state.errorCalloutText = action.payload.error400
            state.errorCallout = true
          }
          if (action.payload.error400.err === 'invoiceCurrRate') {
            state.invoiceErrors = {
              ...state.invoiceErrors,
              [action.payload.error400.err]: action.payload.error400.msg,
            }
          }
          if (action.payload.error400.err === 'invItemErrors') {
            state.invoiceErrors = {
              ...state.invoiceErrors,
              invoiceItemsErrors: action.payload.error400.msg,
            }
          }
        }
        if (action.payload.errors) {
          state.errorCalloutText = action.payload.message
          state.errorCallout = true
        }
      }
    },
    [fetchInvoiceInsights.pending]: (state, action) => {
      if (!state.fetchingInvInsight) {
        state.fetchingInvInsight = true
        state.fetchInvInsightReqId = action.meta.requestId
      }
    },
    [fetchInvoiceInsights.fulfilled]: (state, action) => {
      if (state.fetchingInvInsight && state.fetchInvInsightReqId === action.meta.requestId) {
        state.fetchingInvInsight = false
        state.fetchInvInsightReqId = undefined
      }
      if (action.payload) {
        state.insights = action.payload
      }
    },
    [fetchInvoiceInsights.rejected]: (state, action) => {
      if (state.fetchingInvInsight) {
        state.fetchingInvInsight = false
        state.fetchInvInsightReqId = action.meta.requestId
      }
    },
  },
})

export {
  fetchInvoices,
  findInvoice,
  destroyInvoice,
  createInvoice,
  checkInvoiceCompany,
  confirmInvoiceStatus,
  showInvoiceError,
  clearInvoiceError,
  filterInvoice,
  fetchInvoiceInsights,
}
export default invoiceSlice.reducer
