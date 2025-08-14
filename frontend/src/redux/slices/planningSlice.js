import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/plannings`

const initialState = {
  plannedLoadings: [],
  plannedPostions: [],
  fetchingPlannedLoadings: false,
  fetchPlanReqId: undefined,
  fetchPlanPosReqId: undefined,
  fetchingPlannedPositions: false,
}

const fetchPlannedLoadings = createAsyncThunk(
  'planning/fetchPlannedLoadings',
  async (field, thunk) => {
    const { fetchPlanReqId, fetchingPlannedLoadings } = thunk.getState().planning
    if (!fetchingPlannedLoadings || thunk.requestId !== fetchPlanReqId) {
      return false
    }
    try {
      const res = await api().post(`${ApiUrl}/loadings`, field)
      return thunk.fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return thunk.rejectWithValue(err.response.data)
    }
  },
)

const fetchPlannedPositions = createAsyncThunk(
  'planning/fetchPlannedPositions',
  async (field, thunk) => {
    const { fetchPlanPosReqId, fetchingPlannedPositions } = thunk.getState().planning
    if (!fetchingPlannedPositions || thunk.requestId !== fetchPlanPosReqId) {
      return false
    }
    try {
      const res = await api().post(`${ApiUrl}/positions`, field)
      return thunk.fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return thunk.rejectWithValue(err.response.data)
    }
  },
)

export const planningSlice = createSlice({
  name: 'planning',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchPlannedLoadings.pending]: (state, action) => {
      if (!state.fetchingPlannedLoadings) {
        state.fetchingPlannedLoadings = true
        state.fetchPlanReqId = action.meta.requestId
      }
    },
    [fetchPlannedLoadings.fulfilled]: (state, action) => {
      if (state.fetchingPlannedLoadings && state.fetchPlanReqId === action.meta.requestId) {
        state.fetchingPlannedLoadings = false
        state.fetchPlanReqId = undefined
      }
      if (action.payload) {
        state.plannedLoadings = action.payload
      }
    },
    [fetchPlannedLoadings.rejected]: (state, action) => {
      if (state.fetchingPlannedLoadings) {
        state.fetchingPlannedLoadings = false
        state.fetchPlanReqId = action.meta.requestId
      }
    },
    [fetchPlannedPositions.pending]: (state, action) => {
      if (!state.fetchingPlannedPositions) {
        state.fetchingPlannedPositions = true
        state.fetchPlanPosReqId = action.meta.requestId
      }
    },
    [fetchPlannedPositions.fulfilled]: (state, action) => {
      if (state.fetchingPlannedPositions && state.fetchPlanPosReqId === action.meta.requestId) {
        state.fetchingPlannedPositions = false
        state.fetchPlanPosReqId = undefined
      }
      if (action.payload) {
        state.plannedPostions = action.payload
      }
    },
    [fetchPlannedPositions.rejected]: (state, action) => {
      if (state.fetchingPlannedPositions) {
        state.fetchingPlannedPositions = false
        state.fetchPlanPosReqId = action.meta.requestId
      }
    },
  },
})

export { fetchPlannedLoadings, fetchPlannedPositions }
export default planningSlice.reducer
