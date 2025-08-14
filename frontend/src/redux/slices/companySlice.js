import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/companies`

const initialState = {
  companies: [],
  showCompany: {},
  fetchingCompanies: false,
  fetchCompReqId: undefined,
  companyErrors: {
    companyName: '',
    cityName: '',
    countryId: '',
    district: '',
    address: '',
    postcode: '',
    eoriCode: '',
    taxOffice: '',
    taxNo: '',
    companyTel: '',
    companyFax: '',
    companyEmail: '',
    companyWebsite: '',
    companySalerId: '',
    branchId: '',
    companyGroup: '',
    companyType: '',
    companySector: '',
    tagNames: '',
    notes: '',
    contactsAttrName: '',
    contactsAttrJobTitle: '',
    contactsAttrTel: '',
    contactsAttrEmail: '',
  },
  showingError: false,
  storeCompyId: undefined,
  creatingCompany: false,
  errorCallout: false,
  errorCalloutText: '',
  findComReqId: undefined,
  findingCompany: false,
  updateCompyReqId: undefined,
  updatingCompany: false,
  companyMergeErrors: {},
  deletingCompany: false,
  destCompReqId: undefined,
}

const fetchCompanies = createAsyncThunk('company/fetchCompanies', async (_, thunkAPI) => {
  const { fetchCompReqId, fetchingCompanies } = thunkAPI.getState().company
  if (!fetchingCompanies || thunkAPI.requestId !== fetchCompReqId) {
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

const createCompany = createAsyncThunk('company/createCompany', async (field, thunk) => {
  const { storeCompyId, creatingCompany } = thunk.getState().company
  if (!creatingCompany || thunk.requestId !== storeCompyId) {
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

const updateCompany = createAsyncThunk('company/updateCompany', async ({ Id, ...field }, thunk) => {
  const { updateCompyReqId, updatingCompany } = thunk.getState().company
  if (!updatingCompany || thunk.requestId !== updateCompyReqId) {
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

const findCompany = createAsyncThunk('company/findCompany', async (Id, thunk) => {
  const { findComReqId, findingCompany } = thunk.getState().company
  if (!findingCompany || thunk.requestId !== findComReqId) {
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

const destroyCompany = createAsyncThunk('company/destroyCompany', async (field, thunk) => {
  const { destCompReqId, deletingCompany } = thunk.getState().company
  if (!deletingCompany || thunk.requestId !== destCompReqId) {
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

const showCompanyError = createAsyncThunk('company/showCompanyError', (field, thunk) => {
  return thunk.fulfillWithValue(field)
})

const clearCompanyError = createAsyncThunk('company/clearCompanyError', (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

const addShowCompany = createAsyncThunk('company/addShowCompany', (field, thunk) => {
  return thunk.fulfillWithValue(field)
})

const destroyShowCompany = createAsyncThunk('company/destroyShowCompany', (field, thunk) => {
  return thunk.fulfillWithValue(field)
})

const updateShowCompany = createAsyncThunk('company/updateShowCompany', (field, thunk) => {
  return thunk.fulfillWithValue(field)
})

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},
  extraReducers: {
    [destroyCompany.pending]: (state, action) => {
      if (!state.deletingCompany) {
        state.deletingCompany = true
        state.destCompReqId = action.meta.requestId
      }
    },
    [destroyCompany.fulfilled]: (state, action) => {
      if (state.deletingCompany && state.destCompReqId === action.meta.requestId) {
        state.deletingCompany = false
        state.destCompReqId = undefined
      }
      if (action.payload) {
        state.companies = state.companies.filter((x) => x.id !== action.payload.id)
      }
    },
    [destroyCompany.rejected]: (state, action) => {
      if (!state.deletingCompany) {
        state.deletingCompany = false
        state.destCompReqId = action.meta.requestId
      }
    },
    [fetchCompanies.pending]: (state, action) => {
      if (!state.fetchingCompanies) {
        state.fetchingCompanies = true
        state.fetchCompReqId = action.meta.requestId
      }
    },
    [fetchCompanies.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.fetchingCompanies && state.fetchCompReqId === requestId) {
        state.fetchingCompanies = false
        state.fetchCompReqId = undefined
      }

      state.companies = action.payload
    },
    [fetchCompanies.rejected]: (state, action) => {
      if (state.fetchingCompanies) {
        state.fetchingCompanies = false
        state.fetchCompReqId = action.meta.requestId
      }
    },
    [updateCompany.pending]: (state, action) => {
      if (!state.updatingCompany) {
        state.updatingCompany = true
        state.updateCompyReqId = action.meta.requestId
      }
    },
    [updateCompany.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.updatingCompany && state.updateCompyReqId === requestId) {
        state.updatingCompany = false
        state.updateCompyReqId = undefined
      }

      if (action.payload) {
        state.companies = state.companies.map((c) => {
          if (c.id === action.payload.id) {
            return Object.assign({}, c, action.payload)
          }
          return c
        })
      }
    },
    [updateCompany.rejected]: (state, action) => {
      if (state.updatingCompany) {
        state.updatingCompany = false
        state.updateCompyReqId = action.meta.requestId
      }
      if (action.payload) {
        if (action.payload.errors) {
          for (const [key, value] of Object.entries(action.payload.errors)) {
            state.companyErrors = {
              ...state.companyErrors,
              [key]: value,
            }
          }
          state.errorCalloutText = action.payload.message
          state.errorCallout = true
        }
      }
    },
    [clearCompanyError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errCompany') {
        state.companyErrors = {
          ...state.companyErrors,
          [action.payload.type]: '',
        }
      }
    },
    [showCompanyError.fulfilled]: (state, action) => {
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errCompany':
            state.companyErrors = {
              ...state.companyErrors,
              [action.payload.type]: 'This field is required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [createCompany.pending]: (state, action) => {
      if (!state.creatingCompany) {
        state.creatingCompany = true
        state.storeCompyId = action.meta.requestId
      }
    },
    [createCompany.fulfilled]: (state, action) => {
      if (state.creatingCompany && state.storeCompyId === action.meta.requestId) {
        state.creatingCompany = false
        state.storeCompyId = undefined
      }
      if (action.payload) {
        state.companies = [action.payload, ...state.companies]

        state.errorCallout = false
        state.errorCalloutText = ''
      }
    },
    [createCompany.rejected]: (state, action) => {
      if (state.creatingCompany) {
        state.creatingCompany = false
        state.storeCompyId = action.meta.requestId
      }
      if (action.payload) {
        if (action.payload.errors) {
          for (const [key, value] of Object.entries(action.payload.errors)) {
            state.companyErrors = {
              ...state.companyErrors,
              [key]: value,
            }
          }
          state.errorCalloutText = action.payload.message
          state.errorCallout = true
        }
      }
    },
    [findCompany.pending]: (state, action) => {
      if (!state.findingCompany) {
        state.findingCompany = true
        state.findComReqId = action.meta.requestId
      }
    },
    [findCompany.fulfilled]: (state, action) => {
      if (state.findingCompany && state.findComReqId === action.meta.requestId) {
        state.findingCompany = false
        state.findComReqId = undefined
      }
      if (action.payload) {
        state.showCompany = action.payload
      }
    },
    [findCompany.rejected]: (state, action) => {
      if (state.findingCompany) {
        state.findingCompany = false
        state.findComReqId = action.meta.requestId
      }
    },
    [destroyShowCompany.fulfilled]: (state, action) => {
      if (action.payload) {
        state.showCompany = {
          ...state.showCompany,
          [action.payload.type]: state.showCompany[action.payload.type].filter(
            (x) => x.id !== action.payload.id,
          ),
        }
      }
    },
    [addShowCompany.fulfilled]: (state, action) => {
      if (action.payload) {
        state.showCompany = {
          ...state.showCompany,
          [action.payload.type]: [...state.showCompany[action.payload.type], action.payload.data],
        }
      }
    },
    [updateShowCompany.fulfilled]: (state, action) => {
      if (action.payload) {
        state.showCompany = {
          ...state.showCompany,
          [action.payload.type]: state.showCompany[action.payload.type].map((c) => {
            if (c.id === action.payload.data.id) {
              return Object.assign({}, c, action.payload.data)
            }
            return c
          }),
        }
      }
    },
  },
})

export {
  findCompany,
  updateCompany,
  fetchCompanies,
  createCompany,
  clearCompanyError,
  showCompanyError,
  destroyCompany,
  addShowCompany,
  destroyShowCompany,
  updateShowCompany,
}
export default companySlice.reducer
