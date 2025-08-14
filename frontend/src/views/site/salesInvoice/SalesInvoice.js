import React, { useState, useMemo, useCallback, forwardRef, useRef, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CButtonGroup,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CPagination,
  CPaginationItem,
  CModalFooter,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormSelect,
  CFormInput,
} from '@coreui/react'
import {
  useTable,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useAsyncDebounce,
} from 'react-table'
import PropTypes from 'prop-types'
import { useHistory, Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilZoom, cilTrash, cilCheck, cilCopy, cilArrowRight, cilInfo } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { AppBreadcrumb } from 'src/components'
import {
  confirmInvoiceStatus,
  destroyInvoice,
  fetchInvoices,
  filterInvoice,
} from 'src/redux/slices/invoiceSlice'
import { matchSorter } from 'match-sorter'
import classNames from 'classnames'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import SlidingPane from 'react-sliding-pane'
import moment from 'moment'
import { capitalize, isEmpty, toLower } from 'lodash'
import { findTemplate } from 'src/redux/slices/templateSlice'
import { TempModalInfo } from 'src/views/templates'
import $ from 'jquery'
import LedgerModal from './modalInfo/LedgerModal'
import Noty from 'noty'
import { EFTCollectionPanel, ViewInvoicePanel } from './panel'
import { formatMoney } from 'src/config/helpers'
import { fetchCompanies } from 'src/redux/slices/companySlice'
import { fetchCurrencies } from 'src/redux/slices/currencySlice'
import { fetchOperations } from 'src/redux/slices/operationSlice'
import { fetchBranches } from 'src/redux/slices/branchSlice'
import { fetchUsers } from 'src/redux/slices/userSlice'
import { fetchProfitCenters } from 'src/redux/slices/profitCenterSlice'

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <>
      <input
        type="text"
        id="search_filter_box"
        placeholder="Search"
        className="cst-search-input"
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
      />
      <CIcon icon={cilZoom} customClassName="icon-search" size="sm" />
    </>
  )
}

const DefaultColumnFilter = ({ column: { filterValue, setFilter } }) => {
  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder=""
      style={{ width: '100%' }}
      className="filterInput-box"
    />
  )
}

// eslint-disable-next-line react/display-name
const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef()
  const resolvedRef = ref || defaultRef

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate
  }, [resolvedRef, indeterminate])

  return (
    <>
      <input type="checkbox" ref={resolvedRef} {...rest} style={{ verticalAlign: 'bottom' }} />
    </>
  )
})

const fuzzyTextFilterFn = (page, id, filterValue) => {
  return matchSorter(page, filterValue, { keys: [(row) => row.values[id]] })
}
fuzzyTextFilterFn.autoRemove = (val) => !val

