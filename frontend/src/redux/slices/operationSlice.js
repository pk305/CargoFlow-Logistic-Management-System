import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/operations`

const initialState = {
  operations: [],
  fetchingOperations: false,
  fetchOpReqId: undefined,
  operationErrors: {
    vesselCode: '',
  },
  showOppErrReqId: undefined,
  showingOppError: false,
}

const fetchOperations = createAsyncThunk('operation/fetchOperations', async (_, thunk) => {
  const { fetchOpReqId, fetchingOperations } = thunk.getState().operation
  if (!fetchingOperations || thunk.requestId !== fetchOpReqId) {
    return false
  }
  try {
    const res = await api().get(`${ApiUrl}`)
    return thunk.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunk.rejectWithValue(err.response.data)
  }
})

const showOperationError = createAsyncThunk(
  'operation/showOperationError',
  async (field, thunk) => {
    const { showOppErrReqId, showingOppError } = thunk.getState().operation
    if (!showingOppError || thunk.requestId !== showOppErrReqId) {
      return false
    }
    return thunk.fulfillWithValue(field)
  },
)

const clearVehicleError = createAsyncThunk('operation/clearVehicleError', async (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

export const operationSlice = createSlice({
  name: 'operation',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchOperations.pending]: (state, action) => {
      if (!state.fetchingOperations) {
        state.fetchingOperations = true
        state.fetchOpReqId = action.meta.requestId
      }
    },
    [fetchOperations.fulfilled]: (state, action) => {
      if (state.fetchingOperations && state.fetchOpReqId === action.meta.requestId) {
        state.fetchingOperations = false
        state.fetchOpReqId = undefined
      }
      state.operations = action.payload
    },
    [fetchOperations.rejected]: (state, action) => {
      if (state.fetchingOperations) {
        state.fetchingOperations = false
        state.fetchOpReqId = action.meta.requestId
      }
    },

    [showOperationError.pending]: (state, action) => {
      if (!state.showingOppError) {
        state.showingOppError = true
        state.showOppErrReqId = action.meta.requestId
      }
    },
    [showOperationError.fulfilled]: (state, action) => {
      if (state.showingOppError && state.showOppErrReqId === action.meta.requestId) {
        state.showingOppError = false
        state.showOppErrReqId = undefined
      }
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errVehicle':
            state.operationErrors = {
              ...state.operationErrors,
              [action.payload.type]: 'This field is Required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [showOperationError.rejected]: (state, action) => {
      if (!state.showingOppError) {
        state.showingOppError = false
        state.showOppErrReqId = action.meta.requestId
      }
    },
    [clearVehicleError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errVehicle') {
        state.operationErrors = {
          ...state.operationErrors,
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

export { fetchOperations, showOperationError, clearVehicleError }
export default operationSlice.reducer
