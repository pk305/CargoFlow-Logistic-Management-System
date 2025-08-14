import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/emails`

const initialState = {
  mails: [],
  updatingMail: false,
  updateMailReqId: undefined,
  fetchingMails: false,
  showMail: null,
  fetchMailReqId: undefined,
  findingMail: false,
  findMailReqId: undefined,
  mailErrors: {
    contactName: '',
    contactEmail: '',
    companyId: '',
    jobTitle: '',
    gsm: '',
    skype: '',
    tel: '',
    operationId: '',
    roadNotify: '',
    seaNotify: '',
    airNotify: '',
    railNotify: '',
    customNotify: '',
    depotNotify: '',
    financeNotify: '',
    twitter: '',
    linkedin: '',
    facebook: '',
    instagram: '',
  },
  createMailReqId: undefined,
  creatingMail: false,
  destMailReqId: undefined,
  deletingMail: false,
  showMailReqId: undefined,
  showingMailErr: false,
}

const fetchMails = createAsyncThunk('mail/fetchMails', async (_, thunkAPI) => {
  const { fetchMailReqId, fetchingMails } = thunkAPI.getState().mail
  if (!fetchingMails || thunkAPI.requestId !== fetchMailReqId) {
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

const createMail = createAsyncThunk('mail/createMail', async (field, thunk) => {
  const { createMailReqId, creatingMail } = thunk.getState().mail
  if (!creatingMail || thunk.requestId !== createMailReqId) {
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

const findMail = createAsyncThunk('mail/findMail', async (Id, thunk) => {
  const { findMailReqId, findingMail } = thunk.getState().mail
  if (!findingMail || thunk.requestId !== findMailReqId) {
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

const updateMail = createAsyncThunk('mail/updateMail', async ({ Id, ...field }, thunk) => {
  const { updateMailReqId, updatingMail } = thunk.getState().mail
  if (!updatingMail || thunk.requestId !== updateMailReqId) {
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

const destroyMail = createAsyncThunk('mail/destroyMail', async (field, thunk) => {
  const { destMailReqId, deletingMail } = thunk.getState().mail
  if (!deletingMail || thunk.requestId !== destMailReqId) {
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

const showMailError = createAsyncThunk('mail/showMailError', async (field, thunk) => {
  return thunk.fulfillWithValue(field)
})

const clearMailError = createAsyncThunk('mail/clearMailError', async (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

export const mailSlice = createSlice({
  name: 'mail',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchMails.pending]: (state, action) => {
      if (!state.fetchingMails) {
        state.fetchingMails = true
        state.fetchMailReqId = action.meta.requestId
      }
    },
    [fetchMails.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.fetchingMails && state.fetchMailReqId === requestId) {
        state.fetchingMails = false
        state.fetchMailReqId = undefined
      }

      state.mails = action.payload
    },
    [fetchMails.rejected]: (state, action) => {
      if (!state.fetchingMails) {
        state.fetchingMails = true
        state.fetchMailReqId = action.meta.requestId
      }
    },
    [updateMail.pending]: (state, action) => {
      if (!state.updatingMail) {
        state.updatingMail = true
        state.updateMailReqId = action.meta.requestId
      }
    },
    [updateMail.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.updatingMail && state.updateMailReqId === requestId) {
        state.updatingMail = false
        state.updateMailReqId = undefined
      }
      if (action.payload) {
        state.mails = state.mails.map((c) => {
          if (c.id === action.payload.id) {
            return Object.assign({}, c, action.payload)
          }
          return c
        })
      }
    },
    [destroyMail.pending]: (state, action) => {
      if (!state.deletingMail) {
        state.deletingMail = true
        state.destMailReqId = action.meta.requestId
      }
    },
    [destroyMail.fulfilled]: (state, action) => {
      if (state.deletingMail && state.destMailReqId === action.meta.requestId) {
        state.deletingMail = false
        state.destMailReqId = undefined
      }
      if (action.payload) {
        state.mails = state.mails.filter((cont) => cont.id !== action.payload.id)
      }
    },
    [destroyMail.rejected]: (state, action) => {
      if (!state.deletingMail) {
        state.deletingMail = false
        state.destMailReqId = action.meta.requestId
      }
    },
    [updateMail.rejected]: (state, action) => {
      if (state.updatingMail) {
        state.updatingMail = false
        state.updateMailReqId = action.meta.requestId
      }
    },
    [findMail.pending]: (state, action) => {
      if (!state.findingMail) {
        state.findingMail = true
        state.findMailReqId = action.meta.requestId
      }
    },
    [findMail.fulfilled]: (state, action) => {
      if (state.findingMail && state.findMailReqId === action.meta.requestId) {
        state.findingMail = false
        state.findMailReqId = undefined
      }
      if (action.payload) {
        state.showMail = action.payload
      }
    },
    [findMail.rejected]: (state, action) => {
      if (state.findingMail) {
        state.findingMail = false
        state.findMailReqId = action.meta.requestId
      }
    },
    [createMail.pending]: (state, action) => {
      if (!state.creatingMail) {
        state.creatingMail = true
        state.createMailReqId = action.meta.requestId
      }
    },
    [createMail.fulfilled]: (state, action) => {
      if (state.creatingMail && state.createMailReqId === action.meta.requestId) {
        state.creatingMail = false
        state.createMailReqId = undefined
      }
      if (action.payload) {
        state.mails = [action.payload, ...state.mails]
      }
    },
    [createMail.rejected]: (state, action) => {
      if (state.creatingMail) {
        state.creatingMail = false
        state.createMailReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          state.mailErrors = {
            ...state.mailErrors,
            [key]: value,
          }
        }
      }
    },
    [showMailError.fulfilled]: (state, action) => {
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errMail':
            state.mailErrors = {
              ...state.mailErrors,
              [action.payload.type]: 'This field is Required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [clearMailError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errMail') {
        state.mailErrors = {
          ...state.mailErrors,
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

export { updateMail, createMail, findMail, clearMailError, fetchMails, showMailError, destroyMail }
export default mailSlice.reducer
