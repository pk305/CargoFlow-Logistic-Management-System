import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/ledgers`

const initialState = {
  ledgers: [],
  ledgerSubaccounts: [],
  fetchingLedgers: false,
  fetchLedgerReqId: undefined,
  ledgerAcountErrors: {
    code: '',
    ledgerName: '',
    ledgerable: '',
    englishName: '',
    partnerAccountCode: '',
    isPartner: '',
    curr: '',
    accountType: '',
    status: '',
    mappingType: '',
    notes: '',
  },
  showLedgerAccReqId: undefined,
  showingLedgerAccErr: false,
  createLedgerReqId: undefined,
  creatingLedger: false,
  sendAccLedgerErrors: {},
  fetchingLedgerSubAcc: false,
  fetchLegderSubAccReq: undefined,
}

const fetchLedgers = createAsyncThunk('ledgers/fetchLedgers', async (_, thunkAPI) => {
  const { fetchLedgerReqId, fetchingLedgers } = thunkAPI.getState().ledger
  if (!fetchingLedgers || thunkAPI.requestId !== fetchLedgerReqId) {
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

const createLedger = createAsyncThunk('ledger/createLedger', async (field, thunk) => {
  const { createLedgerReqId, creatingLedger } = thunk.getState().ledger
  if (!creatingLedger || thunk.requestId !== createLedgerReqId) {
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

const fetchLedgerSubAcc = createAsyncThunk('ledger/fetchLedgerSubAcc', async (field, thunk) => {
  const { fetchLegderSubAccReq, fetchingLedgerSubAcc } = thunk.getState().ledger
  if (!fetchingLedgerSubAcc || thunk.requestId !== fetchLegderSubAccReq) {
    return false
  }
  try {
    const res = await api().post(`${ApiUrl}/find`, field)
    return thunk.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunk.rejectWithValue(err.response.data)
  }
})

const showLedgerAccountError = createAsyncThunk(
  'ledger/showLedgerAccountError',
  async (field, thunk) => {
    const { showLedgerAccReqId, showingLedgerAccErr } = thunk.getState().ledger
    if (!showingLedgerAccErr || thunk.requestId !== showLedgerAccReqId) {
      return false
    }

    return thunk.fulfillWithValue(field)
  },
)

const clearLedgerAccError = createAsyncThunk('ledger/clearLedgerAccError', async (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

export const ledgerAccountSlice = createSlice({
  name: 'ledger',
  initialState,
  reducers: {},
  extraReducers: {
    [createLedger.pending]: (state, action) => {
      if (!state.creatingLedger) {
        state.creatingLedger = true
        state.createLedgerReqId = action.meta.requestId
      }
    },
    [createLedger.fulfilled]: (state, action) => {
      if (state.creatingLedger && state.createLedgerReqId === action.meta.requestId) {
        state.creatingLedger = false
        state.createLedgerReqId = undefined
      }
      if (action.payload) {
        state.ledgers = [action.payload, ...state.ledgers]

        if (action.payload.errorType) {
          switch (action.payload.errorType) {
            case 'errLedger':
              state.ledgerAcountErrors = {
                ...state.ledgerAcountErrors,
                [action.payload.type]: 'This field is required.',
              }
              return
            default:
              return
          }
        } else {
          state.ledgerAcountErrors = {
            code: '',
            ledgerName: '',
            ledgerable: '',
            englishName: '',
            partnerAccountCode: '',
            isPartner: '',
            curr: '',
            accountType: '',
            status: '',
            mappingType: '',
            notes: '',
          }
        }
      }
    },
    [createLedger.rejected]: (state, action) => {
      if (state.creatingLedger) {
        state.creatingLedger = false
        state.createLedgerReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          state.ledgerAcountErrors = {
            ...state.ledgerAcountErrors,
            [key]: value,
          }
        }
      }
    },
    [fetchLedgers.pending]: (state, action) => {
      if (!state.fetchingLedgers) {
        state.fetchingLedgers = true
        state.fetchLedgerReqId = action.meta.requestId
      }
    },
    [fetchLedgers.fulfilled]: (state, action) => {
      if (state.fetchingLedgers && state.fetchLedgerReqId === action.meta.requestId) {
        state.fetchingLedgers = false
        state.fetchLedgerReqId = undefined
      }
      if (action.payload) {
        state.ledgers = action.payload
      }
    },
    [fetchLedgers.rejected]: (state, action) => {
      if (state.fetchingLedgers) {
        state.fetchingLedgers = false
        state.fetchLedgerReqId = action.meta.requestId
      }
    },
    [showLedgerAccountError.pending]: (state, action) => {
      if (!state.showingLedgerAccErr) {
        state.showingLedgerAccErr = true
        state.showLedgerAccReqId = action.meta.requestId
      }
    },
    [showLedgerAccountError.fulfilled]: (state, action) => {
      if (state.showingLedgerAccErr && state.showLedgerAccReqId === action.meta.requestId) {
        state.showingLedgerAccErr = false
        state.showLedgerAccReqId = undefined
      }
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errLedger':
            state.ledgerAcountErrors = {
              ...state.ledgerAcountErrors,
              [action.payload.type]: 'This field is Required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [showLedgerAccountError.rejected]: (state, action) => {
      if (!state.showingLedgerAccErr) {
        state.showingLedgerAccErr = false
        state.showLedgerAccReqId = action.meta.requestId
      }
    },
    [clearLedgerAccError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errLedger') {
        state.ledgerAcountErrors = {
          ...state.ledgerAcountErrors,
          [action.payload.type]: '',
        }
      } else if (action.payload.errorType === 'calloutErr') {
        if (action.payload.type === 'msgCallout') {
          state.errorCallout = false
          state.errorCalloutText = ''
        }
      }
    },
    [fetchLedgerSubAcc.pending]: (state, action) => {
      if (!state.fetchingLedgerSubAcc) {
        state.fetchingLedgerSubAcc = true
        state.fetchLegderSubAccReq = action.meta.requestId
      }
    },
    [fetchLedgerSubAcc.fulfilled]: (state, action) => {
      if (state.fetchingLedgerSubAcc && state.fetchLegderSubAccReq === action.meta.requestId) {
        state.fetchingLedgerSubAcc = false
        state.fetchLegderSubAccReq = undefined
      }
      if (action.payload) {
        state.ledgerSubaccounts = action.payload
      }
    },
    [fetchLedgerSubAcc.rejected]: (state, action) => {
      if (state.fetchingLedgerSubAcc) {
        state.fetchingLedgerSubAcc = false
        state.fetchLegderSubAccReq = action.meta.requestId
      }
    },
  },
})

export {
  fetchLedgers,
  fetchLedgerSubAcc,
  showLedgerAccountError,
  createLedger,
  clearLedgerAccError,
}
export default ledgerAccountSlice.reducer
