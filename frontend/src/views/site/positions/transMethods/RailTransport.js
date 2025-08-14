import React, { useState, useMemo, useEffect } from 'react'
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
// import { useDispatch } from 'react-redux'
import { AppBreadcrumb } from 'src/components'

const RailTransport = () => {
  const history = useHistory()
  // const dispatch = useDispatch()

  const [breadcrumbList] = useState([
    { name: 'Bookings', pathname: '/loadings' },
    { name: 'Planning', pathname: '/transports' },
    { name: 'Road Freight', pathname: '/positions?trans_method=road' },
    { name: 'Air Freight', pathname: '/positions?trans_method=air' },
    { name: 'Sea Freight', pathname: '/positions?trans_method=sea' },
    { name: 'Rail Freight', pathname: '/positions?trans_method=rail', active: true },
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
            <span>Reference</span>
            <br />
            <span className="text-muted">Reference</span>
          </span>
        ),
        accessor: 'reference',
        // Cell: (props) => <span>dd</span>,
      },
      {
        Header: (
          <span>
            <span>Train</span>
            <br />
            <span className="text-muted">Wagon/Container</span>
          </span>
        ),
        accessor: 'customer',
      },
      {
        Header: (
          <span>
            <span>Train Company (Voyage No)</span>
            <br />
            <span className="text-muted">Customer</span>
          </span>
        ),
        accessor: 'consignor',
      },

      {
        Header: (
          <span>
            <span>Supplier Company</span>
            <br />
            <span className="text-muted">Consignor</span>
          </span>
        ),
        accessor: 'loadingDate',
      },
      {
        Header: (
          <span>
            <span>Agent</span>
            <br />
            <span className="text-muted">Consignee</span>
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
            <span>Status</span>
            <br />
            <span className="text-muted">Status</span>
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
  const [data] = useState([])

  const toLink = (e, link) => {
    e.preventDefault()
    history.push(link)
  }

  // const fetchBooking = useCallback(() => dispatch(fetchBookings()), [dispatch])

  useEffect(() => {
    // fetchBooking()
  }, [])

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
                      <h3 className="cstCardbodyHeaderTitle">Rail Freight</h3>
                    </div>
                  </div>
                </div>
                <div className="customHeaderToolbar">
                  <CButtonGroup>
                    <CButton
                      color="primary"
                      active
                      onClick={(e) => toLink(e, 'positions/new?trans_method=rail')}
                    >
                      Create Rail Transport
                    </CButton>
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
                    <div>
                      <Table columns={columns} data={data} />
                    </div>
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

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
}

export default RailTransport
