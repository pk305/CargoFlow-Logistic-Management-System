import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/drivers`

const initialState = {
  drivers: [],
  updatingDriver: false,
  updateDrivReqId: undefined,
  fetchingDrivers: false,
  showDriver: null,
  fetchDrivReqId: undefined,
  findingDriver: false,
  findDrivReqId: undefined,
  driverErrors: {
    driverName: '',
    refno: '',
    birthDate: '',
    birthPlaceId: '',
    branchId: '',
    phoneOs: '',
    gsm: '',
    tel: '',
    avatar: '',
    address: '',
    workType: '',
    operationId: '',
    cityId: '',
    countryId: '',
    companyId: '',
    passport: '',
  },
  createDrivReqId: undefined,
  creatingDriver: false,
  destDrivReqId: undefined,
  deletingDriver: false,
  showDrivReqId: undefined,
  showingDrivErr: false,
}

const fetchDrivers = createAsyncThunk('driver/fetchDrivers', async (_, thunkAPI) => {
  const { fetchDrivReqId, fetchingDrivers } = thunkAPI.getState().driver
  if (!fetchingDrivers || thunkAPI.requestId !== fetchDrivReqId) {
    return
  }
  try {
    const res = await api().get(`${ApiUrl}`)
    // console.log(res.data)
    return thunkAPI.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunkAPI.rejectWithValue(err.response.data)
  }
})

const createDriver = createAsyncThunk('driver/createDriver', async (field, thunk) => {
  const { createDrivReqId, creatingDriver } = thunk.getState().driver
  if (!creatingDriver || thunk.requestId !== createDrivReqId) {
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

const findDriver = createAsyncThunk('driver/findDriver', async (Id, thunk) => {
  const { findDrivReqId, findingDriver } = thunk.getState().driver
  if (!findingDriver || thunk.requestId !== findDrivReqId) {
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

const updateDriver = createAsyncThunk('driver/updateDriver', async ({ Id, ...field }, thunk) => {
  const { updateDrivReqId, updatingDriver } = thunk.getState().driver
  if (!updatingDriver || thunk.requestId !== updateDrivReqId) {
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

const destroyDriver = createAsyncThunk('driver/destroyDriver', async (field, thunk) => {
  const { destDrivReqId, deletingDriver } = thunk.getState().driver
  if (!deletingDriver || thunk.requestId !== destDrivReqId) {
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

const showDriverError = createAsyncThunk('driver/showDriverError', (field, thunk) => {
  return thunk.fulfillWithValue(field)
})

const clearDriverError = createAsyncThunk('driver/clearDriverError', (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

export const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchDrivers.pending]: (state, action) => {
      if (!state.fetchingDrivers) {
        state.fetchingDrivers = true
        state.fetchDrivReqId = action.meta.requestId
      }
    },
    [fetchDrivers.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.fetchingDrivers && state.fetchDrivReqId === requestId) {
        state.fetchingDrivers = false
        state.fetchDrivReqId = undefined
      }

      state.drivers = action.payload
    },
    [fetchDrivers.rejected]: (state, action) => {
      if (state.fetchingDrivers) {
        state.fetchingDrivers = false
        state.fetchDrivReqId = action.meta.requestId
      }
    },
    [updateDriver.pending]: (state, action) => {
      if (!state.updatingDriver) {
        state.updatingDriver = true
        state.updateDrivReqId = action.meta.requestId
      }
    },
    [updateDriver.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.updatingDriver && state.updateDrivReqId === requestId) {
        state.updatingDriver = false
        state.updateDrivReqId = undefined
      }
      if (action.payload) {
        state.drivers = state.drivers.map((c) => {
          if (c.id === action.payload.id) {
            return Object.assign({}, c, action.payload)
          }
          return c
        })
      }
    },
    [destroyDriver.pending]: (state, action) => {
      if (!state.deletingDriver) {
        state.deletingDriver = true
        state.destDrivReqId = action.meta.requestId
      }
    },
    [destroyDriver.fulfilled]: (state, action) => {
      if (state.deletingDriver && state.destDrivReqId === action.meta.requestId) {
        state.deletingDriver = false
        state.destDrivReqId = undefined
      }
      if (action.payload) {
        state.drivers = state.drivers.filter((cont) => cont.id !== action.payload.id)
      }
    },
    [destroyDriver.rejected]: (state, action) => {
      if (!state.deletingDriver) {
        state.deletingDriver = false
        state.destDrivReqId = action.meta.requestId
      }
    },
    [updateDriver.rejected]: (state, action) => {
      if (state.updatingDriver) {
        state.updatingDriver = false
        state.updateDrivReqId = action.meta.requestId
      }
    },
    [findDriver.pending]: (state, action) => {
      if (!state.findingDriver) {
        state.findingDriver = true
        state.findDrivReqId = action.meta.requestId
      }
    },
    [findDriver.fulfilled]: (state, action) => {
      if (state.findingDriver && state.findDrivReqId === action.meta.requestId) {
        state.findingDriver = false
        state.findDrivReqId = undefined
      }
      if (action.payload) {
        state.showDriver = action.payload
      }
    },
    [findDriver.rejected]: (state, action) => {
      if (state.findingDriver) {
        state.findingDriver = false
        state.findDrivReqId = action.meta.requestId
      }
    },
    [createDriver.pending]: (state, action) => {
      if (!state.creatingDriver) {
        state.creatingDriver = true
        state.createDrivReqId = action.meta.requestId
      }
    },
    [createDriver.fulfilled]: (state, action) => {
      if (state.creatingDriver && state.createDrivReqId === action.meta.requestId) {
        state.creatingDriver = false
        state.createDrivReqId = undefined
      }
      if (action.payload) {
        state.drivers = [action.payload, ...state.drivers]
      }
    },
    [createDriver.rejected]: (state, action) => {
      if (state.creatingDriver) {
        state.creatingDriver = false
        state.createDrivReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          state.driverErrors = {
            ...state.driverErrors,
            [key]: value,
          }
        }
      }
    },
    [showDriverError.pending]: (state, action) => {
      if (!state.showingDrivErr) {
        state.showingDrivErr = true
        state.showDrivReqId = action.meta.requestId
      }
    },
    [showDriverError.fulfilled]: (state, action) => {
      if (state.showingDrivErr && state.showDrivReqId === action.meta.requestId) {
        state.showingDrivErr = false
        state.showDrivReqId = undefined
      }
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errDriver':
            state.driverErrors = {
              ...state.driverErrors,
              [action.payload.type]: 'This field is Required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [showDriverError.rejected]: (state, action) => {
      if (!state.showingDrivErr) {
        state.showingDrivErr = false
        state.showDrivReqId = action.meta.requestId
      }
    },
    [clearDriverError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errDriver') {
        state.driverErrors = {
          ...state.driverErrors,
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
  updateDriver,
  createDriver,
  findDriver,
  clearDriverError,
  fetchDrivers,
  showDriverError,
  destroyDriver,
}
export default driverSlice.reducer
