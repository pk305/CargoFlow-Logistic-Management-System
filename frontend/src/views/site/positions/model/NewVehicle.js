import React, { useState } from 'react'
import { CFormInput, CFormSelect, CFormFeedback } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { clearDriverError } from 'src/redux/slices/driverSlice'
import { isEmpty, isNull } from 'lodash'
import Select from 'react-select'
import classNames from 'classnames'
import { fetchBranches } from 'src/redux/slices/branchSlice'
import { fetchCities } from 'src/redux/slices/citySlice'
import countryList from 'react-select-country-list'
// import DatePicker from 'react-datepicker'
import moment from 'moment'
import { fetchCompanies } from 'src/redux/slices/companySlice'
// import $ from 'jquery'
// import Noty from 'noty'
import { useHistory } from 'react-router-dom'

const NewVehicle = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { authUser } = useSelector((state) => state.auth)
  const { fetchingVehicles, vehicles } = useSelector((state) => state.vehicle)
  const { fetchingUsers, users } = useSelector((state) => state.user)
  const { positionErrors } = useSelector((state) => state.position)
  const { fetchingOperations, operations } = useSelector((state) => state.operation)
  const { fetchingBranches, branches } = useSelector((state) => state.branch)
  const { fetchingCompanies, companies } = useSelector((state) => state.company)
  const { cities, fetchingCities } = useSelector((state) => state.city)
  const [defCountry, setDefCountry] = useState(null)
  const [loadDateTime, setLoadDateTime] = useState(null)
  const { profitCenters, fetchingProfitCenters } = useSelector((state) => state.profitCenter)

  const handleChangeForm = (e) => {
    // const { name, value } = e.target
    // setDriverData({
    //   ...driverData,
    //   [name]: value,
    // })
  }

  const handleDateTime = (c, date) => {
    setLoadDateTime(date)
    const e = {
      target: {
        name: c,
        value: !isNull(date) ? moment(date).format('YYYY-MM-DD') : '',
      },
    }
    handleChangeForm(e)
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
      //   setDriverData((state) => ({
      //     ...state,
      //     cityId: !isNull(f) ? f.id : '',
      //     countryId: !isNull(f) ? f.country : '',
      //   }))
    } else {
      const e = {
        target: {
          name: c,
          value: !isNull(val) ? val.value : '',
        },
      }
      handleChangeForm(e)
    }
  }

  const countryData = countryList().data

  return (
    <div>
      <div className="row">
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <h4 className="titleHeading">Vehicle Info</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group vehicle_code">
                <label className="control-label" htmlFor="vehicle_code">
                  Plate / Code <span>*</span>
                </label>
                <CFormInput
                  className="form-control-cst vehicle_name_changer"
                  type="text"
                  name="vehicle[code]"
                  id="vehicle_code"
                />
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group select required vehicle_vehicle_class">
                <label className="control-label select required" htmlFor="vehicle_vehicle_class">
                  Vehicle class <span>*</span>
                </label>
                <CFormSelect
                  className="form-control-cst select required"
                  name="vehicle[vehicle_class]"
                  id="vehicle_vehicle_class"
                >
                  <option value=""></option>
                  <option value="trailer">Trailer</option>
                  <option value="truck">Truck</option>
                  <option value="lorry">Lorry</option>
                  <option value="van">Van</option>
                  <option value="forklift">Forklift</option>
                  <option value="bus">Bus</option>
                  <option value="car">Otomobile</option>
                  <option value="tanker">Tanker</option>
                  <option value="tractor">Tractor</option>
                  <option value="romork">Römork</option>
                  <option value="crane">Crane</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="container">Container</option>
                  <option value="wagon">Wagon</option>
                  <option value="swapbody">Swapbody</option>
                  <option value="minivan">Minivan</option>
                  <option value="frigo">Frigo</option>
                  <option value="flatbed">Flatbed Trailer</option>
                  <option value="tarpaulin_truck">Tarpaulin Truck</option>
                </CFormSelect>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-4 col-xs-12">
              <div className="form-group string optional vehicle_brand">
                <label className="control-label string optional" htmlFor="vehicle_brand">
                  Brand
                </label>
                <CFormInput
                  className="form-control-cst string optional vehicle_name_changer"
                  type="text"
                  name="vehicle[brand]"
                  id="vehicle_brand"
                />
              </div>
            </div>
            <div className="col-md-4 col-sm-4 col-xs-12">
              <div className="form-group string optional vehicle_model">
                <label className="control-label string optional" htmlFor="vehicle_model">
                  Model
                </label>
                <CFormInput
                  className="form-control-cst string optional vehicle_name_changer"
                  type="text"
                  name="vehicle[model]"
                  id="vehicle_model"
                />
              </div>
            </div>
            <div className="col-md-4 col-sm-4 col-xs-12">
              <div className="form-group integer optional vehicle_model_year">
                <label className="control-label integer optional" htmlFor="vehicle_model_year">
                  Year
                </label>
                <CFormInput
                  className="form-control-cst numeric integer optional vehicle_name_changer"
                  type="number"
                  step="1"
                  name="vehicle[model_year]"
                  id="vehicle_model_year"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group string optional vehicle_vehicle_type">
                <label className="control-label string optional" htmlFor="vehicle_vehicle_type">
                  Vehicle type
                </label>
                <CFormInput
                  className="form-control-cst string optional vehicle_name_changer"
                  type="text"
                  name="vehicle[vehicle_type]"
                  id="vehicle_vehicle_type"
                />
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group vehicle optional vehicle_covehicle_id">
                <label className="control-label vehicle optional" htmlFor="vehicle_covehicle_id">
                  Connected Vehicle
                </label>
                <div>
                  <div className="input-group">
                    <Select
                      id="vehicle_covehicle_id"
                      classNamePrefix="cstSelect"
                      isClearable={true}
                      placeholder
                      isLoading={fetchingVehicles ? true : false}
                      isSearchable
                      name="covehicleId"
                      autoFocus={false}
                      options={
                        vehicles && !fetchingVehicles && vehicles.length > 0
                          ? vehicles.map((itm) => ({
                              label: itm.name,
                              value: itm.id,
                            }))
                          : []
                      }
                      className={classNames('form-control form-control-cst pageCstSelect ', {
                        'is-invalid': positionErrors && !isEmpty(positionErrors.covehicleId),
                      })}
                      //   noOptionsMessage={(e) => noOptionVehicle(e)}
                      onChange={(e) => handleSelectForm('covehicleId', e)}
                      onMenuOpen={(e) => handleSelectFocus('covehicleId', e)}
                    />
                    <CFormFeedback
                      invalid={
                        positionErrors && !isEmpty(positionErrors.covehicleId) ? true : false
                      }
                      className="fieldError-cst"
                    >
                      {positionErrors.covehicleId}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group vehicle_name">
                <label className="control-label" htmlFor="vehicle_name">
                  Name <span>*</span>
                </label>
                <CFormInput
                  className="form-control-cst"
                  type="text"
                  name="vehicle[name]"
                  id="vehicle_name"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <h4 className="titleHeading">Other Info</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group select optional vehicle_owner_type">
                <label className="control-label select optional" htmlFor="vehicle_owner_type">
                  Owned/Rented
                </label>
                <CFormSelect
                  className="form-control-cst select optional"
                  name="vehicle[owner_type]"
                  id="vehicle_owner_type"
                >
                  <option value="owned">Owned</option>
                  <option value="rented">Rented</option>
                  <option value="staff">Staff Vehicle</option>
                </CFormSelect>
              </div>
            </div>
            <div id="person_id" className="col-md-6 col-sm-6 col-xs-12 hide">
              <div className="form-group person optional vehicle_person_id">
                <label className="control-label person optional" htmlFor="vehicle_person_id">
                  Staff
                </label>
                <div>
                  <div className="input-group">
                    <CFormSelect
                      className="form-control-cst"
                      data-url="/roster/autocompletes.json?&amp;model=Hr::Person"
                      data-newurl="/people/new"
                      data-placeholder=""
                      data-plugin="lookup"
                      data-minimuminputlength="0"
                      name="vehicle[person_id]"
                      id="vehicle_person_id"
                    >
                      <option value="" data-select2-id="575"></option>
                    </CFormSelect>
                  </div>
                </div>
              </div>
            </div>
            <div id="driver_id" className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group driver optional vehicle_driver_id">
                <label className="control-label driver optional" htmlFor="vehicle_driver_id">
                  Driver
                </label>
                <div>
                  <div className="input-group">
                    <Select
                      id="vehicle_driver_id"
                      classNamePrefix="cstSelect"
                      isClearable={true}
                      placeholder
                      isLoading={fetchingVehicles ? true : false}
                      isSearchable
                      name="vehicleDriverId"
                      autoFocus={false}
                      options={
                        vehicles && !fetchingVehicles && vehicles.length > 0
                          ? vehicles.map((itm) => ({
                              label: itm.name,
                              value: itm.id,
                            }))
                          : []
                      }
                      className={classNames('form-control form-control-cst pageCstSelect ', {
                        'is-invalid': positionErrors && !isEmpty(positionErrors.vehicleDriverId),
                      })}
                      //   noOptionsMessage={(e) => noOptionDriver(e)}
                      onChange={(e) => handleSelectForm('vehicleDriverId', e)}
                      onMenuOpen={(e) => handleSelectFocus('vehicleDriverId', e)}
                    />
                    <CFormFeedback
                      invalid={
                        positionErrors && !isEmpty(positionErrors.vehicleDriverId) ? true : false
                      }
                      className="fieldError-cst"
                    >
                      {positionErrors.vehicleDriverId}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group company optional vehicle_company_id">
                <label
                  className="control-label company optional"
                  data-profile-link="/companies/890189"
                  htmlFor="vehicle_company_id"
                >
                  Owner Company
                </label>
                <div>
                  <div className="input-group">
                    <Select
                      id="vehicle_company_id"
                      classNamePrefix="cstSelect"
                      isClearable={true}
                      placeholder
                      isLoading={fetchingCompanies ? true : false}
                      isSearchable
                      name="vehicleCompanyId"
                      autoFocus={false}
                      options={
                        companies && !fetchingCompanies && companies.length > 0
                          ? companies.map((itm) => ({
                              label: itm.name,
                              value: itm.id,
                            }))
                          : []
                      }
                      maxMenuHeight={130}
                      className={classNames('form-control form-control-cst pageCstSelect ', {
                        'is-invalid': positionErrors && !isEmpty(positionErrors.vehicleCompanyId),
                      })}
                      noOptionsMessage={() => 'No results found'}
                      onChange={(e) => handleSelectForm('vehicleCompanyId', e)}
                      onMenuOpen={(e) => handleSelectFocus('vehicleCompanyId', e)}
                    />
                    <CFormFeedback
                      invalid={
                        positionErrors && !isEmpty(positionErrors.vehicleCompanyId) ? true : false
                      }
                      className="fieldError-cst"
                    >
                      {positionErrors.vehicleCompanyId}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group select required vehicle_country_id">
                <label className="control-label select required" htmlFor="vehicle_country_id">
                  Country <span>*</span>
                </label>
                <div>
                  <div className="input-group">
                    <Select
                      className={classNames('form-control form-control-cst pageCstSelect ', {
                        'is-invalid': positionErrors && !isEmpty(positionErrors.vehicleCountryId),
                      })}
                      classNamePrefix="cstSelect"
                      isClearable
                      placeholder
                      isSearchable
                      isLoading={countryData && !countryData.length > 0 ? true : false}
                      id="vehicle_country_id"
                      options={
                        countryData && countryData.length > 0
                          ? countryData.map((item) => ({
                              value: item.value,
                              label: `${item.value ? item.value + ' -' : ''}  ${item.label}`,
                            }))
                          : []
                      }
                      maxMenuHeight={130}
                      noOptionsMessage={() => 'No results found'}
                      onChange={(e) => handleSelectForm('vehicleCountryId', e)}
                      onFocus={(e) => handleSelectFocus('vehicleCountryId', e)}
                    />
                    <CFormFeedback
                      invalid={
                        positionErrors && !isEmpty(positionErrors.vehicleCountryId) ? true : false
                      }
                      className="fieldError-cst"
                    >
                      {positionErrors.vehicleCountryId}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group select required vehicle_branch_id">
                <label className="control-label select required" htmlFor="vehicle_branch_id">
                  Branch <span>*</span>
                </label>
                <CFormSelect
                  className="form-control-cst select required"
                  name="vehicle[branch_id]"
                  id="vehicle_branch_id"
                >
                  <option value=""></option>
                  <option selected="selected" value="1380">
                    Head Office
                  </option>
                </CFormSelect>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group select optional vehicle_operation_id">
                <label className="control-label select optional" htmlFor="vehicle_operation_id">
                  Operation
                </label>
                <CFormSelect
                  className="form-control-cst select optional"
                  name="vehicle[operation_id]"
                  id="vehicle_operation_id"
                >
                  {!fetchingOperations ? (
                    operations && operations.length > 0 ? (
                      operations.map((itm, i) => (
                        <option key={i} value={itm.id}>
                          {itm.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value=""></option>
                        <option disabled>No results found.</option>
                      </>
                    )
                  ) : (
                    <option>Loading...</option>
                  )}
                </CFormSelect>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group select optional vehicle_operator_id">
                <label className="control-label select optional" htmlFor="vehicle_operator_id">
                  Vehicle Supervisor
                </label>
                <CFormSelect
                  className="form-control-cst select optional"
                  name="vehicle[operator_id]"
                  id="vehicle_operator_id"
                >
                  {!fetchingUsers ? (
                    users && users.length > 0 ? (
                      users.map((itm, i) => (
                        <option key={i} value={itm.id}>
                          {itm.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value=""></option>
                        <option disabled>No results found.</option>
                      </>
                    )
                  ) : (
                    <option>Loading...</option>
                  )}
                </CFormSelect>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group profit_center optional vehicle_profit_center_id">
                <label
                  className="control-label profit_center optional"
                  htmlFor="vehicle_profit_center_id"
                >
                  Profit Center
                </label>
                <div>
                  <div className="input-group">
                    <Select
                      className={classNames('form-control form-control-cst pageCstSelect ', {
                        'is-invalid': positionErrors && !isEmpty(positionErrors.profitCenterId),
                      })}
                      classNamePrefix="cstSelect"
                      isClearable
                      placeholder
                      isSearchable
                      id="vehicle_profit_center_id"
                      menuPlacement="top"
                      options={
                        profitCenters && profitCenters.length > 0
                          ? [{ label: '', value: '' }, ...profitCenters].map((item) => ({
                              value: item.id,
                              label: item.name,
                            }))
                          : []
                      }
                      noOptionsMessage={() => 'No results found'}
                      isLoading={fetchingProfitCenters ? true : false}
                      onChange={(e) => handleSelectForm('profitCenterId', e)}
                      onMenuOpen={(e) => handleSelectFocus('profitCenterId', e)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <h4 className="titleHeading">Vehicle Info</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group vehicle_code">
                <label className="control-label" htmlFor="vehicle_code">
                  Plate / Code <span>*</span>
                </label>
                <CFormInput
                  className="form-control-cst vehicle_name_changer"
                  type="text"
                  name="vehicle[code]"
                  id="vehicle_code"
                />
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group select required vehicle_vehicle_class">
                <label className="control-label select required" htmlFor="vehicle_vehicle_class">
                  Vehicle class <span>*</span>
                </label>
                <CFormSelect
                  className="form-control-cst select required"
                  name="vehicle[vehicle_class]"
                  id="vehicle_vehicle_class"
                >
                  <option value=""></option>
                  <option value="trailer">Trailer</option>
                  <option value="truck">Truck</option>
                  <option value="lorry">Lorry</option>
                  <option value="van">Van</option>
                  <option value="forklift">Forklift</option>
                  <option value="bus">Bus</option>
                  <option value="car">Otomobile</option>
                  <option value="tanker">Tanker</option>
                  <option value="tractor">Tractor</option>
                  <option value="romork">Römork</option>
                  <option value="crane">Crane</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="container">Container</option>
                  <option value="wagon">Wagon</option>
                  <option value="swapbody">Swapbody</option>
                  <option value="minivan">Minivan</option>
                  <option value="frigo">Frigo</option>
                  <option value="flatbed">Flatbed Trailer</option>
                  <option value="tarpaulin_truck">Tarpaulin Truck</option>
                </CFormSelect>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-4 col-xs-12">
              <div className="form-group string optional vehicle_brand">
                <label className="control-label string optional" htmlFor="vehicle_brand">
                  Brand
                </label>
                <CFormInput
                  className="form-control-cst string optional vehicle_name_changer"
                  type="text"
                  name="vehicle[brand]"
                  id="vehicle_brand"
                />
              </div>
            </div>
            <div className="col-md-4 col-sm-4 col-xs-12">
              <div className="form-group string optional vehicle_model">
                <label className="control-label string optional" htmlFor="vehicle_model">
                  Model
                </label>
                <CFormInput
                  className="form-control-cst string optional vehicle_name_changer"
                  type="text"
                  name="vehicle[model]"
                  id="vehicle_model"
                />
              </div>
            </div>
            <div className="col-md-4 col-sm-4 col-xs-12">
              <div className="form-group integer optional vehicle_model_year">
                <label className="control-label integer optional" htmlFor="vehicle_model_year">
                  Year
                </label>
                <CFormInput
                  className="form-control-cst numeric integer optional vehicle_name_changer"
                  type="number"
                  step="1"
                  name="vehicle[model_year]"
                  id="vehicle_model_year"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group string optional vehicle_vehicle_type">
                <label className="control-label string optional" htmlFor="vehicle_vehicle_type">
                  Vehicle type
                </label>
                <CFormInput
                  className="form-control-cst string optional vehicle_name_changer"
                  type="text"
                  name="vehicle[vehicle_type]"
                  id="vehicle_vehicle_type"
                />
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group vehicle optional vehicle_covehicle_id">
                <label className="control-label vehicle optional" htmlFor="vehicle_covehicle_id">
                  Connected Vehicle
                </label>
                <div>
                  <div className="input-group">
                    <Select
                      id="vehicle_covehicle_id"
                      classNamePrefix="cstSelect"
                      isClearable={true}
                      placeholder
                      isLoading={fetchingVehicles ? true : false}
                      isSearchable
                      name="covehicleId"
                      autoFocus={false}
                      options={
                        vehicles && !fetchingVehicles && vehicles.length > 0
                          ? vehicles.map((itm) => ({
                              label: itm.name,
                              value: itm.id,
                            }))
                          : []
                      }
                      className={classNames('form-control form-control-cst pageCstSelect ', {
                        'is-invalid': positionErrors && !isEmpty(positionErrors.covehicleId),
                      })}
                      //   noOptionsMessage={(e) => noOptionVehicle(e)}
                      onChange={(e) => handleSelectForm('covehicleId', e)}
                      onMenuOpen={(e) => handleSelectFocus('covehicleId', e)}
                    />
                    <CFormFeedback
                      invalid={
                        positionErrors && !isEmpty(positionErrors.covehicleId) ? true : false
                      }
                      className="fieldError-cst"
                    >
                      {positionErrors.covehicleId}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group vehicle_name">
                <label className="control-label" htmlFor="vehicle_name">
                  Name <span>*</span>
                </label>
                <CFormInput
                  className="form-control-cst"
                  type="text"
                  name="vehicle[name]"
                  id="vehicle_name"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <h4 className="titleHeading">Other Info</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group select optional vehicle_owner_type">
                <label className="control-label select optional" htmlFor="vehicle_owner_type">
                  Owned/Rented
                </label>
                <CFormSelect
                  className="form-control-cst select optional"
                  name="vehicle[owner_type]"
                  id="vehicle_owner_type"
                >
                  <option value="owned">Owned</option>
                  <option value="rented">Rented</option>
                  <option value="staff">Staff Vehicle</option>
                </CFormSelect>
              </div>
            </div>
            <div id="person_id" className="col-md-6 col-sm-6 col-xs-12 hide">
              <div className="form-group person optional vehicle_person_id">
                <label className="control-label person optional" htmlFor="vehicle_person_id">
                  Staff
                </label>
                <div>
                  <div className="input-group">
                    <CFormSelect
                      className="form-control-cst"
                      data-url="/roster/autocompletes.json?&amp;model=Hr::Person"
                      data-newurl="/people/new"
                      data-placeholder=""
                      data-plugin="lookup"
                      data-minimuminputlength="0"
                      name="vehicle[person_id]"
                      id="vehicle_person_id"
                    >
                      <option value="" data-select2-id="575"></option>
                    </CFormSelect>
                  </div>
                </div>
              </div>
            </div>
            <div id="driver_id" className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group driver optional vehicle_driver_id">
                <label className="control-label driver optional" htmlFor="vehicle_driver_id">
                  Driver
                </label>
                <div>
                  <div className="input-group">
                    <Select
                      id="vehicle_driver_id"
                      classNamePrefix="cstSelect"
                      isClearable={true}
                      placeholder
                      isLoading={fetchingVehicles ? true : false}
                      isSearchable
                      name="vehicleDriverId"
                      autoFocus={false}
                      options={
                        vehicles && !fetchingVehicles && vehicles.length > 0
                          ? vehicles.map((itm) => ({
                              label: itm.name,
                              value: itm.id,
                            }))
                          : []
                      }
                      className={classNames('form-control form-control-cst pageCstSelect ', {
                        'is-invalid': positionErrors && !isEmpty(positionErrors.vehicleDriverId),
                      })}
                      //   noOptionsMessage={(e) => noOptionDriver(e)}
                      onChange={(e) => handleSelectForm('vehicleDriverId', e)}
                      onMenuOpen={(e) => handleSelectFocus('vehicleDriverId', e)}
                    />
                    <CFormFeedback
                      invalid={
                        positionErrors && !isEmpty(positionErrors.vehicleDriverId) ? true : false
                      }
                      className="fieldError-cst"
                    >
                      {positionErrors.vehicleDriverId}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group company optional vehicle_company_id">
                <label
                  className="control-label company optional"
                  data-profile-link="/companies/890189"
                  htmlFor="vehicle_company_id"
                >
                  Owner Company
                </label>
                <div>
                  <div className="input-group">
                    <Select
                      id="vehicle_company_id"
                      classNamePrefix="cstSelect"
                      isClearable={true}
                      placeholder
                      isLoading={fetchingCompanies ? true : false}
                      isSearchable
                      name="vehicleCompanyId"
                      autoFocus={false}
                      options={
                        companies && !fetchingCompanies && companies.length > 0
                          ? companies.map((itm) => ({
                              label: itm.name,
                              value: itm.id,
                            }))
                          : []
                      }
                      maxMenuHeight={130}
                      className={classNames('form-control form-control-cst pageCstSelect ', {
                        'is-invalid': positionErrors && !isEmpty(positionErrors.vehicleCompanyId),
                      })}
                      noOptionsMessage={() => 'No results found'}
                      onChange={(e) => handleSelectForm('vehicleCompanyId', e)}
                      onMenuOpen={(e) => handleSelectFocus('vehicleCompanyId', e)}
                    />
                    <CFormFeedback
                      invalid={
                        positionErrors && !isEmpty(positionErrors.vehicleCompanyId) ? true : false
                      }
                      className="fieldError-cst"
                    >
                      {positionErrors.vehicleCompanyId}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group select required vehicle_country_id">
                <label className="control-label select required" htmlFor="vehicle_country_id">
                  Country <span>*</span>
                </label>
                <div>
                  <div className="input-group">
                    <Select
                      className={classNames('form-control form-control-cst pageCstSelect ', {
                        'is-invalid': positionErrors && !isEmpty(positionErrors.vehicleCountryId),
                      })}
                      classNamePrefix="cstSelect"
                      isClearable
                      placeholder
                      isSearchable
                      isLoading={countryData && !countryData.length > 0 ? true : false}
                      id="vehicle_country_id"
                      options={
                        countryData && countryData.length > 0
                          ? countryData.map((item) => ({
                              value: item.value,
                              label: `${item.value ? item.value + ' -' : ''}  ${item.label}`,
                            }))
                          : []
                      }
                      maxMenuHeight={130}
                      noOptionsMessage={() => 'No results found'}
                      onChange={(e) => handleSelectForm('vehicleCountryId', e)}
                      onFocus={(e) => handleSelectFocus('vehicleCountryId', e)}
                    />
                    <CFormFeedback
                      invalid={
                        positionErrors && !isEmpty(positionErrors.vehicleCountryId) ? true : false
                      }
                      className="fieldError-cst"
                    >
                      {positionErrors.vehicleCountryId}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group select required vehicle_branch_id">
                <label className="control-label select required" htmlFor="vehicle_branch_id">
                  Branch <span>*</span>
                </label>
                <CFormSelect
                  className="form-control-cst select required"
                  name="vehicle[branch_id]"
                  id="vehicle_branch_id"
                >
                  <option value=""></option>
                  <option selected="selected" value="1380">
                    Head Office
                  </option>
                </CFormSelect>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group select optional vehicle_operation_id">
                <label className="control-label select optional" htmlFor="vehicle_operation_id">
                  Operation
                </label>
                <CFormSelect
                  className="form-control-cst select optional"
                  name="vehicle[operation_id]"
                  id="vehicle_operation_id"
                >
                  {!fetchingOperations ? (
                    operations && operations.length > 0 ? (
                      operations.map((itm, i) => (
                        <option key={i} value={itm.id}>
                          {itm.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value=""></option>
                        <option disabled>No results found.</option>
                      </>
                    )
                  ) : (
                    <option>Loading...</option>
                  )}
                </CFormSelect>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group select optional vehicle_operator_id">
                <label className="control-label select optional" htmlFor="vehicle_operator_id">
                  Vehicle Supervisor
                </label>
                <CFormSelect
                  className="form-control-cst select optional"
                  name="vehicle[operator_id]"
                  id="vehicle_operator_id"
                >
                  {!fetchingUsers ? (
                    users && users.length > 0 ? (
                      users.map((itm, i) => (
                        <option key={i} value={itm.id}>
                          {itm.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value=""></option>
                        <option disabled>No results found.</option>
                      </>
                    )
                  ) : (
                    <option>Loading...</option>
                  )}
                </CFormSelect>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="form-group profit_center optional vehicle_profit_center_id">
                <label
                  className="control-label profit_center optional"
                  htmlFor="vehicle_profit_center_id"
                >
                  Profit Center
                </label>
                <div>
                  <div className="input-group">
                    <Select
                      className={classNames('form-control form-control-cst pageCstSelect ', {
                        'is-invalid': positionErrors && !isEmpty(positionErrors.profitCenterId),
                      })}
                      classNamePrefix="cstSelect"
                      isClearable
                      placeholder
                      isSearchable
                      id="vehicle_profit_center_id"
                      menuPlacement="top"
                      options={
                        profitCenters && profitCenters.length > 0
                          ? [{ label: '', value: '' }, ...profitCenters].map((item) => ({
                              value: item.id,
                              label: item.name,
                            }))
                          : []
                      }
                      noOptionsMessage={() => 'No results found'}
                      isLoading={fetchingProfitCenters ? true : false}
                      onChange={(e) => handleSelectForm('profitCenterId', e)}
                      onMenuOpen={(e) => handleSelectFocus('profitCenterId', e)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewVehicle
