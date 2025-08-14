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
import { useHistory } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilFilter, cilZoom, cilX } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { AppBreadcrumb } from 'src/components'
import { useEffect } from 'react'
import { matchSorter } from 'match-sorter'
import classNames from 'classnames'
import defaultAvatar from 'src/assets/images/avatars/defaultAvatar.png'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import SlidingPane from 'react-sliding-pane'
import { fetchDrivers } from 'src/redux/slices/driverSlice'

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
DefaultColumnFilter.propTypes = {
  column: PropTypes.object,
  setGlobalFilter: PropTypes.func,
}

const fuzzyTextFilterFn = (rows, id, filterValue) => {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] })
}
fuzzyTextFilterFn.propTypes = {
  rows: PropTypes.array,
  id: PropTypes.number,
  filterValue: PropTypes.array,
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
  const { fetchingDrivers } = useSelector((state) => state.driver)

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
      initialState: { pageSize: 20 },
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
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
            {fetchingDrivers ? (
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
        {!fetchingDrivers && (
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

const Drivers = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [breadcrumbList] = useState([
    { name: 'Vehicles', pathname: '/vehicles' },
    { name: 'Drivers', pathname: '/drivers', active: true },
    { name: 'Periodic Documents', pathname: '/periodocs' },
    { name: 'Service Logs', pathname: '/servicelogs' },
    { name: 'Expense Forms', pathname: '/expense_forms?person_type=driver' },
    { name: 'Fuel Logs', pathname: '/fuellogs?scope=vehiclel' },
    { name: 'Gate Actions', pathname: '/gate_actions' },
    { name: 'Facility Management', pathname: '/facility_managements' },
    { name: 'RoRo Tickets', pathname: '/transdocs?view_scope=roro' },
  ])
  const [toggleTransPanel, setToggleTransPanel] = useState(false)
  const { drivers } = useSelector((state) => state.driver)

  const toLink = (e, link) => {
    e.preventDefault()
    history.push(link)
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
                    <i className="fa fa-edit" />
                    <span className="text-rl">Edit</span>
                  </CDropdownItem>

                  <CDropdownItem>
                    <i className="fa fa-trash" />
                    <span className="text-rl">Delete</span>
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
          </div>
        ),
      },
      {
        Header: 'Profile Picture',
        accessor: 'avatar',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, rows: { original } }) => (
          <div className="text-center" style={{ maxWidth: '88px' }}>
            {value ? (
              <img
                width="30"
                height="30"
                // eslint-disable-next-line react/prop-types
                title={original.name}
                className="rounded-full object-cover"
                src={value}
                alt=""
              />
            ) : (
              <img
                width="30"
                height="30"
                title="John Doe"
                className="rounded-full object-cover"
                src={defaultAvatar}
                alt=""
              />
            )}
          </div>
        ),
      },
      {
        Header: <span>Driver Name</span>,
        accessor: 'name',
      },
      {
        Header: <span>Ref No / Passport</span>,
        accessor: 'refNo',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, rows: { original } }) => (
          <span>
            {/* eslint-disable-next-line react/prop-types */}
            {value} / {original.refNo}
          </span>
        ),
      },
      {
        Header: <span>Truck</span>,
        accessor: 'address',
      },
      {
        Header: <span>Mobile Phone</span>,
        accessor: 'taxNo',
      },
      {
        Header: <span>Staffed / Hackman</span>,
        accessor: 'branch',
      },
      {
        Header: <span>Operation</span>,
        accessor: 'Start',
      },
      {
        Header: <span>Branch</span>,
        accessor: 'Finish',
      },
      {
        Header: <span>City</span>,
        accessor: 'Advance',
      },
      {
        Header: <span>Country</span>,
        accessor: 'Expense',
      },
      {
        Header: <span>Hire Date</span>,
        accessor: 'Branch',
      },
      {
        Header: <span>Status</span>,
        accessor: 'Status',
      },
    ],
    [],
  )

  const data = useMemo(() => (drivers && drivers.length > 0 ? drivers : []), [drivers])
  const fetchDriverData = useCallback(() => dispatch(fetchDrivers()), [dispatch])

  useEffect(() => {
    document.title = 'Drivers'
    fetchDriverData()
  }, [fetchDriverData])

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
                      <h3 className="cstCardbodyHeaderTitle">Drivers</h3>
                    </div>
                  </div>
                </div>
                <div className="customHeaderToolbar">
                  <CButtonGroup>
                    <CButton color="primary" active onClick={(e) => toLink(e, '/drivers/new')}>
                      <i className="fa fa-plus mr-2" /> Create Driver
                    </CButton>
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
              <span>Import Company</span>
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

export default Drivers
