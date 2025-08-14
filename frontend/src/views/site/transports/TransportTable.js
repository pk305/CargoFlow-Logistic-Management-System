import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { CRow, CCol, CFormInput, CButtonGroup, CButton } from '@coreui/react'
// import { useHistory } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilZoom, cilPlus, cilMinus, cilX, cilArrowThickFromLeft } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import {
  useTable,
  useExpanded,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useAsyncDebounce,
} from 'react-table'
import PropTypes from 'prop-types'
import { matchSorter } from 'match-sorter'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import { fetchPlannedPositions } from 'src/redux/slices/planningSlice'
import { Link } from 'react-router-dom'

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

const TransportTable = ({ selectedLoadings, handleTransPanel }) => {
  // const history = useHistory()
  const dispatch = useDispatch()
  const { fetchingPlannedPositions } = useSelector((state) => state.planning)
  const { plannedPostions } = useSelector((state) => state.planning)

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

  const handleCreateTrans = (e) => {
    e.preventDefault()
    handleTransPanel()
  }

  const columns = useMemo(
    () => [
      {
        // Build our expander column
        id: 'expander', // Make sure it has an ID
        Header: '',
        style: {
          width: '29px',
        },
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) =>
          // eslint-disable-next-line react/prop-types
          row.canExpand ? (
            <span
              // eslint-disable-next-line react/prop-types
              {...row.getToggleRowExpandedProps({
                style: {
                  // eslint-disable-next-line react/prop-types
                  paddingLeft: `${row.depth * 2}rem`,
                },
              })}
            >
              {/* eslint-disable-next-line react/prop-types */}
              {row.isExpanded ? (
                <CIcon icon={cilMinus} size="lg" className="text-primary" />
              ) : (
                <CIcon icon={cilPlus} size="lg" className="text-primary" />
              )}
            </span>
          ) : null,
      },
      {
        id: 'check-expanded',
        Header: '',
        style: {
          width: '35px',
        },
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) =>
          // eslint-disable-next-line react/prop-types
          row.canExpand ? (
            <span>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" className="md-checkbox-action-btn">
                <CIcon icon={cilArrowThickFromLeft} size="lg" />
              </a>
            </span>
          ) : (
            <span>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#">
                <CIcon icon={cilX} size="lg" />
              </a>
            </span>
          ),
      },
      {
        Header: (
          <span>
            <span>Reference</span>
          </span>
        ),
        accessor: 'name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row }) => (
          <div>
            {/*  eslint-disable-next-line react/prop-types */}
            <Link to={`/loadings/${row.original.linkId}`}>{value}</Link>
          </div>
        ),
      },

      {
        Header: (
          <span>
            <span>Departure</span>
          </span>
        ),
        accessor: 'customer.name',
      },

      {
        Header: (
          <span>
            <span>Departure Date</span>
          </span>
        ),
        accessor: 'loadingDate',
      },
      {
        Header: (
          <span>
            <span>Arrival</span>
          </span>
        ),
        accessor: 'operation',
      },
      {
        Header: (
          <span>
            <span>Arrival Date</span>
          </span>
        ),
        accessor: 'collectionPlace',
      },
      {
        Header: (
          <span>
            <span>Total Goods Weight</span>
          </span>
        ),
        accessor: 'deliveryPlace',
      },
      {
        Header: (
          <span>
            <span>Volume</span>
          </span>
        ),
        accessor: 'fullGroupage',
      },
      {
        Header: (
          <span>
            <span>Ladameter</span>
          </span>
        ),
        accessor: 'm3',
      },
      {
        Header: (
          <span>
            <span>Amount</span>
          </span>
        ),
        accessor: 'q1',
      },
      {
        Header: (
          <span>
            <span>Total Loadings</span>
          </span>
        ),
        accessor: 'mdd3',
      },
    ],
    [],
  )

  const data = useMemo(
    () => (plannedPostions && plannedPostions.length > 0 ? plannedPostions : []),
    [plannedPostions],
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { globalFilter },
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 20 },
      defaultColumn,
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    useExpanded,
    usePagination,
    useRowSelect,
  )

  const fetchPositionsData = useCallback(() => dispatch(fetchPlannedPositions()), [dispatch])

  useEffect(() => {
    fetchPositionsData()
  }, [fetchPositionsData])

  const firstPageRows = page.slice(0, 20)

  return (
    <>
      <CRow className="pageBoxSizing-filter">
        <CCol sm={6} md={6} lg={6} xl={6}>
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
        <CCol sm={6} md={6} lg={6} xl={6}>
          <div className="cstSearchActions">
            <CButtonGroup>
              <CButton
                color="primary"
                active
                onClick={(e) => handleCreateTrans(e)}
                disabled={selectedLoadings.length > 0 ? false : true}
              >
                <i className="fa fa-plus mr-2" /> Create Transport
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
            {fetchingPlannedPositions ? (
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
                          {headerGroup.headers.map((column, i) => {
                            const { key, ...restColumn } = column.getHeaderProps([
                              {
                                className: column.className,
                                style: column.style,
                              },
                            ])

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
                        // eslint-disable-next-line react/prop-types
                        const { key, ...restRowProps } = row.getRowProps()
                        return (
                          <tr key={key} {...restRowProps} className="bg-hover-light-primary">
                            {/*  eslint-disable-next-line react/prop-types */}
                            {row.cells.map((cell) => {
                              const { key, ...restCellProps } = cell.getCellProps([
                                {
                                  className: cell.column.className,
                                  style: cell.column.style,
                                },
                              ])
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

TransportTable.propTypes = {
  selectedLoadings: PropTypes.array,
  handleTransPanel: PropTypes.func,
}

export default TransportTable
