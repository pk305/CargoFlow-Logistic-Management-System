import React, { useState, useMemo, forwardRef, useRef, useCallback } from 'react'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CFormInput,
  CButtonGroup,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CPagination,
  CPaginationItem,
  CDropdownDivider,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
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
import CIcon from '@coreui/icons-react'
import { cilFilter, cilZoom, cilX } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { AppBreadcrumb } from 'src/components'
import { useEffect } from 'react'
import { matchSorter } from 'match-sorter'
import classNames from 'classnames'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import SlidingPane from 'react-sliding-pane'
import { changeFindocStatus, getFindocs } from 'src/redux/slices/findocSlice'
import moment from 'moment'
import { formatMoney } from 'src/config/helpers'
import { Link } from 'react-router-dom'
import { FinancialDoc } from './panel'
import Noty from 'noty'
import $ from 'jquery'
import { TempModalInfo } from 'src/views/templates'
import { findTemplate } from 'src/redux/slices/templateSlice'
import { toLower } from 'lodash'

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <>
      <CFormInput
        type="text"
        id="searchComp--users-search"
        name="users-search"
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

const fuzzyTextFilterFn = (rows, id, filterValue) => {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] })
}

fuzzyTextFilterFn.autoRemove = (val) => !val

// eslint-disable-next-line react/display-name
const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef()
  const resolvedRef = ref || defaultRef

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate
  }, [resolvedRef, indeterminate])

  return (
    <>
      <input type="checkbox" ref={resolvedRef} {...rest} />
    </>
  )
})

