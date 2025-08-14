import React, { useState, useMemo, useEffect, useCallback } from 'react'
import {
  CCard,
  CButton,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CFormFeedback,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormInput,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import classNames from 'classnames'
import $ from 'jquery'
import { isEmpty, isNull } from 'lodash'
import PropTypes from 'prop-types'
import {
  clearAccountError,
  createAccount,
  fetchAccounts,
  showAccountError,
} from 'src/redux/slices/accountSlice'
import { fetchFinpoints } from 'src/redux/slices/finpointSlice'
import { fetchLedgerSubAcc } from 'src/redux/slices/ledgerAccountSlice'
import { fetchProfitCenterSubAcc } from 'src/redux/slices/profitCenterSlice'
import { useTable, useFilters, useGlobalFilter, usePagination, useRowSelect } from 'react-table'
import loaderLg from 'src/assets/loader/loaderLg.gif'
// import Noty from 'noty'

const Table = ({ columns, data }) => {
  const { fetchingAccounts } = useSelector((state) => state.account)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 20 },
    },
    useFilters,
    useGlobalFilter,
    usePagination,
    useRowSelect,
  )

  const firstPageRows = rows.slice(0, 20)

  return (
    <>
      <div className="pageBoxSizing-container cst-tableResponsive">
        <div className="table-responsive table-truncate pageTableWrapper">
          <div>
            {fetchingAccounts ? (
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
        {!fetchingAccounts && (
          <div className="table-page">
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

const BankAccIntegration = ({ accountInfo, handleAccountPlan, handleCreateProfitCenter }) => {
  const dispatch = useDispatch()
  const { accounts, accountErrors, creatingAccount } = useSelector((state) => state.account)
  const { finpoints, fetchingFinpoints } = useSelector((state) => state.finpoint)
  const { ledgerSubaccounts, fetchingLedgerSubAcc } = useSelector((state) => state.ledger)
  const { profitCenterSubaccounts, fetchingProfCentSubAcc } = useSelector(
    (state) => state.profitCenter,
  )
  const [defParentObj, setDefParentObj] = useState(null)

  const [accountData, setAccountData] = useState({
    parentId: `${accountInfo && accountInfo.id}`,
    parentTitle: `${accountInfo && accountInfo.title}`,
    parentType: `${accountInfo && accountInfo.pointType}`,
    parentType2: 'cash',
    workType: 'static',
    fiscalYear: `${new Date().getFullYear()}`,
    status: 'active',
    ledgerAccountId: '',
    ledgerSubAccountId: '',
    profitCenterId: '',
    profitCenterSubId: '',
    ledgerAccountCode: '',
    profitCenterCode: '',
  })

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setAccountData({
      ...accountData,
      [name]: value,
    })
  }

  const handleSelectForm = (c, val) => {
    if (c === 'ledgerAccountId') {
      setAccountData((state) => ({
        ...state,
        ledgerAccountId: !isNull(val)
          ? isNull(val.value.mainAccId)
            ? val.value.id
            : val.value.mainAccId
          : '',
        ledgerSubAccountId: !isNull(val) ? (!isNull(val.value.mainAccId) ? val.value.id : '') : '',
      }))
    } else if (c === 'profitCenterId') {
      setAccountData((state) => ({
        ...state,
        profitCenterId: !isNull(val)
          ? isNull(val.value.mainAccId)
            ? val.value.id
            : val.value.mainAccId
          : '',
        profitCenterSubId: !isNull(val) ? (!isNull(val.value.mainAccId) ? val.value.id : '') : '',
      }))
    } else {
      if (c === 'parentId') {
        setDefParentObj(
          val
            ? {
                label: val.label,
                value: val.value,
              }
            : null,
        )
      }

      const e = {
        target: {
          name: c,
          value: !isNull(val) ? val.value : '',
        },
      }
      handleChangeForm(e)
    }
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearAccountError({ type: c, errorType: 'errAccount' }))

    if (c === 'parentId') {
      if (isEmpty(finpoints)) {
        dispatch(fetchFinpoints())
      }
    } else if (c === 'ledgerAccountId') {
      if (isEmpty(ledgerSubaccounts)) {
        dispatch(fetchLedgerSubAcc({ type: 'ledgerSub' }))
      }
    } else if (c === 'profitCenterId') {
      if (isEmpty(profitCenterSubaccounts)) {
        dispatch(fetchProfitCenterSubAcc({ type: 'profitCenterSub' }))
      }
    }
  }

  const handleSubmitAccount = async (e) => {
    e.preventDefault()
    const form = $('#new_account')
    if (form.length > 0) {
      const bd = 'html, body'
      if (accountData.parentId === '') {
        dispatch(showAccountError({ type: 'parentId', errorType: 'errAccount' }))
        $(bd).animate({ scrollTop: 0 }, 300)
        return false
      }
    }
    //form data
    let arrForm = Object.entries(accountData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }

    const resData = await dispatch(createAccount(formData)).unwrap()
    if (resData) {
      // clearInvoiceData()
      // new Noty({
      //   type: 'alert',
      //   layout: 'topRight',
      //   id: `succItem${resData.id}`,
      //   text: 'Invoice has been created succesfully',
      // }).show()
      // history.push(`/invoices/${resData.linkId}`)
    }
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
                    <i className="fa fa-edit mr-2" />
                    Edit
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-trash mr-2" />
                    Delete
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
          </div>
        ),
      },
      {
        Header: 'Account Name',
        accessor: 'name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => <span className="font-weight-bold">{value}</span>,
      },
      {
        Header: 'Parent Object',
        accessor: 'ledgerAccount.name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <span className="font-weight-bold">
            {/* eslint-disable-next-line react/prop-types */}
            {original.ledgerAccountCode ? original.ledgerAccountCode : original.ledgerAccount.name}
            {/* {value
              ? value
              : // eslint-disable-next-line react/prop-types
              original.ledgerAccount
              ? // eslint-disable-next-line react/prop-types
                original.ledgerAccount.code + ' - ' + original.ledgerAccount.name
              : null} */}
          </span>
        ),
      },
      {
        Header: 'Parent Type',
        accessor: 'parentType',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <span>
            {value === 'bank_account' ? (
              <>
                <span className="label label-secondary label-inline font-weight-bold">
                  Bank Account
                </span>
                &nbsp;
                <div className="label label-light-info label-inline font-weight-bold">
                  {/* {original} */}
                </div>
              </>
            ) : (
              <>
                {/* <span className="label label-secondary label-inline font-weight-bold">
                  Bank Account
                </span>
                &nbsp;
                <div className="label label-light-info label-inline font-weight-bold">2022</div> */}
              </>
            )}
          </span>
        ),
      },
      {
        Header: 'Account Type',
        accessor: 'parentType2',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value }) => (
          <span>
            {value === 'cash'
              ? 'Cash Account'
              : value === 'deposit'
              ? 'Deposit Account'
              : value === 'cheque'
              ? 'Cheques Account'
              : value === 'leasing'
              ? 'Leasing Account'
              : null}
          </span>
        ),
      },
      {
        Header: 'Ledger Account',
        accessor: 'ledgerAccountCode',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <span className="font-weight-bold">
            {value
              ? value
              : // eslint-disable-next-line react/prop-types
              original.ledgerAccount
              ? // eslint-disable-next-line react/prop-types
                original.ledgerAccount.code + ' - ' + original.ledgerAccount.name
              : null}
          </span>
        ),
      },
      {
        Header: 'Cost Center ',
        accessor: 'profitCenterCode',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <span className="font-weight-bold">
            {/* eslint-disable-next-line react/prop-types */}
            {value ? value : original.profitCenter ? original.profitCenter.code : null}
          </span>
        ),
      },
    ],
    [],
  )

  const data = useMemo(() => (accounts && accounts.length > 0 ? accounts : []), [accounts])
  const fetchDataAccounts = useCallback(() => dispatch(fetchAccounts()), [dispatch])

  useEffect(() => {
    if (accountInfo) {
      setDefParentObj(
        accountInfo.id
          ? {
              label: accountInfo.title,
              value: accountInfo.id,
            }
          : null,
      )
    }

    fetchDataAccounts()
  }, [accountInfo, fetchDataAccounts])

  return (
    <div className="slidePanel-inner-section">
      <CCard className="cardCustom gutter-b">
        <div className="card-body">
          <form
            className="simple_form horizontal-form"
            id="new_account"
            onSubmit={(e) => handleSubmitAccount(e)}
          >
            <div className="row">
              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <div className="form-group bank_account account_parent_id">
                  <label className="control-label bank_account" htmlFor="account_parent_id">
                    Parent Object
                  </label>
                  <div className="input-group">
                    <Select
                      id="account_parent_id"
                      classNamePrefix="cstSelect"
                      isClearable={true}
                      placeholder
                      isLoading={fetchingFinpoints ? true : false}
                      isSearchable
                      name="parentId"
                      autoFocus={false}
                      value={defParentObj}
                      options={
                        finpoints && !fetchingFinpoints && finpoints.length > 0
                          ? finpoints.map((itm) => ({
                              label: itm.title,
                              value: itm.id,
                            }))
                          : []
                      }
                      className={classNames('form-control form-control-cst pageCstSelect ', {
                        'is-invalid': accountErrors && !isEmpty(accountErrors.parentId),
                      })}
                      noOptionsMessage={() => 'No results found'}
                      onChange={(e) => handleSelectForm('parentId', e)}
                      onFocus={(e) => handleSelectFocus('parentId', e)}
                    />
                    <CFormFeedback
                      invalid={accountErrors && !isEmpty(accountErrors.parentId) ? true : false}
                      className="fieldError-cst"
                    >
                      {accountErrors.parentId}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group account_parent_type2">
                  <label className="control-label" htmlFor="account_parent_type2">
                    Account Type
                  </label>
                  <CFormSelect
                    className="form-control-cst"
                    name="parentType2"
                    id="account_parent_type2"
                    value={accountData.parentType2}
                    invalid={accountErrors && !isEmpty(accountErrors.parentType2) ? true : false}
                    onChange={(e) => handleChangeForm(e)}
                    onFocus={(e) => handleSelectFocus('parentType2', e)}
                  >
                    <option value="cash">Cash Account</option>
                    <option value="deposit">Deposit Account</option>
                    <option value="cheque">Cheques Account</option>
                    <option value="leasing">Leasing Account</option>
                  </CFormSelect>
                  <CFormFeedback invalid className="fieldError-cst">
                    {accountErrors.parentType2}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group account_work_type">
                  <label className="control-label" htmlFor="account_work_type">
                    Integration Type
                  </label>
                  <CFormSelect
                    className="form-control-cst"
                    name="workType"
                    id="account_work_type"
                    value={accountData.workType}
                    invalid={accountErrors && !isEmpty(accountErrors.workType) ? true : false}
                    onChange={(e) => handleChangeForm(e)}
                    onFocus={(e) => handleSelectFocus('workType', e)}
                  >
                    <option value="static">Static</option>
                    <option value="dynamic">Dynamic</option>
                  </CFormSelect>
                  <CFormFeedback invalid className="fieldError-cst">
                    {accountErrors.workType}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group account_fiscal_year">
                  <label className="control-label" htmlFor="account_fiscal_year">
                    Fiscal Year
                  </label>
                  <CFormSelect
                    className="form-control-cst"
                    name="fiscalYear"
                    id="account_fiscal_year"
                    value={accountData.fiscalYear}
                    invalid={accountErrors && !isEmpty(accountErrors.fiscalYear) ? true : false}
                    onChange={(e) => handleChangeForm(e)}
                    onFocus={(e) => handleSelectFocus('fiscalYear', e)}
                  >
                    <option value="2017">2017</option>
                    <option value="2018">2018</option>
                    <option value="2019">2019</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </CFormSelect>
                  <CFormFeedback invalid className="fieldError-cst">
                    {accountErrors.workType}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group account_status">
                  <label className="control-label" htmlFor="account_status">
                    Status
                  </label>
                  <CFormSelect
                    className="form-control-cst"
                    name="status"
                    id="account_status"
                    value={accountData.status}
                    invalid={accountErrors && !isEmpty(accountErrors.status) ? true : false}
                    onChange={(e) => handleChangeForm(e)}
                    onFocus={(e) => handleSelectFocus('status', e)}
                  >
                    <option value="active">Active</option>
                    <option value="passive">Passive</option>
                  </CFormSelect>
                  <CFormFeedback invalid className="fieldError-cst">
                    {accountErrors.status}
                  </CFormFeedback>
                </div>
              </div>
            </div>
            <div
              className="row mb-4"
              id="account_static_ids_input_div"
              style={{ display: accountData.workType === 'dynamic' ? 'none' : '' }}
            >
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="d-flex flex-column">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a href="#" onClick={(e) => handleAccountPlan(e)}>
                    Create Ledger Account
                  </a>
                  <div className="form-group">
                    <label className="control-label" htmlFor="account_ledger_account_id">
                      Ledger Account
                    </label>
                    <div className="input-group">
                      <Select
                        id="account_ledger_account_id"
                        classNamePrefix="cstSelect"
                        isClearable={true}
                        placeholder
                        isLoading={fetchingLedgerSubAcc ? true : false}
                        isSearchable
                        name="ledgerAccountId"
                        autoFocus={false}
                        options={
                          ledgerSubaccounts && !fetchingLedgerSubAcc && ledgerSubaccounts.length > 0
                            ? ledgerSubaccounts.map((itm) => ({
                                label: `${itm.code ? itm.code + ' - ' : ''} ${itm.name}`,
                                value: itm,
                              }))
                            : []
                        }
                        className={classNames('form-control form-control-cst pageCstSelect ', {
                          'is-invalid': accountErrors && !isEmpty(accountErrors.ledgerAccountId),
                        })}
                        noOptionsMessage={() => 'No results found'}
                        onChange={(e) => handleSelectForm('ledgerAccountId', e)}
                        onFocus={(e) => handleSelectFocus('ledgerAccountId', e)}
                      />
                      <CFormFeedback
                        invalid={
                          accountErrors && !isEmpty(accountErrors.ledgerAccountId) ? true : false
                        }
                        className="fieldError-cst"
                      >
                        {accountErrors.ledgerAccountId}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="d-flex flex-column">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a href="#" onClick={(e) => handleCreateProfitCenter(e)}>
                    Create Profit Center
                  </a>
                  <div className="form-group">
                    <label className="control-label " htmlFor="account_profit_center_id">
                      Cost Center
                    </label>
                    <div className="input-group">
                      <Select
                        id="account_profit_center_id"
                        classNamePrefix="cstSelect"
                        isClearable={true}
                        placeholder
                        isLoading={fetchingProfCentSubAcc ? true : false}
                        isSearchable
                        name="profitCenterId"
                        autoFocus={false}
                        options={
                          profitCenterSubaccounts &&
                          !fetchingProfCentSubAcc &&
                          profitCenterSubaccounts.length > 0
                            ? profitCenterSubaccounts.map((itm) => ({
                                label: `${itm.code ? itm.code + ' - ' : ''} ${itm.name}`,
                                value: itm,
                              }))
                            : []
                        }
                        className={classNames('form-control form-control-cst pageCstSelect ', {
                          'is-invalid': accountErrors && !isEmpty(accountErrors.profitCenterId),
                        })}
                        noOptionsMessage={() => 'No results found'}
                        onChange={(e) => handleSelectForm('profitCenterId', e)}
                        onFocus={(e) => handleSelectFocus('profitCenterId', e)}
                      />
                      <CFormFeedback
                        invalid={
                          accountErrors && !isEmpty(accountErrors.profitCenterId) ? true : false
                        }
                        className="fieldError-cst"
                      >
                        {accountErrors.profitCenterId}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="row mb-4"
              id="account_dynamic_codes_div"
              style={{ display: accountData.workType === 'static' ? 'none' : '' }}
            >
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group account_ledger_account_code">
                  <label className="control-label" htmlFor="account_ledger_account_code">
                    Ledger Account Code
                  </label>
                  <CFormInput
                    className="form-control-cst"
                    type="text"
                    name="ledgerAccountCode"
                    id="account_ledger_account_code"
                    value={accountData.ledgerAccountCode}
                    invalid={
                      accountErrors && !isEmpty(accountErrors.ledgerAccountCode) ? true : false
                    }
                    onChange={(e) => handleChangeForm(e)}
                    onFocus={(e) => handleSelectFocus('ledgerAccountCode', e)}
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {accountErrors.ledgerAccountId}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group account_profit_center_code">
                  <label className="control-label" htmlFor="account_profit_center_code">
                    Cost Center Code
                  </label>
                  <CFormInput
                    className="form-control-cst"
                    type="text"
                    name="profitCenterCode"
                    id="account_profit_center_code"
                    value={accountData.profitCenterCode}
                    invalid={
                      accountErrors && !isEmpty(accountErrors.profitCenterCode) ? true : false
                    }
                    onChange={(e) => handleChangeForm(e)}
                    onFocus={(e) => handleSelectFocus('profitCenterCode', e)}
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {accountErrors.profitCenterCode}
                  </CFormFeedback>
                </div>
              </div>
            </div>
            <div className="row pt-4 border-top">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <CButton type="submit" color="info" disabled={creatingAccount ? true : false}>
                  {creatingAccount ? (
                    'Processing...'
                  ) : (
                    <span>
                      Save <i className="fa fa-check"></i>
                    </span>
                  )}
                </CButton>
              </div>
            </div>
          </form>
        </div>
      </CCard>

      <CCard className="cardCustom gutter-b">
        <div className="card-header">
          <div className="card-title">
            <h6 className="card-label font-weight-bolder text-dark">
              Existing Ledger Integrations
            </h6>
          </div>
        </div>
        <div className="card-body">
          <div className="pageContainer-wrapper isTable" id="accounts_list">
            <Table columns={columns} data={data} />
          </div>
        </div>
      </CCard>
    </div>
  )
}

BankAccIntegration.propTypes = {
  accountInfo: PropTypes.object,
  handleAccountPlan: PropTypes.func,
  handleCreateProfitCenter: PropTypes.func,
}

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  setToggleTransPanel: PropTypes.func,
}

export default BankAccIntegration
