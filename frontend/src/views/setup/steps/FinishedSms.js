import React, { useState, useMemo } from 'react'
import {
  CForm,
  CButton,
  CRow,
  CCol,
  CCard,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTable, useSortBy } from 'react-table'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import { updateSetup } from 'src/redux/slices/setupSlice'

const Operations = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const { updatingSetup } = useSelector((state) => state.setup)
  const { company } = useSelector((state) => state.system)
  const { fetchingBranches } = useSelector((state) => state.branch)

  const [setupData] = useState({
    setupData: '',
    steps: '6',
  })

  // const handleChangeForm = (e) => {
  //   const { name, value } = e.target

  //   setSetupPersona({
  //     ...setupData,
  //     [name]: value,
  //   })
  // }

  const handleSubmitSetup = async (e) => {
    e.preventDefault()
    if (company) {
      const resData = await dispatch(
        updateSetup({ companyId: company.id, operationInfo: setupData }),
      ).unwrap()
      if (resData) {
        history.push('/')

        // history.push(`/setups/new?step=${resData.steps}`)
      }
    }
  }
  const data = useMemo(() => [], [])

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
                    <i className="fa fa-edit" style={{ marginRight: '.75rem' }} /> Edit
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-copy" style={{ marginRight: '.75rem' }} /> Copy
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-print" style={{ marginRight: '.75rem' }} /> Print
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-pen" style={{ marginRight: '.75rem' }} /> Change Booking
                    Status
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-truck" style={{ marginRight: '.75rem' }} /> Pickup/Last Mile
                    Transport Request
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-plus" style={{ marginRight: '.75rem' }} /> Create Warehouse
                    Input
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-plus" style={{ marginRight: '.75rem' }} /> Create Export
                    Deport Input
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-clipboard" style={{ marginRight: '.75rem' }} /> Recording
                    History
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-times" style={{ marginRight: '.75rem' }} /> Cancelled
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-trash" style={{ marginRight: '.75rem' }} /> Delete
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
          </div>
        ),
      },
      {
        Header: 'Operation Name',
        accessor: 'branchName',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row }) => (
          <>
            {/*  eslint-disable-next-line react/prop-types */}
            <Link to={`/loadings/${row.original.bkCreatedBy}`}>{value}</Link>
          </>
        ),
      },
      {
        Header: 'Department',
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
        Header: 'Trans Method',
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
        Header: 'Operation Type',
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
        Header: 'Map İntergration',
        accessor: 'loadCountry',
      },
      {
        Header: 'Position Loading Confirm',
        accessor: 'address',
      },
    ],
    [],
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
  )

  const firstPageRows = rows.slice(0, 20)

  return (
    <div>
      <div className="pageContainer-wrapper">
        <div className="pageBoxSizing-container">
          <div
            className="setupProccessWrapper spw-1"
            id="cstProcessWiz"
            data-stepstate="first"
            data-stepclickable="false"
          >
            <div className="setupProccess-nav">
              <div className="setupProccess-steps">
                <div className="setupProccess-step" data-stepstate="current">
                  <div className="setupProccess-label">
                    <i className="fa fa-building icon-xl setupProccess-icon"></i>
                    <h3 className="setupProccess-title">Company Information</h3>
                  </div>
                  <span className="setupProccess-arrow">
                    <i className="fa fa-arrow-right"></i>
                  </span>
                </div>
                <div className="setupProccess-step" data-stepstate="current">
                  <div className="setupProccess-label">
                    <i className="fa fa-users icon-xl setupProccess-icon"></i>
                    <h3 className="setupProccess-title">Company Personnel</h3>
                  </div>
                  <span className="setupProccess-arrow">
                    <i className="fa fa-arrow-right"></i>
                  </span>
                </div>
                <div className="setupProccess-step" data-stepstate="current">
                  <div className="setupProccess-label">
                    <i className="fa fa-eye icon-xl setupProccess-icon"></i>
                    <h3 className="setupProccess-title">Company Logo</h3>
                  </div>
                  <span className="setupProccess-arrow">
                    <i className="fa fa-arrow-right"></i>
                  </span>
                </div>
                <div className="setupProccess-step" data-stepstate="current">
                  <div className="setupProccess-label">
                    <i className="fa fa-sitemap icon-xl setupProccess-icon"></i>
                    <h3 className="setupProccess-title">Branch Information</h3>
                  </div>
                  <span className="setupProccess-arrow">
                    <i className="fa fa-arrow-right"></i>
                  </span>
                </div>
                <div className="setupProccess-step" data-stepstate="current">
                  <div className="setupProccess-label">
                    <i className="fa fa-users icon-xl setupProccess-icon"></i>
                    <h3 className="setupProccess-title">Operations</h3>
                  </div>
                  <span className="setupProccess-arrow last">
                    <i className="fa fa-arrow-right"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pageContainer-body">
        <CForm
          className="setupProccessForm"
          id="newSetup"
          noValidate="novalidate"
          action="/setups"
          acceptCharset="UTF-8"
          method="post"
          onSubmit={(e) => handleSubmitSetup(e)}
        >
          <CRow>
            <CCol sm={12} md={12} lg={12} xl={12}>
              <h4 className="titleHeading">Operations</h4>
            </CCol>
          </CRow>
          <CRow>
            <CCol sm={12} md={12} lg={12} xl={12}>
              <div className="d-flex justify-content-between py-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="card-title">
                    <h6 className="subTitleHeading">Step: 5/6</h6>
                  </div>
                </div>
                <div className="">
                  <div className="btn-group">
                    <Link className="btn btn-sm btn-dark disabled" to="/branches/new">
                      Add New Operation
                    </Link>
                  </div>
                </div>
              </div>

              <CCard className="cardCustom">
                <div
                  className="pageContainer-wrapper"
                  style={{
                    minHeight: '200px',
                    maxHeight: 'calc(100vh - 17.5rem)',
                    overflow: 'hidden',
                  }}
                >
                  <div className="pageBoxSizing-container is-overflow">
                    <div className="table-responsive table-truncate pageTableWrapper">
                      <div>
                        {fetchingBranches ? (
                          <div className="table-info">
                            <span className="mt-5">
                              <img src={loaderLg} alt="" />
                            </span>
                          </div>
                        ) : (
                          <table className="table pageTable" {...getTableProps()}>
                            <thead>
                              {headerGroups.map((headerGroup) => {
                                const { key, ...restHeaderGroupProps } =
                                  headerGroup.getHeaderGroupProps()
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
                              {firstPageRows.map((row) => {
                                prepareRow(row)
                                const { key, ...restRowProps } = row.getRowProps()
                                return (
                                  <tr
                                    key={key}
                                    {...restRowProps}
                                    className="bg-hover-light-primary"
                                  >
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
                        {!fetchingBranches && !firstPageRows.length > 0 && (
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
                                  Showing page {pageIndex + 1} of {pageOptions.length} -{' '}
                                  {data.length} entries
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
                </div>
              </CCard>
            </CCol>
          </CRow>
          <div className="separator"></div>
          <CRow>
            <CCol sm={12} md={12} lg={12} xl={12}>
              <a className="btn btn-primary disabled mr-2" href="/setups/new?step=5">
                Previous
              </a>
              <CButton type="submit" color="primary" disabled={updatingSetup ? true : false}>
                {updatingSetup ? 'Processing...' : 'Next'}
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </div>
    </div>
  )
}

export default Operations
