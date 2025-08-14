import React, { useState, useMemo, forwardRef, useEffect, useRef, useCallback } from 'react'
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
  CModal,
  CModalHeader,
  CModalTitle,
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
import { useDispatch, useSelector } from 'react-redux'
import Noty from 'noty'
import SlidingPane from 'react-sliding-pane'
import { fetchFinpoints } from 'src/redux/slices/finpointSlice'
import { NewAccPlan, NewProfitCenter } from '../modalInfo'
import { BankAccIntegration, NewBankAccount } from '../panels'
import $ from 'jquery'

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

const fuzzyTextFilterFn = (rows, id, filterValue) => {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] })
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

const Table = ({ columns, data }) => {
  const { fetchingFinpoints } = useSelector((state) => state.finpoint)

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

  const firstPageRows = rows.slice(0, 20)

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
            {fetchingFinpoints ? (
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
        {!fetchingFinpoints && (
          <div className="table-page">
            {firstPageRows.length > 0 && (
              <div>
                <span>
                  Showing page {pageIndex + 1} of {pageOptions.length} - {data.length}
                </span>
              </div>
            )}
            <div className="pagination">
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
        )}
      </div>
    </>
  )
}

const BankAccounts = () => {
  const dispatch = useDispatch()
  const [toggleTransPanel, setToggleTransPanel] = useState(false)
  const [accIntegrate, setAccIntegrate] = useState(false)
  const [accPlanModal, setAccPlanModal] = useState(false)
  const [profCenterModal, setProfCenterModal] = useState(false)
  const [accountInfo, setAccountInfo] = useState(null)

  const { finpoints } = useSelector((state) => state.finpoint)

  const handleCancelSlide = () => {
    setToggleTransPanel(false)
  }

  const handleCancelAccIntg = () => {
    setAccIntegrate(!accIntegrate)
  }

  const handleAccIntg = useCallback((e, item) => {
    e.preventDefault()
    $('.dropdown-menu').removeClass('show')
    setAccountInfo(item)
    setAccIntegrate(true)
  }, [])

  const closeAccPlanModal = () => {
    setAccPlanModal(false)
  }

  const handleAccountPlan = (e) => {
    e.preventDefault()
    handleCancelAccIntg()
    setAccPlanModal(true)
  }

  const handleCreateProfitCenter = (e) => {
    e.preventDefault()
    handleCancelAccIntg()
    setProfCenterModal(true)
  }

  const closeProfCenterModal = () => {
    setProfCenterModal(false)
  }

  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'actions',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row: { original } }) => (
          <div>
            <div className="table-action-dropdown">
              <CDropdown>
                <CDropdownToggle color="link">
                  <i className="fa fa-ellipsis-h"></i>
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>
                    <i className="fa fa-edit" />
                    <span className="ml-2">Edit</span>
                  </CDropdownItem>
                  <CDropdownItem onClick={(e) => handleAccIntg(e, original)}>
                    <i className="fa fa-link" />
                    <span className="ml-2">Integration</span>
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-trash" />
                    <span className="ml-2">Delete</span>
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
          </div>
        ),
      },
      {
        Header: 'Bank-Cash Point Name',
        accessor: 'title',
      },
      {
        Header: 'Point Type',
        accessor: 'pointType',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => (
          <span>
            {value === 'cash_point' ? (
              <span className="text-info">Cash Account</span>
            ) : (
              <span className="text-info">Bank Account</span>
            )}
          </span>
        ),
      },
      {
        Header: 'Currency',
        accessor: 'curr.code',
      },

      {
        Header: 'IBAN No',
        accessor: 'reference',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => (
          <div className="truncate">
            {value}

            {/* eslint-disable-next-line react/prop-types */}
            {value && value.length > 13 ? (
              <>
                <br />
                <span style={{ fontSize: '10px' }}>
                  <a
                    href={`https://bank-code.net/iban-checker?iban=${value}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Check IBAN
                  </a>
                </span>
              </>
            ) : null}
          </div>
        ),
      },
      {
        Header: 'Bank Name',
        accessor: 'bank',
      },
      {
        Header: 'Branch ',
        accessor: 'branch.name',
      },
      {
        Header: 'Person in Charge',
        accessor: 'manager.name',
      },
    ],
    [handleAccIntg],
  )

  const data = useMemo(() => (finpoints && finpoints.length > 0 ? finpoints : []), [finpoints])
  const fetchDataFinpoints = useCallback(() => dispatch(fetchFinpoints()), [dispatch])

  useEffect(() => {
    fetchDataFinpoints()
  }, [fetchDataFinpoints])

  return (
    <div>
      <CCard className="cardCustom">
        <div className="card-header">
          <div className="toolBarContainer">
            <div className="customHeaderContainer">
              <div className="customHeaderContainer-footer">
                <div className="card-title">
                  <h3 className="st-Title">Bank-Cash Points</h3>
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
                  <i className="fa fa-plus mr-2" /> New Bank Account
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

      {/* new currency */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={toggleTransPanel}
        title={
          <div className="space">
            <div>
              <span>New Bank Account</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={() => handleCancelSlide()}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>
          <NewBankAccount handleCancelSlide={handleCancelSlide} />
        </div>
      </SlidingPane>

      {/* acc integration */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={accIntegrate}
        title={
          <div className="space">
            <div>
              <span>Accounting Integration</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={() => handleCancelAccIntg()}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>
          <BankAccIntegration
            accountInfo={accountInfo}
            handleCancelAccIntg={handleCancelAccIntg}
            handleAccountPlan={handleAccountPlan}
            handleCreateProfitCenter={handleCreateProfitCenter}
          />
        </div>
      </SlidingPane>

      {/* new ledger account modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        scrollable={true}
        transition={false}
        size="lg"
        visible={accPlanModal}
        onClose={() => closeAccPlanModal()}
      >
        <CModalHeader>
          <CModalTitle>New Account Plan</CModalTitle>
        </CModalHeader>
        <NewAccPlan closeAccPlanModal={closeAccPlanModal} />
      </CModal>

      {/* new profit center modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        scrollable={true}
        transition={false}
        size="lg"
        visible={profCenterModal}
        onClose={() => closeProfCenterModal()}
      >
        <CModalHeader>
          <CModalTitle>New Profit Center</CModalTitle>
        </CModalHeader>
        {/*  */}
        <NewProfitCenter closeProfCenterModal={closeProfCenterModal} />
      </CModal>
    </div>
  )
}

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  setToggleTransPanel: PropTypes.func,
}

GlobalFilter.propTypes = {
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func,
}

DefaultColumnFilter.propTypes = {
  column: PropTypes.object,
  setGlobalFilter: PropTypes.func,
}

IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.bool,
}

fuzzyTextFilterFn.propTypes = {
  rows: PropTypes.array,
  id: PropTypes.number,
  filterValue: PropTypes.array,
}
export default BankAccounts
