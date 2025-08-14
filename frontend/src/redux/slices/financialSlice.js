import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/financials`

const initialState = {
  financials: [],
  findFinancial: {},
  fincAccountData: null,
  fetchingFinancials: false,
  findingFinancial: false,
  fetchFinAccReqId: undefined,
  fetchingFinAcc: false,
  financialErrors: {
    financialId: '',
    companyName: '',
    taxNo: '',
    taxOffice: '',
    companyNo: '',
    address: '',
    postcode: '',
    district: '',
    cityName: '',
    countryId: '',
    financialEmail: '',
    companyFinancorId: '',
    paymentNotes: '',
    informationEmail: '',
    creditLimit: '',
    dueDays: '',
    invoiceNotes: '',
    creditLimitControl: '',
    companyCurr: '',
    companyCreditLimitCurr: '',
    financialStatus: '',
    companyRemindPayment: '',
    financialNotes: '',
  },
}

const createFinancial = createAsyncThunk('financial/createFinancial', async (field, thunk) => {
  const { createFinReqId, creatingFinancial } = thunk.getState().financial
  if (!creatingFinancial || thunk.requestId !== createFinReqId) {
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

const findFinancial = createAsyncThunk('financial/findFinancial', async (Id, thunk) => {
  const { findFinReqId, findingFinancial } = thunk.getState().financial
  if (!findingFinancial || thunk.requestId !== findFinReqId) {
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

const showFinancialError = createAsyncThunk(
  'financial/showFinancialError',
  async (field, thunk) => {
    const { showFinReqId, showingError } = thunk.getState().financial
    if (!showingError || thunk.requestId !== showFinReqId) {
      return false
    }

    return thunk.fulfillWithValue(field)
  },
)

const clearFinancialError = createAsyncThunk(
  'financial/clearFinancialError',
  async (err, thunk) => {
    return thunk.fulfillWithValue(err)
  },
)

const fetchFinancialAccount = createAsyncThunk(
  'financial/fetchFinancialAccount',
  async (field, thunkAPI) => {
    const { fetchFinAccReqId, fetchingFinAcc } = thunkAPI.getState().financial
    if (!fetchingFinAcc || thunkAPI.requestId !== fetchFinAccReqId) {
      return false
    }
    try {
      const res = await api().post(`${ApiUrl}/account`, field)
      // console.log(res.data)
      return thunkAPI.fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return thunkAPI.rejectWithValue(err.response.data)
    }
  },
)

export const financialSlice = createSlice({
  name: 'financial',
  initialState,
  reducers: {},
  extraReducers: {
    [clearFinancialError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errFinancial') {
        state.financialErrors = {
          ...state.financialErrors,
          [action.payload.type]: '',
        }
      }
    },
    [fetchFinancialAccount.pending]: (state, action) => {
      if (!state.fetchingFinAcc) {
        state.fetchingFinAcc = true
        state.fetchFinAccReqId = action.meta.requestId
      }
    },
    [fetchFinancialAccount.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.fetchingFinAcc && state.fetchFinAccReqId === requestId) {
        state.fetchingFinAcc = false
        state.fetchFinAccReqId = undefined
      }
      if (action.payload) {
        state.fincAccountData = action.payload
      }
    },
    [fetchFinancialAccount.rejected]: (state, action) => {
      if (state.fetchingFinAcc) {
        state.fetchingFinAcc = false
        state.fetchFinAccReqId = action.meta.requestId
      }
    },
    [showFinancialError.pending]: (state, action) => {
      if (!state.showingError) {
        state.showingError = true
        state.showFinReqId = action.meta.requestId
      }
    },
    [showFinancialError.fulfilled]: (state, action) => {
      if (state.showingError && state.showFinReqId === action.meta.requestId) {
        state.showingError = false
        state.showFinReqId = undefined
      }
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errFinancial':
            state.financialErrors = {
              ...state.financialErrors,
              [action.payload.type]: 'This field is required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [showFinancialError.rejected]: (state, action) => {
      if (state.showingError) {
        state.showingError = false
        state.showFinReqId = action.meta.requestId
      }
    },
    [createFinancial.pending]: (state, action) => {
      if (!state.creatingFinancial) {
        state.creatingFinancial = true
        state.createFinReqId = action.meta.requestId
      }
    },
    [createFinancial.fulfilled]: (state, action) => {
      if (state.creatingFinancial && state.createFinReqId === action.meta.requestId) {
        state.creatingFinancial = false
        state.createFinReqId = undefined
      }
      if (action.payload) {
        state.financials = [action.payload, ...state.financials]
      }
    },
    [createFinancial.rejected]: (state, action) => {
      if (state.creatingFinancial) {
        state.creatingFinancial = false
        state.createFinReqId = action.meta.requestId
      }
      if (action.payload) {
        if (action.payload.errors) {
          for (const [key, value] of Object.entries(action.payload.errors)) {
            state.financialErrors = {
              ...state.financialErrors,
              [key]: value,
            }
          }
          state.errorCalloutText = action.payload.message
          state.errorCallout = true
        }
      }
    },
    [findFinancial.pending]: (state, action) => {
      if (!state.findingFinancial) {
        state.findingFinancial = true
        state.findFinReqId = action.meta.requestId
      }
    },
    [findFinancial.fulfilled]: (state, action) => {
      if (state.findingFinancial && state.findFinReqId === action.meta.requestId) {
        state.findingFinancial = false
        state.findFinReqId = undefined
      }
      if (action.payload) {
        state.findFinancial = action.payload
      }
    },
    [findFinancial.rejected]: (state, action) => {
      if (!state.findingFinancial) {
        state.findingFinancial = true
        state.findFinReqId = action.meta.requestId
      }
    },
  },
})

export {
  findFinancial,
  createFinancial,
  clearFinancialError,
  showFinancialError,
  fetchFinancialAccount,
}
export default financialSlice.reducer
