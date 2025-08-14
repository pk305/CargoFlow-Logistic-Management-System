import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'
import download from 'downloadjs'
import printJS from 'print-js'
import { blobToBase64 } from 'src/config/helpers'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/tempdocs`

const initialState = {
  tempdoc: null,
  creatingTempdoc: false,
  createTempReqId: undefined,
  findingTempdoc: false,
  findTempReqId: undefined,
  updatingTempdoc: false,
  updateTempReqId: undefined,
  printLoading: false,
  printLoadReqId: undefined,
}

const createTempdoc = createAsyncThunk('tempdocs/createTempdoc', async (field, thunkAPI) => {
  const { createTempReqId, creatingTempdoc } = thunkAPI.getState().tempdoc
  if (!creatingTempdoc || thunkAPI.requestId !== createTempReqId) {
    return
  }
  try {
    const res = await api().post(`${ApiUrl}`, field)
    return thunkAPI.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunkAPI.rejectWithValue(err.response.data)
  }
})

const updateTempdoc = createAsyncThunk(
  'tempdocs/updateTempdoc',
  async ({ Id, ...field }, thunkAPI) => {
    const { updateTempReqId, updatingTempdoc } = thunkAPI.getState().tempdoc
    if (!updatingTempdoc || thunkAPI.requestId !== updateTempReqId) {
      return
    }
    try {
      const res = await api().put(`${ApiUrl}/${Id}`, field)
      return thunkAPI.fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return thunkAPI.rejectWithValue(err.response.data)
    }
  },
)

const printPdfTempdoc = createAsyncThunk('tempdocs/printPdfTempdoc', async (field, thunkAPI) => {
  const { printLoadReqId, printLoading } = thunkAPI.getState().tempdoc
  if (!printLoading || thunkAPI.requestId !== printLoadReqId) {
    return
  }
  try {
    const res = await api().post(`${ApiUrl}/pdf`, field, { responseType: 'blob' })
    if (res.data) {
      //change blob to base64
      blobToBase64(res.data).then((resData) => {
        printJS({ printable: resData, type: 'pdf', base64: true })
        return thunkAPI.fulfillWithValue(JSON.stringify({ success: true }))
      })
    }
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunkAPI.rejectWithValue(err.response.data)
  }
})

const pdfDownloadTempdoc = createAsyncThunk(
  'tempdocs/pdfDownloadTempdoc',
  async (field, thunkAPI) => {
    try {
      // const res = await api().post(`${ApiUrl}/pdf`, field)
      // console.log(res.data)
      const res = await api().post(`${ApiUrl}/pdf`, field, { responseType: 'blob' })
      if (res.data) {
        const mimeType = res.headers['content-type']
        const cache = res.headers['cache-control']
        const fileName = cache.split(',', 1)
        download(res.data, `${fileName[0]}.pdf`, mimeType)

        return thunkAPI.fulfillWithValue(JSON.stringify({ success: true }))
      }
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return thunkAPI.rejectWithValue(err.response.data)
    }
  },
)

const findTempdoc = createAsyncThunk('tempdocs/findTempdoc', async (field, thunkAPI) => {
  const { findTempReqId, findingTempdoc } = thunkAPI.getState().tempdoc
  if (!findingTempdoc || thunkAPI.requestId !== findTempReqId) {
    return
  }
  try {
    const res = await api().get(`${ApiUrl}/${field}`)
    return thunkAPI.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunkAPI.rejectWithValue(err.response.data)
  }
})

export const tempdocSlice = createSlice({
  name: 'tempdoc',
  initialState,
  reducers: {},
  extraReducers: {
    [createTempdoc.pending]: (state, action) => {
      if (!state.creatingTempdoc) {
        state.creatingTempdoc = true
        state.createTempReqId = action.meta.requestId
      }
    },
    [createTempdoc.fulfilled]: (state, action) => {
      if (state.creatingTempdoc && state.createTempReqId === action.meta.requestId) {
        state.creatingTempdoc = false
        state.createTempReqId = undefined
      }
      if (action.payload) {
        state.tempdoc = action.payload
      }
    },
    [createTempdoc.rejected]: (state, action) => {
      if (state.creatingTempdoc) {
        state.creatingTempdoc = false
        state.createTempReqId = action.meta.requestId
      }
    },
    [updateTempdoc.pending]: (state, action) => {
      if (!state.updatingTempdoc) {
        state.updatingTempdoc = true
        state.updateTempReqId = action.meta.requestId
      }
    },
    [updateTempdoc.fulfilled]: (state, action) => {
      if (state.updatingTempdoc && state.updateTempReqId === action.meta.requestId) {
        state.updatingTempdoc = false
        state.updateTempReqId = undefined
      }
      if (action.payload) {
        state.tempdoc = action.payload
      }
    },
    [updateTempdoc.rejected]: (state, action) => {
      if (state.updatingTempdoc) {
        state.updatingTempdoc = false
        state.updateTempReqId = action.meta.requestId
      }
    },
    [findTempdoc.pending]: (state, action) => {
      if (!state.findingTempdoc) {
        state.findingTempdoc = true
        state.findTempReqId = action.meta.requestId
      }
    },
    [findTempdoc.fulfilled]: (state, action) => {
      if (state.findingTempdoc && state.findTempReqId === action.meta.requestId) {
        state.findingTempdoc = false
        state.findTempReqId = undefined
      }
      if (action.payload) {
        state.tempdoc = action.payload
      }
    },
    [findTempdoc.rejected]: (state, action) => {
      if (state.findingTempdoc) {
        state.findingTempdoc = false
        state.findTempReqId = action.meta.requestId
      }
    },
    [printPdfTempdoc.pending]: (state, action) => {
      if (!state.printLoading) {
        state.printLoading = true
        state.printLoadReqId = action.meta.requestId
      }
    },
    [printPdfTempdoc.fulfilled]: (state, action) => {
      if (state.printLoading && state.printLoadReqId === action.meta.requestId) {
        state.printLoading = false
        state.printLoadReqId = undefined
      }
      if (action.payload) {
      }
    },
    [printPdfTempdoc.rejected]: (state, action) => {
      if (state.printLoading) {
        state.printLoading = false
        state.printLoadReqId = action.meta.requestId
      }
    },
  },
})

export { pdfDownloadTempdoc, updateTempdoc, findTempdoc, createTempdoc, printPdfTempdoc }
export default tempdocSlice.reducer