const Table = ({ columns, data, setToggleTransPanel }) => {
  const [showFilter, setShowFilter] = useState(false)
  const { gettingFindoc } = useSelector((state) => state.findoc)

  const filterTypes = useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    [],
  )

  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    [],
  )

  const handleFilter = (e) => {
    e.preventDefault()
    setShowFilter(!showFilter)
  }

  // const handleRemoveItem = (e, items) => {
  //   e.preventDefault()
  //   var n = new Noty({
  //     text: 'The record will be deleted, do you want to continue ?',
  //     layout: 'topCenter',
  //     progressBar: false,
  //     timeout: false,
  //     type: 'error',
  //     buttons: [
  //       Noty.button(
  //         'Delete',
  //         'btn btn-default btn-sm del-bnt-mr text-danger float-right',
  //         function () {
  //           // $(`.${item}`).hide()
  //           n.close()
  //         },
  //         { id: 'delItem' },
  //       ),

  //       Noty.button('Cancel', 'btn btn-default btn-sm float-right', function () {
  //         n.close()
  //       }),
  //     ],
  //   })
  //   n.show()
  // }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
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
      defaultColumn,
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
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

  const firstPageRows = rows.slice(0, 10)

  return (
    <>
      <CRow className="pageBoxSizing-filter">
        <CCol
          sm={12}
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
          sm={12}
          md={6}
          lg={6}
          xl={6}
          className={classNames({ hide: selectedFlatRows.length > 0 })}
        >
          <div className="cstSearchActions">
            <CButton color="secondary" variant="outline" onClick={(e) => handleFilter(e)}>
              {!showFilter ? (
                <span>
                  <CIcon icon={cilFilter} /> Filter
                </span>
              ) : (
                <span>
                  <CIcon icon={cilX} style={{ verticalAlign: '-2px', paddingRight: '2px' }} />
                  Cancel Filter
                </span>
              )}
            </CButton>
          </div>
        </CCol>
      </CRow>
      <div className="pageBoxSizing-container cst-tableResponsive">
        <div className="table-responsive table-truncate pageTableWrapper">
          <div>
            {gettingFindoc ? (
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
                                <div style={{ display: !showFilter ? 'none' : '' }}>
                                  {column.canFilter && key !== 'header_actions'
                                    ? column.render('Filter')
                                    : null}
                                </div>
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
        {!gettingFindoc && (
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
        )}
      </div>
    </>
  )
}

const BankTransaction = () => {
  const dispatch = useDispatch()
  const [breadcrumbList] = useState([
    { name: 'Sales Invoices', pathname: '/financor/debit' },
    { name: 'Purchase Invoices', pathname: '/financor/credit' },
    { name: 'Cash Transactions', pathname: '/financor/cash_trans' },
    { name: 'Bank Transactions', pathname: '/financor/bank_trans', active: true },
    { name: 'Driver Transactions', pathname: '/financor/driver_trans' },
    { name: 'Ledger Entries', pathname: '/gldocs' },
    { name: 'Reports', pathname: '/reports/home?group_type=financor' },
  ])
  const [toggleTransPanel, setToggleTransPanel] = useState(false)
  const [findocModal, setFindocModal] = useState(false)
  const [findocInfo, setFindocInfo] = useState(null)
  const [printModal, viewPrintModal] = useState(false)
  const { findingTemplate } = useSelector((state) => state.template)
  const [tempLinkUrl, setTempLinkUrl] = useState(null)
  const { findocs } = useSelector((state) => state.findoc)

  const handleSetFindoc = useCallback((e, item) => {
    e.preventDefault()
    setFindocInfo(item)
    setFindocModal(true)
  }, [])

  const closeFindocModal = () => {
    setFindocModal(false)
  }

  const handleModalPrint = useCallback(
    (e, item) => {
      e.preventDefault()
      $('.dropdown-menu').removeClass('show')
      dispatch(findTemplate({ Id: item.id, type: 'findoc' }))
      setTempLinkUrl(`/findocs/${toLower(item.linkId)}`)
      viewPrintModal(true)
    },
    [dispatch],
  )

  const closeModalPrint = () => {
    viewPrintModal(false)
    // setTempInvoiceId(null)
  }

  const handleSendToAcc = () => {}

  const handleConfirmFindoc = useCallback(
    async (e, item) => {
      e.preventDefault()
      $('.dropdown-menu').removeClass('show')
      if (item) {
        let finIds = [item.id]
        const resData = await dispatch(
          changeFindocStatus({ finIds: JSON.stringify(finIds), status: 'confirmed' }),
        ).unwrap()
        if (resData) {
          new Noty({
            type: 'alert',
            layout: 'topRight',
            id: 'finUpdate',
            text: ' Financial Document has been updated succesfully',
          }).show()
        }
      }
    },
    [dispatch],
  )

  const confirmLedgeredFindoc = useCallback(
    async (e, item) => {
      e.preventDefault()
      $('.dropdown-menu').removeClass('show')
      if (item) {
        let finIds = [item.id]
        const resData = await dispatch(
          changeFindocStatus({
            finIds: JSON.stringify(finIds),
            status: 'confirmed',
            ledgerStatus: 'not_ledgered',
          }),
        ).unwrap()
        if (resData) {
          new Noty({
            type: 'alert',
            layout: 'topRight',
            id: 'finUpdate',
            text: ' Financial Document has been updated succesfully',
          }).show()

          handleSendToAcc()
        }
      }
    },
    [dispatch],
  )

  const removeFindocAcc = useCallback((e, item) => {
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
            // const resData = await dispatch(destroyCompany(item.id)).unwrap()
            // if (resData) {
            //   new Noty({
            //     text: 'Company has been deleted succesfully',
            //     layout: 'topCenter',
            //     progressBar: false,
            //     timeout: 5000,
            //     type: 'alert',
            //   }).show()
            // }
            n.close()
          },
          { id: `delItem${item.id}` },
        ),

        Noty.button('Cancel', 'btn btn-default btn-sm float-right', function () {
          n.close()
        }),
      ],
    })
    n.show()
  }, [])

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
                  <CDropdownItem onClick={(e) => handleModalPrint(e, original)}>
                    <i className="fa fa-print mr-2" />
                    Print
                  </CDropdownItem>
                  {/* eslint-disable-next-line react/prop-types */}
                  {original.status === 'confirmed' &&
                  // eslint-disable-next-line react/prop-types
                  original.ledgerStatus === 'not_ledgered' ? (
                    <>
                      <CDropdownItem>
                        <i className="fa fa-plus mr-2" />
                        Send To Accounting
                      </CDropdownItem>
                      <CDropdownDivider />
                      <CDropdownItem>
                        <i className="far fa-thumbs-down mr-2" />
                        Set as Draft
                      </CDropdownItem>
                    </>
                  ) : // eslint-disable-next-line react/prop-types
                  original.status === 'confirmed' &&
                    // eslint-disable-next-line react/prop-types
                    original.ledgerStatus === 'ledgered' ? (
                    <>
                      <CDropdownItem onClick={(e) => removeFindocAcc(e, original)}>
                        <i className="fa fa-reply mr-2" />
                        Remove from Accounting
                      </CDropdownItem>
                      <CDropdownItem>
                        <i className="far fa-file-alt mr-2" />
                        Accounting Slip
                      </CDropdownItem>
                    </>
                  ) : null}
                  {/* eslint-disable-next-line react/prop-types */}
                  {original.status === 'draft' && (
                    <>
                      <CDropdownItem onClick={(e) => handleConfirmFindoc(e, original)}>
                        <i className="far fa-thumbs-up mr-2" />
                        Confirm
                      </CDropdownItem>
                      <CDropdownItem onClick={(e) => confirmLedgeredFindoc(e, original)}>
                        <i className="far fa-thumbs-up mr-2" />
                        Confirm &amp; Send To Accounting
                      </CDropdownItem>
                      <CDropdownItem>
                        <i className="fa fa-trash mr-2" />
                        Delete
                      </CDropdownItem>
                    </>
                  )}
                  <CDropdownItem>
                    <i className="far fa-copy mr-2" />
                    Copy
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="far fa-file mr-2" />
                    Arbitrage
                  </CDropdownItem>
                  {/* eslint-disable-next-line react/prop-types */}
                  {original.status === 'confirmed' &&
                    // eslint-disable-next-line react/prop-types
                    original.ledgerStatus === 'not_ledgered' && (
                      <>
                        <CDropdownItem>
                          <i className="fa fa-random mr-2" />
                          Relation with Expense Form
                        </CDropdownItem>
                      </>
                    )}
                  {/* eslint-disable-next-line react/prop-types  */}
                  {/* {original.status === 'draft' && (
                    <CDropdownItem>
                      <i className="fa fa-arrow-right mr-2" />
                      Send To Accounting
                    </CDropdownItem>
                  )} */}
                  {/* eslint-disable-next-line react/prop-types */}
                  {/* {original.status === 'denied' && (
                  
                  )} */}
                </CDropdownMenu>
              </CDropdown>
            </div>
          </div>
        ),
      },
      {
        Header: <span>Reference No</span>,
        accessor: 'code',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <div className="link-search-hover truncate">
            <div>
              <Link
                target="_blank"
                // eslint-disable-next-line react/prop-types
                to={`/findocs/${original.linkId}`}
                className="redirect-link truncate"
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
                onClick={(e) => handleSetFindoc(e, original)}
              >
                <i className="fa fa-search"></i>
              </a>
            </div>
          </div>
        ),
      },
      {
        Header: <span>Document Date</span>,
        accessor: 'docDate',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span>{value ? moment(value).format('DD-MM-YYYY') : null}</span>,
      },
      {
        Header: <span>Account</span>,
        accessor: 'account.parent.title',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <div className="truncate">{value}</div>,
      },

      {
        Header: <span>Related</span>,
        accessor: 'relatedAccount.title',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <div className="truncate">{value}</div>,
      },
      {
        Header: <span>Notes</span>,
        accessor: 'notes',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <div className="truncate">{value}</div>,
      },
      {
        Header: <span>Document Type</span>,
        accessor: 'docType',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <div className="text-success truncate">
            {value === 'eft_collection'
              ? // eslint-disable-next-line react/prop-types
                `EFT Collection${original.sum > 0 ? '(' + original.sum + ')' : ''}`
              : value === 'credit'
              ? 'Expense Item'
              : null}
          </div>
        ),
      },
      {
        Header: <span>Debit/Credit</span>,
        accessor: 'debitCredit',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => (
          <div className="truncate">
            {value === 'debit' ? 'Sales Item' : value === 'credit' ? 'Expense Item' : null}
          </div>
        ),
      },
      {
        Header: <span>Total</span>,
        accessor: 'totalAmount',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span className="float-right">{formatMoney(value)}</span>,
      },
      {
        Header: <span>Currency</span>,
        accessor: 'currency.name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <div className="truncate">{value}</div>,
      },
      {
        Header: <span>User</span>,
        accessor: 'createdBy.name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <div className="truncate">{value}</div>,
      },
      {
        Header: <span>Branch</span>,
        accessor: 'branch.name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <div className="truncate">{value}</div>,
      },
      {
        Header: '',
        accessor: 'tools',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row: { original } }) => (
          <div className="d-flex">
            <div>
              <a
                className="btn btn-xs btn-pill round btn-icon btn-outline-secondary"
                href="/templates?findoc_id=869835"
              >
                <i className="fa fa-print"></i>
              </a>{' '}
            </div>
            {/* eslint-disable-next-line react/prop-types */}
            {original.status === 'confirmed' && original.ledgerStatus === 'not_ledgered' && (
              <>
                <div className="ml-2">
                  <a
                    title="Send to Accounting"
                    className="btn btn-xs btn-pill round btn-icon btn-outline-secondary"
                    data-remote="true"
                    href="/ledgers/new?auth_proc_code=710&amp;findoc_id=869810"
                  >
                    <i className="fa fa-plus"></i>
                  </a>
                </div>
                <div className="ml-2">
                  <a
                    title="Set as Draft"
                    className="btn btn-xs btn-pill round btn-icon btn-outline-secondary"
                    rel="nofollow"
                    href="/findocs/869810?auth_proc_code=741&amp;findoc%5Bstatus%5D=draft&amp;only_findoc=true"
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
                  <a
                    className="btn btn-xs btn-pill round btn-icon btn-outline-secondary"
                    rel="nofollow"
                    href="/ledgers/2880318?auth_proc_code=711"
                  >
                    <i className="fa fa-reply"></i>
                  </a>
                </div>
                <div className="ml-2">
                  <a
                    className="btn btn-xs btn-pill round btn-icon btn-outline-secondary"
                    data-remote="true"
                    href="/ledgers/2880318"
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
                  <a
                    title="Confirm"
                    className="btn btn-xs btn-pill round btn-icon btn-outline-secondary"
                    rel="nofollow"
                    href="/findocs/865228?auth_proc_code=740&amp;findoc%5Bstatus%5D=confirmed&amp;only_findoc=true"
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
      handleSetFindoc,
      handleConfirmFindoc,
      confirmLedgeredFindoc,
      removeFindocAcc,
      handleModalPrint,
    ],
  )
  const data = useMemo(() => (findocs && findocs.length > 0 ? findocs : []), [findocs])

  const fetchFindocData = useCallback(
    () => dispatch(getFindocs({ parentType: 'bank_account' })),
    [dispatch],
  )

  useEffect(() => {
    document.title = 'Bank Accounts'
    //
    fetchFindocData()
  }, [fetchFindocData])

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
                      <h3 className="cstCardbodyHeaderTitle">Bank Accounts</h3>
                    </div>
                  </div>
                </div>
                <div className="customHeaderToolbar">
                  <CButtonGroup>
                    <CButton
                      color="primary"
                      active
                      // onClick={(e) => toLink(e, '/financor/credit/new')}
                    >
                      Transfer
                    </CButton>
                    <CDropdown>
                      <CDropdownToggle color="success" className="brt-0" caret={false}>
                        Collection
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem href="#">Bank Incomes</CDropdownItem>
                        <CDropdownItem href="#">EFT Collection</CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                    <CDropdown>
                      <CDropdownToggle color="info" className="brt-0" caret={false}>
                        Payment
                      </CDropdownToggle>
                      <CDropdownMenu>
                        {/* <CDropdownItem href="#">Work Advance From Bank Account</CDropdownItem> */}
                        {/* <CDropdownItem href="#">Salary Payment From Bank Account</CDropdownItem> */}
                        <CDropdownItem href="#">Bank Payments</CDropdownItem>
                        {/* <CDropdownItem href="#">Personal Adavance From Bank Account</CDropdownItem> */}
                        <CDropdownItem href="#">EFT Payment</CDropdownItem>
                        <CDropdownItem href="#">Transfer</CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                    <CDropdown>
                      <CDropdownToggle color="dark" className="drop" caret={false}>
                        <i className="fas fa-angle-down" />
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem href="#">Bulk Invoice Payment</CDropdownItem>
                        <CDropdownItem href="#">Create Bank Payment</CDropdownItem>
                        <CDropdownItem href="#">Bank Payment List</CDropdownItem>
                        <CDropdownItem href="#">Bank Transactions</CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </CButtonGroup>
                </div>
              </div>
            </div>
            <CCardBody className="p-0">
              <div className="pageContainer-wrapper isTable">
                <Table columns={columns} data={data} setToggleTransPanel={setToggleTransPanel} />
              </div>
            </CCardBody>
          </CCard>
        </div>
      </div>

      {/* import/export booking */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={toggleTransPanel}
        title={
          <div className="space">
            <div>
              <span>Import Bookings</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={() => setToggleTransPanel(false)}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
        width="400px"
      >
        <div>s</div>
        <div className="slide-pane__footer">
          <div className="float-right">
            <CButton color="primary" className="mr-2">
              Export
            </CButton>
            <CButton color="secondary" className="mr-2">
              Cancel
            </CButton>
          </div>
        </div>
      </SlidingPane>

      {/* financial doc */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={findocModal}
        title={
          <div className="space">
            <div>
              <span>Financial Document</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={() => closeFindocModal()}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>
          <FinancialDoc findocInfo={findocInfo} closeFindocModal={closeFindocModal} />
        </div>
      </SlidingPane>

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
      </CModal>
    </div>
  )
}

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  setToggleTransPanel: PropTypes.func,
}

GlobalFilter.propTypes = {
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func,
}

IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.bool,
}

DefaultColumnFilter.propTypes = {
  column: PropTypes.object,
  setGlobalFilter: PropTypes.func,
}

fuzzyTextFilterFn.propTypes = {
  rows: PropTypes.array,
  id: PropTypes.number,
  filterValue: PropTypes.array,
}

export default BankTransaction
