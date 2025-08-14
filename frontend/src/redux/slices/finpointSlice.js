import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/finpoints`

const initialState = {
  finpoints: [],
  updatingFinpoint: false,
  updateFinReqId: undefined,
  fetchingFinpoints: false,
  showFinpoint: null,
  fetchFinReqId: undefined,
  findingFinpoint: false,
  findFinReqId: undefined,
  finpointErrors: {
    branchId: '',
    title: '',
    pointType: '',
    curr: '',
    reference: '',
    bank: '',
    useOnInvoice: '',
    accountType: '',
    bankOfficial: '',
    status: '',
    bankDefinitionId: '',
    managerId: '',
  },
  createFinReqId: undefined,
  creatingFinpoint: false,
  destFinReqId: undefined,
  deletingFinpoint: false,
  showFinReqId: undefined,
  showingFinpointErr: false,
}

const fetchFinpoints = createAsyncThunk('finpoint/fetchFinpoints', async (_, thunkAPI) => {
  const { fetchFinReqId, fetchingFinpoints } = thunkAPI.getState().finpoint
  if (!fetchingFinpoints || thunkAPI.requestId !== fetchFinReqId) {
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

const createFinpoint = createAsyncThunk('finpoint/createFinpoint', async (field, thunk) => {
  const { createFinReqId, creatingFinpoint } = thunk.getState().finpoint
  if (!creatingFinpoint || thunk.requestId !== createFinReqId) {
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

const findFinpoint = createAsyncThunk('finpoint/findFinpoint', async (Id, thunk) => {
  const { findFinReqId, findingFinpoint } = thunk.getState().finpoint
  if (!findingFinpoint || thunk.requestId !== findFinReqId) {
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

const updateFinpoint = createAsyncThunk(
  'finpoint/updateFinpoint',
  async ({ Id, ...field }, thunk) => {
    const { updateFinReqId, updatingFinpoint } = thunk.getState().finpoint
    if (!updatingFinpoint || thunk.requestId !== updateFinReqId) {
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

const updateFinpointStatus = createAsyncThunk(
  'finpoint/updateFinpointStatus',
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

const destroyFinpoint = createAsyncThunk('finpoint/destroyFinpoint', async (field, thunk) => {
  const { destFinReqId, deletingFinpoint } = thunk.getState().finpoint
  if (!deletingFinpoint || thunk.requestId !== destFinReqId) {
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

const showFinpointError = createAsyncThunk('finpoint/showFinpointError', async (field, thunk) => {
  return thunk.fulfillWithValue(field)
})

const clearFinpointError = createAsyncThunk('finpoint/clearFinpointError', async (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

export const contactSlice = createSlice({
  name: 'finpoint',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchFinpoints.pending]: (state, action) => {
      if (!state.fetchingFinpoints) {
        state.fetchingFinpoints = true
        state.fetchFinReqId = action.meta.requestId
      }
    },
    [fetchFinpoints.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.fetchingFinpoints && state.fetchFinReqId === requestId) {
        state.fetchingFinpoints = false
        state.fetchFinReqId = undefined
      }

      if (action.payload) {
        state.finpoints = action.payload
      }
    },
    [fetchFinpoints.rejected]: (state, action) => {
      if (!state.fetchingFinpoints) {
        state.fetchingFinpoints = true
        state.fetchFinReqId = action.meta.requestId
      }
    },
    [updateFinpoint.pending]: (state, action) => {
      if (!state.updatingFinpoint) {
        state.updatingFinpoint = true
        state.updateFinReqId = action.meta.requestId
      }
    },
    [updateFinpoint.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.updatingFinpoint && state.updateConFinId === requestId) {
        state.updatingFinpoint = false
        state.updateFinReqId = undefined
      }
      if (action.payload) {
        state.finpoints = state.finpoints.map((c) => {
          if (c.id === action.payload.id) {
            return Object.assign({}, c, action.payload)
          }
          return c
        })
      }
    },
    [destroyFinpoint.pending]: (state, action) => {
      if (!state.deletingFinpoint) {
        state.deletingFinpoint = true
        state.destFinReqId = action.meta.requestId
      }
    },
    [destroyFinpoint.fulfilled]: (state, action) => {
      if (state.deletingFinpoint && state.destFinReqId === action.meta.requestId) {
        state.deletingFinpoint = false
        state.destFinReqId = undefined
      }
      if (action.payload) {
        state.finpoints = state.finpoints.filter((cont) => cont.id !== action.payload.id)
      }
    },
    [destroyFinpoint.rejected]: (state, action) => {
      if (!state.deletingFinpoint) {
        state.deletingFinpoint = false
        state.destFinReqId = action.meta.requestId
      }
    },
    [updateFinpoint.rejected]: (state, action) => {
      if (state.updatingFinpoint) {
        state.updatingFinpoint = false
        state.updateFinReqId = action.meta.requestId
      }
    },
    [findFinpoint.pending]: (state, action) => {
      if (!state.findingFinpoint) {
        state.findingFinpoint = true
        state.findFinReqId = action.meta.requestId
      }
    },
    [findFinpoint.fulfilled]: (state, action) => {
      if (state.findingFinpoint && state.findFinReqId === action.meta.requestId) {
        state.findingFinpoint = false
        state.findFinReqId = undefined
      }
      if (action.payload) {
        state.showFinpoint = action.payload
      }
    },
    [findFinpoint.rejected]: (state, action) => {
      if (state.findingFinpoint) {
        state.findingFinpoint = false
        state.findFinReqId = action.meta.requestId
      }
    },
    [createFinpoint.pending]: (state, action) => {
      if (!state.creatingFinpoint) {
        state.creatingFinpoint = true
        state.createFinReqId = action.meta.requestId
      }
    },
    [createFinpoint.fulfilled]: (state, action) => {
      if (state.creatingFinpoint && state.createFinReqId === action.meta.requestId) {
        state.creatingFinpoint = false
        state.createFinReqId = undefined
      }
      if (action.payload) {
        state.finpoints = [action.payload, ...state.finpoints]
      }
    },
    [createFinpoint.rejected]: (state, action) => {
      if (state.creatingFinpoint) {
        state.creatingFinpoint = false
        state.createFinReqId = action.meta.requestId
      }
      if (action.payload) {
        if (action.payload.errors) {
          for (const [key, value] of Object.entries(action.payload.errors)) {
            state.finpointErrors = {
              ...state.finpointErrors,
              [key]: value,
            }
          }
        }
      }
    },
    [showFinpointError.pending]: (state, action) => {
      if (!state.showingFinpointErr) {
        state.showingFinpointErr = true
        state.showFinReqId = action.meta.requestId
      }
    },
    [showFinpointError.fulfilled]: (state, action) => {
      if (state.showingFinpointErr && state.showConFinId === action.meta.requestId) {
        state.showingFinpointErr = false
        state.showFinReqId = undefined
      }
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errFinpoint':
            state.finpointErrors = {
              ...state.finpointErrors,
              [action.payload.type]: 'This field is Required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [showFinpointError.rejected]: (state, action) => {
      if (!state.showingFinpointErr) {
        state.showingFinpointErr = false
        state.showFinReqId = action.meta.requestId
      }
    },
    [clearFinpointError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errFinpoint') {
        state.finpointErrors = {
          ...state.finpointErrors,
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
  updateFinpoint,
  updateFinpointStatus,
  createFinpoint,
  findFinpoint,
  clearFinpointError,
  fetchFinpoints,
  showFinpointError,
  destroyFinpoint,
}
export default contactSlice.reducer