const Table = ({ columns, data, setLedgerModal }) => {
  const dispatch = useDispatch()
  const [visibleFilter, setVisibleFilter] = useState(false)
  const { fetchingInvoices, filteringInvoice } = useSelector((state) => state.invoice)
  const { companies, fetchingCompanies } = useSelector((state) => state.company)
  const { currencies, fetchingCurrencies } = useSelector((state) => state.currency)
  const { operations, fetchingOperations } = useSelector((state) => state.operation)
  const { branches, fetchingBranches } = useSelector((state) => state.branch)
  const { users, fetchingUsers } = useSelector((state) => state.user)
  const { profitCenters, fetchingProfitCenters } = useSelector((state) => state.profitCenter)

  const [filterData, setFilterData] = useState({
    companyId: '',
    debitCredit: 'debit',
    currId: '',
    status: '',
    vatStatus: '',
    ledgerStatus: '',
    operationId: '',
    branchId: '',
    userId: '',
    transMethod: '',
    workType: '',
    invoiceType: '',
    profitCenterId: '',
    countryType: '',
    contractType: '',
    operationType: '',
    vehicleCode: '',
    loadingStatus: '',
    invoiceDateSelect: '',
    invoiceDate1: '',
    invoiceDate2: '',
    dueDateSelect: '',
    dueDate1: '',
    dueDate2: '',
    ledgerDateSelect: '',
    ledgerDate1: '',
    ledgerDate2: '',
    approvalDateType: 'approval_date',
    approvalDateSelect: '',
    approvalDate1: '',
    approvalDate2: '',
    paymentType: '',
    invoiceEmailStatus: '',
    invoiceQuickbooksStatus: '',
    invoiceAccountCode1: '',
    invoiceAccountCode2: '',
  })

  const handleSelectFocus = (c, _) => {
    if (c === 'companyId') {
      if (isEmpty(companies)) {
        dispatch(fetchCompanies())
      }
    } else if (c === 'currId') {
      if (isEmpty(currencies)) {
        dispatch(fetchCurrencies())
      }
    } else if (c === 'operationId') {
      if (isEmpty(operations)) {
        dispatch(fetchOperations())
      }
    } else if (c === 'branchId') {
      if (isEmpty(branches)) {
        dispatch(fetchBranches())
      }
    } else if (c === 'userId') {
      if (isEmpty(users)) {
        dispatch(fetchUsers())
      }
    } else if (c === 'profitCenterId') {
      if (isEmpty(profitCenters)) {
        dispatch(fetchProfitCenters())
      }
    }
  }

  const clearFilterData = () => {
    setFilterData({
      companyId: '',
      debitCredit: 'debit',
      currId: '',
      status: '',
      vatStatus: '',
      ledgerStatus: '',
      operationId: '',
      branchId: '',
      userId: '',
      transMethod: '',
      workType: '',
      invoiceType: '',
      profitCenterId: '',
      countryType: '',
      contractType: '',
      operationType: '',
      vehicleCode: '',
      loadingStatus: '',
      invoiceDateSelect: '',
      invoiceDate1: '',
      invoiceDate2: '',
      dueDateSelect: '',
      dueDate1: '',
      dueDate2: '',
      ledgerDateSelect: '',
      ledgerDate1: '',
      ledgerDate2: '',
      approvalDateType: 'approval_date',
      approvalDateSelect: '',
      approvalDate1: '',
      approvalDate2: '',
      paymentType: '',
      invoiceEmailStatus: '',
      invoiceQuickbooksStatus: '',
      invoiceAccountCode1: '',
      invoiceAccountCode2: '',
    })
  }

  const onHideFilter = (e) => {
    $('#search_filter_box').attr('disabled', false)
    if (visibleFilter) {
      $('.dropdown-menu.filterMenu').addClass('show')
    }
  }

  const searchFilter = async (e) => {
    e.preventDefault()
    setVisibleFilter(false)
    $('.dropdown-menu.filterMenu').removeClass('show')
    const data = {
      table: 'salesInvoice',
      form: 'table',
      ...filterData,
    }
    const resData = await dispatch(filterInvoice(data)).unwrap()
    if (resData) {
      clearFilterData()
    }
  }

  const handleCloseFilter = (e) => {
    e.preventDefault()
    setVisibleFilter(false)
    clearFilterData()
    $('.dropdown-menu.filterMenu').removeClass('show')
  }

  const handleChangeFilter = (e) => {
    const { name, value } = e.target
    setFilterData({
      ...filterData,
      [name]: value,
    })
  }

  const onShowFilter = () => {
    const fil = $('#search_filter_box')
    fil.val('').attr('disabled', true)
  }

  const handleLedgerModal = (e) => {
    e.preventDefault()
    $('.dropdown-menu').removeClass('show')
    setLedgerModal(true)
  }

  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    [],
  )

  const handleConfirmInvoice = async (e, items) => {
    e.preventDefault()
    let invIds = []
    if (items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        invIds.push(items[i].original.id)
      }
    }
    const resData = await dispatch(
      confirmInvoiceStatus({ invIds: JSON.stringify(invIds) }),
    ).unwrap()
    if (resData) {
      $('.dropdown-menu').removeClass('show')
    }
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    selectedFlatRows,
    state: { pageIndex, globalFilter },
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 20 },
      defaultColumn, // Be sure to pass the defaultColumn option
    },
    useFilters,
    useGlobalFilter,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          Header: <span></span>,
          accessor: 'index',
          id: 'countVar',
          // eslint-disable-next-line react/prop-types
          Cell: ({ row: { index, original } }) => (
            <span
              className={classNames('font-weight-bold truncate ', {
                // eslint-disable-next-line react/prop-types
                'text-info': original.status === 'draft',
                // eslint-disable-next-line react/prop-types
                'text-cancelled': original.status === 'cancelled',
              })}
              style={{ lineHeight: '26px' }}
            >
              {Number(index + 1)}
            </span>
          ),
        },
        {
          id: 'selection',
          // eslint-disable-next-line react/prop-types
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
            </div>
          ),
          // eslint-disable-next-line react/prop-types
          Cell: ({ row }) => (
            <div>
              {/*  eslint-disable-next-line react/prop-types */}
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ])
    },
  )

  const firstPageRows = page.slice(0, 20)

  return (
    <>
      <CRow className="pageBoxSizing-filter">
        <CCol
          sm={6}
          md={6}
          lg={6}
          xl={6}
          className={classNames({ hide: selectedFlatRows.length > 0 })}
        >
          <div className="pageSearchContainer">
            <div className="cst-search-box">
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </div>
          </div>
        </CCol>
        <CCol
          sm={6}
          md={6}
          lg={6}
          xl={6}
          className={classNames({ hide: selectedFlatRows.length > 0 })}
        >
          <div className="cstSearchActions">
            <CDropdown
              visible={visibleFilter}
              onHide={() => onHideFilter()}
              onShow={() => onShowFilter()}
              placement="right"
            >
              <CDropdownToggle
                color="secondary"
                variant="outline"
                caret={false}
                trigger="click"
                // disabled={findingSearchReport ? true : false}
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
                <div id="simple_search_fields">
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group">
                        <CFormSelect
                          className="form-control-cst"
                          name="companyId"
                          placeholder="Company"
                          id="search_filter_company_id"
                          value={filterData.companyId}
                          onChange={(e) => handleChangeFilter(e)}
                          onFocus={() => handleSelectFocus('companyId')}
                        >
                          <option value="">Company</option>
                          {!fetchingCompanies ? (
                            companies && companies.length > 0 ? (
                              companies.map((itm) => (
                                <option key={itm.id} value={itm.id}>
                                  {itm.name}
                                </option>
                              ))
                            ) : (
                              <option disabled>No results found.</option>
                            )
                          ) : (
                            <option disabled>Loading...</option>
                          )}
                        </CFormSelect>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group">
                        <CFormSelect
                          className="form-control-cst select required"
                          name="debitCredit"
                          id="search_filter_debit_credit"
                          value={filterData.debitCredit}
                          onChange={(e) => handleChangeFilter(e)}
                        >
                          <option value="debit">Sales Invoice</option>
                          <option value="credit">Purchase Invoice</option>
                        </CFormSelect>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group select required search_filter_curr">
                        <CFormSelect
                          className="form-control-cst select required"
                          name="currId"
                          id="search_filter_curr"
                          value={filterData.currId}
                          onChange={(e) => handleChangeFilter(e)}
                          onFocus={() => handleSelectFocus('currId')}
                        >
                          <option value="">Currency</option>
                          {!fetchingCurrencies ? (
                            currencies && currencies.length > 0 ? (
                              <>
                                {currencies.map((itm) => (
                                  <option key={itm.id} value={itm.id}>
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
                            <option disabled>Loading...</option>
                          )}
                        </CFormSelect>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group select required search_filter_status">
                        <CFormSelect
                          className="form-control-cst select required"
                          name="status"
                          id="search_filter_status"
                          value={filterData.status}
                          onChange={(e) => handleChangeFilter(e)}
                        >
                          <option value="">Status</option>
                          <option value="draft">Draft</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </CFormSelect>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group">
                        <div>
                          <div className="input-group">
                            <CFormSelect
                              className="form-control-cst select required"
                              name="vatStatus"
                              id="search_filter_vat_status"
                              value={filterData.vatStatus}
                              onChange={(e) => handleChangeFilter(e)}
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
                      <div className="form-group select required search_filter_ledger_status">
                        <CFormSelect
                          className="form-control-cst select required"
                          name="ledgerStatus"
                          id="search_filter_ledger_status"
                          value={filterData.ledgerStatus}
                          onChange={(e) => handleChangeFilter(e)}
                        >
                          <option value="">Ledger Status</option>
                          <option value="1">Ledgered</option>
                          <option value="0">Not-Ledgered</option>
                        </CFormSelect>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group select required search_filter_operation_id">
                        <CFormSelect
                          className="form-control-cst select required"
                          name="operationId"
                          id="search_filter_operation_id"
                          value={filterData.operationId}
                          onChange={(e) => handleChangeFilter(e)}
                          onFocus={() => handleSelectFocus('operationId')}
                        >
                          <option value="">Operation</option>
                          {!fetchingOperations ? (
                            operations && operations.length > 0 ? (
                              <>
                                {operations.map((itm) => (
                                  <option key={itm.id} value={itm.id}>
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
                            <option disabled>Loading...</option>
                          )}
                        </CFormSelect>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group select required search_filter_branch_id">
                        <div>
                          <div className="input-group">
                            <CFormSelect
                              className="form-control-cst select required"
                              placeholder="Branch"
                              name="branchId"
                              id="search_filter_branch_id"
                              value={filterData.branchId}
                              onChange={(e) => handleChangeFilter(e)}
                              onFocus={() => handleSelectFocus('branchId')}
                            >
                              <option value="">Branch</option>
                              {!fetchingBranches ? (
                                branches && branches.length > 0 ? (
                                  <>
                                    {branches.map((itm) => (
                                      <option key={itm.id} value={itm.id}>
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
                                <option disabled>Loading...</option>
                              )}
                            </CFormSelect>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group">
                        <div>
                          <div className="input-group">
                            <CFormSelect
                              className="form-control-cst"
                              placeholder="User"
                              name="userId"
                              id="search_filter_user_id"
                              value={filterData.userId}
                              onChange={(e) => handleChangeFilter(e)}
                              onFocus={() => handleSelectFocus('userId')}
                            >
                              <option value="">User</option>
                              {!fetchingUsers ? (
                                users && users.length > 0 ? (
                                  <>
                                    {users.map((itm, i) => (
                                      <option key={i} value={itm.uuid}>
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
                                <option disabled>Loading...</option>
                              )}
                            </CFormSelect>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group select required search_filter_work_type">
                        <div className="input-group">
                          <CFormSelect
                            className="form-control-cst"
                            placeholder="Invoice Type"
                            name="workType"
                            id="search_filter_work_type"
                            value={filterData.workType}
                            onChange={(e) => handleChangeFilter(e)}
                          >
                            <option value="">Invoice Type</option>
                            <option value="sales_invoice">SALES INVOICE</option>
                            <option value="bill">BILL</option>
                            <option value="credit_note">CREDIT NOTE</option>
                            <option value="vat_invoice">VAT INVOICE</option>
                          </CFormSelect>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group select required search_filter_trans_method">
                        <div>
                          <div className="input-group">
                            <CFormSelect
                              className="form-control-cst select required"
                              placeholder="Trans Method"
                              name="transMethod"
                              id="search_filter_trans_method"
                              value={filterData.transMethod}
                              onChange={(e) => handleChangeFilter(e)}
                            >
                              <option value="">Trans Method</option>
                              <option value="road">Road Transport</option>
                              <option value="air">Air Transport</option>
                              <option value="sea">Sea Transport</option>
                              <option value="rail">Rail Transport</option>
                            </CFormSelect>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group ">
                        <div>
                          <div className="input-group">
                            <CFormSelect
                              className="form-control-cst "
                              placeholder="Invoice Type"
                              name="invoiceType"
                              id="search_filter_invoice_type"
                              value={filterData.invoiceType}
                              onChange={(e) => handleChangeFilter(e)}
                            >
                              <option value="">Invoice Type</option>
                              <option value="closed_invoice">Prepaid Invoice</option>
                              <option value="ebase_invoice">Base E-Invoice</option>
                              <option value="etrade_invoice">Commercial E-Invoice</option>
                              <option value="earsiv_invoice">E-Archive Invoice</option>
                              <option value="print_invoice">Other Invoices</option>
                            </CFormSelect>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group profit_center required search_filter_profit_center_id">
                        <div>
                          <div className="input-group">
                            <CFormSelect
                              className="form-control-cst profit_center_select"
                              placeholder="Profit Center"
                              name="profitCenterId"
                              id="search_filter_profit_center_id"
                              value={filterData.profitCenterId}
                              onChange={(e) => handleChangeFilter(e)}
                              onFocus={() => handleSelectFocus('profitCenterId')}
                            >
                              <option value="">Profit Center</option>
                              {!fetchingProfitCenters ? (
                                profitCenters && profitCenters.length > 0 ? (
                                  <>
                                    {profitCenters.map((itm) => (
                                      <option key={itm.id} value={itm.id}>
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
                                <option disabled>Loading...</option>
                              )}
                            </CFormSelect>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group">
                        <CFormSelect
                          className="form-control-cst"
                          name="countryType"
                          id="search_filter_country_type"
                          value={filterData.countryType}
                          onChange={(e) => handleChangeFilter(e)}
                        >
                          <option value="">Homeland / Foreign</option>
                          <option value="homeland">Homeland</option>
                          <option value="foreign">Foreign</option>
                        </CFormSelect>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group select required search_filter_contract_type">
                        <CFormSelect
                          className="form-control-cst select required"
                          name="contractType"
                          id="search_filter_contract_type"
                          value={filterData.contractType}
                          onChange={(e) => handleChangeFilter(e)}
                        >
                          <option value="">Contract</option>
                          <option value="rented">Contracted Vehicle</option>
                          <option value="owned">Our Own Vehicle</option>
                        </CFormSelect>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group select required search_filter_operation_type">
                        <CFormSelect
                          className="form-control-cst select required"
                          name="operationType"
                          id="search_filter_operation_type"
                          value={filterData.operationType}
                          onChange={(e) => handleChangeFilter(e)}
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
                      <div className="form-group string required search_filter_vehicle_code">
                        <CFormInput
                          className="form-control-cst string required"
                          placeholder="Vehicle Code"
                          type="text"
                          name="vehicleCode"
                          id="search_filter_vehicle_code"
                          value={filterData.vehicleCode}
                          onChange={(e) => handleChangeFilter(e)}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group select required search_filter_loading_status">
                        <CFormSelect
                          className="form-control-cst select required"
                          name="loadingStatus"
                          id="search_filter_loading_status"
                          value={filterData.loadingStatus}
                          onChange={(e) => handleChangeFilter(e)}
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
                      <div className="form-group">
                        <CFormSelect
                          className="form-control-cst"
                          name="invoiceDateSelect"
                          id="search_filter_invoice_date_select"
                          value={filterData.invoiceDateSelect}
                          onChange={(e) => handleChangeFilter(e)}
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
                      <div
                        className="form-group date_interval required search_filter_invoice_date"
                        style={{ display: 'none' }}
                      >
                        <div className="input-group date w-100">
                          <CFormInput
                            className="form-control-cst appearence-none"
                            type="date"
                            name="invoiceDate1"
                            id="search_filter_invoice_date1"
                            value={filterData.invoiceDate1}
                            onChange={(e) => handleChangeFilter(e)}
                          />
                          <div className="input-group-append">
                            <span className="input-group-text">
                              <i className="far fa-ellipsis-h"></i>
                            </span>
                          </div>
                          <CFormInput
                            className="form-control-cst appearence-none"
                            type="date"
                            name="invoiceDate2"
                            id="search_filter_invoice_date2"
                            value={filterData.invoiceDate2}
                            onChange={(e) => handleChangeFilter(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group select required search_filter_due_date_select">
                        <CFormSelect
                          className="form-control-cst select required"
                          name="dueDateSelect"
                          id="search_filter_due_date_select"
                          value={filterData.dueDateSelect}
                          onChange={(e) => handleChangeFilter(e)}
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
                      <div
                        className="form-group date_interval required search_filter_due_date"
                        style={{ display: 'none' }}
                      >
                        <div className="input-group date w-100">
                          <CFormInput
                            className="form-control-cst appearence-none"
                            type="date"
                            name="dueDate1"
                            id="search_filter_due_date1"
                            value={filterData.dueDate1}
                            onChange={(e) => handleChangeFilter(e)}
                          />
                          <div className="input-group-append">
                            <span className="input-group-text">
                              <i className="far fa-ellipsis-h"></i>
                            </span>
                          </div>
                          <CFormInput
                            className="form-control-cst appearence-none"
                            type="date"
                            name="dueDate2"
                            id="search_filter_due_date2"
                            value={filterData.dueDate2}
                            onChange={(e) => handleChangeFilter(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group select required search_filter_ledger_date_select">
                        <CFormSelect
                          className="form-control-cst select required"
                          name="ledgerDateSelect"
                          id="search_filter_ledger_date_select"
                          value={filterData.ledgerDateSelect}
                          onChange={(e) => handleChangeFilter(e)}
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
                      <div
                        className="form-group date_interval required search_filter_ledger_date"
                        style={{
                          display: filterData.ledgerDateSelect === 'custom_date' ? '' : 'none',
                        }}
                      >
                        <div className="input-group date w-100">
                          <CFormInput
                            className="form-control-cst appearence-none"
                            type="date"
                            name="ledgerDate1"
                            id="search_filter_ledger_date1"
                            value={filterData.ledgerDate1}
                            onChange={(e) => handleChangeFilter(e)}
                          />
                          <div className="input-group-append">
                            <span className="input-group-text">
                              <i className="far fa-ellipsis-h"></i>
                            </span>
                          </div>
                          <CFormInput
                            className="form-control-cst appearence-none"
                            type="date"
                            name="ledgerDate2"
                            id="search_filter_ledger_date2"
                            value={filterData.ledgerDate2}
                            onChange={(e) => handleChangeFilter(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group select required search_filter_approval_date_type">
                        <CFormSelect
                          className="form-control-cst select required"
                          name="approvalDateType"
                          id="search_filter_approval_date_type"
                          value={filterData.approvalDateType}
                          onChange={(e) => handleChangeFilter(e)}
                        >
                          <option value="approval_date">First Conf.Date</option>
                          <option value="ledger_approval_date">Sec. Conf. Date</option>
                          <option value="payment_approval_date">Payment Conf. Date</option>
                          <option value="operation_date">Operation Date</option>
                        </CFormSelect>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group select required search_filter_approval_date_select">
                        <CFormSelect
                          className="form-control-cst select required"
                          name="approvalDateSelect"
                          id="search_filter_approval_date_select"
                          value={filterData.approvalDateSelect}
                          onChange={(e) => handleChangeFilter(e)}
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
                      <div
                        className="form-group date_interval required search_filter_approval_date"
                        style={{
                          display: filterData.approvalDateSelect === 'custom_date' ? '' : 'none',
                        }}
                      >
                        <div className="input-group date w-100">
                          <CFormInput
                            className="form-control-cst appearence-none"
                            type="date"
                            name="approvalDate1"
                            id="search_filter_approval_date1"
                            value={filterData.approvalDate1}
                            onChange={(e) => handleChangeFilter(e)}
                          />
                          <div className="input-group-append">
                            <span className="input-group-text">
                              <i className="far fa-ellipsis-h"></i>
                            </span>
                          </div>
                          <CFormInput
                            className="form-control-cst appearence-none"
                            type="date"
                            name="approvalDate2"
                            id="search_filter_approval_date2"
                            value={filterData.approvalDate2}
                            onChange={(e) => handleChangeFilter(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group select required search_filter_payment_type">
                        <CFormSelect
                          className="form-control-cst select required"
                          name="paymentType"
                          id="search_filter_payment_type"
                          value={filterData.paymentType}
                          onChange={(e) => handleChangeFilter(e)}
                        >
                          <option value="">Invoice Payment Status</option>
                          <option value="paid">Paid</option>
                          <option value="unpaid">Unpaid</option>
                        </CFormSelect>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group select required search_filter_invoice_email_status">
                        <CFormSelect
                          className="form-control-cst select required"
                          name="invoiceEmailStatus"
                          id="search_filter_invoice_email_status"
                          value={filterData.invoiceEmailStatus}
                          onChange={(e) => handleChangeFilter(e)}
                        >
                          <option value="">E-mail Status</option>
                          <option value="sent">Sent</option>
                          <option value="not_sent">Not sent</option>
                        </CFormSelect>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group select required search_filter_invoice_quickbooks_status">
                        <CFormSelect
                          className="form-control-cst select required"
                          name="invoiceQuickbooksStatus"
                          id="search_filter_invoice_quickbooks_status"
                          value={filterData.invoiceQuickbooksStatus}
                          onChange={(e) => handleChangeFilter(e)}
                        >
                          <option value="">Quickbooks Status</option>
                          <option value="sent">Sent</option>
                          <option value="not_sent">Not sent</option>
                        </CFormSelect>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group multi_value required search_filter_invoice_account_code">
                        <div className="input-group date w-100">
                          <CFormInput
                            className="form-control-cst"
                            type="text"
                            name="invoiceAccountCode1"
                            id="search_filter_invoice_account_code1"
                            value={filterData.invoiceAccountCode1}
                            onChange={(e) => handleChangeFilter(e)}
                          />
                          <div className="input-group-append">
                            <span className="input-group-text">
                              <i className="fa fa-ellipsis-h"></i>
                            </span>
                          </div>
                          <CFormInput
                            className="form-control-cst"
                            type="text"
                            name="invoiceAccountCode2"
                            id="search_filter_invoice_account_code2"
                            value={filterData.invoiceAccountCode2}
                            onChange={(e) => handleChangeFilter(e)}
                          />
                        </div>
                        <p className="help-block">Account Code</p>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"></div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"></div>
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
                  <CButton type="submit" color="info" onClick={(e) => searchFilter(e)}>
                    Search
                  </CButton>
                </div>
              </CDropdownMenu>
            </CDropdown>
          </div>
        </CCol>
        <CCol
          sm={12}
          md={6}
          lg={6}
          xl={6}
          className={classNames({ hide: !selectedFlatRows.length > 0 })}
        >
          <div className="pageSearchContainer">
            <div className="filter-actions">
              <div className="filterCount-selected">{selectedFlatRows.length}</div>
              <div className="filterSelected-text">
                {selectedFlatRows.length === 1 ? 'Invoice' : 'Invoices'} selected
              </div>
              <div className="filterButtons">
                <CDropdown>
                  <CDropdownToggle
                    color="secondary"
                    variant="outline"
                    size="sm"
                    caret={false}
                    style={{ border: 'none', padding: '0px .5rem', margin: '0px' }}
                  >
                    <i className="fa fa-ellipsis-h" />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem onClick={(e) => handleConfirmInvoice(e, selectedFlatRows)}>
                      <CIcon icon={cilCheck} className="mr-2" /> Confrim
                    </CDropdownItem>
                    <CDropdownItem onClick={(e) => handleLedgerModal(e, selectedFlatRows)}>
                      <CIcon icon={cilArrowRight} className="mr-2" />
                      Send to Accounting
                    </CDropdownItem>
                    <CDropdownItem onClick={(e) => handleLedgerModal(e, selectedFlatRows)}>
                      <CIcon icon={cilCopy} className="mr-2" /> Copy
                    </CDropdownItem>
                    <CDropdownItem onClick={(e) => handleLedgerModal(e, selectedFlatRows)}>
                      <CIcon icon={cilInfo} className="mr-2" /> Check E-Invoice Status
                    </CDropdownItem>
                    <CDropdownItem onClick={(e) => handleLedgerModal(e, selectedFlatRows)}>
                      <CIcon icon={cilArrowRight} className="mr-2" /> Send
                    </CDropdownItem>
                    <CDropdownItem onClick={(e) => handleLedgerModal(e, selectedFlatRows)}>
                      <CIcon icon={cilTrash} className="mr-2" /> Remove from Accounting
                    </CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </div>
            </div>
          </div>
        </CCol>
      </CRow>
      <div className="pageBoxSizing-container cst-tableResponsive">
        <div className="table-responsive table-truncate pageTableWrapper">
          <div>
            {fetchingInvoices || filteringInvoice ? (
              <div className="table-info">
                <span className="mt-5">
                  <img src={loaderLg} alt="" />
                </span>
              </div>
            ) : (
              <>
                <table className="table pageTable" {...getTableProps()}>
                  <thead>
                    {headerGroups.map((headerGroup) => {
                      const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps()
                      return (
                        <tr key={key} {...restHeaderGroupProps}>
                          {headerGroup.headers.map((column) => {
                            const { key, ...restColumn } = column.getHeaderProps()
                            return (
                              <th key={key} {...restColumn}>
                                {column.render('Header')}
                              </th>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </thead>
                  <tbody {...getTableBodyProps}>
                    {firstPageRows.length > 0 ? (
                      firstPageRows.map((row) => {
                        prepareRow(row)
                        const { key, ...restRowProps } = row.getRowProps()
                        return (
                          <tr key={key} {...restRowProps} className="bg-hover-light-primary">
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
                      })
                    ) : (
                      <>
                        <tr className="text-center">
                          <td
                            colSpan={15}
                            style={{ borderBottom: 'none', borderTop: 'none', paddingTop: '3rem' }}
                          >
                            <span className="font-weight-bold">No records found.</span>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
        {!fetchingInvoices ||
          (filteringInvoice && (
            <div className="table-page">
              {data.length > 0 && (
                <div>
                  <span>
                    Showing page {pageIndex + 1} of {pageOptions.length} - {data.length}
                  </span>
                </div>
              )}
              <div className="pagination">
                {data.length > 20 && (
                  <CPagination aria-label="cst-table-navigation">
                    <CPaginationItem
                      aria-label="First"
                      onClick={() => gotoPage(0)}
                      disabled={!canPreviousPage}
                    >
                      <span aria-hidden="true"> {'<<'}</span>
                    </CPaginationItem>
                    <CPaginationItem
                      aria-label="Previous"
                      onClick={() => previousPage()}
                      disabled={!canPreviousPage}
                    >
                      <span aria-hidden="true">{'<'}</span>
                    </CPaginationItem>
                    <CPaginationItem
                      aria-label="Next"
                      onClick={() => nextPage()}
                      disabled={!canNextPage}
                    >
                      <span aria-hidden="true">{'>'}</span>
                    </CPaginationItem>
                    <CPaginationItem
                      aria-label="Last"
                      onClick={() => gotoPage(pageCount - 1)}
                      disabled={!canNextPage}
                    >
                      <span aria-hidden="true">{'>>'}</span>
                    </CPaginationItem>
                  </CPagination>
                )}
              </div>
            </div>
          ))}
      </div>
    </>
  )
}

const SalesInvoice = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [breadcrumbList] = useState([
    { name: 'Sales Invoices', pathname: '/financor/debit', active: true },
    { name: 'Purchase Invoices', pathname: '/financor/credit' },
    { name: 'Cash Transactions', pathname: '/financor/cash_trans' },
    { name: 'Bank Transactions', pathname: '/financor/bank_trans' },
    { name: 'Driver Transactions', pathname: '/financor/driver_trans' },
    { name: 'Ledger Entries', pathname: '/gldocs' },
    { name: 'Reports', pathname: '/reports/home?group_type=financor' },
  ])
  const [ledgerModal, setLedgerModal] = useState(false)
  const { invoices } = useSelector((state) => state.invoice)
  const { findingTemplate } = useSelector((state) => state.template)
  const [printModal, viewPrintModal] = useState(false)
  const [tempLinkUrl, setTempLinkUrl] = useState(null)
  const [cancelInvPanel, setCancelInvPanel] = useState(false)
  const [viewInvoice, setViewInvoice] = useState(false)
  const [itemInfo, setItemInfo] = useState(null)
  const [sendAccPanel, setSendAccPanel] = useState(false)
  const [eftCollectionModal, setEftCollectionModal] = useState(false)

  const toLink = (e, link) => {
    e.preventDefault()
    history.push(link)
  }

  const closeLedgerModal = () => {
    setLedgerModal(false)
  }

  const handleModalPrint = useCallback(
    (e, item) => {
      e.preventDefault()
      $('.dropdown-menu').removeClass('show')
      dispatch(findTemplate({ Id: item.id, type: 'invoice' }))
      setTempLinkUrl(`/invoices/${toLower(item.linkId)}`)
      viewPrintModal(true)
    },
    [dispatch],
  )

  const handleEditInvoice = useCallback(
    (e, item) => {
      e.preventDefault()
      history.push(`/invoices/edit/${toLower(item.linkId)}`)
    },
    [history],
  )

  const closeModalPrint = () => {
    viewPrintModal(false)
    setTempLinkUrl(null)
  }

  const closeSendAcc = (e) => {
    e.preventDefault()
    setLedgerModal(false)
  }

  const handleCopyInvoice = useCallback(
    (e, item) => {
      e.preventDefault()
      if (item) {
        history.push(`/invoices/clone/${toLower(item.linkId)}`)
      }
      $('.dropdown-menu').removeClass('show')
    },
    [history],
  )

  const handleConfirmInvoice = useCallback(
    async (e, item) => {
      e.preventDefault()
      let invIds = [item.id]
      await dispatch(
        confirmInvoiceStatus({ invIds: JSON.stringify(invIds), status: 'confirmed' }),
      ).unwrap()

      $('.dropdown-menu').removeClass('show')
    },
    [dispatch],
  )

  const handleDeleteInvoice = useCallback(
    (e, item) => {
      e.preventDefault()
      $('.dropdown-menu').removeClass('show')
      var n = new Noty({
        text: 'The record will be deleted, do you want to continue ?',
        layout: 'topCenter',
        progressBar: false,
        timeout: false,
        type: 'error',
        closeWith: 'button',
        buttons: [
          Noty.button(
            'Delete',
            'btn btn-default btn-sm del-bnt-mr text-danger float-right',
            async function () {
              const resData = await dispatch(destroyInvoice(item.id)).unwrap()
              if (resData) {
                new Noty({
                  type: 'alert',
                  layout: 'topRight',
                  id: `del${resData.id}`,
                  text: 'Invoice has been deleted succesfully',
                }).show()
              }
              n.close()
            },
            { id: 'deltItm' },
          ),

          Noty.button('Cancel', 'btn btn-default btn-sm float-right', function () {
            n.close()
          }),
        ],
      })
      n.show()
    },
    [dispatch],
  )

  const handleSendAccounting = useCallback((e, item) => {
    e.preventDefault()
    setSendAccPanel(false)
    $('.dropdown-menu').removeClass('show')
  }, [])

  const handleCancelInvoice = useCallback((e, item) => {
    e.preventDefault()
    setCancelInvPanel(true)
    setItemInfo(item)
    $('.dropdown-menu').removeClass('show')
  }, [])

  const handleDraftInvoice = useCallback(
    async (e, item) => {
      e.preventDefault()
      let invIds = [item.id]
      await dispatch(
        confirmInvoiceStatus({ invIds: JSON.stringify(invIds), status: 'draft' }),
      ).unwrap()

      $('.dropdown-menu').removeClass('show')
    },
    [dispatch],
  )

  const handleSetInvoice = useCallback((e, item) => {
    e.preventDefault()
    $('.dropdown-menu').removeClass('show')
    setViewInvoice(true)
    setItemInfo(item)
  }, [])

  const closeInvMod = () => {
    setViewInvoice(false)
  }

  const handlePaymentInvoice = useCallback((e, item) => {
    e.preventDefault()
    setEftCollectionModal(true)
    setItemInfo(item)
    $('.dropdown-menu').removeClass('show')
  }, [])

  const closeCancelInv = () => {
    setCancelInvPanel(false)
  }

  const closeEftCollectionModal = () => {
    setEftCollectionModal(false)
  }

  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'actions',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row: { original } }) => (
          <div>
            <div className="table-action-dropdown">
              <CDropdown>
                <CDropdownToggle color="link">
                  <i className="fa fa-ellipsis-h"></i>
                </CDropdownToggle>
                <CDropdownMenu>
                  {/* eslint-disable-next-line react/prop-types */}
                  {original.status !== 'confirmed' ? (
                    <CDropdownItem onClick={(e) => handleEditInvoice(e, original)}>
                      <i className="fa fa-edit mr-2" />
                      <span>Edit</span>
                    </CDropdownItem>
                  ) : null}
                  <CDropdownItem onClick={(e) => handleModalPrint(e, original)}>
                    <i className="fa fa-print mr-2" />
                    <span>Print</span>
                  </CDropdownItem>
                  <CDropdownItem onClick={(e) => handleCopyInvoice(e, original)}>
                    <i className="fa fa-file mr-2" />
                    <span>Copy</span>
                  </CDropdownItem>
                  {/* eslint-disable-next-line react/prop-types */}
                  {original.status === 'draft' ? (
                    <>
                      <CDropdownItem>
                        <i className="fa fa-file mr-2" />
                        <span>Select Estimates</span>
                      </CDropdownItem>
                      <CDropdownItem onClick={(e) => handleConfirmInvoice(e, original)}>
                        <i className="fa fa-check mr-2" />
                        <span>Confirm</span>
                      </CDropdownItem>
                    </>
                  ) : null}
                  {/* eslint-disable-next-line react/prop-types */}
                  {original.status === 'confirmed' ? (
                    <>
                      <CDropdownItem onClick={(e) => handleDraftInvoice(e, original)}>
                        <i className="far fa-envelope mr-2" />
                        Send Email
                      </CDropdownItem>
                      <CDropdownItem onClick={(e) => handleDraftInvoice(e, original)}>
                        <i className="far fa-thumbs-down mr-2" />
                        Set As Draft
                      </CDropdownItem>
                      <CDropdownItem onClick={(e) => handleSendAccounting(e, original)}>
                        <i className="fa fa-plus mr-2" />
                        Send To Accounting
                      </CDropdownItem>
                      <CDropdownItem onClick={(e) => handlePaymentInvoice(e, original)}>
                        <i className="fa fa-plus mr-2" />
                        Create Payment
                      </CDropdownItem>
                      {/* <CDropdownItem>
                        <i className="fa fa-check mr-2" />
                        Payment Mappings
                      </CDropdownItem> */}
                    </>
                  ) : null}
                  {/* eslint-disable-next-line react/prop-types */}
                  {original.status === 'cancelled' ? (
                    <>
                      <CDropdownItem>
                        <i className="far fa-thumbs-up mr-2" />
                        <span>Confirm</span>
                      </CDropdownItem>
                    </>
                  ) : null}
                  {/* eslint-disable-next-line react/prop-types */}
                  {original.status !== 'cancelled' ? (
                    <CDropdownItem onClick={(e) => handleCancelInvoice(e, original)}>
                      <i className="fa fa-times mr-2" />
                      <span>Cancel Invoice</span>
                    </CDropdownItem>
                  ) : null}
                  <CDropdownItem>
                    <i className="fa fa-plus mr-2" />
                    <span>Add Loading</span>
                  </CDropdownItem>
                  {/* eslint-disable-next-line react/prop-types */}
                  {original.status !== 'confirmed' ? (
                    <CDropdownItem onClick={(e) => handleDeleteInvoice(e, original)}>
                      <i className="fa fa-trash mr-2" />
                      <span>Delete</span>
                    </CDropdownItem>
                  ) : null}
                  {/* <div className="separator m-0"></div> */}
                  {/* <CDropdownItem>
                    <i className="fa fa-file mr-2" />
                    <span>Recording History</span>
                  </CDropdownItem> */}
                </CDropdownMenu>
              </CDropdown>
            </div>
          </div>
        ),
      },
      {
        Header: 'Invoice No',
        accessor: 'invoiceName',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <div className="link-search-hover truncate">
            <div>
              <Link
                target="_blank"
                // eslint-disable-next-line react/prop-types
                to={`/invoices/${toLower(original.linkId)}`}
                className={classNames('redirect-link truncate ', {
                  // eslint-disable-next-line react/prop-types
                  'text-info': original.status === 'draft',
                  // eslint-disable-next-line react/prop-types
                  'text-cancelled': original.status === 'cancelled',
                  // eslint-disable-next-line react/prop-types
                  'text-default': original.status === 'confirmed',
                })}
                rel="noreferrer"
              >
                {value}
              </Link>
            </div>
            <div className="btn-search-hover">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                className="btn btn-xs btn-pill btn-icon btn-primary ml-2"
                href="#"
                onClick={(e) => handleSetInvoice(e, original)}
              >
                <i className="fa fa-search"></i>
              </a>
            </div>
          </div>
        ),
      },
      {
        Header: (
          <span>
            Date
            <br />
            Due Date
          </span>
        ),
        accessor: 'invoiceDate',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <span
            className={classNames({
              // eslint-disable-next-line react/prop-types
              'text-info': original.status === 'draft',
              // eslint-disable-next-line react/prop-types
              'text-cancelled': original.status === 'cancelled',
            })}
          >
            {value ? moment(value).format('DD/MM/YYYY') : ''}
            <br />
            <span
              className={classNames('truncate ', {
                // eslint-disable-next-line react/prop-types
                'text-info': original.status === 'draft',
                // eslint-disable-next-line react/prop-types
                'text-cancelled': original.status === 'cancelled',
                // eslint-disable-next-line react/prop-types
                'text-muted': original.status === 3,
              })}
            >
              {/*  eslint-disable-next-line react/prop-types */}
              {original.dueDate ? moment(original.dueDate).format('DD/MM/YYYY') : ''}
            </span>
          </span>
        ),
      },
      {
        Header: 'Company',
        accessor: 'invoicedCompany.name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <span
            className={classNames('font-weight-bold truncate ', {
              // eslint-disable-next-line react/prop-types
              'text-info': original.status === 'draft',
              // eslint-disable-next-line react/prop-types
              'text-cancelled': original.status === 'cancelled',
            })}
          >
            {value}
          </span>
        ),
      },
      {
        Header: (
          <span className="tblh-r ">
            <span>Amount</span>
            <span>VAT</span>
          </span>
        ),
        accessor: 'subTotal',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <span
            className={classNames('float-right text-right ', {
              // eslint-disable-next-line react/prop-types
              'text-info': original.status === 'draft',
              // eslint-disable-next-line react/prop-types
              'text-cancelled': original.status === 'cancelled',
            })}
          >
            {formatMoney(value)}
            <br />
            <span className="text-muted">
              {/*  eslint-disable-next-line react/prop-types */}
              {formatMoney(original.vatTotal)}
            </span>
          </span>
        ),
      },
      {
        Header: (
          <span>
            Currency
            <br />
            Exch.Rate
          </span>
        ),
        accessor: 'invoiceCurr.code',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <span>
            <span
              className={classNames({
                // eslint-disable-next-line react/prop-types
                'text-info': original.status === 'draft',
                // eslint-disable-next-line react/prop-types
                'text-cancelled': original.status === 'cancelled',
              })}
            >
              {value}
            </span>
            <br />
            <span
              className={classNames({
                // eslint-disable-next-line react/prop-types
                'text-info': original.status === 'draft',
                // eslint-disable-next-line react/prop-types
                'text-cancelled': original.status === 'cancelled',
              })}
            >
              {/*  eslint-disable-next-line react/prop-types */}
              {formatMoney(original.invoiceCurrRate, 1)}
            </span>
          </span>
        ),
      },
      {
        Header: (
          <span className="tblh-r ">
            <span>Net Total</span>
            <span>Payable</span>
          </span>
        ),
        accessor: 'netTotal',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <span
            className={classNames('float-right text-right ', {
              // eslint-disable-next-line react/prop-types
              'text-info': original.status === 'draft',
              // eslint-disable-next-line react/prop-types
              'text-cancelled': original.status === 'cancelled',
            })}
          >
            <span>{formatMoney(value)}</span>
            <br />
            <span className="text-muted">
              {/*  eslint-disable-next-line react/prop-types */}
              {formatMoney(original.unpaidAmount)}
            </span>
          </span>
        ),
      },
      {
        Header: (
          <span className="tblh-r ">
            <span>Amount</span>
          </span>
        ),
        accessor: 'rateAmount',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <span
            className={classNames('float-right', {
              // eslint-disable-next-line react/prop-types
              'text-info': original.status === 'draft',
              // eslint-disable-next-line react/prop-types
              'text-cancelled': original.status === 'cancelled',
            })}
          >
            {formatMoney(value)}
          </span>
        ),
      },
      {
        Header: (
          <span>
            User
            <br />
            Invoice Status
          </span>
        ),
        accessor: 'createdBy.name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <span
            className={classNames({
              // eslint-disable-next-line react/prop-types
              'text-info': original.status === 'draft',
              // eslint-disable-next-line react/prop-types
              'text-cancelled': original.status === 'cancelled',
            })}
          >
            {capitalize(value)}
            <br />
            <span
              className={classNames('font-weight-bold truncate ', {
                // eslint-disable-next-line react/prop-types
                'text-info': original.status === 'draft',
                // eslint-disable-next-line react/prop-types
                'text-cancelled': original.status === 'cancelled',
              })}
            >
              {/*  eslint-disable-next-line react/prop-types */}
              {original.status === 'draft' ? (
                'Draft'
              ) : //  eslint-disable-next-line react/prop-types
              original.status === 'cancelled' ? (
                'Cancelled'
              ) : (
                <span className="text-success">Confimed</span>
              )}
            </span>
          </span>
        ),
      },
      {
        Header: (
          <span>
            Branch
            <br />
            Profit Center
          </span>
        ),
        accessor: 'branch.name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <span
            className={classNames({
              // eslint-disable-next-line react/prop-types
              'text-info': original.status === 'draft',
              // eslint-disable-next-line react/prop-types
              'text-cancelled': original.status === 'cancelled',
            })}
          >
            {value}
            <br />
            <span>
              {/*  eslint-disable-next-line react/prop-types */}
              {original.profitCenter ? original.profitCenter.name : null}
            </span>
          </span>
        ),
      },
      {
        Header: '',
        accessor: 'tools',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row: { original } }) => (
          <div className="d-flex">
            {/* eslint-disable-next-line react/prop-types */}
            {original.status === 'confirmed' && original.ledgerStatus === 'not_ledgered' && (
              <>
                <div className="ml-2">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    title="Send to Accounting"
                    className="btn btn-xs btn-pill round btn-icon btn-outline-secondary"
                    // href="/ledgers/new?auth_proc_code=710&amp;findoc_id=869810"
                    // onClick={(e) => handleDraftInvoice(e, original)}
                    href="#"
                  >
                    <i className="fa fa-plus"></i>
                  </a>
                </div>
                <div className="ml-2">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    title="Set as Draft"
                    className="btn btn-xs btn-pill round btn-icon btn-outline-secondary"
                    rel="nofollow"
                    href="#"
                    onClick={(e) => handleDraftInvoice(e, original)}
                  >
                    <i className="far fa-thumbs-down"></i>
                  </a>
                </div>
              </>
            )}
            {/* eslint-disable-next-line react/prop-types */}
            {original.status === 'confirmed' && original.ledgerStatus === 'ledgered' && (
              <>
                <div className="ml-2">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    className="btn btn-xs btn-pill round btn-icon btn-outline-secondary"
                    rel="nofollow"
                    // href="/ledgers/2880318?auth_proc_code=711"
                    href="#"
                    // onClick={(e) => handleConfirmInvoice(e, original)}
                  >
                    <i className="fa fa-reply"></i>
                  </a>
                </div>
                <div className="ml-2">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    className="btn btn-xs btn-pill round btn-icon btn-outline-secondary"
                    href="#"
                    // href="/ledgers/2880318"
                    //  onClick={(e) => handleConfirmInvoice(e, original)}
                  >
                    <i className="far fa-file-alt"></i>
                  </a>
                </div>
              </>
            )}
            {/* eslint-disable-next-line react/prop-types */}
            {original.status === 'draft' && (
              <>
                <div className="ml-2">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    title="Confirm"
                    className="btn btn-xs btn-pill round btn-icon btn-outline-secondary"
                    rel="nofollow"
                    href="#"
                    onClick={(e) => handleConfirmInvoice(e, original)}
                  >
                    <i className="far fa-thumbs-up"></i>
                  </a>
                </div>
              </>
            )}
          </div>
        ),
      },
    ],
    [
      handleModalPrint,
      handleEditInvoice,
      handleCopyInvoice,
      handleDraftInvoice,
      handleConfirmInvoice,
      handleCancelInvoice,
      handleSendAccounting,
      handleDeleteInvoice,
      handlePaymentInvoice,
      handleSetInvoice,
    ],
  )

  const data = useMemo(() => (invoices && invoices.length > 0 ? invoices : []), [invoices])

  const fetchInvoiceData = useCallback(
    () => dispatch(fetchInvoices({ debitCredit: 'debit' })),
    [dispatch],
  )

  useEffect(() => {
    document.title = 'Sales Invoice'
    //
    fetchInvoiceData()
  }, [fetchInvoiceData])

  return (
    <div>
      <div className="cstContainerDef">
        <AppBreadcrumb items={breadcrumbList} />
      </div>
      <div className="pageContainer">
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <CCard className="cardCustom">
            <div className="card-header">
              <div className="toolBarContainer">
                <div className="customHeaderContainer">
                  <div className="customHeaderContainer-footer">
                    <div className="card-title">
                      <h3 className="cstCardbodyHeaderTitle">Sales Invoice</h3>
                    </div>
                  </div>
                </div>
                <div className="customHeaderToolbar">
                  <CButtonGroup>
                    <CButton
                      color="primary"
                      active
                      onClick={(e) => toLink(e, '/financor/debit/new')}
                    >
                      <i className="fa fa-plus mr-2" /> Create Sales Invoice
                    </CButton>
                  </CButtonGroup>
                </div>
              </div>
            </div>
            <CCardBody className="p-0">
              <div className="pageContainer-wrapper isTable">
                <Table columns={columns} data={data} setLedgerModal={setLedgerModal} />
              </div>
            </CCardBody>
          </CCard>
        </div>
      </div>

      {/* print modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        portal={false}
        transition={false}
        scrollable
        size="lg"
        visible={printModal}
        onClose={() => closeModalPrint()}
      >
        <CModalHeader>
          <CModalTitle className="ml-2">Print</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-2 bg-white">
          <CCard className="cardCustom gutter-b" style={{ boxShadow: 'none' }}>
            {findingTemplate ? (
              <div>
                <div className="loader-center">
                  <div className="mt-3">
                    <img src={loaderLg} alt="" />
                  </div>
                </div>
              </div>
            ) : (
              <TempModalInfo findingTemplate={findingTemplate} tempLinkUrl={tempLinkUrl} />
            )}
          </CCard>
        </CModalBody>
        <CModalFooter>
          <div className="p-2"></div>
        </CModalFooter>
      </CModal>

      {/* ledger modal */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={ledgerModal}
        title={
          <div className="space">
            <div>
              <span>Ledger</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={() => closeLedgerModal()}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>
          <LedgerModal closeSendAcc={closeSendAcc} />
        </div>
      </SlidingPane>

      {/*  send to acc panel*/}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={sendAccPanel}
        title={
          <div className="space">
            <div>
              <span>Ledger</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={(e) => closeSendAcc(e)}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>{/* <SendToAcc closeSendAcc={closeSendAcc} /> */}</div>
      </SlidingPane>

      {/* cancel inv panel*/}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={cancelInvPanel}
        title={
          <div className="space">
            <div>
              <span>Invoice</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={() => closeCancelInv()}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>{/* <CancelInvoice closeCancelInv={closeCancelInv} invId={invId} /> */}</div>
      </SlidingPane>

      {/* create payment panel*/}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={eftCollectionModal}
        title={
          <div className="space">
            <div>
              <span>EFT Collection</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={(e) => closeEftCollectionModal(e)}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>
          <EFTCollectionPanel
            closeEftCollectionModal={closeEftCollectionModal}
            itemInfo={itemInfo}
          />
        </div>
      </SlidingPane>

      {/* view payment panel*/}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={viewInvoice}
        title={
          <div className="space">
            <div>
              <span>Invoice</span>
            </div>
            <div>
              <CButton
                color="link"
                target="blank"
                className="mr-3"
                href={`/invoices/${itemInfo && itemInfo.linkId}`}
              >
                Open In New Tab
              </CButton>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={(e) => closeInvMod(e)}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>
          <ViewInvoicePanel closeInvMod={closeInvMod} itemInfo={itemInfo} />
        </div>
      </SlidingPane>
    </div>
  )
}

IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.bool,
}

GlobalFilter.propTypes = {
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func,
}

DefaultColumnFilter.propTypes = {
  column: PropTypes.object,
  setGlobalFilter: PropTypes.func,
}

fuzzyTextFilterFn.propTypes = {
  page: PropTypes.array,
  id: PropTypes.number,
  filterValue: PropTypes.array,
}

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  setLedgerModal: PropTypes.func,
}

export default SalesInvoice
