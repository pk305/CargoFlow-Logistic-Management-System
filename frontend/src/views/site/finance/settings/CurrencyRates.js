import React, { useState, useMemo, forwardRef, useEffect, useRef } from 'react'
import {
  CCard,
  CCardBody,
  CRow,
  CButton,
  CCol,
  CFormInput,
  CButtonGroup,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import {
  useTable,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useAsyncDebounce,
} from 'react-table'
import CIcon from '@coreui/icons-react'
import { cilZoom, cilTrash } from '@coreui/icons'
import PropTypes from 'prop-types'
import { matchSorter } from 'match-sorter'
import classNames from 'classnames'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import { useSelector } from 'react-redux'
import Noty from 'noty'
import SlidingPane from 'react-sliding-pane'
import NewLedgerAccount from '../panels/NewLedgerAccount'

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

// eslint-disable-next-line react/display-name
const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef()
  const resolvedRef = ref || defaultRef

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate
  }, [resolvedRef, indeterminate])

  return (
    <>
      <input type="checkbox" ref={resolvedRef} {...rest} />
    </>
  )
})
IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.bool,
}

const Table = ({ columns, data }) => {
  const [showFilter] = useState(false)
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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
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
          className={classNames({ hide: !selectedFlatRows.length > 0 })}
        >
          <div className="pageSearchContainer">
            <div className="filter-actions">
              <div className="filterCount-selected">{selectedFlatRows.length}</div>
              <div className="filterSelected-text">
                {selectedFlatRows.length === 1 ? 'Company' : 'Companies'} Selected
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
            {/* table info */}
            {!fetchingCompanies && !firstPageRows.length > 0 && (
              <div className="table-info">
                <span>No records found.</span>
              </div>
            )}
            {fetchingCompanies && (
              <div className="table-info">
                <span className="mt-5">
                  <img src={loaderLg} alt="" />
                </span>
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

const CurrencyRates = () => {
  const [toggleTransPanel, setToggleTransPanel] = useState(false)

  const handleCancelSlide = (e) => {
    e.preventDefault()
    setToggleTransPanel(!toggleTransPanel)
  }

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
                    <i className="fa fa-edit" />
                    <span className="text-rl">Edit</span>
                  </CDropdownItem>

                  <CDropdownItem>
                    <i className="fa fa-trash" />
                    <span className="text-rl">Delete</span>
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
          </div>
        ),
      },
      {
        Header: 'Code',
        accessor: 'code',
      },
      {
        Header: 'Name',
        accessor: 'customerType',
      },
      {
        Header: 'Symbol',
        accessor: 'phone',
      },

      {
        Header: 'Multiplier',
        accessor: 'email',
      },
    ],
    [],
  )

  const data = useMemo(() => [], [])

  return (
    <div>
      <CCard className="cardCustom">
        <div className="card-header">
          <div className="toolBarContainer">
            <div className="customHeaderContainer">
              <div className="customHeaderContainer-footer">
                <div className="card-title">
                  <h3 className="st-Title">Currency Rates</h3>
                </div>
              </div>
            </div>
            <div className="customHeaderToolbar">
              <CButtonGroup>
                <CButton
                  color="primary"
                  active
                  onClick={() => setToggleTransPanel(!toggleTransPanel)}
                >
                  <i className="fa fa-plus mr-2" /> Add New Currency
                </CButton>
              </CButtonGroup>
            </div>
          </div>
        </div>
        <CCardBody className="p-0">
          <div className="pageContainer-wrapper isTable">
            <Table columns={columns} data={data} />
          </div>
        </CCardBody>
      </CCard>

      {/* bew currency */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={toggleTransPanel}
        title={
          <div className="space">
            <div>
              <span>New Currency</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={() => setToggleTransPanel(false)}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>
          <NewLedgerAccount />
        </div>
        <div className="slide-pane__footer">
          <div className="float-right">
            <CButton color="secondary" className="mr-2" onClick={(e) => handleCancelSlide(e)}>
              Cancel
            </CButton>
          </div>
        </div>
      </SlidingPane>
    </div>
  )
}

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  setToggleTransPanel: PropTypes.func,
}

export default CurrencyRates
