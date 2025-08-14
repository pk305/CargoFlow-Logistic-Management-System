import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/accounts`

const initialState = {
  accounts: [],
  updatingAccount: false,
  updateAccReqId: undefined,
  fetchingAccounts: false,
  showAccount: null,
  fetchAccReqId: undefined,
  findingAccount: false,
  findAccReqId: undefined,
  queryAccounts: [],
  queryAccReqId: undefined,
  queryingAcc: false,
  accountErrors: {
    parentId: '',
    parentType2: '',
    workType: '',
    fiscalYear: '',
    status: '',
    ledgerAccountId: '',
    ledgerSubAccountId: '',
    profitCenterId: '',
    profitCenterSubId: '',
    ledgerAccountCode: '',
    profitCenterCode: '',
  },
  createAccReqId: undefined,
  creatingAccount: false,
  destAccReqId: undefined,
  deletingAccount: false,
  showAccReqId: undefined,
  showingAccountErr: false,
}

const fetchAccounts = createAsyncThunk('account/fetchAccounts', async (_, thunkAPI) => {
  const { fetchAccReqId, fetchingAccounts } = thunkAPI.getState().account
  if (!fetchingAccounts || thunkAPI.requestId !== fetchAccReqId) {
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

const createAccount = createAsyncThunk('account/createAccount', async (field, thunk) => {
  const { createAccReqId, creatingAccount } = thunk.getState().account
  if (!creatingAccount || thunk.requestId !== createAccReqId) {
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

const findAccount = createAsyncThunk('account/findAccount', async (Id, thunk) => {
  const { findAccReqId, findingAccount } = thunk.getState().account
  if (!findingAccount || thunk.requestId !== findAccReqId) {
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

const updateAccount = createAsyncThunk('account/updateAccount', async ({ Id, ...field }, thunk) => {
  const { updateAccReqId, updatingAccount } = thunk.getState().account
  if (!updatingAccount || thunk.requestId !== updateAccReqId) {
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
})

const destroyAccount = createAsyncThunk('account/destroyAccount', async (field, thunk) => {
  const { destAccReqId, deletingAccount } = thunk.getState().account
  if (!deletingAccount || thunk.requestId !== destAccReqId) {
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

const searchAccounts = createAsyncThunk('account/searchAccounts', async (field, thunk) => {
  const { queryAccReqId, queryingAcc } = thunk.getState().account
  if (!queryingAcc || thunk.requestId !== queryAccReqId) {
    return false
  }
  try {
    const res = await api().post(`${ApiUrl}/search`, field)
    return thunk.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunk.rejectWithValue(err.response.data)
  }
})

const showAccountError = createAsyncThunk('account/showAccountError', (field, thunk) => {
  return thunk.fulfillWithValue(field)
})

const clearAccountError = createAsyncThunk('account/clearAccountError', async (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchAccounts.pending]: (state, action) => {
      if (!state.fetchingAccounts) {
        state.fetchingAccounts = true
        state.fetchAccReqId = action.meta.requestId
      }
    },
    [fetchAccounts.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.fetchingAccounts && state.fetchAccReqId === requestId) {
        state.fetchingAccounts = false
        state.fetchAccReqId = undefined
      }

      state.accounts = action.payload
    },
    [fetchAccounts.rejected]: (state, action) => {
      if (state.fetchingAccounts) {
        state.fetchingAccounts = false
        state.fetchAccReqId = action.meta.requestId
      }
    },
    [updateAccount.pending]: (state, action) => {
      if (!state.updatingAccount) {
        state.updatingAccount = true
        state.updateAccReqId = action.meta.requestId
      }
    },
    [updateAccount.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.updatingAccount && state.updateAccReqId === requestId) {
        state.updatingAccount = false
        state.updateAccReqId = undefined
      }
      if (action.payload) {
        state.accounts = state.accounts.map((c) => {
          if (c.id === action.payload.id) {
            return Object.assign({}, c, action.payload)
          }
          return c
        })
      }
    },
    [destroyAccount.pending]: (state, action) => {
      if (!state.deletingAccount) {
        state.deletingAccount = true
        state.destAccReqId = action.meta.requestId
      }
    },
    [destroyAccount.fulfilled]: (state, action) => {
      if (state.deletingAccount && state.destAccReqId === action.meta.requestId) {
        state.deletingAccount = false
        state.destAccReqId = undefined
      }
      if (action.payload) {
        state.accounts = state.accounts.filter((cont) => cont.id !== action.payload.id)
      }
    },
    [destroyAccount.rejected]: (state, action) => {
      if (!state.deletingAccount) {
        state.deletingAccount = false
        state.destAccReqId = action.meta.requestId
      }
    },
    [searchAccounts.pending]: (state, action) => {
      if (!state.queryingAcc) {
        state.queryingAcc = true
        state.queryAccReqId = action.meta.requestId
      }
    },
    [searchAccounts.fulfilled]: (state, action) => {
      if (state.queryingAcc && state.queryAccReqId === action.meta.requestId) {
        state.queryingAcc = false
        state.queryAccReqId = undefined
      }
      if (action.payload) {
        state.queryAccounts = action.payload
      }
    },
    [searchAccounts.rejected]: (state, action) => {
      if (!state.queryingAcc) {
        state.queryingAcc = false
        state.queryAccReqId = action.meta.requestId
      }
    },
    [updateAccount.rejected]: (state, action) => {
      if (state.updatingAccount) {
        state.updatingAccount = false
        state.updateAccReqId = action.meta.requestId
      }
    },
    [findAccount.pending]: (state, action) => {
      if (!state.findingAccount) {
        state.findingAccount = true
        state.findAccReqId = action.meta.requestId
      }
    },
    [findAccount.fulfilled]: (state, action) => {
      if (state.findingAccount && state.findAccReqId === action.meta.requestId) {
        state.findingAccount = false
        state.findAccReqId = undefined
      }
      if (action.payload) {
        state.showAccount = action.payload
      }
    },
    [findAccount.rejected]: (state, action) => {
      if (state.findingAccount) {
        state.findingAccount = false
        state.findAccReqId = action.meta.requestId
      }
    },
    [createAccount.pending]: (state, action) => {
      if (!state.creatingAccount) {
        state.creatingAccount = true
        state.createAccReqId = action.meta.requestId
      }
    },
    [createAccount.fulfilled]: (state, action) => {
      if (state.creatingAccount && state.createAccReqId === action.meta.requestId) {
        state.creatingAccount = false
        state.createAccReqId = undefined
      }
      if (action.payload) {
        state.accounts = [...state.accounts, action.payload]
      }
    },
    [createAccount.rejected]: (state, action) => {
      if (state.creatingAccount) {
        state.creatingAccount = false
        state.createAccReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          state.accountErrors = {
            ...state.accountErrors,
            [key]: value,
          }
        }
      }
    },
    [showAccountError.fulfilled]: (state, action) => {
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errAccount':
            state.accountErrors = {
              ...state.accountErrors,
              [action.payload.type]: 'This field is Required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [clearAccountError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errAccount') {
        state.accountErrors = {
          ...state.accountErrors,
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
  updateAccount,
  createAccount,
  findAccount,
  clearAccountError,
  fetchAccounts,
  showAccountError,
  destroyAccount,
  searchAccounts,
}
export default accountSlice.reducer
