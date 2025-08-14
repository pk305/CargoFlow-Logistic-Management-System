import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/positions`

const initialState = {
  positions: [],
  positionErrors: {
    contractType: '',
    operationId: '',
    branchId: '',
    vesselCode: '',
    truckCode: '',
    driverName: '',
    driverTel: '',
    truckType: '',
    supplierId: '',
    freightPrice: '',
    freightCurr: '',
    vesselId: '',
    depOdemeter: '',
    driverId: '',
    arvOdemeter: '',
    totalFuel: '',
    driverPayment: '',
    extref: '',
    emptyTruck: '',
    status: '',
    waybillType: '',
    waybillDate: '',
    projectId: '',
    departureDate: '',
    depPlaceName: '',
    depCityid: '',
    depCountryId: '',
    arrivalDate: '',
    routeNotes: '',
    routeId: '',
    arvCountryId: '',
    arvPlaceName: '',
    operatorId: '',
    arvCityId: '',
    routeKm: '',
    notes: '',
  },
  creatingPosition: false,
  createPosReqId: undefined,
  fetchPosReqId: undefined,
  fetchingPosition: false,
}

const fetchPositions = createAsyncThunk('position/fetchPositions', async (_, thunk) => {
  const { fetchPosReqId, fetchingPosition } = thunk.getState().position
  if (!fetchingPosition || thunk.requestId !== fetchPosReqId) {
    return false
  }
  try {
    const res = await api().get(`${ApiUrl}`)
    console.log(res.data)
    return thunk.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunk.rejectWithValue(err.response.data)
  }
})

const createPosition = createAsyncThunk('position/createPosition', async (field, thunkAPI) => {
  const { createPosReqId, creatingPosition } = thunkAPI.getState().position
  if (!creatingPosition || thunkAPI.requestId !== createPosReqId) {
    return false
  }
  try {
    const res = await api().post(`${ApiUrl}`, field)
    return thunkAPI.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunkAPI.rejectWithValue(err.response.data)
  }
})

const storeRoadFreight = createAsyncThunk('position/storeRoadFreight', async (field, thunk) => {
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

const showPosError = createAsyncThunk('operation/showPosError', (field, thunk) => {
  const { showPosErrReqId, showingPosError } = thunk.getState().operation
  if (!showingPosError || thunk.requestId !== showPosErrReqId) {
    return false
  }

  return thunk.fulfillWithValue(field)
})

const clearPosError = createAsyncThunk('operation/clearPosError', (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

export const positionSlice = createSlice({
  name: 'position',
  initialState,
  reducers: {},
  extraReducers: {
    [showPosError.pending]: (state, action) => {
      if (!state.showingPosError) {
        state.showingPosError = true
        state.showPosErrReqId = action.meta.requestId
      }
    },
    [showPosError.fulfilled]: (state, action) => {
      if (state.showingPosError && state.showPosErrReqId === action.meta.requestId) {
        state.showingPosError = false
        state.showPosErrReqId = undefined
      }
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errPosition':
            state.positionErrors = {
              ...state.positionErrors,
              [action.payload.type]: 'This field is Required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [showPosError.rejected]: (state, action) => {
      if (!state.showingPosError) {
        state.showingPosError = false
        state.showPosErrReqId = action.meta.requestId
      }
    },
    [createPosition.pending]: (state, action) => {
      if (!state.creatingPosition) {
        state.creatingPosition = true
        state.createPosReqId = action.meta.requestId
      }
    },
    [createPosition.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.creatingPosition && state.createPosReqId === requestId) {
        state.creatingPosition = false
        state.createPosReqId = undefined
      }
      if (action.payload) {
        state.positions = [action.payload, ...state.positions]
      }
    },
    [clearPosError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errPosition') {
        state.positionErrors = {
          ...state.positionErrors,
          [action.payload.type]: '',
        }
      }
    },
    [createPosition.rejected]: (state, action) => {
      if (state.creatingPosition) {
        state.creatingPosition = false
        state.createPosReqId = action.meta.requestId
      }
      if (action.payload) {
        if (action.payload.errors) {
          for (const [key, value] of Object.entries(action.payload.errors)) {
            state.positionErrors = {
              ...state.positionErrors,
              [key]: value,
            }
          }
        }
      }
    },
    [fetchPositions.pending]: (state, action) => {
      if (!state.fetchingPosition) {
        state.fetchingPosition = true
        state.fetchPosReqId = action.meta.requestId
      }
    },
    [fetchPositions.fulfilled]: (state, action) => {
      if (state.fetchingPosition && state.fetchPosReqId === action.meta.requestId) {
        state.fetchingPosition = false
        state.fetchPosReqId = undefined
      }
      if (action.payload) {
        state.positions = action.payload
      }
    },
    [fetchPositions.rejected]: (state, action) => {
      if (state.fetchingPosition) {
        state.fetchingPosition = false
        state.fetchPosReqId = action.meta.requestId
      }
    },
  },
})

export { fetchPositions, clearPosError, showPosError, createPosition, storeRoadFreight }
export default positionSlice.reducer
