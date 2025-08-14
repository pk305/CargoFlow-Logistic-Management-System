import React, { useState, useMemo, useRef, forwardRef } from 'react'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CButton,
  CNav,
  CNavItem,
  CNavLink,
  CFormInput,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { useParams } from 'react-router-dom'
import Noty from 'noty'
import { useEffect } from 'react'
import { isUndefined } from 'lodash'
import { useCallback } from 'react'
import classNames from 'classnames'
import SlidingPane from 'react-sliding-pane'
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
import { cilFilter, cilZoom, cilTrash, cilX } from '@coreui/icons'
import { useSelector } from 'react-redux'
import { matchSorter } from 'match-sorter'
import loaderLg from 'src/assets/loader/loaderLg.gif'

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
  const { fetchingCompanies } = useSelector((state) => state.company)

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
                {selectedFlatRows.length === 1 ? 'Invoice' : 'Invoices'} selected
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
      <CRow>
        <CCol sm={12} md={12} lg={12} xl={12}>
          <div className="pageContainer newBookings">
            <div className="container-fluid h-100">
              <div className="d-block"></div>
              <CCard className="cardCustom">
                <div className="card-header cstHeaderTabs-line">
                  <div className="cstHeaderNav">
                    <CNav variant="tabs" className="nav-tabs-line nav-bold nav-tabs-line-2x">
                      <CNavItem>
                        <CNavLink href="#loading_details" active>
                          <span className="nav-text">Advance</span>
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink href="#loading_financial">
                          <span className="nav-text">Costs</span>
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                  </div>
                </div>
              </CCard>
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
            {!fetchingCompanies && !firstPageRows.length > 0 && (
              <div className="table-info">
                <span>No records found.</span>
              </div>
            )}
            {fetchingCompanies && (
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

const DriverAdvances = () => {
  const params = useParams()
  const [toggleTransPanel, setToggleTransPanel] = useState(false)
  const [transportData, setTransportData] = useState({})

  const successCreatedNotif = useCallback(() => {
    const { id } = params
    if (id) {
      const checkNotif = !isUndefined(localStorage.getItem('notif'))
        ? id === JSON.parse(localStorage.getItem('notif'))
          ? id
          : localStorage.setItem('notif', JSON.stringify(id))
        : null

      if (!checkNotif) {
        new Noty({
          type: 'alert',
          layout: 'topCenter',
          id: '3e-3er',
          text: 'Booking has been created succesfully',
        }).show()
      }
    }
  }, [params])

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setTransportData({ ...transportData, [name]: value })
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
        accessor: 'refNo',
      },
      {
        Header: <span>Document Date</span>,
        accessor: 'customerType',
      },
      {
        Header: <span>Account</span>,
        accessor: 'phone',
      },

      {
        Header: <span>Related</span>,
        accessor: 'email',
      },
      {
        Header: <span>Notes</span>,
        accessor: 'address',
      },
      {
        Header: <span>Document Type</span>,
        accessor: 'taxNo',
      },
      {
        Header: <span>Debit/Credit</span>,
        accessor: 'acRep',
      },
      {
        Header: <span>Total</span>,
        accessor: 'total',
      },
      {
        Header: <span>Currency</span>,
        accessor: 'curr',
      },
      {
        Header: <span>User</span>,
        accessor: 'userId',
      },
      {
        Header: <span>Branch</span>,
        accessor: 'branchId',
      },
    ],
    [],
  )

  const data = useMemo(() => [], [])

  useEffect(() => {
    successCreatedNotif()
  }, [successCreatedNotif])

  return (
    <div>
      <CCard className="cardCustom gutter-b">
        <CCardBody className="p-0">
          <div className="pageContainer-wrapper isTable">
            <Table columns={columns} data={data} setToggleTransPanel={setToggleTransPanel} />
          </div>
        </CCardBody>
      </CCard>
      {/* <div className="pageContainer newBookings">
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <CCard className="cardCustom">
            <CCardBody className="p-0">
              <div className="pageContainer-wrapper isTable">
                <Table columns={columns} data={data} setToggleTransPanel={setToggleTransPanel} />
              </div>

             
             
        <CCardBody className="p-3">
          <div className="tab-content">
            <div className="tab-pane fade show active" role="tabpanel">
              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="loading_details"
                  role="tabpanel"
                  aria-labelledby="loading_details"
                >
                  ss
                </div>
              </div>
            </div>
          </div>
        </CCardBody>
            </CCardBody>
          </CCard>
        </div>
      </div> */}

      {/* */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={toggleTransPanel}
        title={
          <div className="space">
            <div>
              <span>Truck Transport</span>
            </div>
            <div>
              {/* eslint-disable-next-line */}
              <a href="#" onClick={() => setToggleTransPanel(false)}>
                x
              </a>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>
          <div className="card cardCustom gutter-b">
            <div className="card-body p-6">
              <form
                className="simple_form horizontal-form"
                id="new_position"
                noValidate="novalidate"
                action="/positions"
                acceptCharset="UTF-8"
                data-remote="true"
                method="post"
              >
                <div className="row">
                  <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group select optional position_contract_type">
                      <label
                        className="control-label select optional"
                        htmlFor="position_contract_type"
                      >
                        Contract
                      </label>
                      <select
                        className="form-control select optional"
                        name="position[contract_type]"
                        id="position_contract_type"
                        onClick={(e) => handleChangeForm(e)}
                      >
                        <option value="owned">Our Own Vehicle</option>
                        <option value="rented">Contracted Vehicle</option>
                        <option value="unknown">Vehicle Not-Specified</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group string optional position_extref">
                      <label className="control-label string optional" htmlFor="position_extref">
                        Booking Ref.
                      </label>
                      <input
                        className="form-control string optional"
                        type="text"
                        name="position[extref]"
                        id="position_extref"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group boolean optional position_empty_truck">
                      <label className="boolean optional" htmlFor="position_empty_truck">
                        Empty Trailer ?
                      </label>
                      <div className="checkbox-custom checkbox-primary">
                        <input name="position[empty_truck]" type="hidden" value="0" />
                        <input
                          className="boolean optional"
                          type="checkbox"
                          value="1"
                          name="position[empty_truck]"
                          id="position_empty_truck"
                          onClick={(e) => handleChangeForm(e)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group select optional position_operation_id">
                      <label
                        className="control-label select optional"
                        htmlFor="position_operation_id"
                      >
                        Operation
                      </label>
                      <select
                        className="form-control select optional"
                        name="position[operation_id]"
                        id="position_operation_id"
                        onClick={(e) => handleChangeForm(e)}
                      >
                        <option value=""></option>
                        <option value="6638">Road Transports Team</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group select optional position_operator_id">
                      <label
                        className="control-label select optional"
                        htmlFor="position_operator_id"
                      >
                        Operator
                      </label>
                      <div>
                        <div className="input-group">
                          <select
                            className="form-control is-valid select optional select2-hidden-accessible"
                            data-plugin="select2"
                            name="position[operator_id]"
                            id="position_operator_id"
                            data-select2-id="position_operator_id"
                            tabIndex="-1"
                            aria-hidden="true"
                            onClick={(e) => handleChangeForm(e)}
                          >
                            <option value=""></option>
                            <option value="3835" data-select2-id="2">
                              Kennedy Peter
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group select optional position_branch_id">
                      <label className="control-label select optional" htmlFor="position_branch_id">
                        Branch
                      </label>
                      <select
                        className="form-control select optional"
                        name="position[branch_id]"
                        id="position_branch_id"
                        onClick={(e) => handleChangeForm(e)}
                      >
                        <option value=""></option>
                        <option value="1380">Head Office</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="rented hide">
                  <div className="row">
                    <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group string optional position_vessel_code">
                        <label
                          className="control-label string optional"
                          htmlFor="position_vessel_code"
                        >
                          Trailer
                        </label>
                        <input
                          className="form-control string optional"
                          type="text"
                          name="position[vessel_code]"
                          id="position_vessel_code"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group string optional position_truck_code">
                        <label
                          className="control-label string optional"
                          htmlFor="position_truck_code"
                        >
                          2.Transport Means
                        </label>
                        <input
                          className="form-control string optional"
                          type="text"
                          name="position[truck_code]"
                          id="position_truck_code"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group select optional position_truck_type">
                        <label
                          className="control-label select optional"
                          htmlFor="position_truck_type"
                        >
                          Truck Type
                        </label>
                        <select
                          className="form-control select optional"
                          name="position[truck_type]"
                          id="position_truck_type"
                          onClick={(e) => handleChangeForm(e)}
                        >
                          <option value=""></option>
                          <option value="trailer">Trailer</option>
                          <option value="truck">Truck</option>
                          <option value="lorry">Lorry</option>
                          <option value="van">Van</option>
                          <option value="forklift">Forklift</option>
                          <option value="bus">Bus</option>
                          <option value="car">Otomobile</option>
                          <option value="tanker">Tanker</option>
                          <option value="tractor">Tractor</option>
                          <option value="romork">Römork</option>
                          <option value="crane">Crane</option>
                          <option value="motorcycle">Motorcycle</option>
                          <option value="container">Container</option>
                          <option value="wagon">Wagon</option>
                          <option value="swapbody">swapbody</option>
                          <option value="minivan">Minivan</option>
                          <option value="frigo">Frigo</option>
                          <option value="flatbed">flatbed</option>
                          <option value="tarpaulin_truck">tarpaulin_truck</option>
                          <option value="box_container">box_container</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-12 col-sm-8 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group string optional position_driver_name">
                        <label
                          className="control-label string optional"
                          htmlFor="position_driver_name"
                        >
                          Driver Name
                        </label>
                        <input
                          className="form-control string optional"
                          type="text"
                          name="position[driver_name]"
                          id="position_driver_name"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group string optional position_driver_tel">
                        <label
                          className="control-label string optional"
                          htmlFor="position_driver_tel"
                        >
                          Driver Phone
                        </label>
                        <input
                          className="form-control string optional"
                          type="text"
                          name="position[driver_tel]"
                          id="position_driver_tel"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group company optional position_supplier_id">
                        <label
                          className="control-label company optional"
                          htmlFor="position_supplier_id"
                        >
                          Supplier Company
                        </label>
                        <div>
                          <div className="input-group">
                            <select
                              className="form-control company-select select2-hidden-accessible"
                              name="position[supplier_id]"
                              id="position_supplier_id"
                              data-select2-id="position_supplier_id"
                              tabIndex="-1"
                              aria-hidden="true"
                              onClick={(e) => handleChangeForm(e)}
                            >
                              <option value="" data-select2-id="17"></option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group decimal optional position_freight_price">
                        <label
                          className="control-label decimal optional"
                          htmlFor="position_freight_price"
                        >
                          Freight Price
                        </label>
                        <input
                          className="form-control numeric decimal optional"
                          type="number"
                          step="any"
                          value="0.0"
                          name="position[freight_price]"
                          id="position_freight_price"
                          onClick={(e) => handleChangeForm(e)}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group select optional position_freight_curr">
                        <label
                          className="control-label select optional"
                          htmlFor="position_freight_curr"
                        >
                          Currency
                        </label>
                        <select
                          className="form-control select optional"
                          name="position[freight_curr]"
                          id="position_freight_curr"
                          onClick={(e) => handleChangeForm(e)}
                        >
                          <option value=""></option>
                          <option value="EUR">EUR</option>
                          <option value="USD">USD</option>
                          <option value="CHF">CHF</option>
                          <option value="CAD">CAD</option>
                          <option value="CZK">CZK</option>
                          <option value="SEK">SEK</option>
                          <option value="PLN">PLN</option>
                          <option value="NOK">NOK</option>
                          <option value="AUD">AUD</option>
                          <option value="DKK">DKK</option>
                          <option value="KWD">KWD</option>
                          <option value="SAR">SAR</option>
                          <option value="RON">RON</option>
                          <option value="BGN">BGN</option>
                          <option value="RUB">RUB</option>
                          <option value="PKR">PKR</option>
                          <option value="CNY">CNY</option>
                          <option value="IRR">IRR</option>
                          <option value="JPY">JPY</option>
                          <option value="SGD">SGD</option>
                          <option value="AZN">AZN</option>
                          <option value="AED">AED</option>
                          <option value="HKD">HKD</option>
                          <option value="HUF">HUF</option>
                          <option value="MKD">MKD</option>
                          <option value="MYR">MYR</option>
                          <option value="KRW">KRW</option>
                          <option value="INR">INR</option>
                          <option value="XAU">XAU</option>
                          <option value="XAG">XAG</option>
                          <option value="XPT">XPT</option>
                          <option value="ZAR">ZAR</option>
                          <option value="VND">VND</option>
                          <option value="GEL">GEL</option>
                          <option value="GBP">GBP</option>
                          <option value="TRY">TRY</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="owned row">
                  <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group vehicle optional position_vessel_id">
                      <label
                        className="control-label vehicle optional"
                        htmlFor="position_vessel_id"
                      >
                        Trailer
                      </label>
                      <div>
                        <div className="input-group">
                          <select
                            className="form-control vehicle-select select2-hidden-accessible"
                            data-url="/roster/autocompletes.json?model=Fleet::Vehicle&amp;truck_type=vessel"
                            data-newurl="/vehicles/new"
                            name="position[vessel_id]"
                            id="position_vessel_id"
                            data-select2-id="position_vessel_id"
                            tabIndex="-1"
                            aria-hidden="true"
                            onClick={(e) => handleChangeForm(e)}
                          >
                            <option value="" data-select2-id="19"></option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group vehicle optional position_truck_id">
                      <label className="control-label vehicle optional" htmlFor="position_truck_id">
                        Tractor Unit
                      </label>
                      <div>
                        <div className="input-group">
                          <select
                            className="form-control vehicle-select select2-hidden-accessible"
                            data-url="/roster/autocompletes.json?model=Fleet::Vehicle&amp;truck_type=truck"
                            name="position[truck_id]"
                            id="position_truck_id"
                            data-select2-id="position_truck_id"
                            tabIndex="-1"
                            aria-hidden="true"
                            onClick={(e) => handleChangeForm(e)}
                          >
                            <option value="" data-select2-id="21"></option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-8 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group driver optional position_driver_id">
                      <label className="control-label driver optional" htmlFor="position_driver_id">
                        Driver
                      </label>
                      <div>
                        <div className="input-group">
                          <select
                            className="form-control driver-select select2-hidden-accessible"
                            data-url="/roster/autocompletes.json?model=Fleet::Driver"
                            name="position[driver_id]"
                            id="position_driver_id"
                            data-select2-id="position_driver_id"
                            tabIndex="-1"
                            aria-hidden="true"
                            onClick={(e) => handleChangeForm(e)}
                          >
                            <option value="" data-select2-id="23"></option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                    <div className="row">
                      <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <div className="form-group integer optional position_dep_odemeter">
                          <label
                            className="control-label integer optional"
                            htmlFor="position_dep_odemeter"
                          >
                            Departure Km
                          </label>
                          <input
                            className="form-control numeric integer optional"
                            type="number"
                            step="1"
                            value="0"
                            name="position[dep_odemeter]"
                            id="position_dep_odemeter"
                            onClick={(e) => handleChangeForm(e)}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <div className="form-group integer optional position_arv_odemeter">
                          <label
                            className="control-label integer optional"
                            htmlFor="position_arv_odemeter"
                          >
                            Arrival Km
                          </label>
                          <input
                            className="form-control numeric integer optional"
                            type="number"
                            step="1"
                            value="0"
                            name="position[arv_odemeter]"
                            id="position_arv_odemeter"
                            onClick={(e) => handleChangeForm(e)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                    <div className="row">
                      <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <div className="form-group decimal optional position_total_fuel">
                          <label
                            className="control-label decimal optional"
                            htmlFor="position_total_fuel"
                          >
                            Total Fuel
                          </label>
                          <input
                            className="form-control numeric decimal optional"
                            type="number"
                            step="any"
                            value="0.0"
                            name="position[total_fuel]"
                            id="position_total_fuel"
                            onClick={(e) => handleChangeForm(e)}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <div className="form-group decimal optional position_driver_payment">
                          <label
                            className="control-label decimal optional"
                            htmlFor="position_driver_payment"
                          >
                            Travel Payment
                          </label>
                          <input
                            className="form-control numeric decimal optional"
                            type="number"
                            step="any"
                            value="0.0"
                            name="position[driver_payment]"
                            id="position_driver_payment"
                            onClick={(e) => handleChangeForm(e)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group select optional position_status">
                      <label className="control-label select optional" htmlFor="position_status">
                        Status
                      </label>
                      <select
                        className="form-control select optional"
                        name="position[status]"
                        id="position_status"
                        onClick={(e) => handleChangeForm(e)}
                      >
                        <option value=""></option>
                        <option value="planning">Planning</option>
                        <option value="active">In Transit</option>
                        <option value="delivered">Completed / Delivered</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group select optional position_waybill_type">
                      <label
                        className="control-label select optional"
                        htmlFor="position_waybill_type"
                      >
                        Transit Type
                      </label>
                      <select
                        className="form-control select optional"
                        name="position[waybill_type]"
                        id="position_waybill_type"
                        onClick={(e) => handleChangeForm(e)}
                      >
                        <option value=""></option>
                        <option value="t1">T1/T2</option>
                        <option value="tir_karnesi">Truck Report Card</option>
                        <option value="irsaliye">Waybill</option>
                        <option value="ata_belgesi">ATA Certificate</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group string optional position_waybill_no">
                      <label
                        className="control-label string optional"
                        htmlFor="position_waybill_no"
                      >
                        Transit Doc. No
                      </label>
                      <input
                        className="form-control string optional"
                        type="text"
                        name="position[waybill_no]"
                        id="position_waybill_no"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group date_picker optional position_waybill_date">
                      <label
                        className="control-label date_picker optional"
                        htmlFor="position_waybill_date"
                      >
                        Transit Doc. Date
                      </label>
                      <input
                        className="form-control string date_picker optional flatpickr-input"
                        type="hidden"
                        data-plugin="datepicker"
                        name="position[waybill_date]"
                        id="position_waybill_date"
                      />
                      <input
                        className="form-control string date_picker optional form-control input"
                        placeholder=""
                        tabIndex="0"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2"></div>
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group select optional position_project_id">
                      <label
                        className="control-label select optional"
                        htmlFor="position_project_id"
                      >
                        Project
                      </label>
                      <select
                        className="form-control select optional select2-hidden-accessible"
                        data-plugin="select2"
                        name="position[project_id]"
                        id="position_project_id"
                        data-select2-id="position_project_id"
                        tabIndex="-1"
                        aria-hidden="true"
                        onClick={(e) => handleChangeForm(e)}
                      >
                        <option value="" data-select2-id="5"></option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="form-group hidden position_loading_id">
                  <input
                    className="form-control hidden"
                    type="hidden"
                    name="position[loading_id]"
                    id="position_loading_id"
                  />
                </div>
                <div className="form-group hidden position_loading_ids">
                  <input
                    className="form-control hidden"
                    type="hidden"
                    value="869649"
                    name="position[loading_ids]"
                    id="position_loading_ids"
                    onClick={(e) => handleChangeForm(e)}
                  />
                </div>
                <div className="form-group hidden position_trans_method">
                  <input
                    className="form-control hidden"
                    type="hidden"
                    value="road"
                    name="position[trans_method]"
                    id="position_trans_method"
                  />
                </div>
                <div className="form-group hidden position_ref_position_id">
                  <input
                    className="form-control hidden"
                    type="hidden"
                    name="position[ref_position_id]"
                    id="position_ref_position_id"
                  />
                </div>
                <div className="form-group hidden position_ref_loading_ids">
                  <input
                    className="form-control hidden"
                    type="hidden"
                    name="position[ref_loading_ids]"
                    id="position_ref_loading_ids"
                  />
                </div>

                <hr />
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <h4 className="fs-h4 font-weight-bolder mb-6 py-3 border-bottom">
                      Departure &amp; Arrival Ports
                    </h4>
                  </div>
                </div>
                <div className="row" id="departure_partial">
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group datetime_picker optional position_departure_date">
                      <label
                        className="control-label datetime_picker optional"
                        htmlFor="position_departure_date"
                      >
                        Departure Date
                      </label>
                      <input
                        className="form-control string datetime_picker optional flatpickr-input"
                        type="hidden"
                        data-plugin="datetimepicker"
                        value="2022-02-03 00:00"
                        name="position[departure_date]"
                        id="position_departure_date"
                        onClick={(e) => handleChangeForm(e)}
                      />
                      <input
                        className="form-control string datetime_picker optional form-control input"
                        placeholder=""
                        tabIndex="0"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-12 col-xs-12">
                    <div className="form-group string optional position_dep_place_name">
                      <label
                        className="control-label string optional"
                        htmlFor="position_dep_place_name"
                      >
                        Departure Place
                      </label>
                      <div>
                        <div className="input-group">
                          <input
                            className="form-control string optional"
                            onClick={(e) => handleChangeForm(e)}
                            value=""
                            name="position[dep_place_name]"
                            id="position_dep_place_name"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-3 col-lg-3 col-xl-3">
                    <div className="form-group city optional position_dep_city_id">
                      <label className="control-label city optional" htmlFor="position_dep_city_id">
                        Departure City
                      </label>
                      <div>
                        <div className="input-group">
                          <select
                            className="form-control chosen_input city-select select2-hidden-accessible"
                            onClick={(e) => handleChangeForm(e)}
                            name="position[dep_city_id]"
                            id="position_dep_city_id"
                            data-select2-id="position_dep_city_id"
                            tabIndex="-1"
                            aria-hidden="true"
                          >
                            <option value="0" data-select2-id="25"></option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group select optional position_dep_country_id">
                      <label
                        className="control-label select optional"
                        htmlFor="position_dep_country_id"
                      >
                        Collection Country
                      </label>
                      <div>
                        <div className="input-group">
                          <select
                            className="form-control is-valid select optional select2-hidden-accessible"
                            data-plugin="select2"
                            name="position[dep_country_id]"
                            id="position_dep_country_id"
                            data-select2-id="position_dep_country_id"
                            tabIndex="-1"
                            aria-hidden="true"
                            onClick={(e) => handleChangeForm(e)}
                          >
                            <option value=""></option>
                            <option value="+3">+3-CIBUTI</option>

                            <option value="ZZ">ZZ-NAHÇIVAN</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row" id="arrival_partial">
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group datetime_picker optional position_arrival_date">
                      <label
                        className="control-label datetime_picker optional"
                        htmlFor="position_arrival_date"
                      >
                        Arrival Date
                      </label>
                      <input
                        className="form-control string datetime_picker optional flatpickr-input"
                        type="hidden"
                        data-plugin="datetimepicker"
                        value="2022-02-13 00:00"
                        name="position[arrival_date]"
                        id="position_arrival_date"
                        onClick={(e) => handleChangeForm(e)}
                      />
                      <input
                        className="form-control string datetime_picker optional form-control input"
                        placeholder=""
                        tabIndex="0"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-12 col-xs-12">
                    <div className="form-group string optional position_arv_place_name">
                      <label
                        className="control-label string optional"
                        htmlFor="position_arv_place_name"
                      >
                        Arrival Place
                      </label>
                      <div>
                        <div className="input-group">
                          <input
                            className="form-control is-valid string optional"
                            data-place-city="#position_arv_city"
                            data-place-country="#position_arv_country_id"
                            data-place-type="#position_arv_place_type"
                            data-place-id="#position_arv_place_id"
                            data-plugin="typeahead-place"
                            type="text"
                            value="w"
                            name="position[arv_place_name]"
                            id="position_arv_place_name"
                            onClick={(e) => handleChangeForm(e)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-3 col-lg-3 col-xl-3">
                    <div className="form-group city optional position_arv_city_id">
                      <label className="control-label city optional" htmlFor="position_arv_city_id">
                        Arrival City
                      </label>
                      <div>
                        <div className="input-group">
                          <select
                            className="form-control chosen_input city-select select2-hidden-accessible"
                            data-url="/roster/autocompletes.json?model=Nimbos::City"
                            data-newurl="/cities/new"
                            data-placeholder=""
                            data-country_id="position_arv_country_id"
                            data-address-role=""
                            data-plugin="lookup"
                            name="position[arv_city_id]"
                            id="position_arv_city_id"
                            data-select2-id="position_arv_city_id"
                            tabIndex="-1"
                            aria-hidden="true"
                            onClick={(e) => handleChangeForm(e)}
                          >
                            <option value="" data-select2-id="28"></option>
                            <option value="27386" data-select2-id="29">
                              MOMBASA
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group select optional position_arv_country_id">
                      <label
                        className="control-label select optional"
                        htmlFor="position_arv_country_id"
                      >
                        Delivery Country
                      </label>
                      <div>
                        <div className="input-group">
                          <select
                            className="form-control is-valid select optional select2-hidden-accessible"
                            data-plugin="select2"
                            name="position[arv_country_id]"
                            id="position_arv_country_id"
                            data-select2-id="position_arv_country_id"
                            tabIndex="-1"
                            aria-hidden="true"
                            onClick={(e) => handleChangeForm(e)}
                          >
                            <option value=""></option>
                            <option value="+3">+3-CIBUTI</option>
                            <option value="AA">AA-N/A</option>
                            <option value="AD">AD-ANDORRA</option>
                            <option value="YT">YT-MAYOTTE</option>
                            <option value="ZA">ZA-SOUTH AFRICA</option>
                            <option value="ZM">ZM-ZAMBIA</option>
                            <option value="ZW">ZW-ZIMBABWE</option>
                            <option value="ZZ">ZZ-NAHÇIVAN</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group select optional position_route_id">
                      <label className="control-label select optional" htmlFor="position_route_id">
                        Route
                      </label>
                      <div>
                        <div className="input-group">
                          <select
                            className="form-control select optional select2-hidden-accessible"
                            data-plugin="select2"
                            name="position[route_id]"
                            id="position_route_id"
                            data-select2-id="position_route_id"
                            tabIndex="-1"
                            aria-hidden="true"
                            onClick={(e) => handleChangeForm(e)}
                          >
                            <option value="" data-select2-id="14"></option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                    <div className="form-group string optional position_route_notes">
                      <label
                        className="control-label string optional"
                        htmlFor="position_route_notes"
                      >
                        Route Notes
                      </label>
                      <input
                        className="form-control string optional"
                        type="text"
                        name="position[route_notes]"
                        id="position_route_notes"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group decimal optional position_route_km">
                      <label className="control-label decimal optional" htmlFor="position_route_km">
                        Route Km
                      </label>
                      <input
                        className="form-control numeric decimal optional"
                        type="number"
                        step="any"
                        value="0.0"
                        name="position[route_km]"
                        id="position_route_km"
                        onClick={(e) => handleChangeForm(e)}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                    <div className="form-group text optional position_notes">
                      <label className="control-label text optional" htmlFor="position_notes">
                        Notes
                      </label>
                      <textarea
                        className="form-control text optional"
                        rows="1"
                        name="position[notes]"
                        id="position_notes"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="slide-pane__footer">
          <div className="float-right">
            <CButton color="primary" className="mr-2">
              Save
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

export default DriverAdvances
