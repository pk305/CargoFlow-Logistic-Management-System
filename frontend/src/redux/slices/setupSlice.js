import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/setups`

const initialState = {
  setups: null,
  setupErrors: {
    companyInfo: {
      companyName: '',
      companyAddress: '',
      companyEmail: '',
      companyTel: '',
      companyWebsite: '',
      cityId: '',
      countryId: '',
      postcode: '',
      taxNo: '',
      timeZone: '',
    },
  },
  company: null,
  companyPersonnel: null,
  logo: null,
  showingSetupError: false,
  showSetupReqId: undefined,
  creatingSetup: false,
  createSetupReqId: undefined,
  updatingSetup: false,
  updateSetupReqId: undefined,
  loadingCompPersonnel: false,
  setupCompPersReqId: undefined,
  uploadingLogo: false,
  uploadLogoCompReqId: undefined,
}

const createSetup = createAsyncThunk('setup/createSetup', async (field, thunk) => {
  const { createSetupReqId, creatingSetup } = thunk.getState().setup
  if (!creatingSetup || thunk.requestId !== createSetupReqId) {
    return false
  }
  try {
    const res = await api().post(`${ApiUrl}`, field)
    console.log(res.data)
    // return thunk.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunk.rejectWithValue(err.response.data)
  }
})

const updateSetup = createAsyncThunk(
  'setup/updateSetup',
  async ({ companyId, ...field }, thunk) => {
    const { updateSetupReqId, updatingSetup } = thunk.getState().setup
    if (!updatingSetup || thunk.requestId !== updateSetupReqId) {
      return false
    }
    try {
      const res = await api().put(`${ApiUrl}/${companyId}`, field)
      return thunk.fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return thunk.rejectWithValue(err.response.data)
    }
  },
)

const setupCompanyPersonel = createAsyncThunk(
  'setup/setupCompanyPersonel',
  async (field, thunk) => {
    const { setupCompPersReqId, loadingCompPersonnel } = thunk.getState().setup
    if (!loadingCompPersonnel || thunk.requestId !== setupCompPersReqId) {
      return false
    }
    try {
      const res = await api().post(`${ApiUrl}/company_personnel`, field)
      return thunk.fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return thunk.rejectWithValue(err.response.data)
    }
  },
)

const uploadLogoCompany = createAsyncThunk('setup/uploadLogoCompany', async (field, thunkAPI) => {
  const { uploadLogoCompReqId, uploadingLogo } = thunkAPI.getState().setup
  if (!uploadingLogo || thunkAPI.requestId !== uploadLogoCompReqId) {
    return
  }
  try {
    const res = await api().post(`${ApiUrl}/company_logo`, field)
    return thunkAPI.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunkAPI.rejectWithValue(err.response.data)
  }
})

const showSetupError = createAsyncThunk('setup/showSetupError', async (field, thunk) => {
  return thunk.fulfillWithValue(field)
})

const clearSetupErrors = createAsyncThunk('setup/clearSetupErrors', async (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

export const setupSlice = createSlice({
  name: 'setup',
  initialState,
  reducers: {},
  extraReducers: {
    [clearSetupErrors.fulfilled]: (state, action) => {
      if (action.payload) {
        if (action.payload.errorType === 'errSetup') {
          if (action.payload.type !== 'setupErrors') {
            const char = action.payload.type.split('.')
            state.setupErrors = {
              ...state.setupErrors,
              [char[0]]: {
                ...state.setupErrors[char[0]],
                [char[1]]: '',
              },
            }
          }
        }
      }
    },
    [createSetup.pending]: (state, action) => {
      if (!state.creatingSetup) {
        state.creatingSetup = true
        state.createSetupReqId = action.meta.requestId
      }
    },
    [createSetup.fulfilled]: (state, action) => {
      if (state.creatingSetup && state.createSetupReqId === action.meta.requestId) {
        state.creatingSetup = false
        state.createSetupReqId = undefined
      }
      if (action.payload) {
        state.setups = action.payload
      }
    },
    [createSetup.rejected]: (state, action) => {
      if (state.creatingSetup) {
        state.creatingSetup = false
        state.createSetupReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          const char = key.split('.')
          state.setupErrors = {
            ...state.setupErrors,
            [char[0]]: {
              ...state.setupErrors[char[0]],
              [char[1]]: value,
            },
          }
        }
      }
    },
    [updateSetup.pending]: (state, action) => {
      if (!state.updatingSetup) {
        state.updatingSetup = true
        state.updateSetupReqId = action.meta.requestId
      }
    },
    [updateSetup.fulfilled]: (state, action) => {
      if (state.updatingSetup && state.updateSetupReqId === action.meta.requestId) {
        state.updatingSetup = false
        state.updateSetupReqId = undefined
      }
      if (action.payload) {
        state.setups = action.payload
      }
    },
    [updateSetup.rejected]: (state, action) => {
      if (state.updatingSetup) {
        state.updatingSetup = false
        state.updateSetupReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          const char = key.split('.')
          state.setupErrors = {
            ...state.setupErrors,
            [char[0]]: {
              ...state.setupErrors[char[0]],
              [char[1]]: value,
            },
          }
        }
      }
    },
    [setupCompanyPersonel.pending]: (state, action) => {
      if (!state.loadingCompPersonnel) {
        state.loadingCompPersonnel = true
        state.setupCompPersReqId = action.meta.requestId
      }
    },
    [setupCompanyPersonel.fulfilled]: (state, action) => {
      if (state.loadingCompPersonnel && state.setupCompPersReqId === action.meta.requestId) {
        state.loadingCompPersonnel = false
        state.setupCompPersReqId = undefined
      }
      if (action.payload) {
        state.setups = action.payload
      }
    },
    [setupCompanyPersonel.rejected]: (state, action) => {
      if (state.loadingCompPersonnel) {
        state.loadingCompPersonnel = false
        state.setupCompPersReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          const char = key.split('.')
          state.setupErrors = {
            ...state.setupErrors,
            [char[0]]: {
              ...state.setupErrors[char[0]],
              [char[1]]: value,
            },
          }
        }
      }
    },
    [showSetupError.pending]: (state, action) => {
      if (!state.showingSetupError) {
        state.showingSetupError = true
        state.showSetupReqId = action.meta.requestId
      }
    },
    [showSetupError.fulfilled]: (state, action) => {
      if (state.showingSetupError && state.showSetupReqId === action.meta.requestId) {
        state.showingSetupError = false
        state.showSetupReqId = undefined
      }
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errSetup':
            const char = action.payload.type.split('.')
            state.setupErrors = {
              ...state.setupErrors,
              [char[0]]: {
                ...state.setupErrors[char[0]],
                [char[1]]: 'This field is required.',
              },
            }

            return state
          default:
            return state
        }
      }
    },
    [showSetupError.rejected]: (state, action) => {
      if (state.showingSetupError) {
        state.showingSetupError = false
        state.showSetupReqId = action.meta.requestId
      }
    },
    [uploadLogoCompany.pending]: (state, action) => {
      if (!state.uploadingLogo) {
        state.uploadingLogo = true
        state.uploadLogoCompReqId = action.meta.requestId
      }
    },
    [uploadLogoCompany.fulfilled]: (state, action) => {
      if (state.uploadingLogo && state.uploadLogoCompReqId === action.meta.requestId) {
        state.uploadingLogo = false
        state.uploadLogoCompReqId = undefined
      }
      if (action.payload) {
        state.logo = action.payload
      }
    },
    [uploadLogoCompany.rejected]: (state, action) => {
      if (state.uploadingLogo) {
        state.uploadingLogo = false
        state.uploadLogoCompReqId = action.meta.requestId
      }
    },
  },
})

export {
  createSetup,
  showSetupError,
  clearSetupErrors,
  updateSetup,
  setupCompanyPersonel,
  uploadLogoCompany,
}
export default setupSlice.reducer
