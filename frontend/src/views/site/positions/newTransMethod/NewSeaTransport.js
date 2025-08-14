import React, { useState } from 'react'
import { AppBreadcrumb } from 'src/components'
import { CCard, CCardBody, CForm, CCardFooter, CButton } from '@coreui/react'
// import { useDispatch } from 'react-redux'

const NewSeaTransport = () => {
  // const dispatch = useDispatch()
  const [breadcrumbList] = useState([
    { name: 'Bookings', pathname: '/loadings' },
    { name: 'Planning', pathname: '/transports' },
    { name: 'Road Freight', pathname: '/positions?trans_method=road' },
    { name: 'Air Freight', pathname: '/positions?trans_method=air' },
    { name: 'Sea Freight', pathname: '/positions?trans_method=sea', active: true },
    { name: 'Rail Freight', pathname: '/positions?trans_method=rail' },
    { name: 'Courier Freight', pathname: '/positions?trans_method=courier' },
    { name: 'Tarifs', pathname: '/tariffs' },
  ])
  const [positionData, setPositionData] = useState({
    contractType: '',
    extref: '',
    emptyTruck: false,
    operationId: '',
    operatorId: '',
  })
  // const errorCallout = useState('')

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setPositionData({
      ...positionData,
      [name]: value,
    })
  }

  // const handleSubmit = () => {
  //   dispatch(storeRoadFreight(positionData))
  // }

  // const closeCallout = (e) => {
  //   e.preventDefault()
  //   // dispatch(clearBookingError({ type: 'msgCallout', errorType: 'calloutErr' }))
  // }

  return (
    <div>
      <div className="cstContainerDef">
        <AppBreadcrumb items={breadcrumbList} />
      </div>

      <div className="pageContainer newBookings">
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          {/* <CCallout
            color="danger"
            // className={classNames('bg-light cstCalloutInfo animate__animated animate__fadeIn ', {
            //   'animate__animated animate__fadeOut': !errorCallout,
            // })}
            style={{ display: !errorCallout ? 'none' : '' }}
          >
            <div style={{ width: '100%' }}>
              <ul className="cstUl">
                {/* <li>{errorCalloutText}</li> 
              </ul>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={(e) => closeCallout(e)}
              ></button>
            </div>
          </CCallout> */}
          <CCard className="cardCustom">
            <div className="card-header">
              <div className="toolBarContainer">
                <div className="customHeaderContainer">
                  <div className="customHeaderContainer-body">
                    <div className="symbolWrapper">
                      <span className="symbol-label">
                        <i className="fa fa-ship icon-2x"></i>
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
            <CForm
              acceptCharset="UTF-8"
              noValidate="novalidate"
              id="newLoading"
              action="/loadings"
              method="post"
              // onSubmit={(e) => handleSubmitBooking(e)}
            >
              <CCardBody className="p-0">
                <div className="pageContainer-wrapper">
                  <div className="pageBoxSizing-container">
                    <div className="row">
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group string optional position_waybill_no">
                          <label
                            className="control-label string optional"
                            htmlFor="position_waybill_no"
                          >
                            MBL No
                          </label>
                          <input
                            className="form-control string optional"
                            type="text"
                            name="position[waybill_no]"
                            id="position_waybill_no"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group date_picker optional position_waybill_date">
                          <label
                            className="control-label date_picker optional"
                            htmlFor="position_waybill_date"
                          >
                            MBL Date
                          </label>
                          <input
                            className="form-control string date_picker optional flatpickr-input"
                            type="hidden"
                            data-plugin="datepicker"
                            name="position[waybill_date]"
                            id="position_waybill_date"
                          />
                          <input
                            className="form-control string date_picker optional form-control input"
                            placeholder=""
                            tabIndex="0"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group string optional position_extref">
                          <label
                            className="control-label string optional"
                            htmlFor="position_extref"
                          >
                            Booking Ref.
                          </label>
                          <input
                            className="form-control string optional"
                            type="text"
                            name="position[extref]"
                            id="position_extref"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2"></div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group select optional position_operation_id">
                          <label
                            className="control-label select optional"
                            htmlFor="position_operation_id"
                          >
                            Operation
                          </label>
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control is-valid select optional"
                                name="position[operation_id]"
                                id="position_operation_id"
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value=""></option>
                                <option value="6642">Ocean Transports Team</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group select optional position_branch_id">
                          <label
                            className="control-label select optional"
                            htmlFor="position_branch_id"
                          >
                            Branch
                          </label>
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control is-valid select optional"
                                name="position[branch_id]"
                                id="position_branch_id"
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value=""></option>
                                <option value="1380">Head Office</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                        <div className="form-group company optional position_owner_id">
                          <label
                            className="control-label company optional"
                            htmlFor="position_owner_id"
                          >
                            Carrier
                          </label>
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control company-select select2-hidden-accessible"
                                name="position[owner_id]"
                                id="position_owner_id"
                                data-select2-id="position_owner_id"
                                tabIndex="-1"
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value="" data-select2-id="2"></option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                        <div className="form-group company optional position_supplier_id">
                          <label
                            className="control-label company optional"
                            htmlFor="position_supplier_id"
                          >
                            Supplier Company
                          </label>
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control company-select select2-hidden-accessible"
                                name="position[supplier_id]"
                                id="position_supplier_id"
                                data-select2-id="position_supplier_id"
                                tabIndex="-1"
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value="" data-select2-id="4"></option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group company optional position_agent_id">
                          <label
                            className="control-label company optional"
                            htmlFor="position_agent_id"
                          >
                            Agent (NVOCC)
                          </label>
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control company-select select2-hidden-accessible"
                                name="position[agent_id]"
                                id="position_agent_id"
                                data-select2-id="position_agent_id"
                                tabIndex="-1"
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value="" data-select2-id="6"></option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group company optional position_coagent_id">
                          <label
                            className="control-label company optional"
                            htmlFor="position_coagent_id"
                          >
                            Co-Agent
                          </label>
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control company-select select2-hidden-accessible"
                                name="position[coagent_id]"
                                id="position_coagent_id"
                                tabIndex="-1"
                                aria-hidden="true"
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value="" data-select2-id="8"></option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group string optional position_coagent_hbl_no">
                          <label
                            className="control-label string optional"
                            htmlFor="position_coagent_hbl_no"
                          >
                            Co-Agent HBL Non
                          </label>
                          <input
                            className="form-control string optional"
                            type="text"
                            name="position[coagent_hbl_no]"
                            id="position_coagent_hbl_no"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <h4 className="fs-h4 font-weight-bolder mb-6 py-3 border-bottom">
                          Operation Status &amp; Dates
                        </h4>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group select optional position_status">
                          <label
                            className="control-label select optional"
                            htmlFor="position_status"
                          >
                            Status
                          </label>
                          <select
                            className="form-control select optional"
                            name="position[status]"
                            id="position_status"
                            onChange={(e) => handleChangeForm(e)}
                          >
                            <option value=""></option>
                            <option value="planning">Planning</option>
                            <option value="active">In Transit</option>
                            <option value="delivered">Completed / Delivered</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group datetime_picker optional position_estimated_dep_date">
                          <label
                            className="control-label datetime_picker optional"
                            htmlFor="position_estimated_dep_date"
                          >
                            Est. Date of Departure (ETD)
                          </label>
                          <input
                            className="form-control string datetime_picker optional flatpickr-input"
                            data-behaviour="estimated_dep_date"
                            type="hidden"
                            data-plugin="datetimepicker"
                            name="position[estimated_dep_date]"
                            id="position_estimated_dep_date"
                          />
                          <input
                            className="form-control string datetime_picker optional form-control input"
                            placeholder=""
                            tabIndex="0"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group datetime_picker optional position_departure_date">
                          <label
                            className="control-label datetime_picker optional"
                            htmlFor="position_departure_date"
                          >
                            Departure Date
                          </label>
                          <input
                            className="form-control string datetime_picker optional flatpickr-input"
                            data-behaviour="departure_date"
                            type="hidden"
                            data-plugin="datetimepicker"
                            name="position[departure_date]"
                            id="position_departure_date"
                          />
                          <input
                            className="form-control string datetime_picker optional form-control input"
                            placeholder=""
                            tabIndex="0"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group datetime_picker optional position_estimated_arv_date">
                          <label
                            className="control-label datetime_picker optional"
                            htmlFor="position_estimated_arv_date"
                          >
                            Est. Date of Arrival (ETA)
                          </label>
                          <input
                            className="form-control string datetime_picker optional flatpickr-input"
                            data-behaviour="estimated_arv_date"
                            type="hidden"
                            data-plugin="datetimepicker"
                            name="position[estimated_arv_date]"
                            id="position_estimated_arv_date"
                          />
                          <input
                            className="form-control string datetime_picker optional form-control input"
                            placeholder=""
                            tabIndex="0"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group datetime_picker optional position_arrival_date">
                          <label
                            className="control-label datetime_picker optional"
                            htmlFor="position_arrival_date"
                          >
                            Arrival Date
                          </label>
                          <input
                            className="form-control string datetime_picker optional flatpickr-input"
                            data-behaviour="arrival_date"
                            type="hidden"
                            data-plugin="datetimepicker"
                            name="position[arrival_date]"
                            id="position_arrival_date"
                          />
                          <input
                            className="form-control string datetime_picker optional form-control input"
                            placeholder=""
                            tabIndex="0"
                            type="text"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <h4 className="fs-h4 font-weight-bolder mb-6 py-3 border-bottom">
                          Departure &amp; Arrival Ports
                        </h4>
                      </div>
                    </div>
                    <div className="btn-group mb-5" role="group">
                      {/* eslint-disable-next-line */}
                      <a
                        href="#"
                        data-href="#feeder_details_section"
                        className="toggle_and_hide_button btn-sm btn-secondary"
                      >
                        If feeder ship exists, please check for feeder details
                      </a>
                    </div>
                    <div
                      className="row slidingDiv mb-5"
                      id="feeder_details_section"
                      style={{ display: 'none' }}
                    >
                      <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                        <div className="form-group ship optional position_feeder_ship_id">
                          <label
                            className="control-label ship optional"
                            htmlFor="position_feeder_ship_id"
                          >
                            Feeder / Transit Ship
                          </label>
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control company-select select2-hidden-accessible"
                                name="position[feeder_ship_id]"
                                id="position_feeder_ship_id"
                                data-select2-id="position_feeder_ship_id"
                                tabIndex="-1"
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value="" data-select2-id="10"></option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group string optional position_transit_code1">
                          <label
                            className="control-label string optional"
                            htmlFor="position_transit_code1"
                          >
                            Voyage No
                          </label>
                          <input
                            className="form-control string optional"
                            type="text"
                            name="position[transit_code1]"
                            id="position_transit_code1"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                        <div className="form-group place optional position_transit_point1_id">
                          <label
                            className="control-label place optional"
                            htmlFor="position_transit_point1_id"
                          >
                            1st Transfer Port
                          </label>
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control chosen_input place_select select2-hidden-accessible"
                                name="position[transit_point1_id]"
                                id="position_transit_point1_id"
                                data-select2-id="position_transit_point1_id"
                                tabIndex="-1"
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value="" data-select2-id="12"></option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group datetime_picker optional position_transit_date1">
                          <label
                            className="control-label datetime_picker optional"
                            htmlFor="position_transit_date1"
                          >
                            Transit Date
                          </label>
                          <input
                            className="form-control string datetime_picker optional flatpickr-input"
                            type="hidden"
                            data-plugin="datetimepicker"
                            name="position[transit_date1]"
                            id="position_transit_date1"
                          />
                          <input
                            className="form-control string datetime_picker optional form-control input"
                            placeholder=""
                            tabIndex="0"
                            type="text"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                        <div className="form-group ship optional position_ship_id">
                          <label className="control-label ship optional" htmlFor="position_ship_id">
                            Departure Ship
                          </label>
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control company-select select2-hidden-accessible"
                                name="position[ship_id]"
                                id="position_ship_id"
                                data-select2-id="position_ship_id"
                                tabIndex="-1"
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value="" data-select2-id="14"></option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group string optional position_voyage">
                          <label
                            className="control-label string optional"
                            htmlFor="position_voyage"
                          >
                            Voyage No
                          </label>
                          <input
                            className="form-control string optional"
                            type="text"
                            name="position[voyage]"
                            id="position_voyage"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                        <div className="form-group place optional position_dep_place_id">
                          <label
                            className="control-label place optional"
                            htmlFor="position_dep_place_id"
                          >
                            Departure Port
                          </label>
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control chosen_input place_select select2-hidden-accessible"
                                name="position[dep_place_id]"
                                id="position_dep_place_id"
                                data-select2-id="position_dep_place_id"
                                tabIndex="-1"
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value="" data-select2-id="16"></option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="form-group hidden position_dep_country_id">
                          <input
                            className="form-control hidden"
                            type="hidden"
                            name="position[dep_country_id]"
                            id="position_dep_country_id"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                        <div className="form-group place optional position_arv_place_id">
                          <label
                            className="control-label place optional"
                            htmlFor="position_arv_place_id"
                          >
                            Arrival Port
                          </label>
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control chosen_input place_select select2-hidden-accessible"
                                name="position[arv_place_id]"
                                id="position_arv_place_id"
                                data-select2-id="position_arv_place_id"
                                tabIndex="-1"
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value="" data-select2-id="18"></option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="form-group hidden position_arv_country_id">
                          <input
                            className="form-control hidden"
                            type="hidden"
                            name="position[arv_country_id]"
                            id="position_arv_country_id"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="btn-group mt-5" role="group">
                      {/* eslint-disable-next-line */}
                      <a
                        href="#"
                        data-href="#arrival_details_section"
                        className="toggle_and_hide_button btn-sm btn-secondary"
                      >
                        If arrival ship exists, please check for arrival details
                      </a>
                    </div>
                    <div
                      className="row slidingDiv"
                      id="arrival_details_section"
                      style={{ display: 'none' }}
                    >
                      <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                        <div className="form-group ship optional position_arv_ship_id">
                          <label
                            className="control-label ship optional"
                            htmlFor="position_arv_ship_id"
                          >
                            Arrival Ship
                          </label>
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control company-select select2-hidden-accessible"
                                name="position[arv_ship_id]"
                                id="position_arv_ship_id"
                                data-select2-id="position_arv_ship_id"
                                tabIndex="-1"
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value="" data-select2-id="20"></option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group string optional position_transit_code2">
                          <label
                            className="control-label string optional"
                            htmlFor="position_transit_code2"
                          >
                            Voyage No
                          </label>
                          <input
                            className="form-control string optional"
                            type="text"
                            name="position[transit_code2]"
                            id="position_transit_code2"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                        <div className="form-group place optional position_transit_point2_id">
                          <label
                            className="control-label place optional"
                            htmlFor="position_transit_point2_id"
                          >
                            2nd Transfer Port
                          </label>
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control chosen_input place_select select2-hidden-accessible"
                                name="position[transit_point2_id]"
                                id="position_transit_point2_id"
                                data-select2-id="position_transit_point2_id"
                                tabIndex="-1"
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value="" data-select2-id="22"></option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group datetime_picker optional position_transit_date2">
                          <label
                            className="control-label datetime_picker optional"
                            htmlFor="position_transit_date2"
                          >
                            Transit Date
                          </label>
                          <input
                            className="form-control string datetime_picker optional flatpickr-input"
                            type="hidden"
                            data-plugin="datetimepicker"
                            name="position[transit_date2]"
                            id="position_transit_date2"
                          />
                          <input
                            className="form-control string datetime_picker optional form-control input"
                            placeholder=""
                            tabIndex="0"
                            type="text"
                          />
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-12 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group decimal optional position_freight_price">
                          <label
                            className="control-label decimal optional"
                            htmlFor="position_freight_price"
                          >
                            Freight Price
                          </label>
                          <input
                            className="form-control numeric decimal optional"
                            type="number"
                            step="any"
                            value="0.0"
                            name="position[freight_price]"
                            id="position_freight_price"
                            onChange={(e) => handleChangeForm(e)}
                          />
                        </div>
                      </div>
                      <div className="col-md-1 col-sm-3 col-xs-6 px-0">
                        <div className="form-group select optional position_freight_curr">
                          <label
                            className="control-label select optional"
                            htmlFor="position_freight_curr"
                          >
                            Currency
                          </label>
                          <select
                            className="form-control select optional"
                            name="position[freight_curr]"
                            id="position_freight_curr"
                            onChange={(e) => handleChangeForm(e)}
                          >
                            <option value=""></option>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                            <option value="CHF">CHF</option>
                            <option value="CAD">CAD</option>
                            <option value="CZK">CZK</option>
                            <option value="SEK">SEK</option>
                            <option value="PLN">PLN</option>
                            <option value="NOK">NOK</option>
                            <option value="AUD">AUD</option>
                            <option value="DKK">DKK</option>
                            <option value="KWD">KWD</option>
                            <option value="SAR">SAR</option>
                            <option value="RON">RON</option>
                            <option value="BGN">BGN</option>
                            <option value="RUB">RUB</option>
                            <option value="PKR">PKR</option>
                            <option value="CNY">CNY</option>
                            <option value="IRR">IRR</option>
                            <option value="JPY">JPY</option>
                            <option value="SGD">SGD</option>
                            <option value="AZN">AZN</option>
                            <option value="AED">AED</option>
                            <option value="HKD">HKD</option>
                            <option value="HUF">HUF</option>
                            <option value="MKD">MKD</option>
                            <option value="MYR">MYR</option>
                            <option value="KRW">KRW</option>
                            <option value="INR">INR</option>
                            <option value="XAU">XAU</option>
                            <option value="XAG">XAG</option>
                            <option value="XPT">XPT</option>
                            <option value="ZAR">ZAR</option>
                            <option value="VND">VND</option>
                            <option value="GEL">GEL</option>
                            <option value="GBP">GBP</option>
                            <option value="TRY">TRY</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group select optional position_ppcc">
                          <label className="control-label select optional" htmlFor="position_ppcc">
                            Payment Term
                          </label>
                          <select
                            className="form-control select optional"
                            name="position[ppcc]"
                            id="position_ppcc"
                            onChange={(e) => handleChangeForm(e)}
                          >
                            <option value="pp">Prepaid</option>
                            <option value="cc">Collect</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-12 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group string optional position_cargo_manifest_no">
                          <label
                            className="control-label string optional"
                            htmlFor="position_cargo_manifest_no"
                          >
                            Cargo Manifest No
                          </label>
                          <input
                            className="form-control string optional"
                            type="text"
                            name="position[cargo_manifest_no]"
                            id="position_cargo_manifest_no"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group date_picker optional position_cargo_manifest_date">
                          <label
                            className="control-label date_picker optional"
                            htmlFor="position_cargo_manifest_date"
                          >
                            Cargo Manifest Date
                          </label>
                          <input
                            className="form-control string date_picker optional flatpickr-input"
                            type="hidden"
                            data-plugin="datepicker"
                            name="position[cargo_manifest_date]"
                            id="position_cargo_manifest_date"
                          />
                          <input
                            className="form-control string date_picker optional form-control input"
                            placeholder=""
                            tabIndex="0"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group date_picker optional position_report_date">
                          <label
                            className="control-label date_picker optional"
                            htmlFor="position_report_date"
                          >
                            Delivery Note Date
                          </label>
                          <input
                            className="form-control string date_picker optional flatpickr-input"
                            type="hidden"
                            data-plugin="datepicker"
                            name="position[report_date]"
                            id="position_report_date"
                          />
                          <input
                            className="form-control string date_picker optional form-control input"
                            placeholder=""
                            tabIndex="0"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group date_picker optional position_unloading_date">
                          <label
                            className="control-label date_picker optional"
                            htmlFor="position_unloading_date"
                          >
                            Unloading Date
                          </label>
                          <input
                            className="form-control string date_picker optional flatpickr-input"
                            type="hidden"
                            data-plugin="datepicker"
                            name="position[unloading_date]"
                            id="position_unloading_date"
                          />
                          <input
                            className="form-control string date_picker optional form-control input"
                            placeholder=""
                            tabIndex="0"
                            type="text"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group select optional position_talex">
                          <label className="control-label select optional" htmlFor="position_talex">
                            Waybill Type
                          </label>
                          <select
                            className="form-control select optional"
                            name="position[talex]"
                            id="position_talex"
                            onChange={(e) => handleChangeForm(e)}
                          >
                            <option value=""></option>
                            <option value="original">Original B/L</option>
                            <option value="express">Express Release (Telex)</option>
                            <option value="sea_waybill">Sea Waybill</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-12 col-sm-3 col-md-1 col-lg-1 col-xl-1 px-0">
                        <div className="form-group integer optional position_free_time">
                          <label
                            className="control-label integer optional"
                            htmlFor="position_free_time"
                          >
                            Free Time
                          </label>
                          <input
                            className="form-control numeric integer optional"
                            type="number"
                            step="1"
                            name="position[free_time]"
                            id="position_free_time"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-5 col-lg-5 col-xl-5">
                        <div className="form-group text optional position_notes">
                          <label className="control-label text optional" htmlFor="position_notes">
                            Notes
                          </label>
                          <textarea
                            className="form-control text optional"
                            rows="1"
                            name="position[notes]"
                            id="position_notes"
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3"></div>
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
                      // disabled={creatingBooking ? true : false}
                    >
                      {/* {creatingBooking ? (
                      'Processing...'
                    ) : ( */}
                      <span>
                        Save <i className="fa fa-check" />
                      </span>
                      {/* )} */}
                    </CButton>
                  </div>
                </div>
              </CCardFooter>
            </CForm>
          </CCard>
        </div>
      </div>
    </div>
  )
}

export default NewSeaTransport
