import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/hscodes`

const initialState = {
  hscodes: [],
  updatingHscodes: false,
  updateHscodeReqId: undefined,
  fetchingHscodes: false,
  showHscode: null,
  fetchHscodeReqId: undefined,
  findingHscode: false,
  findHscodeReqId: undefined,
  hscodeErrors: {},
  createHscodeReqId: undefined,
  creatingHscode: false,
  destHscodeReqId: undefined,
  deletingHscode: false,
}

const fetchHscodes = createAsyncThunk('hscode/fetchHscodes', async (_, thunkAPI) => {
  const { fetchHscodeReqId, fetchingHscodes } = thunkAPI.getState().hscode
  if (!fetchingHscodes || thunkAPI.requestId !== fetchHscodeReqId) {
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

const createHscode = createAsyncThunk('hscode/createHscode', async (field, thunk) => {
  const { createHscodeReqId, creatingHscode } = thunk.getState().hscode
  if (!creatingHscode || thunk.requestId !== createHscodeReqId) {
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

const findHscode = createAsyncThunk('hscode/findHscode', async (Id, thunk) => {
  const { findHscodeReqId, findingHscode } = thunk.getState().hscode
  if (!findingHscode || thunk.requestId !== findHscodeReqId) {
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

const updateHscode = createAsyncThunk('hscode/updateHscode', async ({ Id, ...field }, thunk) => {
  const { updateHscodeReqId, updatingHscodes } = thunk.getState().hscode
  if (!updatingHscodes || thunk.requestId !== updateHscodeReqId) {
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

const destroyHscode = createAsyncThunk('hscode/destroyHscode', async (field, thunk) => {
  const { destHscodeReqId, deletingHscode } = thunk.getState().hscode
  if (!deletingHscode || thunk.requestId !== destHscodeReqId) {
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

const showHscodeError = createAsyncThunk('hscode/showHscodeError', async (field, thunk) => {
  return thunk.fulfillWithValue(field)
})

const clearHscodeError = createAsyncThunk('hscode/clearHscodeError', async (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

export const hscodeSlice = createSlice({
  name: 'hscode',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchHscodes.pending]: (state, action) => {
      if (!state.fetchingHscodes) {
        state.fetchingHscodes = true
        state.fetchHscodeReqId = action.meta.requestId
      }
    },
    [fetchHscodes.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.fetchingHscodes && state.fetchHscodeReqId === requestId) {
        state.fetchingHscodes = false
        state.fetchHscodeReqId = undefined
      }
      if (action.payload) {
        state.hscodes = action.payload
      }
    },
    [fetchHscodes.rejected]: (state, action) => {
      if (!state.fetchingHscodes) {
        state.fetchingHscodes = true
        state.fetchHscodeReqId = action.meta.requestId
      }
    },
    [updateHscode.pending]: (state, action) => {
      if (!state.updatingHscodes) {
        state.updatingHscodes = true
        state.updateHscodeReqId = action.meta.requestId
      }
    },
    [updateHscode.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.updatingHscodes && state.updateHscodeReqId === requestId) {
        state.updatingHscodes = false
        state.updateHscodeReqId = undefined
      }
      if (action.payload) {
        state.hscodes = state.hscodes.map((c) => {
          if (c.id === action.payload.id) {
            return Object.assign({}, c, action.payload)
          }
          return c
        })
      }
    },
    [destroyHscode.pending]: (state, action) => {
      if (!state.deletingHscode) {
        state.deletingHscode = true
        state.destHscodeReqId = action.meta.requestId
      }
    },
    [destroyHscode.fulfilled]: (state, action) => {
      if (state.deletingHscode && state.destHscodeReqId === action.meta.requestId) {
        state.deletingHscode = false
        state.destHscodeReqId = undefined
      }
      if (action.payload) {
        state.hscodes = state.hscodes.filter((cont) => cont.id !== action.payload.id)
      }
    },
    [destroyHscode.rejected]: (state, action) => {
      if (!state.deletingHscode) {
        state.deletingHscode = false
        state.destHscodeReqId = action.meta.requestId
      }
    },
    [updateHscode.rejected]: (state, action) => {
      if (state.updatingHscodes) {
        state.updatingHscodes = false
        state.updateHscodeReqId = action.meta.requestId
      }
    },
    [findHscode.pending]: (state, action) => {
      if (!state.findingHscode) {
        state.findingHscode = true
        state.findHscodeReqId = action.meta.requestId
      }
    },
    [findHscode.fulfilled]: (state, action) => {
      if (state.findingHscode && state.findHscodeReqId === action.meta.requestId) {
        state.findingHscode = false
        state.findHscodeReqId = undefined
      }
      if (action.payload) {
        state.showHscode = action.payload
      }
    },
    [findHscode.rejected]: (state, action) => {
      if (state.findingHscode) {
        state.findingHscode = false
        state.findHscodeReqId = action.meta.requestId
      }
    },
    [createHscode.pending]: (state, action) => {
      if (!state.creatingHscode) {
        state.creatingHscode = true
        state.createHscodeReqId = action.meta.requestId
      }
    },
    [createHscode.fulfilled]: (state, action) => {
      if (state.creatingHscode && state.createHscodeReqId === action.meta.requestId) {
        state.creatingHscode = false
        state.createHscodeReqId = undefined
      }
      if (action.payload) {
        state.hscodes = [action.payload, ...state.hscodes]

        if (action.payload.errorType) {
          switch (action.payload.errorType) {
            case 'errHscode':
              state.hscodeErrors = {
                ...state.hscodeErrors,
                [action.payload.type]: 'This field is required.',
              }
              return
            default:
              return
          }
        } else {
          state.hscodeErrors = {}
        }
      }
    },
    [createHscode.rejected]: (state, action) => {
      if (state.creatingHscode) {
        state.creatingHscode = false
        state.createHscodeReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          state.hscodeErrors = {
            ...state.hscodeErrors,
            [key]: value,
          }
        }
      }
    },
    [showHscodeError.fulfilled]: (state, action) => {
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errHscode':
            state.hscodeErrors = {
              ...state.hscodeErrors,
              [action.payload.type]: 'This field is Required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [clearHscodeError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errHscode') {
        state.hscodeErrors = {
          ...state.hscodeErrors,
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
  updateHscode,
  createHscode,
  findHscode,
  clearHscodeError,
  fetchHscodes,
  showHscodeError,
  destroyHscode,
}
export default hscodeSlice.reducer
