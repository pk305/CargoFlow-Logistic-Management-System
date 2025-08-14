import React, { useState, useMemo, useEffect, useCallback } from 'react'
import {
  CRow,
  CCol,
  CFormInput,
  CButtonGroup,
  CButton,
  CPaginationItem,
  CPagination,
  CCard,
  CCardBody,
  CDropdownToggle,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import { Link, useHistory } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilFilter, cilZoom, cilX } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import {
  useTable,
  useExpanded,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useAsyncDebounce,
} from 'react-table'
import PropTypes from 'prop-types'
import { matchSorter } from 'match-sorter'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import { fetchPositions } from 'src/redux/slices/positionSlice'
import classNames from 'classnames'
import { AppBreadcrumb } from 'src/components'
import { toUpper } from 'lodash'
import SlidingPane from 'react-sliding-pane'

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

const Table = ({ columns, data, expandedRowObj }) => {
  const [showFilter, setShowFilter] = useState(false)
  const { fetchingPosition } = useSelector((state) => state.position)

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
      initialState: {
        pageSize: 20,
        expanded: expandedRowObj && expandedRowObj.hasOwnProperty(0) ? expandedRowObj : {},
      },
      defaultColumn,
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    useExpanded,
    usePagination,
    useRowSelect,
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
      </CRow>
      <div className="pageBoxSizing-container cst-tableResponsive">
        <div className="table-responsive table-truncate pageTableWrapper">
          <div>
            {fetchingPosition ? (
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
                            const { key, ...restColumn } = column.getHeaderProps({
                              className: column.className,
                              style: column.style,
                            })
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
                          <td colSpan={15} style={{ borderBottom: 'none', borderTop: 'none' }}>
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
        {!fetchingPosition && (
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

const RoadTransport = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [breadcrumbList] = useState([
    { name: 'Bookings', pathname: '/loadings' },
    { name: 'Planning', pathname: '/transports' },
    { name: 'Road Freight', pathname: '/positions?trans_method=road', active: true },
    { name: 'Air Freight', pathname: '/positions?trans_method=air' },
    { name: 'Sea Freight', pathname: '/positions?trans_method=sea' },
    { name: 'Rail Freight', pathname: '/positions?trans_method=rail' },
    { name: 'Courier Freight', pathname: '/positions?trans_method=courier' },
    { name: 'Tarifs', pathname: '/tariffs' },
  ])
  const { positions } = useSelector((state) => state.position)
  const [positionPanel, setPositionPanel] = useState(false)
  const [loadingPanel, setLoadingPanel] = useState(false)

  const toLink = (e, link) => {
    e.preventDefault()
    history.push(link)
  }

  const closePosPanel = () => {
    setPositionPanel(false)
  }

  const handlePositionPanel = useCallback(() => {
    setPositionPanel(true)
  }, [])

  const handleLoadingPanel = useCallback(() => {
    setLoadingPanel(true)
  }, [])

  const closeLoadPanel = () => {
    setLoadingPanel(false)
  }

  const expandedRows = useMemo(() => {
    if (positions && positions.length > 0) {
      let arr = []
      if (positions.length > 0) {
        arr = positions.map((x, idx) => {
          return x.subRows && x.subRows.hasOwnProperty(0) ? { [idx]: true } : undefined
        })
      }

      return arr
    }
  }, [positions])

  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'actions',
        Cell: () => (
          <div className="d-flex">
            <div className="table-action-dropdown">
              <CDropdown>
                <CDropdownToggle color="link">
                  <i className="fa fa-ellipsis-h"></i>
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>
                    <i className="fa fa-edit" /> Edit
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-copy" /> Copy
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-print" /> Print
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-pen" /> Change Booking Status
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-truck" /> Pickup/Last Mile Transport Request
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-plus" /> Create Warehouse Input
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-plus" /> Create Export Deport Input
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-clipboard" /> Recording History
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-times" /> Cancelled
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-trash" /> Delete
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
          </div>
        ),
      },
      {
        Header: '',
        accessor: 'position-planning',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row: { isExpanded, canExpand, original } }) => (
          <div>
            {!canExpand ? (
              // eslint-disable-next-line react/prop-types
              original.receiptNo ? (
                '1'
              ) : (
                <span>
                  <i className="fa fa-truck text-md fa-flip-horizontal position-planning"></i>
                </span>
              )
            ) : (
              <span>
                <i className="fa fa-truck text-md fa-flip-horizontal position-planning"></i>
              </span>
            )}
          </div>
        ),
      },

      {
        Header: (
          <div>
            <span>Reference</span>
            <br />
            <span className="text-muted">Reference</span>
          </div>
        ),
        style: {
          width: '150px',
        },
        accessor: 'name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { canExpand, original } }) => (
          <div className="link-search-hover">
            <div>
              <span className="font-weight-bold truncate">
                <Link
                  target="_blank" // eslint-disable-next-line react/prop-types
                  to={`/positions/${original.linkId}`}
                  className="text-primary"
                >
                  {value ? toUpper(value) : null}
                </Link>
              </span>
              {!canExpand ? (
                // eslint-disable-next-line react/prop-types
                original.receiptNo ? (
                  <div className="d-flex justify-content-between">
                    <span className="font-weight-bold truncate">
                      <i className="fa fa-cube text-md position position-planning mr-2"></i>
                      <Link
                        target="_blank"
                        // eslint-disable-next-line react/prop-types
                        to={`/loadings/${original.linkId}`}
                        className="text-primary"
                      >
                        {/* eslint-disable-next-line react/prop-types */}
                        {toUpper(original.receiptNo)}
                      </Link>
                    </span>
                  </div>
                ) : null
              ) : null}
            </div>
            <div className="btn-search-hover">
              {/* eslint-disable-next-line react/prop-types */}
              {original.receiptNo ? (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a
                  className="btn btn-xs btn-pill btn-icon btn-primary ml-2"
                  href="#"
                  onClick={(e) => handleLoadingPanel(e, original)}
                >
                  <i className="fa fa-search"></i>
                </a>
              ) : (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a
                  className="btn btn-xs btn-pill btn-icon btn-primary ml-2"
                  href="#"
                  onClick={(e) => handlePositionPanel(e, original)}
                >
                  <i className="fa fa-search"></i>
                </a>
              )}
            </div>
          </div>
        ),
      },
      {
        Header: (
          <span>
            <span>Truck &amp; Romork No</span>
            <br />
            <span className="text-muted">Incoterm \ Freight Price</span>
          </span>
        ),
        accessor: 'customer',
      },
      {
        Header: (
          <span>
            <span>Driver Name</span>
            <br />
            <span className="text-muted">Customer</span>
          </span>
        ),
        accessor: 'consignor',
      },
      {
        Header: (
          <span>
            <span>Operation</span>
            <br />
            <span className="text-muted">Consignor</span>
          </span>
        ),
        accessor: 'loadingDate',
      },
      {
        Header: (
          <span>
            <span>Operater</span>
            <br />
            <span className="text-muted">Consigee</span>
          </span>
        ),
        accessor: 'operation',
      },
      {
        Header: (
          <span>
            <span>Departure / Country</span>
            <br />
            <span className="text-muted">Departure Place</span>
          </span>
        ),
        accessor: 'collectionPlace',
      },
      {
        Header: (
          <span>
            <span>Arrival Country</span>
            <br />
            <span className="text-muted">Arrival / Place</span>
          </span>
        ),
        accessor: 'deliveryPlace',
      },
      {
        Header: (
          <span>
            <span>Status / Declaration Status</span>
            <br />
            <span className="text-muted">Commodity</span>
          </span>
        ),
        accessor: 'fullGroupage',
      },
      {
        Header: (
          <span>
            <span>Branch</span>
            <br />
            <span className="text-muted">Border Date</span>
          </span>
        ),
        accessor: 'm3',
      },
    ],
    [handlePositionPanel, handleLoadingPanel],
  )

  const data = useMemo(() => (positions && positions.length > 0 ? positions : []), [positions])

  const fetchPositionsData = useCallback(() => {
    dispatch(fetchPositions())
  }, [dispatch])

  useEffect(() => {
    fetchPositionsData()
  }, [fetchPositionsData])

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
                      <h3 className="cstCardbodyHeaderTitle">Road Freight</h3>
                    </div>
                  </div>
                </div>
                <div className="customHeaderToolbar">
                  <CButtonGroup>
                    <CButton
                      color="primary"
                      active
                      onClick={(e) => toLink(e, 'positions/new?trans_method=road')}
                    >
                      <i className="fa fa-plus mr-2" /> Create Road Transport
                    </CButton>
                  </CButtonGroup>
                </div>
              </div>
            </div>
            <CCardBody className="p-0">
              <div className="pageContainer-wrapper isTable">
                <Table columns={columns} data={data} expandedRowObj={expandedRows} />
              </div>
            </CCardBody>
          </CCard>
        </div>
      </div>

      {/* create postion */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={positionPanel}
        title={
          <div className="space">
            <div>
              <span>Position</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={() => closePosPanel()}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>positionPanel</div>
      </SlidingPane>

      {/* create loading */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={loadingPanel}
        title={
          <div className="space">
            <div>
              <span>Loading</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={() => closeLoadPanel()}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>Loading</div>
      </SlidingPane>
    </div>
  )
}

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  expandedRowObj: PropTypes.array,
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

export default RoadTransport
