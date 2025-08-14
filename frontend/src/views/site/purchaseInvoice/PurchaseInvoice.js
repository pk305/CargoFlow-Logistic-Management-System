import React, { useState, useMemo, forwardRef, useRef, useCallback } from 'react'
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
} from '@coreui/react'
import $ from 'jquery'
import {
  useTable,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useAsyncDebounce,
} from 'react-table'
import PropTypes from 'prop-types'
import { Link, useHistory } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilFilter, cilZoom, cilTrash, cilX, cilCheck, cilCopy, cilArrowRight } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { AppBreadcrumb } from 'src/components'
import { useEffect } from 'react'
import { matchSorter } from 'match-sorter'
import classNames from 'classnames'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import { destroyInvoice, fetchInvoices } from 'src/redux/slices/invoiceSlice'
import { capitalize } from 'lodash'
import moment from 'moment'
import { formatMoney } from 'src/config/helpers'
import { confirmInvoiceStatus } from 'src/redux/slices/invoiceSlice'
import SlidingPane from 'react-sliding-pane'
import SendToAcc from './panels/SendToAcc'
import Noty from 'noty'
import CancelInvoice from './panels/CancelInvoice'

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <>
      <input
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

const Table = ({ columns, data, handleSetToAcc }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [showFilter, setShowFilter] = useState(false)
  const { fetchingInvoices } = useSelector((state) => state.invoice)

  const filterTypes = useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: (page, id, filterValue) => {
        return page.filter((row) => {
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

  const handleConfirmInvoice = async (e, items) => {
    e.preventDefault()
    let invIds = []
    if (items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        invIds.push(items[i].original.id)
      }
    }
    await dispatch(
      confirmInvoiceStatus({ invIds: JSON.stringify(invIds), status: 'confirmed' }),
    ).unwrap()

    $('.dropdown-menu').removeClass('show')
  }

  const handleSendAccounting = (e, items) => {
    e.preventDefault()
    handleSetToAcc()
    $('.dropdown-menu').removeClass('show')
  }

  const handleCopyInvoice = (e, items) => {
    e.preventDefault()
    const invId = items.length === 1 ? items[0].original.linkId : null
    if (invId) {
      history.push(`/invoices/${invId}/clone`)
    }
    $('.dropdown-menu').removeClass('show')
  }

  const handleRemoveAccInv = (e, items) => {
    e.preventDefault()
    new Noty({
      type: 'alert',
      layout: 'topRight',
      id: 'rmvAcc',
      text: 'Invoice removed from Accounting',
    }).show()
    $('.dropdown-menu').removeClass('show')
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
      filterTypes,
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
                    <CDropdownItem
                      href="#"
                      onClick={(e) => handleConfirmInvoice(e, selectedFlatRows)}
                    >
                      <CIcon icon={cilCheck} className="mr-2" /> Confirm
                    </CDropdownItem>
                    <CDropdownItem
                      href="#"
                      onClick={(e) => handleSendAccounting(e, selectedFlatRows)}
                    >
                      <CIcon icon={cilArrowRight} className="mr-2" /> Send to Accounting
                    </CDropdownItem>
                    <CDropdownItem href="#" onClick={(e) => handleCopyInvoice(e, selectedFlatRows)}>
                      <CIcon icon={cilCopy} className="mr-2" /> Copy
                    </CDropdownItem>
                    <CDropdownItem
                      href="#"
                      onClick={(e) => handleRemoveAccInv(e, selectedFlatRows)}
                    >
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
            {fetchingInvoices ? (
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
                                  {column.canFilter &&
                                  key !== 'header_actions' &&
                                  key !== 'header_countVar'
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
        {!fetchingInvoices && (
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

const PurchaseInvoice = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [breadcrumbList] = useState([
    { name: 'Sales Invoices', pathname: '/financor/debit' },
    { name: 'Purchase Invoices', pathname: '/financor/credit', active: true },
    { name: 'Cash Transactions', pathname: '/financor/cash_trans' },
    { name: 'Bank Transactions', pathname: '/financor/bank_trans' },
    { name: 'Driver Transactions', pathname: '/financor/driver_trans' },
    { name: 'Ledger Entries', pathname: '/gldocs' },
    { name: 'Reports', pathname: '/reports/home?group_type=financor' },
  ])
  const { invoices } = useSelector((state) => state.invoice)
  const [sendAccPanel, setSendAccPanel] = useState(false)
  const [cancelInvPanel, setCancelInvPanel] = useState(false)
  const [invId, setInvId] = useState(null)

  const toLink = (e, link) => {
    e.preventDefault()
    history.push(link)
  }

  const handleModalPrint = useCallback((e, item) => {
    e.preventDefault()
    // dispatch(findTemplate({ Id: item.id, type: 'invoice' }))
    // setTempInvoiceId(item.invoiceRefId)
    // viewPrintModal(!printModal)
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

  const handleCancelInvoice = useCallback(
    (e, item) => {
      e.preventDefault()
      setCancelInvPanel(true)
      setInvId(item)
      $('.dropdown-menu').removeClass('show')
    },
    [setInvId],
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

  const handleSetToAcc = () => {
    setSendAccPanel(!sendAccPanel)
  }

  const handleSendAccounting = useCallback((e, item) => {
    e.preventDefault()
    setSendAccPanel(false)
    $('.dropdown-menu').removeClass('show')
  }, [])

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

  const closeSendAcc = () => {
    setSendAccPanel(false)
  }

  const closeCancelInv = () => {
    setCancelInvPanel(false)
  }

  const handleCopyInvoice = useCallback(
    (e, item) => {
      e.preventDefault()
      if (item) {
        history.push(`/invoices/${item.linkId}/clone`)
      }
      $('.dropdown-menu').removeClass('show')
    },
    [history],
  )

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
                    <CDropdownItem onClick={(e) => handleModalPrint(e, original)}>
                      <i className="fa fa-edit" />
                      <span className="text-rl">Edit</span>
                    </CDropdownItem>
                  ) : null}
                  <CDropdownItem onClick={(e) => handleModalPrint(e, original)}>
                    <i className="fa fa-print" />
                    <span className="text-rl">Print</span>
                  </CDropdownItem>
                  <CDropdownItem onClick={(e) => handleCopyInvoice(e, original)}>
                    <i className="fa fa-file" />
                    <span className="text-rl">Copy</span>
                  </CDropdownItem>
                  {/* eslint-disable-next-line react/prop-types */}
                  {original.status === 'draft' ? (
                    <>
                      <CDropdownItem>
                        <i className="fa fa-file" />
                        <span className="text-rl">Select Estimates</span>
                      </CDropdownItem>
                      <CDropdownItem onClick={(e) => handleConfirmInvoice(e, original)}>
                        <i className="fa fa-check" />
                        <span className="text-rl">Confirm</span>
                      </CDropdownItem>
                    </>
                  ) : null}
                  {/* eslint-disable-next-line react/prop-types */}
                  {original.status === 'confirmed' ? (
                    <>
                      <CDropdownItem onClick={(e) => handleDraftInvoice(e, original)}>
                        <i className="far fa-thumbs-down" />
                        <span className="text-rl">Set As Draft</span>
                      </CDropdownItem>
                      <CDropdownItem onClick={(e) => handleSendAccounting(e, original)}>
                        <i className="fa fa-plus" />
                        <span className="text-rl">Send To Accounting</span>
                      </CDropdownItem>
                      <CDropdownItem>
                        <i className="fa fa-check" />
                        <span className="text-rl">Payment Mappings</span>
                      </CDropdownItem>
                    </>
                  ) : null}
                  {/* eslint-disable-next-line react/prop-types */}
                  {original.status === 'cancelled' ? (
                    <>
                      <CDropdownItem>
                        <i className="far fa-thumbs-up" />
                        <span className="text-rl">Confirm</span>
                      </CDropdownItem>
                    </>
                  ) : null}
                  {/* eslint-disable-next-line react/prop-types */}
                  {original.status !== 'cancelled' ? (
                    <CDropdownItem onClick={(e) => handleCancelInvoice(e, original)}>
                      <i className="fa fa-times" />
                      <span className="text-rl">Cancel Invoice</span>
                    </CDropdownItem>
                  ) : null}
                  <CDropdownItem>
                    <i className="fa fa-plus" />
                    <span className="text-rl">Add Loading</span>
                  </CDropdownItem>
                  {/* eslint-disable-next-line react/prop-types */}
                  {original.status !== 'confirmed' ? (
                    <CDropdownItem onClick={(e) => handleDeleteInvoice(e, original)}>
                      <i className="fa fa-trash" />
                      <span className="text-rl">Delete</span>
                    </CDropdownItem>
                  ) : null}
                  {/* <div className="separator m-0"></div> */}
                  {/* <CDropdownItem>
                    <i className="fa fa-file" />
                    <span className="text-rl">Recording History</span>
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
          <div className="link-search-hover">
            <span>
              <Link
                // eslint-disable-next-line react/prop-types
                to={`/invoices/${original.linkId}`}
                className={classNames('font-weight-bold truncate link-search-hover', {
                  // eslint-disable-next-line react/prop-types
                  'text-info': original.status === 'draft',
                  // eslint-disable-next-line react/prop-types
                  'text-cancelled': original.status === 'cancelled',
                })}
              >
                {value}
              </Link>
            </span>
            <div className="btn-search-hover">
              {/*  eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                className="btn btn-xs btn-pill btn-icon btn-primary ml-2"
                href="#"
                // onClick={(e) => handleSetContact(e, original)}
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
        accessor: 'invoiceCurr.name',
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
              {original.invoiceCurrRate}
            </span>
          </span>
        ),
      },
      {
        Header: (
          <span className="tblh-r ">
            <span>Net Total</span>
            <span>Unpaid Amount</span>
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
                <span className="text-primary">Confimed</span>
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
              BALANCE ACCOUNT
            </span>
          </span>
        ),
      },
    ],
    [
      handleModalPrint,
      handleCopyInvoice,
      handleCancelInvoice,
      handleSendAccounting,
      handleDraftInvoice,
      handleDeleteInvoice,
      handleConfirmInvoice,
    ],
  )

  const data = useMemo(() => (invoices && invoices.length > 0 ? invoices : []), [invoices])

  const fetchInvoiceData = useCallback(
    () => dispatch(fetchInvoices({ debitCredit: 'credit' })),
    [dispatch],
  )

  useEffect(() => {
    document.title = 'Purchase Invoice'
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
                      <h3 className="cstCardbodyHeaderTitle">Purchase Invoice</h3>
                    </div>
                  </div>
                </div>
                <div className="customHeaderToolbar">
                  <CButtonGroup>
                    <CButton
                      color="primary"
                      active
                      onClick={(e) => toLink(e, '/financor/credit/new')}
                    >
                      <i className="fa fa-plus mr-2" /> Create Purchase Invoice
                    </CButton>
                  </CButtonGroup>
                </div>
              </div>
            </div>
            <CCardBody className="p-0">
              <div className="pageContainer-wrapper isTable">
                <Table columns={columns} data={data} handleSetToAcc={() => handleSetToAcc()} />
              </div>
            </CCardBody>
          </CCard>
        </div>
      </div>

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
                onClick={() => closeSendAcc()}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>
          <SendToAcc closeSendAcc={closeSendAcc} />
        </div>
      </SlidingPane>

      {/*  cancel inv panel*/}
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
        <div>
          <CancelInvoice closeCancelInv={closeCancelInv} invId={invId} />
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
  handleSetToAcc: PropTypes.func,
}

export default PurchaseInvoice
