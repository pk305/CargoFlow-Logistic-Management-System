import React, { useMemo, useState } from 'react'
import { CCard, CCardBody, CPagination, CPaginationItem } from '@coreui/react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import {
  useTable,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useAsyncDebounce,
} from 'react-table'
import CIcon from '@coreui/icons-react'
import { cilZoom } from '@coreui/icons'
import { matchSorter } from 'match-sorter'
import loaderLg from 'src/assets/loader/loaderLg.gif'

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <>
      <input
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
  const { fetchingUsers } = useSelector((state) => state.user)

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
    state: { pageIndex },
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
      <div className="pageBoxSizing-container cst-tableResponsive">
        <div className="table-responsive table-truncate pageTableWrapper">
          <div>
            {fetchingUsers ? (
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
        {!fetchingUsers && (
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

const UserLoginInfo = ({ closeUserInfModal }) => {
  const columns = useMemo(
    () => [
      {
        Header: <span>User Name</span>,
        accessor: 'userName',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span className="font-weight-bolder">{value}</span>,
      },
      {
        Header: <span>IP Address</span>,
        accessor: 'ipAddress',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <span>
            {/* eslint-disable-next-line react/prop-types */}
            {value}
          </span>
        ),
      },
      {
        Header: <span>Device Name</span>,
        accessor: 'deviceName',
      },
      {
        Header: <span>OS Version</span>,
        accessor: 'osVersion',
      },
      {
        Header: <span>Browser Type</span>,
        accessor: 'broswerType',
      },
      {
        Header: <span>Location</span>,
        accessor: 'location',
        // eslint-disable-next-line react/prop-types
        // Cell: ({ value }) => <span>{value ? 'Active' : 'Inactive'}</span>,
      },
      {
        Header: <span>Start Date</span>,
        accessor: 'startDate',
      },
    ],
    [],
  )
  const data = useMemo(
    () => [
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
      {
        userName: 'Demo Translocation',
        ipAddress: '102.393.232.323',
        deviceName: 'Desktop',
        osVersion: 'Windows 7',
        broswerType: 'Firefox 77.0',
        startDate: '23 Jun 04:39 PM',
        location: '',
      },
    ],
    [],
  )

  return (
    <div>
      <div className="row">
        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div className="d-flex flex-column gutter-b">
            <CCard>
              <CCardBody className="p-0">
                <div className="pageContainer-wrapper isTable">
                  <Table columns={columns} data={data} />
                </div>
              </CCardBody>
            </CCard>
          </div>
        </div>
      </div>
    </div>
  )
}

UserLoginInfo.propTypes = {
  closeUserInfModal: PropTypes.func,
}

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
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

export default UserLoginInfo
