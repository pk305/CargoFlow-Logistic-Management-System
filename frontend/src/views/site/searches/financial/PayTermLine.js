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
  CFormSelect,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFilter, cilZoom } from '@coreui/icons'
import { useTable, useSortBy, usePagination, useRowSelect } from 'react-table'
import InvoiceListTable from './InvoiceListTable'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import { findSearchReport, clearReportRecords } from 'src/redux/slices/reportSlice'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import $ from 'jquery'
import { saveAs } from 'file-saver'
import { isEmpty, isNull, toUpper } from 'lodash'
import { fetchCompanies } from 'src/redux/slices/companySlice'
import { fetchCurrencies } from 'src/redux/slices/currencySlice'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import moment from 'moment'
import classNames from 'classnames'
import { formatMoney, s2ab } from 'src/config/helpers'

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

const PayTermLine = () => {
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
  const { fetchingCompanies, companies } = useSelector((state) => state.company)
  const { fetchingCurrencies, currencies } = useSelector((state) => state.currency)
  const { fetchingUsers, users } = useSelector((state) => state.user)
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
      formData.append('model', 'Invoicelist')
      formData.append('req', 'PayTermLine')
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

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setSearchData({
      ...searchData,
      [name]: value,
    })

    setVisibleFilter(true)
  }

  const handleSelectForm = (c, val) => {
    const e = {
      target: {
        name: c,
        value: !isNull(val) ? val.value : '',
      },
    }
    handleChangeForm(e)
  }

  const handleSelectFocus = (c, _) => {
    if (c === 'companyId') {
      if (isEmpty(companies)) {
        dispatch(fetchCompanies())
      }
    } else if (c === 'currId') {
      if (isEmpty(currencies)) {
        dispatch(fetchCurrencies())
      }
    }
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
        Header: 'Invoice No',
        accessor: 'invoiceName',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <span>
            <a
              target="_blank"
              href={`/invoices/${original.linkId}`}
              className="redirect-link font-weight-bold"
              rel="noreferrer"
            >
              {toUpper(value)}
            </a>
          </span>
        ),
      },
      {
        Header: 'Date',
        accessor: 'invoiceDate',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span>{moment(value).format('L')}</span>,
      },
      {
        Header: 'Company',
        accessor: 'invoicedCompany.name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span className="font-weight-bold">{value}</span>,
      },
      {
        Header: 'Account Code',
        accessor: 'accountCode',
      },
      {
        Header: 'Due Date',
        accessor: 'dueDate',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span>{moment(value).format('L')}</span>,
      },
      {
        Header: 'Amount',
        accessor: 'netTotal',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span>{formatMoney(value)}</span>,
      },
      {
        Header: 'VAT',
        accessor: 'vatTotal',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span>{formatMoney(value)}</span>,
      },
      {
        id: 'netT',
        Header: 'Net Total',
        accessor: 'netTotal',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span>{formatMoney(value)}</span>,
      },
      {
        Header: 'Currency',
        accessor: 'invoiceCurr.name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span>{value}</span>,
      },
      {
        Header: 'Exch.Rate',
        accessor: 'invoiceCurrRate',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span>{formatMoney(value)}</span>,
      },
      {
        Header: 'Unpaid Amount',
        accessor: 'unpaidAmount',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span>{formatMoney(value)}</span>,
      },
      {
        Header: 'Amount',
        accessor: 'rateAmount',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span>{formatMoney(value)}</span>,
      },
      {
        Header: 'Branch',
        accessor: 'branch.name',
      },
      {
        Header: 'User',
        accessor: 'createdBy.name',
      },
      {
        Header: 'Invoice Type',
        accessor: 'invoiceType',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => (
          <span>
            {value === 'SATIS'
              ? 'SALES INVOICE'
              : value === 'IADE'
              ? 'CREDIT NOTE'
              : value === 'TEVKIFAT'
              ? 'VAT INVOICE'
              : null}
          </span>
        ),
      },
      {
        Header: 'Country',
        accessor: 'invoiceCountry.name',
      },
      {
        Header: 'Profit Center',
        accessor: 'profitCenter.name',
      },
      {
        Header: 'Invoice Status',
        accessor: 'invoiceStatus',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <span>
            <span
              className={classNames('font-weight-bold truncate', {
                // eslint-disable-next-line react/prop-types
                'text-info': original.status === 'draft',
                // eslint-disable-next-line react/prop-types
                'text-cancelled': original.status === 'cancelled',
                // eslint-disable-next-line react/prop-types
                'text-confirmed': original.status === 'confirmed',
              })}
            >
              {/*  eslint-disable-next-line react/prop-types */}
              {original.status === 'draft'
                ? 'Draft'
                : //  eslint-disable-next-line react/prop-types
                original.status === 'cancelled'
                ? 'Cancelled'
                : //  eslint-disable-next-line react/prop-types
                original.status === 'confirmed'
                ? 'Confirmed'
                : null}
            </span>
          </span>
        ),
      },
      {
        Header: 'Position Reference',
        accessor: 's',
      },
      {
        Header: 'Loading Reference',
        accessor: 'q',
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
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <CCard className="cardCustom">
            <div className="card-header">
              <div className="toolBarContainer">
                <div className="customHeaderContainer">
                  <div className="customHeaderContainer-footer">
                    <div className="card-title">
                      <h3 className="cstCardbodyHeaderTitle">
                        Bank Loans-Policies Installment List
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CCardBody className="p-0">
              <div className="pageContainer-wrapper" style={{ minHeight: '0px' }}>
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
                          <CIcon icon={cilFilter} /> Filter
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
                          <div id="simple_search_fields">
                            <div className="row">
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group company search_filter_company_id">
                                  <div className="input-group">
                                    <Select
                                      className="form-control form-control-cst pageCstSelect"
                                      classNamePrefix="cstSelect"
                                      isClearable
                                      placeholder="Company"
                                      isSearchable
                                      id="search_filter_company_id"
                                      isLoading={fetchingCompanies ? true : false}
                                      options={
                                        companies && !fetchingCompanies && companies.length > 0
                                          ? companies.map((itm) => ({
                                              label: itm.name,
                                              value: itm.id,
                                            }))
                                          : []
                                      }
                                      noOptionsMessage={() => 'No results found'}
                                      onChange={(e) => handleSelectForm('companyId', e)}
                                      onMenuOpen={(e) => handleSelectFocus('companyId', e)}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group search_filter_debit_credit">
                                  <CFormSelect
                                    className="form-control-cst"
                                    id="search_filter_debit_credit"
                                    name="debitCredit"
                                    value={searchData.debitCredit}
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option value="">Debit/Credit Type</option>
                                    <option value="debit">Sales Invoice</option>
                                    <option value="credit">Purchase Invoice</option>
                                  </CFormSelect>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group search_filter_curr">
                                  <div className="input-group">
                                    <Select
                                      className="form-control form-control-cst pageCstSelect"
                                      classNamePrefix="cstSelect"
                                      isClearable
                                      placeholder="Currency"
                                      isSearchable
                                      id="search_filter_curr"
                                      autoFocus={false}
                                      isLoading={fetchingCurrencies ? true : false}
                                      options={
                                        currencies && !fetchingCurrencies && currencies.length > 0
                                          ? currencies.map((itm) => ({
                                              label: itm.name,
                                              value: itm.id,
                                            }))
                                          : []
                                      }
                                      noOptionsMessage={() => 'No results found'}
                                      onChange={(e) => handleSelectForm('currId', e)}
                                      onMenuOpen={(e) => handleSelectFocus('currId', e)}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group search_filter_status">
                                  <CFormSelect
                                    className="form-control-cst"
                                    id="search_filter_status"
                                    name="status"
                                    value={searchData.status}
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option value="">Status</option>
                                    <option value="draft">Draft</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                  </CFormSelect>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group search_filter_vat_status">
                                  <div>
                                    <div className="input-group">
                                      <CFormSelect
                                        className="form-control-cst"
                                        id="search_filter_vat_status"
                                        name="vatStatus"
                                        value={searchData.vatStatus}
                                        onChange={(e) => handleChangeForm(e)}
                                      >
                                        <option value="">Vat Status</option>
                                        <option value="withvat">Vat</option>
                                        <option value="withoutvat">No Vat</option>
                                      </CFormSelect>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group search_filter_ledger_status">
                                  <CFormSelect
                                    className="form-control-cst"
                                    id="search_filter_ledger_status"
                                    name="ledgerStatus"
                                    value={searchData.ledgerStatus}
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option value="">Ledger Status</option>
                                    <option value="ledgered">Ledgered</option>
                                    <option value="notledgered">Not-Ledgered</option>
                                  </CFormSelect>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group search_filter_operation_id">
                                  <CFormSelect
                                    className="form-control-cst"
                                    id="search_filter_operation_id"
                                    name="operationId"
                                    value={searchData.operationId}
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option value="">Operation</option>
                                    <option value="6641">Air Transports Team</option>
                                    <option value="6639">Fleet Management Team</option>
                                    <option value="6642">Ocean Transports Team</option>
                                    <option value="6638">Road Transports Team</option>
                                    <option value="6640">Sales Team</option>
                                    <option value="6643">Warehouse</option>
                                  </CFormSelect>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group search_filter_branch_id">
                                  <div>
                                    <div className="input-group">
                                      <Select
                                        className="form-control form-control-cst pageCstSelect"
                                        classNamePrefix="cstSelect"
                                        isClearable
                                        placeholder="Branch"
                                        isSearchable
                                        id="search_filter_branch_id"
                                        autoFocus={false}
                                        isLoading={fetchingCurrencies ? true : false}
                                        options={
                                          // currencies && !fetchingCurrencies && currencies.length > 0
                                          //   ? currencies.map((itm) => ({
                                          //       label: itm.name,
                                          //       value: itm.id,
                                          //     }))
                                          //   : []
                                          []
                                        }
                                        noOptionsMessage={() => 'No results found'}
                                        onChange={(val) => handleSelectForm('branchId', val)}
                                        onMenuOpen={(e) => handleSelectFocus('branchId', e)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group search_filter_user_id">
                                  <div>
                                    <div className="input-group">
                                      <Select
                                        className="form-control form-control-cst pageCstSelect"
                                        classNamePrefix="cstSelect"
                                        isClearable
                                        placeholder="User"
                                        isSearchable
                                        id="search_filter_branch_id"
                                        autoFocus={false}
                                        isLoading={fetchingUsers ? true : false}
                                        options={
                                          users && !fetchingUsers && users.length > 0
                                            ? users.map((itm) => ({
                                                label: itm.name,
                                                value: itm.uuid,
                                              }))
                                            : []
                                        }
                                        noOptionsMessage={() => 'No results found'}
                                        onChange={(val) => handleSelectForm('userId', val)}
                                        onMenuOpen={(e) => handleSelectFocus('userId', e)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group search_filter_work_type">
                                  <div>
                                    <div className="input-group">
                                      <Select
                                        className="form-control form-control-cst pageCstSelect"
                                        classNamePrefix="cstSelect"
                                        isClearable
                                        placeholder="Invoice Type"
                                        isSearchable
                                        id="search_filter_work_type"
                                        autoFocus={false}
                                        isLoading={fetchingCurrencies ? true : false}
                                        options={
                                          // currencies && !fetchingCurrencies && currencies.length > 0
                                          //   ? currencies.map((itm) => ({
                                          //       label: itm.name,
                                          //       value: itm.id,
                                          //     }))
                                          //   : []
                                          []
                                        }
                                        noOptionsMessage={() => 'No results found'}
                                        onChange={(val) => handleSelectForm('countryId', val)}
                                        onMenuOpen={(e) => handleSelectFocus('countryId', e)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group search_filter_trans_method">
                                  <div>
                                    <div className="input-group">
                                      <Select
                                        className="form-control form-control-cst pageCstSelect"
                                        classNamePrefix="cstSelect"
                                        isClearable
                                        placeholder="Trans Method"
                                        isSearchable
                                        id="search_filter_trans_method"
                                        autoFocus={false}
                                        isLoading={fetchingCurrencies ? true : false}
                                        options={
                                          currencies && !fetchingCurrencies && currencies.length > 0
                                            ? currencies.map((itm) => ({
                                                label: itm.name,
                                                value: itm.id,
                                              }))
                                            : []
                                        }
                                        noOptionsMessage={() => 'No results found'}
                                        onChange={(val) => handleSelectForm('countryId', val)}
                                        onMenuOpen={(e) => handleSelectFocus('countryId', e)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group search_filter_invoice_type">
                                  <div>
                                    <div className="input-group">
                                      <Select
                                        className="form-control form-control-cst pageCstSelect"
                                        classNamePrefix="cstSelect"
                                        isClearable
                                        placeholder="Invoive Type"
                                        isSearchable
                                        id="search_filter_invoice_type"
                                        autoFocus={false}
                                        isLoading={fetchingCurrencies ? true : false}
                                        options={
                                          currencies && !fetchingCurrencies && currencies.length > 0
                                            ? currencies.map((itm) => ({
                                                label: itm.name,
                                                value: itm.id,
                                              }))
                                            : []
                                        }
                                        noOptionsMessage={() => 'No results found'}
                                        onChange={(val) => handleSelectForm('countryId', val)}
                                        onMenuOpen={(e) => handleSelectFocus('countryId', e)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group profit_center search_filter_profit_center_id">
                                  <div>
                                    <div className="input-group">
                                      <Select
                                        className="form-control form-control-cst pageCstSelect"
                                        classNamePrefix="cstSelect"
                                        isClearable
                                        placeholder="Profit Center"
                                        isSearchable
                                        id="search_filter_invoice_type"
                                        autoFocus={false}
                                        isLoading={fetchingCurrencies ? true : false}
                                        options={
                                          currencies && !fetchingCurrencies && currencies.length > 0
                                            ? currencies.map((itm) => ({
                                                label: itm.name,
                                                value: itm.id,
                                              }))
                                            : []
                                        }
                                        noOptionsMessage={() => 'No results found'}
                                        onChange={(val) => handleSelectForm('countryId', val)}
                                        onMenuOpen={(e) => handleSelectFocus('countryId', e)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group search_filter_country_type">
                                  <CFormSelect
                                    className="form-control-cst"
                                    id="search_filter_country_type"
                                    name="countryType"
                                    value={searchData.countryType}
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option value="">Homeland / Foreign</option>
                                    <option value="homeland">Homeland</option>
                                    <option value="foreign">Foreign</option>
                                  </CFormSelect>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group search_filter_contract_type">
                                  <CFormSelect
                                    className="form-control-cst"
                                    id="search_filter_contract_type"
                                    name="contractType"
                                    value={searchData.contractType}
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option value="">Contract</option>
                                    <option value="rented">Contracted Vehicle</option>
                                    <option value="owned">Our Own Vehicle</option>
                                  </CFormSelect>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group search_filter_operation_type">
                                  <CFormSelect
                                    className="form-control-cst"
                                    id="search_filter_operation_type"
                                    name="operationType"
                                    value={searchData.operationType}
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option value="">Operation Type</option>
                                    <option value="export">Export</option>
                                    <option value="import">Import</option>
                                    <option value="inland">Inland</option>
                                    <option value="antrepo">Customs Warehouse</option>
                                    <option value="depot">Warehouse</option>
                                    <option value="manuel">Non-Operational</option>
                                  </CFormSelect>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group string search_filter_vehicle_code">
                                  <CFormInput
                                    className="form-control-cst"
                                    placeholder="Vehicle Code"
                                    type="text"
                                    id="search_filter_vehicle_code"
                                    name="vehicleCode"
                                    value={searchData.vehicleCode}
                                    onChange={(e) => handleChangeForm(e)}
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group search_filter_loading_status">
                                  <CFormSelect
                                    className="form-control-cst"
                                    id="search_filter_loading_status"
                                    name="loadingStatus"
                                    value={searchData.loadingStatus}
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option value="">Loading Type</option>
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                    <option value="closed">Completed (Archived)</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="delivered">Delivered</option>
                                  </CFormSelect>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group search_filter_invoice_date_select">
                                  <div className="input-group">
                                    <CFormSelect
                                      className="form-control-cst"
                                      id="search_filter_loading_status"
                                      name="invoiceDateSelect"
                                      value={searchData.invoiceDateSelect}
                                      onChange={(e) => handleChangeForm(e)}
                                    >
                                      <option value="">Invoice Date</option>
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
                                    </CFormSelect>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group search_filter_due_date_select">
                                  <CFormSelect
                                    id="search_filter_due_date_select"
                                    className="form-control-cst"
                                    name="dueDateSelect"
                                    value={searchData.dueDateSelect}
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option value="">Due Date Range</option>
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
                                  </CFormSelect>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group search_filter_ledger_date_select">
                                  <CFormSelect
                                    id="search_filter_ledger_date_select"
                                    className="form-control-cst"
                                    name="ledgerDateSelect"
                                    value={searchData.ledgerDateSelect}
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option value="">Ledger Date</option>
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
                                  </CFormSelect>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group search_filter_approval_date_type">
                                  <CFormSelect
                                    className="form-control-cst"
                                    name="search[filter][approval_date_type]"
                                    id="search_filter_approval_date_type"
                                  >
                                    <option value="approval_date">First Conf.Date</option>
                                    <option value="ledger_approval_date">Sec. Conf. Date</option>
                                    <option value="payment_approval_date">
                                      Payment Conf. Date
                                    </option>
                                    <option value="operation_date">Operation Date</option>
                                  </CFormSelect>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group search_filter_approval_date_select">
                                  <CFormSelect
                                    className="form-control-cst"
                                    name="search[filter][approval_date_select]"
                                    id="search_filter_approval_date_select"
                                  >
                                    <option value="">Date range</option>
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
                                  </CFormSelect>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group search_filter_payment_type">
                                  <CFormSelect
                                    className="form-control-cst"
                                    name="search[filter][payment_type]"
                                    id="search_filter_payment_type"
                                  >
                                    <option value="">Invoice Payment Status</option>
                                    <option value="paid">Paid</option>
                                    <option value="unpaid">Unpaid</option>
                                  </CFormSelect>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group string search_filter_loading_reference">
                                  <CFormInput
                                    className="form-control-cst"
                                    placeholder="Loading Reference"
                                    type="text"
                                    name="search[filter][loading_reference]"
                                    id="search_filter_loading_reference"
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group string search_filter_position_reference">
                                  <CFormInput
                                    className="form-control-cst"
                                    placeholder="Position Reference"
                                    type="text"
                                    name="search[filter][position_reference]"
                                    id="search_filter_position_reference"
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                <div className="form-group multi_value search_filter_invoice_account_code">
                                  <div className="input-group date w-100">
                                    <CFormInput
                                      className="form-control-cst"
                                      type="text"
                                      name="search[filter][invoice_account_code1]"
                                      id="search_filter_invoice_account_code1"
                                    />
                                    <div className="input-group-append">
                                      <span className="input-group-text">
                                        <i className="fa fa-ellipsis-h"></i>
                                      </span>
                                    </div>
                                    <CFormInput
                                      className="form-control-cst"
                                      type="text"
                                      name="search[filter][invoice_account_code2]"
                                      id="search_filter_invoice_account_code2"
                                    />
                                  </div>
                                  <p className="help-block">Account Code</p>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"></div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"></div>
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
                <InvoiceListTable findingSearchReport={findingSearchReport} reports={reports} />
              </div>
            </CCardBody>
          </CCard>
        </div>
      </div>
    </div>
  )
}

export default PayTermLine
