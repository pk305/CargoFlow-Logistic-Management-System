import React, { useState, useMemo, useCallback } from 'react'
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
  CBadge,
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
import { Link, useHistory } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilFilter, cilZoom, cilX } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { AppBreadcrumb } from 'src/components'
import { useEffect } from 'react'
import { matchSorter } from 'match-sorter'
import classNames from 'classnames'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import { fetchQuotations } from 'src/redux/slices/quotationSlice'
import moment from 'moment'
import { capitalize, toUpper } from 'lodash'
import SlidingPane from 'react-sliding-pane'
import QuotePanel from './panels/QuotePanel'

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

const fuzzyTextFilterFn = (page, id, filterValue) => {
  return matchSorter(page, filterValue, { keys: [(row) => row.values[id]] })
}

fuzzyTextFilterFn.autoRemove = (val) => !val

const Table = ({ columns, data }) => {
  const [showFilter, setShowFilter] = useState(false)
  const { fetchingQuotations } = useSelector((state) => state.quotation)

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
      initialState: { pageSize: 10 },
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    usePagination,
    useRowSelect,
  )

  const firstPageRows = page.slice(0, 10)

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
      </CRow>
      <div className="pageBoxSizing-container cst-tableResponsive">
        <div className="table-responsive table-truncate pageTableWrapper">
          <div>
            {fetchingQuotations ? (
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
        {!fetchingQuotations && (
          <div className="table-page">
            {firstPageRows.length > 0 && (
              <div>
                <span>
                  Showing page {pageIndex + 1} of {pageOptions.length} - {data.length}
                </span>
              </div>
            )}
            <div className="pagination">
              {firstPageRows.length > 0 && (
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

const Quotations = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [breadcrumbList] = useState([
    { name: 'Companies', pathname: '/companies' },
    { name: 'Contacts', pathname: '/contacts' },
    { name: 'Quotations', pathname: '/leads', active: true },
    { name: 'Company Notes', pathname: '/notices' },
    { name: 'Prospects', pathname: '/opportunities' },
    { name: 'Contracts', pathname: '/contracts' },
    { name: 'Tenders', pathname: '/tenders' },
  ])
  const [quotePanel, setQuotePanel] = useState(false)
  const [quoteId, setQuoteId] = useState(null)
  const [printModal, viewPrintModal] = useState(false)

  const closeQuotePanel = () => {
    setQuotePanel(false)
  }

  const handleModalPrint = (e, item) => {
    e.preventDefault()
    viewPrintModal(true)
  }

  const handleSetQuote = useCallback((e, item) => {
    e.preventDefault()
    setQuoteId(item.linkId)
    setQuotePanel(true)
  }, [])

  const toLink = (e, link) => {
    e.preventDefault()
    history.push(link)
  }

  const closeModalPrint = () => {
    viewPrintModal(false)
  }

  const { quotations } = useSelector((state) => state.quotation)

  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'actions',
        Cell: (props) => (
          <div className="d-flex">
            <div className="table-action-dropdown">
              <CDropdown>
                <CDropdownToggle color="link">
                  <i className="fa fa-ellipsis-h"></i>
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>
                    <i className="fa fa-edit mr-2" /> Edit
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-print mr-2" /> Print
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-copy mr-2" /> Copy
                  </CDropdownItem>
                  <CDropdownDivider />
                  <CDropdownItem>
                    <i className="fa fa-trash mr-2" /> Delete
                  </CDropdownItem>
                  <CDropdownDivider />
                  <CDropdownItem>
                    <i className="fa fa-envelope mr-2" /> Set as Sent
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-check mr-2" /> Set as Accepted
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-times mr-2" /> Set as Denied
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
          </div>
        ),
      },
      {
        Header: <span>Reference</span>,
        accessor: 'refNo',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <span className="font-weight-bold">
            <div className="link-search-hover truncate" style={{ minWidth: '120px' }}>
              <div>
                {/* eslint-disable-next-line react/prop-types */}
                <Link className="text-dark" to={`/leads/${original.linkId}`}>
                  {toUpper(value)}
                </Link>
              </div>
              <div className="btn-search-hover">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  className="btn btn-xs btn-pill btn-icon btn-primary ml-2"
                  href="#"
                  onClick={(e) => handleSetQuote(e, original)}
                >
                  <i className="fa fa-search"></i>
                </a>
              </div>
            </div>
          </span>
        ),
      },
      {
        Header: <span>Client</span>,
        accessor: 'client.name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <span className="font-weight-bold">
            <div className="link-search-hover truncate" style={{ minWidth: '160px' }}>
              <div>
                {/*  eslint-disable-next-line react/prop-types */}
                <span className="text-dark ">{value}</span>
              </div>
              <div className="btn-search-hover">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  className="btn btn-xs btn-pill btn-icon btn-primary ml-2"
                  href="#"
                  // onClick={(e) => handleSetContact(e, original)}
                >
                  <i className="fa fa-search"></i>
                </a>
              </div>
            </div>
          </span>
        ),
      },
      {
        Header: <span>Expiration Date</span>,
        accessor: 'dueDate',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span>{moment(value).format('L')}</span>,
      },

      {
        Header: <span>Operation Type</span>,
        accessor: 'loadingDate',
      },
      {
        Header: <span>Origin City/Port</span>,
        accessor: 'originCity',
      },
      {
        Header: <span>Destination City/Port</span>,
        accessor: 'destinationCity',
      },
      {
        Header: <span>Quote Price</span>,
        accessor: 'quotePrice',
      },
      {
        Header: <span>Branch</span>,
        accessor: 'branch.name',
      },
      {
        Header: <span>User</span>,
        accessor: 'createdBy.name',
      },
      {
        Header: <span>Customer Representative</span>,
        accessor: 'customerRep',
      },
      {
        Header: <span>Created At</span>,
        accessor: 'createdAt',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span>{moment(value).format('lll')}</span>,
      },
      {
        Header: <span>Status</span>,
        accessor: 'status',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => (
          <span>
            <CBadge color="primary">{capitalize(value)}</CBadge>
          </span>
        ),
      },
    ],
    [handleSetQuote],
  )

  const data = useMemo(() => (quotations && quotations.length > 0 ? quotations : []), [quotations])
  const fetchQuote = useCallback(() => dispatch(fetchQuotations()), [dispatch])

  useEffect(() => {
    document.title = 'Quotations'
    //
    fetchQuote()
  }, [fetchQuote])

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
                      <h3 className="cstCardbodyHeaderTitle">Quotations</h3>
                    </div>
                  </div>
                </div>
                <div className="customHeaderToolbar">
                  <CButtonGroup>
                    <CButton color="primary" active onClick={(e) => toLink(e, '/leads/new')}>
                      <i className="fa fa-plus mr-2" /> Create Quotation
                    </CButton>
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
        onClose={(e) => closeModalPrint(e)}
      >
        <CModalHeader>
          <CModalTitle className="ml-2">Print</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-2 bg-white">
          <CCard className="cardCustom gutter-b" style={{ boxShadow: 'none' }}>
            {/* {findingTemplate ? (
              <div>
                <div className="loader-center">
                  <div className="mt-3">
                    <img src={loaderLg} alt="" />
                  </div>
                </div>
              </div>
            ) : (
              <TempModalInfo findingTemplate={findingTemplate} tempInvoiceId={tempInvoiceId} />
            )} */}
          </CCard>
        </CModalBody>
      </CModal>

      {/* quotation panel */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={quotePanel}
        title={
          <div className="space">
            <div>
              <span>Quotation</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={(e) => closeQuotePanel(e)}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>
          <QuotePanel
            closeQuotePanel={closeQuotePanel}
            quoteId={quoteId}
            handleModalPrint={handleModalPrint}
          />
        </div>
      </SlidingPane>
    </div>
  )
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
}

export default Quotations
