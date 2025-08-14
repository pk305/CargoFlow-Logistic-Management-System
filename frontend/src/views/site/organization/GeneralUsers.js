import React, { useState, useMemo, useEffect, useCallback } from 'react'
import {
  CCardBody,
  CRow,
  CCol,
  CButton,
  CPagination,
  CPaginationItem,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CCard,
} from '@coreui/react'
import {
  useTable,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useAsyncDebounce,
} from 'react-table'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { cilFilter, cilZoom, cilX } from '@coreui/icons'
import { matchSorter } from 'match-sorter'
import classNames from 'classnames'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import { useDispatch, useSelector } from 'react-redux'
import { destroyUser, fetchUsers, sendActivationEmail } from 'src/redux/slices/userSlice'
import NewUser from './modelInfo/NewUser'
import $ from 'jquery'
import SMTPSetting from './modelInfo/SMTPSetting'
import ChangePassword from './modelInfo/ChangePassword'
import UserLoginInfo from './modelInfo/UserLoginInfo'
import Noty from 'noty'

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
  const [showFilter, setShowFilter] = useState(false)
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

  const handleFilter = (e) => {
    e.preventDefault()
    setShowFilter(!showFilter)
  }

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
    selectedFlatRows,
    state: { pageIndex, globalFilter },
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

  const firstPageRows = page.slice(0, 20)

  return (
    <>
      <CRow className="pageBoxSizing-filter">
        <CCol
          sm={6}
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
          sm={6}
          md={6}
          lg={6}
          xl={6}
          className={classNames({ hide: selectedFlatRows.length > 0 })}
        >
          <div className="cstSearchActions">
            <CButton color="secondary" variant="outline" onClick={(e) => handleFilter(e)}>
              {!showFilter ? (
                <span>
                  <CIcon icon={cilFilter} /> Filter
                </span>
              ) : (
                <span>
                  <CIcon icon={cilX} style={{ verticalAlign: '-2px', paddingRight: '2px' }} />
                  Cancel Filter
                </span>
              )}
            </CButton>
          </div>
        </CCol>
      </CRow>
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
                                <div style={{ display: !showFilter ? 'none' : '' }}>
                                  {column.canFilter &&
                                  key !== 'header_actions' &&
                                  key !== 'header_countVar'
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

const GeneralUsers = ({ company }) => {
  const dispatch = useDispatch()
  const { users } = useSelector((state) => state.user)
  const [userModal, setUserModal] = useState(false)
  const [smtpModal, setSmtpModal] = useState(false)
  const [changePswdModal, setChangePswdModal] = useState(false)
  const [userLoginInfoMd, setUserLoginInfoMd] = useState(false)

  const handleRemoveUser = useCallback(
    (e, original) => {
      e.preventDefault()
      $('.dropdown-menu').removeClass('show')
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
            async function () {
              const selectedIds = [original].map((x) => ({ Id: x.uuid }))
              const resData = await dispatch(destroyUser(JSON.stringify(selectedIds))).unwrap()
              if (resData) {
                n.close()
              }
            },
            { id: 'delItem' },
          ),

          Noty.button('Cancel', 'btn btn-default btn-sm float-right', function () {
            n.close()
          }),
        ],
      })
      n.show()
    },
    [dispatch],
  )

  const closeUserModal = () => {
    setUserModal(false)
  }

  const handleUserLoginModal = useCallback((e) => {
    e.preventDefault()
    $('.dropdown-menu').removeClass('show')
    setUserLoginInfoMd(true)
  }, [])

  const closeUserInfModal = () => {
    setUserLoginInfoMd(false)
  }

  const handleChangePswd = useCallback((e) => {
    e.preventDefault()
    $('.dropdown-menu').removeClass('show')
    setChangePswdModal(true)
  }, [])

  const closeSmtpModal = () => {
    setSmtpModal(false)
  }

  const handleUserModal = (e) => {
    e.preventDefault()
    setUserModal(true)
  }

  const handleActivationMail = useCallback(
    async (e, item) => {
      e.preventDefault()
      $('.dropdown-menu').removeClass('show')
      var n = new Noty({
        text: 'Are sure you want to send Verification Email to this user ?',
        layout: 'topCenter',
        progressBar: false,
        timeout: false,
        type: 'error',
        buttons: [
          Noty.button(
            'Send',
            'btn btn-default btn-sm del-bnt-mr text-success float-right',
            async function () {
              const resData = await dispatch(sendActivationEmail({ userId: item.uuid })).unwrap()
              if (resData) {
                new Noty({
                  type: 'alert',
                  layout: 'topRight',
                  id: `asp${resData.id}`,
                  text: `A verification code has been sent to ${resData.email} address succesfully`,
                }).show()

                n.close()
              }
            },
            { id: 'suces' },
          ),

          Noty.button('Cancel', 'btn btn-default btn-sm float-right', function () {
            n.close()
          }),
        ],
      })
      n.show()
    },
    [dispatch],
  )

  const closePswdModal = () => {
    setChangePswdModal(false)
  }

  const handleSMTPsettings = useCallback((e, item) => {
    e.preventDefault()
    $('.dropdown-menu').removeClass('show')
    setSmtpModal(true)
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: <span>Name</span>,
        accessor: 'name',
      },
      {
        Header: <span>Office Telephone</span>,
        accessor: 'phone',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <span>
            {/* eslint-disable-next-line react/prop-types */}
            {value ? `${value}-${original.name}` : null}
          </span>
        ),
      },
      {
        Header: <span>Job Title</span>,
        accessor: 'jobTitle',
      },
      {
        Header: <span>Last Login Time</span>,
        accessor: 'lastLogin',
      },
      {
        Header: <span>Branch</span>,
        accessor: 'branch.name',
      },
      {
        Header: <span>Status</span>,
        accessor: 'status',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span>{value ? 'Active' : 'Inactive'}</span>,
      },
      {
        Header: '',
        accessor: 'actions',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row: { original } }) => (
          <div className="float-right">
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
                  <CDropdownItem onClick={(e) => handleChangePswd(e)}>
                    <i className="fa fa-lock" />
                    <span className="text-rl">Change Password</span>
                  </CDropdownItem>
                  <CDropdownItem onClick={(e) => handleSMTPsettings(e, original)}>
                    <i className="fa fa-envelope" />
                    <span className="text-rl">SMTP Settings</span>
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-edit" />
                    <span className="text-rl">Change Authorization</span>
                  </CDropdownItem>
                  <CDropdownItem onClick={(e) => handleUserLoginModal(e)}>
                    <i className="fa fa-user" />
                    <span className="text-rl">User Login</span>
                  </CDropdownItem>
                  <CDropdownItem onClick={(e) => handleActivationMail(e, original)}>
                    <i className="far fa-envelope" />
                    <span className="text-rl">Send Activation Email</span>
                  </CDropdownItem>
                  <CDropdownItem onClick={(e) => handleRemoveUser(e, original)}>
                    <i className="fa fa-trash" />
                    <span className="text-rl">Delete</span>
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
          </div>
        ),
      },
    ],
    [
      handleSMTPsettings,
      handleChangePswd,
      handleUserLoginModal,
      handleActivationMail,
      handleRemoveUser,
    ],
  )

  const data = useMemo(() => (users && users.length > 0 ? users : []), [users])

  const fetchUserData = useCallback(() => dispatch(fetchUsers()), [dispatch])

  useEffect(() => {
    //
    fetchUserData()
  }, [fetchUserData])

  return (
    <>
      <div className="tab-pane fade show active" id="general_user_details" role="tabpanel">
        <div className="d-block bg-white p-3 rounded">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="d-flex flex-column gutter-b">
                <div className="d-flex justify-content-between">
                  <h4 className="cstPageTitle">Users</h4>
                  <CButton color="primary" active size="sm" onClick={(e) => handleUserModal(e)}>
                    <i className="fa fa-plus mr-2" /> Create User
                  </CButton>
                </div>
                <CCardBody className="p-0">
                  <div className="pageContainer-wrapper ">
                    <Table columns={columns} data={data} />
                  </div>
                </CCardBody>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* create user modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        portal={false}
        transition={false}
        scrollable
        size="lg"
        visible={userModal}
        onClose={() => closeUserModal()}
      >
        <CModalHeader>
          <CModalTitle className="ml-2">New Person</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-2">
          <CCard className="cardCustom">
            <div className="card-body">
              <NewUser closeUserModal={closeUserModal} />
            </div>
          </CCard>
        </CModalBody>
      </CModal>

      {/* smtp settings modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        portal={false}
        transition={false}
        scrollable
        size="lg"
        visible={smtpModal}
        onClose={() => closeSmtpModal()}
      >
        <CModalHeader>
          <CModalTitle className="ml-2">SMTP Settings</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-2">
          <CCard className="cardCustom">
            <div className="card-body">
              <SMTPSetting closeSmtpModal={closeSmtpModal} />
            </div>
          </CCard>
        </CModalBody>
      </CModal>

      {/* change password modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        portal={false}
        transition={false}
        scrollable
        size="lg"
        visible={changePswdModal}
        onClose={() => closePswdModal()}
      >
        <CModalHeader>
          <CModalTitle className="ml-2">Change Password</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-2">
          <CCard className="cardCustom">
            <div className="card-body">
              <ChangePassword closePswdModal={closePswdModal} />
            </div>
          </CCard>
        </CModalBody>
      </CModal>

      {/* user login info modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        portal={false}
        transition={false}
        scrollable
        size="lg"
        visible={userLoginInfoMd}
        onClose={() => closeUserInfModal()}
      >
        <CModalHeader>
          <CModalTitle className="ml-2">User Login Info</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-2">
          <CCard className="cardCustom">
            <div className="card-body">
              <UserLoginInfo closeUserInfModal={closeUserInfModal} />
            </div>
          </CCard>
        </CModalBody>
      </CModal>
    </>
  )
}

GeneralUsers.propTypes = {
  company: PropTypes.object,
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

export default GeneralUsers
