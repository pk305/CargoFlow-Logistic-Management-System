import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/company`

const initialState = {
  sidebarShow: true,
  sidebarUnfoldable: true,
  fetchCompReqId: undefined,
  fetchingCompOrganization: false,
  uploadLogoCompReqId: undefined,
  uploadingLogo: false,
  company: null,
  logoData: null,
}

const fetchCompanyOrganization = createAsyncThunk(
  'system/fetchCompanyOrganization',
  async (field, thunkAPI) => {
    const { fetchCompReqId, fetchingCompOrganization } = thunkAPI.getState().system
    if (!fetchingCompOrganization || thunkAPI.requestId !== fetchCompReqId) {
      return
    }
    try {
      const res = await api().post(`${ApiUrl}/org`, { field })
      return thunkAPI.fulfillWithValue(res.data)
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  },
)

const fetchCompanyLogoDataUrl = createAsyncThunk(
  'system/fetchCompanyLogoDataUrl',
  async (_, thunkAPI) => {
    try {
      const res = await api().get(`${ApiUrl}/logo_dataurl`)
      return thunkAPI.fulfillWithValue(res.data)
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  },
)

export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    toggleBarsButton: (state, action) => {
      switch (action.payload.type) {
        case 'setSideBarShow':
          state.sidebarShow = action.payload.sidebarShow
          return state

        case 'setSidebarUnfoldable':
          state.sidebarUnfoldable = action.payload.sidebarUnfoldable
          return state

        default:
          return state
      }
    },
  },
  extraReducers: {
    [fetchCompanyOrganization.pending]: (state, action) => {
      if (!state.fetchingCompOrganization) {
        state.fetchingCompOrganization = true
        state.fetchCompReqId = action.meta.requestId
      }
    },
    [fetchCompanyOrganization.fulfilled]: (state, action) => {
      if (state.fetchingCompOrganization && state.fetchCompReqId === action.meta.requestId) {
        state.fetchingCompOrganization = false
        state.fetchCompReqId = undefined
      }
      if (action.payload) {
        state.company = action.payload
      }
    },
    [fetchCompanyOrganization.rejected]: (state, action) => {
      if (state.fetchingCompOrganization) {
        state.fetchingCompOrganization = false
        state.fetchCompReqId = action.meta.requestId
      }
    },

    [fetchCompanyLogoDataUrl.fulfilled]: (state, action) => {
      if (action.payload) {
        state.logoData = action.payload
      }
    },
  },
})

export { fetchCompanyOrganization, fetchCompanyLogoDataUrl }
export const { toggleBarsButton } = systemSlice.actions
export default systemSlice.reducer
