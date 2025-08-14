import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/cities`

const initialState = {
  cities: [],
  updatingCity: false,
  updateCityReqId: undefined,
  fetchingCities: false,
  creatingCity: false,
  showCity: null,
  fetchCityReqId: undefined,
  findingCity: false,
  findCityReqId: undefined,
  cityErrors: {
    cityName: '',
    code: '',
    countryId: '',
    telCode: '',
    statesCode: '',
  },
  createCityReqId: undefined,
  destCityReqId: undefined,
  deletingCity: false,
  showCityReqId: undefined,
  showingContactErr: false,
}

const fetchCities = createAsyncThunk('city/fetchCities', async (_, thunkAPI) => {
  const { fetchCityReqId, fetchingCities } = thunkAPI.getState().city
  if (!fetchingCities || thunkAPI.requestId !== fetchCityReqId) {
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

const createCity = createAsyncThunk('city/createCity', async (field, thunk) => {
  const { createCityReqId, creatingCity } = thunk.getState().city
  if (!creatingCity || thunk.requestId !== createCityReqId) {
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

const findCity = createAsyncThunk('city/findCity', async (Id, thunk) => {
  const { findCityReqId, findingCity } = thunk.getState().city
  if (!findingCity || thunk.requestId !== findCityReqId) {
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

const updateCity = createAsyncThunk('city/updateCity', async ({ Id, ...field }, thunk) => {
  const { updateCityReqId, updatingCity } = thunk.getState().city
  if (!updatingCity || thunk.requestId !== updateCityReqId) {
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

const destroyContact = createAsyncThunk('city/destroyContact', async (field, thunk) => {
  const { destCityReqId, deletingCity } = thunk.getState().city
  if (!deletingCity || thunk.requestId !== destCityReqId) {
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

const showCityError = createAsyncThunk('city/showCityError', async (field, thunk) => {
  const { showCityReqId, showingContactErr } = thunk.getState().city
  if (!showingContactErr || thunk.requestId !== showCityReqId) {
    return false
  }
  return thunk.fulfillWithValue(field)
})

const clearCityError = createAsyncThunk('city/clearCityError', async (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

export const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchCities.pending]: (state, action) => {
      if (!state.fetchingCities) {
        state.fetchingCities = true
        state.fetchCityReqId = action.meta.requestId
      }
    },
    [fetchCities.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.fetchingCities && state.fetchCityReqId === requestId) {
        state.fetchingCities = false
        state.fetchCityReqId = undefined
      }
      if (action.payload) {
        state.cities = action.payload
      }
    },
    [fetchCities.rejected]: (state, action) => {
      if (!state.fetchingCities) {
        state.fetchingCities = true
        state.fetchCityReqId = action.meta.requestId
      }
    },
    [updateCity.pending]: (state, action) => {
      if (!state.updatingCity) {
        state.updatingCity = true
        state.updateCityReqId = action.meta.requestId
      }
    },
    [updateCity.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.updatingCity && state.updateCityReqId === requestId) {
        state.updatingCity = false
        state.updateCityReqId = undefined
      }
      if (action.payload) {
        state.cities = state.cities.map((c) => {
          if (c.id === action.payload.id) {
            return Object.assign({}, c, action.payload)
          }
          return c
        })
      }
    },
    [destroyContact.pending]: (state, action) => {
      if (!state.deletingCity) {
        state.deletingCity = true
        state.destCityReqId = action.meta.requestId
      }
    },
    [destroyContact.fulfilled]: (state, action) => {
      if (state.deletingCity && state.destCityReqId === action.meta.requestId) {
        state.deletingCity = false
        state.destCityReqId = undefined
      }
      if (action.payload) {
        state.cities = state.cities.filter((cont) => cont.id !== action.payload.id)
      }
    },
    [destroyContact.rejected]: (state, action) => {
      if (!state.deletingCity) {
        state.deletingCity = false
        state.destCityReqId = action.meta.requestId
      }
    },
    [updateCity.rejected]: (state, action) => {
      if (state.updatingCity) {
        state.updatingCity = false
        state.updateCityReqId = action.meta.requestId
      }
    },
    [findCity.pending]: (state, action) => {
      if (!state.findingCity) {
        state.findingCity = true
        state.findCityReqId = action.meta.requestId
      }
    },
    [findCity.fulfilled]: (state, action) => {
      if (state.findingCity && state.findCityReqId === action.meta.requestId) {
        state.findingCity = false
        state.findCityReqId = undefined
      }
      if (action.payload) {
        state.showCity = action.payload
      }
    },
    [findCity.rejected]: (state, action) => {
      if (state.findingCity) {
        state.findingCity = false
        state.findCityReqId = action.meta.requestId
      }
    },
    [createCity.pending]: (state, action) => {
      if (!state.creatingCity) {
        state.creatingCity = true
        state.createCityReqId = action.meta.requestId
      }
    },
    [createCity.fulfilled]: (state, action) => {
      if (state.creatingCity && state.createCityReqId === action.meta.requestId) {
        state.creatingCity = false
        state.createCityReqId = undefined
      }
      if (action.payload) {
        state.cities = [action.payload, ...state.cities]
      }
    },
    [createCity.rejected]: (state, action) => {
      if (state.creatingCity) {
        state.creatingCity = false
        state.createCityReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          state.cityErrors = {
            ...state.cityErrors,
            [key]: value,
          }
        }
      }
    },
    [showCityError.pending]: (state, action) => {
      if (!state.showingContactErr) {
        state.showingContactErr = true
        state.showCityReqId = action.meta.requestId
      }
    },
    [showCityError.fulfilled]: (state, action) => {
      if (state.showingContactErr && state.showCityReqId === action.meta.requestId) {
        state.showingContactErr = false
        state.showCityReqId = undefined
      }
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errCity':
            state.cityErrors = {
              ...state.cityErrors,
              [action.payload.type]: 'This field is Required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [showCityError.rejected]: (state, action) => {
      if (!state.showingContactErr) {
        state.showingContactErr = false
        state.showCityReqId = action.meta.requestId
      }
    },
    [clearCityError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errCity') {
        state.cityErrors = {
          ...state.cityErrors,
          [action.payload.type]: '',
        }
      }
    },
  },
})

export {
  updateCity,
  createCity,
  findCity,
  clearCityError,
  fetchCities,
  showCityError,
  destroyContact,
}
export default citySlice.reducer
