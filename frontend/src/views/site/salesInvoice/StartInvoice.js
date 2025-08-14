import React, { useState, useEffect, useCallback } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CFormCheck,
  CFormFeedback,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
} from '@coreui/react'
import { AppBreadcrumb } from 'src/components'
import Cookies from 'js-cookie'
import { isEmpty, isNull, isUndefined } from 'lodash'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { findCompany } from 'src/redux/slices/companySlice'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { clearInvoiceError, createInvoice, showInvoiceError } from 'src/redux/slices/invoiceSlice'
import Select from 'react-select'
import classNames from 'classnames'
import $ from 'jquery'
import { nanoid } from 'nanoid'
import { fetchFinitems } from 'src/redux/slices/finitemSlice'
import { fetchProfitCenters } from 'src/redux/slices/profitCenterSlice'
import { fetchTaxcodes } from 'src/redux/slices/taxcodeSlice'
import { fetchCurrencies } from 'src/redux/slices/currencySlice'
import SlidingPane from 'react-sliding-pane'
import NewIBAN from '../purchaseInvoice/panels/NewIBAN'
import { fetchUsers } from 'src/redux/slices/userSlice'
import { fetchBranches } from 'src/redux/slices/branchSlice'
import Noty from 'noty'
import { formatMoney } from 'src/config/helpers'

