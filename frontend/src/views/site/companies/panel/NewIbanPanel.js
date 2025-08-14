import React, { useCallback, useMemo, useState } from 'react'
import {
  CButton,
  CCard,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CCardBody,
  CFormFeedback,
  CFormInput,
  CFormSelect,
  CPagination,
  CPaginationItem,
  CFormCheck,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { fetchCurrencies } from 'src/redux/slices/currencySlice'
import { clearIbanError, createIban, destroyIban, showIbanError } from 'src/redux/slices/ibanSlice'
import $ from 'jquery'
import PropTypes from 'prop-types'
import Noty from 'noty'
import { useTable, useFilters, useGlobalFilter, usePagination, useRowSelect } from 'react-table'
import loaderLg from 'src/assets/loader/loaderLg.gif'

const Table = ({ columns, data }) => {
  const { fetchingIban } = useSelector((state) => state.iban)

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
            {fetchingIban ? (
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
        {!fetchingIban && (
          <div className="table-page">
            {data.length > 0 && (
              <div>
                <span>
                  Showing page {pageIndex + 1} of {pageOptions.length} - {data.length}
                </span>
              </div>
            )}
            <div className="pagination">
              {data.length > 20 && (
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

const NewIbanPanel = ({ showCompany, closeIbanPanel }) => {
  const dispatch = useDispatch()
  const { creatingIban, ibanErrors } = useSelector((state) => state.iban)
  const { currencies, fetchingCurrencies } = useSelector((state) => state.currency)
  const [ibanData, setIbanData] = useState({
    ibanId: null,
    bankId: '',
    ibanNo: '',
    curr: '',
    isDefault: '0',
    bankName: '',
    bankCode: '',
    branchCode: '',
    customerCode: '',
    accountCode: '',
    swiftCode: '',
    idNumber: '',
    title: '',
  })
  const [showIbans, setShowIbans] = useState(showCompany.ibans.length > 0 ? showCompany.ibans : [])

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setIbanData({
      ...ibanData,
      [name]: value,
    })
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearIbanError({ type: c, errorType: 'errIban' }))

    if (c === 'curr') {
      if (isEmpty(currencies)) {
        dispatch(fetchCurrencies())
      }
    }
  }

  const clearIbanData = () => {
    setIbanData({
      bankId: '',
      ibanNo: '',
      curr: '',
      isDefault: '1',
      bankName: '',
      bankCode: '',
      branchCode: '',
      customerCode: '',
      accountCode: '',
      swiftCode: '',
      idNumber: '',
      title: '',
    })
  }

  const handleSubmitIban = async (e) => {
    e.preventDefault()
    const form = $('#new_iban')
    if (form.length > 0) {
      if (ibanData.ibanNo === '') {
        dispatch(showIbanError({ type: 'ibanNo', errorType: 'errIban' }))
        $('.pageContainer').animate({ scrollTop: 0 }, 300)
        return false
      }
    }
    // //form data
    let arrForm = Object.entries(ibanData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }
    formData.append('companyId', showCompany.id)
    const resData = await dispatch(createIban(formData)).unwrap()
    if (resData) {
      new Noty({
        type: 'alert',
        layout: 'topRight',
        id: `createItem${resData.id}`,
        text: 'IBAN has been created succesfully',
      }).show()
      clearIbanData()
      closeIbanPanel()
    }
  }

  const handleEditIban = useCallback((e, item) => {
    e.preventDefault()
    $('.dropdown-menu').removeClass('show')
    setIbanData({
      ibanId: item.id ? item.id : null,
      bankId: item.bankId ? item.bankId : '',
      ibanNo: item.ibanNo ? item.ibanNo : '',
      curr: item.curr ? item.curr.id : '',
      isDefault: item.isDefault ? item.isDefault : '0',
      bankName: item.bankName ? item.bankName : '',
      bankCode: item.bankCod ? item.bankCode : '',
      branchCode: item.branchCode ? item.branchCode : '',
      customerCode: item.customerCode ? item.customerCode : '',
      accountCode: item.accountCode ? item.accountCode : '',
      swiftCode: item.swiftCode ? item.swiftCode : '',
      idNumber: item.idNumber ? item.idNumber : '',
      title: item.title ? item.title : '',
    })
    $('#ibanPane').animate({ scrollTop: 0 }, 300)
  }, [])

  const handleDeleteIban = useCallback(
    (e, item) => {
      e.preventDefault()
      $('.dropdown-menu').removeClass('show')
      var n = new Noty({
        text: 'The record will be deleted, do you want to continue ?',
        layout: 'topCenter',
        progressBar: false,
        timeout: false,
        type: 'error',
        closeWith: 'button',
        buttons: [
          Noty.button(
            'Delete',
            'btn btn-default btn-sm del-bnt-mr text-danger float-right',
            async function () {
              const resData = await dispatch(destroyIban(item.id)).unwrap()
              if (resData) {
                setShowIbans(() => ({
                  showIbans: showIbans.filter((x) => x.id !== resData.id),
                }))

                // if (showIbans.length < 0) {
                //   changeIbans([])
                // }
                new Noty({
                  type: 'alert',
                  layout: 'topRight',
                  id: `succItm${resData.id}`,
                  text: 'IBAN has been deleted succesfully',
                }).show()
              }
              n.close()
            },
            { id: `deltItm${item.id}` },
          ),

          Noty.button('Cancel', 'btn btn-default btn-sm float-right', function () {
            n.close()
          }),
        ],
      })
      n.show()
    },
    [dispatch, showIbans],
  )

  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'actions',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row: { original } }) => (
          <div className="d-flex">
            <div className="table-action-dropdown">
              <CDropdown>
                <CDropdownToggle color="link">
                  <i className="fa fa-ellipsis-h"></i>
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem onClick={(e) => handleEditIban(e, original)}>
                    <i className="fa fa-edit mr-2" />
                    Edit
                  </CDropdownItem>
                  <CDropdownItem onClick={(e) => handleDeleteIban(e, original)}>
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
        Header: 'Bank',
        accessor: 'bankName',
      },
      {
        Header: <span>Iban Number</span>,
        accessor: 'ibanNo',
      },
      {
        Header: <span>Currency</span>,
        accessor: 'curr.name',
      },
    ],
    [handleEditIban, handleDeleteIban],
  )

  const data = useMemo(() => (showIbans && showIbans.length > 0 ? showIbans : []), [showIbans])

  return (
    <div className="slidePanel-inner-section">
      <CCard className="cardCustom gutter-b">
        <div className="card-header">
          <div className="card-title">
            <h6 className="card-label">Iban Information</h6>
          </div>
        </div>
        <CCardBody className="P-0">
          <form
            className="simple_form horizontal-form"
            id="new_iban"
            onSubmit={(e) => handleSubmitIban(e)}
          >
            <div className="d-flex flex-column">
              <div className="d-block">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                    <div className="form-group select optional iban_bank_id">
                      <label className="control-label select optional" htmlFor="iban_bank_id">
                        Bank
                      </label>
                      <CFormSelect
                        className="form-control-cst select"
                        name="bankId"
                        id="iban_bank_id"
                        value={ibanData.bankId}
                        onChange={(e) => handleChangeForm(e)}
                        invalid={ibanErrors && !isEmpty(ibanErrors.bankId) ? true : false}
                        onFocus={() => handleSelectFocus('bankId')}
                      >
                        <option value=""></option>
                      </CFormSelect>
                      <CFormFeedback invalid className="fieldError-cst">
                        {ibanErrors.bankId}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                    <div className="form-group iban_no">
                      <label className="control-label" htmlFor="iban_no">
                        Iban Number
                      </label>
                      <CFormInput
                        className="form-control-cst"
                        type="text"
                        name="ibanNo"
                        id="iban_no"
                        value={ibanData.ibanNo}
                        onChange={(e) => handleChangeForm(e)}
                        invalid={ibanErrors && !isEmpty(ibanErrors.ibanNo) ? true : false}
                        onFocus={() => handleSelectFocus('ibanNo')}
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {ibanErrors.ibanNo}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-4 col-lg-2 col-xl-2">
                    <div className="form-group select optional iban_curr">
                      <label className="control-label select optional" htmlFor="iban_curr">
                        Currency
                      </label>
                      <CFormSelect
                        className="form-control-cst select optional"
                        name="curr"
                        id="iban_curr"
                        value={ibanData.curr}
                        onChange={(e) => handleChangeForm(e)}
                        invalid={ibanErrors && !isEmpty(ibanErrors.curr) ? true : false}
                        onFocus={() => handleSelectFocus('curr')}
                      >
                        <option value=""></option>
                        {!fetchingCurrencies ? (
                          currencies && currencies.length > 0 ? (
                            <>
                              {currencies.map((itm) => (
                                <option key={itm.id} value={itm.id}>
                                  {itm.name}
                                </option>
                              ))}
                            </>
                          ) : (
                            <option disabled>No results found.</option>
                          )
                        ) : (
                          <option disabled>Loading...</option>
                        )}
                      </CFormSelect>
                      <CFormFeedback invalid className="fieldError-cst">
                        {ibanErrors.curr}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-4 col-lg-2 col-xl-2">
                    <div className="form-group boolean optional iban_is_default">
                      <label className="boolean optional" htmlFor="iban_is_default">
                        Default
                      </label>
                      <div className="checkbox-custom checkbox-primary">
                        <CFormCheck
                          className="boolean optional"
                          type="checkbox"
                          name="iban[is_default]"
                          id="iban_is_default"
                          value={ibanData.isDefault}
                          checked={ibanData.isDefault === '1' ? true : false}
                          onChange={(e) => handleChangeForm(e)}
                        />
                        <CFormFeedback
                          invalid={ibanErrors && !isEmpty(ibanErrors.isDefault) ? true : false}
                          className="fieldError-cst"
                        >
                          {ibanErrors.isDefault}
                        </CFormFeedback>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                    <div className="form-group iban_bank_name">
                      <label className="control-label" htmlFor="iban_bank_name">
                        Bank Name
                      </label>
                      <CFormInput
                        className="form-control-cst"
                        type="text"
                        name="bankName"
                        id="iban_bank_name"
                        value={ibanData.bankName}
                        onChange={(e) => handleChangeForm(e)}
                        invalid={ibanErrors && !isEmpty(ibanErrors.bankName) ? true : false}
                        onFocus={() => handleSelectFocus('bankName')}
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {ibanErrors.bankName}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                    <div className="form-group iban_bank_code">
                      <label className="control-label" htmlFor="iban_bank_code">
                        Bank Code
                      </label>
                      <CFormInput
                        className="form-control-cst"
                        type="text"
                        name="bankCode"
                        id="iban_bank_code"
                        value={ibanData.bankCode}
                        onChange={(e) => handleChangeForm(e)}
                        invalid={ibanErrors && !isEmpty(ibanErrors.bankCode) ? true : false}
                        onFocus={() => handleSelectFocus('bankCode')}
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {ibanErrors.bankCode}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                    <div className="form-group iban_branch_code">
                      <label className="control-label" htmlFor="iban_branch_code">
                        Branch Code
                      </label>
                      <CFormInput
                        className="form-control-cst"
                        type="text"
                        name="branchCode"
                        id="iban_branch_code"
                        value={ibanData.branchCode}
                        onChange={(e) => handleChangeForm(e)}
                        invalid={ibanErrors && !isEmpty(ibanErrors.branchCode) ? true : false}
                        onFocus={() => handleSelectFocus('branchCode')}
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {ibanErrors.branchCode}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                    <div className="form-group iban_customer_code">
                      <label className="control-label" htmlFor="iban_customer_code">
                        Customer Code
                      </label>
                      <CFormInput
                        className="form-control-cst"
                        type="text"
                        name="customerCode"
                        id="iban_customer_code"
                        value={ibanData.customerCode}
                        onChange={(e) => handleChangeForm(e)}
                        invalid={ibanErrors && !isEmpty(ibanErrors.customerCode) ? true : false}
                        onFocus={() =>
                          dispatch(
                            clearIbanError({
                              type: 'customerCode',
                              errorType: 'errIban',
                            }),
                          )
                        }
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {ibanErrors.customerCode}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                    <div className="form-group iban_account_code">
                      <label className="control-label" htmlFor="iban_account_code">
                        Account Code
                      </label>
                      <CFormInput
                        className="form-control-cst"
                        type="text"
                        name="accountCode"
                        id="iban_account_code"
                        value={ibanData.accountCode}
                        onChange={(e) => handleChangeForm(e)}
                        invalid={ibanErrors && !isEmpty(ibanErrors.accountCode) ? true : false}
                        onFocus={() => handleSelectFocus('accountCode')}
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {ibanErrors.accountCode}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                    <div className="form-group iban_swift_code">
                      <label className="control-label" htmlFor="iban_swift_code">
                        Swift Code
                      </label>
                      <CFormInput
                        className="form-control-cst"
                        type="text"
                        name="swiftCode"
                        id="iban_swift_code"
                        value={ibanData.swiftCode}
                        onChange={(e) => handleChangeForm(e)}
                        invalid={ibanErrors && !isEmpty(ibanErrors.swiftCode) ? true : false}
                        onFocus={() => handleSelectFocus('swiftCode')}
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {ibanErrors.swiftCode}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                    <div className="form-group iban_id_number">
                      <label className="control-label" htmlFor="iban_id_number">
                        Identification Number
                      </label>
                      <CFormInput
                        className="form-control-cst"
                        type="text"
                        name="idNumber"
                        id="iban_id_number"
                        value={ibanData.idNumber}
                        onChange={(e) => handleChangeForm(e)}
                        invalid={ibanErrors && !isEmpty(ibanErrors.idNumber) ? true : false}
                        onFocus={() => handleSelectFocus('idNumber')}
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {ibanErrors.idNumber}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                    <div className="form-group iban_title">
                      <label className="control-label" htmlFor="iban_title">
                        Title
                      </label>
                      <CFormInput
                        className="form-control-cst"
                        type="text"
                        name="title"
                        id="iban_title"
                        value={ibanData.title}
                        onChange={(e) => handleChangeForm(e)}
                        invalid={ibanErrors && !isEmpty(ibanErrors.title) ? true : false}
                        onFocus={() => handleSelectFocus('title')}
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {ibanErrors.title}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-block border-top pt-6">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <CButton color="success" type="submit" disabled={creatingIban ? true : false}>
                      {creatingIban ? (
                        'Processing...'
                      ) : (
                        <span>
                          Save <i className="fa fa-check"></i>
                        </span>
                      )}
                    </CButton>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CCardBody>
      </CCard>

      <CCard className="cardCustom gutter-b">
        <div className="card-header">
          <div className="card-title">
            <h6 className="card-label">Registered Accounts</h6>
          </div>
        </div>
        <div className="card-body">
          <div className="pageContainer-wrapper isTable" id="ibans_list_div">
            <Table columns={columns} data={data} />
          </div>
        </div>
      </CCard>
    </div>
  )
}

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
}

NewIbanPanel.propTypes = {
  showCompany: PropTypes.object,
  closeIbanPanel: PropTypes.func,
}

export default NewIbanPanel
