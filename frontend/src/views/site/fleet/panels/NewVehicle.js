import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CForm,
  CCardFooter,
  CButton,
  CFormInput,
  CFormSelect,
  CFormFeedback,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { AppBreadcrumb } from 'src/components'
import { clearVehicleError, createVehicle, showVehicleError } from 'src/redux/slices/vehicleSlice'
import { isEmpty } from 'lodash'
import $ from 'jquery'
import Noty from 'noty'
import { useHistory } from 'react-router-dom'

const NewVehicle = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [breadcrumbList] = useState([
    { name: 'Vehicles', pathname: '/vehicles', active: true },
    { name: 'Drivers', pathname: '/drivers' },
    { name: 'Periodic Documents', pathname: '/periodocs' },
    { name: 'Service Logs', pathname: '/servicelogs' },
    { name: 'Expense Forms', pathname: '/expense_forms?person_type=driver' },
    { name: 'Fuel Logs', pathname: '/fuellogs?scope=vehiclel' },
    { name: 'Gate Actions', pathname: '/gate_actions' },
    { name: 'Facility Management', pathname: '/facility_managements' },
    { name: 'RoRo Tickets', pathname: '/transdocs?view_scope=roro' },
  ])
  const [vehicleData, setVehicleData] = useState({
    code: '',
    brand: '',
    vehicleClass: '',
    modelYear: '',
    vehicleType: '',
    covehicleId: '',
    vehicleName: '',
  })
  const { creatingVehicle, vehicleErrors } = useSelector((state) => state.vehicle)

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setVehicleData({
      ...vehicleData,
      [name]: value,
    })
  }

  const handleSubmitVehicle = async (e) => {
    e.preventDefault()
    const form = $('#new_vehicle')
    if (form.length > 0) {
      if (vehicleData.code === '') {
        dispatch(showVehicleError({ type: 'code', errorType: 'errVehicle' }))
        $('html, body').animate({ scrollTop: 0 }, 300)
        return false
      }
    }
    //form data
    let arrForm = Object.entries(vehicleData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }

    const resData = await dispatch(createVehicle(formData)).unwrap()
    if (resData) {
      new Noty({
        type: 'alert',
        layout: 'topRight',
        id: `succ${resData.id}`,
        text: 'Vehicle has been created succesfully',
      }).show()
      history.push(`/vehicles/${resData.linkId}`)
    }
  }

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
                        <i className="fa fa-truck icon-20"></i>
                      </span>
                    </div>
                  </div>
                  <div className="customHeaderContainer-footer">
                    <div className="card-title">
                      <h3 className="card-label">New Vehicle</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CForm id="new_vehicle" onSubmit={(e) => handleSubmitVehicle(e)}>
              <CCardBody className="p-0">
                <div className="pageContainer-wrapper">
                  <div className="pageBoxSizing-container">
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
                              <label
                                className="control-label string required"
                                htmlFor="vehicle_code"
                              >
                                Plate / Code <span title="required">*</span>
                              </label>
                              <CFormInput
                                className="form-control-cst"
                                type="text"
                                name="code"
                                id="vehicle_code"
                                value={vehicleData.code}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  vehicleErrors && !isEmpty(vehicleErrors.code) ? true : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearVehicleError({
                                      type: 'code',
                                      errorType: 'errVehicle',
                                    }),
                                  )
                                }
                              />
                              <CFormFeedback invalid className="fieldError-cst">
                                {vehicleErrors.code}
                              </CFormFeedback>
                            </div>
                          </div>
                          <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="form-group select required vehicle_vehicle_class">
                              <label
                                className="control-label select required"
                                htmlFor="vehicle_vehicle_class"
                              >
                                Vehicle className <span title="required">*</span>
                              </label>
                              <CFormSelect
                                className="form-control-cst select required"
                                name="vehicleClass"
                                id="vehicle_vehicle_class"
                                value={vehicleData.vehicleClass}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  vehicleErrors && !isEmpty(vehicleErrors.vehicleClass)
                                    ? true
                                    : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearVehicleError({
                                      type: 'vehicleClass',
                                      errorType: 'errVehicle',
                                    }),
                                  )
                                }
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
                                <option value="box_container">45&apos;FT HCPW Box Container</option>
                              </CFormSelect>
                              <CFormFeedback invalid className="fieldError-cst">
                                {vehicleErrors.vehicleClass}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-4 col-sm-4 col-xs-12">
                            <div className="form-group string optional vehicle_brand">
                              <label
                                className="control-label string optional"
                                htmlFor="vehicle_brand"
                              >
                                Brand
                              </label>
                              <CFormInput
                                className="form-control-cst string optional vehicle_name_changer"
                                type="text"
                                name="brand"
                                id="vehicle_brand"
                                value={vehicleData.brand}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  vehicleErrors && !isEmpty(vehicleErrors.brand) ? true : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearVehicleError({
                                      type: 'brand',
                                      errorType: 'errVehicle',
                                    }),
                                  )
                                }
                              />
                              <CFormFeedback invalid className="fieldError-cst">
                                {vehicleErrors.brand}
                              </CFormFeedback>
                            </div>
                          </div>
                          <div className="col-md-4 col-sm-4 col-xs-12">
                            <div className="form-group string optional vehicle_model">
                              <label
                                className="control-label string optional"
                                htmlFor="vehicle_model"
                              >
                                Model
                              </label>
                              <CFormInput
                                className="form-control-cst string optional vehicle_name_changer"
                                type="text"
                                name="model"
                                id="vehicle_model"
                                value={vehicleData.model}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  vehicleErrors && !isEmpty(vehicleErrors.model) ? true : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearVehicleError({
                                      type: 'model',
                                      errorType: 'errVehicle',
                                    }),
                                  )
                                }
                              />
                              <CFormFeedback invalid className="fieldError-cst">
                                {vehicleErrors.model}
                              </CFormFeedback>
                            </div>
                          </div>
                          <div className="col-md-4 col-sm-4 col-xs-12">
                            <div className="form-group integer optional vehicle_model_year">
                              <label
                                className="control-label integer optional"
                                htmlFor="vehicle_model_year"
                              >
                                Year
                              </label>
                              <CFormInput
                                className="form-control-cst numeric integer optional vehicle_name_changer"
                                type="number"
                                step="1"
                                name="modelYear"
                                id="vehicle_model_year"
                                value={vehicleData.modelYear}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  vehicleErrors && !isEmpty(vehicleErrors.modelYear) ? true : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearVehicleError({
                                      type: 'modelYear',
                                      errorType: 'errVehicle',
                                    }),
                                  )
                                }
                              />
                              <CFormFeedback invalid className="fieldError-cst">
                                {vehicleErrors.modelYear}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="form-group string optional vehicle_vehicle_type">
                              <label
                                className="control-label string optional"
                                htmlFor="vehicle_vehicle_type"
                              >
                                Vehicle type
                              </label>
                              <CFormInput
                                className="form-control-cst string optional vehicle_name_changer"
                                type="text"
                                name="vehicleType"
                                id="vehicle_vehicle_type"
                                value={vehicleData.vehicleType}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  vehicleErrors && !isEmpty(vehicleErrors.vehicleType)
                                    ? true
                                    : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearVehicleError({
                                      type: 'vehicleType',
                                      errorType: 'errVehicle',
                                    }),
                                  )
                                }
                              />
                              <CFormFeedback invalid className="fieldError-cst">
                                {vehicleErrors.vehicleType}
                              </CFormFeedback>
                            </div>
                          </div>
                          <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="form-group vehicle optional vehicle_covehicle_id">
                              <label
                                className="control-label vehicle optional"
                                htmlFor="vehicle_covehicle_id"
                              >
                                Connected Vehicle
                              </label>
                              <div>
                                <div className="input-group">
                                  <CFormSelect
                                    className="form-control-cst vehicle-select select2-hidden-accessible"
                                    name="covehicleId"
                                    id="vehicle_covehicle_id"
                                    value={vehicleData.covehicleId}
                                    onChange={(e) => handleChangeForm(e)}
                                    invalid={
                                      vehicleErrors && !isEmpty(vehicleErrors.covehicleId)
                                        ? true
                                        : false
                                    }
                                    onFocus={() =>
                                      dispatch(
                                        clearVehicleError({
                                          type: 'covehicleId',
                                          errorType: 'errVehicle',
                                        }),
                                      )
                                    }
                                  >
                                    <option value=""></option>
                                  </CFormSelect>
                                  <CFormFeedback invalid className="fieldError-cst">
                                    {vehicleErrors.vehicleType}
                                  </CFormFeedback>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group vehicle_name">
                              <label
                                className="control-label string required"
                                htmlFor="vehicle_name"
                              >
                                Name <span title="required">*</span>
                              </label>
                              <CFormInput
                                className="form-control-cst string required"
                                type="text"
                                name="vehicleName"
                                id="vehicle_name"
                                value={vehicleData.vehicleName}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  vehicleErrors && !isEmpty(vehicleErrors.vehicleName)
                                    ? true
                                    : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearVehicleError({
                                      type: 'vehicleName',
                                      errorType: 'errVehicle',
                                    }),
                                  )
                                }
                              />
                              <CFormFeedback invalid className="fieldError-cst">
                                {vehicleErrors.vehicleName}
                              </CFormFeedback>
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
                              <label
                                className="control-label select optional"
                                htmlFor="vehicle_owner_type"
                              >
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
                          <div id="person_id" className="col-md-6 col-sm-6 col-xs-12 hidden">
                            <div className="form-group person optional vehicle_person_id">
                              <label
                                className="control-label person optional"
                                htmlFor="vehicle_person_id"
                              >
                                Staff
                              </label>
                              <div>
                                <div className="input-group">
                                  <CFormSelect
                                    className="form-control-cst select2-hidden-accessible"
                                    name="vehicle[person_id]"
                                    id="vehicle_person_id"
                                  >
                                    <option value="" data-select2-id="7"></option>
                                  </CFormSelect>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div id="driver_id" className="col-md-6 col-sm-6 col-xs-12">
                            <div className="form-group driver optional vehicle_driver_id">
                              <label
                                className="control-label driver optional"
                                htmlFor="vehicle_driver_id"
                              >
                                Driver
                              </label>
                              <div>
                                <div className="input-group">
                                  <CFormSelect
                                    className="form-control-cst driver-select select2-hidden-accessible"
                                    name="vehicle[driver_id]"
                                    id="vehicle_driver_id"
                                  >
                                    <option value="" data-select2-id="9"></option>
                                  </CFormSelect>
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
                                htmlFor="vehicle_company_id"
                              >
                                Owner Company
                                <a
                                  href="/companies/890189"
                                  target="_blank"
                                  className="float-right profile-link"
                                >
                                  Profile
                                </a>
                              </label>
                              <div>
                                <div className="input-group">
                                  <CFormSelect
                                    className="form-control-cst company-select select2-hidden-accessible"
                                    name="vehicle[company_id]"
                                    id="vehicle_company_id"
                                  >
                                    <option value=""></option>
                                    <option value="890189">Nueklabs Logistics</option>
                                  </CFormSelect>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="form-group select required vehicle_country_id">
                              <label
                                className="control-label select required"
                                htmlFor="vehicle_country_id"
                              >
                                Country <span title="required">*</span>
                              </label>
                              <div>
                                <div className="input-group">
                                  <CFormSelect
                                    className="form-control-cst select required select2-hidden-accessible"
                                    data-plugin="select2"
                                    name="vehicle[country_id]"
                                    id="vehicle_country_id"
                                  >
                                    <option value=""></option>
                                    <option value="AD">AD-ANDORRA</option>
                                    <option value="AE">AE-UNITED ARAB EMIRATES</option>
                                    <option value="AF">AF-AFGHANISTAN</option>
                                    <option value="ZW">ZW-ZIMBABWE</option>
                                    <option value="ZZ">ZZ-NAHÇIVAN</option>
                                  </CFormSelect>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="form-group select required vehicle_branch_id">
                              <label
                                className="control-label select required"
                                htmlFor="vehicle_branch_id"
                              >
                                Branch <span title="required">*</span>
                              </label>
                              <CFormSelect
                                className="form-control-cst select required"
                                name="vehicle[branch_id]"
                                id="vehicle_branch_id"
                              >
                                <option value=""></option>
                                <option value="1380">Head Office</option>
                              </CFormSelect>
                            </div>
                          </div>
                          <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="form-group select optional vehicle_operation_id">
                              <label
                                className="control-label select optional"
                                htmlFor="vehicle_operation_id"
                              >
                                Operation
                              </label>
                              <CFormSelect
                                className="form-control-cst select optional"
                                name="vehicle[operation_id]"
                                id="vehicle_operation_id"
                              >
                                <option value=""></option>
                                <option value="6641">Air Transports Team</option>
                                <option value="6639">Fleet Management Team</option>
                                <option value="6642">Ocean Transports Team</option>
                                <option value="6638">Road Transports Team</option>
                                <option value="6643">Warehouse</option>
                              </CFormSelect>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="form-group select optional vehicle_operator_id">
                              <label
                                className="control-label select optional"
                                htmlFor="vehicle_operator_id"
                              >
                                Vehicle Supervisor
                              </label>
                              <CFormSelect
                                className="form-control-cst select optional"
                                name="vehicle[operator_id]"
                                id="vehicle_operator_id"
                              >
                                <option value=""></option>
                                <option value="3835">Kennedy Peter</option>
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
                                  <CFormSelect
                                    className="form-control-cst profit_center_select select2-hidden-accessible"
                                    name="vehicle[profit_center_id]"
                                    id="vehicle_profit_center_id"
                                  >
                                    <option value="" data-select2-id="15"></option>
                                  </CFormSelect>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CCardBody>
              <CCardFooter className="cardCustom-footer">
                <div>
                  <CButton
                    type="submit"
                    color="success"
                    className="btn-default btn btn-success"
                    disabled={creatingVehicle ? true : false}
                  >
                    {creatingVehicle ? (
                      'Processing...'
                    ) : (
                      <span>
                        Save <i className="fa fa-check" />
                      </span>
                    )}
                  </CButton>
                </div>
              </CCardFooter>
            </CForm>
          </CCard>
        </div>
      </div>
    </div>
  )
}

export default NewVehicle
