import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/searches`

const initialState = {
  reports: [],
  totalReport: null,
  searchReport: null,
  findingSearchReport: false,
  findSearchReqId: undefined,
}

const findSearchReport = createAsyncThunk('reports/findSearchReport', async (field, thunkAPI) => {
  const { findSearchReqId, findingSearchReport } = thunkAPI.getState().report
  if (!findingSearchReport || thunkAPI.requestId !== findSearchReqId) {
    return
  }
  try {
    const res = await api().post(`${ApiUrl}`, field)
    console.log(res.data)
    // return thunkAPI.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunkAPI.rejectWithValue(err.response.data)
  }
})

const clearReportRecords = createAsyncThunk(
  'reports/clearReportRecords',
  async (field, thunkAPI) => {
    return thunkAPI.rejectWithValue([])
  },
)

export const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers: {
    [findSearchReport.pending]: (state, action) => {
      if (!state.findingSearchReport) {
        state.findingSearchReport = true
        state.findSearchReqId = action.meta.requestId
      }
    },
    [findSearchReport.fulfilled]: (state, action) => {
      if (state.findingSearchReport && state.findSearchReqId === action.meta.requestId) {
        state.findingSearchReport = false
        state.findSearchReqId = undefined
      }
      if (action.payload) {
        state.reports = action.payload.filterd
        state.totalReport = action.payload.total
      }
    },
    [findSearchReport.rejected]: (state, action) => {
      if (state.findingSearchReport) {
        state.findingSearchReport = false
        state.findSearchReqId = action.meta.requestId
      }
    },
    [clearReportRecords.rejected]: (state, action) => {
      if (action.payload) {
        state.reports = []
        state.totalReport = []
      }
    },
  },
})

export { findSearchReport, clearReportRecords }
export default reportSlice.reducer
