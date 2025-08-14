import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CButton,
  CCard,
  CRow,
  CCol,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useTable, useSortBy } from 'react-table'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import SlidingPane from 'react-sliding-pane'
import NewBranch from './NewBranch'
import { fetchBranches } from 'src/redux/slices/branchSlice'
import PropTypes from 'prop-types'

const Table = ({ columns, data }) => {
  const { fetchingBranches } = useSelector((state) => state.branch)

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 20 },
    },
    useSortBy,
  )

  const firstPageRows = rows.slice(0, 20)

  return (
    <>
      <div className="table-responsive table-truncate pageTableWrapper">
        <div>
          {fetchingBranches ? (
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
    </>
  )
}

const BranchInformation = () => {
  const dispatch = useDispatch()
  const { branches } = useSelector((state) => state.branch)
  const [branchPanel, setBranchPanel] = useState(false)

  const handleBranchPanel = (e) => {
    e.preventDefault()
    setBranchPanel(true)
  }

  const closeBranchPanel = () => {
    setBranchPanel(false)
  }

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
                    <i className="fa fa-trash" style={{ marginRight: '.75rem' }} /> Delete
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
          </div>
        ),
      },
      {
        Header: <span>Branch Name</span>,
        accessor: 'name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span className="font-weight-bold">{value}</span>,
      },
      {
        Header: <span>Manager</span>,
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
        Header: <span>Phone</span>,
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
        Header: <span>Fax</span>,
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
        Header: <span>Email</span>,
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
        Header: <span>Address</span>,
        accessor: 'address',
      },
    ],
    [],
  )

  const data = useMemo(() => (branches && branches.length > 0 ? branches : []), [branches])
  const fetchBranchData = useCallback(() => dispatch(fetchBranches()), [dispatch])

  useEffect(() => {
    fetchBranchData()
  }, [fetchBranchData])

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
                <div className="setupProccess-step" data-stepstate="pending">
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
        <div className="setupProccessForm" id="new_setup">
          <CRow>
            <CCol sm={12} md={12} lg={12} xl={12}>
              <h4 className="titleHeading">Branch Information</h4>
            </CCol>
          </CRow>
          <CRow>
            <CCol sm={12} md={12} lg={12} xl={12}>
              <div className="d-flex justify-content-between py-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="card-title">
                    <h6 className="subTitleHeading">Step: 4/6</h6>
                  </div>
                </div>
                <div className="">
                  <div className="btn-group">
                    <CButton color="primary" onClick={(e) => handleBranchPanel(e)}>
                      Add New Branch
                    </CButton>
                  </div>
                </div>
              </div>
              <CCard className="cardCustom">
                <div
                  className="pageContainer-wrapper"
                  // style={{
                  //   minHeight: '200px',
                  //   maxHeight: 'calc(100vh - 17.5rem)',
                  //   overflow: 'hidden',
                  // }}
                >
                  <div className="pageBoxSizing-container ">
                    <Table columns={columns} data={data} />
                  </div>
                </div>
              </CCard>
            </CCol>
          </CRow>
          <div className="separator"></div>
          <CRow>
            <CCol sm={12} md={12} lg={12} xl={12}>
              <a className="btn btn-info mr-2" href="/setups/new?step=3">
                Previous
              </a>
              <a className="btn btn-primary" href="/setups/new?step=5">
                Next
              </a>
            </CCol>
          </CRow>
        </div>
      </div>

      {/* branch information */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={branchPanel}
        title={
          <div className="space">
            <div>
              <span>New Branch</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={() => closeBranchPanel(false)}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>
          <NewBranch />
        </div>
      </SlidingPane>
    </div>
  )
}

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
}

export default BranchInformation
