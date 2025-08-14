import React, { useMemo } from 'react'
import {
  CButton,
  CRow,
  CCol,
  CCard,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import { useSelector } from 'react-redux'
import { useTable, useSortBy } from 'react-table'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import PropTypes from 'prop-types'
import { capitalize } from 'lodash'

const Table = ({ columns, data }) => {
  const { fetchingOperations } = useSelector((state) => state.operation)

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
          {fetchingOperations ? (
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

const Operations = () => {
  const { operations } = useSelector((state) => state.operation)

  const handleOperationPanel = (e) => {
    e.preventDefault()
    // setBranchPanel(true)
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
                    <i className="fa fa-edit" /> Edit
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-trash" /> Delete
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-lock" /> Set Code
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
          </div>
        ),
      },
      {
        Header: 'Operation Name',
        accessor: 'name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row }) => <>{value}</>,
      },
      {
        Header: 'Department',
        accessor: 'department.name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row }) => <span>{value}</span>,
      },
      {
        Header: 'Trans Method',
        accessor: 'transMethod',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row }) => (
          <span>
            {value === 'road'
              ? 'Road Transport'
              : value === 'rail'
              ? 'Rail Transport'
              : value === 'sea'
              ? 'Sea Transport'
              : value === 'air'
              ? 'Air Transport'
              : value === 'courier'
              ? 'Courier'
              : value === 'warehouse'
              ? 'Warehouse'
              : value === 'deport'
              ? 'Depot'
              : null}
          </span>
        ),
      },

      {
        Header: 'Operation Type',
        accessor: 'transType',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row }) => <span>{value ? capitalize(value) : null}</span>,
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

  const data = useMemo(() => (operations.length > 0 ? operations : []), [operations])

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
        <div className="setupProccessForm" id="newSetup">
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
                    <CButton color="primary" onClick={(e) => handleOperationPanel(e)}>
                      Add New Operation
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
              <a className="btn btn-info mr-2" href="/setups/new?step=4">
                Previous
              </a>
              <a className="btn btn-primary" href="/setups/new?step=6">
                Next
              </a>
            </CCol>
          </CRow>
        </div>
      </div>
    </div>
  )
}

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
}

export default Operations
