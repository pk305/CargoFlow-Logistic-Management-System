import React, { useState, useMemo, useCallback, useEffect, useRef, forwardRef } from 'react'
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
  CDropdownMenu,
} from '@coreui/react'
import { Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilFilter, cilZoom } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { AppBreadcrumb } from 'src/components'
import {
  useTable,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useAsyncDebounce,
} from 'react-table'
import PropTypes from 'prop-types'
import { matchSorter } from 'match-sorter'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import TransportTable from './TransportTable'
import { fetchPlannedLoadings } from 'src/redux/slices/planningSlice'
import SlidingPane from 'react-sliding-pane'
import TransportPanel from './panel/TransportPanel'
import $ from 'jquery'

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

// eslint-disable-next-line react/display-name
const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef()
  const resolvedRef = ref || defaultRef

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate
  }, [resolvedRef, indeterminate])

  return (
    <>
      <input
        type="checkbox"
        ref={resolvedRef}
        {...rest}
        style={{ verticalAlign: 'bottom', width: '16px', height: '22px' }}
      />
    </>
  )
})

const fuzzyTextFilterFn = (page, id, filterValue) => {
  return matchSorter(page, filterValue, { keys: [(row) => row.values[id]] })
}

fuzzyTextFilterFn.autoRemove = (val) => !val

