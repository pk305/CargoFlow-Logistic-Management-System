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
import { cilFilter, cilX, cilZoom } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { AppBreadcrumb } from 'src/components'
import { useEffect } from 'react'
import { matchSorter } from 'match-sorter'
import classNames from 'classnames'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import SlidingPane from 'react-sliding-pane'
import NewTransfer from './NewTransfer'
import { getFindocs } from 'src/redux/slices/findocSlice'
import moment from 'moment'
import { formatMoney } from 'src/config/helpers'
import $ from 'jquery'
// import { EFTCollectionPanel } from '../salesInvoice/panel'

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

const Table = ({ columns, data }) => {
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

  const firstPageRows = rows.slice(0, 20)

  return (
    <div>
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
                  <CIcon icon={cilFilter} /> Add Filter
                </span>
              ) : (
                <span>
                  <CIcon icon={cilX} style={{ verticalAlign: '-2px', paddingRight: '2px' }} />
                  Cancel Filter
                </span>
              )}
            </CButton>
            {/* <CDropdown>
              <CDropdownToggle color="secondary" variant="outline" className="drop" caret={false}>
                <i className="fa fa-list-ol" />
                <i className="fa fa-angle-down" style={{ marginLeft: '3px' }} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem href="#" onClick={(e) => e.preventDefault()}>
                  Excel
                </CDropdownItem>
                <CDropdownItem href="#" onClick={(e) => e.preventDefault()}>
                  PDF
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown> */}
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
              {/* <div className="filterButtons">
                <CButton
                  color="danger"
                  variant="ghost"
                  onClick={(e) => handleRemoveItem(e, selectedRowIds)}
                >
                  <CIcon icon={cilTrash} /> Delete
                </CButton>
              </div> */}
            </div>
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
    </div>
  )
}

const CashTransaction = () => {
  const dispatch = useDispatch()
  const [breadcrumbList] = useState([
    { name: 'Sales Invoices', pathname: '/financor/debit' },
    { name: 'Purchase Invoices', pathname: '/financor/credit' },
    { name: 'Cash Transactions', pathname: '/financor/cash_trans', active: true },
    { name: 'Bank Transactions', pathname: '/financor/bank_trans' },
    { name: 'Driver Transactions', pathname: '/financor/driver_trans' },
    { name: 'Ledger Entries', pathname: '/gldocs' },
    { name: 'Reports', pathname: '/reports/home?group_type=financor' },
  ])
  const [toggleTransPanel, setToggleTransPanel] = useState(false)
  const { findocs } = useSelector((state) => state.findoc)
  const [cashPntCollectionModal, setCashPntCollectionModal] = useState(false)

  const closeTransPanel = () => {
    setToggleTransPanel(false)
  }

  const handleTransPanel = () => {
    setToggleTransPanel(true)
  }

  const handleCashpointCollect = (e) => {
    e.preventDefault()
    $('.dropdown-menu').removeClass('show')
  }

  // const handleCashpointCollection = useCallback((e, item) => {
  //   e.preventDefault()
  //   setCashPntCollectionModal(true)
  //   // setItemInfo(item)
  //   $('.dropdown-menu').removeClass('show')
  // }, [])

  const closeCashPointCollModal = () => {
    setCashPntCollectionModal(false)
  }

  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'actions',
        Cell: (props) => (
          <div>
            <div className="table-action-dropdown">
              <CDropdown>
                <CDropdownToggle color="link">
                  <i className="fa fa-ellipsis-h"></i>
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>
                    <i className="fa fa-print" />
                    <span className="text-rl">Print</span>
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-file" />
                    <span className="text-rl">Copy</span>
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-file" />
                    <span className="text-rl">Send Email</span>
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-file" />
                    <span className="text-rl">Set as Draft</span>
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-file" />
                    <span className="text-rl">Send to Accounting </span>
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-file" />
                    <span className="text-rl">Create Payment</span>
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-file" />
                    <span className="text-rl">Payment Mappings</span>
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-file" />
                    <span className="text-rl">Cancel Invoice</span>
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-file" />
                    <span className="text-rl">Add Loading</span>
                  </CDropdownItem>
                  <div className="separator m-0"></div>
                  <CDropdownItem>
                    <i className="fa fa-file" />
                    <span className="text-rl">Recording History</span>
                  </CDropdownItem>
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
        Cell: ({ value }) => <div className="truncate">{value}</div>,
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
          <div className="text-danger truncate">
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
    ],
    [],
  )
  const data = useMemo(() => (findocs && findocs.length > 0 ? findocs : []), [findocs])

  const fetchFindocData = useCallback(
    () => dispatch(getFindocs({ parentType: 'cashpoint_account' })),
    [dispatch],
  )

  useEffect(() => {
    document.title = 'Cash Accounts'
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
                      <h3 className="cstCardbodyHeaderTitle">Cash Accounts</h3>
                    </div>
                  </div>
                </div>
                <div className="customHeaderToolbar">
                  <CButtonGroup>
                    <CButton color="primary" active onClick={(e) => handleTransPanel(e)}>
                      Transfer
                    </CButton>
                    <CDropdown>
                      <CDropdownToggle color="info" className="brt-0" caret={false}>
                        Collection
                      </CDropdownToggle>
                      <CDropdownMenu>
                        {/* <CDropdownItem href="#">Returning Work Advance</CDropdownItem> */}
                        <CDropdownItem onClick={(e) => handleCashpointCollect(e)}>
                          Cashpoint Collection
                        </CDropdownItem>
                        {/* <CDropdownItem href="#">Returning Personal Advance</CDropdownItem> */}
                        <CDropdownItem href="#">Return Driver Advance</CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                    <CDropdown>
                      <CDropdownToggle color="success" className="drop" caret={false}>
                        Payment
                      </CDropdownToggle>
                      <CDropdownMenu>
                        {/* <CDropdownItem href="#">Work Advance</CDropdownItem> */}
                        <CDropdownItem href="#">Cashpoints Payments</CDropdownItem>
                        <CDropdownItem href="#">Cash Payments To Companies</CDropdownItem>
                        {/* <CDropdownItem href="#">Personal Advance</CDropdownItem> */}
                      </CDropdownMenu>
                    </CDropdown>
                  </CButtonGroup>
                </div>
              </div>
            </div>
            <CCardBody className="p-0">
              <div className="pageContainer-wrapper isTable">
                <Table columns={columns} data={data} />
              </div>
            </CCardBody>
          </CCard>
        </div>
      </div>

      {/* transfer */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={toggleTransPanel}
        title={
          <div className="space">
            <div>
              <span>Transfer</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={() => closeTransPanel()}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>
          <NewTransfer closeTransPanel={closeTransPanel} />
        </div>
      </SlidingPane>

      {/* cashpoint collection panel*/}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={cashPntCollectionModal}
        title={
          <div className="space">
            <div>
              <span>EFT Collection</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={(e) => closeCashPointCollModal(e)}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>
          {/* <EFTCollectionPanel
            closeCashPointCollModal={closeCashPointCollModal}
            // itemInfo={itemInfo}
          /> */}
        </div>
      </SlidingPane>
    </div>
  )
}

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
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

export default CashTransaction
