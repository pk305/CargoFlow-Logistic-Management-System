import React, { useState } from 'react'
import { CCardBody, CFormInput, CFormSelect, CFormTextarea, CFormFeedback } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { clearDriverError } from 'src/redux/slices/driverSlice'
import { isEmpty, isNull } from 'lodash'
import Select from 'react-select'
import classNames from 'classnames'
import { fetchBranches } from 'src/redux/slices/branchSlice'
import { fetchCities } from 'src/redux/slices/citySlice'
import countryList from 'react-select-country-list'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { fetchCompanies } from 'src/redux/slices/companySlice'
import PropTypes from 'prop-types'

const NewDriver = ({ handleChangeDriver, driverData, setDriverData }) => {
  const dispatch = useDispatch()
  const { authUser } = useSelector((state) => state.auth)
  const { driverErrors } = useSelector((state) => state.driver)
  const { fetchingOperations, operations } = useSelector((state) => state.operation)
  const { fetchingBranches, branches } = useSelector((state) => state.branch)
  const { fetchingCompanies, companies } = useSelector((state) => state.company)
  const { cities, fetchingCities } = useSelector((state) => state.city)
  const [defCountry, setDefCountry] = useState(null)
  const [loadDateTime, setLoadDateTime] = useState(null)

  const handleDateTime = (c, date) => {
    setLoadDateTime(date)
    const e = {
      target: {
        name: c,
        value: !isNull(date) ? moment(date).format('YYYY-MM-DD') : '',
      },
    }
    handleChangeDriver(e)
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearDriverError({ type: c, errorType: 'errDriver' }))

    if (c === 'branchId') {
      if (isEmpty(branches)) {
        dispatch(fetchBranches())
      }
    } else if (c === 'cityId') {
      if (isEmpty(cities)) {
        dispatch(fetchCities())
      }
    } else if (c === 'companyId') {
      if (isEmpty(companies)) {
        dispatch(fetchCompanies())
      }
    }
  }

  const handleSelectForm = (c, val) => {
    if (c === 'cityId') {
      const f = val.value
      const countryData = countryList().getLabel(f.country)
      setDefCountry(f ? { label: `${f.country}-${countryData}`, value: f.country } : null)
      setDriverData((state) => ({
        ...state,
        cityId: !isNull(f) ? f.id : '',
        countryId: !isNull(f) ? f.country : '',
      }))
    } else {
      const e = {
        target: {
          name: c,
          value: !isNull(val) ? val.value : '',
        },
      }
      handleChangeDriver(e)
    }
  }

  const countryData = countryList().data

  return (
    <div>
      <CCardBody className="p-0">
        <div className="pageContainer-wrapper">
          <div className="pageBoxSizing-container">
            <div className="row">
              <div className="col-md-3 col-sm-6 col-xs-12">
                <div className="form-group string required driver_name">
                  <label className="control-label string required" htmlFor="driver_name">
                    Driver Name <span>*</span>
                  </label>
                  <CFormInput
                    className="form-control-cst string required"
                    type="text"
                    id="driver_name"
                    name="driverName"
                    value={driverData.driverName}
                    onChange={(e) => handleChangeDriver(e)}
                    invalid={driverErrors && !isEmpty(driverErrors.driverName) ? true : false}
                    onFocus={() =>
                      dispatch(
                        clearDriverError({
                          type: 'driverName',
                          errorType: 'errDriver',
                        }),
                      )
                    }
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {driverErrors.driverName}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 col-xs-12">
                <div className="form-group string optional driver_refno">
                  <label className="control-label string optional" htmlFor="driver_refno">
                    Ref. No
                  </label>
                  <CFormInput
                    className="form-control-cst string optional"
                    type="text"
                    id="driver_refno"
                    name="refno"
                    value={driverData.refno}
                    onChange={(e) => handleChangeDriver(e)}
                    invalid={driverErrors && !isEmpty(driverErrors.refno) ? true : false}
                    onFocus={() =>
                      dispatch(
                        clearDriverError({
                          type: 'refno',
                          errorType: 'errDriver',
                        }),
                      )
                    }
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {driverErrors.refno}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 col-xs-12">
                <div className="form-group date_picker optional driver_birth_date">
                  <label className="control-label date_picker optional" htmlFor="driver_birth_date">
                    Birth Date
                  </label>
                  <DatePicker
                    id="driver_birth_date"
                    selected={loadDateTime}
                    onChange={(date) => handleDateTime('birthDate', date)}
                    className={classNames('form-control form-control-cst ', {
                      'is-invalid': driverErrors && !isEmpty(driverErrors.birthDate),
                    })}
                    style={{ paddingLeft: '2px', paddingRight: '2px' }}
                    dateFormat="yyyy-MM-dd"
                  />
                  <CFormFeedback invalid className="fieldError-cst" style={{ display: 'block' }}>
                    {driverErrors.birthDate}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 col-xs-12">
                <div className="form-group city optional driver_birth_place_id">
                  <label className="control-label city optional" htmlFor="driver_birth_place_id">
                    Birth Place
                  </label>
                  <div>
                    <div className="input-group">
                      <CFormSelect
                        className="form-control-cst chosen_input city-select select2-hidden-accessible"
                        name="birthPlaceId"
                        id="driver_birth_place_id"
                        value={driverData.birthPlaceId}
                        onChange={(e) => handleChangeDriver(e)}
                        invalid={driverErrors && !isEmpty(driverErrors.birthPlaceId) ? true : false}
                        onFocus={() =>
                          dispatch(
                            clearDriverError({
                              type: 'birthPlaceId',
                              errorType: 'errDriver',
                            }),
                          )
                        }
                      >
                        <option value=""></option>
                      </CFormSelect>
                      <CFormFeedback invalid className="fieldError-cst">
                        {driverErrors.birthPlaceId}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 col-sm-4 col-xs-4">
                <div className="form-group select optional driver_phone_os">
                  <label className="control-label select optional" htmlFor="driver_phone_os">
                    Phone Type
                  </label>
                  <CFormSelect
                    className="form-control-cst select optional"
                    name="phoneOs"
                    id="driver_phone_os"
                    value={driverData.phoneOs}
                    onChange={(e) => handleChangeDriver(e)}
                    invalid={driverErrors && !isEmpty(driverErrors.phoneOs) ? true : false}
                    onFocus={() =>
                      dispatch(
                        clearDriverError({
                          type: 'phoneOs',
                          errorType: 'errDriver',
                        }),
                      )
                    }
                  >
                    <option value=""></option>
                    <option value="ios">iPhone</option>
                    <option value="android">Android</option>
                    <option value="windows">windows</option>
                    <option value="blackberry">Blackberry</option>
                    <option value="other">Other</option>
                    <option value="notsp">Not Smart</option>
                  </CFormSelect>
                  <CFormFeedback invalid className="fieldError-cst">
                    {driverErrors.phoneOs}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-md-3 col-sm-8 col-xs-8">
                <div className="form-group string optional driver_gsm">
                  <label className="control-label string optional" htmlFor="driver_gsm">
                    Mobile Phone
                  </label>
                  <CFormInput
                    className="form-control-cst string optional"
                    type="text"
                    name="gsm"
                    id="driver_gsm"
                    value={driverData.gsm}
                    onChange={(e) => handleChangeDriver(e)}
                    invalid={driverErrors && !isEmpty(driverErrors.gsm) ? true : false}
                    onFocus={() =>
                      dispatch(
                        clearDriverError({
                          type: 'gsm',
                          errorType: 'errDriver',
                        }),
                      )
                    }
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {driverErrors.gsm}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group string optional driver_tel">
                  <label className="control-label string optional" htmlFor="driver_tel">
                    Phone
                  </label>
                  <CFormInput
                    className="form-control-cst string optional"
                    type="text"
                    name="tel"
                    id="driver_tel"
                    value={driverData.tel}
                    onChange={(e) => handleChangeDriver(e)}
                    invalid={driverErrors && !isEmpty(driverErrors.tel) ? true : false}
                    onFocus={() =>
                      dispatch(
                        clearDriverError({
                          type: 'tel',
                          errorType: 'errDriver',
                        }),
                      )
                    }
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {driverErrors.tel}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 col-xs-12">
                <div className="form-group file optional driver_avatar">
                  <label className="control-label file optional" htmlFor="driver_avatar">
                    Profile Picture
                  </label>
                  <CFormInput
                    className="form-control-cst file optional"
                    type="file"
                    name="avatar"
                    id="driver_avatar"
                    value={driverData.avatar}
                    onChange={(e) => handleChangeDriver(e)}
                    invalid={driverErrors && !isEmpty(driverErrors.avatar) ? true : false}
                    onFocus={() =>
                      dispatch(
                        clearDriverError({
                          type: 'avatar',
                          errorType: 'errDriver',
                        }),
                      )
                    }
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {driverErrors.avatar}
                  </CFormFeedback>
                </div>
              </div>
            </div>
            <div className="separator"></div>
            <div className="row">
              <div className="col-md-3 col-sm-6 col-xs-12">
                <div className="form-group select optional driver_operation_id">
                  <label className="control-label select optional" htmlFor="driver_operation_id">
                    Operation
                  </label>
                  <div>
                    <div className="input-group">
                      <CFormSelect
                        className="form-control-cst select optional"
                        name="operationId"
                        id="driver_operation_id"
                        value={driverData.operationId}
                        onChange={(e) => handleChangeDriver(e)}
                        invalid={driverErrors && !isEmpty(driverErrors.operationId) ? true : false}
                        onFocus={() =>
                          dispatch(
                            clearDriverError({
                              type: 'operationId',
                              errorType: 'errDriver',
                            }),
                          )
                        }
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
                            <option disabled>Loading...</option>
                          </>
                        )}
                      </CFormSelect>
                      <CFormFeedback invalid className="fieldError-cst">
                        {driverErrors.operationId}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 col-xs-12">
                <div className="form-group select required driver_branch_id">
                  <label className="control-label select required" htmlFor="driver_branch_id">
                    Branch <span>*</span>
                  </label>
                  <div>
                    <div className="input-group">
                      <Select
                        classNamePrefix="cstSelect"
                        isClearable
                        placeholder
                        isSearchable
                        id="branchId"
                        options={
                          branches && !fetchingBranches && branches.length > 0
                            ? branches.map((itm) => ({
                                label: itm.name,
                                value: itm.id,
                              }))
                            : []
                        }
                        defaultValue={{
                          label: `${authUser && authUser.branch.name}`,
                          value: `${authUser && authUser.branch.id}`,
                        }}
                        isLoading={fetchingBranches ? true : false}
                        noOptionsMessage={() => 'No results found'}
                        onChange={(e) => handleSelectForm('branchId', e)}
                        className={classNames('form-control form-control-cst pageCstSelect ', {
                          'is-invalid': driverErrors && !isEmpty(driverErrors.branchId),
                        })}
                        onMenuOpen={(e) => handleSelectFocus('branchId', e)}
                      />
                      <CFormFeedback
                        invalid={driverErrors && !isEmpty(driverErrors.branchId) ? true : false}
                        className="fieldError-cst"
                      >
                        {driverErrors.branchId}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-4 col-xs-4">
                <div className="form-group select optional driver_work_type">
                  <label className="control-label select optional" htmlFor="driver_work_type">
                    Staffed / Hackman
                  </label>
                  <CFormSelect
                    className="form-control-cst select optional"
                    name="workType"
                    id="driver_work_type"
                    value={driverData.workType}
                    onChange={(e) => handleChangeDriver(e)}
                    invalid={driverErrors && !isEmpty(driverErrors.workType) ? true : false}
                    onFocus={() =>
                      dispatch(
                        clearDriverError({
                          type: 'workType',
                          errorType: 'errDriver',
                        }),
                      )
                    }
                  >
                    <option value=""></option>
                    <option value="staffed">Company Staff</option>
                    <option value="staffed_rep">Company bench Staff</option>
                    <option value="contracted">Contracted Driver</option>
                  </CFormSelect>
                  <CFormFeedback invalid className="fieldError-cst">
                    {driverErrors.workType}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-md-3 col-sm-8 col-xs-8">
                <div className="form-group company optional driver_company_id">
                  <label className="control-label company optional" htmlFor="driver_company_id">
                    Driver&apos;s Company
                  </label>
                  <div>
                    <div className="input-group">
                      <Select
                        classNamePrefix="cstSelect"
                        isClearable
                        placeholder
                        isSearchable
                        id="companyId"
                        options={
                          companies && !fetchingCompanies && companies.length > 0
                            ? companies.map((itm) => ({
                                label: itm.name,
                                value: itm.id,
                              }))
                            : []
                        }
                        defaultValue={{
                          label: `${authUser && authUser.company.name}`,
                          value: `${authUser && authUser.company.id}`,
                        }}
                        isLoading={fetchingCompanies ? true : false}
                        noOptionsMessage={() => 'No results found'}
                        onChange={(e) => handleSelectForm('companyId', e)}
                        className={classNames('form-control form-control-cst pageCstSelect ', {
                          'is-invalid': driverErrors && !isEmpty(driverErrors.companyId),
                        })}
                        onMenuOpen={(e) => handleSelectFocus('companyId', e)}
                      />
                      <CFormFeedback
                        invalid={driverErrors && !isEmpty(driverErrors.companyId) ? true : false}
                        className="fieldError-cst"
                      >
                        {driverErrors.companyId}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 col-sm-6 col-xs-12">
                <div className="form-group text optional driver_address">
                  <label className="control-label text optional" htmlFor="driver_address">
                    Addres
                  </label>
                  <CFormTextarea
                    className="form-control-cst text optional"
                    rows="1"
                    name="address"
                    id="driver_address"
                    value={driverData.address}
                    onChange={(e) => handleChangeDriver(e)}
                    invalid={driverErrors && !isEmpty(driverErrors.address) ? true : false}
                    onFocus={() =>
                      dispatch(
                        clearDriverError({
                          type: 'address',
                          errorType: 'errDriver',
                        }),
                      )
                    }
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group city optional driver_city_id">
                  <label className="control-label city optional" htmlFor="driver_city_id">
                    City
                  </label>
                  <div>
                    <div className="input-group">
                      <Select
                        id="place_city_id"
                        classNamePrefix="cstSelect"
                        isClearable
                        placeholder
                        isLoading={fetchingCities ? true : false}
                        isSearchable
                        name="cityId"
                        autoFocus={false}
                        options={
                          cities && !fetchingCities && cities.length > 0
                            ? cities.map((itm) => ({
                                label: itm.name,
                                value: itm,
                              }))
                            : []
                        }
                        className={classNames('form-control form-control-cst pageCstSelect ', {
                          'is-invalid': driverErrors && !isEmpty(driverErrors.cityId),
                        })}
                        noOptionsMessage={() => 'No results found'}
                        onChange={(e) => handleSelectForm('cityId', e)}
                        onMenuOpen={() => handleSelectFocus('cityId')}
                        maxMenuHeight={250}
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {driverErrors.cityId}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group select optional driver_country_id">
                  <label className="control-label select optional" htmlFor="driver_country_id">
                    Country
                  </label>
                  <div className="input-group">
                    <Select
                      className={classNames('form-control form-control-cst pageCstSelect ', {
                        'is-invalid': driverErrors && !isEmpty(driverErrors.countryId),
                      })}
                      classNamePrefix="cstSelect"
                      isClearable
                      placeholder
                      isSearchable
                      value={defCountry}
                      isLoading={countryData && !countryData.length > 0 ? true : false}
                      id="place_country_id"
                      options={
                        countryData && countryData.length > 0
                          ? countryData.map((item) => ({
                              value: item.value,
                              label: `${item.value ? item.value + '-' : ''}${item.label}`,
                            }))
                          : []
                      }
                      noOptionsMessage={() => 'No results found'}
                      onChange={(e) => handleSelectForm('countryId', e)}
                      onMenuOpen={(e) => handleSelectFocus('countryId', e)}
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {driverErrors.countryId}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group string optional driver_passport">
                  <label className="control-label string optional" htmlFor="driver_passport">
                    Passport
                  </label>
                  <CFormInput
                    className="form-control-cst string optional"
                    type="text"
                    name="passport"
                    id="driver_passport"
                    value={driverData.passport}
                    onChange={(e) => handleChangeDriver(e)}
                    invalid={driverErrors && !isEmpty(driverErrors.passport) ? true : false}
                    onFocus={() =>
                      dispatch(
                        clearDriverError({
                          type: 'passport',
                          errorType: 'errDriver',
                        }),
                      )
                    }
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {driverErrors.passport}
                  </CFormFeedback>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CCardBody>
    </div>
  )
}

NewDriver.propTypes = {
  handleChangeDriver: PropTypes.func,
  setDriverData: PropTypes.func,
  driverData: PropTypes.object,
}

export default NewDriver
