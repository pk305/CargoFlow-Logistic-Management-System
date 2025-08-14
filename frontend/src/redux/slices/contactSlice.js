import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/contacts`

const initialState = {
  contacts: [],
  updatingContact: false,
  updateContReqId: undefined,
  fetchingContacts: false,
  showContact: null,
  fetchContReqId: undefined,
  findingContact: false,
  findContReqId: undefined,
  contactErrors: {
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
  createContReqId: undefined,
  creatingContact: false,
  destContReqId: undefined,
  deletingContact: false,
  showContReqId: undefined,
  showingContactErr: false,
}

const fetchContacts = createAsyncThunk('contact/fetchContacts', async (_, thunkAPI) => {
  const { fetchContReqId, fetchingContacts } = thunkAPI.getState().contact
  if (!fetchingContacts || thunkAPI.requestId !== fetchContReqId) {
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

const createContact = createAsyncThunk('contact/createContact', async (field, thunk) => {
  const { createContReqId, creatingContact } = thunk.getState().contact
  if (!creatingContact || thunk.requestId !== createContReqId) {
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

const findContact = createAsyncThunk('contact/findContact', async (Id, thunk) => {
  const { findContReqId, findingContact } = thunk.getState().contact
  if (!findingContact || thunk.requestId !== findContReqId) {
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

const updateContact = createAsyncThunk('contact/updateContact', async ({ Id, ...field }, thunk) => {
  const { updateContReqId, updatingContact } = thunk.getState().contact
  if (!updatingContact || thunk.requestId !== updateContReqId) {
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

const updateContactStatus = createAsyncThunk(
  'contact/updateContactStatus',
  async (field, thunk) => {
    try {
      const res = await api().post(`${ApiUrl}/load_status`, field)
      return thunk.fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return thunk.rejectWithValue(err.response.data)
    }
  },
)

const destroyContact = createAsyncThunk('contact/destroyContact', async (field, thunk) => {
  const { destContReqId, deletingContact } = thunk.getState().contact
  if (!deletingContact || thunk.requestId !== destContReqId) {
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

const showContactError = createAsyncThunk('contact/showContactError', async (field, thunk) => {
  return thunk.fulfillWithValue(field)
})

const clearContactError = createAsyncThunk('contact/clearContactError', async (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

export const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchContacts.pending]: (state, action) => {
      if (!state.fetchingContacts) {
        state.fetchingContacts = true
        state.fetchContReqId = action.meta.requestId
      }
    },
    [fetchContacts.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.fetchingContacts && state.fetchContReqId === requestId) {
        state.fetchingContacts = false
        state.fetchContReqId = undefined
      }

      state.contacts = action.payload
    },
    [fetchContacts.rejected]: (state, action) => {
      if (!state.fetchingContacts) {
        state.fetchingContacts = true
        state.fetchContReqId = action.meta.requestId
      }
    },
    [updateContact.pending]: (state, action) => {
      if (!state.updatingContact) {
        state.updatingContact = true
        state.updateContReqId = action.meta.requestId
      }
    },
    [updateContact.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.updatingContact && state.updateContReqId === requestId) {
        state.updatingContact = false
        state.updateContReqId = undefined
      }
      if (action.payload) {
        state.contacts = state.contacts.map((c) => {
          if (c.id === action.payload.id) {
            return Object.assign({}, c, action.payload)
          }
          return c
        })
      }
    },
    [destroyContact.pending]: (state, action) => {
      if (!state.deletingContact) {
        state.deletingContact = true
        state.destContReqId = action.meta.requestId
      }
    },
    [destroyContact.fulfilled]: (state, action) => {
      if (state.deletingContact && state.destContReqId === action.meta.requestId) {
        state.deletingContact = false
        state.destContReqId = undefined
      }
      if (action.payload) {
        state.contacts = state.contacts.filter((cont) => cont.id !== action.payload.id)
      }
    },
    [destroyContact.rejected]: (state, action) => {
      if (!state.deletingContact) {
        state.deletingContact = false
        state.destContReqId = action.meta.requestId
      }
    },
    [updateContact.rejected]: (state, action) => {
      if (state.updatingContact) {
        state.updatingContact = false
        state.updateContReqId = action.meta.requestId
      }
    },
    [findContact.pending]: (state, action) => {
      if (!state.findingContact) {
        state.findingContact = true
        state.findContReqId = action.meta.requestId
      }
    },
    [findContact.fulfilled]: (state, action) => {
      if (state.findingContact && state.findContReqId === action.meta.requestId) {
        state.findingContact = false
        state.findContReqId = undefined
      }
      if (action.payload) {
        state.showContact = action.payload
      }
    },
    [findContact.rejected]: (state, action) => {
      if (state.findingContact) {
        state.findingContact = false
        state.findContReqId = action.meta.requestId
      }
    },
    [createContact.pending]: (state, action) => {
      if (!state.creatingContact) {
        state.creatingContact = true
        state.createContReqId = action.meta.requestId
      }
    },
    [createContact.fulfilled]: (state, action) => {
      if (state.creatingContact && state.createContReqId === action.meta.requestId) {
        state.creatingContact = false
        state.createContReqId = undefined
      }
      if (action.payload) {
        state.contacts = [action.payload, ...state.contacts]

        if (action.payload.errorType) {
          switch (action.payload.errorType) {
            case 'errContact':
              state.contactErrors = {
                ...state.contactErrors,
                [action.payload.type]: 'This field is required.',
              }
              return
            default:
              return
          }
        } else {
          state.contactErrors = {
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
          }
        }
      }
    },
    [createContact.rejected]: (state, action) => {
      if (state.creatingContact) {
        state.creatingContact = false
        state.createContReqId = action.meta.requestId
      }
      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          state.contactErrors = {
            ...state.contactErrors,
            [key]: value,
          }
        }
      }
    },
    [showContactError.fulfilled]: (state, action) => {
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errContact':
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
    [clearContactError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errContact') {
        state.contactErrors = {
          ...state.contactErrors,
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
  updateContact,
  updateContactStatus,
  createContact,
  findContact,
  clearContactError,
  fetchContacts,
  showContactError,
  destroyContact,
}
export default contactSlice.reducer
