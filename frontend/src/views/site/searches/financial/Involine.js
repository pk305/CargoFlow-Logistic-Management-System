import React, { useMemo, useState } from 'react'
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
import { cilFilter } from '@coreui/icons'
import { useTable, useSortBy } from 'react-table'
// import { useLocation } from 'react-router-dom'
// import qs from 'query-string'
// import { findSearchReport } from 'src/redux/slices/reportSlice'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import $ from 'jquery'
import { saveAs } from 'file-saver'
import { isEmpty, isNull } from 'lodash'
import { fetchCompanies } from 'src/redux/slices/companySlice'
import { fetchCurrencies } from 'src/redux/slices/currencySlice'
var XLSX = require('xlsx-js-style')

function s2ab(s) {
  var buf = new ArrayBuffer(s.length) //convert s to arrayBuffer
  var view = new Uint8Array(buf) //create uint8array as viewer
  for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff //convert to octet
  return buf
}

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

      if (ws[ref].t === 'n') {
        ws[ref].z = fmt
      }
    }
  }
}

const excelHtml5 = (cs_hd, cs_row, cs_cols) => {
  var wb = XLSX.utils.book_new()
  wb.Props = {
    Title: '39440403-invoice-list-report',
    Subject: ',',
    Author: 'Nueklabs Inc',
    CreatedDate: new Date(2017, 12, 19),
  }

  wb.SheetNames.push('Sheet1')

  const wscols = cs_cols.length > 0 ? cs_cols : []

  /* rows */
  const rows = [cs_hd, cs_row, cs_row, cs_row]

  var ws = XLSX.utils.aoa_to_sheet(rows, { cellDates: true })

  /* config all columns */
  const cur = `${'$'}0.001`
  for (let i = 0; i < cs_hd.length; i++) {
    formatColumn(ws, i, cur)
  }

  /* column props */
  ws['!cols'] = wscols

  wb.Sheets['Sheet1'] = ws

  var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })
  saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'test.xlsx')
}

