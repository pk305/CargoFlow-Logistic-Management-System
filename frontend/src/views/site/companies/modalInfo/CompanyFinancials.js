import React from 'react'
import PropTypes from 'prop-types'
import { CFormFeedback, CFormInput, CFormSelect, CFormTextarea } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { clearFinancialError } from 'src/redux/slices/financialSlice'
import { isEmpty, isNull } from 'lodash'
import classNames from 'classnames'
import Select from 'react-select'
import countryList from 'react-select-country-list'

const CompanyFinancials = ({ financialData, handleChangeFinancials }) => {
  const dispatch = useDispatch()
  const { financialErrors } = useSelector((state) => state.financial)
  const { currencies, fetchingCurrencies } = useSelector((state) => state.currency)
  const { users, fetchingUsers } = useSelector((state) => state.user)

  const handleSelectFocus = (c, _) => {
    dispatch(clearFinancialError({ type: c, errorType: 'errFinancials' }))
  }

  const handleSelectForm = (c, val) => {
    const e = {
      target: {
        name: c,
        value: !isNull(val) ? val.value : '',
      },
    }
    handleChangeFinancials(e)
  }

  const countryData = countryList().data

  return (
    <div className="company-financials newBookings">
      <div className="row">
        <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-4">
          <div className="form-group company_title">
            <label className="control-label string optional" htmlFor="company_title">
              Invoice Title
            </label>
            <CFormInput
              className="form-control-cst string optional"
              type="text"
              name="companyName"
              id="company_title"
              value={financialData.companyName}
              onChange={(e) => handleChangeFinancials(e)}
              invalid={financialErrors && !isEmpty(financialErrors.companyName) ? true : false}
              onFocus={() =>
                dispatch(
                  clearFinancialError({
                    type: 'companyName',
                    errorType: 'errFinancial',
                  }),
                )
              }
            />
            <CFormFeedback className="fieldError-cst">{financialErrors.companyName}</CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2">
          <div className="form-group company_taxno">
            <label className="control-label string optional" htmlFor="company_taxno">
              Tax No
            </label>
            <CFormInput
              className="form-control-cst string optional"
              type="text"
              name="taxNo"
              id="company_taxno"
              value={financialData.taxNo}
              onChange={(e) => handleChangeFinancials(e)}
              invalid={financialErrors && !isEmpty(financialErrors.taxNo) ? true : false}
              onFocus={() =>
                dispatch(
                  clearFinancialError({
                    type: 'taxNo',
                    errorType: 'errFinancial',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={financialErrors && !isEmpty(financialErrors.taxNo) ? true : false}
              className="fieldError-cst"
            >
              {financialErrors.taxNo}
            </CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2">
          <div className="form-group company_taxoffice">
            <label className="control-label string optional" htmlFor="company_taxoffice">
              Deferment Acc. No
            </label>
            <CFormInput
              className="form-control-cst string optional"
              type="text"
              name="taxOffice"
              id="company_taxoffice"
              value={financialData.taxOffice}
              onChange={(e) => handleChangeFinancials(e)}
              invalid={financialErrors && !isEmpty(financialErrors.taxOffice) ? true : false}
              onFocus={() =>
                dispatch(
                  clearFinancialError({
                    type: 'taxOffice',
                    errorType: 'errFinancial',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={financialErrors && !isEmpty(financialErrors.taxOffice) ? true : false}
              className="fieldError-cst"
            >
              {financialErrors.taxOffice}
            </CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2">
          <div className="form-group company_company_no">
            <label className="control-label string optional" htmlFor="company_company_no">
              Company No
            </label>
            <CFormInput
              className="form-control-cst string optional"
              type="text"
              name="companyNo"
              id="company_company_no"
              value={financialData.companyNo}
              onChange={(e) => handleChangeFinancials(e)}
              invalid={financialErrors && !isEmpty(financialErrors.companyNo) ? true : false}
              onFocus={() =>
                dispatch(
                  clearFinancialError({
                    type: 'companyNo',
                    errorType: 'errFinancial',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={financialErrors && !isEmpty(financialErrors.companyNo) ? true : false}
              className="fieldError-cst"
            >
              {financialErrors.companyNo}
            </CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-4">
          <div className="form-group company_address">
            <label className="control-label string optional" htmlFor="company_address">
              Address
            </label>
            <CFormInput
              className="form-control-cst"
              type="text"
              name="address"
              id="company_address"
              value={financialData.address}
              onChange={(e) => handleChangeFinancials(e)}
              invalid={financialErrors && !isEmpty(financialErrors.address) ? true : false}
              onFocus={() =>
                dispatch(
                  clearFinancialError({
                    type: 'address',
                    errorType: 'errFinancial',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={financialErrors && !isEmpty(financialErrors.address) ? true : false}
              className="fieldError-cst"
            >
              {financialErrors.address}
            </CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2">
          <div className="form-group company_postcode">
            <label className="control-label string optional" htmlFor="company_postcode">
              Postcode
            </label>
            <CFormInput
              className="form-control-cst string optional"
              type="text"
              name="postcode"
              id="company_postcode"
              value={financialData.postcode}
              onChange={(e) => handleChangeFinancials(e)}
              invalid={financialErrors && !isEmpty(financialErrors.postcode) ? true : false}
              onFocus={() =>
                dispatch(
                  clearFinancialError({
                    type: 'postcode',
                    errorType: 'errFinancial',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={financialErrors && !isEmpty(financialErrors.postcode) ? true : false}
              className="fieldError-cst"
            >
              {financialErrors.postcode}
            </CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2">
          <div className="form-group company_district">
            <label className="control-label string optional" htmlFor="company_district">
              County
            </label>
            <CFormInput
              className="form-control-cst string optional"
              type="text"
              name="district"
              id="company_district"
              value={financialData.district}
              onChange={(e) => handleChangeFinancials(e)}
              invalid={financialErrors && !isEmpty(financialErrors.district) ? true : false}
              onFocus={() =>
                dispatch(
                  clearFinancialError({
                    type: 'district',
                    errorType: 'errFinancial',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={financialErrors && !isEmpty(financialErrors.district) ? true : false}
              className="fieldError-cst"
            >
              {financialErrors.district}
            </CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2">
          <div className="form-group company_city_name">
            <label className="control-label string optional" htmlFor="company_city_name">
              City
            </label>
            <CFormInput
              className="form-control-cst"
              type="text"
              name="cityName"
              id="company_city_name"
              value={financialData.cityName}
              onChange={(e) => handleChangeFinancials(e)}
              invalid={financialErrors && !isEmpty(financialErrors.cityName) ? true : false}
              onFocus={() =>
                dispatch(
                  clearFinancialError({
                    type: 'cityName',
                    errorType: 'errFinancials',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={financialErrors && !isEmpty(financialErrors.cityName) ? true : false}
              className="fieldError-cst"
            >
              {financialErrors.cityName}
            </CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2">
          <div className="form-group select optional company_country_id">
            <label className="control-label select optional" htmlFor="company_country_id">
              Country
            </label>
            <div className="input-group">
              <Select
                key={'cstSelect-countryId'}
                className={classNames('form-control form-control-cst pageCstSelect ', {
                  'is-invalid': financialErrors && !isEmpty(financialErrors.countryId),
                })}
                classNamePrefix="cstSelect"
                isClearable
                placeholder="-Select-"
                isSearchable
                isLoading={countryData && !countryData.length > 0 ? true : false}
                id="loadingCountry"
                options={
                  countryData && countryData.length > 0
                    ? [{ label: '', value: '' }, ...countryData].map((item) => ({
                        value: item.value,
                        label: `${item.value ? item.value + ' -' : ''}  ${item.label}`,
                      }))
                    : []
                }
                noOptionsMessage={() => 'No results found'}
                onChange={(val) => handleSelectForm('countryId', val)}
                onMenuOpen={(e) => handleSelectFocus('countryId', e)}
              />
              <CFormFeedback
                invalid={financialErrors && !isEmpty(financialErrors.countryId) ? true : false}
                className="fieldError-cst"
              >
                {financialErrors.countryId}
              </CFormFeedback>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
          <div className="form-group email optional company_financial_email">
            <label className="control-label email optional" htmlFor="company_financial_email">
              Financial Emails
            </label>
            <CFormInput
              className="form-control-cst string email optional"
              type="email"
              name="financialEmail"
              id="company_financial_email"
              value={financialData.financialEmail}
              onChange={(e) => handleChangeFinancials(e)}
              invalid={financialErrors && !isEmpty(financialErrors.financialEmail) ? true : false}
              onFocus={() =>
                dispatch(
                  clearFinancialError({
                    type: 'financialEmail',
                    errorType: 'errFinancials',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={financialErrors && !isEmpty(financialErrors.financialEmail) ? true : false}
              className="fieldError-cst"
            >
              {financialErrors.financialEmail}
            </CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
          <div className="form-group select optional company_financor_id">
            <label className="control-label select optional" htmlFor="company_financor_id">
              Financial Follower
            </label>
            <div className="input-group">
              <Select
                key={'cstSelect-company_financor_id'}
                className={classNames('form-control form-control-cst pageCstSelect ', {
                  'is-invalid': financialErrors && !isEmpty(financialErrors.companyFinancorId),
                })}
                classNamePrefix="cstSelect"
                isClearable
                placeholder="-Select-"
                isSearchable
                isLoading={fetchingUsers ? true : false}
                id="company_financor_id"
                options={
                  users && users.length > 0
                    ? [{ label: '', value: '' }, ...users].map((item) => ({
                        value: item.value,
                        label: item.label,
                      }))
                    : []
                }
                noOptionsMessage={() => 'No results found'}
                onChange={(val) => handleSelectForm('companyFinancorId', val)}
                onMenuOpen={(e) => handleSelectFocus('companyFinancorId', e)}
              />
              <CFormFeedback
                invalid={
                  financialErrors && !isEmpty(financialErrors.companyFinancorId) ? true : false
                }
                className="fieldError-cst"
              >
                {financialErrors.companyFinancorId}
              </CFormFeedback>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
          <div className="form-group company_payment_notes">
            <label className="control-label string optional" htmlFor="company_payment_notes">
              Payment Notes
            </label>
            <CFormInput
              className="form-control-cst string optional"
              type="text"
              name="paymentNotes"
              id="company_payment_notes"
              value={financialData.paymentNotes}
              onChange={(e) => handleChangeFinancials(e)}
              invalid={financialErrors && !isEmpty(financialErrors.paymentNotes) ? true : false}
              onFocus={() =>
                dispatch(
                  clearFinancialError({
                    type: 'paymentNotes',
                    errorType: 'errFinancials',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={financialErrors && !isEmpty(financialErrors.paymentNotes) ? true : false}
              className="fieldError-cst"
            >
              {financialErrors.paymentNotes}
            </CFormFeedback>
          </div>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
          <div className="form-group email optional company_information_email">
            <label className="control-label email optional" htmlFor="company_information_email">
              Company Information Mail
            </label>
            <CFormInput
              className="form-control-cst string email optional"
              type="email"
              name="informationEmail"
              id="company_information_email"
              value={financialData.informationEmail}
              onChange={(e) => handleChangeFinancials(e)}
              invalid={financialErrors && !isEmpty(financialErrors.informationEmail) ? true : false}
              onFocus={() =>
                dispatch(
                  clearFinancialError({
                    type: 'informationEmail',
                    errorType: 'errFinancials',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={financialErrors && !isEmpty(financialErrors.informationEmail) ? true : false}
              className="fieldError-cst"
            >
              {financialErrors.informationEmail}
            </CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-6">
          <div className="form-group text optional company_invoice_notes">
            <label className="control-label text optional" htmlFor="company_invoice_notes">
              Invoice Note
            </label>
            <CFormTextarea
              className="form-control-cst text optional"
              name="invoiceNotes"
              id="company_invoice_notes"
              value={financialData.invoiceNotes}
              onChange={(e) => handleChangeFinancials(e)}
              invalid={financialErrors && !isEmpty(financialErrors.invoiceNotes) ? true : false}
              onFocus={() =>
                dispatch(
                  clearFinancialError({
                    type: 'invoiceNotes',
                    errorType: 'errFinancials',
                  }),
                )
              }
            ></CFormTextarea>
            <CFormFeedback
              invalid={financialErrors && !isEmpty(financialErrors.invoiceNotes) ? true : false}
              className="fieldError-cst"
            >
              {financialErrors.invoiceNotes}
            </CFormFeedback>
          </div>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
          <div className="form-group integer optional company_due_days">
            <label className="control-label integer optional" htmlFor="company_due_days">
              Payment Terms
            </label>
            <CFormInput
              className="form-control-cst numeric integer optional"
              type="number"
              step="1"
              name="dueDays"
              id="company_due_days"
              value={financialData.dueDays}
              onChange={(e) => handleChangeFinancials(e)}
              invalid={financialErrors && !isEmpty(financialErrors.dueDays) ? true : false}
              onFocus={() =>
                dispatch(
                  clearFinancialError({
                    type: 'dueDays',
                    errorType: 'errFinancial',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={financialErrors && !isEmpty(financialErrors.dueDays) ? true : false}
              className="fieldError-cst"
            >
              {financialErrors.dueDays}
            </CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
          <div className="form-group select optional company_curr">
            <label className="control-label select optional" htmlFor="company_curr">
              Currency
            </label>
            <div className="input-group">
              <Select
                className={classNames('form-control form-control-cst pageCstSelect ', {
                  'is-invalid': financialErrors && !isEmpty(financialErrors.companyCurr),
                })}
                classNamePrefix="cstSelect"
                isClearable
                placeholder="-Select-"
                isSearchable
                isLoading={fetchingCurrencies ? true : false}
                id="company_curr"
                options={
                  currencies && currencies.length > 0
                    ? [{ label: '', value: '' }, ...currencies].map((item) => ({
                        value: item.value,
                        label: `${item.value ? item.value + ' -' : ''}  ${item.label}`,
                      }))
                    : []
                }
                noOptionsMessage={() => 'No results found'}
                onChange={(val) => handleSelectForm('companyCurr', val)}
                onMenuOpen={(e) => handleSelectFocus('companyCurr', e)}
              />
              <CFormFeedback
                invalid={financialErrors && !isEmpty(financialErrors.companyCurr) ? true : false}
                className="fieldError-cst"
              >
                {financialErrors.companyCurr}
              </CFormFeedback>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
          <div className="form-group select optional company_credit_limit_control">
            <label className="control-label select optional" htmlFor="company_credit_limit_control">
              Company Limit Control
            </label>
            <CFormSelect
              className="form-control-cst select optional credit_limit_control"
              name="creditLimitControl"
              id="company_credit_limit_control"
              value={financialData.creditLimitControl}
              onChange={(e) => handleChangeFinancials(e)}
              invalid={
                financialErrors && !isEmpty(financialErrors.creditLimitControl) ? true : false
              }
              onFocus={() =>
                dispatch(
                  clearFinancialError({
                    type: 'creditLimitControl',
                    errorType: 'errFinancial',
                  }),
                )
              }
            >
              <option value="ignore"></option>
              <option value="warn">Alert if limit is exceeded</option>
              <option value="block">Block if limit is exceeded</option>
            </CFormSelect>
            <CFormFeedback
              invalid={
                financialErrors && !isEmpty(financialErrors.creditLimitControl) ? true : false
              }
              className="fieldError-cst"
            >
              {financialErrors.creditLimitControl}
            </CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-2 col-xl-2 company-limit-fields">
          <div className="form-group decimal optional company_credit_limit">
            <label className="control-label decimal optional" htmlFor="company_credit_limit">
              Company Limit
            </label>
            <CFormInput
              className="form-control-cst numeric decimal optional"
              type="number"
              step="any"
              name="creditLimit"
              id="company_credit_limit"
              value={financialData.creditLimit}
              onChange={(e) => handleChangeFinancials(e)}
              invalid={financialErrors && !isEmpty(financialErrors.creditLimit) ? true : false}
              onFocus={() =>
                dispatch(
                  clearFinancialError({
                    type: 'creditLimit',
                    errorType: 'errFinancial',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={financialErrors && !isEmpty(financialErrors.creditLimit) ? true : false}
              className="fieldError-cst"
            >
              {financialErrors.creditLimit}
            </CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-2 col-xl-2 company-limit-fields">
          <div className="form-group select optional company_credit_limit_curr">
            <label className="control-label select optional" htmlFor="company_credit_limit_curr">
              Company Limit Currency
            </label>
            <CFormSelect
              className="form-control-cst select optional"
              name="companyCreditLimitCurr"
              id="company_credit_limit_curr"
              value={financialData.companyCreditLimitCurr}
              onChange={(e) => handleChangeFinancials(e)}
              invalid={
                financialErrors && !isEmpty(financialErrors.companyCreditLimitCurr) ? true : false
              }
              onFocus={() =>
                dispatch(
                  clearFinancialError({
                    type: 'companyCreditLimitCurr',
                    errorType: 'errFinancial',
                  }),
                )
              }
            >
              <option></option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="KES">KES</option>
            </CFormSelect>
            <CFormFeedback
              invalid={
                financialErrors && !isEmpty(financialErrors.companyCreditLimitCurr) ? true : false
              }
              className="fieldError-cst"
            >
              {financialErrors.companyCreditLimitCurr}
            </CFormFeedback>
          </div>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
          <div className="form-group select optional company_financial_status">
            <label className="control-label select optional" htmlFor="company_financial_status">
              Financial Status
            </label>
            <CFormSelect
              className="form-control-cst select optional"
              name="financialStatus"
              id="company_financial_status"
              value={financialData.financialStatus}
              onChange={(e) => handleChangeFinancials(e)}
              invalid={financialErrors && !isEmpty(financialErrors.financialStatus) ? true : false}
              onFocus={() =>
                dispatch(
                  clearFinancialError({
                    type: 'financialStatus',
                    errorType: 'errFinancial',
                  }),
                )
              }
            >
              <option></option>
              <option value="active">Active</option>
              <option value="financial_problem">Has financial problems</option>
              <option value="banned">Banned</option>
              <option value="closed">Company Closed</option>
            </CFormSelect>
            <CFormFeedback
              invalid={financialErrors && !isEmpty(financialErrors.financialStatus) ? true : false}
              className="fieldError-cst"
            >
              {financialErrors.financialStatus}
            </CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
          <div className="form-group select optional company_remind_payment">
            <label className="control-label select optional" htmlFor="company_remind_payment">
              Debt Notification Mail
            </label>
            <CFormSelect
              className="form-control-cst select optional"
              name="remindPayment"
              id="company_remind_payment"
              value={financialData.companyRemindPayment}
              onChange={(e) => handleChangeFinancials(e)}
              invalid={
                financialErrors && !isEmpty(financialErrors.companyRemindPayment) ? true : false
              }
              onFocus={() =>
                dispatch(
                  clearFinancialError({
                    type: 'companyRemindPayment',
                    errorType: 'errFinancial',
                  }),
                )
              }
            >
              <option value="none">None</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </CFormSelect>
            <CFormFeedback
              invalid={
                financialErrors && !isEmpty(financialErrors.companyRemindPayment) ? true : false
              }
              className="fieldError-cst"
            >
              {financialErrors.companyRemindPayment}
            </CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-6">
          <div className="form-group text optional company_financial_notes">
            <label className="control-label text optional" htmlFor="company_financial_notes">
              Financial Note
            </label>
            <CFormTextarea
              className="form-control-cst text optional"
              rows="1"
              name="financialNotes"
              id="company_financial_notes"
              value={financialData.financialNotes}
              onChange={(e) => handleChangeFinancials(e)}
              invalid={financialErrors && !isEmpty(financialErrors.financialNotes) ? true : false}
              onFocus={() =>
                dispatch(
                  clearFinancialError({
                    type: 'financialNotes',
                    errorType: 'errFinancial',
                  }),
                )
              }
            ></CFormTextarea>
            <CFormFeedback
              invalid={financialErrors && !isEmpty(financialErrors.financialNotes) ? true : false}
              className="fieldError-cst"
            >
              {financialErrors.financialNotes}
            </CFormFeedback>
          </div>
        </div>
      </div>
    </div>
  )
}

CompanyFinancials.propTypes = {
  financialData: PropTypes.object,
  handleChangeFinancials: PropTypes.func,
}

export default CompanyFinancials
