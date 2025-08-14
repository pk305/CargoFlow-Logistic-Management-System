import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/profit_centers`

const initialState = {
  profitCenters: [],
  profitCenterSubaccounts: [],
  fetchingProfitCenters: false,
  fetchProfitReqId: undefined,
  fetchingProfCentSubAcc: false,
  fetchProfCentSubAccReq: undefined,
  creatingProfitCenter: false,
  createProfitCenterReqId: undefined,
}

const fetchProfitCenters = createAsyncThunk(
  'profitCenters/fetchProfitCenters',
  async (_, thunkAPI) => {
    const { fetchProfitReqId, fetchingProfitCenters } = thunkAPI.getState().profitCenter
    if (!fetchingProfitCenters || thunkAPI.requestId !== fetchProfitReqId) {
      return
    }
    try {
      const res = await api().get(`${ApiUrl}`)
      console.log(res.data)
      return thunkAPI.fulfillWithValue(res.data)
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  },
)

const fetchProfitCenterSubAcc = createAsyncThunk(
  'profitCenter/fetchProfitCenterSubAcc',
  async (field, thunk) => {
    const { fetchProfCentSubAccReq, fetchingProfCentSubAcc } = thunk.getState().profitCenter
    if (!fetchingProfCentSubAcc || thunk.requestId !== fetchProfCentSubAccReq) {
      return false
    }
    try {
      const res = await api().post(`${ApiUrl}/find`, field)
      return thunk.fulfillWithValue(res.data)
    } catch (err) {
      return thunk.rejectWithValue(err.response.data)
    }
  },
)

const createProfitCenter = createAsyncThunk(
  'profitCenter/createProfitCenter',
  async (field, thunk) => {
    const { createProfitCenterReqId, creatingProfitCenter } = thunk.getState().profitCenter
    if (!creatingProfitCenter || thunk.requestId !== createProfitCenterReqId) {
      return false
    }
    try {
      const res = await api().post(`${ApiUrl}`, field)
      return thunk.fulfillWithValue(res.data)
    } catch (err) {
      return thunk.rejectWithValue(err.response.data)
    }
  },
)

export const profitCenterSlice = createSlice({
  name: 'profitCenter',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchProfitCenters.pending]: (state, action) => {
      if (!state.fetchingProfitCenters) {
        state.fetchingProfitCenters = true
        state.fetchProfitReqId = action.meta.requestId
      }
    },
    [fetchProfitCenters.fulfilled]: (state, action) => {
      if (state.fetchingProfitCenters && state.fetchProfitReqId === action.meta.requestId) {
        state.fetchingProfitCenters = false
        state.fetchProfitReqId = undefined
      }
      if (action.payload) {
        state.profitCenters = action.payload
      }
    },
    [fetchProfitCenters.rejected]: (state, action) => {
      if (state.fetchingProfitCenters) {
        state.fetchingProfitCenters = false
        state.fetchProfitReqId = action.meta.requestId
      }
    },
    [fetchProfitCenterSubAcc.pending]: (state, action) => {
      if (!state.fetchingProfCentSubAcc) {
        state.fetchingProfCentSubAcc = true
        state.fetchProfCentSubAccReq = action.meta.requestId
      }
    },
    [fetchProfitCenterSubAcc.fulfilled]: (state, action) => {
      if (state.fetchingProfCentSubAcc && state.fetchProfCentSubAccReq === action.meta.requestId) {
        state.fetchingProfCentSubAcc = false
        state.fetchProfCentSubAccReq = undefined
      }
      if (action.payload) {
        state.profitCenterSubaccounts = action.payload
      }
    },
    [fetchProfitCenterSubAcc.rejected]: (state, action) => {
      if (state.fetchingProfCentSubAcc) {
        state.fetchingProfCentSubAcc = false
        state.fetchProfCentSubAccReq = action.meta.requestId
      }
    },
    [createProfitCenter.pending]: (state, action) => {
      if (!state.creatingProfitCenter) {
        state.creatingProfitCenter = true
        state.createProfitCenterReqId = action.meta.requestId
      }
    },
    [createProfitCenter.fulfilled]: (state, action) => {
      if (state.creatingProfitCenter && state.createProfitCenterReqId === action.meta.requestId) {
        state.creatingProfitCenter = false
        state.createProfitCenterReqId = undefined
      }
      if (action.payload) {
        state.profitCenters = [action.payload, ...state.profitCenters]
      }
    },
    [createProfitCenter.rejected]: (state, action) => {
      if (state.creatingProfitCenter) {
        state.creatingProfitCenter = false
        state.createProfitCenterReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          state.profitCenterAcountErrors = {
            ...state.profitCenterAcountErrors,
            [key]: value,
          }
        }
      }
    },
  },
})

export { fetchProfitCenters, fetchProfitCenterSubAcc }
export default profitCenterSlice.reducer
