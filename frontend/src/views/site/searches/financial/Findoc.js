/* eslint-disable react/prop-types */
import React, { useMemo, useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormInput,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilZoom } from '@coreui/icons'
import { useTable, useSortBy, usePagination, useRowSelect } from 'react-table'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import { findSearchReport, clearReportRecords } from 'src/redux/slices/reportSlice'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
// import Select from 'react-select'
import $ from 'jquery'
import { saveAs } from 'file-saver'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import moment from 'moment'
import { formatMoney, s2ab } from 'src/config/helpers'
import FindocListTable from './FindocListTable'

var XLSX = require('xlsx-js-style')

function formatColumn(ws, col, fmt) {
  const range = XLSX.utils.decode_range(ws['!ref'])
  // note: range.s.r + 1 skips header row
  for (let row = 0; row <= range.e.r; ++row) {
    const ref = XLSX.utils.encode_cell({ r: row, c: col })
    if (ws[ref]) {
      ws[ref].s = {
        font: { sz: 8, name: 'Calibri', color: '#333' },
        bold: true,
      }
      //format number
      if (ws[ref].t === 'n') {
        ws[ref].z = fmt
      }
    }
  }
}

const excelHtml5 = (cs_hd, rows, cs_cols, authUser) => {
  var wb = XLSX.utils.book_new()
  wb.Props = {
    Title: authUser && authUser.uuid,
    Subject: ',',
    Author: 'Nueklabs Inc',
    CreatedDate: new Date(2017, 12, 19),
  }

  wb.SheetNames.push('Sheet1')
  const wscols = cs_cols.length > 0 ? cs_cols : []
  /* rows */
  var ws = XLSX.utils.aoa_to_sheet(rows, { cellDates: true })

  /* config all columns */
  const cur = '0.001'
  for (let i = 0; i < cs_hd.length; i++) {
    formatColumn(ws, i, cur)
  }

  /* column props */
  ws['!cols'] = wscols
  //
  wb.Sheets['Sheet1'] = ws
  var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })
  saveAs(
    new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
    `${authUser && authUser.uuid}.xlsx`,
  )
}

