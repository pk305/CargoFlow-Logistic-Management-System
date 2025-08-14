import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/vehicles`

const initialState = {
  vehicles: [],
  updatingVehicle: false,
  updateVehicReqId: undefined,
  fetchingVehicles: false,
  showVehicle: null,
  fetchVehiReqId: undefined,
  findingVehicle: false,
  findVehiReqId: undefined,
  vehicleErrors: {
    code: '',
    brand: '',
    vehicleClass: '',
    modelYear: '',
    vehicleType: '',
    covehicleId: '',
    vehicleName: '',
  },
  createVehiReqId: undefined,
  creatingVehicle: false,
  destVehiReqId: undefined,
  deletingVehicle: false,
  showVehiReqId: undefined,
  showingVehicleErr: false,
}

const fetchVehicles = createAsyncThunk('vehicle/fetchVehicles', async (_, thunkAPI) => {
  const { fetchVehiReqId, fetchingVehicles } = thunkAPI.getState().vehicle
  if (!fetchingVehicles || thunkAPI.requestId !== fetchVehiReqId) {
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

const createVehicle = createAsyncThunk('vehicle/createVehicle', async (field, thunk) => {
  const { createVehiReqId, creatingVehicle } = thunk.getState().vehicle
  if (!creatingVehicle || thunk.requestId !== createVehiReqId) {
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

const findVehicle = createAsyncThunk('vehicle/findVehicle', async (Id, thunk) => {
  const { findVehiReqId, findingVehicle } = thunk.getState().vehicle
  if (!findingVehicle || thunk.requestId !== findVehiReqId) {
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

const updateVehicle = createAsyncThunk('vehicle/updateVehicle', async ({ Id, ...field }, thunk) => {
  const { updateVehicReqId, updatingVehicle } = thunk.getState().vehicle
  if (!updatingVehicle || thunk.requestId !== updateVehicReqId) {
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

const destroyVehicle = createAsyncThunk('vehicle/destroyVehicle', async (field, thunk) => {
  const { destVehiReqId, deletingVehicle } = thunk.getState().vehicle
  if (!deletingVehicle || thunk.requestId !== destVehiReqId) {
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

const showVehicleError = createAsyncThunk('vehicle/showVehicleError', async (field, thunk) => {
  return thunk.fulfillWithValue(field)
})

const clearVehicleError = createAsyncThunk('vehicle/clearVehicleError', async (field, thunk) => {
  return thunk.fulfillWithValue(field)
})

export const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchVehicles.pending]: (state, action) => {
      if (!state.fetchingVehicles) {
        state.fetchingVehicles = true
        state.fetchVehiReqId = action.meta.requestId
      }
    },
    [fetchVehicles.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.fetchingVehicles && state.fetchVehiReqId === requestId) {
        state.fetchingVehicles = false
        state.fetchVehiReqId = undefined
      }

      state.vehicles = action.payload
    },
    [fetchVehicles.rejected]: (state, action) => {
      if (!state.fetchingVehicles) {
        state.fetchingVehicles = true
        state.fetchVehiReqId = action.meta.requestId
      }
    },
    [updateVehicle.pending]: (state, action) => {
      if (!state.updatingVehicle) {
        state.updatingVehicle = true
        state.updateVehicReqId = action.meta.requestId
      }
    },
    [updateVehicle.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.updatingVehicle && state.updateVehicReqId === requestId) {
        state.updatingVehicle = false
        state.updateVehicReqId = undefined
      }
      if (action.payload) {
        state.vehicles = state.vehicles.map((c) => {
          if (c.id === action.payload.id) {
            return Object.assign({}, c, action.payload)
          }
          return c
        })
      }
    },
    [destroyVehicle.pending]: (state, action) => {
      if (!state.deletingVehicle) {
        state.deletingVehicle = true
        state.destVehiReqId = action.meta.requestId
      }
    },
    [destroyVehicle.fulfilled]: (state, action) => {
      if (state.deletingVehicle && state.destVehiReqId === action.meta.requestId) {
        state.deletingVehicle = false
        state.destVehiReqId = undefined
      }
      if (action.payload) {
        state.vehicles = state.vehicles.filter((cont) => cont.id !== action.payload.id)
      }
    },
    [destroyVehicle.rejected]: (state, action) => {
      if (!state.deletingVehicle) {
        state.deletingVehicle = false
        state.destVehiReqId = action.meta.requestId
      }
    },
    [updateVehicle.rejected]: (state, action) => {
      if (state.updatingVehicle) {
        state.updatingVehicle = false
        state.updateVehicReqId = action.meta.requestId
      }
    },
    [findVehicle.pending]: (state, action) => {
      if (!state.findingVehicle) {
        state.findingVehicle = true
        state.findVehiReqId = action.meta.requestId
      }
    },
    [findVehicle.fulfilled]: (state, action) => {
      if (state.findingVehicle && state.findVehiReqId === action.meta.requestId) {
        state.findingVehicle = false
        state.findVehiReqId = undefined
      }
      if (action.payload) {
        state.showVehicle = action.payload
      }
    },
    [findVehicle.rejected]: (state, action) => {
      if (state.findingVehicle) {
        state.findingVehicle = false
        state.findVehiReqId = action.meta.requestId
      }
    },
    [createVehicle.pending]: (state, action) => {
      if (!state.creatingVehicle) {
        state.creatingVehicle = true
        state.createVehiReqId = action.meta.requestId
      }
    },
    [createVehicle.fulfilled]: (state, action) => {
      if (state.creatingVehicle && state.createVehiReqId === action.meta.requestId) {
        state.creatingVehicle = false
        state.createVehiReqId = undefined
      }
      if (action.payload) {
        state.vehicles = [action.payload, ...state.vehicles]
      }
    },
    [createVehicle.rejected]: (state, action) => {
      if (state.creatingVehicle) {
        state.creatingVehicle = false
        state.createVehiReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          state.vehicleErrors = {
            ...state.vehicleErrors,
            [key]: value,
          }
        }
      }
    },
    [showVehicleError.pending]: (state, action) => {
      if (!state.showingVehicleErr) {
        state.showingVehicleErr = true
        state.showVehiReqId = action.meta.requestId
      }
    },
    [showVehicleError.fulfilled]: (state, action) => {
      if (state.showingVehicleErr && state.showVehiReqId === action.meta.requestId) {
        state.showingVehicleErr = false
        state.showVehiReqId = undefined
      }
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errVehicle':
            state.vehicleErrors = {
              ...state.vehicleErrors,
              [action.payload.type]: 'This field is Required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [showVehicleError.rejected]: (state, action) => {
      if (!state.showingVehicleErr) {
        state.showingVehicleErr = false
        state.showVehiReqId = action.meta.requestId
      }
    },
    [clearVehicleError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errVehicle') {
        state.vehicleErrors = {
          ...state.vehicleErrors,
          [action.payload.type]: '',
        }
      }
    },
  },
})

export {
  updateVehicle,
  createVehicle,
  findVehicle,
  clearVehicleError,
  fetchVehicles,
  showVehicleError,
  destroyVehicle,
}
export default vehicleSlice.reducer
