import React, { useState, useMemo, forwardRef, useRef } from 'react'
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
// import { useHistory } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilFilter, cilZoom, cilTrash, cilX } from '@coreui/icons'
import { useSelector } from 'react-redux'
import { AppBreadcrumb } from 'src/components'
import { useEffect } from 'react'
// import { fetchWorkOrders } from 'src/redux/slices/companySlice'
import { matchSorter } from 'match-sorter'
import classNames from 'classnames'
import Noty from 'noty'
// import ReactTooltip from 'react-tooltip'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import SlidingPane from 'react-sliding-pane'
import NewWorkOrder from './panels/NewWorkOrder'

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
GlobalFilter.propTypes = {
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func,
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
IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.bool,
}

const Table = ({ columns, data, setToggleTransPanel }) => {
  const [showFilter, setShowFilter] = useState(false)
  const { loadingWorkOrders } = useSelector((state) => state.company)

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

  const handleRemoveItem = (e, items) => {
    e.preventDefault()
    var n = new Noty({
      text: 'The record will be deleted, do you want to continue ?',
      layout: 'topCenter',
      progressBar: false,
      timeout: false,
      type: 'error',
      buttons: [
        Noty.button(
          'Delete',
          'btn btn-default btn-sm del-bnt-mr text-danger float-right',
          function () {
            // $(`.${item}`).hide()
            n.close()
          },
          { id: 'delItem' },
        ),

        Noty.button('Cancel', 'btn btn-default btn-sm float-right', function () {
          n.close()
        }),
      ],
    })
    n.show()
  }

  const handleImport = (e) => {
    e.preventDefault()
    setToggleTransPanel(true)
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    //
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    selectedFlatRows,
    state: { pageIndex, selectedRowIds, globalFilter },
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
            <CDropdown>
              <CDropdownToggle color="secondary" variant="outline" className="drop" caret={false}>
                <i className="fa fa-list-ol" />
                <i className="fa fa-angle-down" style={{ marginLeft: '3px' }} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem href="#" onClick={(e) => handleImport(e)}>
                  Import Company
                </CDropdownItem>
                <CDropdownItem href="#">Export Company</CDropdownItem>
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
                {selectedFlatRows.length === 1 ? 'Company' : 'WorkOrders'} Selected
              </div>
              <div className="filterButtons">
                <CButton
                  color="danger"
                  variant="ghost"
                  onClick={(e) => handleRemoveItem(e, selectedRowIds)}
                >
                  <CIcon icon={cilTrash} /> Delete
                </CButton>
              </div>
            </div>
          </div>
        </CCol>
      </CRow>
      <div className="pageBoxSizing-container cst-tableResponsive">
        <div className="table-responsive table-truncate pageTableWrapper">
          <div>
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
                {firstPageRows.map((row) => {
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
                })}
              </tbody>
            </table>
            {/* table info */}
            {!loadingWorkOrders && !firstPageRows.length > 0 && (
              <div className="table-info">
                <span>No records found.</span>
              </div>
            )}
            {loadingWorkOrders && (
              <div className="table-info">
                <span className="mt-5">
                  <img src={loaderLg} alt="" />
                </span>
              </div>
            )}
            {/* table pagination */}
            <div className="">
              <div className="pagination">
                {firstPageRows.length > 0 && (
                  <div>
                    <span>
                      Showing page {pageIndex + 1} of {pageOptions.length} - {data.length} entries
                    </span>
                  </div>
                )}
                {firstPageRows.length > 20 && (
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
          </div>
        </div>
      </div>
    </>
  )
}

const WorkOrders = () => {
  // const history = useHistory()
  // const dispatch = useDispatch()
  const [breadcrumbList] = useState([
    { name: 'Bookings', pathname: '/loadings' },
    { name: 'Planning', pathname: '/transports' },
    { name: 'Road Freight', pathname: '/positions?trans_method=road' },
    { name: 'Air Freight', pathname: '/positions?trans_method=air' },
    { name: 'Sea Freight', pathname: '/positions?trans_method=sea' },
    { name: 'Rail Freight', pathname: '/positions?trans_method=rail' },
    { name: 'Courier Freight', pathname: '/positions?trans_method=courier' },
    { name: 'Tarifs', pathname: '/tariffs' },
  ])
  const [toggleTransPanel, setToggleTransPanel] = useState(false)
  const [workorderPanel, setWorkorderPanel] = useState(false)
  const { workorders } = useSelector((state) => state.workorder)

  const handleWorkorder = (e) => {
    e.preventDefault()
    setWorkorderPanel(true)
  }

  //   const fetchCompanyData = useCallback(() => dispatch(fetchWorkOrders()), [dispatch])

  useEffect(() => {
    document.title = 'Work Orders'
    //
    // fetchCompanyData()
  }, [])

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
        Header: <span>Reference</span>,
        accessor: 'name',
      },
      {
        Header: <span>Vehicle</span>,
        accessor: 'customerType',
      },
      {
        Header: <span>Trailer</span>,
        accessor: 'phone',
      },

      {
        Header: <span>Driver</span>,
        accessor: 'email',
      },
      {
        Header: <span>Voyage Start Date</span>,
        accessor: 'address',
      },
      {
        Header: <span>Departure Point</span>,
        accessor: 'taxNo',
      },
      {
        Header: <span>Voyage Finish Date</span>,
        accessor: 'acRep',
      },

      {
        Header: <span>Arrival Point</span>,
        accessor: 'branch',
      },

      {
        Header: <span>Operator</span>,
        accessor: 'Operator',
      },

      {
        Header: <span>Branch</span>,
        accessor: 'Branch',
      },

      {
        Header: <span>Operation</span>,
        accessor: 'Operation',
      },
    ],
    [],
  )

  const data = useMemo(() => (workorders && workorders.length > 0 ? workorders : []), [workorders])

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
                      <h3 className="cstCardbodyHeaderTitle">Work Orders</h3>
                    </div>
                  </div>
                </div>
                <div className="customHeaderToolbar">
                  <CButtonGroup>
                    <CButton color="primary" active onClick={(e) => handleWorkorder(e)}>
                      <i className="fa fa-plus mr-2" /> Create Work Order
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

      {/* workorder */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={workorderPanel}
        title={
          <div className="space">
            <div>
              <span>New Work Order</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={(e) => setWorkorderPanel(false)}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>
          <NewWorkOrder />
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

export default WorkOrders