const StartInvoice = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { authUser } = useSelector((state) => state.auth)
  const [breadcrumbList] = useState([
    { name: 'Sales Invoices', pathname: '/financor/debit' },
    { name: 'Purchase Invoices', pathname: '/financor/credit' },
    { name: 'Cash Transactions', pathname: '/financor/cash_trans' },
    { name: 'Bank Transactions', pathname: '/financor/bank_trans' },
    { name: 'Driver Transactions', pathname: '/financor/driver_trans' },
    { name: 'Ledger Entries', pathname: '/gldocs' },
    { name: 'Reports', pathname: '/reports/home?group_type=financor' },
  ])
  const { findingCompany, showCompany } = useSelector((state) => state.company)
  const [invoiceData, setInvoiceData] = useState({
    invoiceName: '',
    dueDate: `${moment().format('YYYY-MM-DD HH:mm:ss')}`,
    invoiceDate: `${moment().format('YYYY-MM-DD HH:mm:ss')}`,
    invoiceCurr: '',
    branchId: `${authUser && authUser.branch && authUser.branch.id}`,
    workType: 'sales_invoice',
    operationId: `${authUser && authUser.operation && authUser.operation.id}`,
    profitCenterId: '',
    invoiceAddress: '',
    invoiceCurrRate: '1',
    notes: '',
    placeId: '',
    companyId: null,
    accountType: '',
    accountId: '',
    salerId: '',
    checkInvoiceItems: false,
  })
  const [defaultCurrency, setDefaultCurrency] = useState(null)
  const [disabledFields, setDisbledFields] = useState([])
  const [invoiceUseAccount, setInvoiceUseAccount] = useState(false)
  const [invoiceDate, setInvoiceDate] = useState(new Date())
  const [dueDate, setDueDate] = useState(new Date())
  const { invoiceErrors, creatingInvoice } = useSelector((state) => state.invoice)
  const { currencies, fetchingCurrencies } = useSelector((state) => state.currency)
  // const [setCalloutInfo] = useState(true)
  const [invoiceItems, setInvoiceItems] = useState([
    {
      id: nanoid(10),
      finItemId: '',
      invProfitCenterId: '',
      lineName: '',
      unitNumber: '1.0',
      unitPrice: '0.0',
      vatId: '',
      vatCalculate: 0,
      withoutVat: 0,
      lineTotal: '0.0',
      totalInvoice: '0.00',
      notes: '',
      currRate: '1.0',
      debitCredit: 'debit',
      unitType: 'number',
      curr: '',
      isTaxed: 0,
      ledgerAccountId: '',
    },
    {
      id: nanoid(10),
      finItemId: '',
      invProfitCenterId: '',
      lineName: '',
      unitNumber: '1.0',
      unitPrice: '0.0',
      vatId: '',
      vatCalculate: 0,
      withoutVat: 0,
      lineTotal: '0.0',
      totalInvoice: '0.00',
      notes: '',
      currRate: '1.0',
      debitCredit: 'debit',
      unitType: 'number',
      curr: '',
      isTaxed: 0,
      ledgerAccountId: '',
    },
    {
      id: nanoid(10),
      finItemId: '',
      invProfitCenterId: '',
      lineName: '',
      unitNumber: '1.0',
      unitPrice: '0.0',
      vatId: '',
      vatCalculate: 0,
      withoutVat: 0,
      lineTotal: '0.0',
      totalInvoice: '0.00',
      notes: '',
      currRate: '1.0',
      debitCredit: 'debit',
      unitType: 'number',
      curr: '',
      isTaxed: 0,
      ledgerAccountId: '',
    },
  ])
  const [addIbanPanel, setAddIbanPanel] = useState(false)
  const [totalResults, setTotalResults] = useState({
    subTotal: '0.00',
    vatTotal: '0.00',
    netTotal: '0.00',
  })
  const [invoiceType, setInvoiceType] = useState('debit')
  const [showAccountPay, setShowAccountPay] = useState(false)
  const { ledgers, fetchingLedgers } = useSelector((state) => state.ledger)
  const { finitems, fetchingFinitems } = useSelector((state) => state.finitem)
  const { profitCenters, fetchingProfitCenters } = useSelector((state) => state.profitCenter)
  const { taxcodes, fetchingTaxcodes } = useSelector((state) => state.taxcode)
  const [showIbans, setShowIbans] = useState([])
  const { users, fetchingUsers } = useSelector((state) => state.user)
  const { fetchingOperations, operations } = useSelector((state) => state.operation)
  const { branches, fetchingBranches } = useSelector((state) => state.branch)
  const [addressChange, setAddressChange] = useState(false)

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setInvoiceData({
      ...invoiceData,
      [name]: value,
    })
  }

  const handleAddressChange = (e) => {
    const { checked } = e.target
    if (checked) {
      setAddressChange(true)
    } else {
      setAddressChange(false)
    }
  }

  const removeInvItem = (e, item) => {
    e.preventDefault()
    $(`.remove-doc-line_${item.id}`).css('display', 'none')
    $(`.recover-doc-line_${item.id}`).css('display', 'block')

    setDisbledFields([...disabledFields, { id: item.id }])
    $(`.errId_${item.id} .cstSelect__single-value`).html('')
    setInvoiceItems((state) =>
      state.map((x) =>
        x.id === item.id
          ? {
              ...x,
              finItemId: '',
              lineName: '',
              ledgerAccountId: '',
            }
          : x,
      ),
    )
  }

  const recoverInvItem = (e, item) => {
    e.preventDefault()
    $(`.remove-doc-line_${item.id}`).css('display', 'block')
    $(`.recover-doc-line_${item.id}`).css('display', 'none')
    const items = disabledFields.filter((x) => x.id !== item.id)
    setDisbledFields(items)
  }

  const handleDateTime = (c, date) => {
    if (c === 'invoiceDate') {
      setInvoiceDate(date)
    } else if (c === 'dueDate') {
      setDueDate(date)
    }
    const e = {
      target: {
        name: c,
        value: !isNull(date) ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '',
      },
    }
    handleChangeForm(e)
  }

  const handleSelectForm = (c, val) => {
    if (c === 'invoiceCurr') {
      setDefaultCurrency(
        val
          ? {
              label: val.label,
              value: val.id,
            }
          : null,
      )
    }

    const e = { target: { name: c, value: !isNull(val) ? val.value : '' } }
    handleChangeForm(e)
  }

  const detailClose = (e, item) => {
    e.preventDefault()
    $(`#dropmenu-${item.id}`).removeClass('show')
  }

  const handleSelectInvoice = (c, val, itemId) => {
    if (c === 'finItemId') {
      $(`#lineName_${itemId}`).val(!isNull(val) ? val.label : '')
      setInvoiceItems((state) =>
        state.map((x) =>
          x.id === itemId
            ? {
                ...x,
                lineName: !isNull(val) ? val.label : '',
              }
            : x,
        ),
      )
    }

    setInvoiceItems((state) =>
      state.map((x) =>
        x.id === itemId
          ? {
              ...x,
              [c]: !isNull(val) ? val.value : '',
            }
          : x,
      ),
    )
    setInvoiceData({ ...invoiceData, checkInvoiceItems: true })
  }

  const handleSelectFocus = (c, d) => {
    if (d) {
      handleInvoiceFocusErr(d)
    } else {
      dispatch(clearInvoiceError({ type: c, errorType: 'errInvoice' }))
    }

    if (c === 'finItemId') {
      if (isEmpty(finitems)) {
        dispatch(fetchFinitems())
      }
    } else if (c === 'profitCenterId' || c === 'invProfitCenterId') {
      if (isEmpty(profitCenters)) {
        dispatch(fetchProfitCenters())
      }
    } else if (c === 'vatId') {
      if (isEmpty(taxcodes)) {
        dispatch(fetchTaxcodes())
      }
    } else if (c === 'invoiceCurr' || c === 'curr') {
      if (isEmpty(currencies)) {
        dispatch(fetchCurrencies())
      }
    } else if (c === 'salerId') {
      if (isEmpty(users)) {
        dispatch(fetchUsers())
      }
    } else if (c === 'branchId') {
      if (isEmpty(branches)) {
        dispatch(fetchBranches())
      }
    } else if (c === 'ledgerAccountId') {
      if (isEmpty(branches)) {
        dispatch(fetchBranches())
      }
    }
  }

  const handleInvoiceChange = (e, item) => {
    const { name, value } = e.target
    setInvoiceItems((state) =>
      state.map((x) =>
        x.id === item.id
          ? {
              ...x,
              [name]: value,
            }
          : x,
      ),
    )

    setInvoiceData({ ...invoiceData, checkInvoiceItems: true })
    if (name === 'vatId') {
      let n = parseFloat(item.lineTotal),
        i = parseFloat(item.unitNumber),
        r = parseFloat(item.unitPrice),
        v = parseFloat(i * r),
        d = parseFloat(invoiceData.invoiceCurrRate),
        j = 0,
        f = n,
        o = $(`#vatId_${item.id} option:selected`).attr('data-rate') || 0
      void 0 === o && (o = 0)

      n = (v * (parseFloat(o) / 100 + 1)).toFixed(2)
      f = d > 0 ? (parseFloat(n) / d).toFixed(2) : n
      j =
        d > 0
          ? ((v * (parseFloat(o) / 100)) / d).toFixed(2)
          : (v * (parseFloat(o) / 100)).toFixed(2)
      v = d > 0 ? parseFloat(v / d).toFixed(2) : v.toFixed(2)

      setInvoiceItems((state) =>
        state.map((x) =>
          x.id === item.id
            ? {
                ...x,
                unitNumber: i,
                lineTotal: n,
                unitPrice: r,
                vatCalculate: j,
                withoutVat: v,
                totalInvoice: f,
              }
            : x,
        ),
      )
    }
  }

  const handleInvoiceKeyUp = (e, item) => {
    const { name, value } = e.target
    setInvoiceItems((state) =>
      state.map((x) =>
        x.id === item.id
          ? {
              ...x,
              [name]: value,
            }
          : x,
      ),
    )

    switch (name) {
      case 'unitNumber':
        return calcUnitNumber(item, value)

      case 'unitPrice':
        return calcUnitPrice(item, value)

      case 'lineTotal':
        return calcLineTotal(item, value)

      default:
        return
    }
  }

  const calcUnitNumber = (item, value) => {
    let n = parseFloat(item.lineTotal),
      i = parseFloat(value),
      r = parseFloat(item.unitPrice),
      d = parseFloat(invoiceData.invoiceCurrRate),
      j = 0,
      v = parseFloat(i * r),
      o = parseFloat($(`#vatId_${item.id} option:selected`).attr('data-rate')) || 0
    void 0 === parseFloat($(`#vatId_${item.id} option:selected`).attr('data-rate')) && (o = 0)

    let c = i || 1,
      f = n,
      s = (r || 1) * c * (parseFloat(o) / 100 + 1)

    n = s.toFixed(2)
    f = d > 0 ? (s / d).toFixed(2) : n
    j =
      d > 0 ? ((v * (parseFloat(o) / 100)) / d).toFixed(2) : (v * (parseFloat(o) / 100)).toFixed(2)
    v = d > 0 ? parseFloat(v / d).toFixed(2) : v.toFixed(2)

    setInvoiceItems((state) =>
      state.map((x) =>
        x.id === item.id
          ? {
              ...x,
              unitNumber: i,
              lineTotal: n,
              unitPrice: r,
              vatCalculate: j,
              withoutVat: v,
              totalInvoice: f,
            }
          : x,
      ),
    )
  }

  const calcUnitPrice = (item, value) => {
    let n = parseFloat(item.lineTotal),
      i = parseFloat(value),
      r = parseFloat(item.unitNumber),
      v = parseFloat(i * r),
      j = 0,
      d = parseFloat(invoiceData.invoiceCurrRate)

    n = v.toFixed(2)
    let o = parseFloat($(`#vatId_${item.id} option:selected`).attr('data-rate')) || 0,
      f = n
    void 0 === o && (o = 0)

    n = (parseFloat(n) * (parseFloat(o) / 100 + 1)).toFixed(2)
    f = d > 0 ? (n / d).toFixed(2) : n
    j =
      d > 0 ? ((v * (parseFloat(o) / 100)) / d).toFixed(2) : (v * (parseFloat(o) / 100)).toFixed(2)
    v = d > 0 ? parseFloat(v / d).toFixed(2) : v.toFixed(2)

    setInvoiceItems((state) =>
      state.map((x) =>
        x.id === item.id
          ? {
              ...x,
              unitNumber: r,
              lineTotal: n,
              unitPrice: i,
              vatCalculate: j,
              withoutVat: v,
              totalInvoice: f,
            }
          : x,
      ),
    )
  }

  const calcLineTotal = (item, value) => {
    let n = parseFloat(item.unitNumber),
      i = parseFloat(item.unitPrice),
      d = parseFloat(invoiceData.invoiceCurrRate),
      r = parseFloat($(`#vatId_${item.id} option:selected`).attr('data-rate')) || 0,
      o = n || 1,
      j = 0,
      c = parseFloat(value),
      s = c,
      v = parseFloat(i * r),
      f = c.toFixed(2)

    if (((r > 0 && (c /= r / 100 + 1), (i = (c / o).toFixed(2))), s !== c)) {
      setInvoiceItems((state) =>
        state.map((x) =>
          x.id === item.id
            ? {
                ...x,
                isTaxed: 1,
              }
            : x,
        ),
      )
    }

    f = d > 0 ? (parseFloat(f) / d).toFixed(2) : f
    j =
      d > 0 ? ((v * (parseFloat(o) / 100)) / d).toFixed(2) : (v * (parseFloat(o) / 100)).toFixed(2)
    v = d > 0 ? parseFloat(v / d).toFixed(2) : v.toFixed(2)

    setInvoiceItems((state) =>
      state.map((x) =>
        x.id === item.id
          ? {
              ...x,
              unitPrice: i,
              vatCalculate: j,
              withoutVat: v,
              totalInvoice: f,
            }
          : x,
      ),
    )
  }

  const totalCurrRate = () => {
    let d = invoiceData.invoiceCurrRate
    setInvoiceItems((state) =>
      state.map((x) => {
        let t =
            parseFloat(d) > 0 ? parseFloat(x.lineTotal) / parseFloat(d) : parseFloat(x.lineTotal),
          o = parseFloat($(`#vatId_${x.id} option:selected`).attr('data-rate')) || 0,
          v =
            parseFloat(d) > 0
              ? parseFloat((x.unitNumber * x.unitPrice) / d)
              : parseFloat(x.unitNumber * x.unitPrice),
          j =
            parseFloat(d) > 0
              ? (parseFloat(x.unitNumber * x.unitPrice) * (parseFloat(o) / 100)) / parseFloat(d)
              : parseFloat(x.unitNumber * x.unitPrice) * (parseFloat(o) / 100)

        return {
          ...x,
          vatCalculate: j.toFixed(2),
          withoutVat: v.toFixed(2),
          totalInvoice: t.toFixed(2),
        }
      }),
    )
  }

  const handleInvoiceBlur = () => {
    let vatSum = [0]
    let totalSum = [0]
    let subTotalSum = [0]

    if (invoiceItems.length > 0) {
      for (let i = 0; i < invoiceItems.length; i++) {
        const v = invoiceItems[i]
        vatSum.push(parseFloat(v.vatCalculate))
        totalSum.push(parseFloat(v.totalInvoice))
        subTotalSum.push(parseFloat(v.withoutVat))
      }
    }

    const vatTotal = vatSum.reduce((a, b) => a + b, 0).toFixed(2)
    const subTotal = subTotalSum.reduce((a, b) => a + b, 0).toFixed(2)
    const netTotal = totalSum.reduce((a, b) => a + b, 0).toFixed(2)

    setTotalResults({ vatTotal, netTotal, subTotal })
  }

  const addInvoiceLines = (e) => {
    e.preventDefault()
    setInvoiceItems((state) => [
      ...state,
      {
        id: nanoid(10),
        finItemId: '',
        invProfitCenterId: '',
        lineName: '',
        unitNumber: '1.0',
        unitPrice: '0.0',
        vatId: '',
        vatCalculate: 0,
        withoutVat: 0,
        lineTotal: '0.0',
        totalInvoice: '0.00',
        notes: '',
        currRate: '1.0',
        debitCredit: 'debit',
        unitType: 'number',
        curr: '',
        isTaxed: 0,
        ledgerAccountId: '',
      },
    ])
  }

  const handleSubmitInvoice = async (e) => {
    e.preventDefault()
    const form = $('#new_invoice')
    if (form.length > 0) {
      const bd = 'html, body'
      if (invoiceData.invoiceCurr === '') {
        dispatch(showInvoiceError({ type: 'invoiceCurr', errorType: 'errInvoice' }))
        $(bd).animate({ scrollTop: 0 }, 300)
        return false
      }
    }
    //form data
    let arrForm = Object.entries(invoiceData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }
    formData.append('invoiceType', invoiceType)
    formData.append('invoiceItems', JSON.stringify(invoiceItems))
    formData.append('totalResults', JSON.stringify(totalResults))

    const resData = await dispatch(createInvoice(formData)).unwrap()
    if (resData) {
      clearInvoiceData()
      new Noty({
        type: 'alert',
        layout: 'topRight',
        id: `succItem${resData.id}`,
        text: 'Invoice has been created succesfully',
      }).show()
      history.push(`/invoices/${resData.linkId}`)
    }
    // $('html, body').animate({ scrollTop: 0 }, 300)
  }

  const clearInvoiceData = () => {
    Cookies.remove('ss')
    setInvoiceData({
      invoiceName: '',
      dueDate: `${moment().format('YYYY-MM-DD HH:mm:ss')}`,
      invoiceDate: `${moment().format('YYYY-MM-DD HH:mm:ss')}`,
      invoiceCurr: '',
      branchId: `${authUser && authUser.branch && authUser.branch.id}`,
      workType: 'sales_invoice',
      operationId: `${authUser && authUser.operation && authUser.operation.id}`,
      profitCenterId: '',
      invoiceAddress: '',
      invoiceCurrRate: '1',
      notes: '',
      salerId: '',
      placeId: '',
      companyId: null,
      checkInvoiceItems: false,
    })
  }

  const handleInvoiceFocusErr = (Id) => {
    let itm = $(`.errId_${Id}`)
    itm.removeClass('is-invalid')
  }

  const handleAccToggle = (e) => {
    e.preventDefault()
    setShowAccountPay(!showAccountPay)
  }

  const handleClickIban = (e) => {
    e.preventDefault()
    setAddIbanPanel(true)
  }

  const checkCompanyInvoice = useCallback(async () => {
    const ssId = Cookies.get('ss')
    if (!isUndefined(ssId)) {
      if (ssId) {
        const data = JSON.parse(ssId)
        const resData = await dispatch(findCompany(data.ssId)).unwrap()
        if (resData) {
          if (resData.financial) {
            if (resData.financial.currency) {
              setDefaultCurrency({
                label: resData.financial.currency.name,
                value: resData.financial.currency.id,
              })
            }
          }

          // console.log(resData.financial)
          setInvoiceData((state) => ({
            ...state,
            invoiceAddress: resData.address,
            companyId: resData.id,
            invoiceCurr:
              resData.financial && resData.financial.currency ? resData.financial.currency.id : '',
          }))
          setShowIbans(resData.ibans)
        }

        setInvoiceUseAccount(data.inv)
        setInvoiceType(data.invoiceType)
        setInvoiceData((state) => ({
          ...state,
          workType: data.invoiceType === 'credit' ? 'bill' : 'sales_invoice',
        }))
      }
    } else {
      history.push('/financor/debit/new')
    }
  }, [history, dispatch])

  const closeIbanPanel = () => {
    setAddIbanPanel(false)
  }

  useEffect(() => {
    checkCompanyInvoice()
    //
    return () => Cookies.remove('ss')
  }, [checkCompanyInvoice])

  if (findingCompany) return null

  return (
    <div>
      <div className="cstContainerDef">
        <AppBreadcrumb items={breadcrumbList} />
      </div>
      <div className="pageContainer newBookings">
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <CCard className="cardCustom">
            <form id="new_invoice" onSubmit={(e) => handleSubmitInvoice(e)}>
              <CCardBody className="p-0">
                <div className="pageContainer-wrapper">
                  <div className="pageBoxSizing-container">
                    {/* {errorCalloutText !== '' ? (
                      <CCallout
                        color="danger"
                        className={classNames(
                          'bg-white  cstCalloutInfo animate__animated animate__fadeIn ',
                          {
                            'animate__animated animate__fadeOut hide': !calloutInfo,
                          },
                        )}
                      >
                        <div>
                          <span className="mr-2 text-danger">{errorCalloutText}</span>
                        </div>
                        <div></div>
                      </CCallout>
                    ) : null} */}

                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <span className="badge badge-warning mb-3">
                          <i className="fas fa-exclamation-circle"></i>
                        </span>
                        <h3 className="invcTitle">{showCompany.name}</h3>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group invoice_name">
                          <label className="control-label" htmlFor="invoice_name">
                            Invoice No
                          </label>
                          <CFormInput
                            className="form-control-cst"
                            type="text"
                            name="invoiceName"
                            id="invoice_name"
                            onChange={(e) => handleChangeForm(e)}
                            value={invoiceData.invoiceName}
                            invalid={
                              invoiceErrors && !isEmpty(invoiceErrors.invoiceName) ? true : false
                            }
                            onFocus={() =>
                              dispatch(
                                clearInvoiceError({
                                  type: 'invoiceName',
                                  errorType: 'errInvoice',
                                }),
                              )
                            }
                          />
                          <CFormFeedback invalid className="fieldError-cst">
                            {invoiceErrors.invoiceName}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group date_picker invoice_invoice_date">
                          <label
                            className="control-label date_picker"
                            htmlFor="invoice_invoice_date"
                          >
                            Date
                          </label>
                          <DatePicker
                            selected={invoiceDate}
                            onChange={(date) => handleDateTime('invoiceDate', date)}
                            className="form-control form-control-cst"
                            style={{ paddingLeft: '2px', paddingRight: '2px' }}
                            dateFormat="MMMM d, yyyy h:mm"
                          />
                          <CFormFeedback
                            invalid={
                              invoiceErrors && !isEmpty(invoiceErrors.invoiceDate) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {invoiceErrors.invoiceDate}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group date_picker invoice_due_date">
                          <label className="control-label date_picker" htmlFor="invoice_due_date">
                            Due date
                          </label>
                          <DatePicker
                            selected={dueDate}
                            onChange={(date) => handleDateTime('dueDate', date)}
                            className="form-control form-control-cst"
                            style={{ paddingLeft: '2px', paddingRight: '2px' }}
                            dateFormat="MMMM d, yyyy h:mm"
                          />
                          <CFormFeedback
                            invalid={
                              invoiceErrors && !isEmpty(invoiceErrors.dueDate) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {invoiceErrors.dueDate}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group select invoice_curr">
                              <label className="control-label select" htmlFor="invoice_curr">
                                Currency
                              </label>
                              <div className="input-group">
                                <Select
                                  className={classNames(
                                    'form-control form-control-cst pageCstSelect ',
                                    {
                                      'is-invalid':
                                        invoiceErrors && !isEmpty(invoiceErrors.invoiceCurr),
                                    },
                                  )}
                                  classNamePrefix="cstSelect"
                                  isClearable
                                  placeholder
                                  isSearchable
                                  id="invoice_curr"
                                  menuPlacement="auto"
                                  value={defaultCurrency}
                                  options={
                                    currencies && currencies.length > 0
                                      ? currencies.map((item) => ({
                                          value: item.id,
                                          label: item.name,
                                        }))
                                      : []
                                  }
                                  noOptionsMessage={() => 'No results found'}
                                  isLoading={fetchingCurrencies ? true : false}
                                  onChange={(e) => handleSelectForm('invoiceCurr', e)}
                                  onMenuOpen={() => handleSelectFocus('invoiceCurr')}
                                />
                                <CFormFeedback
                                  invalid={
                                    invoiceErrors && !isEmpty(invoiceErrors.invoiceCurr)
                                      ? true
                                      : false
                                  }
                                  className="fieldError-cst"
                                >
                                  {invoiceErrors.invoiceCurr}
                                </CFormFeedback>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group invoice_curr_rate">
                              <label className="control-label" htmlFor="invoice_curr_rate">
                                Exch.Rate
                              </label>
                              <CFormInput
                                className="form-control-cst numeric doc-curr-rate"
                                style={{ textAlign: 'right' }}
                                type="number"
                                step="any"
                                name="invoiceCurrRate"
                                id="invoice_curr_rate"
                                onChange={(e) => handleChangeForm(e)}
                                onKeyUp={(e) => totalCurrRate()}
                                onBlur={() => handleInvoiceBlur()}
                                value={invoiceData.invoiceCurrRate}
                                invalid={
                                  invoiceErrors && !isEmpty(invoiceErrors.invoiceCurrRate)
                                    ? true
                                    : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearInvoiceError({
                                      type: 'invoiceCurrRate',
                                      errorType: 'errInvoice',
                                    }),
                                  )
                                }
                              />
                              <CFormFeedback invalid className="fieldError-cst">
                                {invoiceErrors.invoiceCurrRate}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group select invoice_branch_id">
                              <label className="control-label select" htmlFor="invoice_branch_id">
                                Branch
                              </label>
                              <div className="input-group">
                                <Select
                                  id="invoice_branch_id"
                                  classNamePrefix="cstSelect"
                                  isClearable={true}
                                  placeholder
                                  isLoading={fetchingBranches ? true : false}
                                  defaultValue={{
                                    label: `${authUser && authUser.branch && authUser.branch.name}`,
                                    value: `${authUser && authUser.branch && authUser.branch.id}`,
                                  }}
                                  isSearchable
                                  name="branchId"
                                  autoFocus={false}
                                  options={
                                    branches && !fetchingBranches && branches.length > 0
                                      ? branches.map((itm) => ({
                                          label: itm.name,
                                          value: itm.id,
                                        }))
                                      : []
                                  }
                                  className={classNames(
                                    'form-control form-control-cst pageCstSelect ',
                                    {
                                      'is-invalid':
                                        invoiceErrors && !isEmpty(invoiceErrors.branchId),
                                    },
                                  )}
                                  noOptionsMessage={() => 'No results found'}
                                  onChange={(e) => handleSelectForm('branchId', e)}
                                  onMenuOpen={() => handleSelectFocus('branchId')}
                                />
                                <CFormFeedback
                                  invalid={
                                    invoiceErrors && !isEmpty(invoiceErrors.branchId) ? true : false
                                  }
                                  className="fieldError-cst"
                                >
                                  {invoiceErrors.branchId}
                                </CFormFeedback>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group select invoice_work_type">
                              <label className="control-label select" htmlFor="invoice_work_type">
                                Invoice Type
                              </label>
                              {invoiceType === 'credit' ? (
                                <CFormSelect
                                  className="form-control-cst select"
                                  name="workType"
                                  id="invoice_work_type"
                                  onChange={(e) => handleChangeForm(e)}
                                  value={invoiceData.workType}
                                  invalid={
                                    invoiceErrors && !isEmpty(invoiceErrors.workType) ? true : false
                                  }
                                  onFocus={() =>
                                    dispatch(
                                      clearInvoiceError({
                                        type: 'workType',
                                        errorType: 'errInvoice',
                                      }),
                                    )
                                  }
                                >
                                  <option value="bill">BILL</option>
                                  <option value="credit_note">CREDIT NOTE</option>
                                  <option value="vat_invoice">VAT INVOICE</option>
                                </CFormSelect>
                              ) : (
                                <CFormSelect
                                  className="form-control-cst select"
                                  name="workType"
                                  id="invoice_work_type"
                                  onChange={(e) => handleChangeForm(e)}
                                  value={invoiceData.workType}
                                  invalid={
                                    invoiceErrors && !isEmpty(invoiceErrors.workType) ? true : false
                                  }
                                  onFocus={() =>
                                    dispatch(
                                      clearInvoiceError({
                                        type: 'workType',
                                        errorType: 'errInvoice',
                                      }),
                                    )
                                  }
                                >
                                  <option value="sales_invoice">SALES INVOICE</option>
                                  <option value="credit_note">CREDIT NOTE</option>
                                  <option value="vat_invoice">VAT INVOICE</option>
                                </CFormSelect>
                              )}
                              <CFormFeedback
                                invalid={
                                  invoiceErrors && !isEmpty(invoiceErrors.workType) ? true : false
                                }
                                className="fieldError-cst"
                              >
                                {invoiceErrors.workType}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <div className="d-flex justify-content-between">
                          <div>
                            <label className="text" htmlFor="invoice_invoice_address">
                              Invoice Addresses
                            </label>
                          </div>
                          <div>
                            <span className="float-left">
                              <CFormCheck
                                className="form-control-cst"
                                id="address_change"
                                type="checkbox"
                                onChange={(e) => handleAddressChange(e)}
                              />
                            </span>
                            <span className="float-left ml-2">
                              <label>Use Different Address</label>
                            </span>
                          </div>
                        </div>
                        <div
                          id="invoice_address_input"
                          style={{ display: addressChange && 'none' }}
                        >
                          <div className="form-group text invoice_invoice_address">
                            <CFormTextarea
                              className="form-control-cst text"
                              rows="4"
                              disabled="disabled"
                              name="invoiceAddress"
                              id="invoice_invoice_address"
                              onChange={(e) => handleChangeForm(e)}
                              value={invoiceData.invoiceAddress}
                              style={{ width: '100%' }}
                            ></CFormTextarea>
                          </div>
                        </div>
                        <div
                          id="invoice_address_place_input"
                          style={{ display: !addressChange && 'none' }}
                        >
                          <div className="form-group select invoice_place_id">
                            <CFormSelect
                              className="form-control-cst select "
                              data-plugin="select2"
                              name="placeId"
                              id="invoice_place_id"
                              data-select2-id="invoice_place_id"
                              value={invoiceData.placeId}
                              onChange={(e) => handleChangeForm(e)}
                            >
                              <option value="" data-select2-id="2"></option>
                            </CFormSelect>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <div className="form-group text invoice_notes">
                          <label className="control-label text" htmlFor="invoice_notes">
                            Notes
                          </label>
                          <CFormTextarea
                            className="form-control-cst"
                            rows="4"
                            name="notes"
                            id="invoice_notes"
                            value={invoiceData.notes}
                            style={{ width: '100%' }}
                            onChange={(e) => handleChangeForm(e)}
                            onFocus={() => handleSelectFocus('notes')}
                            invalid={invoiceErrors && !isEmpty(invoiceErrors.notes) ? true : false}
                          ></CFormTextarea>
                          <CFormFeedback
                            invalid={invoiceErrors && !isEmpty(invoiceErrors.notes) ? true : false}
                            className="fieldError-cst"
                          >
                            {invoiceErrors.notes}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group profit_center invoice_profit_center_id">
                              <label
                                className="control-label profit_center"
                                htmlFor="invoice_profit_center_id"
                              >
                                Profit Center
                              </label>
                              <div>
                                <div className="input-group">
                                  <Select
                                    className={classNames(
                                      'form-control form-control-cst pageCstSelect ',
                                      {
                                        'is-invalid':
                                          invoiceErrors && !isEmpty(invoiceErrors.profitCenterId),
                                      },
                                    )}
                                    classNamePrefix="cstSelect"
                                    isClearable
                                    placeholder
                                    isSearchable
                                    id="invoice_profit_center_id"
                                    menuPlacement="auto"
                                    options={
                                      profitCenters &&
                                      !fetchingProfitCenters &&
                                      profitCenters.length > 0
                                        ? profitCenters.map((item) => ({
                                            value: item.id,
                                            label: item.name,
                                          }))
                                        : []
                                    }
                                    noOptionsMessage={() => 'No results found'}
                                    isLoading={fetchingProfitCenters ? true : false}
                                    onChange={(e) => handleSelectForm('profitCenterId', e)}
                                    onMenuOpen={() => handleSelectFocus('profitCenterId')}
                                  />
                                  <CFormFeedback invalid className="fieldError-cst d-block">
                                    {invoiceErrors.profitCenterId}
                                  </CFormFeedback>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-group select invoice_operation_id">
                              <label
                                className="control-label select"
                                htmlFor="invoice_operation_id"
                              >
                                Operation
                              </label>
                              <CFormSelect
                                className={classNames('form-control-cst  operation-select', {
                                  'is-invalid':
                                    invoiceErrors && !isEmpty(invoiceErrors.operationId),
                                })}
                                name="operationId"
                                id="invoice_operation_id"
                                value={invoiceData.operationId}
                                onChange={(e) => handleChangeForm(e)}
                                onFocus={() => handleSelectFocus('operationId')}
                              >
                                <option value=""></option>
                                {!fetchingOperations ? (
                                  operations && operations.length > 0 ? (
                                    <>
                                      {operations.map((itm, i) => (
                                        <option key={i} value={itm.id} trans_method={itm.slug}>
                                          {itm.name}
                                        </option>
                                      ))}
                                    </>
                                  ) : (
                                    <>
                                      <option disabled>No results found.</option>
                                    </>
                                  )
                                ) : (
                                  <option>Loading...</option>
                                )}
                              </CFormSelect>
                              <CFormFeedback
                                invalid={
                                  invoiceErrors && !isEmpty(invoiceErrors.operationId)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {invoiceErrors.operationId}
                              </CFormFeedback>
                            </div>
                          </div>
                          <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-group select invoice_saler_id">
                              <label className="control-label select" htmlFor="invoice_saler_id">
                                Customer Rep.
                              </label>
                              <div className="input-group">
                                <Select
                                  className={classNames(
                                    'form-control form-control-cst pageCstSelect ',
                                  )}
                                  classNamePrefix="cstSelect"
                                  isClearable
                                  placeholder
                                  isSearchable
                                  id="invoice_saler_id"
                                  isLoading={fetchingUsers ? true : false}
                                  options={
                                    users && users.length > 0
                                      ? users.map((item) => ({
                                          value: item.uuid,
                                          label: item.name,
                                        }))
                                      : []
                                  }
                                  noOptionsMessage={() => 'No results found'}
                                  onChange={(e) => handleSelectForm('salerId', e)}
                                  onMenuOpen={() => handleSelectFocus('salerId')}
                                />
                                <CFormFeedback
                                  invalid={
                                    invoiceErrors && !isEmpty(invoiceErrors.salerId) ? true : false
                                  }
                                  className="fieldError-cst"
                                >
                                  {invoiceErrors.salerId}
                                </CFormFeedback>
                              </div>
                            </div>
                          </div>
                        </div>
                        {invoiceType === 'credit' && (
                          <>
                            {!showAccountPay && (
                              <>
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a
                                  href="#"
                                  className="toggle_and_hide_button"
                                  onClick={(e) => handleAccToggle(e)}
                                >
                                  If the invoice has been paid click here for payment account
                                  details
                                </a>
                              </>
                            )}
                            <div
                              className="row  "
                              id="invoice-payment-details"
                              style={{ display: !showAccountPay ? 'none' : '' }}
                              data-select2-id="invoice-payment-details"
                            >
                              <div className="col-12 col-sm-3 col-md-3 col-lg-4 col-xl-4">
                                <div className="form-group select optional invoice_account_type">
                                  <label
                                    className="control-label select optional"
                                    htmlFor="invoice_account_type"
                                  >
                                    Account Type
                                  </label>
                                  <div>
                                    <div className="input-group">
                                      <CFormSelect
                                        className="form-control-cst"
                                        name="accountType"
                                        id="invoice_account_type"
                                      >
                                        <option value="bank_account">Bank Account</option>
                                        <option value="cash_point">Cash Account</option>
                                        <option value="credit_card">Credit Card</option>
                                        <option value="employee">Employee</option>
                                        <option value="driver">Driver</option>
                                        <option value="company">Company</option>
                                        <option value="ledger_account">Ledger Account</option>
                                      </CFormSelect>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-sm-3 col-md-3 col-lg-8 col-xl-8">
                                <div className="form-group account optional invoice_account_id">
                                  <label
                                    className="control-label account optional"
                                    htmlFor="invoice_account_id"
                                  >
                                    Account
                                  </label>
                                  <div>
                                    <div className="input-group">
                                      <CFormSelect
                                        className="form-control-cst"
                                        name="invoice[account_id]"
                                        id="invoice_account_id"
                                      >
                                        <option value="" data-select2-id="84"></option>
                                      </CFormSelect>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <hr className="debit-hr"></hr>
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <div className="d-overflow">
                          <table className="table table-sm table-vertical-center table-borderless">
                            <thead>
                              <tr className="d-flex">
                                <th className="col-2">
                                  {invoiceUseAccount === 'true' ? 'Ledger Account' : 'Inv.Item'}
                                </th>
                                <th className="col-2">Invoice Line Title</th>
                                <th className="col-2">Profit Center</th>
                                <th className="col-1" style={{ marginLeft: '5px' }}>
                                  Unit
                                </th>
                                <th className="col-1" style={{ marginLeft: '3px' }}>
                                  Qty
                                </th>
                                <th className="col-1" style={{ marginLeft: '3px' }}>
                                  Tax
                                </th>
                                <th className="col-1" style={{ marginLeft: '3px' }}>
                                  With Vat
                                </th>
                                <th className="col-1" style={{ marginLeft: '3px' }}>
                                  Total{' '}
                                  <span id="doc-curr">
                                    {currencies.find((x) => x.id === invoiceData.invoiceCurr) &&
                                      currencies.find((x) => x.id === invoiceData.invoiceCurr).name}
                                  </span>
                                </th>
                                <th className="col-1"></th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {invoiceItems.length > 0 &&
                                invoiceItems.map((item) => (
                                  <tr key={item.id} className="findoc-line" id="involine_form__div">
                                    {invoiceUseAccount === 'true' ? (
                                      <td className="col-2 ">
                                        <div className="form-group finitem invoice_involines_finitem_id">
                                          <div>
                                            <div className="input-group">
                                              <Select
                                                className={classNames(
                                                  `form-control form-control-cst pageCstSelect lines errId_${item.id}`,
                                                  {
                                                    'is-invalid':
                                                      invoiceErrors.invoiceItemsErrors &&
                                                      invoiceErrors.invoiceItemsErrors.some(
                                                        (x) => x['ledgerAccountId_' + item.id],
                                                      ) &&
                                                      true,
                                                  },
                                                )}
                                                classNamePrefix="cstSelect"
                                                isClearable
                                                placeholder
                                                isSearchable
                                                isLoading={fetchingLedgers ? true : false}
                                                id={`ledgerAccountId${item.id}`}
                                                menuPlacement="auto"
                                                options={
                                                  ledgers &&
                                                  !fetchingLedgers &&
                                                  ledgers.map((itm) => ({
                                                    label: item.name,
                                                    value: item.id,
                                                  }))
                                                }
                                                noOptionsMessage={() => 'No results found'}
                                                onChange={(e) =>
                                                  handleSelectInvoice('ledgerAccountId', e, item.id)
                                                }
                                                isDisabled={
                                                  disabledFields.some((x) => x.id === item.id) &&
                                                  true
                                                    ? true
                                                    : false
                                                }
                                                onMenuOpen={() =>
                                                  handleSelectFocus('ledgerAccountId', item.id)
                                                }
                                              />
                                              <CFormFeedback
                                                id={`errId_${item.id}`}
                                                invalid={
                                                  invoiceErrors.invoiceItemsErrors &&
                                                  invoiceErrors.invoiceItemsErrors.some(
                                                    (x) => x.id === item.id,
                                                  ) &&
                                                  true
                                                    ? true
                                                    : false
                                                }
                                                className="fieldError-cst"
                                              >
                                                {invoiceErrors.invoiceItemsErrors.find(
                                                  (x) => x.id === item.id,
                                                ) &&
                                                  invoiceErrors.invoiceItemsErrors.find(
                                                    (x) => x.id === item.id,
                                                  )['ledgerAccountId_' + item.id]}
                                              </CFormFeedback>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                    ) : (
                                      <td className="col-2 ">
                                        <div className="form-group finitem invoice_involines_finitem_id">
                                          <div>
                                            <div className="input-group">
                                              <Select
                                                className={classNames(
                                                  `form-control form-control-cst pageCstSelect lines errId_${item.id}`,
                                                  {
                                                    'is-invalid':
                                                      invoiceErrors.invoiceItemsErrors &&
                                                      invoiceErrors.invoiceItemsErrors.some(
                                                        (x) => x['finItemId_' + item.id],
                                                      ) &&
                                                      true,
                                                  },
                                                )}
                                                classNamePrefix="cstSelect"
                                                isClearable
                                                placeholder
                                                isSearchable
                                                id="finitem_id"
                                                menuPlacement="auto"
                                                onChange={(e) =>
                                                  handleSelectInvoice('finItemId', e, item.id)
                                                }
                                                options={
                                                  finitems && finitems.length > 0
                                                    ? finitems.map((item) => ({
                                                        value: item.id,
                                                        label: item.name,
                                                      }))
                                                    : []
                                                }
                                                isLoading={fetchingFinitems ? true : false}
                                                noOptionsMessage={() => 'No results found'}
                                                onMenuOpen={() =>
                                                  handleSelectFocus('finItemId', item.id)
                                                }
                                                isDisabled={
                                                  disabledFields.some((x) => x.id === item.id) &&
                                                  true
                                                    ? true
                                                    : false
                                                }
                                              />
                                              <CFormFeedback
                                                id={`errId_${item.id}`}
                                                invalid={
                                                  invoiceErrors.invoiceItemsErrors &&
                                                  invoiceErrors.invoiceItemsErrors.some(
                                                    (x) => x['finItemId_' + item.id],
                                                  ) &&
                                                  true
                                                    ? true
                                                    : false
                                                }
                                                className="fieldError-cst"
                                              >
                                                {invoiceErrors.invoiceItemsErrors.find(
                                                  (x) => x.id === item.id,
                                                ) &&
                                                  invoiceErrors.invoiceItemsErrors.find(
                                                    (x) => x.id === item.id,
                                                  )['finItemId_' + item.id]}
                                              </CFormFeedback>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                    )}

                                    <td className="col-2 ">
                                      <div className="form-group invoice_involines_name">
                                        <CFormInput
                                          className={`form-control-cst lines errId_${item.id}`}
                                          placeholder="Invoice Line Title"
                                          type="text"
                                          id={`lineName_${item.id}`}
                                          name="lineName"
                                          value={item.lineName}
                                          onChange={(e) => handleInvoiceChange(e, item)}
                                          disabled={
                                            disabledFields.some((x) => x.id === item.id) && true
                                              ? true
                                              : false
                                          }
                                          invalid={
                                            invoiceErrors.invoiceItemsErrors &&
                                            invoiceErrors.invoiceItemsErrors.some(
                                              (x) => x['lineName_' + item.id],
                                            ) &&
                                            true
                                              ? true
                                              : false
                                          }
                                          onFocus={() => handleInvoiceFocusErr(item.id)}
                                        />
                                        <CFormFeedback
                                          id={`errId_${item.id}`}
                                          invalid
                                          className="fieldError-cst"
                                        >
                                          {invoiceErrors.invoiceItemsErrors.find(
                                            (x) => x.id === item.id,
                                          ) &&
                                            invoiceErrors.invoiceItemsErrors.find(
                                              (x) => x.id === item.id,
                                            )['lineName_' + item.id]}
                                        </CFormFeedback>
                                      </div>
                                    </td>
                                    <td className="col-2 ">
                                      <div className="form-group profit_center">
                                        <div>
                                          <div className="input-group">
                                            <Select
                                              className={classNames(
                                                `form-control form-control-cst pageCstSelect lines errId_${item.id}`,
                                                {
                                                  'is-invalid':
                                                    invoiceErrors.invoiceItemsErrors &&
                                                    invoiceErrors.invoiceItemsErrors.some(
                                                      (x) => x['invProfitCenterId_' + item.id],
                                                    ) &&
                                                    true,
                                                },
                                              )}
                                              classNamePrefix="cstSelect"
                                              isClearable
                                              placeholder
                                              isSearchable
                                              id={`invoice_profit_center_id_${item.id}`}
                                              menuPlacement="auto"
                                              options={
                                                profitCenters && profitCenters.length > 0
                                                  ? profitCenters.map((item) => ({
                                                      value: item.id,
                                                      label: item.name,
                                                    }))
                                                  : []
                                              }
                                              noOptionsMessage={() => 'No results found'}
                                              isLoading={fetchingProfitCenters ? true : false}
                                              onChange={(e) =>
                                                handleSelectInvoice('invProfitCenterId', e, item.id)
                                              }
                                              onMenuOpen={() =>
                                                handleSelectFocus('invProfitCenterId', item.id)
                                              }
                                              isDisabled={
                                                disabledFields.some((x) => x.id === item.id) && true
                                                  ? true
                                                  : false
                                              }
                                            />
                                            <CFormFeedback
                                              id={`errId_${item.id}`}
                                              invalid={
                                                invoiceErrors.invoiceItemsErrors &&
                                                invoiceErrors.invoiceItemsErrors.some(
                                                  (x) => x['invProfitCenterId_' + item.id],
                                                ) &&
                                                true
                                                  ? true
                                                  : false
                                              }
                                              className="fieldError-cst"
                                            >
                                              {invoiceErrors.invoiceItemsErrors.find(
                                                (x) => x.id === item.id,
                                              ) &&
                                                invoiceErrors.invoiceItemsErrors.find(
                                                  (x) => x.id === item.id,
                                                )['invProfitCenterId_' + item.id]}
                                            </CFormFeedback>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="col-1 ">
                                      <div className="form-group invoice_involines_unit_number">
                                        <CFormInput
                                          className={`form-control-cst lines errId_${item.id}`}
                                          style={{ textAlign: 'right' }}
                                          placeholder="Unit"
                                          type="number"
                                          step="any"
                                          name="unitNumber"
                                          id={`unitNumber_${item.id}`}
                                          value={item.unitNumber}
                                          onChange={(e) => handleInvoiceChange(e, item)}
                                          onKeyUp={(e) => handleInvoiceKeyUp(e, item)}
                                          onBlur={() => handleInvoiceBlur()}
                                          disabled={
                                            disabledFields.some((x) => x.id === item.id) && true
                                              ? true
                                              : false
                                          }
                                          invalid={
                                            invoiceErrors.invoiceItemsErrors &&
                                            invoiceErrors.invoiceItemsErrors.some(
                                              (x) => x['unitNumber_' + item.id],
                                            ) &&
                                            true
                                              ? true
                                              : false
                                          }
                                          onFocus={() => handleInvoiceFocusErr(item.id)}
                                        />
                                        <CFormFeedback
                                          id={`errId_${item.id}`}
                                          invalid
                                          className="fieldError-cst"
                                        >
                                          {invoiceErrors.invoiceItemsErrors.find(
                                            (x) => x.id === item.id,
                                          ) &&
                                            invoiceErrors.invoiceItemsErrors.find(
                                              (x) => x.id === item.id,
                                            )['unitNumber_' + item.id]}
                                        </CFormFeedback>
                                      </div>
                                    </td>
                                    <td className="col-1 ">
                                      <div className="form-group invoice_involines_unit_price">
                                        <CFormInput
                                          className={`form-control-cst lines errId_${item.id}`}
                                          style={{ textAlign: 'right' }}
                                          placeholder="Unit price"
                                          type="number"
                                          step="any"
                                          id={`unitPrice_${item.id}`}
                                          name="unitPrice"
                                          value={item.unitPrice}
                                          onChange={(e) => handleInvoiceChange(e, item)}
                                          onKeyUp={(e) => handleInvoiceKeyUp(e, item)}
                                          onBlur={() => handleInvoiceBlur()}
                                          invalid={
                                            invoiceErrors.invoiceItemsErrors &&
                                            invoiceErrors.invoiceItemsErrors.some(
                                              (x) => x['unitPrice_' + item.id],
                                            ) &&
                                            true
                                              ? true
                                              : false
                                          }
                                          onFocus={() => handleInvoiceFocusErr(item.id)}
                                          disabled={
                                            disabledFields.some((x) => x.id === item.id) && true
                                              ? true
                                              : false
                                          }
                                        />
                                        <CFormFeedback
                                          id={`errId_${item.id}`}
                                          invalid
                                          className="fieldError-cst"
                                        >
                                          {invoiceErrors.invoiceItemsErrors.find(
                                            (x) => x.id === item.id,
                                          ) &&
                                            invoiceErrors.invoiceItemsErrors.find(
                                              (x) => x.id === item.id,
                                            )['unitPrice_' + item.id]}
                                        </CFormFeedback>
                                      </div>
                                    </td>
                                    <td className="col-1 ">
                                      <div className="form-group select invoice_involines_vat_id">
                                        <CFormSelect
                                          className={`form-control-cst lines errId_${item.id}`}
                                          id={`vatId_${item.id}`}
                                          name="vatId"
                                          value={item.vatId}
                                          onChange={(e) => handleInvoiceChange(e, item)}
                                          // onKeyUp={(e) => handleInvoiceKeyUp(e, item)}
                                          onFocus={() => handleSelectFocus('vatId', item.id)}
                                          onBlur={() => handleInvoiceBlur()}
                                          disabled={
                                            disabledFields.some((x) => x.id === item.id) && true
                                              ? true
                                              : false
                                          }
                                          invalid={
                                            invoiceErrors.invoiceItemsErrors &&
                                            invoiceErrors.invoiceItemsErrors.some(
                                              (x) => x['vatId_' + item.id],
                                            ) &&
                                            true
                                              ? true
                                              : false
                                          }
                                        >
                                          <option value=""></option>
                                          {!fetchingTaxcodes ? (
                                            taxcodes && taxcodes.length > 0 ? (
                                              <>
                                                {taxcodes.map((itm) => (
                                                  <option
                                                    key={itm.id}
                                                    data-rate={itm.rate}
                                                    value={itm.id}
                                                  >
                                                    {itm.name}
                                                  </option>
                                                ))}
                                              </>
                                            ) : (
                                              <option disabled>No results found.</option>
                                            )
                                          ) : (
                                            <option disabled>Loading...</option>
                                          )}
                                        </CFormSelect>
                                        <CFormFeedback
                                          id={`errId_${item.id}`}
                                          invalid
                                          className="fieldError-cst"
                                        >
                                          {invoiceErrors.invoiceItemsErrors.find(
                                            (x) => x.id === item.id,
                                          ) &&
                                            invoiceErrors.invoiceItemsErrors.find(
                                              (x) => x.id === item.id,
                                            )['vatId_' + item.id]}
                                        </CFormFeedback>
                                      </div>
                                    </td>
                                    <td className="col-1 ">
                                      <div className="form-group invoice_involines_line_total">
                                        <CFormInput
                                          className={`form-control-cst lines errId_${item.id}`}
                                          style={{ textAlign: 'right' }}
                                          placeholder="With Vat"
                                          type="number"
                                          step="any"
                                          id={`lineTotal_${item.id}`}
                                          name="lineTotal"
                                          value={item.lineTotal}
                                          onChange={(e) => handleInvoiceChange(e, item)}
                                          onKeyUp={(e) => handleInvoiceKeyUp(e, item)}
                                          onBlur={() => handleInvoiceBlur()}
                                          disabled={
                                            disabledFields.some((x) => x.id === item.id) && true
                                              ? true
                                              : false
                                          }
                                          invalid={
                                            invoiceErrors.invoiceItemsErrors &&
                                            invoiceErrors.invoiceItemsErrors.some(
                                              (x) => x['lineTotal_' + item.id],
                                            ) &&
                                            true
                                              ? true
                                              : false
                                          }
                                          onFocus={() => handleInvoiceFocusErr(item.id)}
                                        />
                                        <CFormFeedback
                                          id={`errId_${item.id}`}
                                          invalid
                                          className="fieldError-cst"
                                        >
                                          {invoiceErrors.invoiceItemsErrors.find(
                                            (x) => x.id === item.id,
                                          ) &&
                                            invoiceErrors.invoiceItemsErrors.find(
                                              (x) => x.id === item.id,
                                            )['lineTotal_' + item.id]}
                                        </CFormFeedback>
                                      </div>
                                    </td>
                                    <td className="col-1 ">
                                      <div className="form-group invoice_involines_line_total_invoice">
                                        <CFormInput
                                          className={`form-control-cst lines errId_${item.id}`}
                                          style={{ textAlign: 'right' }}
                                          placeholder="Total"
                                          type="number"
                                          step="any"
                                          id={`totalInvoice_${item.id}`}
                                          name="totalInvoice"
                                          value={item.totalInvoice}
                                          onChange={(e) => handleInvoiceChange(e, item)}
                                          onKeyUp={(e) => handleInvoiceKeyUp(e, item)}
                                          onBlur={() => handleInvoiceBlur()}
                                          disabled={
                                            disabledFields.some((x) => x.id === item.id) && true
                                              ? true
                                              : false
                                          }
                                          invalid={
                                            invoiceErrors.invoiceItemsErrors &&
                                            invoiceErrors.invoiceItemsErrors.some(
                                              (x) => x['totalInvoice_' + item.id],
                                            ) &&
                                            true
                                              ? true
                                              : false
                                          }
                                          onFocus={() => handleInvoiceFocusErr(item.id)}
                                        />
                                        <CFormFeedback
                                          id={`errId_${item.id}`}
                                          invalid
                                          className="fieldError-cst"
                                        >
                                          {invoiceErrors.invoiceItemsErrors.find(
                                            (x) => x.id === item.id,
                                          ) &&
                                            invoiceErrors.invoiceItemsErrors.find(
                                              (x) => x.id === item.id,
                                            )['totalInvoice_' + item.id]}
                                        </CFormFeedback>
                                      </div>
                                    </td>
                                    <td className="text-center p-0">
                                      <div
                                        className="position-relative mr-2"
                                        style={{ display: 'inline-block' }}
                                      >
                                        <CDropdown placement="right-start">
                                          <CDropdownToggle
                                            color="dark"
                                            title="Edit Detail"
                                            className="lines"
                                            caret={false}
                                            disabled={
                                              disabledFields.some((x) => x.id === item.id) && true
                                                ? true
                                                : false
                                            }
                                          >
                                            Edit
                                          </CDropdownToggle>
                                          <CDropdownMenu
                                            className="text-left"
                                            style={{
                                              width: '350px',
                                              position: 'absolute',
                                              right: '0px',
                                              zIndex: '2',
                                            }}
                                            id={`dropmenu-${item.id}`}
                                          >
                                            <button
                                              className="btn btn-close pull-right"
                                              aria-label="Close"
                                              title="Close"
                                              onClick={(e) => detailClose(e, item)}
                                            ></button>
                                            <div className="mt-2">
                                              <div className="row">
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                                  <div className="row">
                                                    <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                                      <div className="form-group select required invoice_involines_debit_credit">
                                                        <label
                                                          className="control-label select required"
                                                          htmlFor={`invoice_involines_attributes_${item.id}_debit_credit`}
                                                        >
                                                          Sales/Expense{' '}
                                                          <span title="required">*</span>
                                                        </label>
                                                        <CFormSelect
                                                          className="form-control-cst select required line-debit-credit"
                                                          name="debitCredit"
                                                          id={`invoice_involines_attributes_${item.id}_debit_credit`}
                                                          value={invoiceData.debitCredit}
                                                          onChange={(e) =>
                                                            handleInvoiceChange(e, item)
                                                          }
                                                          invalid={
                                                            invoiceErrors &&
                                                            !isEmpty(invoiceErrors.debitCredit)
                                                              ? true
                                                              : false
                                                          }
                                                          onFocus={() =>
                                                            handleSelectFocus('debitCredit')
                                                          }
                                                          onBlur={() => handleInvoiceBlur()}
                                                        >
                                                          <option value="debit">Sales Item</option>
                                                          <option value="credit">
                                                            Expense Item
                                                          </option>
                                                        </CFormSelect>
                                                        <CFormFeedback
                                                          invalid
                                                          className="fieldError-cst"
                                                        >
                                                          {invoiceErrors.currRate}
                                                        </CFormFeedback>
                                                      </div>
                                                    </div>
                                                    <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                                      <div className="form-group select invoice_involines_unit_type">
                                                        <label
                                                          className="control-label select"
                                                          htmlFor={`invoice_involines_attributes_${item.id}_unit_type`}
                                                        >
                                                          Type
                                                        </label>
                                                        <CFormSelect
                                                          className="form-control-cst select"
                                                          name="unitType"
                                                          id={`invoice_involines_attributes_${item.id}_unit_type`}
                                                          value={item.unitType}
                                                          onChange={(e) =>
                                                            handleInvoiceChange(e, item)
                                                          }
                                                          invalid={
                                                            invoiceErrors &&
                                                            !isEmpty(invoiceErrors.unitType)
                                                              ? true
                                                              : false
                                                          }
                                                          onFocus={() =>
                                                            handleSelectFocus('unitType')
                                                          }
                                                          onBlur={() => handleInvoiceBlur()}
                                                        >
                                                          <option value="number">Number</option>
                                                          <option value="day">Day</option>
                                                          <option value="hour">Hour</option>
                                                          <option value="week">Week</option>
                                                          <option value="month">Month</option>
                                                          <option value="year">Year</option>
                                                          <option value="km">Km</option>
                                                          <option value="lt">lt</option>
                                                          <option value="m2">m2</option>
                                                          <option value="kg">kg</option>
                                                        </CFormSelect>
                                                        <CFormFeedback
                                                          invalid
                                                          className="fieldError-cst"
                                                        >
                                                          {invoiceErrors.currRate}
                                                        </CFormFeedback>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="row">
                                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                                  <div className="form-group select required invoice_involines_curr">
                                                    <label
                                                      className="control-label select required"
                                                      htmlFor="invoice_involines_attributes_0_curr"
                                                    >
                                                      Line Currency <span title="required">*</span>
                                                    </label>
                                                    <CFormSelect
                                                      className="form-control-cst select required line-curr"
                                                      name="curr"
                                                      id={`invoice_involines_attributes_${item.id}_curr`}
                                                      value={item.curr}
                                                      onChange={(e) => handleInvoiceChange(e, item)}
                                                      invalid={
                                                        invoiceErrors &&
                                                        !isEmpty(invoiceErrors.curr)
                                                          ? true
                                                          : false
                                                      }
                                                      onBlur={() => handleInvoiceBlur()}
                                                      onFocus={() => handleSelectFocus('curr')}
                                                    >
                                                      <option value=""></option>
                                                      {!fetchingCurrencies ? (
                                                        currencies && currencies.length > 0 ? (
                                                          <>
                                                            {currencies.map((itm) => (
                                                              <option
                                                                key={itm.id}
                                                                value={itm.id}
                                                                trans_method={itm.slug}
                                                              >
                                                                {itm.name}
                                                              </option>
                                                            ))}
                                                          </>
                                                        ) : (
                                                          <option disabled>
                                                            No results found.
                                                          </option>
                                                        )
                                                      ) : (
                                                        <option disabled>Loading...</option>
                                                      )}
                                                    </CFormSelect>
                                                    <CFormFeedback
                                                      invalid
                                                      className="fieldError-cst"
                                                    >
                                                      {invoiceErrors.curr}
                                                    </CFormFeedback>
                                                  </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                                  <div className="form-group required invoice_involines_curr_rate">
                                                    <label
                                                      className="control-label required"
                                                      htmlFor="invoice_involines_attributes_0_curr_rate"
                                                    >
                                                      Curr Rate <span title="required">*</span>
                                                    </label>
                                                    <CFormInput
                                                      className="form-control-cst numeric required line-curr-rate"
                                                      style={{ textAlign: 'right' }}
                                                      type="number"
                                                      step="any"
                                                      name="currRate"
                                                      id={`invoice_involines_attributes_${item.id}_curr_rate`}
                                                      value={item.currRate}
                                                      onChange={(e) => handleInvoiceChange(e, item)}
                                                      invalid={
                                                        invoiceErrors &&
                                                        !isEmpty(invoiceErrors.currRate)
                                                          ? true
                                                          : false
                                                      }
                                                      onBlur={() => handleInvoiceBlur()}
                                                      onFocus={() => handleSelectFocus('currRate')}
                                                    />
                                                    <CFormFeedback
                                                      invalid
                                                      className="fieldError-cst"
                                                    >
                                                      {invoiceErrors.currRate}
                                                    </CFormFeedback>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="form-group invoice_involines_notes">
                                                <label
                                                  className="control-label"
                                                  htmlFor="invoice_involines_attributes_0_notes"
                                                >
                                                  Notes
                                                </label>
                                                <CFormInput
                                                  className={`form-control-cst lines errId_${item.id}`}
                                                  placeholder="Invoice Line Title"
                                                  type="text"
                                                  id={`notes_${item.id}`}
                                                  name="notes"
                                                  value={item.notes}
                                                  onChange={(e) => handleInvoiceChange(e, item)}
                                                  disabled={
                                                    disabledFields.some((x) => x.id === item.id) &&
                                                    true
                                                      ? true
                                                      : false
                                                  }
                                                  invalid={
                                                    invoiceErrors.invoiceItemsErrors &&
                                                    invoiceErrors.invoiceItemsErrors.some(
                                                      (x) => x['notes_' + item.id],
                                                    ) &&
                                                    true
                                                      ? true
                                                      : false
                                                  }
                                                  onFocus={() => handleInvoiceFocusErr(item.id)}
                                                />
                                                <CFormFeedback
                                                  id={`errId_${item.id}`}
                                                  invalid
                                                  className="fieldError-cst"
                                                >
                                                  {invoiceErrors.invoiceItemsErrors.find(
                                                    (x) => x.id === item.id,
                                                  ) &&
                                                    invoiceErrors.invoiceItemsErrors.find(
                                                      (x) => x.id === item.id,
                                                    )['notes_' + item.id]}
                                                </CFormFeedback>
                                              </div>
                                            </div>
                                          </CDropdownMenu>
                                        </CDropdown>
                                      </div>
                                    </td>
                                    <td className={`remove-doc-line_${item.id}`}>
                                      <button
                                        className="btn btn-close remove-doc-link"
                                        aria-label="Close"
                                        title="Remove"
                                        style={{ marginTop: '2px' }}
                                        onClick={(e) => removeInvItem(e, item)}
                                      ></button>
                                    </td>
                                    <td
                                      className={`recover-doc-line_${item.id}`}
                                      style={{ display: 'none' }}
                                    >
                                      {/* eslint-disable-next-line */}
                                      <a
                                        title="Recover"
                                        href="#"
                                        className="text-secondary"
                                        onClick={(e) => recoverInvItem(e, item)}
                                      >
                                        <i className="fas fa-reply recover-doc-link"></i>
                                      </a>
                                    </td>
                                  </tr>
                                ))}
                              <tr className="d-flex new_record_button">
                                <td colSpan="10" className="text-right">
                                  <span className="float-left add-new-line">
                                    {/* eslint-disable-next-line */}
                                    <a
                                      href="#"
                                      className="btn btn-primary add_nested_fields_btn "
                                      onClick={(e) => addInvoiceLines(e)}
                                    >
                                      <i className="fa fa-plus"></i> Add Invoice Line
                                    </a>
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
                        <br />
                        {!showIbans.length > 0
                          ? invoiceType === 'credit' && (
                              <>
                                <br />
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid  */}
                                <a className="" href="#" onClick={(e) => handleClickIban(e)}>
                                  The company does not have an IBAN, Click to add...
                                </a>
                              </>
                            )
                          : null}
                      </div>
                      <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        <table className="table subTotalTbl table-hover table-striped well debit-findoc">
                          <thead>
                            <tr>
                              <th>
                                <span className="text-right">Sub Total</span>
                              </th>
                              <th className="text-right">
                                <span id="sub-total-cell">
                                  {formatMoney(totalResults.subTotal)}{' '}
                                  {currencies.find((x) => x.id === invoiceData.invoiceCurr) &&
                                    currencies.find((x) => x.id === invoiceData.invoiceCurr).name}
                                </span>
                              </th>
                            </tr>
                            <tr>
                              <th>
                                <span className="text-right">VAT Total</span>
                              </th>
                              <th className="text-right">
                                <span id="tax-total-cell">
                                  {formatMoney(totalResults.vatTotal)}{' '}
                                  {currencies.find((x) => x.id === invoiceData.invoiceCurr) &&
                                    currencies.find((x) => x.id === invoiceData.invoiceCurr).name}
                                </span>
                              </th>
                            </tr>
                            <tr>
                              <th>
                                <span className="text-right">Net Total</span>
                              </th>
                              <th className="text-right">
                                <span id="total-cell">
                                  {formatMoney(totalResults.netTotal)}{' '}
                                  {currencies.find((x) => x.id === invoiceData.invoiceCurr) &&
                                    currencies.find((x) => x.id === invoiceData.invoiceCurr).name}
                                </span>
                              </th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <CButton
                          color="success"
                          disabled={creatingInvoice ? true : false}
                          className="float-right"
                          type="submit"
                        >
                          {creatingInvoice ? (
                            'Processing...'
                          ) : (
                            <span>
                              Save <i className="fa fa-check"></i>
                            </span>
                          )}
                        </CButton>
                      </div>
                    </div>
                  </div>
                </div>
              </CCardBody>
            </form>
          </CCard>
        </div>
      </div>

      {/* iban invoice */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={addIbanPanel}
        title={
          <div className="space">
            <div>
              <span>Add New Iban</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={() => closeIbanPanel()}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>
          <NewIBAN
            closeIbanPanel={closeIbanPanel}
            showCompany={showCompany}
            changeIbans={() => setShowIbans()}
          />
        </div>
      </SlidingPane>
    </div>
  )
}

export default StartInvoice
