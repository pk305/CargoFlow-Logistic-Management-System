import React, { useState } from 'react'
import { AppBreadcrumb } from 'src/components'
import {
  CCard,
  CCardBody,
  CRow,
  CForm,
  CCardFooter,
  CButton,
  CFormInput,
  CFormSelect,
  CFormFeedback,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CFormTextarea,
} from '@coreui/react'
import Select from 'react-select'
import classNames from 'classnames'
import { isEmpty, isNull } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import countryList from 'react-select-country-list'
import { fetchCompanies } from 'src/redux/slices/companySlice'
import { fetchProfitCenters } from 'src/redux/slices/profitCenterSlice'
import { fetchCurrencies } from 'src/redux/slices/currencySlice'
import { createPosition, clearPosError, showPosError } from 'src/redux/slices/positionSlice'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import Noty from 'noty'
import $ from 'jquery'
import { fetchUsers } from 'src/redux/slices/userSlice'
import { fetchBranches } from 'src/redux/slices/branchSlice'
import { createDriver, fetchDrivers, showDriverError } from 'src/redux/slices/driverSlice'
import NewDriver from '../model/NewDriver'

const NewRoadTransport = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { authUser } = useSelector((state) => state.auth)
  const [breadcrumbList] = useState([
    { name: 'Bookings', pathname: '/loadings' },
    { name: 'Planning', pathname: '/transports' },
    { name: 'Road Freight', pathname: '/positions?trans_method=road', active: true },
    { name: 'Air Freight', pathname: '/positions?trans_method=air' },
    { name: 'Sea Freight', pathname: '/positions?trans_method=sea' },
    { name: 'Rail Freight', pathname: '/positions?trans_method=rail' },
    { name: 'Courier Freight', pathname: '/positions?trans_method=courier' },
    { name: 'Tarifs', pathname: '/tariffs' },
  ])
  const { branches, fetchingBranches } = useSelector((state) => state.branch)
  const [positionData, setPositionData] = useState({
    contractType: 'owned',
    operationId: `${authUser && authUser.operation ? authUser.operation.id : ''}`,
    branchId: `${authUser && authUser.branch.id}`,
    vesselCode: '',
    truckCode: '',
    driverName: '',
    driverTel: '',
    truckType: '',
    supplierId: '',
    freightPrice: '0.0',
    freightCurr: '',
    vesselId: '',
    depOdemeter: '0',
    driverId: '',
    arvOdemeter: '0',
    totalFuel: '0.0',
    driverPayment: '0.0',
    extref: '',
    emptyTruck: 0,
    status: '',
    waybillType: '',
    waybillDate: '',
    projectId: '',
    departureDate: '',
    depPlaceName: '',
    depCityid: '',
    depCountryId: '',
    arrivalDate: '',
    routeNotes: '',
    routeId: '',
    arvCountryId: '',
    arvPlaceName: '',
    operatorId: `${authUser && authUser.uuid}`,
    arvCityId: '',
    routeKm: '',
    notes: '',
  })
  const { fetchingVehicles, vehicles } = useSelector((state) => state.vehicle)
  const { companies } = useSelector((state) => state.company)
  const { fetchingOperations, operations } = useSelector((state) => state.operation)
  const { fetchingUsers, users } = useSelector((state) => state.user)
  const { profitCenters } = useSelector((state) => state.profitCenter)
  const { creatingPosition, positionErrors } = useSelector((state) => state.position)
  const { currencies, fetchingCurrencies } = useSelector((state) => state.currency)
  const [waybillDate, setWaybillDate] = useState(null)
  const [departureDate, setDepartureDate] = useState(null)
  const [arrivalDate, setArrivalDate] = useState(null)
  const [modalVehicle, setModalVehicle] = useState(false)
  const [modalDriver, setModalDriver] = useState(false)
  const { fetchingDrivers, drivers, creatingDriver } = useSelector((state) => state.driver)
  const [driverData, setDriverData] = useState({
    driverName: '',
    refno: '',
    birthDate: '',
    birthPlaceId: '',
    branchId: `${authUser && authUser.branch.id}`,
    phoneOs: '',
    gsm: '',
    tel: '',
    avatar: '',
    address: '',
    workType: '',
    operationId: '',
    cityId: '',
    countryId: '',
    companyId: `${authUser && authUser.company.id}`,
    passport: '',
  })

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setPositionData({
      ...positionData,
      [name]: value,
    })
  }

  const handleChangeDriver = (e) => {
    const { name, value } = e.target
    setDriverData({
      ...driverData,
      [name]: value,
    })
  }

  const handleSelectForm = (c, val) => {
    const e = {
      target: {
        name: c,
        value: !isNull(val) ? val.value : '',
      },
    }
    handleChangeForm(e)
  }

  const handleDateTime = (c, date) => {
    if (c === 'waybillDate') {
      setWaybillDate(date)
    } else if (c === 'departureDate') {
      setDepartureDate(date)
    } else if (c === 'arrivalDate') {
      setArrivalDate(date)
    }
    const e = {
      target: {
        name: c,
        value: !isNull(date) ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '',
      },
    }
    handleChangeForm(e)
  }

  const handleModalVehicle = (e) => {
    e.preventDefault()
    setModalVehicle(true)
  }

  const noOptionVehicle = (e) => {
    return (
      <>
        No results found
        {/* eslint-disable-next-line */}
        <a href="#" className="text-r" onClick={(e) => handleModalVehicle(e)}>
          Add New Item
        </a>
      </>
    )
  }

  const handleModalDriver = (e) => {
    e.preventDefault()
    setModalDriver(true)
  }

  const noOptionDriver = (e) => {
    return (
      <>
        No results found
        {/* eslint-disable-next-line */}
        <a href="#" className="text-r" onClick={(e) => handleModalDriver(e)}>
          Add New Item
        </a>
      </>
    )
  }

  const closeModVehicle = () => {
    setModalVehicle(false)
  }

  const closeModDriver = () => {
    setModalDriver(false)
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearPosError({ type: c, errorType: 'errPosition' }))

    if (c === 'vehicleCompanyId') {
      if (isEmpty(companies)) {
        dispatch(fetchCompanies())
      }
    } else if (c === 'profitCenterId') {
      if (isEmpty(profitCenters)) {
        dispatch(fetchProfitCenters())
      }
    } else if (c === 'driverId') {
      if (isEmpty(drivers)) {
        dispatch(fetchDrivers())
      }
    } else if (c === 'freightCurr') {
      if (isEmpty(currencies)) {
        dispatch(fetchCurrencies())
      }
    } else if (c === 'operatorId') {
      if (isEmpty(users)) {
        dispatch(fetchUsers())
      }
    } else if (c === 'branchId') {
      if (isEmpty(branches)) {
        dispatch(fetchBranches())
      }
    }
  }

  const handleSubmitVehicle = (e) => {
    e.preventDefault()
  }

  const handleSubmitPosition = async (e) => {
    e.preventDefault()
    const form = $('#new_position')
    if (form.length > 0) {
      if (positionData.companyId === '') {
        dispatch(showPosError({ type: 'companyId', errorType: 'errQuote' }))
        $('html, body').animate({ scrollTop: 0 }, 300)
        return false
      }
    }
    //form data
    let arrForm = Object.entries(positionData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }

    const resData = await dispatch(createPosition(formData)).unwrap()
    if (resData) {
      console.log(resData)
      new Noty({
        text: 'Truck has been created successfully.',
        type: 'alert',
        layout: 'topRight',
      }).show()
      history.push(`/positions?trans_method=road`)
    }
  }

  const clearDriverData = () => {
    setDriverData({
      driverName: '',
      refno: '',
      birthDate: '',
      birthPlaceId: '',
      branchId: `${authUser && authUser.branch.id}`,
      phoneOs: '',
      gsm: '',
      tel: '',
      avatar: '',
      address: '',
      workType: '',
      operationId: '',
      cityId: '',
      countryId: '',
      companyId: `${authUser && authUser.company.id}`,
      passport: '',
    })
  }

  const handleSubmitDriver = async (e) => {
    e.preventDefault()
    const form = $('#new_driver')
    if (form.length > 0) {
      if (driverData.driverName === '') {
        dispatch(showDriverError({ type: 'driverName', errorType: 'errDriver' }))
        $('html, body').animate({ scrollTop: 0 }, 300)
        return false
      }
    }
    //form data
    let arrForm = Object.entries(driverData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }
    const resData = await dispatch(createDriver(formData)).unwrap()
    if (resData) {
      new Noty({
        type: 'alert',
        layout: 'topRight',
        id: `succ${resData.id}`,
        text: 'Driver has been created succesfully',
      }).show()
      clearDriverData()
      closeModDriver()
    }
  }

  const countryData = countryList().data

  return (
    <div>
      <div className="cstContainerDef">
        <AppBreadcrumb items={breadcrumbList} />
      </div>
      <div className="pageContainer newBookings">
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <CCard className="cardCustom">
            <div className="card-header">
              <div className="toolBarContainer">
                <div className="customHeaderContainer">
                  <div className="customHeaderContainer-body">
                    <div className="symbolWrapper">
                      <span className="symbol-label">
                        <i className="fa fa-truck icon-2x"></i>
                      </span>
                    </div>
                  </div>
                  <div className="customHeaderContainer-footer">
                    <div className="card-title">
                      <h3 className="cstCardbodyHeaderTitle">New Transport</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CForm id="new_position" onSubmit={(e) => handleSubmitPosition(e)}>
              <CCardBody className="p-0">
                <div className="pageContainer-wrapper">
                  <div className="pageBoxSizing-container">
                    <CRow>
                      <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group position_contract_type">
                          <label className="control-label" htmlFor="position_contract_type">
                            Contract
                          </label>
                          <CFormSelect
                            className="form-control-cst"
                            id="position_contract_type"
                            name="contractType"
                            invalid={
                              positionErrors && !isEmpty(positionErrors.contractType) ? true : false
                            }
                            value={positionData.contractType}
                            onChange={(e) => handleChangeForm(e)}
                          >
                            <option value="owned">Our Own Vehicle</option>
                            <option value="rented">Contracted Vehicle</option>
                            <option value="unknown">Vehicle Not-Specified</option>
                          </CFormSelect>
                          <CFormFeedback invalid className="fieldError-cst">
                            {positionErrors.contractType}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group string position_extref">
                          <label className="control-label string" htmlFor="position_extref">
                            Booking Ref.
                          </label>
                          <CFormInput
                            className="form-control-cst string"
                            type="text"
                            id="position_extref"
                            name="extref"
                            invalid={
                              positionErrors && !isEmpty(positionErrors.extref) ? true : false
                            }
                            value={positionData.extref}
                            onChange={(e) => handleChangeForm(e)}
                          />
                          <CFormFeedback
                            invalid={
                              positionErrors && !isEmpty(positionErrors.extref) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {positionErrors.extref}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group boolean position_empty_truck">
                          <label className="boolean" htmlFor="position_empty_truck">
                            Empty Trailer ?
                          </label>
                          <div className="checkbox-custom checkbox-primary">
                            <input
                              className="boolean"
                              type="checkbox"
                              id="position_empty_truck"
                              name="emptyTruck"
                              value={positionData.emptyTruck}
                              onChange={(e) => handleChangeForm(e)}
                            />
                            <CFormFeedback
                              invalid={
                                positionErrors && !isEmpty(positionErrors.emptyTruck) ? true : false
                              }
                              className="fieldError-cst"
                            >
                              {positionErrors.emptyTruck}
                            </CFormFeedback>
                          </div>
                        </div>
                      </div>
                      {/* <pre>{JSON.stringify(operations && null, 2)}</pre> */}
                      <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group position_operation_id">
                          <label className="control-label" htmlFor="position_operation_id">
                            Operation
                          </label>
                          <CFormSelect
                            className="form-control-cst"
                            id="position_operation_id"
                            name="operationId"
                            invalid={
                              positionErrors && !isEmpty(positionErrors.operationId) ? true : false
                            }
                            value={positionData.operationId}
                            onChange={(e) => handleChangeForm(e)}
                          >
                            {!fetchingOperations ? (
                              operations && operations.length > 0 ? (
                                <>
                                  <option value=""></option>
                                  {operations
                                    .filter(
                                      (x) =>
                                        x.transMethod === 'road' &&
                                        x.name !== 'Fleet Management Team',
                                    )
                                    .map((itm, i) => (
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
                          <CFormFeedback
                            invalid={
                              positionErrors && !isEmpty(positionErrors.operationId) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {positionErrors.operationId}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group position_operator_id">
                          <label className="control-label" htmlFor="position_operator_id">
                            Operator
                          </label>
                          <div className="input-group">
                            <Select
                              id="position_operator_id"
                              classNamePrefix="cstSelect"
                              isClearable
                              placeholder
                              isLoading={fetchingUsers ? true : false}
                              isSearchable
                              name="cityId"
                              menuPlacement="auto"
                              defaultValue={{
                                label: `${authUser.name}`,
                                value: `${authUser.uuid}`,
                              }}
                              options={
                                users && !fetchingUsers && users.length > 0
                                  ? users
                                      .filter((x) => x.operation.id === authUser.operation.id)
                                      .map((itm) => ({
                                        label: itm.name,
                                        value: itm,
                                      }))
                                  : []
                              }
                              className={classNames(
                                'form-control form-control-cst pageCstSelect ',
                                {
                                  'is-invalid':
                                    positionErrors && !isEmpty(positionErrors.operatorId),
                                },
                              )}
                              noOptionsMessage={() => 'No results found.'}
                              onChange={(e) => handleSelectForm('operatorId', e)}
                              onMenuOpen={(e) => handleSelectFocus('operatorId', e)}
                            />
                            <CFormFeedback
                              invalid={
                                positionErrors && !isEmpty(positionErrors.operatorId) ? true : false
                              }
                              className="fieldError-cst"
                            >
                              {positionErrors.operatorId}
                            </CFormFeedback>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group position_branch_id">
                          <label className="control-label" htmlFor="position_branch_id">
                            Branch
                          </label>
                          <div className="input-group">
                            <Select
                              id="position_branch_id"
                              classNamePrefix="cstSelect"
                              isClearable={true}
                              placeholder
                              isLoading={fetchingBranches ? true : false}
                              isSearchable
                              name="branchId"
                              autoFocus={false}
                              defaultValue={{
                                label: `${authUser.branch.name}`,
                                value: `${authUser.branch.id}`,
                              }}
                              options={
                                branches && !fetchingBranches && branches.length > 0
                                  ? branches.map((itm) => ({
                                      label: itm.name,
                                      value: itm.id,
                                    }))
                                  : []
                              }
                              className={classNames(
                                'form-control form-control-cst pageCstSelect ',
                                {
                                  'is-invalid': positionErrors && !isEmpty(positionErrors.branchId),
                                },
                              )}
                              noOptionsMessage={() => 'No results found'}
                              onChange={(e) => handleSelectForm('branchId', e)}
                              onMenuOpen={(e) => handleSelectFocus('branchId')}
                            />
                            <CFormFeedback invalid className="fieldError-cst">
                              {positionErrors.branchId}
                            </CFormFeedback>
                          </div>
                        </div>
                      </div>
                    </CRow>
                    <div className="rented" style={{ display: 'none' }}>
                      <div className="row">
                        <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                          <div className="form-group string position_vessel_code">
                            <label className="control-label string" htmlFor="position_vessel_code">
                              Trailer
                            </label>
                            <div>
                              <div className="input-group">
                                <Select
                                  id="position_vessel_code"
                                  classNamePrefix="cstSelect"
                                  isClearable={true}
                                  placeholder
                                  isLoading={fetchingVehicles ? true : false}
                                  isSearchable
                                  name="vesselCode"
                                  autoFocus={false}
                                  options={
                                    vehicles && !fetchingVehicles && vehicles.length > 0
                                      ? vehicles.map((itm) => ({
                                          label: itm.name,
                                          value: itm.id,
                                        }))
                                      : []
                                  }
                                  className={classNames(
                                    'form-control form-control-cst pageCstSelect ',
                                    {
                                      'is-invalid':
                                        positionErrors && !isEmpty(positionErrors.vesselCode),
                                    },
                                  )}
                                  menuIsOpen={true}
                                  noOptionsMessage={(e) => noOptionVehicle(e)}
                                  onChange={(e) => handleSelectForm('vesselCode', e)}
                                  onMenuOpen={(e) => handleSelectFocus('vesselCode', e)}
                                />
                                <CFormFeedback
                                  invalid={
                                    positionErrors && !isEmpty(positionErrors.vesselCode)
                                      ? true
                                      : false
                                  }
                                  className="fieldError-cst"
                                >
                                  {positionErrors.vesselCode}
                                </CFormFeedback>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                          <div className="form-group string position_truck_code">
                            <label className="control-label string" htmlFor="position_truck_code">
                              2.Transport Means
                            </label>
                            <CFormInput
                              className="form-control-cst string"
                              type="text"
                              id="position_truck_code"
                              name="truckCode"
                              invalid={
                                positionErrors && !isEmpty(positionErrors.truckCode) ? true : false
                              }
                              value={positionData.truckCode}
                              onChange={(e) => handleChangeForm(e)}
                            />
                            <CFormFeedback
                              invalid={
                                positionErrors && !isEmpty(positionErrors.truckCode) ? true : false
                              }
                              className="fieldError-cst"
                            >
                              {positionErrors.truckCode}
                            </CFormFeedback>
                          </div>
                        </div>
                        <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                          <div className="form-group position_truck_type">
                            <label className="control-label" htmlFor="position_truck_type">
                              Truck Type
                            </label>
                            <CFormSelect
                              className="form-control-cst"
                              id="position_truck_type"
                              name="truckType"
                              invalid={
                                positionErrors && !isEmpty(positionErrors.truckType) ? true : false
                              }
                              value={positionData.truckType}
                              onChange={(e) => handleChangeForm(e)}
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
                              <option value="swapbody">swapbody</option>
                              <option value="minivan">Minivan</option>
                              <option value="frigo">Frigo</option>
                              <option value="flatbed">flatbed</option>
                              <option value="tarpaulin_truck">tarpaulin_truck</option>
                              <option value="box_container">box_container</option>
                            </CFormSelect>
                            <CFormFeedback
                              invalid={
                                positionErrors && !isEmpty(positionErrors.truckType) ? true : false
                              }
                              className="fieldError-cst"
                            >
                              {positionErrors.truckType}
                            </CFormFeedback>
                          </div>
                        </div>
                        <div className="col-12 col-sm-8 col-md-2 col-lg-2 col-xl-2">
                          <div className="form-group string position_driver_name">
                            <label className="control-label string" htmlFor="position_driver_name">
                              Driver Name
                            </label>
                            <CFormInput
                              className="form-control-cst string"
                              type="text"
                              id="position_driver_name"
                              name="driverName"
                              invalid={
                                positionErrors && !isEmpty(positionErrors.driverName) ? true : false
                              }
                              value={positionData.driverName}
                              onChange={(e) => handleChangeForm(e)}
                            />
                            <CFormFeedback
                              invalid={
                                positionErrors && !isEmpty(positionErrors.driverName) ? true : false
                              }
                              className="fieldError-cst"
                            >
                              {positionErrors.driverName}
                            </CFormFeedback>
                          </div>
                        </div>
                        <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                          <div className="form-group string position_driver_tel">
                            <label className="control-label string" htmlFor="position_driver_tel">
                              Driver Phone
                            </label>
                            <CFormInput
                              className="form-control-cst string"
                              type="text"
                              id="position_driver_tel"
                              name="driverTel"
                              invalid={
                                positionErrors && !isEmpty(positionErrors.driverTel) ? true : false
                              }
                              value={positionData.driverTel}
                              onChange={(e) => handleChangeForm(e)}
                            />
                            <CFormFeedback
                              invalid={
                                positionErrors && !isEmpty(positionErrors.driverTel) ? true : false
                              }
                              className="fieldError-cst"
                            >
                              {positionErrors.driverTel}
                            </CFormFeedback>
                          </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                          <div className="form-group company position_supplier_id">
                            <label className="control-label company" htmlFor="position_supplier_id">
                              Supplier Company
                            </label>
                            <div>
                              <div className="input-group">
                                <CFormSelect
                                  className="form-control-cst company-select"
                                  id="position_supplier_id"
                                  name="supplierId"
                                  invalid={
                                    positionErrors && !isEmpty(positionErrors.supplierId)
                                      ? true
                                      : false
                                  }
                                  value={positionData.supplierId}
                                  onChange={(e) => handleChangeForm(e)}
                                >
                                  <option value="" data-select2-id="17"></option>
                                </CFormSelect>
                                <CFormFeedback
                                  invalid={
                                    positionErrors && !isEmpty(positionErrors.supplierId)
                                      ? true
                                      : false
                                  }
                                  className="fieldError-cst"
                                >
                                  {positionErrors.supplierId}
                                </CFormFeedback>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                          <div className="form-group decimal position_freight_price">
                            <label
                              className="control-label decimal"
                              htmlFor="position_freight_price"
                            >
                              Freight Price
                            </label>
                            <CFormInput
                              className="form-control-cst numeric decimal"
                              type="number"
                              step="any"
                              id="position_freight_price"
                              name="freightPrice"
                              invalid={
                                positionErrors && !isEmpty(positionErrors.freightPrice)
                                  ? true
                                  : false
                              }
                              value={positionData.freightPrice}
                              onChange={(e) => handleChangeForm(e)}
                            />
                            <CFormFeedback
                              invalid={
                                positionErrors && !isEmpty(positionErrors.freightPrice)
                                  ? true
                                  : false
                              }
                              className="fieldError-cst"
                            >
                              {positionErrors.freightPrice}
                            </CFormFeedback>
                          </div>
                        </div>
                        <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                          <div className="form-group position_freight_curr">
                            <label className="control-label" htmlFor="position_freight_curr">
                              Currency
                            </label>
                            <div>
                              <div className="input-group">
                                <Select
                                  className={classNames(
                                    'form-control form-control-cst pageCstSelect ',
                                    {
                                      'is-invalid':
                                        positionErrors && !isEmpty(positionErrors.freightCurr),
                                    },
                                  )}
                                  classNamePrefix="cstSelect"
                                  isClearable
                                  placeholder
                                  isSearchable
                                  id="position_freight_curr"
                                  menuPlacement="auto"
                                  options={
                                    currencies && currencies.length > 0
                                      ? [{ label: '', value: '' }, ...currencies].map((item) => ({
                                          value: item.id,
                                          label: item.name,
                                        }))
                                      : []
                                  }
                                  noOptionsMessage={() => 'No results found'}
                                  isLoading={fetchingCurrencies ? true : false}
                                  onChange={(e) => handleSelectForm('freightCurr', e)}
                                  onMenuOpen={() => handleSelectFocus('freightCurr')}
                                />
                                <CFormFeedback invalid className="fieldError-cst">
                                  {positionErrors.freightCurr}
                                </CFormFeedback>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="owned row">
                      <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group vehicle position_vessel_id">
                          <label className="control-label vehicle" htmlFor="position_vessel_id">
                            Trailer
                          </label>
                          <div>
                            <div className="input-group">
                              <Select
                                id="position_vessel_id"
                                classNamePrefix="cstSelect"
                                isClearable={true}
                                placeholder
                                isLoading={fetchingVehicles ? true : false}
                                isSearchable
                                name="vesselId"
                                autoFocus={false}
                                options={
                                  vehicles && !fetchingVehicles && vehicles.length > 0
                                    ? vehicles.map((itm) => ({
                                        label: itm.name,
                                        value: itm.id,
                                      }))
                                    : []
                                }
                                className={classNames(
                                  'form-control form-control-cst pageCstSelect ',
                                  {
                                    'is-invalid':
                                      positionErrors && !isEmpty(positionErrors.vesselId),
                                  },
                                )}
                                noOptionsMessage={(e) => noOptionVehicle(e)}
                                onChange={(e) => handleSelectForm('vesselId', e)}
                                onMenuOpen={(e) => handleSelectFocus('vesselId', e)}
                              />
                              <CFormFeedback
                                invalid={
                                  positionErrors && !isEmpty(positionErrors.vesselId) ? true : false
                                }
                                className="fieldError-cst"
                              >
                                {positionErrors.vesselId}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group vehicle position_truck_id">
                          <label className="control-label vehicle" htmlFor="position_truck_id">
                            Tractor Unit
                          </label>
                          <div>
                            <div className="input-group">
                              <CFormSelect
                                className="form-control-cst vehicle-select"
                                name="position[truck_id]"
                                id="position_truck_id"
                                data-select2-id="position_truck_id"
                                tabIndex="-1"
                                aria-hidden="true"
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value="" data-select2-id="21"></option>
                              </CFormSelect>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-8 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group driver position_driver_id">
                          <label className="control-label driver" htmlFor="position_driver_id">
                            Driver
                          </label>
                          <div>
                            <div className="input-group">
                              <Select
                                id="position_driver_id"
                                classNamePrefix="cstSelect"
                                isClearable={true}
                                placeholder
                                isLoading={fetchingDrivers ? true : false}
                                isSearchable
                                name="driverId"
                                autoFocus={false}
                                options={
                                  drivers && !fetchingDrivers && drivers.length > 0
                                    ? drivers.map((itm) => ({
                                        label: itm.name,
                                        value: itm.id,
                                      }))
                                    : []
                                }
                                className={classNames(
                                  'form-control form-control-cst pageCstSelect ',
                                  {
                                    'is-invalid':
                                      positionErrors && !isEmpty(positionErrors.driverId),
                                  },
                                )}
                                noOptionsMessage={(e) => noOptionDriver(e)}
                                onChange={(e) => handleSelectForm('driverId', e)}
                                onMenuOpen={(e) => handleSelectFocus('driverId', e)}
                              />
                              <CFormFeedback
                                invalid={
                                  positionErrors && !isEmpty(positionErrors.driverId) ? true : false
                                }
                                className="fieldError-cst"
                              >
                                {positionErrors.driverId}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group integer position_dep_odemeter">
                              <label
                                className="control-label integer"
                                htmlFor="position_dep_odemeter"
                              >
                                Departure Km
                              </label>
                              <CFormInput
                                className="form-control-cst  "
                                type="number"
                                step="1"
                                id="position_dep_odemeter"
                                name="depOdemeter"
                                invalid={
                                  positionErrors && !isEmpty(positionErrors.depOdemeter)
                                    ? true
                                    : false
                                }
                                value={positionData.depOdemeter}
                                onChange={(e) => handleChangeForm(e)}
                              />
                              <CFormFeedback invalid className="fieldError-cst">
                                {positionErrors.depOdemeter}
                              </CFormFeedback>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group integer position_arv_odemeter">
                              <label
                                className="control-label integer"
                                htmlFor="position_arv_odemeter"
                              >
                                Arrival Km
                              </label>
                              <CFormInput
                                className="form-control-cst numeric integer"
                                type="number"
                                step="1"
                                id="position_arv_odemeter"
                                name="arvOdemeter"
                                invalid={
                                  positionErrors && !isEmpty(positionErrors.arvOdemeter)
                                    ? true
                                    : false
                                }
                                value={positionData.arvOdemeter}
                                onChange={(e) => handleChangeForm(e)}
                              />
                              <CFormFeedback
                                invalid={
                                  positionErrors && !isEmpty(positionErrors.arvOdemeter)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {positionErrors.arvOdemeter}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group decimal position_total_fuel">
                              <label
                                className="control-label decimal"
                                htmlFor="position_total_fuel"
                              >
                                Total Fuel
                              </label>
                              <CFormInput
                                className="form-control-cst numeric decimal"
                                type="number"
                                step="any"
                                id="position_total_fuel"
                                name="totalFuel"
                                invalid={
                                  positionErrors && !isEmpty(positionErrors.totalFuel)
                                    ? true
                                    : false
                                }
                                value={positionData.totalFuel}
                                onChange={(e) => handleChangeForm(e)}
                              />
                              <CFormFeedback
                                invalid={
                                  positionErrors && !isEmpty(positionErrors.totalFuel)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {positionErrors.totalFuel}
                              </CFormFeedback>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group decimal position_driver_payment">
                              <label
                                className="control-label decimal"
                                htmlFor="position_driver_payment"
                              >
                                Travel Payment
                              </label>
                              <CFormInput
                                className="form-control-cst numeric decimal"
                                type="number"
                                step="any"
                                id="position_driver_payment"
                                name="driverPayment"
                                invalid={
                                  positionErrors && !isEmpty(positionErrors.driverPayment)
                                    ? true
                                    : false
                                }
                                value={positionData.driverPayment}
                                onChange={(e) => handleChangeForm(e)}
                              />
                              <CFormFeedback
                                invalid={
                                  positionErrors && !isEmpty(positionErrors.driverPayment)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {positionErrors.driverPayment}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group position_status">
                          <label className="control-label" htmlFor="position_status">
                            Status
                          </label>
                          <CFormSelect
                            className="form-control-cst"
                            id="position_status"
                            name="status"
                            invalid={
                              positionErrors && !isEmpty(positionErrors.status) ? true : false
                            }
                            value={positionData.status}
                            onChange={(e) => handleChangeForm(e)}
                          >
                            <option value=""></option>
                            <option value="planning">Planning</option>
                            <option value="active">In Transit</option>
                            <option value="delivered">Completed / Delivered</option>
                          </CFormSelect>
                          <CFormFeedback
                            invalid={
                              positionErrors && !isEmpty(positionErrors.status) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {positionErrors.status}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group position_waybill_type">
                          <label className="control-label" htmlFor="position_waybill_type">
                            Transit Type
                          </label>
                          <CFormSelect
                            className="form-control-cst"
                            id="position_waybill_type"
                            name="waybillType"
                            invalid={
                              positionErrors && !isEmpty(positionErrors.waybillType) ? true : false
                            }
                            value={positionData.waybillType}
                            onChange={(e) => handleChangeForm(e)}
                          >
                            <option value=""></option>
                            <option value="t1">T1/T2</option>
                            <option value="tir_karnesi">Truck Report Card</option>
                            <option value="irsaliye">Waybill</option>
                            <option value="ata_belgesi">ATA Certificate</option>
                          </CFormSelect>
                          <CFormFeedback
                            invalid={
                              positionErrors && !isEmpty(positionErrors.waybillType) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {positionErrors.waybillType}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group string position_waybill_no">
                          <label className="control-label string" htmlFor="position_waybill_no">
                            Transit Doc. No
                          </label>
                          <CFormInput
                            className="form-control-cst string"
                            type="text"
                            id="position_waybill_no"
                            name="waybillNo"
                            invalid={
                              positionErrors && !isEmpty(positionErrors.waybillNo) ? true : false
                            }
                            value={positionData.waybillNo}
                            onChange={(e) => handleChangeForm(e)}
                          />
                          <CFormFeedback
                            invalid={
                              positionErrors && !isEmpty(positionErrors.waybillNo) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {positionErrors.waybillNo}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group date_picker position_waybill_date">
                          <label
                            className="control-label date_picker"
                            htmlFor="position_waybill_date"
                          >
                            Transit Doc. Date
                          </label>
                          <DatePicker
                            selected={waybillDate}
                            onChange={(date) => handleDateTime('waybillDate', date)}
                            className="form-control form-control-cst"
                            style={{ paddingLeft: '2px', paddingRight: '2px' }}
                            dateFormat="MMMM d, yyyy h:mm"
                          />
                          <CFormFeedback
                            invalid={
                              positionErrors && !isEmpty(positionErrors.waybillDate) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {positionErrors.waybillDate}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2"></div>
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group position_project_id">
                          <label className="control-label" htmlFor="position_project_id">
                            Project
                          </label>
                          <CFormSelect
                            className="form-control-cst"
                            data-plugin="select2"
                            id="position_project_id"
                            name="projectId"
                            invalid={
                              positionErrors && !isEmpty(positionErrors.projectId) ? true : false
                            }
                            value={positionData.projectId}
                            onChange={(e) => handleChangeForm(e)}
                          >
                            <option value=""></option>
                          </CFormSelect>
                          <CFormFeedback
                            invalid={
                              positionErrors && !isEmpty(positionErrors.projectId) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {positionErrors.projectId}
                          </CFormFeedback>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <h4 className="titleHeading">Departure &amp; Arrival Ports</h4>
                      </div>
                    </div>
                    <div className="row" id="departure_partial">
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group datetime_picker position_departure_date">
                          <label
                            className="control-label datetime_picker"
                            htmlFor="position_departure_date"
                          >
                            Departure Date
                          </label>
                          <DatePicker
                            selected={departureDate}
                            onChange={(date) => handleDateTime('departureDate', date)}
                            className="form-control form-control-cst"
                            style={{ paddingLeft: '2px', paddingRight: '2px' }}
                            dateFormat="MMMM d, yyyy h:mm"
                            id="position_departure_date"
                          />
                          <CFormFeedback
                            invalid={
                              positionErrors && !isEmpty(positionErrors.departureDate)
                                ? true
                                : false
                            }
                            className="fieldError-cst"
                          >
                            {positionErrors.departureDate}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-12 col-xs-12">
                        <div className="form-group string position_dep_place_name">
                          <label className="control-label string" htmlFor="position_dep_place_name">
                            Departure Place
                          </label>
                          <div>
                            <div className="input-group">
                              <CFormInput
                                className="form-control-cst string"
                                type="text"
                                id="position_dep_place_name"
                                name="depPlaceName"
                                invalid={
                                  positionErrors && !isEmpty(positionErrors.depPlaceName)
                                    ? true
                                    : false
                                }
                                value={positionData.depPlaceName}
                                onChange={(e) => handleChangeForm(e)}
                              />
                              <CFormFeedback
                                invalid={
                                  positionErrors && !isEmpty(positionErrors.depPlaceName)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {positionErrors.depPlaceName}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-4 col-md-3 col-lg-3 col-xl-3">
                        <div className="form-group city position_dep_city_id">
                          <label className="control-label city" htmlFor="position_dep_city_id">
                            Departure City
                          </label>
                          <div>
                            <div className="input-group">
                              <CFormSelect
                                className="form-control-cst chosen_input city-select"
                                id="position_dep_city_id"
                                name="depCityid"
                                invalid={
                                  positionErrors && !isEmpty(positionErrors.depCityid)
                                    ? true
                                    : false
                                }
                                value={positionData.depCityid}
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value="" data-select2-id="25"></option>
                              </CFormSelect>
                              <CFormFeedback
                                invalid={
                                  positionErrors && !isEmpty(positionErrors.depCityid)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {positionErrors.depCityid}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group position_dep_country_id">
                          <label className="control-label" htmlFor="position_dep_country_id">
                            Collection Country
                          </label>
                          <div>
                            <div className="input-group">
                              <Select
                                className={classNames(
                                  'form-control form-control-cst pageCstSelect ',
                                  {
                                    'is-invalid':
                                      positionErrors && !isEmpty(positionErrors.depCountryId),
                                  },
                                )}
                                classNamePrefix="cstSelect"
                                isClearable
                                placeholder="-Select-"
                                isSearchable
                                isLoading={countryData && !countryData.length > 0 ? true : false}
                                id="position_dep_country_id"
                                options={
                                  countryData && countryData.length > 0
                                    ? countryData.map((item) => ({
                                        value: item.value,
                                        label: `${item.value ? item.value + ' -' : ''}  ${
                                          item.label
                                        }`,
                                      }))
                                    : []
                                }
                                noOptionsMessage={() => 'No results found'}
                                onChange={(e) => handleSelectForm('depCountryId', e)}
                                onMenuOpen={(e) => handleSelectFocus('depCountryId', e)}
                              />
                              <CFormFeedback
                                invalid={
                                  positionErrors && !isEmpty(positionErrors.depCountryId)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {positionErrors.depCountryId}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row" id="arrival_partial">
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group datetime_picker position_arrival_date">
                          <label
                            className="control-label datetime_picker"
                            htmlFor="position_arrival_date"
                          >
                            Arrival Date
                          </label>
                          <DatePicker
                            selected={arrivalDate}
                            onChange={(date) => handleDateTime('arrivalDate', date)}
                            className="form-control form-control-cst"
                            style={{ paddingLeft: '2px', paddingRight: '2px' }}
                            dateFormat="MMMM d, yyyy h:mm"
                            id="position_arrival_date"
                          />
                          <CFormFeedback
                            invalid={
                              positionErrors && !isEmpty(positionErrors.arrivalDate) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {positionErrors.arrivalDate}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-12 col-xs-12">
                        <div className="form-group string position_arv_place_name">
                          <label className="control-label string" htmlFor="position_arv_place_name">
                            Arrival Place
                          </label>
                          <div>
                            <div className="input-group">
                              <CFormInput
                                className="form-control-cst string"
                                type="text"
                                id="position_arv_place_name"
                                name="arvPlaceName"
                                invalid={
                                  positionErrors && !isEmpty(positionErrors.arvPlaceName)
                                    ? true
                                    : false
                                }
                                value={positionData.arvPlaceName}
                                onChange={(e) => handleChangeForm(e)}
                              />
                              <CFormFeedback
                                invalid={
                                  positionErrors && !isEmpty(positionErrors.arvPlaceName)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {positionErrors.arvPlaceName}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-4 col-md-3 col-lg-3 col-xl-3">
                        <div className="form-group city position_arv_city_id">
                          <label className="control-label city" htmlFor="position_arv_city_id">
                            Arrival City
                          </label>
                          <div>
                            <div className="input-group">
                              <CFormSelect
                                className="form-control-cst chosen_input city-select"
                                id="position_arv_city_id"
                                name="arvCityId"
                                invalid={
                                  positionErrors && !isEmpty(positionErrors.arvCityId)
                                    ? true
                                    : false
                                }
                                value={positionData.arvCityId}
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value=""></option>
                              </CFormSelect>
                              <CFormFeedback
                                invalid={
                                  positionErrors && !isEmpty(positionErrors.arvCityId)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {positionErrors.arvCityId}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group position_arv_country_id">
                          <label className="control-label" htmlFor="position_arv_country_id">
                            Delivery Country
                          </label>
                          <div>
                            <div className="input-group">
                              <Select
                                className={classNames(
                                  'form-control form-control-cst pageCstSelect ',
                                  {
                                    'is-invalid':
                                      positionErrors && !isEmpty(positionErrors.arvCountryId),
                                  },
                                )}
                                classNamePrefix="cstSelect"
                                isClearable
                                placeholder="-Select-"
                                isSearchable
                                isLoading={countryData && !countryData.length > 0 ? true : false}
                                id="position_arv_country_id"
                                options={
                                  countryData && countryData.length > 0
                                    ? countryData.map((item) => ({
                                        value: item.value,
                                        label: `${item.value ? item.value + ' -' : ''}  ${
                                          item.label
                                        }`,
                                      }))
                                    : []
                                }
                                noOptionsMessage={() => 'No results found'}
                                onChange={(e) => handleSelectForm('arvCountryId', e)}
                                onFocus={(e) => handleSelectFocus('arvCountryId', e)}
                              />
                              <CFormFeedback
                                invalid={
                                  positionErrors && !isEmpty(positionErrors.arvCountryId)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {positionErrors.arvCountryId}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group position_route_id">
                          <label className="control-label" htmlFor="position_route_id">
                            Route
                          </label>
                          <div>
                            <div className="input-group">
                              <CFormSelect
                                className="form-control-cst"
                                data-plugin="select2"
                                id="position_route_id"
                                name="routeId"
                                invalid={
                                  positionErrors && !isEmpty(positionErrors.routeId) ? true : false
                                }
                                value={positionData.routeId}
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value="" data-select2-id="14"></option>
                              </CFormSelect>
                              <CFormFeedback
                                invalid={
                                  positionErrors && !isEmpty(positionErrors.routeId) ? true : false
                                }
                                className="fieldError-cst"
                              >
                                {positionErrors.routeId}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                        <div className="form-group string position_route_notes">
                          <label className="control-label string" htmlFor="position_route_notes">
                            Route Notes
                          </label>
                          <CFormInput
                            className="form-control-cst string"
                            type="text"
                            id="position_route_notes"
                            name="routeNotes"
                            invalid={
                              positionErrors && !isEmpty(positionErrors.routeNotes) ? true : false
                            }
                            value={positionData.routeNotes}
                            onChange={(e) => handleChangeForm(e)}
                          />
                          <CFormFeedback
                            invalid={
                              positionErrors && !isEmpty(positionErrors.routeNotes) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {positionErrors.routeNotes}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group decimal position_route_km">
                          <label className="control-label decimal" htmlFor="position_route_km">
                            Route Km
                          </label>
                          <CFormInput
                            className="form-control-cst numeric decimal"
                            type="number"
                            step="any"
                            id="position_route_km"
                            name="routeKm"
                            invalid={
                              positionErrors && !isEmpty(positionErrors.routeKm) ? true : false
                            }
                            value={positionData.routeKm}
                            onChange={(e) => handleChangeForm(e)}
                          />
                          <CFormFeedback
                            invalid={
                              positionErrors && !isEmpty(positionErrors.routeKm) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {positionErrors.routeKm}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        <div className="form-group text position_notes">
                          <label className="control-label text" htmlFor="position_notes">
                            Notes
                          </label>
                          <CFormTextarea
                            className="form-control-cst"
                            rows="1"
                            id="position_notes"
                            name="notes"
                            invalid={
                              positionErrors && !isEmpty(positionErrors.notes) ? true : false
                            }
                            value={positionData.notes}
                            onChange={(e) => handleChangeForm(e)}
                          ></CFormTextarea>
                          <CFormFeedback
                            invalid={
                              positionErrors && !isEmpty(positionErrors.notes) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {positionErrors.notes}
                          </CFormFeedback>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CCardBody>
              <CCardFooter className="cardCustom-footer">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <CButton
                      type="submit"
                      color="success"
                      className="btn-default btn btn-success"
                      disabled={creatingPosition ? true : false}
                    >
                      {creatingPosition ? (
                        'Processing...'
                      ) : (
                        <span>
                          Save <i className="fa fa-check" />
                        </span>
                      )}
                    </CButton>
                  </div>
                </div>
              </CCardFooter>
            </CForm>
          </CCard>
        </div>
      </div>

      {/* vehicle modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        portal={false}
        scrollable
        size="xl"
        visible={modalVehicle}
        onClose={() => closeModVehicle()}
      >
        <CForm id="new_vehicle" noValidate="novalidate" onSubmit={(e) => handleSubmitVehicle(e)}>
          <CModalHeader>
            <CModalTitle>General Information</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div>vehicle</div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => closeModVehicle()}>
              Close
            </CButton>
            <CButton color="primary" type="submit">
              Create Vehicle
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      {/* driver modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        portal={false}
        transition={false}
        size="xl"
        visible={modalDriver}
        onClose={() => closeModDriver()}
      >
        <CForm id="new_driver" noValidate="novalidate" onSubmit={(e) => handleSubmitDriver(e)}>
          <CModalHeader>
            <CModalTitle>New Driver</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <NewDriver
              handleChangeDriver={handleChangeDriver}
              driverData={driverData}
              setDriverData={setDriverData}
            />
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => closeModDriver()}>
              Close
            </CButton>
            <CButton color="primary" type="submit" disabled={creatingDriver ? true : false}>
              Save <i className="fa fa-check" />
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </div>
  )
}

export default NewRoadTransport
