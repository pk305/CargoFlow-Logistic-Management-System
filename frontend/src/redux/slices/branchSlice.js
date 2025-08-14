import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/branches`

const initialState = {
  branches: [],
  fetchingBranches: false,
  fetchBranchReqId: undefined,
  branchErrors: {},
  showBranReqId: undefined,
  showingBranchError: false,
}

const fetchBranches = createAsyncThunk('branches/fetchBranches', async (_, thunkAPI) => {
  const { fetchBranchReqId, fetchingBranches } = thunkAPI.getState().branch
  if (!fetchingBranches || thunkAPI.requestId !== fetchBranchReqId) {
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

const showBranchError = createAsyncThunk('branch/showBranchError', async (field, thunk) => {
  const { showBranReqId, showingBranchError } = thunk.getState().branch
  if (!showingBranchError || thunk.requestId !== showBranReqId) {
    return false
  }

  return thunk.fulfillWithValue(field)
})

const clearBranchError = createAsyncThunk('branch/clearBranchError', (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

export const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchBranches.pending]: (state, action) => {
      if (!state.fetchingBranches) {
        state.fetchingBranches = true
        state.fetchBranchReqId = action.meta.requestId
      }
    },
    [fetchBranches.fulfilled]: (state, action) => {
      if (state.fetchingBranches && state.fetchBranchReqId === action.meta.requestId) {
        state.fetchingBranches = false
        state.fetchBranchReqId = undefined
      }
      if (action.payload) {
        state.branches = action.payload
      }
    },
    [fetchBranches.rejected]: (state, action) => {
      if (state.fetchingBranches) {
        state.fetchingBranches = false
        state.fetchBranchReqId = action.meta.requestId
      }
    },
    [clearBranchError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errBranch') {
        state.branchErrors = {
          ...state.branchErrors,
          [action.payload.type]: '',
        }
      }
    },
    [showBranchError.pending]: (state, action) => {
      if (!state.showingBranchError) {
        state.showingBranchError = true
        state.showBranReqId = action.meta.requestId
      }
    },
    [showBranchError.fulfilled]: (state, action) => {
      if (state.showingBranchError && state.showBranReqId === action.meta.requestId) {
        state.showingBranchError = false
        state.showBranReqId = undefined
      }
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errBranch':
            state.branchErrors = {
              ...state.branchErrors,
              [action.payload.type]: 'This field is required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [showBranchError.rejected]: (state, action) => {
      if (state.showingBranchError) {
        state.showingBranchError = false
        state.showBranReqId = action.meta.requestId
      }
    },
  },
})

export { fetchBranches, clearBranchError, showBranchError }
export default branchSlice.reducer
