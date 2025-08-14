import React, { useState, useMemo, useCallback } from 'react'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CFormInput,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CPagination,
  CPaginationItem,
  CDropdownDivider,
  CCollapse,
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
import { useDispatch, useSelector } from 'react-redux'
import { AppBreadcrumb } from 'src/components'
import { useEffect } from 'react'
import { fetchCompanies } from 'src/redux/slices/companySlice'
import { matchSorter } from 'match-sorter'
import classNames from 'classnames'
import Noty from 'noty'
// import ReactTooltip from 'react-tooltip'
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

const Table = ({ columns, data }) => {
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

  // const handleImport = (e) => {
  //   e.preventDefault()
  //   setToggleTransPanel(true)
  // }

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
            {/* <CDropdown>
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
                {selectedFlatRows.length === 1 ? 'Company' : 'Mappings'} Selected
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
            {fetchingCompanies ? (
              <div className="table-info">
                <span className="mt-5">
                  <img src={loaderLg} alt="" />
                </span>
              </div>
            ) : (
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
            )}

            {/* table info */}
            {!fetchingCompanies && !firstPageRows.length > 0 && (
              <div className="table-info">
                <span>No records found.</span>
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

const Mappings = () => {
  // const history = useHistory()
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
  // const [toggleTransPanel, setToggleTransPanel] = useState(false)
  // const { companies } = useSelector((state) => state.company)
  const [visible, setVisible] = useState(true)

  // const toLink = (e, link) => {
  //   e.preventDefault()
  //   history.push(link)
  // }

  const fetchCompanyData = useCallback(() => dispatch(fetchCompanies()), [dispatch])

  useEffect(() => {
    document.title = 'Mappings'
    //
    fetchCompanyData()
  }, [fetchCompanyData])

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
                    <i className="fa fa-eye" />
                    <span className="text-rl">View</span>
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-edit" />
                    <span className="text-rl">Edit</span>
                  </CDropdownItem>
                  <CDropdownDivider />
                  <CCollapse visible={visible}>
                    <CDropdownItem>
                      <i className="fa fa-trash" />
                      <span className="text-rl">Delete</span>
                    </CDropdownItem>
                  </CCollapse>
                  <CDropdownItem onClick={() => setVisible(!visible)}>Show More</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
          </div>
        ),
      },
      {
        Header: <span>ACCOUNT CODE </span>,
        accessor: 'name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span className="font-weight-bolder">{value}</span>,
      },
      {
        Header: <span>ACCOUNT</span>,
        accessor: 'customerType',
      },
      {
        Header: <span>AMOUNT</span>,
        accessor: 'phone',
      },

      {
        Header: <span>CURRENCY</span>,
        accessor: 'email',
      },
      {
        Header: <span>DOCUMENT NO </span>,
        accessor: 'address',
      },
      {
        Header: <span>DOC. DATE </span>,
        accessor: 'taxNo',
      },
      {
        Header: <span>AMOUNT </span>,
        accessor: 'acRep',
      },
      {
        Header: <span>CURRENCY </span>,
        accessor: 'currs',
      },
      {
        Header: <span>DOCUMENT NO </span>,
        accessor: 'doc',
      },
      {
        Header: <span>DOC. DATE </span>,
        accessor: 'date',
      },
      {
        Header: <span>AMOUNT </span>,
        accessor: 'am',
      },
      {
        Header: <span>CURRENCY </span>,
        accessor: 'currNcy',
      },
    ],
    [visible],
  )

  const data = useMemo(() => [], [])

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
                      <h3 className="cstCardbodyHeaderTitle">Financial Payment Mappings</h3>
                    </div>
                  </div>
                </div>
                {/* <div className="customHeaderToolbar">
                  <CButtonGroup>
                    <CButton color="primary" active onClick={(e) => toLink(e, '/companies/new')}>
                      <i className="fa fa-plus mr-2" /> Create Financial Payment Mapping
                    </CButton>
                  </CButtonGroup>
                </div> */}
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
    </div>
  )
}

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
}

export default Mappings
