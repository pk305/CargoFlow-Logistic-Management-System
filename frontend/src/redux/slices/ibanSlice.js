import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/ibans`

const initialState = {
  ibans: [],
  updatingIban: false,
  updateIbanReqId: undefined,
  fetchingIban: false,
  showIban: null,
  fetchIbanReqId: undefined,
  findingIban: false,
  findFinReqId: undefined,
  ibanErrors: {
    bankId: '',
    ibanNo: '',
    curr: '',
    isDefault: '',
    bankName: '',
    bankCode: '',
    branchCode: '',
    customerCode: '',
    accountCode: '',
    swiftCode: '',
    idNumber: '',
    title: '',
  },
  createIbanReqId: undefined,
  creatingIban: false,
  destIbanReqId: undefined,
  deletingIban: false,
  showIbanReqId: undefined,
  showingIbanErr: false,
}

const fetchIbans = createAsyncThunk('ibans/fetchIbans', async (_, thunkAPI) => {
  const { fetchIbanReqId, fetchingIban } = thunkAPI.getState().iban
  if (!fetchingIban || thunkAPI.requestId !== fetchIbanReqId) {
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

const createIban = createAsyncThunk('ibans/createIban', async (field, thunk) => {
  const { createIbanReqId, creatingIban } = thunk.getState().iban
  if (!creatingIban || thunk.requestId !== createIbanReqId) {
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

const findIban = createAsyncThunk('ibans/findIban', async (Id, thunk) => {
  const { findFinReqId, findingIban } = thunk.getState().iban
  if (!findingIban || thunk.requestId !== findFinReqId) {
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

const updateIban = createAsyncThunk('ibans/updateIban', async ({ Id, ...field }, thunk) => {
  const { updateIbanReqId, updatingIban } = thunk.getState().iban
  if (!updatingIban || thunk.requestId !== updateIbanReqId) {
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

const updateIbanStatus = createAsyncThunk('ibans/updateIbanStatus', async (field, thunk) => {
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

const destroyIban = createAsyncThunk('ibans/destroyIban', async (field, thunk) => {
  const { destIbanReqId, deletingIban } = thunk.getState().iban
  if (!deletingIban || thunk.requestId !== destIbanReqId) {
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

const showIbanError = createAsyncThunk('ibans/showIbanError', async (field, thunk) => {
  return thunk.fulfillWithValue(field)
})

const clearIbanError = createAsyncThunk('ibans/clearIbanError', async (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

export const contactSlice = createSlice({
  name: 'iban',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchIbans.pending]: (state, action) => {
      if (!state.fetchingIban) {
        state.fetchingIban = true
        state.fetchIbanReqId = action.meta.requestId
      }
    },
    [fetchIbans.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.fetchingIban && state.fetchIbanReqId === requestId) {
        state.fetchingIban = false
        state.fetchIbanReqId = undefined
      }
      if (action.payload) {
        state.ibans = action.payload
      }
    },
    [fetchIbans.rejected]: (state, action) => {
      if (!state.fetchingIban) {
        state.fetchingIban = true
        state.fetchIbanReqId = action.meta.requestId
      }
    },
    [updateIban.pending]: (state, action) => {
      if (!state.updatingIban) {
        state.updatingIban = true
        state.updateIbanReqId = action.meta.requestId
      }
    },
    [updateIban.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.updatingIban && state.updateConFinId === requestId) {
        state.updatingIban = false
        state.updateIbanReqId = undefined
      }
      if (action.payload) {
        state.ibans = state.ibans.map((c) => {
          if (c.id === action.payload.id) {
            return Object.assign({}, c, action.payload)
          }
          return c
        })
      }
    },
    [destroyIban.pending]: (state, action) => {
      if (!state.deletingIban) {
        state.deletingIban = true
        state.destIbanReqId = action.meta.requestId
      }
    },
    [destroyIban.fulfilled]: (state, action) => {
      if (state.deletingIban && state.destIbanReqId === action.meta.requestId) {
        state.deletingIban = false
        state.destIbanReqId = undefined
      }
      if (action.payload) {
        state.ibans = state.ibans.filter((cont) => cont.id !== action.payload.id)
      }
    },
    [destroyIban.rejected]: (state, action) => {
      if (!state.deletingIban) {
        state.deletingIban = false
        state.destIbanReqId = action.meta.requestId
      }
    },
    [updateIban.rejected]: (state, action) => {
      if (state.updatingIban) {
        state.updatingIban = false
        state.updateIbanReqId = action.meta.requestId
      }
    },
    [findIban.pending]: (state, action) => {
      if (!state.findingIban) {
        state.findingIban = true
        state.findFinReqId = action.meta.requestId
      }
    },
    [findIban.fulfilled]: (state, action) => {
      if (state.findingIban && state.findFinReqId === action.meta.requestId) {
        state.findingIban = false
        state.findFinReqId = undefined
      }
      if (action.payload) {
        state.showIban = action.payload
      }
    },
    [findIban.rejected]: (state, action) => {
      if (state.findingIban) {
        state.findingIban = false
        state.findFinReqId = action.meta.requestId
      }
    },
    [createIban.pending]: (state, action) => {
      if (!state.creatingIban) {
        state.creatingIban = true
        state.createIbanReqId = action.meta.requestId
      }
    },
    [createIban.fulfilled]: (state, action) => {
      if (state.creatingIban && state.createIbanReqId === action.meta.requestId) {
        state.creatingIban = false
        state.createIbanReqId = undefined
      }
      if (action.payload) {
        state.ibans = [action.payload, ...state.ibans]

        if (action.payload.errorType) {
          switch (action.payload.errorType) {
            case 'errIban':
              state.ibanErrors = {
                ...state.ibanErrors,
                [action.payload.type]: 'This field is required.',
              }
              return
            default:
              return
          }
        } else {
          state.ibanErrors = {
            bankId: '',
            ibanNo: '',
            curr: '',
            isDefault: '1',
            bankName: '',
            bankCode: '',
            branchCode: '',
            customerCode: '',
            accountCode: '',
            swiftCode: '',
            idNumber: '',
            title: '',
          }
        }
      }
    },
    [createIban.rejected]: (state, action) => {
      if (state.creatingIban) {
        state.creatingIban = false
        state.createIbanReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          state.ibanErrors = {
            ...state.ibanErrors,
            [key]: value,
          }
        }
      }
    },
    [showIbanError.pending]: (state, action) => {
      if (!state.showingIbanErr) {
        state.showingIbanErr = true
        state.showIbanReqId = action.meta.requestId
      }
    },
    [showIbanError.fulfilled]: (state, action) => {
      if (state.showingIbanErr && state.showConFinId === action.meta.requestId) {
        state.showingIbanErr = false
        state.showIbanReqId = undefined
      }
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errIban':
            state.ibanErrors = {
              ...state.ibanErrors,
              [action.payload.type]: 'This field is Required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [showIbanError.rejected]: (state, action) => {
      if (!state.showingIbanErr) {
        state.showingIbanErr = false
        state.showIbanReqId = action.meta.requestId
      }
    },
    [clearIbanError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errIban') {
        state.ibanErrors = {
          ...state.ibanErrors,
          [action.payload.type]: '',
        }
      }
    },
  },
})

export {
  updateIban,
  updateIbanStatus,
  createIban,
  findIban,
  clearIbanError,
  fetchIbans,
  showIbanError,
  destroyIban,
}
export default contactSlice.reducer
