import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/findocs`

const initialState = {
  findocs: [],
  creditAccounts: [],
  updatingFindoc: false,
  updateFindocReqId: undefined,
  fetchingFindocs: false,
  showFindoc: null,
  fetchFindocReqId: undefined,
  findingFindoc: false,
  findFinReqId: undefined,
  findocErrors: {
    code: '',
    docDate: ``,
    findocCurr: '',
    accountType: '',
    currRate: '',
    credit: '',
    transferCurrRate: '',
    accountId: '',
    currType: '',
    relatedAccountType: '',
    relatedAccountId: '',
    branchId: '',
    operationId: '',
    profitCenterId: '',
    notes: '',
    findocConfirm: '',
    findocAccounted: '',
    transferCurr: '',
    transferAmount: '',
    findocItemErrors: [],
  },
  createFindocReqId: undefined,
  creatingFindoc: false,
  destFinReqId: undefined,
  deletingFindoc: false,
  showFinReqId: undefined,
  showingFinErr: false,
  searchFinReqId: undefined,
  searchingFindoc: false,
  getFinReqId: undefined,
  gettingFindoc: false,
  changeFinReqId: undefined,
  changingFinStatus: false,
}

const fetchFindocs = createAsyncThunk('findoc/fetchFindocs', async (_, thunkAPI) => {
  const { fetchFindocReqId, fetchingFindocs } = thunkAPI.getState().findoc
  if (!fetchingFindocs || thunkAPI.requestId !== fetchFindocReqId) {
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

const createFindoc = createAsyncThunk('findoc/createFindoc', async (field, thunk) => {
  const { createFindocReqId, creatingFindoc } = thunk.getState().findoc
  if (!creatingFindoc || thunk.requestId !== createFindocReqId) {
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

const findFindoc = createAsyncThunk('findoc/findFindoc', async (Id, thunk) => {
  const { findFinReqId, findingFindoc } = thunk.getState().findoc
  if (!findingFindoc || thunk.requestId !== findFinReqId) {
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

const getFindocs = createAsyncThunk('findoc/getFindocs', async (field, thunk) => {
  const { getFinReqId, gettingFindoc } = thunk.getState().findoc
  if (!gettingFindoc || thunk.requestId !== getFinReqId) {
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

const updateFindoc = createAsyncThunk('findoc/updateFindoc', async ({ Id, ...field }, thunk) => {
  const { updateContReqId, updatingContact } = thunk.getState().findoc
  if (!updatingContact || thunk.requestId !== updateContReqId) {
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

const destroyFindoc = createAsyncThunk('findoc/destroyFindoc', async (field, thunk) => {
  const { destFinReqId, deletingFindoc } = thunk.getState().findoc
  if (!deletingFindoc || thunk.requestId !== destFinReqId) {
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

const searchFindocs = createAsyncThunk('account/searchFindocs', async (field, thunk) => {
  const { searchFinReqId, searchingFindoc } = thunk.getState().findoc
  if (!searchingFindoc || thunk.requestId !== searchFinReqId) {
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

const changeFindocStatus = createAsyncThunk(
  'findoc/changeFindocStatus',
  async (field, thunkAPI) => {
    const { changeFinReqId, changingFinStatus } = thunkAPI.getState().findoc
    if (!changingFinStatus || thunkAPI.requestId !== changeFinReqId) {
      return false
    }
    try {
      const res = await api().post(`${ApiUrl}/change_status`, field)
      return thunkAPI.fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return thunkAPI.rejectWithValue(err.response.data)
    }
  },
)

const clearSearchFindoc = createAsyncThunk('account/clearSearchFindoc', (_, thunk) => {
  return thunk.fulfillWithValue([])
})

const showFindocError = createAsyncThunk('findoc/showFindocError', async (field, thunk) => {
  const { showFinReqId, showingFinErr } = thunk.getState().findoc
  if (!showingFinErr || thunk.requestId !== showFinReqId) {
    return false
  }

  return thunk.fulfillWithValue(field)
})

const clearFindocError = createAsyncThunk('findoc/clearFindocError', async (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

export const findocSlice = createSlice({
  name: 'findoc',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchFindocs.pending]: (state, action) => {
      if (!state.fetchingFindocs) {
        state.fetchingFindocs = true
        state.fetchFindocReqId = action.meta.requestId
      }
    },
    [fetchFindocs.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.fetchingFindocs && state.fetchFindocReqId === requestId) {
        state.fetchingFindocs = false
        state.fetchFindocReqId = undefined
      }
      if (action.payload) {
        state.findocs = action.payload
      }
    },
    [fetchFindocs.rejected]: (state, action) => {
      if (!state.fetchingFindocs) {
        state.fetchingFindocs = true
        state.fetchFindocReqId = action.meta.requestId
      }
    },
    [updateFindoc.pending]: (state, action) => {
      if (!state.updatingContact) {
        state.updatingContact = true
        state.updateContReqId = action.meta.requestId
      }
    },
    [updateFindoc.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.updatingContact && state.updateContReqId === requestId) {
        state.updatingContact = false
        state.updateContReqId = undefined
      }
      if (action.payload) {
        state.findocs = state.findocs.map((c) => {
          if (c.id === action.payload.id) {
            return Object.assign({}, c, action.payload)
          }
          return c
        })
      }
    },
    [destroyFindoc.pending]: (state, action) => {
      if (!state.deletingFindoc) {
        state.deletingFindoc = true
        state.destFinReqId = action.meta.requestId
      }
    },
    [destroyFindoc.fulfilled]: (state, action) => {
      if (state.deletingFindoc && state.destFinReqId === action.meta.requestId) {
        state.deletingFindoc = false
        state.destFinReqId = undefined
      }
      if (action.payload) {
        state.findocs = state.findocs.filter((cont) => cont.id !== action.payload.id)
      }
    },
    [destroyFindoc.rejected]: (state, action) => {
      if (!state.deletingFindoc) {
        state.deletingFindoc = false
        state.destFinReqId = action.meta.requestId
      }
    },
    [updateFindoc.rejected]: (state, action) => {
      if (state.updatingContact) {
        state.updatingContact = false
        state.updateContReqId = action.meta.requestId
      }
    },

    [findFindoc.pending]: (state, action) => {
      if (!state.findingFindoc) {
        state.findingFindoc = true
        state.findFinReqId = action.meta.requestId
      }
    },
    [findFindoc.fulfilled]: (state, action) => {
      if (state.findingFindoc && state.findFinReqId === action.meta.requestId) {
        state.findingFindoc = false
        state.findFinReqId = undefined
      }
      if (action.payload) {
        state.showFindoc = action.payload
      }
    },
    [findFindoc.rejected]: (state, action) => {
      if (state.findingFindoc) {
        state.findingFindoc = false
        state.findFinReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          state.findocErrors = {
            ...state.findocErrors,
            [key]: value,
          }
        }
      }
    },
    [createFindoc.pending]: (state, action) => {
      if (!state.creatingFindoc) {
        state.creatingFindoc = true
        state.createFindocReqId = action.meta.requestId
      }
    },
    [createFindoc.fulfilled]: (state, action) => {
      if (state.creatingFindoc && state.createFindocReqId === action.meta.requestId) {
        state.creatingFindoc = false
        state.createFindocReqId = undefined
      }
      if (action.payload) {
        state.findocs = [action.payload, ...state.findocs]
      }
    },
    [createFindoc.rejected]: (state, action) => {
      if (state.creatingFindoc) {
        state.creatingFindoc = false
        state.createFindocReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          state.findocErrors = {
            ...state.findocErrors,
            [key]: value,
          }
        }
      }
    },
    [clearSearchFindoc.fulfilled]: (state, action) => {
      if (action.payload) {
        state.creditAccounts = action.payload
      }
    },
    [showFindocError.pending]: (state, action) => {
      if (!state.showingFinErr) {
        state.showingFinErr = true
        state.showFinReqId = action.meta.requestId
      }
    },
    [showFindocError.fulfilled]: (state, action) => {
      if (state.showingFinErr && state.showFinReqId === action.meta.requestId) {
        state.showingFinErr = false
        state.showFinReqId = undefined
      }
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errFindoc':
            state.findocErrors = {
              ...state.findocErrors,
              [action.payload.type]: 'This field is Required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [showFindocError.rejected]: (state, action) => {
      if (!state.showingFinErr) {
        state.showingFinErr = false
        state.showFinReqId = action.meta.requestId
      }
    },
    [clearFindocError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errFindoc') {
        state.findocErrors = {
          ...state.findocErrors,
          [action.payload.type]: '',
        }
      } else if (action.payload.errorType === 'calloutErr') {
        if (action.payload.type === 'msgCallout') {
          state.errorCallout = false
          state.errorCalloutText = ''
        }
      }
    },
    [searchFindocs.pending]: (state, action) => {
      if (!state.searchingFindoc) {
        state.searchingFindoc = true
        state.searchFinReqId = action.meta.requestId
      }
    },
    [searchFindocs.fulfilled]: (state, action) => {
      if (state.searchingFindoc && state.searchFinReqId === action.meta.requestId) {
        state.searchingFindoc = false
        state.searchFinReqId = undefined
      }
      if (action.payload) {
        state.creditAccounts = action.payload
      }
    },
    [searchFindocs.rejected]: (state, action) => {
      if (state.searchingFindoc) {
        state.searchingFindoc = false
        state.searchFinReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          state.findocErrors = {
            ...state.findocErrors,
            [key]: value,
          }
        }
      }
    },
    [getFindocs.pending]: (state, action) => {
      if (!state.gettingFindoc) {
        state.gettingFindoc = true
        state.getFinReqId = action.meta.requestId
      }
    },
    [getFindocs.fulfilled]: (state, action) => {
      if (state.gettingFindoc && state.getFinReqId === action.meta.requestId) {
        state.gettingFindoc = false
        state.getFinReqId = undefined
      }
      if (action.payload) {
        state.findocs = action.payload
      }
    },
    [getFindocs.rejected]: (state, action) => {
      if (state.gettingFindoc) {
        state.gettingFindoc = false
        state.getFinReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          state.findocErrors = {
            ...state.findocErrors,
            [key]: value,
          }
        }
      }
    },
    [changeFindocStatus.pending]: (state, action) => {
      if (!state.changingFinStatus) {
        state.changingFinStatus = true
        state.changeFinReqId = action.meta.requestId
      }
    },
    [changeFindocStatus.fulfilled]: (state, action) => {
      if (state.changingFinStatus && state.changeFinReqId === action.meta.requestId) {
        state.changingFinStatus = false
        state.changeFinReqId = undefined
      }

      if (action.payload) {
        if (action.payload.length > 0) {
          state.findocs = state.findocs.map((c) => {
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
    [changeFindocStatus.rejected]: (state, action) => {
      if (state.changingFinStatus) {
        state.changingFinStatus = false
        state.changeFinReqId = action.meta.requestId
      }
    },
  },
})

export {
  updateFindoc,
  createFindoc,
  findFindoc,
  clearFindocError,
  fetchFindocs,
  showFindocError,
  destroyFindoc,
  searchFindocs,
  clearSearchFindoc,
  getFindocs,
  changeFindocStatus,
}
export default findocSlice.reducer
