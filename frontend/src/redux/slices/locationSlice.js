import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'
import { destroyShowCompany, addShowCompany, updateShowCompany } from './companySlice'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/locations`

const initialState = {
  locations: [],
  fetchingLocations: false,
  fetchLocReqId: undefined,
  createLocReqId: undefined,
  creatingLocation: false,
  locationErrors: {
    placeName: '',
    code: '',
    placeType: '',
    address: '',
    postcode: '',
    cityId: '',
    countryId: '',
    placeLng: '',
    placeLat: '',
    openingInfo: '',
    contactName: '',
    placeTel: '',
    placeEmail: '',
  },
  updatingLocation: false,
  updateLocReqId: undefined,
  deletingLocation: false,
  destLocReqId: undefined,
}

const fetchLocations = createAsyncThunk('location/fetchLocations', async (_, thunkAPI) => {
  const { fetchLocReqId, fetchingLocations } = thunkAPI.getState().location
  if (!fetchingLocations || thunkAPI.requestId !== fetchLocReqId) {
    return
  }
  try {
    const res = await api().get(`${ApiUrl}`)
    console.log(res.data)
    return thunkAPI.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunkAPI.rejectWithValue(err.response.data)
  }
})

const createLocation = createAsyncThunk('location/createLocation', async (field, thunk) => {
  const { createLocReqId, creatingLocation } = thunk.getState().location
  if (!creatingLocation || thunk.requestId !== createLocReqId) {
    return false
  }
  try {
    const res = await api().post(`${ApiUrl}`, field)
    if (res.data) {
      thunk.dispatch(addShowCompany({ type: 'locations', data: res.data }))
    }
    return thunk.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunk.rejectWithValue(err.response.data)
  }
})

const updateLocation = createAsyncThunk(
  'location/updateLocation',
  async ({ Id, ...field }, thunk) => {
    const { updateLocReqId, updatingLocation } = thunk.getState().location
    if (!updatingLocation || thunk.requestId !== updateLocReqId) {
      return false
    }
    try {
      const res = await api().put(`${ApiUrl}/${Id}`, field)
      if (res.data) {
        thunk.dispatch(updateShowCompany({ type: 'locations', data: res.data }))
      }
      return thunk.fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return thunk.rejectWithValue(err.response.data)
    }
  },
)

const destroyLocation = createAsyncThunk('location/destroyLocation', async (field, thunk) => {
  const { destLocReqId, deletingLocation } = thunk.getState().location
  if (!deletingLocation || thunk.requestId !== destLocReqId) {
    return false
  }
  try {
    const res = await api().delete(`${ApiUrl}/${field}`)
    if (res.data) {
      thunk.dispatch(destroyShowCompany({ type: 'locations', id: res.data.id }))
    }
    return thunk.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunk.rejectWithValue(err.response.data)
  }
})

const clearLocationError = createAsyncThunk('location/clearLocationError', async (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

const showLocationError = createAsyncThunk('location/showLocationError', async (field, thunk) => {
  return thunk.fulfillWithValue(field)
})

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchLocations.pending]: (state, action) => {
      if (!state.fetchingLocations) {
        state.fetchingLocations = true
        state.fetchLocReqId = action.meta.requestId
      }
    },
    [fetchLocations.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.fetchingLocations && state.fetchLocReqId === requestId) {
        state.fetchingLocations = false
        state.fetchLocReqId = undefined
      }

      state.locations = action.payload
    },
    [fetchLocations.rejected]: (state, action) => {
      if (!state.fetchingLocations) {
        state.fetchingLocations = true
        state.fetchLocReqId = action.meta.requestId
      }
    },
    [clearLocationError.fulfilled]: (state, action) => {
      state.locationErrors = {
        ...state.locationErrors,
        [action.payload.type]: '',
      }
    },
    [createLocation.pending]: (state, action) => {
      if (!state.creatingLocation) {
        state.creatingLocation = true
        state.createLocReqId = action.meta.requestId
      }
    },
    [createLocation.fulfilled]: (state, action) => {
      if (state.creatingLocation && state.createLocReqId === action.meta.requestId) {
        state.creatingLocation = false
        state.createLocReqId = undefined
      }
      if (action.payload) {
        state.locations = [action.payload, ...state.locations]
      }
    },
    [createLocation.rejected]: (state, action) => {
      if (state.creatingLocation) {
        state.creatingLocation = false
        state.createLocReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          state.locationErrors = {
            ...state.locationErrors,
            [key]: value,
          }
        }
      }
    },
    [showLocationError.fulfilled]: (state, action) => {
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errLocation':
            state.contactErrors = {
              ...state.contactErrors,
              [action.payload.type]: 'This field is Required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [destroyLocation.pending]: (state, action) => {
      if (!state.deletingLocation) {
        state.deletingLocation = true
        state.destLocReqId = action.meta.requestId
      }
    },
    [destroyLocation.fulfilled]: (state, action) => {
      if (state.deletingLocation && state.destLocReqId === action.meta.requestId) {
        state.deletingLocation = false
        state.destLocReqId = undefined
      }
      if (action.payload) {
        state.locations = state.locations.filter((cont) => cont.id !== action.payload.id)
      }
    },
    [destroyLocation.rejected]: (state, action) => {
      if (!state.deletingLocation) {
        state.deletingLocation = false
        state.destLocReqId = action.meta.requestId
      }
    },
    [updateLocation.pending]: (state, action) => {
      if (!state.updatingLocation) {
        state.updatingLocation = true
        state.updateLocReqId = action.meta.requestId
      }
    },
    [updateLocation.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.updatingLocation && state.updateLocReqId === requestId) {
        state.updatingLocation = false
        state.updateLocReqId = undefined
      }
      if (action.payload) {
        state.locations = state.locations.map((c) => {
          if (c.id === action.payload.id) {
            return Object.assign({}, c, action.payload)
          }
          return c
        })
      }
    },
    [updateLocation.rejected]: (state, action) => {
      if (state.updatingLocation) {
        state.updatingLocation = false
        state.updateLocReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          state.locationErrors = {
            ...state.locationErrors,
            [key]: value,
          }
        }
      }
    },
  },
})

export {
  showLocationError,
  fetchLocations,
  updateLocation,
  destroyLocation,
  createLocation,
  clearLocationError,
}
export default locationSlice.reducer
