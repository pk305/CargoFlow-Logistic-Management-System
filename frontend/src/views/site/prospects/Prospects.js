import React, { useState, useMemo } from 'react'
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
import CIcon from '@coreui/icons-react'
import { cilFilter } from '@coreui/icons'
import { useSelector } from 'react-redux'
import { AppBreadcrumb } from 'src/components'
import { useEffect } from 'react'
import SlidingPane from 'react-sliding-pane'
import CreateProspect from './CreateProspect'

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

const Prospects = () => {
  //   const history = useHistory()
  //   const dispatch = useDispatch()
  const [breadcrumbList] = useState([
    { name: 'Companies', pathname: '/companies' },
    { name: 'Contacts', pathname: '/contacts' },
    { name: 'Quotations', pathname: '/leads' },
    { name: 'Prospects', pathname: '/notices' },
    { name: 'Prospects', pathname: '/opportunities', active: true },
    { name: 'Contracts', pathname: '/contracts' },
    { name: 'Tenders', pathname: '/tenders' },
  ])
  const { companies } = useSelector((state) => state.company)
  const [toggleTransPanel, setToggleTransPanel] = useState(false)

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
        Header: <span>Company Name</span>,
        accessor: 'name',
        // Cell: (props) => <span>dd</span>,
      },
      {
        Header: <span>Country</span>,
        accessor: 'customer',
      },
      {
        Header: <span>Export Countries</span>,
        accessor: 'consignor',
      },

      {
        Header: <span>Import Countries</span>,
        accessor: 'loadingDate',
      },
      {
        Header: <span>City</span>,
        accessor: 'address',
      },

      {
        Header: <span>Details</span>,
        accessor: 'deliveryPlace',
      },
      {
        Header: <span>Operation Rep.</span>,
        accessor: 'collectionPlace',
      },

      {
        Header: <span>Address</span>,
        accessor: 'm3',
      },
    ],
    [],
  )

  const data = useMemo(() => (companies && companies.length > 0 ? companies : []), [companies])

  const handleCreate = (e) => {
    e.preventDefault()
    setToggleTransPanel(!toggleTransPanel)
  }

  useEffect(() => {
    document.title = 'Prospects'
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
                      <h3 className="cstCardbodyHeaderTitle">Prospects</h3>
                    </div>
                  </div>
                </div>
                <div className="customHeaderToolbar">
                  <CButtonGroup>
                    <CButton color="primary" active onClick={(e) => handleCreate(e)}>
                      <i className="fa fa-plus mr-2" /> Create Prospect
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
                          // onChange={(e) => handleSearchText(e)}
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

      {/* sliding pane */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={toggleTransPanel}
        title={
          <div className="space">
            <div>
              <span>New Prospect</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={(e) => setToggleTransPanel(false)}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>
          <CreateProspect />
        </div>
      </SlidingPane>
    </div>
  )
}

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
}

export default Prospects
