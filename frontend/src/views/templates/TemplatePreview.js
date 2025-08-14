import React, { useState, useMemo, useEffect } from 'react'
import Cookies from 'js-cookie'
import { isNull, isUndefined } from 'lodash'
import { useLocation, useParams } from 'react-router-dom'
import api from 'src/config/api'
import { CreditNote, InvoiceDefaultTemplate } from './invoices'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCompanyOrganization } from 'src/redux/slices/systemSlice'
import { PaymentReceipt } from './findocs'

const TemplatePreview = () => {
  const dispatch = useDispatch()

  const { tempId, template } = useParams()
  const [tempData, setTempData] = useState(null)
  const { authUser } = useSelector((state) => state.auth)

  const useQuery = () => {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
  }

  let query = useQuery()

  useEffect(() => {
    async function fetchTempData() {
      try {
        const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
        const ApiUrl = `/v1/adminapi/orgs/${utxId}/${template}`
        const res = await api().get(`${ApiUrl}/${tempId}`)
        if (res.data) {
          setTempData(res.data)
        }
      } catch (err) {
        if (!err.response) {
          throw err
        }
      }
    }
    //
    if (authUser) {
      dispatch(fetchCompanyOrganization(authUser.uuid))
    }

    fetchTempData()
  }, [tempId, authUser, template, dispatch])

  if (isNull(authUser)) return null

  switch (query.get('template_id')) {
    case '8712':
      return <CreditNote invoiceData={tempData} id="8712" />

    case '4417':
      return <InvoiceDefaultTemplate invoiceData={tempData} id="4417" />

    case '3454':
      return <PaymentReceipt findocData={tempData} id="3454" />

    default:
      return null
  }
}

export default TemplatePreview
