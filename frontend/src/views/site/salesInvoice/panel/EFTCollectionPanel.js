import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CFormCheck,
  CFormFeedback,
  CFormInput,
  CFormSelect,
  CFormTextarea,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { nanoid } from 'nanoid'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import classNames from 'classnames'
import { isEmpty, isNull, toUpper } from 'lodash'
import { searchAccounts } from 'src/redux/slices/accountSlice'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { fetchBranches } from 'src/redux/slices/branchSlice'
import { fetchCompanies } from 'src/redux/slices/companySlice'
import { fetchCurrencies } from 'src/redux/slices/currencySlice'
import { fetchProfitCenters } from 'src/redux/slices/profitCenterSlice'
import {
  clearFindocError,
  // clearSearchFindoc,
  createFindoc,
  searchFindocs,
  showFindocError,
} from 'src/redux/slices/findocSlice'
import $ from 'jquery'
import Noty from 'noty'

const EFTCollectionPanel = ({ itemInfo, closeEftCollectionModal }) => {
  const dispatch = useDispatch()
  const { authUser } = useSelector((state) => state.auth)
  const { creatingFindoc, findocErrors } = useSelector((state) => state.findoc)
  const { profitCenters, fetchingProfitCenters } = useSelector((state) => state.profitCenter)
  const { currencies, fetchingCurrencies } = useSelector((state) => state.currency)
  const { branches, fetchingBranches } = useSelector((state) => state.branch)
  const { operations, fetchingOperations } = useSelector((state) => state.operation)
  const [findocData, setFindocData] = useState({
    accountId: '',
    docDate: `${moment().format('YYYY-MM-DD HH:mm:ss')}`,
    docType: 'eft_collection',
    branchId: `${authUser && authUser.branch && authUser.branch.id}`,
    code: '',
    findocCurr: '',
    accountType: 'bank_account',
    currRate: '1.0',
    credit: '',
    transferCurrRate: '',
    currType: '',
    relatedAccountType: '',
    relatedAccountId: '',
    operationId: '2222',
    profitCenterId: '',
    notes: `${itemInfo.invoicedCompany && itemInfo.invoicedCompany.name} ${
      itemInfo.invoiceName && toUpper(itemInfo.invoiceName)
    }  payment`,
    findocConfirm: '0',
    findocAccounted: '0',
    transferAmount: '',
    debitCredit: 'debit',
  })
  const [findocLines, setFindoclines] = useState([
    {
      id: nanoid(10),
      accountType: 'company',
      itmAccountId: '',
      itmAccountName: '',

      itmProfitCenterId: '',
      notes: '',
      credit: '0.00',
      creditDoc: '0.00',
    },
    {
      id: nanoid(10),
      accountType: 'company',
      itmAccountId: '',
      itmAccountName: '',

      itmProfitCenterId: '',
      notes: '',
      credit: '0.00',
      creditDoc: '0.00',
    },
    {
      id: nanoid(10),
      accountType: 'company',
      itmAccountId: '',
      itmAccountName: '',
      itmProfitCenterId: '',
      notes: '',
      credit: '0.00',
      creditDoc: '0.00',
    },
  ])
  const { companies } = useSelector((state) => state.company)
  const { queryAccounts, queryingAcc } = useSelector((state) => state.account)
  const [loadDateTime, setLoadDateTime] = useState({
    docDate: new Date(),
    dueDate: '',
  })
  const [accountType, setAccountType] = useState('company')
  const [disabledFields, setDisbledFields] = useState([])
  const { creditAccounts, searchingFindoc } = useSelector((state) => state.findoc)

  const handleChangeForm = (e) => {
    const { name, value } = e.target

    setFindocData({
      ...findocData,
      [name]: value,
    })
  }

  const handleCheckedForm = (e) => {
    const { name, checked } = e.target
    if (checked) {
      setFindocData({
        ...findocData,
        [name]: 1,
      })
    } else if (!checked) {
      setFindocData({
        ...findocData,
        [name]: 0,
      })
    }
  }

  const handleDateTime = (c, date) => {
    setLoadDateTime((state) => ({ ...state, [c]: date }))
    const e = {
      target: {
        name: c,
        value: !isNull(date) ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '',
      },
    }
    handleChangeForm(e)
  }

  const handleFindocChange = (e, itemId) => {
    const { name, value } = e.target
    setFindoclines((state) =>
      state.map((x) =>
        x.id === itemId
          ? {
              ...x,
              [name]: value,
            }
          : x,
      ),
    )
  }

  const handleSelectForm = (c, val, itemId) => {
    if (c === 'accountType') {
      setAccountType(!isNull(val) ? val.value : 'company')
      const e = { target: { name: c, value: !isNull(val) ? val.value.id : '' } }
      handleFindocChange(e, itemId)
    } else {
      const e = { target: { name: c, value: !isNull(val) ? val.value : '' } }
      handleFindocChange(e, itemId)
    }
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearFindocError({ type: c, errorType: 'errFindoc' }))

    if (c === 'itmAccountId') {
      // dispatch(clearSearchFindoc())
      if (isEmpty(creditAccounts)) {
        dispatch(searchFindocs({ accountType }))
      }
    } else if (c === 'accountId') {
      if (isEmpty(queryAccounts)) {
        dispatch(searchAccounts({ parentType: 'bank_account' }))
      }
      if (isEmpty(companies)) {
        dispatch(fetchCompanies())
      }
    } else if (c === 'branchId') {
      if (isEmpty(branches)) {
        dispatch(fetchBranches())
      }
    } else if (c === 'findocCurr') {
      if (isEmpty(currencies)) {
        dispatch(fetchCurrencies())
      }
    } else if (c === 'profitCenterId') {
      if (isEmpty(profitCenters)) {
        dispatch(fetchProfitCenters())
      }
    }
  }

  const handleSelectFindoc = (c, val) => {
    if (c === 'accountId') {
      setFindoclines((state) =>
        state.map((x) => ({
          ...x,
          notes: !isNull(val) ? val.value.parent && val.value.parent.title : '',
        })),
      )

      const e = {
        target: {
          name: c,
          value: !isNull(val) ? val.value.id : '',
        },
      }
      handleChangeForm(e)
    } else {
      const e = {
        target: {
          name: c,
          value: !isNull(val) ? val.value.id : '',
        },
      }
      handleChangeForm(e)
    }
  }

  const handleAddNewRecord = (e) => {
    e.preventDefault()
  }

  const removeInvItem = (e, item) => {
    e.preventDefault()
    $(`.remove-doc-line_${item.id}`).css('display', 'none')
    $(`.recover-doc-line_${item.id}`).css('display', 'block')

    setDisbledFields([...disabledFields, { id: item.id }])
    setFindoclines((state) =>
      state.map((x) =>
        x.id === item.id
          ? {
              ...x,
              itmAccountId: '',
              itmAccountName: '',
              itmProfitCenterId: '',
            }
          : x,
      ),
    )
  }

  const recoverInvItem = (e, item) => {
    e.preventDefault()
    $(`.remove-doc-line_${item.id}`).css('display', 'block')
    $(`.recover-doc-line_${item.id}`).css('display', 'none')

    const items = disabledFields.filter((x) => x.id !== item.id)
    setDisbledFields(items)
  }

  const addFindocLines = (e) => {
    e.preventDefault()
    setFindoclines((state) => [
      ...state,
      {
        id: nanoid(10),
        accountType: 'company',
        itmAccountId: '',
        itmAccountName: '',
        itmProfitCenterId: '',
        notes: '',
        credit: '0.00',
        creditDoc: '0.00',
      },
    ])
  }

  const clearFindocData = () => {
    setFindocData({
      accountId: '',
      docDate: `${moment().format('YYYY-MM-DD HH:mm:ss')}`,
      docType: 'eft_collection',
      branchId: `${authUser && authUser.branch && authUser.branch.id}`,
      code: '',
      findocCurr: '',
      accountType: 'bank_account',
      currRate: '1.0',
      credit: '',
      transferCurrRate: '',
      currType: '',
      relatedAccountType: '',
      relatedAccountId: '',
      operationId: '2222',
      profitCenterId: '',
      notes: `${itemInfo.invoicedCompany && itemInfo.invoicedCompany.name} ${
        itemInfo.invoiceName && toUpper(itemInfo.invoiceName)
      }  payment`,
      findocConfirm: '0',
      findocAccounted: '0',
      transferAmount: '',
      debitCredit: 'debit',
    })
  }

  const handleSubmitEftCol = async (e) => {
    e.preventDefault()
    const form = $('#new_findoc')
    if (form.length > 0) {
      if (findocData.accountId === '') {
        dispatch(showFindocError({ type: 'accountId', errorType: 'errFindoc' }))
        $('html,body').animate({ scrollTop: 0 }, 300)
        return false
      }
    }
    //form data
    let arrForm = Object.entries(findocData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }
    formData.append('findocItems', JSON.stringify(findocLines))

    const resData = await dispatch(createFindoc(formData)).unwrap()
    if (resData) {
      new Noty({
        type: 'alert',
        layout: 'topRight',
        id: `succ${resData.id}`,
        text: 'Payment has been created succesfully',
      }).show()
      clearFindocData()
      closeEftCollectionModal()
    }
  }

  useEffect(() => {
    if (itemInfo) {
      setFindoclines((state) =>
        state.map((x, idx) =>
          idx === 0
            ? {
                ...x,
                credit: !isNull(itemInfo) ? itemInfo.netTotal : '0.00',
                creditDoc: !isNull(itemInfo) ? itemInfo.netTotal : '0.00',
              }
            : x,
        ),
      )
    }
  }, [itemInfo])

  return (
    <div className="pageContainer-wrapper">
      <div className="pageBoxSizing-container">
        <CCard className="cardCustom gutter-b">
          <div className="card-body">
            <form
              className="simple_form horizontal-form"
              id="new_findoc"
              onSubmit={(e) => handleSubmitEftCol(e)}
            >
              <div className="d-flex flex-column">
                <div className="row">
                  <div className="col-12 col-sm-6 col-md-4 col-lg-6 col-xl-6">
                    <div className="form-group">
                      <label className="control-label" htmlFor="findoc_account_id">
                        Debit Account
                      </label>
                      <div>
                        <div className="input-group">
                          <Select
                            className={classNames('form-control form-control-cst pageCstSelect ', {
                              'is-invalid': findocErrors && !isEmpty(findocErrors.accountId),
                            })}
                            classNamePrefix="cstSelect"
                            isClearable
                            placeholder
                            isSearchable
                            id="findoc_account_id"
                            onChange={(e) => handleSelectFindoc('accountId', e)}
                            options={
                              queryAccounts && queryAccounts.length > 0
                                ? queryAccounts.map((item) => ({
                                    value: item,
                                    label: item.name,
                                  }))
                                : []
                            }
                            isLoading={queryingAcc ? true : false}
                            noOptionsMessage={() => 'No results found'}
                            onMenuOpen={() => handleSelectFocus('accountId')}
                          />
                          <CFormFeedback
                            invalid={
                              findocErrors && !isEmpty(findocErrors.accountId) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {findocErrors.accountId}
                          </CFormFeedback>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                    <div className="form-group date_picker findoc_doc_date">
                      <label className="control-label date_picker" htmlFor="findoc_doc_date">
                        Document Date
                      </label>
                      <DatePicker
                        id="findoc_doc_date"
                        selected={loadDateTime.docDate}
                        onChange={(date) => handleDateTime('docDate', date)}
                        className={classNames('form-control form-control-cst ', {
                          'is-invalid': findocErrors && !isEmpty(findocErrors.docDate),
                        })}
                        style={{ paddingLeft: '2px', paddingRight: '2px' }}
                        dateFormat="yyyy-MM-dd"
                        onFocus={() => handleSelectFocus('docDate')}
                      />
                      <CFormFeedback
                        invalid
                        className={classNames('fieldError-cst ', {
                          'd-block': findocErrors && !isEmpty(findocErrors.docDate),
                        })}
                      >
                        {findocErrors.docDate}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                    <div className="form-group date_picker findoc_due_date">
                      <label className="control-label date_picker" htmlFor="findoc_due_date">
                        Due Date
                      </label>
                      <DatePicker
                        id="findoc_due_date"
                        selected={loadDateTime.dueDate}
                        onChange={(date) => handleDateTime('dueDate', date)}
                        className={classNames('form-control form-control-cst ', {
                          'is-invalid': findocErrors && !isEmpty(findocErrors.dueDate),
                        })}
                        style={{ paddingLeft: '2px', paddingRight: '2px' }}
                        dateFormat="yyyy-MM-dd"
                        onFocus={() => handleSelectFocus('dueDate')}
                      />
                      <CFormFeedback
                        invalid
                        className={classNames('fieldError-cst ', {
                          'd-block': findocErrors && !isEmpty(findocErrors.docDate),
                        })}
                      >
                        {findocErrors.dueDate}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                    <div className="form-group select findoc_branch_id">
                      <label className="control-label select" htmlFor="findoc_branch_id">
                        Branch
                      </label>
                      <CFormSelect
                        className="form-control-cst select"
                        name="branchId"
                        id="findoc_branch_id"
                        value={findocData.branchId}
                        invalid={findocErrors && !isEmpty(findocErrors.branchId) ? true : false}
                        onChange={(e) => handleChangeForm(e)}
                        onFocus={(e) => handleSelectFocus('branchId', e)}
                      >
                        <option value=""></option>
                        {!fetchingBranches ? (
                          branches && branches.length > 0 ? (
                            <>
                              {branches.map((itm, i) => (
                                <option key={i} value={itm.id}>
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
                        {findocErrors.branchId}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                    <div className="form-group findoc_code">
                      <label className="control-label" htmlFor="findoc_code">
                        Reference No
                      </label>
                      <CFormInput
                        className="form-control-cst"
                        type="text"
                        name="code"
                        id="findoc_code"
                        value={findocData.code}
                        invalid={findocErrors && !isEmpty(findocErrors.code) ? true : false}
                        onChange={(e) => handleChangeForm(e)}
                        onFocus={(e) => handleSelectFocus('code', e)}
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {findocErrors.code}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                    <div className="form-group select findoc_curr_type">
                      <label className="control-label select" htmlFor="findoc_curr_type">
                        Currency Type
                      </label>
                      <CFormSelect
                        className="form-control-cst select doc-curr-type"
                        name="currType"
                        id="findoc_curr_type"
                        value={findocData.currType}
                        invalid={findocErrors && !isEmpty(findocErrors.currType) ? true : false}
                        onChange={(e) => handleChangeForm(e)}
                        onFocus={(e) => handleSelectFocus('currType', e)}
                      >
                        <option value=""></option>
                        <option value="buying">Buying</option>
                        <option value="selling">Selling</option>
                        <option value="banknote_buying">Banknote Buying</option>
                        <option value="banknote_selling">Banknote Selling</option>
                      </CFormSelect>
                      <CFormFeedback invalid className="fieldError-cst">
                        {findocErrors.currType}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                    <div className="form-group select findoc_curr">
                      <label className="control-label select" htmlFor="findoc_curr">
                        Currency
                      </label>
                      <CFormSelect
                        className="form-control-cst select doc-curr"
                        name="findocCurr"
                        id="findoc_curr"
                        value={findocData.findocCurr}
                        invalid={findocErrors && !isEmpty(findocErrors.findocCurr) ? true : false}
                        onChange={(e) => handleChangeForm(e)}
                        onFocus={(e) => handleSelectFocus('findocCurr', e)}
                      >
                        <option value=""></option>
                        {!fetchingCurrencies ? (
                          currencies && currencies.length > 0 ? (
                            currencies.map((itm) => (
                              <option key={itm.id} value={itm.id}>
                                {itm.name}
                              </option>
                            ))
                          ) : (
                            <option disabled>No results found.</option>
                          )
                        ) : (
                          <option disabled>Loading...</option>
                        )}
                      </CFormSelect>
                      <CFormFeedback invalid className="fieldError-cst">
                        {findocErrors.findocCurr}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                    <div className="form-group decimal findoc_curr_rate">
                      <label className="control-label decimal" htmlFor="findoc_curr_rate">
                        Currency
                      </label>
                      <CFormInput
                        className="form-control-cst text-right"
                        type="number"
                        step="any"
                        name="currRate"
                        id="findoc_curr_rate"
                        value={findocData.currRate}
                        invalid={findocErrors && !isEmpty(findocErrors.currRate) ? true : false}
                        onChange={(e) => handleChangeForm(e)}
                        onFocus={(e) => handleSelectFocus('currRate', e)}
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {findocErrors.currRate}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                    <div className="form-group select findoc_operation_id">
                      <label className="control-label select" htmlFor="findoc_operation_id">
                        Operation
                      </label>
                      <CFormSelect
                        className="form-control-cst select"
                        name="operationId"
                        id="findoc_operation_id"
                        value={findocData.operationId}
                        invalid={findocErrors && !isEmpty(findocErrors.operationId) ? true : false}
                        onChange={(e) => handleChangeForm(e)}
                        onFocus={(e) => handleSelectFocus('operationId', e)}
                      >
                        <option value=""></option>
                        {!fetchingOperations ? (
                          operations && operations.length > 0 ? (
                            <>
                              {operations.map((itm, i) => (
                                <option key={i} value={itm.id}>
                                  {itm.name}
                                </option>
                              ))}
                            </>
                          ) : (
                            <option disabled>No results found.</option>
                          )
                        ) : (
                          <option>Loading...</option>
                        )}
                      </CFormSelect>
                      <CFormFeedback invalid className="fieldError-cst">
                        {findocErrors.operationId}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                    <div className="form-group profit_center findoc_profit_center_id">
                      <label
                        className="control-label profit_center"
                        htmlFor="findoc_profit_center_id"
                      >
                        Profit Center
                      </label>
                      <div className="input-group">
                        <Select
                          className={classNames('form-control form-control-cst pageCstSelect ', {
                            'is-invalid': findocErrors && !isEmpty(findocErrors.profitCenterId),
                          })}
                          classNamePrefix="cstSelect"
                          isClearable
                          placeholder
                          isSearchable
                          id="findoc_profit_center_id"
                          menuPlacement="auto"
                          onChange={(e) => handleSelectFindoc('profitCenterId', e)}
                          options={
                            profitCenters && profitCenters.length > 0
                              ? profitCenters.map((item) => ({
                                  value: item.id,
                                  label: item.name,
                                }))
                              : []
                          }
                          isLoading={fetchingProfitCenters ? true : false}
                          noOptionsMessage={() => 'No results found'}
                          onMenuOpen={() => handleSelectFocus('profitCenterId')}
                        />
                        <CFormFeedback
                          invalid={
                            findocErrors && !isEmpty(findocErrors.profitCenterId) ? true : false
                          }
                          className="fieldError-cst"
                        >
                          {findocErrors.profitCenterId}
                        </CFormFeedback>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-6 col-md-4 col-lg-6 col-xl-6">
                    <div className="form-group text findoc_notes">
                      <label className="control-label text" htmlFor="findoc_notes">
                        Notes
                      </label>
                      <CFormTextarea
                        className="form-control-cst text"
                        rows="1"
                        name="notes"
                        id="findoc_notes"
                        value={findocData.notes}
                        invalid={findocErrors && !isEmpty(findocErrors.notes) ? true : false}
                        onChange={(e) => handleChangeForm(e)}
                        onFocus={(e) => handleSelectFocus('notes', e)}
                      ></CFormTextarea>
                      <CFormFeedback invalid className="fieldError-cst">
                        {findocErrors.notes}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-4 col-lg-6 col-xl-6"></div>
                </div>
                <div className="separator"></div>
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="table-truncate">
                      <table className="table table-sm table-vertical-center table-borderless">
                        <thead>
                          <tr className="findoc-line-th">
                            <th className="col-2 col-xs-3 col-sm-3 col-md-3 col-lg-2 col-xl-2">
                              Account Type
                            </th>
                            <th
                              className="col-2 col-xs-3 col-sm-3 col-md-3 col-lg-2 col-xl-2"
                              style={{ marginLeft: '2px' }}
                            >
                              Credit Account
                            </th>
                            <th
                              className="col-2 col-xs-3 col-sm-3 col-md-3 col-lg-2 col-xl-2"
                              style={{ marginLeft: '2px' }}
                            >
                              Profit Center
                            </th>
                            <th
                              className="col-2 col-xs-3 col-sm-3 col-md-3 col-lg-2 col-xl-2"
                              style={{ marginLeft: '2px' }}
                            >
                              Notes
                            </th>
                            <th
                              className="col-2 col-xs-3 col-sm-3 col-md-3 col-lg-2 col-xl-2"
                              style={{ marginLeft: '2px' }}
                            >
                              Amount
                            </th>
                            <th
                              className="col-2 col-xs-3 col-sm-3 col-md-3 col-lg-2 col-xl-2"
                              style={{ marginLeft: '2px' }}
                            >
                              Total Amount
                            </th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {findocLines.length > 0 &&
                            findocLines.map((item, idx) => (
                              <tr key={item.id} className="findoc-line-eft">
                                <td className="col-2">
                                  <div className="form-group">
                                    <div className="input-group">
                                      <Select
                                        className={classNames(
                                          `form-control form-control-cst pageCstSelect lines errId_${item.id}`,
                                          {
                                            'is-invalid':
                                              findocErrors.findocItemErrors &&
                                              findocErrors.findocItemErrors.some(
                                                (x) => x['account_type_' + item.id],
                                              ) &&
                                              true,
                                          },
                                        )}
                                        classNamePrefix="cstSelect"
                                        isClearable
                                        placeholder
                                        isSearchable
                                        id={`account_type_${idx}_account_type`}
                                        menuPlacement="auto"
                                        onChange={(e) =>
                                          handleSelectForm('accountType', e, item.id)
                                        }
                                        defaultValue={{
                                          label: 'Company',
                                          value: 'company',
                                        }}
                                        options={[
                                          {
                                            label: 'Company',
                                            value: 'company',
                                          },
                                          {
                                            label: ' Ledger Account',
                                            value: 'ledger_account',
                                          },
                                          {
                                            label: 'Bank Account',
                                            value: 'bank_account',
                                          },
                                          {
                                            label: 'Cash Account',
                                            value: 'cash_point',
                                          },
                                          {
                                            label: 'Credit Card',
                                            value: 'credit_card',
                                          },
                                          {
                                            label: 'Employee',
                                            value: 'employee',
                                          },
                                          {
                                            label: 'Driver',
                                            value: 'driver',
                                          },
                                        ]}
                                        isDisabled={
                                          disabledFields.some((x) => x.id === item.id) && true
                                            ? true
                                            : false
                                        }
                                        noOptionsMessage={() => 'No results found'}
                                        onMenuOpen={() => handleSelectFocus('accountType')}
                                      />
                                      <CFormFeedback
                                        id={`errId_${item.id}`}
                                        invalid
                                        className="fieldError-cst pt-1"
                                      ></CFormFeedback>
                                    </div>
                                  </div>
                                </td>
                                <td className="col-2">
                                  <div className="form-group">
                                    <div className="input-group">
                                      <Select
                                        className={classNames(
                                          `form-control form-control-cst pageCstSelect lines errId_${item.id}`,
                                          {
                                            'is-invalid':
                                              findocErrors.findocItemErrors &&
                                              findocErrors.findocItemErrors.some(
                                                (x) => x['account_id_' + item.id],
                                              ) &&
                                              true,
                                          },
                                        )}
                                        classNamePrefix="cstSelect"
                                        isClearable
                                        placeholder
                                        isSearchable
                                        // value={
                                        //   item.accountType !== ''
                                        //     ? {
                                        //         label: item.itmAccountName,
                                        //         value: item.itmAccountId,
                                        //       }
                                        //     : null
                                        // }
                                        id={`findoclines_attributes_${idx}_account_id`}
                                        options={
                                          creditAccounts &&
                                          !searchingFindoc &&
                                          creditAccounts.length > 0
                                            ? creditAccounts.map((item) => ({
                                                value: item.id,
                                                label: item.name,
                                              }))
                                            : []
                                        }
                                        isDisabled={
                                          disabledFields.some((x) => x.id === item.id) && true
                                            ? true
                                            : false
                                        }
                                        noOptionsMessage={() => 'No results found'}
                                        isLoading={searchingFindoc ? true : false}
                                        onChange={(e) =>
                                          handleSelectForm('itmAccountId', e, item.id)
                                        }
                                        onMenuOpen={(e) => handleSelectFocus('itmAccountId', e)}
                                      />
                                      <CFormFeedback
                                        id={`errId_${item.id}`}
                                        invalid
                                        className="fieldError-cst pt-1"
                                      ></CFormFeedback>
                                    </div>
                                  </div>
                                </td>
                                <td className="col-2">
                                  <div className="form-group profit_center">
                                    <div>
                                      <div className="input-group">
                                        <Select
                                          className={classNames(
                                            `form-control form-control-cst pageCstSelect lines errId_${item.id}`,
                                            {
                                              'is-invalid':
                                                findocErrors.findocItemErrors &&
                                                findocErrors.findocItemErrors.some(
                                                  (x) => x['profit_center_id_' + item.id],
                                                ) &&
                                                true,
                                            },
                                          )}
                                          classNamePrefix="cstSelect"
                                          isClearable
                                          placeholder
                                          isSearchable
                                          id={`findoclines_attributes_${idx}_profit_center_id`}
                                          menuPlacement="auto"
                                          options={
                                            profitCenters && profitCenters.length > 0
                                              ? profitCenters.map((item) => ({
                                                  value: item.id,
                                                  label: item.name,
                                                }))
                                              : []
                                          }
                                          isDisabled={
                                            disabledFields.some((x) => x.id === item.id) && true
                                              ? true
                                              : false
                                          }
                                          noOptionsMessage={() => 'No results found'}
                                          isLoading={fetchingProfitCenters ? true : false}
                                          onChange={(e) =>
                                            handleSelectForm('itmProfitCenterId', e, item.id)
                                          }
                                          onMenuOpen={(e) =>
                                            handleSelectFocus('itmProfitCenterId', e)
                                          }
                                        />
                                        <CFormFeedback
                                          id={`errId_${item.id}`}
                                          invalid
                                          className="fieldError-cst pt-1"
                                        ></CFormFeedback>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="col-2">
                                  <div className="form-group decimal invoice_involines_unit_number">
                                    <CFormTextarea
                                      className={`form-control-cst lines errId_${item.id}`}
                                      rows="1"
                                      name="notes"
                                      id={`findoclines_attributes_${idx}_notes`}
                                      value={item.notes}
                                      style={{ maxHeight: '200px' }}
                                      onChange={(e) => handleFindocChange(e, item.id)}
                                      invalid={
                                        findocErrors.invoiceItemsErrors &&
                                        findocErrors.invoiceItemsErrors.some(
                                          (x) => x.id === item.id,
                                        ) &&
                                        true
                                          ? true
                                          : false
                                      }
                                      disabled={
                                        disabledFields.some((x) => x.id === item.id) && true
                                          ? true
                                          : false
                                      }
                                    />
                                    <CFormFeedback
                                      id={`errId_${item.id}`}
                                      invalid
                                      className="fieldError-cst pt-1"
                                    ></CFormFeedback>
                                  </div>
                                </td>
                                <td className="col-2 ">
                                  <div className="form-group">
                                    <CFormInput
                                      className={`form-control-cst lines errId_${item.id}`}
                                      style={{ textAlign: 'right' }}
                                      type="number"
                                      step="any"
                                      id={`findoclines_attributes_${idx}_credit`}
                                      name="credit"
                                      value={item.credit}
                                      onChange={(e) => handleFindocChange(e, item.id)}
                                      invalid={
                                        findocErrors.invoiceItemsErrors &&
                                        findocErrors.invoiceItemsErrors.some(
                                          (x) => x.id === item.id,
                                        ) &&
                                        true
                                          ? true
                                          : false
                                      }
                                      disabled={
                                        disabledFields.some((x) => x.id === item.id) && true
                                          ? true
                                          : false
                                      }
                                    />
                                    <CFormFeedback
                                      id={`errId_${item.id}`}
                                      invalid={
                                        findocErrors.invoiceItemsErrors &&
                                        findocErrors.invoiceItemsErrors.some(
                                          (x) => x.id === item.id,
                                        ) &&
                                        true
                                          ? true
                                          : false
                                      }
                                      className="fieldError-cst pt-1"
                                    >
                                      {findocErrors.invoiceItemsErrors &&
                                      findocErrors.invoiceItemsErrors.some(
                                        (x) => x.id === item.id,
                                      ) &&
                                      true
                                        ? 'Must be greater than 0.'
                                        : ''}
                                    </CFormFeedback>
                                  </div>
                                </td>
                                <td className="col-2 ">
                                  <div className="form-group">
                                    <CFormInput
                                      className={`form-control-cst lines errId_${item.id}`}
                                      style={{ textAlign: 'right' }}
                                      type="number"
                                      step="any"
                                      id={`findoclines_attributes_${idx}_credit_doc`}
                                      name="creditDoc"
                                      value={item.creditDoc}
                                      onChange={(e) => handleFindocChange(e, item.id)}
                                      invalid={
                                        findocErrors.invoiceItemsErrors &&
                                        findocErrors.invoiceItemsErrors.some(
                                          (x) => x.id === item.id,
                                        ) &&
                                        true
                                          ? true
                                          : false
                                      }
                                      disabled={
                                        disabledFields.some((x) => x.id === item.id) && true
                                          ? true
                                          : false
                                      }
                                    />
                                    <CFormFeedback
                                      id={`errId_${item.id}`}
                                      invalid
                                      className="fieldError-cst pt-1"
                                    ></CFormFeedback>
                                  </div>
                                </td>
                                <td className={`remove-doc-line_${item.id}`}>
                                  <button
                                    className="btn btn-close remove-doc-link"
                                    aria-label="Close"
                                    title="Remove"
                                    style={{ marginTop: '2px' }}
                                    onClick={(e) => removeInvItem(e, item)}
                                  ></button>
                                </td>
                                <td
                                  className={`recover-doc-line_${item.id}`}
                                  style={{ display: 'none' }}
                                >
                                  {/* eslint-disable-next-line */}
                                  <a
                                    title="Recover"
                                    href="#"
                                    className="text-secondary"
                                    onClick={(e) => recoverInvItem(e, item)}
                                  >
                                    <i className="fas fa-reply recover-doc-link"></i>
                                  </a>
                                </td>
                              </tr>
                            ))}
                          <tr className="d-flex new_record_button">
                            <td colSpan="10" className="text-right">
                              <span className="float-left add-new-line">
                                {/* eslint-disable-next-line */}
                                <a
                                  href="#"
                                  className="btn btn-primary add_nested_fields_btn "
                                  onClick={(e) => addFindocLines(e)}
                                >
                                  <i className="fa fa-plus"></i> Add Document Line
                                </a>
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="col-6 col-sm-6 col-md-4 col-lg-8 col-xl-8 pt-3">
                      <div className="row">
                        <div className="col-12 col-sm-6 col-md-4 col-lg-6 col-xl-6">
                          <div className="d-flex">
                            <span>
                              <div className="form-group boolean findoc_confirm">
                                <div className="checkbox-custom checkbox-primary">
                                  <CFormCheck
                                    className="boolean pull-left"
                                    type="checkbox"
                                    name="findocConfirm"
                                    id="findoc_confirm"
                                    value={findocData.findocConfirm}
                                    onChange={(e) => handleCheckedForm(e)}
                                    invalid={
                                      findocErrors && !isEmpty(findocErrors.findocConfirm)
                                        ? true
                                        : false
                                    }
                                  />
                                  <CFormFeedback invalid className="fieldError-cst">
                                    {findocErrors.findocConfirm}
                                  </CFormFeedback>
                                </div>
                              </div>
                            </span>
                            <span style={{ paddingLeft: '0.3em' }}>
                              <label className="" htmlFor="findoc_confirm">
                                Confirm
                              </label>
                            </span>
                          </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-6 col-xl-6">
                          <div className="d-flex">
                            <span>
                              <div className="form-group boolean findoc_accounted">
                                <div className="checkbox-custom checkbox-primary">
                                  <CFormCheck
                                    className="boolean pull-left"
                                    type="checkbox"
                                    name="findocAccounted"
                                    id="findoc_accounted"
                                    value={findocData.findocAccounted}
                                    invalid={
                                      findocErrors && !isEmpty(findocErrors.findocAccounted)
                                        ? true
                                        : false
                                    }
                                    onChange={(e) => handleCheckedForm(e)}
                                    onFocus={(e) => handleSelectFocus('findocAccounted', e)}
                                  />
                                  <CFormFeedback invalid className="fieldError-cst">
                                    {findocErrors.findocAccounted}
                                  </CFormFeedback>
                                </div>
                              </div>
                            </span>
                            <span style={{ paddingLeft: '0.3em' }}>
                              <label className="" htmlFor="findoc_accounted">
                                Accounted
                              </label>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                      <table className="table table-hover table-striped well -findoc">
                        <thead>
                          <tr>
                            <th className="col-md-2">
                              <span className="pull-right">Total</span>
                            </th>
                            <th className="col-md-2">
                              <span id="total-cell" className="pull-right">
                                50360.00{' '}
                                {currencies.find((x) => x.id === findocData.findocCurr) &&
                                  JSON.stringify(findocData.findocCurr)}
                              </span>
                            </th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="form-actions">
                  <div className="d-flex justify-content-between">
                    <CButton color="success" type="submit" disabled={creatingFindoc ? true : false}>
                      {creatingFindoc ? (
                        'Processing...'
                      ) : (
                        <span>
                          Save <i className="fa fa-check" />
                        </span>
                      )}
                    </CButton>

                    <div
                      className="checkbox-custom checkbox-primary pull-right"
                      style={{ display: 'inline' }}
                    >
                      <CFormCheck
                        style={{ opacity: '1' }}
                        className="boolean optional"
                        type="checkbox"
                        name="add_new_record"
                        id="add_new_record_button"
                        onChange={(e) => handleAddNewRecord(e)}
                      />
                      <span style={{ paddingLeft: '0.3em' }}>
                        After saving open form new record
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </CCard>
      </div>
    </div>
  )
}

EFTCollectionPanel.propTypes = {
  itemInfo: PropTypes.object,
  closeEftCollectionModal: PropTypes.func,
}

export default EFTCollectionPanel
