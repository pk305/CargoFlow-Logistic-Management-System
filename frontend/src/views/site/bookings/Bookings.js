import React, { useState, useMemo, useCallback, useEffect } from 'react'
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
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CNav,
  CNavItem,
  CNavLink,
  CPagination,
  CPaginationItem,
  CDropdownItemPlain,
} from '@coreui/react'
import { useHistory, Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilFilter, cilZoom, cilX } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { destroyBooking, fetchBookings } from 'src/redux/slices/bookingSlice'
import { AppBreadcrumb } from 'src/components'
import {
  useTable,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useAsyncDebounce,
} from 'react-table'
import moment from 'moment'
import SlidingPane from 'react-sliding-pane'
import PropTypes from 'prop-types'
import { matchSorter } from 'match-sorter'
import classNames from 'classnames'
import Noty from 'noty'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import $ from 'jquery'
import { toUpper } from 'lodash'
import NewBookingPanel from './NewBookingPanel'

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
  const { fetchingBooking } = useSelector((state) => state.booking)

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
            {fetchingBooking ? (
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
        {!fetchingBooking && (
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

const Bookings = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [breadcrumbList] = useState([
    { name: 'Bookings', pathname: '/loadings', active: true },
    { name: 'Planning', pathname: '/transports' },
    { name: 'Road Freight', pathname: '/positions?trans_method=road' },
    { name: 'Air Freight', pathname: '/positions?trans_method=air' },
    { name: 'Sea Freight', pathname: '/positions?trans_method=sea' },
    { name: 'Rail Freight', pathname: '/positions?trans_method=rail' },
    { name: 'Courier Freight', pathname: '/positions?trans_method=courier' },
    { name: 'Tarifs', pathname: '/tariffs' },
  ])
  const [toggleTransPanel, setToggleTransPanel] = useState(false)
  const [editbkngPanel, setEditbkngPanel] = useState(false)
  const [stockInptPanel] = useState(false)
  const [newBookingPanel, setNewBookingPanel] = useState(false)
  const [loadingPanel, setLoadingPanel] = useState(false)
  const [printModal, viewPrintModal] = useState(false)
  const { bookings } = useSelector((state) => state.booking)

  const handleModalPrint = useCallback(
    (e) => {
      e.preventDefault()
      viewPrintModal(!printModal)
    },
    [printModal],
  )

  const handleCreateBooking = (e) => {
    e.preventDefault()
    history.push('/loadings/new')
  }

  const handleRemoveInvoice = useCallback(
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
              const resData = await dispatch(destroyBooking(item.row.original.id)).unwrap()
              if (resData) {
                new Noty({
                  text: 'Booking has been deleted succesfully',
                  layout: 'topCenter',
                  progressBar: false,
                  timeout: 5000,
                  type: 'alert',
                }).show()
              }
              n.close()
            },
            { id: `delItem-${item.id}` },
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

  const handleSearchInvoice = useCallback((e, item) => {
    e.preventDefault()
    // console.log(item.original)
    setNewBookingPanel(true)
  }, [])

  const closeModalPrint = () => {
    viewPrintModal(false)
  }

  const handleEditbkPanel = useCallback((e) => {
    e.preventDefault()
    setEditbkngPanel(true)
  }, [])

  const closeLoadingPanel = () => {
    setLoadingPanel(false)
  }

  const closeEditbkPanel = () => {
    setEditbkngPanel(false)
  }

  const closeNewBkPanel = () => {
    setNewBookingPanel(false)
  }

  const toLink = useCallback(
    (e, h) => {
      setEditbkngPanel(false)
      history.push(h)
    },
    [history],
  )

  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'actions',
        Cell: (props) => (
          <div className="d-flex">
            <div className="table-action-dropdown">
              <CDropdown className="dropdown-hover">
                <CDropdownToggle color="link">
                  <i className="fa fa-ellipsis-h"></i>
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem onClick={(e) => handleEditbkPanel(e)}>
                    <i className="fa fa-edit mr-2" /> Edit
                  </CDropdownItem>
                  <CDropdownItem onClick={(e) => toLink(e, '/loadings/new?exloading_id=933575')}>
                    <i className="fa fa-copy mr-2" /> Copy
                  </CDropdownItem>
                  <CDropdownItem onClick={(e) => handleModalPrint(e)}>
                    <i className="fa fa-print mr-2" /> Print
                  </CDropdownItem>
                  <CDropdownItemPlain className="dropright">
                    <i className="fa fa-pen" /> Change Booking Status
                    <div>
                      <ul className="dropdown-menu">
                        <CDropdownItem
                          href="/loadings/933575-nue220000012?loading%5Bstatus%5D=pending"
                          rel="nofollow"
                        >
                          Goods Deliverd
                        </CDropdownItem>
                        <CDropdownItem
                          href="/loadings/933575-nue220000012?loading%5Bstatus%5D=pending"
                          rel="nofollow"
                        >
                          Planning
                        </CDropdownItem>
                        <CDropdownItem
                          href="/loadings/933575-nue220000012?loading%5Bstatus%5D=delivered"
                          rel="nofollow"
                        >
                          Cancelled
                        </CDropdownItem>
                      </ul>
                    </div>
                  </CDropdownItemPlain>
                  <CDropdownItem>
                    <i className="fa fa-truck mr-2" /> Pickup/Last Mile Transport Request
                  </CDropdownItem>
                  {/* <CDropdownItem>
                    <i className="fa fa-plus mr-2" /> Create Warehouse Input
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-plus mr-2" /> Create Export Deport Input
                  </CDropdownItem> */}
                  {/* <CDropdownItem>
                    <i className="fa fa-clipboard mr-2" /> Recording History
                  </CDropdownItem> */}
                  {/* <CDropdownItem>
                    <i className="fa fa-times mr-2" /> Cancelled
                  </CDropdownItem> */}
                  <CDropdownItem onClick={(e) => handleRemoveInvoice(e, props)}>
                    <i className="fa fa-trash mr-2" /> Delete
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
          </div>
        ),
      },
      {
        Header: (
          <span>
            <span>Reference</span>
            <br />
            <span className="text-muted">Container Number</span>
          </span>
        ),
        accessor: 'receiptNo',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row }) => (
          <div className="link-search-hover">
            <div>
              {/*  eslint-disable-next-line react/prop-types */}
              <Link to={`/loadings/${row.original.linkId}`}>{toUpper(value)}</Link>
            </div>
            <div className="btn-search-hover">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                className="btn btn-xs btn-pill btn-icon btn-primary ml-2"
                href="#"
                onClick={(e) => handleSearchInvoice(e, row)}
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
            <span>Customer</span>
            <br />
            <span className="text-muted">Customer Reference</span>
          </span>
        ),
        accessor: 'customer.name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row }) => (
          <span>
            {value}
            <br />
            {/*  eslint-disable-next-line react/prop-types */}
            <span className="text-muted">{row.original.customerRef}</span>
          </span>
        ),
      },
      {
        Header: (
          <span>
            <span>Consignor</span>
            <br />
            <span className="text-muted">Consignee</span>
          </span>
        ),
        accessor: 'consignor.name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row }) => (
          <span>
            {value}
            <br />
            <span className="text-muted">
              {/*  eslint-disable-next-line react/prop-types */}
              {row.original.consignee && row.original.consignee.name}
            </span>
          </span>
        ),
      },
      {
        Header: (
          <span>
            <span>Loading Date</span>
            <br />
            <span className="text-muted">Unloading Date</span>
          </span>
        ),
        accessor: 'loadDate',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row }) => (
          <span>
            {value ? moment(value).format('YYYY-MM-DD') : ''}
            <br />
            <span className="text-muted">
              {/*  eslint-disable-next-line react/prop-types */}
              {row.original.unloadDate ? moment(row.original.unloadDate).format('YYYY-MM-DD') : ''}
            </span>
          </span>
        ),
      },
      {
        Header: (
          <span>
            <span>Operation</span>
            <br />
            <span className="text-muted">Total Pack/Gross Weight(kg)</span>
          </span>
        ),
        accessor: 'operation',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row }) => (
          <span>
            {value}
            <br />

            <span className="text-muted">
              {/*  eslint-disable-next-line react/prop-types */}
              {row.original.totalPack ? row.original.brutWg : ''}
              {/*  eslint-disable-next-line react/prop-types */}
              {row.original.brutWg ? '/' + row.original.brutWg : ''}
            </span>
          </span>
        ),
      },
      {
        Header: (
          <span>
            <span>Collection Place</span>
            <br />
            <span className="text-muted">Load Customs</span>
          </span>
        ),
        accessor: 'loadCountry',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row }) => (
          <span>
            {/* eslint-disable-next-line react/prop-types */}
            {value} - {row.original.loadZipCode}
            <br />
            <span className="text-muted">
              {/*  eslint-disable-next-line react/prop-types */}
              {row.original.loadCustom ? row.original.loadCustom.address : ''}
            </span>
          </span>
        ),
      },
      {
        Header: (
          <span>
            <span>Delivery Placee</span>
            <br />
            <span className="text-muted">Unload Customs</span>
          </span>
        ),
        accessor: 'unloadCountry',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row }) => (
          <span>
            {/* eslint-disable-next-line react/prop-types */}
            {value} - {row.original.unLoadZipCode}
            <br />
            <span className="text-muted">
              {/*  eslint-disable-next-line react/prop-types */}
              {row.original.unloadCustom ? row.original.unloadCustom.address : ''}
            </span>
          </span>
        ),
      },
      {
        Header: (
          <span>
            <span>Full/Groupage</span>
            <br />
            <span className="text-muted">Commodity</span>
          </span>
        ),
        accessor: 'fullGroupage',
      },
      {
        Header: (
          <span>
            <span>M3</span>
            <br />
            <span className="text-muted">LDM</span>
          </span>
        ),
        accessor: 'm3',
      },
      {
        Header: (
          <span>
            <span>Navlun</span>
            <br />
            <span className="text-muted">Volumetric Weight</span>
          </span>
        ),
        accessor: 'navlun',
      },
      {
        Header: (
          <span>
            <span>Status</span>
            <br />
            <span className="text-muted">Tracking Status</span>
          </span>
        ),
        accessor: 'status',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row }) => (
          <span>
            {/* eslint-disable-next-line react/prop-types */}
            {value === 1 ? <span className="label label-inline label-pending">Planning</span> : ''}
            <br />
            <span className="text-muted">
              {/*  eslint-disable-next-line react/prop-types */}
              {row.original.unloadCustom ? row.original.unloadCustom.address : ''}
            </span>
          </span>
        ),
      },
      {
        Header: (
          <span>
            <span>Debit Invoice No.</span>
            <br />
            <span className="text-muted">Credit Invoice No.</span>
          </span>
        ),
        accessor: 'debitInvoice',
      },
      {
        Header: (
          <span>
            <span>Notes</span>
            <br />
            <span className="text-muted">Who will Bring the Booking?</span>
          </span>
        ),
        accessor: 'notes',
      },
    ],
    [handleModalPrint, handleEditbkPanel, toLink, handleRemoveInvoice, handleSearchInvoice],
  )

  const data = useMemo(() => (bookings && bookings.length > 0 ? bookings : []), [bookings])
  const fetchBookingData = useCallback(() => dispatch(fetchBookings()), [dispatch])

  useEffect(() => {
    document.title = 'Bookings'
    fetchBookingData()
  }, [fetchBookingData])

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
                      <h3 className="cstCardbodyHeaderTitle">Bookings</h3>
                    </div>
                  </div>
                </div>
                <div className="customHeaderToolbar">
                  <CButtonGroup>
                    <CButton color="primary" active onClick={(e) => handleCreateBooking(e)}>
                      <i className="fa fa-plus mr-2" /> Create Booking
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
          <CModalTitle>Print</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-2 bg-white">
          <CCard className="cardCustom gutter-b" style={{ boxShadow: 'none' }}>
            <div className="card-header cstHeaderTabs-line">
              <div className="cstHeaderNav">
                <CNav variant="tabs" className="nav-tabs-line nav-bold nav-tabs-line-2x">
                  <CNavItem>
                    <CNavLink href="#loading_details" active>
                      <span className="nav-icon">
                        <i className="fa fa-layer-group ico"></i>
                      </span>
                      <span className="nav-text">Default Templates</span>
                      <span className="pl-2" style={{ marginLeft: '.5rem' }}>
                        11
                      </span>
                    </CNavLink>
                  </CNavItem>
                </CNav>
              </div>
            </div>
            <CCardBody className="p-3">
              <div className="tab-content">
                <div className="tab-pane fade show active" role="tabpanel">
                  <div className="tab-content" id="myTabContent">
                    <div
                      className="tab-pane fade show active"
                      id="systemTemplates"
                      role="tabpanel"
                      aria-labelledby="systemTemplates"
                    >
                      <CRow>
                        <CCol sm={12} md={12} lg={12} xl={12}>
                          <div id="position_details" className="tab-pane active" role="tabpanel">
                            <div className="table-scrollable">
                              <table className="table table-vertical-center table-bordered">
                                <tbody>
                                  <tr id="template_3659">
                                    <td>
                                      <div id="tempdocs_plus_3659"></div>
                                      <div id="tempdocs_minus_3659" className="hide">
                                        {/* eslint-disable-next-line */}
                                        <a href="#" onClick="return removeTempdocs(3659)">
                                          <i className="fa fa-minus"></i>
                                        </a>
                                      </div>
                                    </td>
                                    <td className="font-weight-bold">
                                      Arrival Notification (Consignee)
                                      <span className="badge badge-info"></span>
                                    </td>
                                    <td className="font-weight-bold">en</td>
                                    <td>
                                      <a
                                        target="_blank"
                                        className="btn btn-sm btn-ghost-primary btn-pill"
                                        href="/transports/872997/preview?template_id=3659"
                                      >
                                        <i className="fa fa-plus mr-2"></i>Create New Document
                                      </a>
                                    </td>
                                  </tr>
                                  <tr id="template_3661">
                                    <td>
                                      <div id="tempdocs_plus_3661"></div>
                                      <div id="tempdocs_minus_3661" className="hide">
                                        {/* eslint-disable-next-line */}
                                        <a href="#" onClick="return removeTempdocs(3661)">
                                          <i className="fa fa-minus"></i>
                                        </a>
                                      </div>
                                    </td>
                                    <td className="font-weight-bold">
                                      Arrival Notification (Customer)
                                      <span className="badge badge-info"></span>
                                    </td>
                                    <td className="font-weight-bold">en</td>
                                    <td>
                                      <a
                                        target="_blank"
                                        className="btn btn-sm btn-ghost-primary btn-pill"
                                        href="/transports/872997/preview?template_id=3661"
                                      >
                                        <i className="fa fa-plus mr-2"></i>Create New Document
                                      </a>
                                    </td>
                                  </tr>
                                  <tr id="template_3660">
                                    <td>
                                      <div id="tempdocs_plus_3660"></div>
                                      <div id="tempdocs_minus_3660" className="hide">
                                        {/* eslint-disable-next-line */}
                                        <a href="#" onClick="return removeTempdocs(3660)">
                                          <i className="fa fa-minus"></i>
                                        </a>
                                      </div>
                                    </td>
                                    <td className="font-weight-bold">
                                      Arrival Notification (Sender)
                                      <span className="badge badge-info"></span>
                                    </td>
                                    <td className="font-weight-bold">en</td>
                                    <td>
                                      <a
                                        target="_blank"
                                        className="btn btn-sm btn-ghost-primary btn-pill"
                                        href="/transports/872997/preview?template_id=3660"
                                      >
                                        <i className="fa fa-plus mr-2"></i>Create New Document
                                      </a>
                                    </td>
                                  </tr>
                                  <tr id="template_4259">
                                    <td>
                                      <div id="tempdocs_plus_4259"></div>
                                      <div id="tempdocs_minus_4259" className="hide">
                                        {/* eslint-disable-next-line */}
                                        <a href="#" onClick="return removeTempdocs(4259)">
                                          <i className="fa fa-minus"></i>
                                        </a>
                                      </div>
                                    </td>
                                    <td className="font-weight-bold">
                                      ATR
                                      <span className="badge badge-info"></span>
                                    </td>
                                    <td className="font-weight-bold">en</td>
                                    <td>
                                      <a
                                        target="_blank"
                                        className="btn btn-sm btn-ghost-primary btn-pill"
                                        href="/transports/872997/preview?template_id=4259"
                                      >
                                        <i className="fa fa-plus mr-2"></i>Create New Document
                                      </a>
                                    </td>
                                  </tr>
                                  <tr id="template_3859">
                                    <td>
                                      <div id="tempdocs_plus_3859"></div>
                                      <div id="tempdocs_minus_3859" className="hide">
                                        {/* eslint-disable-next-line */}
                                        <a href="#" onClick="return removeTempdocs(3859)">
                                          <i className="fa fa-minus"></i>
                                        </a>
                                      </div>
                                    </td>
                                    <td className="font-weight-bold">
                                      Avis (Customs Staff)
                                      <span className="badge badge-info"></span>
                                    </td>
                                    <td className="font-weight-bold">en</td>
                                    <td>
                                      <a
                                        target="_blank"
                                        className="btn btn-sm btn-ghost-primary btn-pill"
                                        href="/transports/872997/preview?template_id=3859"
                                      >
                                        <i className="fa fa-plus mr-2"></i>Create New Document
                                      </a>
                                    </td>
                                  </tr>
                                  <tr id="template_3654">
                                    <td>
                                      <div id="tempdocs_plus_3654"></div>
                                      <div id="tempdocs_minus_3654" className="hide">
                                        {/* eslint-disable-next-line */}
                                        <a href="#" onClick="return removeTempdocs(3654)">
                                          <i className="fa fa-minus"></i>
                                        </a>
                                      </div>
                                    </td>
                                    <td className="font-weight-bold">
                                      Booking Pack List With Customs Offices
                                      <span className="badge badge-info"></span>
                                    </td>
                                    <td className="font-weight-bold">en</td>
                                    <td>
                                      <a
                                        target="_blank"
                                        className="btn btn-sm btn-ghost-primary btn-pill"
                                        href="/transports/872997/preview?template_id=3654"
                                      >
                                        <i className="fa fa-plus mr-2"></i>Create New Document
                                      </a>
                                    </td>
                                  </tr>
                                  <tr id="template_3906">
                                    <td>
                                      <div id="tempdocs_plus_3906"></div>
                                      <div id="tempdocs_minus_3906" className="hide">
                                        {/* eslint-disable-next-line */}
                                        <a href="#" onClick="return removeTempdocs(3906)">
                                          <i className="fa fa-minus"></i>
                                        </a>
                                      </div>
                                    </td>
                                    <td className="font-weight-bold">
                                      CMR
                                      <span className="badge badge-info"></span>
                                    </td>
                                    <td className="font-weight-bold">en</td>
                                    <td>
                                      <a
                                        target="_blank"
                                        className="btn btn-sm btn-ghost-primary btn-pill"
                                        href="/transports/872997/preview?template_id=3906"
                                      >
                                        <i className="fa fa-plus mr-2"></i>Create New Document
                                      </a>
                                    </td>
                                  </tr>
                                  <tr id="template_3624">
                                    <td>
                                      <div id="tempdocs_plus_3624"></div>
                                      <div id="tempdocs_minus_3624" className="hide">
                                        {/* eslint-disable-next-line */}
                                        <a href="#" onClick="return removeTempdocs(3624)">
                                          <i className="fa fa-minus"></i>
                                        </a>
                                      </div>
                                    </td>
                                    <td className="font-weight-bold">
                                      Departure Notification (Consignee)
                                      <span className="badge badge-info"></span>
                                    </td>
                                    <td className="font-weight-bold">en</td>
                                    <td>
                                      <a
                                        target="_blank"
                                        className="btn btn-sm btn-ghost-primary btn-pill"
                                        href="/transports/872997/preview?template_id=3624"
                                      >
                                        <i className="fa fa-plus mr-2"></i>Create New Document
                                      </a>
                                    </td>
                                  </tr>
                                  <tr id="template_3658">
                                    <td>
                                      <div id="tempdocs_plus_3658"></div>
                                      <div id="tempdocs_minus_3658" className="hide">
                                        {/* eslint-disable-next-line */}
                                        <a href="#" onClick="return removeTempdocs(3658)">
                                          <i className="fa fa-minus"></i>
                                        </a>
                                      </div>
                                    </td>
                                    <td className="font-weight-bold">
                                      Departure Notification (Customer)
                                      <span className="badge badge-info"></span>
                                    </td>
                                    <td className="font-weight-bold">en</td>
                                    <td>
                                      <a
                                        target="_blank"
                                        className="btn btn-sm btn-ghost-primary btn-pill"
                                        href="/transports/872997/preview?template_id=3658"
                                      >
                                        <i className="fa fa-plus mr-2"></i>Create New Document
                                      </a>
                                    </td>
                                  </tr>
                                  <tr id="template_3626">
                                    <td>
                                      <div id="tempdocs_plus_3626"></div>
                                      <div id="tempdocs_minus_3626" className="hide">
                                        {/* eslint-disable-next-line */}
                                        <a href="#" onClick="return removeTempdocs(3626)">
                                          <i className="fa fa-minus"></i>
                                        </a>
                                      </div>
                                    </td>
                                    <td className="font-weight-bold">
                                      Order Confirmation
                                      <span className="badge badge-info"></span>
                                    </td>
                                    <td className="font-weight-bold">en</td>
                                    <td>
                                      <a
                                        target="_blank"
                                        className="btn btn-sm btn-ghost-primary btn-pill"
                                        href="/transports/872997/preview?template_id=3626"
                                      >
                                        <i className="fa fa-plus mr-2"></i>Create New Document
                                      </a>
                                    </td>
                                  </tr>
                                  <tr id="template_4277">
                                    <td>
                                      <div id="tempdocs_plus_4277"></div>
                                      <div id="tempdocs_minus_4277" className="hide">
                                        {/* eslint-disable-next-line */}
                                        <a href="#" onClick="return removeTempdocs(4277)">
                                          <i className="fa fa-minus"></i>
                                        </a>
                                      </div>
                                    </td>
                                    <td className="font-weight-bold">
                                      Ordino Masraf Bildirimi
                                      <span className="badge badge-info"></span>
                                    </td>
                                    <td className="font-weight-bold">en</td>
                                    <td>
                                      <a
                                        target="_blank"
                                        className="btn btn-sm btn-ghost-primary btn-pill"
                                        href="/transports/872997/preview?template_id=4277"
                                      >
                                        <i className="fa fa-plus mr-2"></i>Create New Document
                                      </a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </CCol>
                      </CRow>
                    </div>
                  </div>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CModalBody>
      </CModal>

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

      {/* edit booking */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={editbkngPanel}
        title={
          <div className="space">
            <div>
              <span>Edit Bookings</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={() => closeEditbkPanel(false)}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>s</div>
      </SlidingPane>

      {/* stock input */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={stockInptPanel}
        title={
          <div className="space">
            <div>
              <span>Stock Input</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={() => closeEditbkPanel(false)}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>s</div>
      </SlidingPane>

      {/* new  booking */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={newBookingPanel}
        title={
          <div className="space">
            <div>
              <span>Loading</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={() => closeNewBkPanel(false)}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <NewBookingPanel />
      </SlidingPane>

      {/* loading panel */}
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
                onClick={() => closeLoadingPanel(false)}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div></div>
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
  setToggleTransPanel: PropTypes.func,
}

export default Bookings
