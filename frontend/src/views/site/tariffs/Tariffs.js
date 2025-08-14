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
} from '@coreui/react'
import { useTable, usePagination } from 'react-table'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilFilter } from '@coreui/icons'
import { useDispatch } from 'react-redux'
import { fetchBookings } from 'src/redux/slices/bookingSlice'
import { AppBreadcrumb } from 'src/components'

const Table = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } = useTable(
    {
      columns,
      data,
    },
    usePagination,
  )

  return (
    <div className="table-responsive table-truncate pageTableWrapper">
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
          {page.map((row) => {
            prepareRow(row)
            const { key, ...restRowProps } = row.getRowProps()
            return (
              <tr key={key} {...restRowProps}>
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
      {/* <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div> */}
    </div>
  )
}

const Tariffs = () => {
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
        Header: (
          <span>
            <span>Tarrif</span>
          </span>
        ),
        accessor: 'reference',
        // Cell: (props) => <span>dd</span>,
      },
      {
        Header: (
          <span>
            <span>Company (Supplier/Customer)</span>
          </span>
        ),
        accessor: 'customer',
      },
      {
        Header: (
          <span>
            <span>Agent</span>
          </span>
        ),
        accessor: 'consignor',
      },
      {
        Header: (
          <span>
            <span>Due Date</span>
          </span>
        ),
        accessor: 'loadingDate',
      },
      {
        Header: (
          <span>
            <span>Cuurency</span>
          </span>
        ),
        accessor: 'operation',
      },
      {
        Header: (
          <span>
            <span>Sales / Purchase</span>
          </span>
        ),
        accessor: 'collectionPlace',
      },
      {
        Header: (
          <span>
            <span>Tarrif Type</span>
          </span>
        ),
        accessor: 'deliveryPlace',
      },
      {
        Header: (
          <span>
            <span>Trans Method</span>
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
    [],
  )
  const [data] = useState([
    // {
    //   index: 1,
    //   customer: 'NUE220000002',
    //   consignor: '',
    //   loadingDate: '27/01/2022',
    //   operation: 'Road T',
    //   collectionPlace: 'KE',
    //   deliveryPlace: 'DJ',
    //   fullGroupage: 'Full Cargo',
    //   m3: '',
    //   navlun: '',
    //   status: 'Planning',
    //   debitInvoice: '',
    //   notes: '',
    // },
    // {
    //   index: 1,
    //   customer: 'NUE232000002',
    //   consignor: '',
    //   loadingDate: '26/01/2022',
    //   operation: 'Road T',
    //   collectionPlace: 'KE',
    //   deliveryPlace: 'DJ',
    //   fullGroupage: 'Full Cargo',
    //   m3: '',
    //   navlun: '',
    //   status: 'Planning',
    //   debitInvoice: '',
    //   notes: '',
    // },
  ])

  // const handleCreateBooking = (e) => {
  //   e.preventDefault()
  //   history.push('/positions/new?trans_method=road')
  // }

  const toLink = (e, f) => {
    e.preventDefault()
    history.push(f)
  }

  const fetchBooking = useCallback(() => dispatch(fetchBookings()), [dispatch])

  useEffect(() => {
    fetchBooking()
  }, [fetchBooking])

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
                      <h3 className="cstCardbodyHeaderTitle">Tariffs</h3>
                    </div>
                  </div>
                </div>
                <div className="customHeaderToolbar">
                  <CButtonGroup>
                    <CDropdown>
                      <CDropdownToggle color="primary" className="drop">
                        New Tarrif
                      </CDropdownToggle>
                      <CDropdownMenu className="animate__animated animate__slideIn">
                        <CDropdownItem
                          href="tariffs/new?trans_method=road"
                          // onClick={(e) => toLink(e, 'tariffs/new?trans_method=road')}
                        >
                          Road Tariff
                        </CDropdownItem>
                        <CDropdownItem onClick={(e) => toLink(e, 'tariffs/new?trans_method=sea')}>
                          Sea Tariff
                        </CDropdownItem>
                        <CDropdownItem onClick={(e) => toLink(e, 'tariffs/new?trans_method=rail')}>
                          Rail Tariff
                        </CDropdownItem>
                        <CDropdownItem onClick={(e) => toLink(e, 'tariffs/new?trans_method=air')}>
                          Air Tariff
                        </CDropdownItem>
                        <CDropdownItem onClick={(e) => toLink(e, 'tariffs/new?trans_method=depot')}>
                          Depot Tariff
                        </CDropdownItem>
                        <CDropdownItem
                          onClick={(e) => toLink(e, 'tariffs/new?trans_method=customs')}
                        >
                          Customs Tariff
                        </CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </CButtonGroup>
                </div>
              </div>
            </div>
            <CCardBody className="p-0">
              <div className="pageContainer-wrapper isTable">
                <CRow className="pageBoxSizing-filter clearfix">
                  <CCol sm={12} md={6} lg={6} xl={6}>
                    <div className="pageSearchContainer">
                      <div className="cst-search-box">
                        <CFormInput
                          type="text"
                          id="searchComp--users-search"
                          name="users-search"
                          placeholder="Search"
                          className="cst-search-input"
                          tabIndex="1"
                        />
                      </div>
                    </div>
                  </CCol>
                  <CCol sm={12} md={6} lg={6} xl={6}>
                    <div className="cstSearchActions">
                      <CButton color="secondary" variant="outline">
                        <CIcon icon={cilFilter} /> Filter
                      </CButton>
                      <CButton color="secondary" variant="outline">
                        <i className="fa fa-list-ol" />
                        <i className="fa fa-angle-down" style={{ marginLeft: '3px' }} />
                      </CButton>
                    </div>
                  </CCol>
                </CRow>
                <div className="pageBoxSizing-container">
                  <div>
                    <Table columns={columns} data={data} />
                  </div>
                </div>
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

export default Tariffs
