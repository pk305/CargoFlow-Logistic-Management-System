import React, { useState } from 'react'
import { CButton, CCard, CFormFeedback, CFormInput, CFormSelect } from '@coreui/react'
import { isEmpty } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { createPosition } from 'src/redux/slices/positionSlice'
import Noty from 'noty'
import PropTypes from 'prop-types'

const NewTruckTrans = ({ setToggleTransPanel, loadingId }) => {
  const dispatch = useDispatch()
  const { creatingPosition, positionErrors } = useSelector((state) => state.position)

  const [positionData, setPositionData] = useState({
    contractType: 'owned',
    operationId: '',
    transMethod: 'road',
    branchId: '',
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
    emptyTruck: '1',
    status: 'planning',
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
    operatorId: '',
    arvCityId: '',
    routeKm: '',
    notes: '',
  })

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setPositionData({
      ...positionData,
      [name]: value,
    })
  }

  // const handleSelectForm = (c, val) => {
  //   const e = {
  //     target: {
  //       name: c,
  //       value: !isNull(val) ? val.value : '',
  //     },
  //   }
  //   handleChangeForm(e)
  // }

  const handleSubmitPosition = async (e) => {
    e.preventDefault()
    //form data
    let arrForm = Object.entries(positionData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
      formData.append('loadingId', loadingId)
    }

    const resData = await dispatch(createPosition(formData)).unwrap()
    if (resData) {
      clearPosData()
      setToggleTransPanel(false)
      new Noty({
        text: 'Truck has been created successfully.',
        type: 'alert',
        layout: 'topRight',
      }).show()
    }
  }

  const clearPosData = () => {
    setPositionData({
      contractType: 'owned',
      operationId: '',
      transMethod: 'road',
      branchId: '',
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
      emptyTruck: '1',
      status: 'planning',
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
      operatorId: '',
      arvCityId: '',
      routeKm: '',
      notes: '',
    })
  }

  return (
    <div className="slidePanel-inner-section">
      <CCard className="cardCustom gutter-b">
        <div className="card-body">
          <form
            className="simple_form horizontal-form"
            id="new_position"
            onSubmit={(e) => handleSubmitPosition(e)}
          >
            <div className="row">
              <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group position_contract_type">
                  <label className="control-label" htmlFor="position_contract_type">
                    Contract
                  </label>
                  <CFormSelect
                    className="form-control-cst"
                    id="position_contract_type"
                    name="contractType"
                    invalid={positionErrors && !isEmpty(positionErrors.contractType) ? true : false}
                    value={positionData.contractType}
                    onChange={(e) => handleChangeForm(e)}
                  >
                    <option value=""></option>
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
                <div className="form-group string optional position_extref">
                  <label className="control-label string optional" htmlFor="position_extref">
                    Booking Ref.
                  </label>
                  <CFormInput
                    className="form-control-cst string optional"
                    type="text"
                    name="extref"
                    id="position_extref"
                    invalid={positionErrors && !isEmpty(positionErrors.extref) ? true : false}
                    value={positionData.extref}
                    onChange={(e) => handleChangeForm(e)}
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {positionErrors.extref}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group boolean optional position_empty_truck">
                  <label className="boolean optional" htmlFor="position_empty_truck">
                    Empty Trailer ?
                  </label>
                  <div className="checkbox-custom checkbox-primary">
                    <input
                      className="boolean optional"
                      type="checkbox"
                      name="emptyTruck"
                      value={positionData.emptyTruck}
                      id="position_empty_truck"
                      onClick={(e) => handleChangeForm(e)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group position_operation_id">
                  <label className="control-label" htmlFor="position_operation_id">
                    Operation
                  </label>
                  <CFormSelect
                    className="form-control-cst"
                    name="position[operation_id]"
                    id="position_operation_id"
                    onClick={(e) => handleChangeForm(e)}
                  >
                    <option value=""></option>
                    <option value="6638">Road Transports Team</option>
                  </CFormSelect>
                </div>
              </div>
              <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group position_operator_id">
                  <label className="control-label" htmlFor="position_operator_id">
                    Operator
                  </label>
                  <div>
                    <div className="input-group">
                      <CFormSelect
                        className="form-control-cst"
                        name="position[operator_id]"
                        id="position_operator_id"
                        onClick={(e) => handleChangeForm(e)}
                      >
                        <option value=""></option>
                        <option value="3835" data-select2-id="2">
                          Kennedy Peter
                        </option>
                      </CFormSelect>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group position_branch_id">
                  <label className="control-label" htmlFor="position_branch_id">
                    Branch
                  </label>
                  <CFormSelect
                    className="form-control-cst"
                    name="position[branch_id]"
                    id="position_branch_id"
                    onClick={(e) => handleChangeForm(e)}
                  >
                    <option value=""></option>
                    <option value="1380">Head Office</option>
                  </CFormSelect>
                </div>
              </div>
            </div>
            <div className="rented hide">
              <div className="row">
                <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                  <div className="form-group string optional position_vessel_code">
                    <label className="control-label string optional" htmlFor="position_vessel_code">
                      Trailer
                    </label>
                    <CFormInput
                      className="form-control-cst string optional"
                      type="text"
                      name="position[vessel_code]"
                      id="position_vessel_code"
                      onClick={(e) => handleChangeForm(e)}
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                  <div className="form-group string optional position_truck_code">
                    <label className="control-label string optional" htmlFor="position_truck_code">
                      2.Transport Means
                    </label>
                    <CFormInput
                      className="form-control-cst string optional"
                      type="text"
                      name="position[truck_code]"
                      id="position_truck_code"
                      onClick={(e) => handleChangeForm(e)}
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                  <div className="form-group position_truck_type">
                    <label className="control-label" htmlFor="position_truck_type">
                      Truck Type
                    </label>
                    <CFormSelect
                      className="form-control-cst"
                      name="position[truck_type]"
                      id="position_truck_type"
                      onClick={(e) => handleChangeForm(e)}
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
                  </div>
                </div>
                <div className="col-12 col-sm-8 col-md-2 col-lg-2 col-xl-2">
                  <div className="form-group string optional position_driver_name">
                    <label className="control-label string optional" htmlFor="position_driver_name">
                      Driver Name
                    </label>
                    <CFormInput
                      className="form-control-cst string optional"
                      type="text"
                      name="position[driver_name]"
                      id="position_driver_name"
                      onClick={(e) => handleChangeForm(e)}
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                  <div className="form-group string optional position_driver_tel">
                    <label className="control-label string optional" htmlFor="position_driver_tel">
                      Driver Phone
                    </label>
                    <CFormInput
                      className="form-control-cst string optional"
                      type="text"
                      name="position[driver_tel]"
                      id="position_driver_tel"
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                  <div className="form-group company optional position_supplier_id">
                    <label
                      className="control-label company optional"
                      htmlFor="position_supplier_id"
                    >
                      Supplier Company
                    </label>
                    <div>
                      <div className="input-group">
                        <CFormSelect
                          className="form-control-cst company-select"
                          name="position[supplier_id]"
                          id="position_supplier_id"
                          onClick={(e) => handleChangeForm(e)}
                        >
                          <option value="" data-select2-id="17"></option>
                        </CFormSelect>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                  <div className="form-group decimal optional position_freight_price">
                    <label
                      className="control-label decimal optional"
                      htmlFor="position_freight_price"
                    >
                      Freight Price
                    </label>
                    <CFormInput
                      className="form-control-cst numeric decimal optional"
                      type="number"
                      step="any"
                      name="freightPrice"
                      id="position_freight_price"
                      onClick={(e) => handleChangeForm(e)}
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                  <div className="form-group position_freight_curr">
                    <label className="control-label" htmlFor="position_freight_curr">
                      Currency
                    </label>
                    <CFormSelect
                      className="form-control-cst"
                      name="position[freight_curr]"
                      id="position_freight_curr"
                      onClick={(e) => handleChangeForm(e)}
                    >
                      <option value=""></option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>

                      <option value="GEL">GEL</option>
                      <option value="GBP">GBP</option>
                      <option value="TRY">TRY</option>
                    </CFormSelect>
                  </div>
                </div>
              </div>
            </div>
            <div className="owned row">
              <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group vehicle optional position_vessel_id">
                  <label className="control-label vehicle optional" htmlFor="position_vessel_id">
                    Trailer
                  </label>
                  <div>
                    <div className="input-group">
                      <CFormSelect
                        className="form-control-cst vehicle-select"
                        name="position[vessel_id]"
                        id="position_vessel_id"
                        onClick={(e) => handleChangeForm(e)}
                      >
                        <option value="" data-select2-id="19"></option>
                      </CFormSelect>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group vehicle optional position_truck_id">
                  <label className="control-label vehicle optional" htmlFor="position_truck_id">
                    Tractor Unit
                  </label>
                  <div>
                    <div className="input-group">
                      <CFormSelect
                        className="form-control-cst vehicle-select"
                        name="position[truck_id]"
                        id="position_truck_id"
                        onClick={(e) => handleChangeForm(e)}
                      >
                        <option value="" data-select2-id="21"></option>
                      </CFormSelect>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-8 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group driver optional position_driver_id">
                  <label className="control-label driver optional" htmlFor="position_driver_id">
                    Driver
                  </label>
                  <div>
                    <div className="input-group">
                      <CFormSelect
                        className="form-control-cst driver-select"
                        name="position[driver_id]"
                        id="position_driver_id"
                        onClick={(e) => handleChangeForm(e)}
                      >
                        <option value="" data-select2-id="23"></option>
                      </CFormSelect>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                <div className="row">
                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <div className="form-group integer optional position_dep_odemeter">
                      <label
                        className="control-label integer optional"
                        htmlFor="position_dep_odemeter"
                      >
                        Departure Km
                      </label>
                      <CFormInput
                        className="form-control-cst numeric integer optional"
                        type="number"
                        step="1"
                        name="position[dep_odemeter]"
                        id="position_dep_odemeter"
                        onClick={(e) => handleChangeForm(e)}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <div className="form-group integer optional position_arv_odemeter">
                      <label
                        className="control-label integer optional"
                        htmlFor="position_arv_odemeter"
                      >
                        Arrival Km
                      </label>
                      <CFormInput
                        className="form-control-cst numeric integer optional"
                        type="number"
                        step="1"
                        name="position[arv_odemeter]"
                        id="position_arv_odemeter"
                        onClick={(e) => handleChangeForm(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                <div className="row">
                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <div className="form-group decimal optional position_total_fuel">
                      <label
                        className="control-label decimal optional"
                        htmlFor="position_total_fuel"
                      >
                        Total Fuel
                      </label>
                      <CFormInput
                        className="form-control-cst numeric decimal optional"
                        type="number"
                        step="any"
                        name="position[total_fuel]"
                        id="position_total_fuel"
                        onClick={(e) => handleChangeForm(e)}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <div className="form-group decimal optional position_driver_payment">
                      <label
                        className="control-label decimal optional"
                        htmlFor="position_driver_payment"
                      >
                        Travel Payment
                      </label>
                      <CFormInput
                        className="form-control-cst numeric decimal optional"
                        type="number"
                        step="any"
                        name="position[driver_payment]"
                        id="position_driver_payment"
                        onClick={(e) => handleChangeForm(e)}
                      />
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
                    name="status"
                    id="position_status"
                    invalid={positionErrors && !isEmpty(positionErrors.status) ? true : false}
                    value={positionData.status}
                    onClick={(e) => handleChangeForm(e)}
                  >
                    <option value=""></option>
                    <option value="planning">Planning</option>
                    <option value="active">In Transit</option>
                    <option value="delivered">Completed / Delivered</option>
                  </CFormSelect>
                </div>
              </div>
              <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group position_waybill_type">
                  <label className="control-label" htmlFor="position_waybill_type">
                    Transit Type
                  </label>
                  <CFormSelect
                    className="form-control-cst"
                    name="position[waybill_type]"
                    id="position_waybill_type"
                    onClick={(e) => handleChangeForm(e)}
                  >
                    <option value=""></option>
                    <option value="t1">T1/T2</option>
                    <option value="tir_karnesi">Truck Report Card</option>
                    <option value="irsaliye">Waybill</option>
                    <option value="ata_belgesi">ATA Certificate</option>
                  </CFormSelect>
                </div>
              </div>
              <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group string optional position_waybill_no">
                  <label className="control-label string optional" htmlFor="position_waybill_no">
                    Transit Doc. No
                  </label>
                  <CFormInput
                    className="form-control-cst string optional"
                    type="text"
                    name="position[waybill_no]"
                    id="position_waybill_no"
                  />
                </div>
              </div>
              <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group date_picker optional position_waybill_date">
                  <label
                    className="control-label date_picker optional"
                    htmlFor="position_waybill_date"
                  >
                    Transit Doc. Date
                  </label>

                  <CFormInput
                    className="form-control-cst string date_picker optional form-control-cst input"
                    placeholder=""
                    tabIndex="0"
                    type="text"
                  />
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
                    name="position[project_id]"
                    id="position_project_id"
                    onClick={(e) => handleChangeForm(e)}
                  >
                    <option value="" data-select2-id="5"></option>
                  </CFormSelect>
                </div>
              </div>
            </div>
            <div className="form-group hidden position_loading_id">
              <CFormInput
                className="form-control-cst hidden"
                type="hidden"
                name="position[loading_id]"
                id="position_loading_id"
              />
            </div>
            <div className="form-group hidden position_loading_ids">
              <CFormInput
                className="form-control-cst hidden"
                type="hidden"
                value="869649"
                name="position[loading_ids]"
                id="position_loading_ids"
                onClick={(e) => handleChangeForm(e)}
              />
            </div>
            <div className="form-group hidden position_trans_method">
              <CFormInput
                className="form-control-cst hidden"
                type="hidden"
                value="road"
                name="position[trans_method]"
                id="position_trans_method"
              />
            </div>
            <div className="form-group hidden position_ref_position_id">
              <CFormInput
                className="form-control-cst hidden"
                type="hidden"
                name="position[ref_position_id]"
                id="position_ref_position_id"
              />
            </div>
            <div className="form-group hidden position_ref_loading_ids">
              <CFormInput
                className="form-control-cst hidden"
                type="hidden"
                name="position[ref_loading_ids]"
                id="position_ref_loading_ids"
              />
            </div>

            <hr />
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <h4 className="titleHeading border-bottom">Departure &amp; Arrival Ports</h4>
              </div>
            </div>
            <div className="row" id="departure_partial">
              <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group datetime_picker optional position_departure_date">
                  <label
                    className="control-label datetime_picker optional"
                    htmlFor="position_departure_date"
                  >
                    Departure Date
                  </label>
                  <CFormInput
                    className="form-control-cst"
                    type="date"
                    name="position[departure_date]"
                    id="position_departure_date"
                    onClick={(e) => handleChangeForm(e)}
                  />
                </div>
              </div>
              <div className="col-md-4 col-sm-12 col-xs-12">
                <div className="form-group string optional position_dep_place_name">
                  <label
                    className="control-label string optional"
                    htmlFor="position_dep_place_name"
                  >
                    Departure Place
                  </label>
                  <div>
                    <div className="input-group">
                      <CFormInput
                        className="form-control-cst string optional"
                        name="position[dep_place_name]"
                        id="position_dep_place_name"
                        onClick={(e) => handleChangeForm(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-4 col-md-3 col-lg-3 col-xl-3">
                <div className="form-group city optional position_dep_city_id">
                  <label className="control-label city optional" htmlFor="position_dep_city_id">
                    Departure City
                  </label>
                  <div>
                    <div className="input-group">
                      <CFormSelect
                        className="form-control-cst chosen_input city-select"
                        onClick={(e) => handleChangeForm(e)}
                        name="position[dep_city_id]"
                        id="position_dep_city_id"
                      >
                        <option value="0" data-select2-id="25"></option>
                      </CFormSelect>
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
                      <CFormSelect
                        className="form-control-cst"
                        name="position[dep_country_id]"
                        id="position_dep_country_id"
                        onClick={(e) => handleChangeForm(e)}
                      >
                        <option value=""></option>
                        <option value="+3">+3-CIBUTI</option>

                        <option value="ZZ">ZZ-NAHÇIVAN</option>
                      </CFormSelect>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row" id="arrival_partial">
              <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group datetime_picker optional position_arrival_date">
                  <label
                    className="control-label datetime_picker optional"
                    htmlFor="position_arrival_date"
                  >
                    Arrival Date
                  </label>

                  <CFormInput
                    className="form-control-cst string datetime_picker optional form-control-cst input"
                    placeholder=""
                    tabIndex="0"
                    type="date"
                    name="position[arrival_date]"
                    id="position_arrival_date"
                    onClick={(e) => handleChangeForm(e)}
                  />
                </div>
              </div>
              <div className="col-md-4 col-sm-12 col-xs-12">
                <div className="form-group string optional position_arv_place_name">
                  <label
                    className="control-label string optional"
                    htmlFor="position_arv_place_name"
                  >
                    Arrival Place
                  </label>
                  <div>
                    <div className="input-group">
                      <CFormInput
                        className="form-control-cst"
                        type="text"
                        name="position[arv_place_name]"
                        id="position_arv_place_name"
                        onClick={(e) => handleChangeForm(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-4 col-md-3 col-lg-3 col-xl-3">
                <div className="form-group city optional position_arv_city_id">
                  <label className="control-label city optional" htmlFor="position_arv_city_id">
                    Arrival City
                  </label>
                  <div>
                    <div className="input-group">
                      <CFormSelect
                        className="form-control-cst chosen_input city-select"
                        name="position[arv_city_id]"
                        id="position_arv_city_id"
                        onClick={(e) => handleChangeForm(e)}
                      >
                        <option value="" data-select2-id="28"></option>
                        <option value="27386" data-select2-id="29">
                          MOMBASA
                        </option>
                      </CFormSelect>
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
                      <CFormSelect
                        className="form-control-cst"
                        name="position[arv_country_id]"
                        id="position_arv_country_id"
                        onClick={(e) => handleChangeForm(e)}
                      >
                        <option value=""></option>
                        <option value="+3">+3-CIBUTI</option>
                        <option value="AA">AA-N/A</option>
                        <option value="AD">AD-ANDORRA</option>
                        <option value="YT">YT-MAYOTTE</option>
                        <option value="ZA">ZA-SOUTH AFRICA</option>
                        <option value="ZM">ZM-ZAMBIA</option>
                        <option value="ZW">ZW-ZIMBABWE</option>
                        <option value="ZZ">ZZ-NAHÇIVAN</option>
                      </CFormSelect>
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
                        name="position[route_id]"
                        id="position_route_id"
                        onClick={(e) => handleChangeForm(e)}
                      >
                        <option value="" data-select2-id="14"></option>
                      </CFormSelect>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                <div className="form-group string optional position_route_notes">
                  <label className="control-label string optional" htmlFor="position_route_notes">
                    Route Notes
                  </label>
                  <CFormInput
                    className="form-control-cst string optional"
                    type="text"
                    name="position[route_notes]"
                    id="position_route_notes"
                    onClick={(e) => handleChangeForm(e)}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group decimal optional position_route_km">
                  <label className="control-label decimal optional" htmlFor="position_route_km">
                    Route Km
                  </label>
                  <CFormInput
                    className="form-control-cst numeric decimal optional"
                    type="number"
                    step="any"
                    name="position[route_km]"
                    id="position_route_km"
                    onClick={(e) => handleChangeForm(e)}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <div className="form-group text optional position_notes">
                  <label className="control-label text optional" htmlFor="position_notes">
                    Notes
                  </label>
                  <textarea
                    className="form-control-cst text optional"
                    rows="1"
                    name="position[notes]"
                    id="position_notes"
                    onClick={(e) => handleChangeForm(e)}
                  ></textarea>
                </div>
              </div>
            </div>
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
          </form>
        </div>
      </CCard>
    </div>
  )
}

NewTruckTrans.propTypes = {
  loadingId: PropTypes.string,
  setToggleTransPanel: PropTypes.func,
}

export default NewTruckTrans