const Findoc = () => {
  const dispatch = useDispatch()
  const { authUser } = useSelector((state) => state.auth)
  const [visibleFilter, setVisibleFilter] = useState(false)
  const [searchData, setSearchData] = useState({
    companyId: '',
    debitCredit: '',
    status: '',
    searchQuery: '',
    invoiceDateSelect: '',
    dueDateSelect: '',
    currId: '',
    userId: '',
  })
  const { search } = useLocation()
  const { reports, findingSearchReport, totalReport } = useSelector((state) => state.report)

  const handleSearch = async (e) => {
    const { name, value } = e.target
    setSearchData({
      ...searchData,
      [name]: value,
    })

    if (e.keyCode === 13 && authUser) {
      let formData = new FormData()
      formData.append('searchQuery', value)
      formData.append('searchBar', true)
      formData.append('model', 'Findoc')
      formData.append('req', 'Financor')
      formData.append('companyId', authUser.company.id)

      const resData = await dispatch(findSearchReport(formData)).unwrap()
      if (resData) {
        clearSearchData()
      }
    }
  }

  const exportToExcel = (e) => {
    e.preventDefault()
    $('.dropdown-menu.downloadMenu').removeClass('show')

    const cs_hd = [
      'Invoice No',
      'Date',
      'Company',
      'Account Code',
      'Due date',
      'Amount',
      'VAT',
      'Net Total',
      'Currency',
      'Exch.Rate',
      'Unpaid Amount',
      'Vatless Amount',
      'Vat Amount	',
      'Amount',
      'Branch',
      'User',
      'Customer Representative',
      'Invoice Type',
      'Operation',
      'Profit Center',
      'Country',
      'Invoice Status',
      'Account Code',
      'Tax No',
      'Loading Number',
      'Position Number',
      'Notes',
    ]

    const cs_cols = [
      { wch: 13.5 },
      { wch: 10 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 40 },
    ]

    let rows = [cs_hd]
    //
    if (reports && reports.length > 0) {
      for (let i = 0; i < reports.length; i++) {
        const rp = reports[i]
        rows.push([
          rp.invoiceName,
          new Date(rp.invoiceDate),
          rp.invoicedCompany && rp.invoicedCompany.name,
          rp.accountCode,
          new Date(rp.dueDate),
          rp.netTotal,
          rp.vatTotal,
          rp.netTotal,
          rp.invoiceCurr && rp.invoiceCurr.name,
          rp.invoiceCurrRate,
          rp.unpaidAmount,
          rp.subTotal,
          rp.vatTotal,
          rp.rateAmount,
          rp.branch && rp.branch.name,
          rp.createdBy && rp.createdBy.name,
          rp.customerRep && rp.customerRep.name,
          rp.invoiceType === 'SATIS'
            ? 'SALES INVOICE'
            : rp.invoiceType === 'IADE'
            ? 'CREDIT NOTE'
            : rp.invoiceType === 'TEVKIFAT'
            ? 'VAT INVOICE'
            : '',
          rp.operation && rp.operation.name,
          rp.profitCenter && rp.profitCenter.name,
          rp.invoiceCountry && rp.invoiceCountry.code,
          rp.status === 'draft'
            ? 'Draft'
            : rp.status === 'cancelled'
            ? 'Cancelled'
            : rp.status === 'confirmed'
            ? 'Confirmed'
            : '',
          rp.accountCode,
          rp.invoicedCompany && rp.invoicedCompany.taxno,
          '',
          '',
          '',
        ])
      }
    }
    //
    rows.push([
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ])
    //
    rows.push([
      '',
      '',
      '',
      '',
      '',
      'Amount',
      'VAT',
      'Net Total',
      'Currency',
      '',
      'TOTAL(USD)',
      'TOTAL(EUR)',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ])
    //data
    rows.push([
      '',
      '',
      '',
      '',
      '',
      totalReport && totalReport.taxedAmount,
      totalReport && totalReport.vatAmount,
      totalReport && totalReport.netTotal,
      totalReport && totalReport.currency,
      '',
      totalReport && totalReport.totalUSD,
      totalReport && totalReport.totalEUR,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ])
    //
    rows.push([
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'TOTALS',
      totalReport && totalReport.totalUSD,
      totalReport && totalReport.totalEUR,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ])

    return excelHtml5(cs_hd, rows, cs_cols, authUser)
  }

  const handleHideFilter = (e) => {
    if (visibleFilter) {
      $('.dropdown-menu.filterMenu').addClass('show')
    }
  }

  const searchFilter = async (e) => {
    e.preventDefault()
    setVisibleFilter(false)
    $('.dropdown-menu.filterMenu').removeClass('show')
    const query = qs.parse(search)
    const data = {
      ...query,
      ...searchData,
    }
    const resData = await dispatch(findSearchReport(data)).unwrap()
    if (resData) {
      clearSearchData()
    }
  }

  const clearSearchData = () => {
    setSearchData({
      ...searchData,
      companyId: '',
      debitCredit: '',
      status: '',
      searchQuery: '',
      invoiceDateSelect: '',
      dueDateSelect: '',
      currId: '',
      userId: '',
    })
  }

  const handleCloseFilter = (e) => {
    e.preventDefault()
    setVisibleFilter(false)
    $('.dropdown-menu.filterMenu').removeClass('show')
  }

  useEffect(() => {
    return () => {
      dispatch(clearReportRecords())
    }
  }, [dispatch])

  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'actions',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row: { index } }) => <span>{index + 1}</span>,
      },
      {
        Header: 'Reference No',
        accessor: 'code',
      },
      {
        Header: 'Document Date',
        accessor: 'docDate',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span>{moment(value).format('L')}</span>,
      },
      {
        Header: 'Account',
        accessor: 'accountCode',
      },
      {
        Header: 'Related',
        accessor: 'dueDate',
        // eslint-disable-next-line react/prop-types
        // Cell: ({ value }) => <span>{moment(value).format('L')}</span>,
      },
      {
        Header: 'Notes',
        accessor: 'notes',
        // eslint-disable-next-line react/prop-types
        // Cell: ({ value }) => <span>{formatMoney(value)}</span>,
      },
      {
        Header: 'Document Type',
        accessor: 'docType',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span>{formatMoney(value)}</span>,
      },
      {
        id: 'Debit / Credit',
        Header: 'Net Total',
        accessor: 'netTotal',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span>{formatMoney(value)}</span>,
      },
      {
        Header: 'Total',
        accessor: 'invoiceCurr.name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span>{value}</span>,
      },
      {
        Header: 'Currency',
        accessor: 'invoiceCurrRate',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span>{formatMoney(value)}</span>,
      },
      {
        Header: 'User',
        accessor: 'unpaidAmount',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span>{formatMoney(value)}</span>,
      },
      {
        Header: 'Branch',
        accessor: 'branch.name',
      },
    ],
    [],
  )

  const data = useMemo(() => (reports && reports.length > 0 ? reports : []), [reports])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    pageOptions,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
    usePagination,
    useRowSelect,
  )

  const firstPageRows = rows.slice(0, 20)

  return (
    <div className="rawWrapper-container">
      <div className="pageContainer">
        <pre>{JSON.stringify(reports, 2, null)}</pre>
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <CCard className="cardCustom">
            <div className="card-header">
              <div className="toolBarContainer">
                <div className="customHeaderContainer">
                  <div className="customHeaderContainer-footer">
                    <div className="card-title">
                      <h3 className="cstCardbodyHeaderTitle">Financial Documents List</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CCardBody className="p-0">
              <div
                className="pageContainer-wrapper isTable"
                style={{ height: 'calc(100vh - 14rem)' }}
              >
                <div>
                  <CRow className="pageBoxSizing-filter clearfix">
                    <CCol sm={12} md={6} lg={6} xl={6}>
                      <div className="pageSearchContainer">
                        <div className="cst-search-box">
                          <CFormInput
                            type="text"
                            name="searchQuery"
                            placeholder="Search"
                            className="cst-search-input"
                            autoComplete="off"
                            onKeyUp={(e) => handleSearch(e)}
                            disabled={findingSearchReport ? true : false}
                          />
                          <CIcon icon={cilZoom} customClassName="icon-search" size="sm" />
                        </div>
                      </div>
                    </CCol>
                    <CCol sm={12} md={6} lg={6} xl={6}>
                      <div className="cstSearchActions">
                        <CDropdown
                          visible={visibleFilter}
                          onHide={handleHideFilter}
                          placement="right"
                        >
                          <CDropdownToggle
                            color="secondary"
                            variant="outline"
                            caret={false}
                            trigger="click"
                            disabled={findingSearchReport ? true : false}
                            className="drop mr-2 btn-400"
                          >
                            Add Filter <i className="fa fa-sort-amount-down ml-1"></i>
                          </CDropdownToggle>
                          <CDropdownMenu
                            style={{
                              width: '620px',
                              position: 'absolute',
                              right: '0px',
                              zIndex: '2',
                            }}
                            className="filterMenu"
                          >
                            <div id="simple_search_fields" data-select2-id="simple_search_fields">
                              <div className="row" data-select2-id="85">
                                <div
                                  className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"
                                  data-select2-id="113"
                                >
                                  <div
                                    className="form-group account required search_filter_account_id"
                                    data-select2-id="112"
                                  >
                                    <div data-select2-id="111">
                                      <div className="input-group" data-select2-id="110">
                                        <select
                                          className="form-control account_select select2-hidden-accessible"
                                          data-url="/roster/autocompletes.json?model=Financor::Account&amp;parent_type="
                                          data-plugin="lookup"
                                          data-minimuminputlength="0"
                                          data-placeholder="Account"
                                          data-parent-type2=""
                                          name="search[filter][account_id]"
                                          id="search_filter_account_id"
                                          aria-hidden="true"
                                          data-select2-id="search_filter_account_id"
                                        >
                                          <option value="" data-select2-id="79"></option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                  <div className="form-group string required search_filter_code">
                                    <input
                                      className="form-control string required"
                                      placeholder="Reference No"
                                      type="text"
                                      name="search[filter][code]"
                                      id="search_filter_code"
                                    />
                                  </div>
                                </div>
                                <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                  <div className="form-group select required search_filter_curr">
                                    <select
                                      className="form-control select required"
                                      name="search[filter][curr]"
                                      id="search_filter_curr"
                                    >
                                      <option value="">Currency</option>
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
                                    </select>
                                  </div>
                                </div>
                                <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                  <div className="form-group select required search_filter_dc">
                                    <select
                                      className="form-control select required"
                                      name="search[filter][dc]"
                                      id="search_filter_dc"
                                    >
                                      <option value="">Debit - Credit</option>
                                      <option value="debit">Debit</option>
                                      <option value="credit">Credit</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                  <div className="form-group select required search_filter_operation_id">
                                    <select
                                      className="form-control select required"
                                      name="search[filter][operation_id]"
                                      id="search_filter_operation_id"
                                    >
                                      <option value="">Operation</option>
                                      <option value="7257">Air Transports Team</option>
                                      <option value="7626">Domestic Road Transport</option>
                                      <option value="7255">Fleet Management Team</option>
                                      <option value="7258">Ocean Transports Team</option>
                                      <option value="7660">Rail Transport Team</option>
                                      <option value="7254">Road Transports Team</option>
                                      <option value="7256">Sales Team</option>
                                    </select>
                                  </div>
                                </div>
                                <div
                                  className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"
                                  data-select2-id="127"
                                >
                                  <div
                                    className="form-group select required search_filter_findoc_type_id"
                                    data-select2-id="126"
                                  >
                                    <div data-select2-id="125">
                                      <div className="input-group" data-select2-id="124">
                                        <input
                                          name="search[filter][findoc_type_id][]"
                                          type="hidden"
                                          value=""
                                        />
                                        <select
                                          className="form-control select required select2-hidden-accessible"
                                          data-plugin="select2"
                                          multiple=""
                                          data-placeholder="Document Type"
                                          name="search[filter][findoc_type_id][]"
                                          id="search_filter_findoc_type_id"
                                          aria-hidden="true"
                                          data-select2-id="search_filter_findoc_type_id"
                                        >
                                          <option value="535" data-select2-id="128">
                                            Bank Incomes
                                          </option>
                                          <option value="532" data-select2-id="129">
                                            Work Advance From Bank Account
                                          </option>
                                          <option value="530" data-select2-id="130">
                                            Salary Payment From Bank Account
                                          </option>
                                          <option value="536" data-select2-id="131">
                                            Bank Payments
                                          </option>
                                          <option value="531" data-select2-id="132">
                                            Personal Advance From Bank Account
                                          </option>
                                          <option value="559" data-select2-id="133">
                                            Send Cheque to Bank For Collection
                                          </option>
                                          <option value="557" data-select2-id="134">
                                            Cheque Collect
                                          </option>
                                          <option value="582" data-select2-id="135">
                                            Legal Follow Up To Cheque
                                          </option>
                                          <option value="558" data-select2-id="136">
                                            Cheque to Portfolio
                                          </option>
                                          <option value="555" data-select2-id="137">
                                            Return Endorsed Cheque{' '}
                                          </option>
                                          <option value="562" data-select2-id="138">
                                            Return Cheque
                                          </option>
                                          <option value="565" data-select2-id="139">
                                            Cheque Payment
                                          </option>
                                          <option value="563" data-select2-id="140">
                                            Cheque Indorsement
                                          </option>
                                          <option value="576" data-select2-id="141">
                                            Return Pmnote
                                          </option>
                                          <option value="577" data-select2-id="142">
                                            Pmnote Payment
                                          </option>
                                          <option value="575" data-select2-id="143">
                                            Issuing a Ledger
                                          </option>
                                          <option value="548" data-select2-id="144">
                                            Transfer Between Companies
                                          </option>
                                          <option value="540" data-select2-id="145">
                                            EFT Payment
                                          </option>
                                          <option value="539" data-select2-id="146">
                                            EFT Collection
                                          </option>
                                          <option value="550" data-select2-id="147">
                                            Returning Work Advance
                                          </option>
                                          <option value="553" data-select2-id="148">
                                            Work Advance
                                          </option>
                                          <option value="471" data-select2-id="149">
                                            Unpaid Cheque
                                          </option>
                                          <option value="584" data-select2-id="150">
                                            Return Unpaid Cheque
                                          </option>
                                          <option value="543" data-select2-id="151">
                                            Cashpoint Payments
                                          </option>
                                          <option value="560" data-select2-id="152">
                                            Customer Cheque Endorsement
                                          </option>
                                          <option value="556" data-select2-id="153">
                                            Return Customer Cheque
                                          </option>
                                          <option value="572" data-select2-id="154">
                                            Customer Pmnote Endorsement
                                          </option>
                                          <option value="571" data-select2-id="155">
                                            Return Customer Pmnote
                                          </option>
                                          <option value="547" data-select2-id="156">
                                            Cash Payments to Companies
                                          </option>
                                          <option value="541" data-select2-id="157">
                                            Cashpoint Collection
                                          </option>
                                          <option value="579" data-select2-id="158">
                                            Unfollow Payments
                                          </option>
                                          <option value="578" data-select2-id="159">
                                            Unfollow Incomes
                                          </option>
                                          <option value="587" data-select2-id="160">
                                            New Policy
                                          </option>
                                          <option value="581" data-select2-id="161">
                                            Transfer Between Portfolios
                                          </option>
                                          <option value="549" data-select2-id="162">
                                            Returning Personal Advance
                                          </option>
                                          <option value="554" data-select2-id="163">
                                            Personal Advance
                                          </option>
                                          <option value="590" data-select2-id="164">
                                            Return Driver Advance
                                          </option>
                                          <option value="551" data-select2-id="165">
                                            Driver Advance
                                          </option>
                                          <option value="552" data-select2-id="166">
                                            Driver Costs
                                          </option>
                                          <option value="589" data-select2-id="167">
                                            Driver Payments
                                          </option>
                                          <option value="567" data-select2-id="168">
                                            Send Pmnote to The Bank For Collection
                                          </option>
                                          <option value="574" data-select2-id="169">
                                            Collect Pmnote
                                          </option>
                                          <option value="580" data-select2-id="170">
                                            Legal Follow Up To Pmnote
                                          </option>
                                          <option value="573" data-select2-id="171">
                                            Pmnote To Portfolio
                                          </option>
                                          <option value="561" data-select2-id="172">
                                            Collect Cheque To Bank Account
                                          </option>
                                          <option value="564" data-select2-id="173">
                                            Return Cheque For Collection
                                          </option>
                                          <option value="569" data-select2-id="174">
                                            Return Pmnote For Collection
                                          </option>
                                          <option value="570" data-select2-id="175">
                                            Collect Pmnote To Bank Account
                                          </option>
                                          <option value="566" data-select2-id="176">
                                            Bank Cheque Collection
                                          </option>
                                          <option value="568" data-select2-id="177">
                                            Guarantee Pmnote Bank Collection
                                          </option>
                                          <option value="538" data-select2-id="178">
                                            Transfer
                                          </option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                  <div className="form-group select required search_filter_ledger_status">
                                    <select
                                      className="form-control select required"
                                      name="search[filter][ledger_status]"
                                      id="search_filter_ledger_status"
                                    >
                                      <option value="">Accounting Status</option>
                                      <option value="ledgered">Ledgered</option>
                                      <option value="notledgered">Not-Ledgered</option>
                                    </select>
                                  </div>
                                </div>
                                <div
                                  className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"
                                  data-select2-id="104"
                                >
                                  <div
                                    className="form-group select required search_filter_branch_id"
                                    data-select2-id="103"
                                  >
                                    <div data-select2-id="102">
                                      <div className="input-group" data-select2-id="101">
                                        <input
                                          name="search[filter][branch_id][]"
                                          type="hidden"
                                          value=""
                                        />
                                        <select
                                          className="form-control select required select2-hidden-accessible"
                                          data-plugin="select2"
                                          multiple=""
                                          data-placeholder="Branch"
                                          name="search[filter][branch_id][]"
                                          id="search_filter_branch_id"
                                          aria-hidden="true"
                                          data-select2-id="search_filter_branch_id"
                                        >
                                          <option value="1531" data-select2-id="105">
                                            Branch B
                                          </option>
                                          <option value="1528" data-select2-id="106">
                                            Head Office
                                          </option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"
                                  data-select2-id="97"
                                >
                                  <div
                                    className="form-group select required search_filter_user_id"
                                    data-select2-id="96"
                                  >
                                    <div data-select2-id="95">
                                      <div className="input-group" data-select2-id="94">
                                        <select
                                          className="form-control select required select2-hidden-accessible"
                                          data-plugin="select2"
                                          data-placeholder="User"
                                          name="search[filter][user_id]"
                                          id="search_filter_user_id"
                                          aria-hidden="true"
                                          data-select2-id="search_filter_user_id"
                                        >
                                          <option value="" data-select2-id="68"></option>
                                          <option value="4121" data-select2-id="98">
                                            James
                                          </option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"
                                  data-select2-id="84"
                                >
                                  <div
                                    className="form-group select required search_filter_approver_id"
                                    data-select2-id="83"
                                  >
                                    <div data-select2-id="82">
                                      <div className="input-group" data-select2-id="81">
                                        <select
                                          className="form-control select required select2-hidden-accessible"
                                          data-plugin="select2"
                                          data-placeholder="Approver"
                                          name="search[filter][approver_id]"
                                          id="search_filter_approver_id"
                                          aria-hidden="true"
                                          data-select2-id="search_filter_approver_id"
                                        >
                                          <option value="" data-select2-id="71"></option>
                                          <option value="4121" data-select2-id="91">
                                            James
                                          </option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                  <div className="form-group select required search_filter_doc_date_select">
                                    <select
                                      className="form-control select required"
                                      name="search[filter][doc_date_select]"
                                      id="search_filter_doc_date_select"
                                    >
                                      <option value="">Document Date</option>
                                      <option value="yesterday">Yesterday</option>
                                      <option value="today">Today</option>
                                      <option value="tomorrow">Tomorrow</option>
                                      <option value="last_week">Last Week</option>
                                      <option value="this_week">This Week</option>
                                      <option value="last_month">Last Month</option>
                                      <option value="this_month">This Month</option>
                                      <option value="last_90_days">Last 90 Days</option>
                                      <option value="last_year">Last Year</option>
                                      <option value="this_year">This Year</option>
                                      <option value="custom_date">Specify Date Range</option>
                                    </select>
                                  </div>
                                  <div
                                    className="form-group date_interval required search_filter_doc_date"
                                    style={{ display: 'none' }}
                                  >
                                    <div className="input-group date w-100">
                                      <input
                                        className="form-control appearence-none"
                                        type="date"
                                        name="search[filter][doc_date1]"
                                        id="search_filter_doc_date1"
                                      />
                                      <div className="input-group-append">
                                        <span className="input-group-text">
                                          <i className="far fa-ellipsis-h"></i>
                                        </span>
                                      </div>
                                      <input
                                        className="form-control appearence-none"
                                        type="date"
                                        name="search[filter][doc_date2]"
                                        id="search_filter_doc_date2"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                  <div className="form-group string required search_filter_total_amount1">
                                    <input
                                      className="form-control string required"
                                      placeholder="Min Total"
                                      type="text"
                                      name="search[filter][total_amount1]"
                                      id="search_filter_total_amount1"
                                    />
                                  </div>
                                </div>
                                <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                  <div className="form-group string required search_filter_total_amount2">
                                    <input
                                      className="form-control string required"
                                      placeholder="Max Total"
                                      type="text"
                                      name="search[filter][total_amount2]"
                                      id="search_filter_total_amount2"
                                    />
                                  </div>
                                </div>
                                <div
                                  className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"
                                  data-select2-id="118"
                                >
                                  <div
                                    className="form-group select required search_filter_status"
                                    data-select2-id="117"
                                  >
                                    <div data-select2-id="116">
                                      <div className="input-group" data-select2-id="115">
                                        <select
                                          className="form-control select required select2-hidden-accessible"
                                          data-plugin="select2"
                                          data-placeholder="Status"
                                          name="search[filter][status]"
                                          id="search_filter_status"
                                          aria-hidden="true"
                                          data-select2-id="search_filter_status"
                                        >
                                          <option value="" data-select2-id="77"></option>
                                          <option value="draft" data-select2-id="119">
                                            Draft
                                          </option>
                                          <option value="pending" data-select2-id="120">
                                            Pending
                                          </option>
                                          <option value="confirmed" data-select2-id="121">
                                            Confirmed
                                          </option>
                                          <option value="denied" data-select2-id="122">
                                            Denied
                                          </option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                  <div className="form-group multi_value required search_filter_account_code">
                                    <div className="input-group date w-100">
                                      <input
                                        className="form-control"
                                        type="text"
                                        name="search[filter][account_code1]"
                                        id="search_filter_account_code1"
                                      />
                                      <div className="input-group-append">
                                        <span className="input-group-text">
                                          <i className="far fa-ellipsis-h"></i>
                                        </span>
                                      </div>
                                      <input
                                        className="form-control"
                                        type="text"
                                        name="search[filter][account_code2]"
                                        id="search_filter_account_code2"
                                      />
                                    </div>
                                    <p className="help-block">Account Code</p>
                                  </div>
                                </div>
                                <div className="form-group hidden search_filter_expense_form_id">
                                  <input
                                    className="form-control hidden"
                                    type="hidden"
                                    name="search[filter][expense_form_id]"
                                    id="search_filter_expense_form_id"
                                  />
                                </div>
                                <div className="form-group hidden search_filter_parent_type">
                                  <input
                                    className="form-control hidden"
                                    type="hidden"
                                    name="search[filter][parent_type]"
                                    id="search_filter_parent_type"
                                  />
                                </div>
                                <div className="form-group hidden search_filter_action_type">
                                  <input
                                    className="form-control hidden"
                                    type="hidden"
                                    name="search[filter][action_type]"
                                    id="search_filter_action_type"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-end">
                              <CButton
                                color="secondary"
                                variant="ghost"
                                className="mr-2"
                                onClick={(e) => handleCloseFilter(e)}
                              >
                                Close
                              </CButton>
                              <CButton
                                type="submit"
                                color="primary"
                                onClick={(e) => searchFilter(e)}
                              >
                                Search
                              </CButton>
                            </div>
                          </CDropdownMenu>
                        </CDropdown>
                        <CDropdown>
                          <CDropdownToggle
                            color="secondary"
                            variant="outline"
                            className="drop btn-drop-rounded"
                            caret={false}
                            disabled={reports && !reports.length > 0 ? true : false}
                          >
                            <i className="fa fa-download" style={{ marginLeft: '3px' }} />
                          </CDropdownToggle>
                          <CDropdownMenu className="downloadMenu">
                            {/* <CDropdownItem href="#" onClick={(e) => e.preventDefault()}>
                            <i className="fa fa-file-pdf" style={{ marginRight: '7px' }} />
                            PDF
                          </CDropdownItem> */}
                            <CDropdownItem href="#" onClick={(e) => exportToExcel(e)}>
                              <i className="fa fa-file-excel" style={{ marginRight: '7px' }} />
                              Excel
                            </CDropdownItem>
                            {/* <CDropdownItem href="#">
                            <i className="fa fa-save" style={{ marginRight: '7px' }} />
                            Save
                          </CDropdownItem> */}
                          </CDropdownMenu>
                        </CDropdown>
                      </div>
                    </CCol>
                  </CRow>
                  <div className="pageBoxSizing-container">
                    <div className="table-responsive table-truncate pageTableWrapper">
                      {findingSearchReport ? (
                        <div className="table-info">
                          <span className="mt-5">
                            <img src={loaderLg} alt="" />
                          </span>
                        </div>
                      ) : firstPageRows.length > 0 ? (
                        <>
                          <table className="table pageTable" {...getTableProps()}>
                            <thead>
                              {headerGroups.map((headerGroup) => {
                                const { key, ...restHeaderGroupProps } =
                                  headerGroup.getHeaderGroupProps()
                                return (
                                  <tr key={key} {...restHeaderGroupProps}>
                                    {headerGroup.headers.map((column) => {
                                      const {
                                        render,
                                        getHeaderProps,
                                        isSorted,
                                        isSortedDesc,
                                        getSortByToggleProps,
                                      } = column
                                      const extraClass = isSorted
                                        ? isSortedDesc
                                          ? 'desc'
                                          : 'asc'
                                        : ''
                                      const { key, ...restColumn } = getHeaderProps(
                                        getSortByToggleProps(),
                                      )
                                      return (
                                        <th className={extraClass} key={key} {...restColumn}>
                                          {render('Header')}
                                        </th>
                                      )
                                    })}
                                  </tr>
                                )
                              })}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                              {rows.map((row, i) => {
                                prepareRow(row)
                                const { key, ...restRowProps } = row.getRowProps()
                                return (
                                  <tr key={key} {...restRowProps}>
                                    {row.cells.map((cell) => {
                                      const { key, ...restCellProps } = cell.getCellProps()
                                      return (
                                        <td key={key} {...restCellProps}>
                                          {cell.render('Cell')}
                                        </td>
                                      )
                                    })}
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                          {/* table pagination */}
                          {!findingSearchReport && (
                            <div className="table-page">
                              {firstPageRows.length > 0 && (
                                <div>
                                  <span>
                                    Showing page {pageIndex + 1} of {pageOptions.length} -{' '}
                                    {data.length}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="table-info">
                          <span>No records found, use search field or filter to see results </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="m-3 is-overflow">
                  <FindocListTable findingSearchReport={findingSearchReport} reports={reports} />
                </div>
              </div>
            </CCardBody>
          </CCard>
        </div>
      </div>
    </div>
  )
}

export default Findoc
