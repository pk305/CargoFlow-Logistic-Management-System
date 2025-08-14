import React, { useState, useEffect, useCallback } from 'react'
import {
  CButton,
  CCallout,
  CCard,
  CCardBody,
  CForm,
  CFormCheck,
  CFormFeedback,
  CFormInput,
  CFormSelect,
  CFormTextarea,
} from '@coreui/react'
import { AppBreadcrumb } from 'src/components'
import Cookies from 'js-cookie'
import { isEmpty, isNull, isNumber, toUpper } from 'lodash'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import {
  clearInvoiceError,
  createInvoice,
  findInvoice,
  showInvoiceError,
} from 'src/redux/slices/invoiceSlice'
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

const CloneInvoice = () => {
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
  const [invoiceUseAccount, setInvoiceUseAccount] = useState(false)
  const [invoiceDate, setInvoiceDate] = useState(new Date())
  const [dueDate, setDueDate] = useState(new Date())
  const { invoiceErrors, creatingInvoice, errorCalloutText } = useSelector((state) => state.invoice)
  const { currencies, fetchingCurrencies } = useSelector((state) => state.currency)
  const [calloutInfo, setCalloutInfo] = useState(true)
  const [invoiceItems, setInvoiceItems] = useState([])
  const [addIbanPanel, setAddIbanPanel] = useState(false)
  const [totalResults, setTotalResults] = useState({
    subTotal: '0.00',
    vatTotal: '0.00',
    netTotal: '0.00',
  })
  const [invoiceType] = useState('debit')
  const [showAccountPay, setShowAccountPay] = useState(false)
  const { ledgers, fetchingLedgers } = useSelector((state) => state.ledger)
  const { finitems, fetchingFinitems } = useSelector((state) => state.finitem)
  const { profitCenters, fetchingProfitCenters } = useSelector((state) => state.profitCenter)
  const { taxcodes, fetchingTaxcodes } = useSelector((state) => state.taxcode)
  const [showIbans, setShowIbans] = useState([])
  const { users, fetchingUsers } = useSelector((state) => state.user)
  const { fetchingOperations, operations } = useSelector((state) => state.operation)
  const [addressChange, setAddressChange] = useState(false)
  const { branches, fetchingBranches } = useSelector((state) => state.branch)
  const [valueChange, setValueChange] = useState({
    salerId: null,
    profitCenterId: null,
    branchId: null,
  })
  // const [invLineItem, setLineItem] = useState({
  //   finItems: [],
  // })

  // [
  //   {
  //     id: 3,
  //     name: 'Handling Fee',
  //   },
  // ]

  const { invId } = useParams()

  const handleAddressChange = (e) => {
    const { checked } = e.target
    if (checked) {
      setAddressChange(true)
    } else {
      setAddressChange(false)
    }
  }

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setInvoiceData({
      ...invoiceData,
      [name]: value,
    })
  }

  const removeInvItem = (e, item) => {
    e.preventDefault()
    var n = new Noty({
      text: 'The record will be deleted, do you want to continue ?',
      layout: 'topCenter',
      progressBar: false,
      timeout: false,
      type: 'error',
      buttons: [
        Noty.button(
          'Delete',
          'btn btn-default btn-sm del-bnt-mr text-danger float-right',
          async function () {
            let itms = invoiceItems.filter((x) => x.id !== item.id)
            //  calcTotalPack(itms, 'total')
            setInvoiceItems(itms)
            n.close()
          },
          { id: `delItem-${item.id}` },
        ),

        Noty.button('Cancel', 'btn btn-default btn-sm float-right', function () {
          n.close()
        }),
      ],
    })
    n.show()
  }

  const handleKeyUpForm = (e) => {
    const { name, value } = e.target
    if (name === 'invoiceCurrRate') {
      let invCurr = parseFloat(value)
      setInvoiceItems(
        (state) =>
          state.map((item) => {
            const p2 = invCurr > 0 ? parseFloat(item.lineTotal / invCurr).toFixed(2) : ''
            $(`#totalInvoice_${item.id}`).val(p2)
            return { ...item, totalInvoice: p2, withoutVat: p2 }
          }),

        handleInvoiceBlur(e, invCurr),
      )
    }
  }

  const calcultateWithVat = (item, value, name) => {
    $(`#lineTotal_${item.id}`).val('')
    $(`#totalInvoice_${item.id}`).val('')
    let p1 = parseFloat(value * item[name])
    $(`#lineTotal_${item.id}`).val(p1.toFixed(2))
    $(`#totalInvoice_${item.id}`).val(p1.toFixed(2))

    calcultateTotal(p1, item)
  }

  const calcultateTotal = (p1, item) => {
    let p2 = p1
    if (invoiceData.invoiceCurrRate) {
      const invCurr = parseFloat(invoiceData.invoiceCurrRate)
      p2 =
        parseFloat(p1 / invCurr) > 0
          ? parseFloat(p1 / invCurr).toFixed(2)
          : parseFloat(p1 / invCurr)

      $(`#totalInvoice_${item.id}`).val(p2)
      const dataRate = $(`#vatId_${item.id} option:selected`).attr('data-rate')
      const rate = parseFloat(dataRate / 100) //change to percantage
      setInvoiceItems((state) =>
        state.map((x) =>
          x.id === item.id
            ? {
                ...x,
                lineTotal: p2,
                totalInvoice: p2,
                withoutVat: p1,
                vatCalculate: rate
                  ? Number(
                      parseFloat(rate * Number(parseFloat(item.unitNumber * item.unitPrice))),
                    ).toFixed(2)
                  : 0,
              }
            : x,
        ),
      )
    }
    // calcultateTax(null, item, item.vatId)
  }

  const calcultateTax = (rate, item, value) => {
    const dataRate = $(`#vatId_${item.id} option:selected`).attr('data-rate')
    if (value) {
      $(`#lineTotal_${item.id}`).val('')
      $(`#totalInvoice_${item.id}`).val('')
      rate = parseFloat(dataRate / 100) //change to percantage
      let p1 = Number(parseFloat(item.unitNumber * item.unitPrice))
      const withVat = p1 + Number(parseFloat(rate * p1))
      $(`#lineTotal_${item.id}`).val(withVat.toFixed(2))
      $(`#totalInvoice_${item.id}`).val(withVat.toFixed(2))

      let p2 = withVat
      if (invoiceData.invoiceCurrRate) {
        const invCurr = parseFloat(invoiceData.invoiceCurrRate)
        p2 =
          parseFloat(withVat / invCurr) > 0
            ? parseFloat(withVat / invCurr).toFixed(2)
            : parseFloat(withVat / invCurr)

        $(`#totalInvoice_${item.id}`).val(p2)

        setInvoiceItems((state) =>
          state.map((x) =>
            x.id === item.id
              ? {
                  ...x,
                  lineTotal: p2,
                  totalInvoice: p2,
                  withoutVat: p1,
                  vatCalculate: rate
                    ? Number(
                        parseFloat(rate * Number(parseFloat(item.unitNumber * item.unitPrice))),
                      ).toFixed(2)
                    : 0,
                }
              : x,
          ),
        )
      }
    } else {
      calcultateWithVat(item, item.unitNumber, 'unitPrice')
      setInvoiceItems((state) =>
        state.map((x) =>
          x.id === item.id
            ? {
                ...x,
                vatCalculate: 0,
              }
            : x,
        ),
      )
    }
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

  const handleSelectForm = (c, val, item) => {
    if (c === 'invProfitCenterId') {
      const e = { target: { name: 'profitCenterId', value: !isNull(val) ? val.value : '' } }
      handleInvoiceChange(e, item)
    } else {
      if (c === 'invoiceCurr') {
        setDefaultCurrency(
          val
            ? {
                label: val.label,
                value: val.value,
              }
            : null,
        )
      }
      setValueChange((state) => ({
        ...state,
        [c]: val
          ? {
              label: val.label,
              value: val.value,
            }
          : null,
      }))

      const e = { target: { name: c, value: !isNull(val) ? val.value : '' } }
      handleChangeForm(e)
    }
  }

  const detailClose = (e) => {
    e.preventDefault()
  }

  const handleSelectInvoice = (c, val, itemId) => {
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
    setInvoiceData({ ...invoiceData, checkInvoiceItems: true })
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearInvoiceError({ type: c, errorType: 'errInvoice' }))

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
    } else if (c === 'invoiceCurr') {
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
    }
  }

  const handleInvoiceChange = (e, item) => {
    const { name, value } = e.target
    let rate = null
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
      return calcultateTax(rate, item, value)
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
        return calcultateWithVat(item, value, 'unitPrice')

      case 'unitPrice':
        return calcultateWithVat(item, value, 'unitNumber')

      default:
        return
    }
  }

  const handleInvoiceBlur = (_, item) => {
    let vatSum = [0]
    let totalSum = [0]
    let withoutVatAmountSum = [0]

    if (invoiceItems.length > 0) {
      for (let i = 0; i < invoiceItems.length; i++) {
        const inv = invoiceItems[i]
        vatSum.push(parseFloat(inv.vatCalculate))
        totalSum.push(parseFloat(inv.totalInvoice))
        withoutVatAmountSum.push(parseFloat(inv.withoutVat))
      }
    }

    let vatTotal = vatSum.reduce((a, b) => a + b, 0).toFixed(2)
    const withoutVat = withoutVatAmountSum.reduce((a, b) => a + b, 0).toFixed(2)
    let netTotal = totalSum.reduce((a, b) => a + b, 0).toFixed(2)
    if (item) {
      let invCurr = isNumber(item) ? item : null
      const curr = currencies.find((x) => x.id === invoiceData.invoiceCurr)

      if (invCurr) {
        //set vat total
        $('#tax-total-cell').html(`${formatMoney(
          parseFloat(invCurr) > 0 ? parseFloat(vatTotal / invCurr) : 0,
        )}
         ${curr ? curr.name : ''}
        `)
        vatTotal = parseFloat(vatTotal / invCurr)
      }
    }

    setTotalResults({
      vatTotal,
      netTotal,
      subTotal: withoutVat,
    })
  }

  const addInvoiceLines = (e) => {
    e.preventDefault()
    setInvoiceItems((state) => [
      ...state,
      {
        id: nanoid(10),
        finItemId: '',
        profitCenterId: '',
        profitCenterName: '',
        lineName: '',
        unitNumber: '1.0',
        unitPrice: '0.0',
        vatId: '',
        vatCalculate: 0,
        lineTotal: '0.0',
        totalInvoice: '0.0',
      },
    ])
  }

  const handleSubmitInvoice = async (e) => {
    e.preventDefault()
    const form = $('#newInvoice')
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
    try {
      const resData = await dispatch(createInvoice(formData)).unwrap()
      if (resData) {
        $('.cstCalloutInfo').hide()
        setCalloutInfo(false)
        clearInvoiceData()
        new Noty({
          type: 'alert',
          layout: 'topRight',
          id: `succItem${resData.id}`,
          text: 'Invoice has been created succesfully',
        }).show()
        history.push(`/invoices/${resData.linkId}`)
      }
    } catch (error) {
      if (error && error.error400) {
        if (error.error400.err === 'dueDate') {
          setCalloutInfo(true)
        }
      }
      setCalloutInfo(true)
      $('html, body').animate({ scrollTop: 0 }, 300)
    }
  }

  const clearInvoiceData = () => {
    Cookies.remove('ss')
    return setInvoiceData({
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
    $(`#errId_${Id}`).hide()
    $(`.errId_${Id}`).removeClass('is-invalid')
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
    if (invId) {
      const resData = await dispatch(findInvoice(invId)).unwrap()
      if (resData) {
        document.title = toUpper(resData.invoiceName)
        //
        if (resData.invoiceCurr) {
          setDefaultCurrency({
            label: resData.invoiceCurr.code,
            value: resData.invoiceCurr.id,
          })
        }
        const d = resData
        setInvoiceData((state) => ({
          ...state,
          invoiceName: d.invoiceName ? d.invoiceName : '',
          dueDate: `${moment(d.dueDate).format('YYYY-MM-DD HH:mm:ss')}`,
          invoiceDate: `${moment(d.invoiceDate).format('YYYY-MM-DD HH:mm:ss')}`,
          invoiceCurr: d.invoiceCurr ? d.invoiceCurr.id : '',
          branchId: d.branch ? d.branch.id : null,
          workType: 'sales_invoice',
          operationId: d.operation ? d.operation.id : '',
          profitCenterId: d.profitCenter ? d.profitCenter.id : null,
          invoiceAddress: d.invoiceAddress ? d.invoiceAddress : '',
          invoiceCurrRate: d.invoiceCurr ? d.invoiceCurr.id : '',
          notes: d.notes ? d.notes : '',
          placeId: d.invoicePlace ? d.invoicePlace : '',
          companyId: d.invoicedCompany.id,
          accountType: '',
          accountId: '',
          salerId: d.customerRep ? d.customerRep.uuId : null,
          checkInvoiceItems: false,
        }))
        // setShowIbans(resData.ibans)
        if (d.branch) {
          setValueChange((state) => ({
            ...state,
            branchId: d.branch.id
              ? {
                  label: d.branch.name,
                  value: d.branch.id,
                }
              : null,
          }))
        }
        if (d.profitCenter) {
          setValueChange((state) => ({
            ...state,
            profitCenterId: d.profitCenter.id
              ? {
                  label: d.profitCenter.name,
                  value: d.profitCenter.id,
                }
              : null,
          }))
        }
        if (d.customerRep) {
          setValueChange((state) => ({
            ...state,
            salerId: d.customerRep.uuId
              ? {
                  label: d.customerRep.name,
                  value: d.customerRep.uuid,
                }
              : null,
          }))
        }
        //
        setDueDate(new Date(d.dueDate))
        setInvoiceDate(new Date(d.invoiceDate))
        //
        setInvoiceUseAccount(Boolean(d.isLedgerable))
        //
        if (d.invoicedCharges.length > 0) {
          const invItems = d.invoicedCharges.map((x) => ({
            id: nanoid(10),
            finItemId: x.finitem ? x.finitem.id : '',
            profitCenterId: x.profitCenter ? x.profitCenter.id : '',
            lineName: x.name ? x.name : '',
            unitNumber: x.unitNumber ? x.unitNumber : '',
            unitPrice: x.unitPrice ? x.unitPrice : '',
            vatId: x.vat ? x.vat.id : '',
            vatCalculate: x.vatAmount ? x.vatAmount : '',
            withoutVat: x.amountWithoutVat ? x.amountWithoutVat : '',
            lineTotal: x.lineTotal ? x.lineTotal : '',
            totalInvoice: x.totalInvoice ? x.totalInvoice : '',
            profitCenterName: x.profitCenter ? x.profitCenter.name : '',
          }))
          setInvoiceItems(invItems)
          //
          setTotalResults((state) => ({
            ...state,
            subTotal: d.subTotal ? d.subTotal : '0.00',
            vatTotal: d.vatTotal ? d.vatTotal : '0.00',
            netTotal: d.netTotal ? d.netTotal : '0.00',
          }))
          console.log(d)
        }
        //
        // setInvLineItems()

        // finItemId: 2
        // id: '7Yxg38Zjbv'
        // lineName: 'Freight Charge'
        // lineTotal: '6615.00'
        // profitCenterId: 1
        // totalInvoice: '6615.00'
        // unitNumber: '7'
        // unitPrice: '900'
        // vatCalculate: '315.00'
        // vatId: '1'
        // withoutVat: 6300

        //  setInvoiceItems([

        //  ])

        // finItemId: '',
        //      profitCenterId: '',
        //      lineName: '',
        //      unitNumber: '1.0',
        //      unitPrice: '0.0',
        //      vatId: '',
        //      vatCalculate: 0,
        //      withoutVat: 0,
        //      lineTotal: '0.0',
        //      totalInvoice: '0.0',

        // console.log(resData.invoicedCharges)
      }
    }

    // const ssId = Cookies.get('ss')
    // // companyId
    // // invoiceType
    // if (!isUndefined(ssId)) {
    //   if (ssId) {
    //     const data = JSON.parse(ssId)
    //     const resData = await dispatch(findCompany(data.ssId)).unwrap()
    //     if (resData) {
    //     }
    //     setInvoiceUseAccount(data.inv)
    //     setInvoiceType(data.invoiceType)
    //     setInvoiceData((state) => ({
    //       ...state,
    //       workType: data.invoiceType === 'credit' ? 'bill' : 'sales_invoice',
    //     }))
    //   }
    // } else {
    //   // history.push('/financor/debit/new')
    // }
  }, [invId, dispatch])

  const closeIbanPanel = () => {
    setAddIbanPanel(false)
  }

  useEffect(() => {
    checkCompanyInvoice()

    //
    return () => Cookies.remove('ss')
  }, [checkCompanyInvoice])

  if (findingCompany) return null

  const invoiceLines = invoiceItems
  // invoiceItems.filter(
  //   (fil) =>
  //     invoiceErrors.invoiceItemsErrors &&
  //     invoiceErrors.invoiceItemsErrors.some((x) => x.id === fil.id) &&
  //     true,
  // ).length > 0
  //   ? invoiceItems.filter(
  //       (fil) =>
  //         invoiceErrors.invoiceItemsErrors &&
  //         invoiceErrors.invoiceItemsErrors.some((x) => x.id === fil.id) &&
  //         true,
  //     )
  //   : invoiceItemsInv.Item

  return (
    <div>
      <div className="cstContainerDef">
        <AppBreadcrumb items={breadcrumbList} />
      </div>
      <div className="pageContainer newBookings">
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <CCard className="cardCustom">
            <CForm
              acceptCharset="UTF-8"
              noValidate="novalidate"
              id="newInvoice"
              action="/invoices"
              method="post"
              onSubmit={(e) => handleSubmitInvoice(e)}
            >
              <CCardBody className="p-0">
                <div className="pageContainer-wrapper">
                  <div className="pageBoxSizing-container">
                    {errorCalloutText !== '' ? (
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
                    ) : null}

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
                          <CFormFeedback
                            invalid={
                              invoiceErrors && !isEmpty(invoiceErrors.invoiceName) ? true : false
                            }
                            className="fieldError-cst"
                          >
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
                            <div className="form-group decimal invoice_curr_rate">
                              <label className="control-label decimal" htmlFor="invoice_curr_rate">
                                Exch.Rate
                              </label>
                              <CFormInput
                                className="form-control-cst numeric decimal doc-curr-rate"
                                style={{ textAlign: 'right' }}
                                type="number"
                                step="any"
                                name="invoiceCurrRate"
                                id="invoice_curr_rate"
                                onChange={(e) => handleChangeForm(e)}
                                onKeyUp={(e) => handleKeyUpForm(e)}
                                onBlur={(e) => handleInvoiceBlur(e)}
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
                              <CFormFeedback
                                invalid={
                                  invoiceErrors && !isEmpty(invoiceErrors.invoiceCurrRate)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
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
                                  value={valueChange.branchId}
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
                                  onMenuOpen={(e) => handleSelectFocus('branchId')}
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
                                id="addressChange"
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
                              value={invoiceData.placeId}
                              onChange={(e) => handleChangeForm(e)}
                            >
                              <option value=""></option>
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
                            onFocus={(e) => handleSelectFocus('notes', e)}
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
                                    value={valueChange.profitCenterId}
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
                                    onMenuOpen={(e) => handleSelectFocus('profitCenterId', e)}
                                  />
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
                                onFocus={(e) => handleSelectFocus('operationId', e)}
                              >
                                {!fetchingOperations ? (
                                  operations && operations.length > 0 ? (
                                    <>
                                      <option value=""></option>
                                      {operations.map((itm, i) => (
                                        <option key={i} value={itm.id} trans_method={itm.slug}>
                                          {itm.name}
                                        </option>
                                      ))}
                                    </>
                                  ) : (
                                    <>
                                      <option value=""></option>
                                      <option disabled>No results found.</option>
                                    </>
                                  )
                                ) : (
                                  <>
                                    <option value=""></option>
                                    <option>Loading...</option>
                                  </>
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
                                  value={valueChange.salerId}
                                  noOptionsMessage={() => 'No results found'}
                                  onChange={(e) => handleSelectForm('salerId', e)}
                                  onMenuOpen={(e) => handleSelectFocus('salerId', e)}
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
                                        <option value="Financor::BankAccount">Bank Account</option>
                                        <option value="Financor::CashPoint">Cash Account</option>
                                        <option value="Financor::CreditCard">Credit Card</option>
                                        <option value="Hr::Person">Employee</option>
                                        <option value="Fleet::Driver">Driver</option>
                                        <option value="Network::Company">Company</option>
                                        <option value="Financor::LedgerAccount">
                                          Ledger Account
                                        </option>
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
                    {/* {JSON.stringify(invoiceLines)} */}
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <table className="table table-sm table-vertical-center table-borderless">
                          <thead>
                            <tr className="d-flex">
                              <th className="col-2">
                                {invoiceUseAccount ? 'Ledger Account' : 'Inv.Item'}
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
                            {invoiceLines.length > 0 &&
                              invoiceLines.map((item) => (
                                <tr key={item.id} className="findoc-line" id="involine_form__div">
                                  {invoiceUseAccount ? (
                                    <td className="col-2 ">
                                      <div className="form-group finitem invoice_involines_finitem_id">
                                        <div>
                                          <div className="input-group">
                                            <Select
                                              className="form-control form-control-cst pageCstSelect "
                                              classNamePrefix="cstSelect"
                                              isClearable
                                              placeholder
                                              isSearchable
                                              isLoading={fetchingLedgers ? true : false}
                                              id={`ledgerAccountId${item.id}`}
                                              menuPlacement="auto"
                                              options={
                                                ledgers &&
                                                ledgers.map((itm) => ({
                                                  label: item.name,
                                                  value: item.id,
                                                }))
                                              }
                                              noOptionsMessage={() => 'No results found'}
                                              onChange={(e) =>
                                                handleSelectInvoice('ledgerAccountId', e, item.id)
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  ) : (
                                    <td className="col-2 ">
                                      {/* {JSON.stringify(item)} */}
                                      <div className="form-group finitem invoice_involines_finitem_id">
                                        <div>
                                          <div className="input-group">
                                            <Select
                                              className="form-control form-control-cst pageCstSelect "
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
                                              value={{
                                                value: item.finItemId,
                                                label: item.lineName,
                                              }}
                                              isLoading={fetchingFinitems ? true : false}
                                              noOptionsMessage={() => 'No results found'}
                                              onMenuOpen={() => handleSelectFocus('finItemId')}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  )}

                                  <td className="col-2 ">
                                    <div className="form-group invoice_involines_name">
                                      <CFormInput
                                        className="form-control-cst involine-name"
                                        placeholder="Invoice Line Title"
                                        type="text"
                                        id={`lineName_${item.id}`}
                                        name="lineName"
                                        value={item.lineName}
                                        onChange={(e) => handleInvoiceChange(e, item)}
                                      />
                                    </div>
                                  </td>
                                  <td className="col-2 ">
                                    <div className="form-group profit_center">
                                      <div>
                                        <div className="input-group">
                                          <Select
                                            className={classNames(
                                              'form-control form-control-cst pageCstSelect ',
                                              {
                                                'is-invalid':
                                                  invoiceErrors &&
                                                  !isEmpty(invoiceErrors.profitCenterId),
                                              },
                                            )}
                                            classNamePrefix="cstSelect"
                                            isClearable
                                            placeholder
                                            isSearchable
                                            id="invoice_profit_center_id"
                                            // id={`invoice_profit_center_id_${item.id}`}
                                            menuPlacement="auto"
                                            options={
                                              profitCenters && profitCenters.length > 0
                                                ? profitCenters.map((item) => ({
                                                    value: item.id,
                                                    label: item.name,
                                                  }))
                                                : []
                                            }
                                            value={{
                                              value: item.profitCenterId,
                                              label: item.profitCenterName,
                                            }}
                                            noOptionsMessage={() => 'No results found'}
                                            isLoading={fetchingProfitCenters ? true : false}
                                            onChange={(e) =>
                                              handleSelectForm('invProfitCenterId', e, item)
                                            }
                                            onMenuOpen={(e) =>
                                              handleSelectFocus('invProfitCenterId', e)
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="col-1 ">
                                    <div className="form-group decimal invoice_involines_unit_number">
                                      <CFormInput
                                        className="form-control-cst"
                                        style={{ textAlign: 'right' }}
                                        placeholder="Unit"
                                        type="number"
                                        step="any"
                                        name="unitNumber"
                                        id={`unitNumber_${item.id}`}
                                        value={item.unitNumber}
                                        onChange={(e) => handleInvoiceChange(e, item)}
                                        onKeyUp={(e) => handleInvoiceKeyUp(e, item)}
                                        onBlur={(e) => handleInvoiceBlur(e, item)}
                                      />
                                    </div>
                                  </td>
                                  <td className="col-1 ">
                                    <div className="form-group decimal invoice_involines_unit_price">
                                      <CFormInput
                                        className={`form-control-cst numeric errId_${item.id}`}
                                        style={{ textAlign: 'right' }}
                                        placeholder="Unit price"
                                        type="number"
                                        step="any"
                                        id={`unitPrice_${item.id}`}
                                        name="unitPrice"
                                        value={item.unitPrice}
                                        onChange={(e) => handleInvoiceChange(e, item)}
                                        onKeyUp={(e) => handleInvoiceKeyUp(e, item)}
                                        onBlur={(e) => handleInvoiceBlur(e, item)}
                                        invalid={
                                          invoiceErrors.invoiceItemsErrors &&
                                          invoiceErrors.invoiceItemsErrors.some(
                                            (x) => x.id === item.id,
                                          ) &&
                                          true
                                            ? true
                                            : false
                                        }
                                        onFocus={() => handleInvoiceFocusErr(item.id)}
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
                                        {invoiceErrors.invoiceItemsErrors &&
                                        invoiceErrors.invoiceItemsErrors.some(
                                          (x) => x.id === item.id,
                                        ) &&
                                        true
                                          ? 'Must be greater than 0.'
                                          : ''}
                                      </CFormFeedback>
                                    </div>
                                  </td>
                                  <td className="col-1 ">
                                    <div className="form-group select invoice_involines_vat_id">
                                      <CFormSelect
                                        className="form-control-cst select"
                                        id={`vatId_${item.id}`}
                                        name="vatId"
                                        value={item.vatId}
                                        onChange={(e) => handleInvoiceChange(e, item)}
                                        onKeyUp={(e) => handleInvoiceKeyUp(e, item)}
                                        onBlur={(e) => handleInvoiceBlur(e, item)}
                                        onFocus={() => handleSelectFocus('vatId')}
                                      >
                                        {!fetchingTaxcodes ? (
                                          taxcodes && taxcodes.length > 0 ? (
                                            <>
                                              <option value=""></option>
                                              {taxcodes.map((itm, i) => (
                                                <option
                                                  key={i}
                                                  data-rate={itm.ratePerc}
                                                  value={itm.id}
                                                >
                                                  {itm.name}
                                                </option>
                                              ))}
                                            </>
                                          ) : (
                                            <>
                                              <option value=""></option>
                                              <option disabled>No results found.</option>
                                            </>
                                          )
                                        ) : (
                                          <>
                                            <option value=""></option>
                                            <option>Loading...</option>
                                          </>
                                        )}
                                      </CFormSelect>
                                    </div>
                                  </td>
                                  <td className="col-1 ">
                                    <div className="form-group decimal invoice_involines_line_total">
                                      <CFormInput
                                        className="form-control-cst numeric decimal line-total-amount"
                                        style={{ textAlign: 'right' }}
                                        placeholder="With Vat"
                                        type="number"
                                        step="any"
                                        id={`lineTotal_${item.id}`}
                                        name="lineTotal"
                                        value={item.lineTotal}
                                        onChange={(e) => handleInvoiceChange(e, item)}
                                        onKeyUp={(e) => handleInvoiceKeyUp(e, item)}
                                        onBlur={(e) => handleInvoiceBlur(e, item)}
                                      />
                                    </div>
                                  </td>
                                  <td className="col-1 ">
                                    <div className="form-group decimal invoice_involines_line_total_invoice">
                                      <CFormInput
                                        className="form-control-cst numeric decimal line-amount-doc"
                                        style={{ textAlign: 'right' }}
                                        placeholder="Total"
                                        type="number"
                                        step="any"
                                        id={`totalInvoice_${item.id}`}
                                        name="totalInvoice"
                                        value={item.totalInvoice}
                                        onChange={(e) => handleInvoiceChange(e, item)}
                                        onKeyUp={(e) => handleInvoiceKeyUp(e, item)}
                                        onBlur={(e) => handleInvoiceBlur(e, item)}
                                      />
                                    </div>
                                  </td>
                                  <td className="text-center p-0">
                                    <div
                                      className="position-relative mr-2"
                                      style={{ display: 'inline-block' }}
                                    >
                                      {/* eslint-disable-next-line */}
                                      <a href="#" className="btn btn-dark" title="Edit Detail">
                                        Edit
                                      </a>
                                      <div
                                        className="details well text-left bg-white p-4 border rounded shadow"
                                        style={{
                                          display: 'none',
                                          position: 'absolute',
                                          zIndex: '999',
                                        }}
                                      >
                                        <button
                                          className="btn btn-close pull-right"
                                          aria-label="Close"
                                          title="Close"
                                          onClick={(e) => detailClose(e)}
                                        ></button>

                                        <div className="mt-4">
                                          <div className="row">
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                              <div className="row">
                                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                                  <div className="form-group select required invoice_involines_debit_credit">
                                                    <label
                                                      className="control-label select required"
                                                      htmlFor="invoice_involines_attributes_0_debit_credit"
                                                    >
                                                      <abbr title="required">*</abbr> Sales/Expense
                                                    </label>
                                                    <CFormSelect
                                                      className="form-control-cst select required line-debit-credit"
                                                      name="invoice[involines_attributes][0][debit_credit]"
                                                      id="invoice_involines_attributes_0_debit_credit"
                                                      onChange={(e) => handleChangeForm(e)}
                                                    >
                                                      <option value="debit">Sales Item</option>
                                                      <option value="credit">Expense Item</option>
                                                    </CFormSelect>
                                                  </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                                  <div className="form-group select invoice_involines_unit_type">
                                                    <label
                                                      className="control-label select"
                                                      htmlFor="invoice_involines_attributes_0_unit_type"
                                                    >
                                                      Type
                                                    </label>
                                                    <CFormSelect
                                                      className="form-control-cst select"
                                                      name="invoice[involines_attributes][0][unit_type]"
                                                      id="invoice_involines_attributes_0_unit_type"
                                                      onChange={(e) => handleChangeForm(e)}
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
                                                  <abbr title="required">*</abbr> Line Currency
                                                </label>
                                                <CFormSelect
                                                  className="form-control-cst select required line-curr"
                                                  name="invoice[involines_attributes][0][curr]"
                                                  id="invoice_involines_attributes_0_curr"
                                                  onChange={(e) => handleChangeForm(e)}
                                                >
                                                  <option value=""></option>
                                                  <option value="EUR">EUR</option>
                                                  <option value="USD">USD</option>
                                                  <option value="CHF">CHF</option>
                                                  <option value="CAD">CAD</option>
                                                  <option value="CZK">CZK</option>
                                                  <option value="SEK">SEK</option>
                                                  <option value="PLN">PLN</option>
                                                  <option value="NOK">NOK</option>
                                                  <option value="AUD">AUD</option>
                                                  <option value="DKK">DKK</option>
                                                  <option value="KWD">KWD</option>
                                                  <option value="SAR">SAR</option>
                                                  <option value="RON">RON</option>
                                                  <option value="BGN">BGN</option>
                                                  <option value="RUB">RUB</option>
                                                  <option value="PKR">PKR</option>
                                                  <option value="CNY">CNY</option>
                                                  <option value="IRR">IRR</option>
                                                  <option value="JPY">JPY</option>
                                                  <option value="SGD">SGD</option>
                                                  <option value="AZN">AZN</option>
                                                  <option value="AED">AED</option>
                                                  <option value="HKD">HKD</option>
                                                  <option value="HUF">HUF</option>
                                                  <option value="MKD">MKD</option>
                                                  <option value="MYR">MYR</option>
                                                  <option value="KRW">KRW</option>
                                                  <option value="INR">INR</option>
                                                  <option value="XAU">XAU</option>
                                                  <option value="XAG">XAG</option>
                                                  <option value="XPT">XPT</option>
                                                  <option value="ZAR">ZAR</option>
                                                  <option value="VND">VND</option>
                                                  <option value="GEL">GEL</option>
                                                  <option value="GBP">GBP</option>
                                                  <option value="TRY">TRY</option>
                                                </CFormSelect>
                                              </div>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                              <div className="form-group decimal required invoice_involines_curr_rate">
                                                <label
                                                  className="control-label decimal required"
                                                  htmlFor="invoice_involines_attributes_0_curr_rate"
                                                >
                                                  <abbr title="required">*</abbr> Curr Rate
                                                </label>
                                                <CFormInput
                                                  className="form-control-cst numeric decimal required line-curr-rate"
                                                  style={{ textAlign: 'right' }}
                                                  type="number"
                                                  step="any"
                                                  value="1.0"
                                                  name="invoice[involines_attributes][0][curr_rate]"
                                                  id="invoice_involines_attributes_0_curr_rate"
                                                  onChange={(e) => handleChangeForm(e)}
                                                />
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
                                              className="form-control-cst"
                                              type="text"
                                              name="notes"
                                              id="invoice_involines_attributes_0_notes"
                                              value={invoiceData.notes}
                                              onChange={(e) => handleChangeForm(e)}
                                              invalid={
                                                invoiceErrors && !isEmpty(invoiceErrors.notes)
                                                  ? true
                                                  : false
                                              }
                                              onFocus={() =>
                                                dispatch(
                                                  clearInvoiceError({
                                                    type: 'notes',
                                                    errorType: 'errInvoice',
                                                  }),
                                                )
                                              }
                                            />
                                            <CFormFeedback
                                              invalid={
                                                invoiceErrors && !isEmpty(invoiceErrors.notes)
                                                  ? true
                                                  : false
                                              }
                                              className="fieldError-cst"
                                            >
                                              {invoiceErrors.notes}
                                            </CFormFeedback>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="remove-doc-line">
                                    <button
                                      className="btn btn-close remove-doc-link"
                                      aria-label="Close"
                                      title="Remove"
                                      style={{ marginTop: '2px' }}
                                      onClick={(e) => removeInvItem(e, item)}
                                    ></button>
                                  </td>
                                  <td className="recover-doc-line hide">
                                    {/* eslint-disable-next-line */}
                                    <a title="Recover" href="#">
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
            </CForm>
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

export default CloneInvoice
