import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/loadings`

const initialState = {
  bookings: [],
  showingError: false,
  showBooking: null,
  creatingBooking: false,
  crntBkErrId: undefined,
  createBookReqId: undefined,
  bookingErrors: {
    authenticityToken: '',
    customerCompany: '',
    loadType: '',
    loadingCountry: '',
    branchId: '',
    salerId: '',
    operationId: '',
    inContainer: '',
    unLoadingCountry: '',
    vagonNo: '',
    hblDate: '',
    telex: '',
    freeTime: '',
    packCode: '',
    total: '',
    totalPack: '',
    customerRef: '',
    loadDate: '',
    senderId: '',
    loadPlace: '',
    placeType: '',
    contactId: '',
    containerAttr: [],
    packageAttr: [],
    commodity: '',
    brutWg: '',
    tagNames: '',
    gtpId: '',
    optimumTemperature: '',
    addrUnno: '',
    priceWg: '',
    commodityType: '',
    htsNo: '',
    ladameter: '',
    volume: '',
    loadCityId: '',
    collectionSenderId: '',
    loaderId: '',
    loadPlaceType: '',
    loadCenterId: '',
    loadCustomOfficerId: '',
    loadCustomId: '',
    checkLoadCustomOfficer: '',
    placeEmail: '',
    placeTel: '',
    contactName: '',
    openingInfo: '',
    placeLat: '',
    placeLng: '',
    placeCountryId: '',
    placeCityId: '',
    postcode: '',
    placeAddres: '',
    placeCode: '',
    placeName: '',
    depZipCode: '',
    consigneeId: '',
    deliveryId: '',
    unLoadPlaceType: '',
    unLoadPlaceId: '',
    arvZipCode: '',
    unLoadCityId: '',
    unLoadCustomId: '',
    unLoadCustomOfficerId: '',
    unloadCustomerOfficer: '',
    unloadPlace: '',
    freightPrice: '',
    projectId: '',
    documentDate: '',
    channel: '',
    freightCurr: '',
    incoterm: '',
    agentId: '',
    ppcc: '',
    letterOfCredit: '',
    notes: '',
    agentRef: '',
    notify1Id: '',
    notify2Id: '',
    productPrice: '',
    serviceTypeId: '',
    productCurr: '',
    unloadDate: '',
    terminDate: '',
  },
  errorCallout: false,
  errorCalloutText: '',
  fetchBkngReqId: undefined,
  fetchingBooking: false,
  removeBkReqId: undefined,
  removingBooking: false,
  findingBooking: false,
  findBkReqId: undefined,
  updatingBooking: false,
  updateBookReqId: undefined,
}

const fetchBookings = createAsyncThunk('booking/fetchBookings', async (_, thunk) => {
  const { fetchBkngReqId, fetchingBooking } = thunk.getState().booking
  if (!fetchingBooking || thunk.requestId !== fetchBkngReqId) {
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

const createBooking = createAsyncThunk('booking/createBooking', async (field, thunk) => {
  const { createBookReqId, creatingBooking } = thunk.getState().booking
  if (!creatingBooking || thunk.requestId !== createBookReqId) {
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

const createBookingOption = createAsyncThunk(
  'booking/createBookingOption',
  async (field, thunk) => {
    const { createBookReqId, creatingBooking } = thunk.getState().booking
    if (!creatingBooking || thunk.requestId !== createBookReqId) {
      return false
    }
    try {
      const res = await api().post(`${ApiUrl}/steps`, field)
      return thunk.fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return thunk.rejectWithValue(err.response.data)
    }
  },
)

const destroyBooking = createAsyncThunk('booking/destroyBooking', async (field, thunk) => {
  const { removeBkReqId, removingBooking } = thunk.getState().booking
  if (!removingBooking || thunk.requestId !== removeBkReqId) {
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

const findBooking = createAsyncThunk('booking/findBooking', async (Id, thunk) => {
  const { findBkReqId, findingBooking } = thunk.getState().booking
  if (!findingBooking || thunk.requestId !== findBkReqId) {
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

const updateBooking = createAsyncThunk('booking/updateBooking', async ({ Id, ...field }, thunk) => {
  const { updateBookReqId, updatingBooking } = thunk.getState().booking
  if (!updatingBooking || thunk.requestId !== updateBookReqId) {
    return false
  }
  try {
    const res = await api().put(`${ApiUrl}/${Id}`, field)
    // console.log(res.data)
    return thunk.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunk.rejectWithValue(err.response.data)
  }
})

const updateLoadStatus = createAsyncThunk('booking/updateLoadStatus', async (field, thunk) => {
  try {
    const res = await api().post(`${ApiUrl}/load_status`, field)
    return thunk.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunk.rejectWithValue(err.response.data)
  }
})

const showBookingError = createAsyncThunk('booking/showBookingError', (field, thunk) => {
  const { crntBkErrId, showingError } = thunk.getState().booking
  if (!showingError || thunk.requestId !== crntBkErrId) {
    return false
  }

  return thunk.fulfillWithValue(field)
})

const clearBookingError = createAsyncThunk('booking/clearBookingError', (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

const clearShowBooking = createAsyncThunk('booking/clearShowBooking', (field, thunk) => {
  return thunk.fulfillWithValue(field)
})

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {},
  extraReducers: {
    [clearShowBooking.fulfilled]: (state) => {
      state.showBooking = null
    },
    [findBooking.pending]: (state, action) => {
      if (!state.findingBooking) {
        state.findingBooking = true
        state.findBkReqId = action.meta.requestId
      }
    },
    [findBooking.fulfilled]: (state, action) => {
      if (state.findingBooking && state.findBkReqId === action.meta.requestId) {
        state.findingBooking = false
        state.findBkReqId = undefined
      }
      if (action.payload) {
        state.showBooking = action.payload
      }
    },
    [findBooking.rejected]: (state, action) => {
      if (state.findingBooking) {
        state.findingBooking = false
        state.findBkReqId = action.meta.requestId
      }
    },
    [destroyBooking.pending]: (state, action) => {
      if (!state.removingBooking) {
        state.removingBooking = true
        state.removeBkReqId = action.meta.requestId
      }
    },
    [destroyBooking.fulfilled]: (state, action) => {
      if (state.removingBooking && state.removeBkReqId === action.meta.requestId) {
        state.removingBooking = false
        state.removeBkReqId = undefined
      }
      if (action.payload) {
        state.bookings = state.bookings.filter((bk) => bk.id !== action.payload.id)
      }
    },
    [destroyBooking.rejected]: (state, action) => {
      if (!state.removingBooking) {
        state.removingBooking = false
        state.removeBkReqId = action.meta.requestId
      }
    },
    [showBookingError.pending]: (state, action) => {
      if (!state.showingError) {
        state.showingError = true
        state.crntBkErrId = action.meta.requestId
      }
    },
    [showBookingError.fulfilled]: (state, action) => {
      if (state.showingError && state.crntBkErrId === action.meta.requestId) {
        state.showingError = false
        state.crntBkErrId = undefined
      }
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errBooking':
            state.bookingErrors = {
              ...state.bookingErrors,
              [action.payload.type]: 'This field is Required.',
            }
            return state
          // Although your operation type is abroad, your loading and unloading countries are the same. Please check.
          default:
            return state
        }
      }
    },
    [showBookingError.rejected]: (state, action) => {
      if (!state.showingError) {
        state.showingError = false
        state.crntBkErrId = action.meta.requestId
      }
    },
    [clearBookingError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errBooking') {
        state.bookingErrors = {
          ...state.bookingErrors,
          [action.payload.type]: '',
        }
      } else if (action.payload.errorType === 'calloutErr') {
        if (action.payload.type === 'msgCallout') {
          state.errorCallout = false
          state.errorCalloutText = ''
        }
      }
    },
    [createBooking.pending]: (state, action) => {
      if (!state.creatingBooking) {
        state.creatingBooking = true
        state.createBookReqId = action.meta.requestId
      }
    },
    [createBooking.fulfilled]: (state, action) => {
      if (state.creatingBooking && state.createBookReqId === action.meta.requestId) {
        state.creatingBooking = false
        state.createBookReqId = undefined
        state.errorCallout = false
        state.errorCalloutText = ''
      }
      if (action.payload) {
        state.bookings = [action.payload, ...state.bookings]

        if (action.payload.errorType) {
          switch (action.payload.errorType) {
            case 'errBooking':
              state.bookingErrors = {
                ...state.bookingErrors,
                [action.payload.type]: 'This field is required.',
              }
              return
            default:
              return
          }
        } else {
          state.bookingErrors = {
            authenticityToken: '',
            customerCompany: '',
            loadType: '',
            loadingCountry: '',
            branchId: '',
            salerId: '',
            operationId: '',
            inContainer: '',
            unLoadingCountry: '',
            vagonNo: '',
            hblDate: '',
            telex: '',
            freeTime: '',
            packCode: '',
            total: '',
            totalPack: '',
            customerRef: '',
            loadDate: '',
            senderId: '',
            loadPlace: '',
            placeType: '',
            contactId: '',
            containerAttr: [],
            packageAttr: [],
            commodity: '',
            brutWg: '',
            tagNames: '',
            gtpId: '',
            optimumTemperature: '',
            addrUnno: '',
            priceWg: '',
            commodityType: '',
            htsNo: '',
            ladameter: '',
            volume: '',
            loadCityId: '',
            collectionSenderId: '',
            loaderId: '',
            loadPlaceType: '',
            loadCenterId: '',
            loadCustomOfficerId: '',
            loadCustomId: '',
            checkLoadCustomOfficer: '',
            placeEmail: '',
            placeTel: '',
            contactName: '',
            openingInfo: '',
            placeLat: '',
            placeLng: '',
            placeCountryId: '',
            placeCityId: '',
            postcode: '',
            placeAddres: '',
            placeCode: '',
            placeName: '',
            depZipCode: '',
            consigneeId: '',
            deliveryId: '',
            unLoadPlaceType: '',
            unLoadPlaceId: '',
            arvZipCode: '',
            unLoadCityId: '',
            unLoadCustomId: '',
            unLoadCustomOfficerId: '',
            unloadCustomerOfficer: '',
            unloadPlace: '',
            freightPrice: '',
            projectId: '',
            documentDate: '',
            channel: '',
            freightCurr: '',
            incoterm: '',
            agentId: '',
            ppcc: '',
            letterOfCredit: ' ',
            notes: '',
            agentRef: '',
            notify1Id: '',
            notify2Id: '',
            productPrice: '',
            serviceTypeId: '',
            productCurr: '',
            unloadDate: '',
            terminDate: '',
          }
        }
      }
    },
    [createBooking.rejected]: (state, action) => {
      if (state.creatingBooking) {
        state.creatingBooking = false
        state.createBookReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          state.bookingErrors = {
            ...state.bookingErrors,
            [key]: value,
          }
        }
        state.errorCalloutText = action.payload.message
        state.errorCallout = true
      }
    },
    [createBookingOption.pending]: (state, action) => {
      if (!state.creatingBooking) {
        state.creatingBooking = true
        state.createBookReqId = action.meta.requestId
      }
    },
    [createBookingOption.fulfilled]: (state, action) => {
      if (state.creatingBooking && state.createBookReqId === action.meta.requestId) {
        state.creatingBooking = false
        state.createBookReqId = undefined
        state.errorCallout = false
        state.errorCalloutText = ''
      }
      if (action.payload) {
        state.bookings = [action.payload, ...state.bookings]
      }
    },
    [createBookingOption.rejected]: (state, action) => {
      if (state.creatingBooking) {
        state.creatingBooking = false
        state.createBookReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          state.bookingErrors = {
            ...state.bookingErrors,
            [key]: value,
          }
        }
        state.errorCalloutText = action.payload.message
        state.errorCallout = true
      }
    },
    [fetchBookings.pending]: (state, action) => {
      if (!state.fetchingBooking) {
        state.fetchingBooking = true
        state.fetchBkngReqId = action.meta.requestId
      }
    },
    [fetchBookings.fulfilled]: (state, action) => {
      if (state.fetchingBooking && state.fetchBkngReqId === action.meta.requestId) {
        state.fetchingBooking = false
        state.fetchBkngReqId = undefined
      }
      if (action.payload) {
        state.bookings = action.payload
      }
    },
    [fetchBookings.rejected]: (state, action) => {
      if (state.fetchingBooking) {
        state.fetchingBooking = false
        state.fetchBkngReqId = action.meta.requestId
      }
    },
    [updateBooking.pending]: (state, action) => {
      if (!state.updatingBooking) {
        state.updatingBooking = true
        state.updateBookReqId = action.meta.requestId
      }
    },
    [updateBooking.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.updatingBooking && state.updateBookReqId === requestId) {
        state.updatingBooking = false
        state.updateBookReqId = undefined
      }

      if (action.payload) {
        state.bookings = state.bookings.map((c) => {
          if (c.id === action.payload.id) {
            return Object.assign({}, c, action.payload)
          }
          return c
        })
      }
    },
    [updateBooking.rejected]: (state, action) => {
      if (state.updatingBooking) {
        state.updatingBooking = false
        state.updateBookReqId = action.meta.requestId
      }
      if (action.payload) {
        if (action.payload.errors) {
          for (const [key, value] of Object.entries(action.payload.errors)) {
            state.bookingErrors = {
              ...state.bookingErrors,
              [key]: value,
            }
          }
          state.errorCalloutText = action.payload.message
          state.errorCallout = true
        }
      }
    },
  },
})

export {
  fetchBookings,
  updateBooking,
  updateLoadStatus,
  createBooking,
  destroyBooking,
  showBookingError,
  clearBookingError,
  findBooking,
  clearShowBooking,
  createBookingOption,
}
export default bookingSlice.reducer