const Involine = () => {
  const dispatch = useDispatch()
  const data = useMemo(() => [{ id: 1 }], [])
  const { authUser } = useSelector((state) => state.auth)
  const [visibleFilter, setVisibleFilter] = useState(false)
  const [searchData, setSearchData] = useState({
    companyId: '',
    debitCredit: '',
  })
  // const { search } = useLocation()
  const { fetchingCompanies, companies } = useSelector((state) => state.company)
  const { fetchingCurrencies, currencies } = useSelector((state) => state.currency)

  const handleSearch = async (e) => {
    const { value } = e.target
    if (e.keyCode === 13 && authUser) {
      let formData = new FormData()
      formData.append('searchQuery', value)
      formData.append('companyId', authUser.company.id)

      //   const resData = await dispatch(findSearchReport(formData)).unwrap()
      // if (resData) {
      //   console.log(resData)
      // }
    }
  }

  const exportToExcel = (e) => {
    e.preventDefault()
    // $("button[data-tag-code='search_filter_dropdown_button']").dropdown('toggle')
    // $('.dropdown-menu.show .dropdown-item').addClass('hide')
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
    const cs_row = [
      'INV220000009',
      '2022-02-18',
      'Freight Company',
      '',
      new Date('2014-02-19T14:3Z'),
      '62809960',
      '800',
      '62810760',
      'USD',
      '2',
      '62810760',
      '125619920',
      '1600',
      '125621520',
      'Head Office',
      'Kennedy Peter',
      '',
      'SALES INVOICE',
      '-Road Transports Team',
      'B00-BALANCE ACCOUNT',
      'KE',
      'Confirmed',
      '',
      'AK39494044',
      '',
      '',
      '',
    ]

    const cs_cols = [
      { wch: 13.5 },
      { wch: 10 },
      { wch: 45 },
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
      { wch: 15 },
    ]
    return excelHtml5(cs_hd, cs_row, cs_cols)
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
    } else if (c === 'curr') {
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

  const searchFilter = (e) => {
    e.preventDefault()
    setVisibleFilter(false)
    $('.dropdown-menu.filterMenu').removeClass('show')
  }

  const handleCloseFilter = (e) => {
    e.preventDefault()
    setVisibleFilter(false)
    $('.dropdown-menu.filterMenu').removeClass('show')
  }

  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'actions',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row: { index } }) => <span>{index + 1}</span>,
      },
      {
        Header: <span>Date</span>,
        accessor: 'receiptNo',
      },
      {
        Header: <span>Company</span>,
        accessor: 'consignor.name',
      },
      {
        Header: <span>Account Code</span>,
        accessor: 'loadDate',
      },
      {
        Header: <span>Due Date</span>,
        accessor: 'operation',
      },
      {
        Header: <span>Amount</span>,
        accessor: 'loadCountry',
      },
      {
        Header: <span>VAT</span>,
        accessor: 'unloadCountry',
      },
      {
        Header: <span>Net Total</span>,
        accessor: 'fullGroupage',
      },
      {
        Header: <span>Currency</span>,
        accessor: 'm3',
      },
      {
        Header: <span>Exch.Rate</span>,
        accessor: 'navlun',
      },
      {
        Header: <span>Unpaid Amount</span>,
        accessor: 'uA',
      },
      {
        Header: <span>Amount</span>,
        accessor: 'amountd',
      },
      {
        Header: <span>Branch</span>,
        accessor: 'branch',
      },
      {
        Header: <span>User</span>,
        accessor: 'y',
      },
      {
        Header: <span>Invoice Type</span>,
        accessor: 't',
      },
      {
        Header: <span>Country</span>,
        accessor: 'r',
      },
      {
        Header: <span>Profit Center</span>,
        accessor: 'e',
      },
      {
        Header: <span>Invoice Status</span>,
        accessor: 'w',
      },
      {
        Header: <span>Position Reference</span>,
        accessor: 's',
      },
      {
        Header: <span>Loading Reference</span>,
        accessor: 'q',
      },
    ],
    [],
  )

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
  )

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
                      <h3 className="cstCardbodyHeaderTitle">Invoice Items List</h3>
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
                          name="invoiceList"
                          placeholder="Search"
                          className="cst-search-input"
                          autoComplete="off"
                          onKeyUp={(e) => handleSearch(e)}
                        />
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
                          className="drop btn-round mr-2"
                          caret={false}
                          trigger="click"
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
                                      onChange={(e) => handleSelectForm('curr', e)}
                                      onMenuOpen={(e) => handleSelectFocus('curr', e)}
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
                          className="drop btn-round"
                          caret={false}
                        >
                          <i className="fa fa-download" style={{ marginLeft: '3px' }} />
                        </CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem href="#" onClick={(e) => e.preventDefault()}>
                            <i className="fa fa-file-pdf" style={{ marginRight: '7px' }} />
                            PDF
                          </CDropdownItem>
                          <CDropdownItem href="#" onClick={(e) => exportToExcel(e)}>
                            <i className="fa fa-file-excel" style={{ marginRight: '7px' }} />
                            Excel
                          </CDropdownItem>
                          <CDropdownItem href="#">
                            <i className="fa fa-save" style={{ marginRight: '7px' }} />
                            Save
                          </CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    </div>
                  </CCol>
                </CRow>
                <div className="pageBoxSizing-container is-overflow">
                  <div className="table-responsive table-truncate pageTableWrapper">
                    <table className="table pageTable" {...getTableProps()}>
                      <thead>
                        {headerGroups.map((headerGroup) => {
                          const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps()
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
                                const extraClass = isSorted ? (isSortedDesc ? 'desc' : 'asc') : ''
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
                    <br />
                    {/* <div>Showing the first 20 results of {rows.length} rows</div> */}
                  </div>
                </div>
              </div>
              <div className="m-3 is-overflow">{/* <InvoiceListTable /> */}</div>
            </CCardBody>
          </CCard>
        </div>
      </div>
    </div>
  )
}

export default Involine
