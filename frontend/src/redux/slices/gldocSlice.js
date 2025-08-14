import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/gldocs`

const initialState = {
  gldocs: [],
  updatingGldoc: false,
  updateGldocReqId: undefined,
  fetchingGldocs: false,
  showGldoc: null,
  fetchGldocReqId: undefined,
  findingGldoc: false,
  findGldocReqId: undefined,
  gldocErrors: {
    title: '',
    docDate: '',
    accountType: '',
    operationId: '',
    branchId: '',
    ledgerType: '',
  },
  createGldocReqId: undefined,
  creatingGldoc: false,
  destGldocReqId: undefined,
  deletingGldoc: false,
  showGldocReqId: undefined,
  showingGldocErr: false,
}

const fetchGldocs = createAsyncThunk('gldoc/fetchGldocs', async (_, thunkAPI) => {
  const { fetchGldocReqId, fetchingGldocs } = thunkAPI.getState().gldoc
  if (!fetchingGldocs || thunkAPI.requestId !== fetchGldocReqId) {
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

const createGldoc = createAsyncThunk('gldoc/createGldoc', async (field, thunk) => {
  const { createGldocReqId, creatingGldoc } = thunk.getState().gldoc
  if (!creatingGldoc || thunk.requestId !== createGldocReqId) {
    return false
  }
  try {
    const res = await api().post(`${ApiUrl}`, field)
    // console.log(res.data)
    return thunk.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunk.rejectWithValue(err.response.data)
  }
})

const findGldoc = createAsyncThunk('gldoc/findGldoc', async (Id, thunk) => {
  const { findGldocReqId, findingGldoc } = thunk.getState().gldoc
  if (!findingGldoc || thunk.requestId !== findGldocReqId) {
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

const updateGldoc = createAsyncThunk('gldoc/updateGldoc', async ({ Id, ...field }, thunk) => {
  const { updateGldocReqId, updatingGldoc } = thunk.getState().gldoc
  if (!updatingGldoc || thunk.requestId !== updateGldocReqId) {
    return false
  }
  try {
    const res = await api().put(`${ApiUrl}/${Id}`, field)
    // console.log(res.data)
    return thunk.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunk.rejectWithValue(err.response.data)
  }
})

const destroyGldoc = createAsyncThunk('gldoc/destroyGldoc', async (field, thunk) => {
  const { destGldocReqId, deletingGldoc } = thunk.getState().gldoc
  if (!deletingGldoc || thunk.requestId !== destGldocReqId) {
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

const showGldocError = createAsyncThunk('gldoc/showGldocError', async (field, thunk) => {
  const { showGldocReqId, showingGldocErr } = thunk.getState().gldoc
  if (!showingGldocErr || thunk.requestId !== showGldocReqId) {
    return false
  }

  return thunk.fulfillWithValue(field)
})

const clearGldocError = createAsyncThunk('gldoc/clearGldocError', async (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

export const gldocSlice = createSlice({
  name: 'gldoc',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchGldocs.pending]: (state, action) => {
      if (!state.fetchingGldocs) {
        state.fetchingGldocs = true
        state.fetchGldocReqId = action.meta.requestId
      }
    },
    [fetchGldocs.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.fetchingGldocs && state.fetchGldocReqId === requestId) {
        state.fetchingGldocs = false
        state.fetchGldocReqId = undefined
      }
      if (action.payload) {
        state.gldocs = action.payload
      }
    },
    [fetchGldocs.rejected]: (state, action) => {
      if (!state.fetchingGldocs) {
        state.fetchingGldocs = true
        state.fetchGldocReqId = action.meta.requestId
      }
    },
    [updateGldoc.pending]: (state, action) => {
      if (!state.updatingGldoc) {
        state.updatingGldoc = true
        state.updateGldocReqId = action.meta.requestId
      }
    },
    [updateGldoc.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.updatingGldoc && state.updateGldocReqId === requestId) {
        state.updatingGldoc = false
        state.updateGldocReqId = undefined
      }
      if (action.payload) {
        state.gldocs = state.gldocs.map((c) => {
          if (c.id === action.payload.id) {
            return Object.assign({}, c, action.payload)
          }
          return c
        })
      }
    },
    [updateGldoc.rejected]: (state, action) => {
      if (state.updatingGldoc) {
        state.updatingGldoc = false
        state.updateGldocReqId = action.meta.requestId
      }
    },
    [destroyGldoc.pending]: (state, action) => {
      if (!state.deletingGldoc) {
        state.deletingGldoc = true
        state.destGldocReqId = action.meta.requestId
      }
    },
    [destroyGldoc.fulfilled]: (state, action) => {
      if (state.deletingGldoc && state.destGldocReqId === action.meta.requestId) {
        state.deletingGldoc = false
        state.destGldocReqId = undefined
      }
      if (action.payload) {
        state.gldocs = state.gldocs.filter((x) => x.id !== action.payload.id)
      }
    },
    [destroyGldoc.rejected]: (state, action) => {
      if (!state.deletingGldoc) {
        state.deletingGldoc = false
        state.destGldocReqId = action.meta.requestId
      }
    },

    [findGldoc.pending]: (state, action) => {
      if (!state.findingGldoc) {
        state.findingGldoc = true
        state.findGldocReqId = action.meta.requestId
      }
    },
    [findGldoc.fulfilled]: (state, action) => {
      if (state.findingGldoc && state.findGldocReqId === action.meta.requestId) {
        state.findingGldoc = false
        state.findGldocReqId = undefined
      }
      if (action.payload) {
        state.showGldoc = action.payload
      }
    },
    [findGldoc.rejected]: (state, action) => {
      if (state.findingGldoc) {
        state.findingGldoc = false
        state.findGldocReqId = action.meta.requestId
      }
    },
    [createGldoc.pending]: (state, action) => {
      if (!state.creatingGldoc) {
        state.creatingGldoc = true
        state.createGldocReqId = action.meta.requestId
      }
    },
    [createGldoc.fulfilled]: (state, action) => {
      if (state.creatingGldoc && state.createGldocReqId === action.meta.requestId) {
        state.creatingGldoc = false
        state.createGldocReqId = undefined
      }
      if (action.payload) {
        state.gldocs = [action.payload, ...state.gldocs]
      }
    },
    [createGldoc.rejected]: (state, action) => {
      if (state.creatingGldoc) {
        state.creatingGldoc = false
        state.createGldocReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          state.gldocErrors = {
            ...state.gldocErrors,
            [key]: value,
          }
        }
      }
    },
    [showGldocError.pending]: (state, action) => {
      if (!state.showingGldocErr) {
        state.showingGldocErr = true
        state.showGldocReqId = action.meta.requestId
      }
    },
    [showGldocError.fulfilled]: (state, action) => {
      if (state.showingGldocErr && state.showGldocReqId === action.meta.requestId) {
        state.showingGldocErr = false
        state.showGldocReqId = undefined
      }
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errGldoc':
            state.gldocErrors = {
              ...state.gldocErrors,
              [action.payload.type]: 'This field is Required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [showGldocError.rejected]: (state, action) => {
      if (!state.showingGldocErr) {
        state.showingGldocErr = false
        state.showGldocReqId = action.meta.requestId
      }
    },
    [clearGldocError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errGldoc') {
        state.gldocErrors = {
          ...state.gldocErrors,
          [action.payload.type]: '',
        }
      }
    },
  },
})

export {
  updateGldoc,
  createGldoc,
  findGldoc,
  clearGldocError,
  fetchGldocs,
  showGldocError,
  destroyGldoc,
}
export default gldocSlice.reducer