const Table = ({ columns, data, handleBookPanel }) => {
  // const history = useHistory()
  const [visibleFilter, setVisibleFilter] = useState(false)
  const { fetchingPlannedLoadings } = useSelector((state) => state.planning)

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

  const handleHideFilter = (e) => {
    if (visibleFilter) {
      $('.dropdown-menu.filterMenu').addClass('show')
    }
  }

  const searchFilter = async (e) => {
    e.preventDefault()
    setVisibleFilter(false)
    $('.dropdown-menu.filterMenu').removeClass('show')
    // const query = qs.parse(search)
    // const data = {
    //   ...query,
    //   ...searchData,
    // }
    // const resData = await dispatch(findSearchReport(data)).unwrap()
    // if (resData) {
    //   clearSearchData()
    // }
  }

  // const clearSearchData = () => {
  //   setSearchData({
  //     ...searchData,
  //     companyId: '',
  //     debitCredit: '',
  //     status: '',
  //     searchQuery: '',
  //     invoiceDateSelect: '',
  //     dueDateSelect: '',
  //     currId: '',
  //     userId: '',
  //   })
  // }

  const handleCloseFilter = (e) => {
    e.preventDefault()
    setVisibleFilter(false)
    $('.dropdown-menu.filterMenu').removeClass('show')
  }

  const handleCreateBooking = (e) => {
    e.preventDefault()
    handleBookPanel()
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    // selectedFlatRows,
    state: { globalFilter },
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

  const firstPageRows = page.slice(0, 10)

  return (
    <>
      <CRow className="pageBoxSizing-filter">
        <CCol sm={6} md={6} lg={6} xl={8}>
          <div className="d-flex">
            <div className="mr-3">
              <CDropdown
                visible={visibleFilter}
                onHide={handleHideFilter}
                placement="left"
                style={{ marginBottom: '-23px' }}
              >
                <CDropdownToggle
                  color="secondary"
                  variant="outline"
                  caret={false}
                  trigger="click"
                  // disabled={findingSearchReport ? true : false}
                  className="drop  btn-400"
                >
                  Add Filter <CIcon icon={cilFilter} />
                </CDropdownToggle>
                <CDropdownMenu
                  style={{
                    width: '597px',
                    position: 'absolute',
                    left: '0px',
                    zIndex: '2',
                  }}
                  className="filterMenu"
                >
                  <div id="simple_search_fields">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        <div className="form-group select required search_filter_operation_id">
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control select required"
                                name="search[filter][operation_id]"
                                id="search_filter_operation_id"
                              >
                                <option value="">Operation</option>
                                <option value="7626">A</option>
                                <option value="7257">Air Transports Team</option>
                                <option value="7258">Ocean Transports Team</option>
                                <option value="7660">Rail Transport Team</option>
                                <option value="7254">Road Transports Team</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        <div className="form-group select required search_filter_export_import">
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control select required"
                                name="search[filter][export_import]"
                                id="search_filter_export_import"
                              >
                                <option value="">Export/Import</option>
                                <option value="export">Export</option>
                                <option value="import">Import</option>
                                <option value="domestic">Domestic</option>
                                <option value="transit">Transit</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        <div className="form-group select required search_filter_load_type">
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control select required"
                                name="search[filter][load_type]"
                                id="search_filter_load_type"
                              >
                                <option value="">Full/Groupage</option>
                                <option value="K">FTL/FCL Complete</option>
                                <option value="P">LTL/LCL Partial</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="form-group hidden search_filter_scope">
                          <input
                            className="form-control hidden"
                            value="reservations"
                            type="hidden"
                            name="search[filter][scope]"
                            id="search_filter_scope"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        <div className="form-group select required search_filter_dep_country_id">
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control select required"
                                name="search[filter][dep_country_id]"
                                id="search_filter_dep_country_id"
                              >
                                <option value="">Collection Country</option>
                                <option value="AD">AD-ANDORRA</option>
                                <option value="ZW">ZW-ZIMBABWE</option>
                                <option value="ZZ">ZZ-NAHÇIVAN</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        <div className="form-group select required search_filter_operator_id">
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control select required"
                                name="search[filter][operator_id]"
                                id="search_filter_operator_id"
                              >
                                <option value="">Operator</option>
                                <option value="4121">James</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        <div className="form-group city required search_filter_dep_city_id">
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control chosen_input city-select select2-hidden-accessible"
                                data-url="/roster/autocompletes.json?model=Nimbos::City"
                                data-newurl="/cities/new"
                                data-placeholder="Departure City"
                                data-country_id=""
                                data-address-role=""
                                data-plugin="lookup"
                                name="search[filter][dep_city_id]"
                                id="search_filter_dep_city_id"
                                aria-hidden="true"
                                data-select2-id="search_filter_dep_city_id"
                              >
                                <option value="" data-select2-id="553"></option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        <div className="form-group city required search_filter_arv_city_id">
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control chosen_input city-select select2-hidden-accessible"
                                data-url="/roster/autocompletes.json?model=Nimbos::City"
                                data-newurl="/cities/new"
                                data-placeholder="Arrival City"
                                data-country_id=""
                                data-address-role=""
                                data-plugin="lookup"
                                name="search[filter][arv_city_id]"
                                id="search_filter_arv_city_id"
                                aria-hidden="true"
                                data-select2-id="search_filter_arv_city_id"
                              >
                                <option value="" data-select2-id="555"></option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        <div className="form-group select required search_filter_branch_id">
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control select required"
                                name="search[filter][branch_id]"
                                id="search_filter_branch_id"
                              >
                                <option value="">Branch</option>
                                <option value="1531">Branch B</option>
                                <option value="1528">Head Office</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        <div className="form-group company required search_filter_company_id">
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control company-select select2-hidden-accessible"
                                data-url="/roster/autocompletes.json?model=Network::Company&amp;source_type="
                                data-newurl="/companies/new"
                                data-placeholder="Customer"
                                data-taxno=""
                                data-eori-field=""
                                data-name-field=""
                                data-address-field=""
                                data-city-name-field=""
                                data-country-id-field=""
                                data-postcode-field=""
                                data-taxoffice=""
                                data-country-field=""
                                data-saler-field=""
                                data-branch-field=""
                                data-contact-field=""
                                data-place-field=""
                                data-form-model=""
                                data-financial-detail=""
                                data-plugin="lookup"
                                data-minimuminputlength="0"
                                name="search[filter][company_id]"
                                id="search_filter_company_id"
                                aria-hidden="true"
                                data-select2-id="search_filter_company_id"
                              >
                                <option value="" data-select2-id="557"></option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        <div className="form-group place required search_filter_load_center_id">
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control chosen_input place_select select2-hidden-accessible"
                                data-url="/roster/autocompletes.json?model=Logistics::Place"
                                data-newurl="/places/new"
                                data-place-behaviour=""
                                data-placeholder="Load Center"
                                data-country-field=""
                                data-city-field=""
                                data-postcode-field=""
                                data-address-field=""
                                data-place-type=""
                                data-country-id=""
                                data-latitude-field=""
                                data-longitude-field=""
                                data-plugin="lookup"
                                name="search[filter][load_center_id]"
                                id="search_filter_load_center_id"
                                aria-hidden="true"
                                data-select2-id="search_filter_load_center_id"
                              >
                                <option value="" data-select2-id="559"></option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        <div className="form-group select required search_filter_load_date_select">
                          <select
                            className="form-control select required"
                            name="search[filter][load_date_select]"
                            id="search_filter_load_date_select"
                          >
                            <option value="">Load Date Range</option>
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
                          </select>
                        </div>
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
                      <CButton type="submit" color="primary" onClick={(e) => searchFilter(e)}>
                        Search
                      </CButton>
                    </div>
                  </div>
                </CDropdownMenu>
              </CDropdown>
            </div>
            <div className="pageSearchContainer">
              <div className="cst-search-box">
                <GlobalFilter
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
              </div>
            </div>
          </div>
        </CCol>
        <CCol sm={6} md={6} lg={6} xl={4}>
          <div className="cstSearchActions">
            <CButtonGroup>
              <CButton color="primary" active onClick={(e) => handleCreateBooking(e)}>
                <i className="fa fa-plus mr-2" /> Create Booking
              </CButton>
            </CButtonGroup>
          </div>
        </CCol>
      </CRow>
      <div
        className="pageBoxSizing-container cst-tableResponsive"
        style={{
          zoom: '0.8',
          height: '33vh',
          transition: 'all 0.1s',
          overflowX: 'hidden',
          overflowY: 'auto',
        }}
      >
        <div
          className="table-responsive table-truncate pageTableWrapper"
          style={{
            minHeight: '300px!important',
          }}
        >
          <div>
            {fetchingPlannedLoadings ? (
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
      </div>
    </>
  )
}

const Transports = () => {
  const dispatch = useDispatch()
  const [transPanel, setTransPanel] = useState(false)
  const [bookingPanel, setBookingPanel] = useState(false)
  const { authUser } = useSelector((state) => state.auth)
  const [breadcrumbList] = useState([
    { name: 'Bookings', pathname: '/loadings' },
    { name: 'Planning', pathname: '/transports', active: true },
    { name: 'Road Freight', pathname: '/positions?trans_method=road' },
    { name: 'Air Freight', pathname: '/positions?trans_method=air' },
    { name: 'Sea Freight', pathname: '/positions?trans_method=sea' },
    { name: 'Rail Freight', pathname: '/positions?trans_method=rail' },
    { name: 'Courier Freight', pathname: '/positions?trans_method=courier' },
    { name: 'Tarifs', pathname: '/tariffs' },
  ])
  const { plannedLoadings } = useSelector((state) => state.planning)
  const [selectedLoadings] = useState([{ id: 1 }])

  const columns = useMemo(
    () => [
      {
        Header: (
          <span>
            <span>Reference</span>
          </span>
        ),
        accessor: 'receiptNo',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row }) => (
          <div className="link-search-hover">
            <div>
              {/*  eslint-disable-next-line react/prop-types */}
              <Link to={`/loadings/${row.original.linkId}`}>{value}</Link>
            </div>
            <div className="btn-search-hover">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                className="btn btn-xs btn-pill btn-icon btn-primary ml-2"
                href="#"
                // onClick={(e) => handleSearchInvoice(e, row)}
              >
                <i className="fa fa-edit"></i>
              </a>
            </div>
          </div>
        ),
      },

      {
        Header: (
          <span>
            <span>Customer</span>
          </span>
        ),
        accessor: 'customer.name',
      },

      {
        Header: (
          <span>
            <span>Consignor</span>
          </span>
        ),
        accessor: 'loadingDate',
      },
      {
        Header: (
          <span>
            <span>Consigee</span>
          </span>
        ),
        accessor: 'operation',
      },
      {
        Header: (
          <span>
            <span>Delivery Post Code</span>
          </span>
        ),
        accessor: 'collectionPlace',
      },
      {
        Header: (
          <span>
            <span>Total Pack</span>
          </span>
        ),
        accessor: 'deliveryPlace',
      },
      {
        Header: (
          <span>
            <span>Gross Weight (Kg)</span>
          </span>
        ),
        accessor: 'fullGroupage',
      },
      {
        Header: (
          <span>
            <span>Client Freight Price</span>
          </span>
        ),
        accessor: 'm3',
      },
      {
        Header: (
          <span>
            <span>M3</span>
          </span>
        ),
        accessor: 'q1',
      },
      {
        Header: (
          <span>
            <span>LDM</span>
          </span>
        ),
        accessor: 'mdd3',
      },
      {
        Header: (
          <span>
            <span>Collection Place</span>
          </span>
        ),
        accessor: 'colPl',
      },
      {
        Header: (
          <span>
            <span>Delivery Place</span>
          </span>
        ),
        accessor: 'deliPla',
      },
      {
        Header: (
          <span>
            <span>LDM</span>
          </span>
        ),
        accessor: 'dd',
      },
    ],
    [],
  )

  const data = useMemo(
    () => (plannedLoadings && plannedLoadings.length > 0 ? plannedLoadings : []),
    [plannedLoadings],
  )

  const closeTransPanel = () => {
    setTransPanel(false)
  }

  const handleBookPanel = () => {
    setBookingPanel(!bookingPanel)
  }

  const closeBookPanel = () => {
    setBookingPanel(false)
  }

  const handleTransPanel = () => {
    setTransPanel(true)
  }

  const fetchPlannedLoadingData = useCallback(() => {
    if (authUser) {
      dispatch(fetchPlannedLoadings({ branchId: authUser.branch.id }))
    }
  }, [dispatch, authUser])

  useEffect(() => {
    fetchPlannedLoadingData()
  }, [fetchPlannedLoadingData])

  return (
    <div>
      <div className="cstContainerDef">
        <AppBreadcrumb items={breadcrumbList} />
      </div>
      <div className="pageContainer">
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <CCard className="cardCustom cardStretch" style={{ height: '100%' }}>
                <CCardBody className="p-0">
                  <div className="pageContainer-wrapper">
                    <Table columns={columns} data={data} handleBookPanel={handleBookPanel} />
                  </div>
                </CCardBody>
              </CCard>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <hr style={{ marginBottom: '0.625rem', marginTop: '0.625rem' }} />
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <CCard className="cardCustom cardStretch" style={{ height: '100%' }}>
                <CCardBody className="p-0">
                  <div className="pageContainer-wrapper">
                    <TransportTable
                      handleTransPanel={handleTransPanel}
                      selectedLoadings={selectedLoadings}
                    />
                  </div>
                </CCardBody>
              </CCard>
            </div>
          </div>
        </div>
      </div>

      {/* create booking */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={bookingPanel}
        title={
          <div className="space">
            <div>
              <span>New Booking</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={() => closeBookPanel()}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>Booking</div>
      </SlidingPane>

      {/* create transport */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={transPanel}
        title={
          <div className="space">
            <div>
              <span>Truck Transport</span>
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
          <TransportPanel />
        </div>
      </SlidingPane>
    </div>
  )
}

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  handleBookPanel: PropTypes.func,
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

IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.bool,
}

export default Transports
