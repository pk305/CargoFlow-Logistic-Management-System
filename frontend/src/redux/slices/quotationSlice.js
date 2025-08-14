import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/leads`

const initialState = {
  quotations: [],
  updatingQuotation: false,
  updateContReqId: undefined,
  fetchingQuotations: false,
  showQuotation: null,
  crntFetchReqId: undefined,
  findingQuotations: false,
  findQuoteReqId: undefined,
  quotationErrors: {
    contactId: '',
    companyId: '',
    leadOperation: '',
    dueDate: '',
    salerId: '',
    branchId: '',
    serviceType: '',
    leadType: '',
    incoterm: '',
    vehicleType: '',
    leadClass: '',
  },
  createQuoteReqId: undefined,
  creatingQuotation: false,
  destQuoteReqId: undefined,
  deletingQuotation: false,
}

const fetchQuotations = createAsyncThunk('quotation/fetchQuotations', async (_, thunkAPI) => {
  const { crntFetchReqId, fetchingQuotations } = thunkAPI.getState().quotation
  if (!fetchingQuotations || thunkAPI.requestId !== crntFetchReqId) {
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

const createQuotation = createAsyncThunk('quotation/createQuotation', async (field, thunk) => {
  const { createQuoteReqId, creatingQuotation } = thunk.getState().quotation
  if (!creatingQuotation || thunk.requestId !== createQuoteReqId) {
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

const findQuotation = createAsyncThunk('quotation/findQuotation', async (Id, thunk) => {
  const { findQuoteReqId, findingQuotations } = thunk.getState().quotation
  if (!findingQuotations || thunk.requestId !== findQuoteReqId) {
    return false
  }
  try {
    const res = await api().get(`${ApiUrl}/${Id}`)
    return thunk.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunk.rejectWithValue(err.response.data)
  }
})

const updateQuotation = createAsyncThunk(
  'quotation/updateQuotation',
  async ({ Id, ...field }, thunk) => {
    const { updateContReqId, updatingQuotation } = thunk.getState().quotation
    if (!updatingQuotation || thunk.requestId !== updateContReqId) {
      return false
    }
    try {
      const res = await api().put(`${ApiUrl}/${Id}`, field)
      return thunk.fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return thunk.rejectWithValue(err.response.data)
    }
  },
)

const updateContactStatus = createAsyncThunk(
  'quotation/updateContactStatus',
  async (field, thunk) => {
    try {
      const res = await api().post(`${ApiUrl}/load_status`, field)
      return thunk.fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return thunk.rejectWithValue(err.response.data)
    }
  },
)

const destroyQuotation = createAsyncThunk('quotation/destroyQuotation', async (field, thunk) => {
  const { destQuoteReqId, deletingQuotation } = thunk.getState().quotation
  if (!deletingQuotation || thunk.requestId !== destQuoteReqId) {
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

const showQuoteError = createAsyncThunk('quotation/showQuoteError', async (field, thunk) => {
  const { showContReqId, showingContactErr } = thunk.getState().quotation
  if (!showingContactErr || thunk.requestId !== showContReqId) {
    return false
  }

  return thunk.fulfillWithValue(field)
})

const clearQuoteError = createAsyncThunk('quotation/clearQuoteError', async (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

export const contactSlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchQuotations.pending]: (state, action) => {
      if (!state.fetchingQuotations) {
        state.fetchingQuotations = true
        state.crntFetchReqId = action.meta.requestId
      }
    },
    [fetchQuotations.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.fetchingQuotations && state.crntFetchReqId === requestId) {
        state.fetchingQuotations = false
        state.crntFetchReqId = undefined
      }

      state.quotations = action.payload
    },
    [fetchQuotations.rejected]: (state, action) => {
      if (!state.fetchingQuotations) {
        state.fetchingQuotations = true
        state.crntFetchReqId = action.meta.requestId
      }
    },
    [updateQuotation.pending]: (state, action) => {
      if (!state.updatingQuotation) {
        state.updatingQuotation = true
        state.updateContReqId = action.meta.requestId
      }
    },
    [updateQuotation.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.updatingQuotation && state.updateContReqId === requestId) {
        state.updatingQuotation = false
        state.updateContReqId = undefined
      }
      if (action.payload) {
        state.quotations = state.quotations.map((c) => {
          if (c.id === action.payload.id) {
            return Object.assign({}, c, action.payload)
          }
          return c
        })
      }
    },
    [destroyQuotation.pending]: (state, action) => {
      if (!state.deletingQuotation) {
        state.deletingQuotation = true
        state.destQuoteReqId = action.meta.requestId
      }
    },
    [destroyQuotation.fulfilled]: (state, action) => {
      if (state.deletingQuotation && state.destQuoteReqId === action.meta.requestId) {
        state.deletingQuotation = false
        state.destQuoteReqId = undefined
      }
      if (action.payload) {
        state.quotations = state.quotations.filter((quote) => quote.id !== action.payload.id)
      }
    },
    [destroyQuotation.rejected]: (state, action) => {
      if (!state.deletingQuotation) {
        state.deletingQuotation = false
        state.destQuoteReqId = action.meta.requestId
      }
    },
    [updateQuotation.rejected]: (state, action) => {
      if (state.updatingQuotation) {
        state.updatingQuotation = false
        state.updateContReqId = action.meta.requestId
      }
    },
    [findQuotation.pending]: (state, action) => {
      if (!state.findingQuotations) {
        state.findingQuotations = true
        state.findQuoteReqId = action.meta.requestId
      }
    },
    [findQuotation.fulfilled]: (state, action) => {
      if (state.findingQuotations && state.findQuoteReqId === action.meta.requestId) {
        state.findingQuotations = false
        state.findQuoteReqId = undefined
      }
      if (action.payload) {
        state.showQuotation = action.payload
      }
    },
    [findQuotation.rejected]: (state, action) => {
      if (state.findingQuotations) {
        state.findingQuotations = false
        state.findQuoteReqId = action.meta.requestId
      }
    },
    [createQuotation.pending]: (state, action) => {
      if (!state.creatingQuotation) {
        state.creatingQuotation = true
        state.createQuoteReqId = action.meta.requestId
      }
    },
    [createQuotation.fulfilled]: (state, action) => {
      if (state.creatingQuotation && state.createQuoteReqId === action.meta.requestId) {
        state.creatingQuotation = false
        state.createQuoteReqId = undefined
      }
      if (action.payload) {
        state.quotations = [action.payload, ...state.quotations]

        if (action.payload.errorType) {
          switch (action.payload.errorType) {
            case 'errQuote':
              state.quotationErrors = {
                ...state.quotationErrors,
                [action.payload.type]: 'This field is required.',
              }
              return
            default:
              return
          }
        } else {
          state.quotationErrors = {
            contactId: '',
            companyId: '',
            leadOperation: '',
            dueDate: '',
            salerId: '',
            branchId: '',
            serviceType: '',
            leadType: '',
            incoterm: '',
            vehicleType: '',
            leadClass: '',
          }
        }
      }
    },
    [createQuotation.rejected]: (state, action) => {
      if (state.creatingQuotation) {
        state.creatingQuotation = false
        state.createQuoteReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          state.quotationErrors = {
            ...state.quotationErrors,
            [key]: value,
          }
        }
      }
    },
    [showQuoteError.pending]: (state, action) => {
      if (!state.showingContactErr) {
        state.showingContactErr = true
        state.showContReqId = action.meta.requestId
      }
    },
    [showQuoteError.fulfilled]: (state, action) => {
      if (state.showingContactErr && state.showContReqId === action.meta.requestId) {
        state.showingContactErr = false
        state.showContReqId = undefined
      }
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errQuote':
            state.quotationErrors = {
              ...state.quotationErrors,
              [action.payload.type]: 'This field is Required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [showQuoteError.rejected]: (state, action) => {
      if (!state.showingContactErr) {
        state.showingContactErr = false
        state.showContReqId = action.meta.requestId
      }
    },
    [clearQuoteError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errQuote') {
        state.quotationErrors = {
          ...state.quotationErrors,
          [action.payload.type]: '',
        }
      } else if (action.payload.errorType === 'calloutErr') {
        if (action.payload.type === 'msgCallout') {
          state.errorCallout = false
          state.errorCalloutText = ''
        }
      }
    },
  },
})

export {
  updateQuotation,
  updateContactStatus,
  createQuotation,
  findQuotation,
  clearQuoteError,
  fetchQuotations,
  showQuoteError,
  destroyQuotation,
}
export default contactSlice.reducer
