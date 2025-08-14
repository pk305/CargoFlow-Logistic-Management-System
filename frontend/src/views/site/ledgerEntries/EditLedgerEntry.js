import React, { useCallback, useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormSelect,
  CFormTextarea,
} from '@coreui/react'
import { AppBreadcrumb } from 'src/components'
import DatePicker from 'react-datepicker'
import { isEmpty, isNull } from 'lodash'
import moment from 'moment'
import { nanoid } from 'nanoid'
import Select from 'react-select'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfitCenters } from 'src/redux/slices/profitCenterSlice'
import { fetchBranches } from 'src/redux/slices/branchSlice'
import { fetchCurrencies } from 'src/redux/slices/currencySlice'
import { fetchFinancialAccount } from 'src/redux/slices/financialSlice'
import { clearGldocError, findGldoc, updateGldoc } from 'src/redux/slices/gldocSlice'
import { useHistory, useParams } from 'react-router-dom'
import Noty from 'noty'

const EditLedgerEntry = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const params = useParams()
  const [breadcrumbList] = useState([
    { name: 'Sales Invoices', pathname: '/financor/debit' },
    { name: 'Purchase Invoices', pathname: '/financor/credit' },
    { name: 'Cash Transactions', pathname: '/financor/cash_trans' },
    { name: 'Bank Transactions', pathname: '/financor/bank_trans' },
    { name: 'Driver Transactions', pathname: '/financor/driver_trans' },
    { name: 'Ledger Entries', pathname: '/gldocs', active: true },
    { name: 'Reports', pathname: '/reports/home?group_type=financor' },
  ])
  const { profitCenters, fetchingProfitCenters } = useSelector((state) => state.profitCenter)
  const { operations, fetchingOperations } = useSelector((state) => state.operation)
  const { currencies, fetchingCurencies } = useSelector((state) => state.currency)
  const [gldocData, setGldocData] = useState({
    id: '',
    title: '',
    docDate: '',
    dueDate: '',
    operationId: '',
    branchId: '',
    ledgerType: '',
    findocList: [],
  })
  const { branches, fetchingBranches } = useSelector((state) => state.branch)
  const { fincAccountData, fetchingFinAcc } = useSelector((state) => state.financial)
  const { updatingGldoc, gldocErrors } = useSelector((state) => state.gldoc)
  const { showGldoc, findingGldoc } = useSelector((state) => state.gldoc)

  const [loadDateTime, setLoadDateTime] = useState({
    docDate: new Date(),
    dueDate: new Date(),
  })

  const handleChangeForm = (e, item) => {
    const { name, value } = e.target
    setGldocData({
      ...gldocData,
      [name]: value,
    })

    if (item) {
      setGldocData((state) => ({
        ...state,
        findocList: state.findocList.map((x) => (x.id === item.id ? { ...x, [name]: value } : x)),
      }))
    }
  }

  const handleDateTime = (c, date) => {
    if (date) {
      setLoadDateTime((state) => ({ ...state, [c]: date }))
    }
    const e = {
      target: {
        name: c,
        value: !isNull(date) ? moment(date).format('YYYY-MM-DD') : '',
      },
    }
    handleChangeForm(e, null)
  }

  const handleSelectForm = (c, val, itemId) => {
    if (itemId) {
      setGldocData((state) => ({
        ...state,
        findocList: state.findocList.map((x) =>
          x.id === itemId ? { ...x, [c]: !isNull(val) ? val.value : '' } : x,
        ),
      }))
    } else {
      const f = val ? val.value : null
      const e = {
        target: {
          name: c,
          value: f ? f : '',
        },
      }
      handleChangeForm(e, null)
    }
  }

  const handleSelectFocus = (c, v) => {
    dispatch(clearGldocError({ type: c, errorType: 'errGldoc' }))

    if (c === 'profitCenterId') {
      if (isEmpty(profitCenters)) {
        dispatch(fetchProfitCenters())
      }
    } else if (c === 'branchId') {
      if (isEmpty(branches)) {
        dispatch(fetchBranches())
      }
    } else if (c === 'curr') {
      if (isEmpty(currencies)) {
        dispatch(fetchCurrencies())
      }
    } else if (c === 'accountId') {
      dispatch(
        fetchFinancialAccount({
          accountType: v.accountType,
        }),
      )
    }
  }

  const addChangeLine = (e) => {
    e.preventDefault()
    setGldocData((state) => ({
      ...state,
      findocList: [
        ...state.findocList,
        {
          id: nanoid(5),
          accountType: '',
          accountId: '',
          profitCenterId: '',
          notes: '',
          debit: '0.0',
          credit: '0.0',
        },
      ],
    }))
  }

  const handleSubmitLedger = async (e) => {
    e.preventDefault()
    const resData = await dispatch(updateGldoc({ Id: gldocData.id, ...gldocData })).unwrap()
    if (resData) {
      new Noty({
        type: 'alert',
        layout: 'topRight',
        id: `succ${resData.id}`,
        text: 'Ledger Entry has been updated succesfully',
      }).show()
      history.push(`/gldocs/${resData.linkId}`)
    }
  }

  const initMethods = useCallback(() => {
    const { id } = params
    if (id) {
      async function checkLedgerEntry() {
        const resData = await dispatch(findGldoc(id)).unwrap()
        if (resData) {
          const r = resData
          //   console.log(resData)
          setGldocData((state) => ({
            ...state,
            id: r.id,
            title: r.title ? r.title : '',
            docDate: r.docDate ? r.docDate : '',
            dueDate: r.dueDate ? r.dueDate : '',
            operationId: r.operation ? r.operation.id : '',
            branchId: r.branch ? r.branch.id : '',
            ledgerType: r.ledgerType ? r.ledgerType : '',
            // findocList: [
            //   ...state.findocList,
            //   {
            //     id: nanoid(5),
            //     accountType: '',
            //     accountId: '',
            //     profitCenterId: '',
            //     notes: '',
            //     debit: '0.0',
            //     credit: '0.0',
            //   },
            // ],
          }))
        }
      }
      checkLedgerEntry()
    }
  }, [params, dispatch])

  useEffect(() => {
    initMethods()
  }, [initMethods])

  if (findingGldoc) return false

  return (
    <div>
      <div className="cstContainerDef">
        <AppBreadcrumb items={breadcrumbList} />
      </div>
      <div className="pageContainer">
        <div className="container-fluid">
          <div className="d-block"></div>
          <CCard className="cardCustom">
            <div className="card-header">
              <div className="toolBarContainer">
                <div className="customHeaderContainer">
                  <div className="customHeaderContainer-body">
                    <div className="symbolWrapper">
                      <span className="symbol-label">
                        <i className="fa fa-file-invoice icon-2x"></i>
                      </span>
                    </div>
                  </div>
                  <div className="customHeaderContainer-footer">
                    <div className="card-title">
                      <h3 className="cstCardbodyHeaderTitle">Edit Ledger Entry</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CForm
              className="simple_form horizontal-form"
              id={`edit_gldoc_${showGldoc && showGldoc.id}`}
              onSubmit={(e) => handleSubmitLedger(e)}
            >
              <CCardBody className="p-0">
                <div className="pageContainer-wrapper">
                  <div className="pageBoxSizing-container">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                        <div className="form-group  gldoc_title">
                          <label className="control-label " htmlFor="gldoc_title">
                            Note <span title="required">*</span>
                          </label>
                          <CFormInput
                            className="form-control-cst"
                            type="text"
                            name="title"
                            id="gldoc_title"
                            value={gldocData.title}
                            onChange={(e) => handleChangeForm(e, null)}
                            invalid={gldocErrors && !isEmpty(gldocErrors.title) ? true : false}
                            onFocus={(e) => handleSelectFocus('title')}
                          />
                          <CFormFeedback invalid className="fieldError-cst">
                            {gldocErrors.title}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                        <div className="row">
                          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group date_picker required gldoc_doc_date">
                              <label
                                className="control-label date_picker required"
                                htmlFor="gldoc_doc_date"
                              >
                                Date <span title="required">*</span>
                              </label>
                              <DatePicker
                                selected={loadDateTime.docDate}
                                onChange={(date) => handleDateTime('docDate', date)}
                                className={classNames('form-control form-control-cst ', {
                                  'is-invalid': gldocErrors && !isEmpty(gldocErrors.docDate),
                                })}
                                style={{ paddingLeft: '2px', paddingRight: '2px' }}
                                dateFormat="yyyy-MM-dd"
                                id="gldoc_doc_date"
                                onFocus={(e) => handleSelectFocus('docDate')}
                              />
                              <CFormFeedback
                                invalid
                                className="fieldError-cst"
                                style={{ display: 'block' }}
                              >
                                {gldocErrors.docDate}
                              </CFormFeedback>
                            </div>
                          </div>
                          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group date_picker optional gldoc_due_date">
                              <label
                                className="control-label date_picker optional"
                                htmlFor="gldoc_due_date"
                              >
                                Due Date
                              </label>
                              <DatePicker
                                selected={loadDateTime.dueDate}
                                onChange={(date) => handleDateTime('dueDate', date)}
                                className={classNames('form-control form-control-cst ', {
                                  'is-invalid': gldocErrors && !isEmpty(gldocErrors.dueDate),
                                })}
                                style={{ paddingLeft: '2px', paddingRight: '2px' }}
                                dateFormat="yyyy-MM-dd"
                                id="gldoc_due_date"
                                onFocus={(e) => handleSelectFocus('dueDate')}
                              />
                              <CFormFeedback
                                invalid
                                className="fieldError-cst"
                                style={{ display: 'block' }}
                              >
                                {gldocErrors.dueDate}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2"></div>
                      <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group">
                          <label className="control-label" htmlFor="gldoc_branch_id">
                            Branch <span title="required">*</span>
                          </label>
                          <div className="input-group">
                            <Select
                              classNamePrefix="cstSelect"
                              isClearable
                              placeholder
                              isSearchable
                              id="gldoc_branch_id"
                              options={
                                branches && !fetchingBranches && branches.length > 0
                                  ? branches.map((itm) => ({
                                      label: itm.name,
                                      value: itm.id,
                                    }))
                                  : []
                              }
                              defaultValue={{
                                label: `${showGldoc && showGldoc.branch && showGldoc.branch.name}`,
                                value: `${showGldoc && showGldoc.branch && showGldoc.branch.id}`,
                              }}
                              isLoading={fetchingBranches ? true : false}
                              noOptionsMessage={() => 'No results found'}
                              onChange={(e) => handleSelectForm('branchId', e)}
                              className={classNames(
                                'form-control form-control-cst pageCstSelect ',
                                {
                                  'is-invalid': gldocErrors && !isEmpty(gldocErrors.branchId),
                                },
                              )}
                              onMenuOpen={(e) => handleSelectFocus('branchId', e)}
                            />
                            <CFormFeedback
                              invalid={gldocErrors && !isEmpty(gldocErrors.branchId) ? true : false}
                              className="fieldError-cst"
                            >
                              {gldocErrors.branchId}
                            </CFormFeedback>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group gldoc_operation_id">
                          <label className="control-label" htmlFor="gldoc_operation_id">
                            Operation <span title="required">*</span>
                          </label>
                          <CFormSelect
                            className={classNames('form-control-cst  operation-select', {
                              'is-invalid': gldocErrors && !isEmpty(gldocErrors.operationId),
                            })}
                            name="operationId"
                            id="gldoc_operation_id"
                            value={gldocData.operationId}
                            invalid={
                              gldocErrors && !isEmpty(gldocErrors.operationId) ? true : false
                            }
                            onChange={(e) => handleChangeForm(e, null)}
                            onFocus={(e) => handleSelectFocus('operationId', e)}
                          >
                            {!fetchingOperations ? (
                              operations && operations.length > 0 ? (
                                <>
                                  <option value=""></option>
                                  {operations.map((itm, i) => (
                                    <option key={i} value={itm.id} trans_method={itm.slug}>
                                      {itm.name}
                                    </option>
                                  ))}
                                </>
                              ) : (
                                <>
                                  <option value=""></option>
                                  <option disabled>No results found.</option>
                                </>
                              )
                            ) : (
                              <>
                                <option value=""></option>
                                <option>Loading...</option>
                              </>
                            )}
                          </CFormSelect>
                          <CFormFeedback invalid className="fieldError-cst">
                            {gldocErrors.operationId}
                          </CFormFeedback>
                        </div>
                      </div>
                    </div>
                    <div className="separator"></div>
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <div className="table table-responsive">
                          <table className="table table-sm table-borderless table-vertical-center">
                            <thead>
                              <tr className="d-flex">
                                <th className="col-1">Account Type</th>
                                <th className="col-2">Account</th>
                                <th className="col-1">Cost Center</th>
                                <th className="col-2">
                                  <span className="translation_missing">Notes</span>
                                </th>
                                <th className="col-1">Debit</th>
                                <th className="col-1">Credit</th>
                                <th className="col-1">Currency</th>
                                <th className="col-1">Currency Rate</th>
                                <th className="col-1">Debit ()</th>
                                <th className="col-1">Credit ()</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {gldocData.findocList && gldocData.findocList.length > 0
                                ? gldocData.findocList.map((x) => (
                                    <tr className="findoc-line d-flex" key={x.id}>
                                      <td className="col-1" style={{ padding: '0' }}>
                                        <div className="form-group  gldoc_gldoclines_account_type">
                                          <div>
                                            <div className="input-group">
                                              <CFormSelect
                                                className="form-control-cst"
                                                name="accountType"
                                                id={`gldoc_gldoclines_account_type${x.id}`}
                                                value={x.accountType}
                                                onChange={(e) => handleChangeForm(e, x)}
                                              >
                                                <option value="ledgerAccount" data-select2-id="2">
                                                  Ledger Account
                                                </option>
                                                <option value="company">Company</option>
                                                <option value="bankAccount">Bank Account</option>
                                                <option value="cashPoint">Cash Account</option>
                                                <option value="creditCard">Credit Card</option>
                                                <option value="person">Employee</option>
                                                <option value="driver">Driver</option>
                                              </CFormSelect>
                                              <CFormFeedback invalid className="fieldError-cst">
                                                {gldocErrors.accountType}
                                              </CFormFeedback>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="col-2" style={{ padding: '0' }}>
                                        <div className="form-group account optional gldoc_gldoclines_account_id">
                                          <div>
                                            <div className="input-group">
                                              <div className="input-group">
                                                <Select
                                                  classNamePrefix="cstSelect"
                                                  isClearable
                                                  placeholder
                                                  isSearchable
                                                  id="gldoc_gldoclines_account_id"
                                                  options={
                                                    fincAccountData &&
                                                    !fetchingFinAcc &&
                                                    fincAccountData.results.length > 0
                                                      ? fincAccountData.results.map((itm) => ({
                                                          label: itm.name,
                                                          value: itm.id,
                                                        }))
                                                      : []
                                                  }
                                                  noOptionsMessage={() => 'No results found'}
                                                  onChange={(e) =>
                                                    handleSelectForm('accountId', e, x.id)
                                                  }
                                                  className={classNames(
                                                    'form-control form-control-cst pageCstSelect ',
                                                    {
                                                      'is-invalid':
                                                        gldocErrors &&
                                                        !isEmpty(gldocErrors.accountId),
                                                    },
                                                  )}
                                                  onMenuOpen={() =>
                                                    handleSelectFocus('accountId', x)
                                                  }
                                                />
                                                <CFormFeedback
                                                  invalid={
                                                    gldocErrors && !isEmpty(gldocErrors.accountId)
                                                      ? true
                                                      : false
                                                  }
                                                  className="fieldError-cst"
                                                >
                                                  {gldocErrors.accountId}
                                                </CFormFeedback>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="col-1" style={{ padding: '0' }}>
                                        <div className="form-group profit_center optional gldoc_gldoclines_profit_center_id">
                                          <div>
                                            <div className="input-group">
                                              <Select
                                                className={classNames(
                                                  'form-control form-control-cst pageCstSelect ',
                                                  {
                                                    'is-invalid':
                                                      gldocErrors &&
                                                      !isEmpty(gldocErrors.profitCenterId),
                                                  },
                                                )}
                                                classNamePrefix="cstSelect"
                                                placeholder
                                                isSearchable
                                                id="gldoc_gldoclines_attributes_profit_center_id"
                                                menuPlacement="auto"
                                                options={
                                                  profitCenters &&
                                                  !fetchingProfitCenters &&
                                                  profitCenters.length > 0
                                                    ? profitCenters.map((item) => ({
                                                        value: item.id,
                                                        label: item.name,
                                                      }))
                                                    : []
                                                }
                                                noOptionsMessage={() => 'No results found'}
                                                onChange={(e) =>
                                                  handleSelectForm('profitCenterId', e, x.id)
                                                }
                                                onMenuOpen={(e) =>
                                                  handleSelectFocus('profitCenterId', e)
                                                }
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="col-2" style={{ padding: '0' }}>
                                        <div className="form-group text optional gldoc_gldoclines_notes">
                                          <CFormTextarea
                                            className="form-control-cst"
                                            rows="1"
                                            style={{ height: '30px' }}
                                            id={`gldoc_gldoclines_notes${x.id}`}
                                            name="notes"
                                            value={x.notes}
                                            onChange={(e) => handleChangeForm(e, x)}
                                          ></CFormTextarea>
                                        </div>
                                      </td>
                                      <td className="col-1" style={{ padding: '0' }}>
                                        <div className="form-group decimal optional gldoc_gldoclines_debit">
                                          <CFormInput
                                            className="form-control-cst numeric decimal optional line-amount-debit"
                                            style={{ textAlign: 'right' }}
                                            type="number"
                                            step="any"
                                            id={`gldoc_gldoclines_debit${x.id}`}
                                            name="debit"
                                            value={x.debit}
                                            onChange={(e) => handleChangeForm(e, x)}
                                          />
                                        </div>
                                      </td>
                                      <td className="col-1" style={{ padding: '0' }}>
                                        <div className="form-group decimal optional ">
                                          <CFormInput
                                            className="form-control-cst numeric decimal optional line-amount-credit"
                                            style={{ textAlign: 'right' }}
                                            type="number"
                                            step="any"
                                            id={`gldoc_gldoclines_credit${x.id}`}
                                            name="credit"
                                            value={x.credit}
                                            onChange={(e) => handleChangeForm(e, x)}
                                          />
                                        </div>
                                      </td>
                                      <td className="col-1" style={{ padding: '0' }}>
                                        <div className="form-group  gldoc_gldoclines_curr">
                                          <CFormSelect
                                            className={classNames(
                                              'form-control-cst  operation-select',
                                              {
                                                'is-invalid':
                                                  gldocErrors && !isEmpty(gldocErrors.curr),
                                              },
                                            )}
                                            name="curr"
                                            id={`gldoc_gldoclines_curr_${x.id}`}
                                            value={gldocData.curr}
                                            onChange={(e) => handleChangeForm(e, x)}
                                            onFocus={(e) => handleSelectFocus('curr', e)}
                                          >
                                            {!fetchingCurencies ? (
                                              currencies && currencies.length > 0 ? (
                                                <>
                                                  <option value=""></option>
                                                  {currencies.map((itm, i) => (
                                                    <option
                                                      key={i}
                                                      value={itm.id}
                                                      trans_method={itm.slug}
                                                    >
                                                      {itm.name}
                                                    </option>
                                                  ))}
                                                </>
                                              ) : (
                                                <>
                                                  <option value=""></option>
                                                  <option disabled>No results found.</option>
                                                </>
                                              )
                                            ) : (
                                              <>
                                                <option value=""></option>
                                                <option>Loading...</option>
                                              </>
                                            )}
                                          </CFormSelect>
                                          <CFormFeedback
                                            invalid={
                                              gldocErrors && !isEmpty(gldocErrors.curr)
                                                ? true
                                                : false
                                            }
                                            className="fieldError-cst"
                                          >
                                            {gldocErrors.curr}
                                          </CFormFeedback>
                                        </div>
                                      </td>
                                      <td className="col-1" style={{ padding: '0' }}>
                                        <div className="form-group decimal optional gldoc_gldoclines_curr_rate">
                                          <CFormInput
                                            className="form-control-cst numeric decimal optional line-curr-rate"
                                            style={{ textAlign: 'right' }}
                                            type="number"
                                            step="any"
                                            value="1"
                                            name="gldoc[gldoclines_attributes][0][curr_rate]"
                                            id="gldoc_gldoclines_attributes_0_curr_rate"
                                            onChange={(e) => handleChangeForm(e, x)}
                                          />
                                        </div>
                                      </td>
                                      <td className="col-1" style={{ padding: '0' }}>
                                        <div className="form-group decimal optional gldoc_gldoclines_debit_local">
                                          <CFormInput
                                            className="form-control-cst numeric decimal optional line-amount-debit-doc"
                                            style={{ textAlign: 'right' }}
                                            type="number"
                                            step="any"
                                            value="0.0"
                                            name="gldoc[gldoclines_attributes][0][debit_local]"
                                            id="gldoc_gldoclines_attributes_0_debit_local"
                                            onChange={(e) => handleChangeForm(e, x)}
                                          />
                                        </div>
                                      </td>
                                      <td className="col-1" style={{ padding: '0' }}>
                                        <div className="form-group decimal optional gldoc_gldoclines_credit_local">
                                          <CFormInput
                                            className="form-control-cst numeric decimal optional line-amount-credit-doc"
                                            style={{ textAlign: 'right' }}
                                            type="number"
                                            step="any"
                                            value="0.0"
                                            name="gldoc[gldoclines_attributes][0][credit_local]"
                                            id="gldoc_gldoclines_attributes_0_credit_local"
                                            onChange={(e) => handleChangeForm(e, x)}
                                          />
                                        </div>
                                      </td>

                                      <td className="recover-doc-line hide">
                                        {/*  eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <a href="#">
                                          <i className="fas fa-reply recover-doc-link"></i>
                                        </a>
                                      </td>
                                      <td className="remove-doc-line ">
                                        {/*  eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <a href="#">
                                          <i className="fas fa-times remove-doc-link"></i>
                                        </a>
                                      </td>
                                    </tr>
                                  ))
                                : null}

                              <tr className="new_record_button" style={{ borderBottom: 'none' }}>
                                <th colSpan="10">
                                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                  <a
                                    href="#"
                                    className="btn btn-primary add_nested_fields_btn"
                                    onClick={(e) => addChangeLine(e)}
                                  >
                                    <i className="fa fa-plus"></i> Add Ledger Line Line
                                  </a>
                                </th>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="row">
                          <div className="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8"></div>
                          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                            <table className="table table-sm table-vertical-center">
                              <thead>
                                <tr>
                                  <th>
                                    <span className="pull-right">Total</span>
                                  </th>
                                  <th>
                                    <span id="total-debit-cell" className="pull-right">
                                      0.00
                                    </span>
                                  </th>
                                  <th>
                                    <span id="total-credit-cell" className="pull-right">
                                      0.00
                                    </span>
                                  </th>
                                  <th>
                                    <span id="total-diff-cell" className="pull-right">
                                      0.00
                                    </span>
                                  </th>
                                </tr>
                              </thead>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="separator"></div>
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <CButton
                          type="submit"
                          color="success"
                          disabled={updatingGldoc ? true : false}
                        >
                          {updatingGldoc ? (
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
              </CCardBody>
            </CForm>
          </CCard>
        </div>
      </div>
    </div>
  )
}

export default EditLedgerEntry
