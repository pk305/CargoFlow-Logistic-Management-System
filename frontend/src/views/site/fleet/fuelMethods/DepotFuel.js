import React, { useState } from 'react'
import { AppBreadcrumb } from 'src/components'
import { CCard, CCardBody, CForm, CCardFooter, CButton } from '@coreui/react'
// import { useDispatch } from 'react-redux'

const DepotFuel = () => {
  const [breadcrumbList] = useState([
    { name: 'Vehicles', pathname: '/vehicles' },
    { name: 'Drivers', pathname: '/drivers' },
    { name: 'Periodic Documents', pathname: '/periodocs' },
    { name: 'Service Logs', pathname: '/servicelogs' },
    { name: 'Expense Forms', pathname: '/expense_forms?person_type=driver' },
    { name: 'Fuel Logs', pathname: '/fuellogs?scope=vehiclel', active: true },
    { name: 'Gate Actions', pathname: '/gate_actions' },
    { name: 'Facility Management', pathname: '/facility_managements' },
    { name: 'RoRo Tickets', pathname: '/transdocs?view_scope=roro' },
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
                        <i className="fa fa-plane icon-2x"></i>
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
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group select optional position_trans_type">
                          <label
                            className="control-label select optional"
                            htmlFor="position_trans_type"
                          >
                            Operation Type
                          </label>
                          <select
                            className="form-control select optional"
                            name="position[trans_type]"
                            id="position_trans_type"
                            onChange={(e) => handleChangeForm(e)}
                          >
                            <option value="consolide">Consolidation</option>
                            <option value="masteronly">Master Only</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
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
                                <option value="6641">Air Transports Team</option>
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
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group select optional position_project_id">
                          <label
                            className="control-label select optional"
                            htmlFor="position_project_id"
                          >
                            Project
                          </label>
                          <select
                            className="form-control select optional select2-hidden-accessible"
                            data-plugin="select2"
                            name="position[project_id]"
                            id="position_project_id"
                            data-select2-id="position_project_id"
                            tabIndex="-1"
                            aria-hidden="true"
                            onChange={(e) => handleChangeForm(e)}
                          >
                            <option value="" data-select2-id="2"></option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                        <div className="form-group company optional position_owner_id">
                          <label
                            className="control-label company optional"
                            htmlFor="position_owner_id"
                          >
                            Airline
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
                                <option value="" data-select2-id="11"></option>
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
                                tabIndex="-1"
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value="" data-select2-id="13"></option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                        <div className="form-group company optional position_agent_id">
                          <label
                            className="control-label company optional"
                            htmlFor="position_agent_id"
                          >
                            Agent
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
                                <option value="" data-select2-id="15"></option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
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
                                data-select2-id="position_coagent_id"
                                tabIndex="-1"
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value="" data-select2-id="17"></option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group string optional position_waybill_no">
                          <label
                            className="control-label string optional"
                            htmlFor="position_waybill_no"
                          >
                            MAWB No
                          </label>
                          <input
                            className="form-control string optional"
                            type="text"
                            name="position[waybill_no]"
                            id="position_waybill_no"
                          />
                        </div>
                        {/* eslint-disable-next-line */}
                        <a
                          href="#"
                          id="assign"
                          data-company-id="#position_owner_id"
                          data-branch-id="#position_branch_id"
                        >
                          Select from Saved Stocks
                        </a>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group date_picker optional position_waybill_date">
                          <label
                            className="control-label date_picker optional"
                            htmlFor="position_waybill_date"
                          >
                            MAWB Date
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
                        {/* eslint-disable-next-line */}
                        <a
                          href="#"
                          id="select_tariff"
                          data-company-id="#position_owner_id"
                          data-dep-place-id="#position_dep_place_id"
                          data-arv-place-id="#position_arv_place_id"
                        >
                          Select from Saved Tariff
                        </a>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
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
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
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
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
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
                      <div className="form-group hidden position_trans_method">
                        <input
                          className="form-control hidden"
                          type="hidden"
                          value="air"
                          name="position[trans_method]"
                          id="position_trans_method"
                          onChange={(e) => handleChangeForm(e)}
                        />
                      </div>
                      <div className="form-group hidden position_loading_ids">
                        <input
                          className="form-control hidden"
                          type="hidden"
                          name="position[loading_ids]"
                          id="position_loading_ids"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-7 col-sm-12 col-xs-12">
                        <div className="row">
                          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <h4 className="fs-h4 font-weight-bolder mb-6 py-3 border-bottom">
                              Departure &amp; Arrival Ports
                            </h4>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-group datetime_picker optional position_departure_date">
                              <label
                                className="control-label datetime_picker optional"
                                htmlFor="position_departure_date"
                              >
                                Departure Date
                              </label>
                              <input
                                className="form-control string datetime_picker optional flatpickr-input"
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
                          <div className="col-12 col-sm-6 col-md-5 col-lg-5 col-xl-5">
                            <div className="form-group place optional position_dep_place_id">
                              <label
                                className="control-label place optional"
                                htmlFor="position_dep_place_id"
                              >
                                Departure Airport
                              </label>
                              <div>
                                <div className="input-group">
                                  <select
                                    className="form-control chosen_input place_select select2-hidden-accessible"
                                    name="position[dep_place_id]"
                                    id="position_dep_place_id"
                                    tabIndex="-1"
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option value="" data-select2-id="19">
                                      MOI Airport
                                    </option>
                                    <option value="" data-select2-id="19">
                                      Jk
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                            <div className="form-group select optional position_dep_country_id">
                              <label
                                className="control-label select optional"
                                htmlFor="position_dep_country_id"
                              >
                                Collection Country
                              </label>
                              <div>
                                <div className="input-group">
                                  <select
                                    className="form-control select optional select2-hidden-accessible"
                                    data-plugin="select2"
                                    name="position[dep_country_id]"
                                    id="position_dep_country_id"
                                    data-select2-id="position_dep_country_id"
                                    tabIndex="-1"
                                    aria-hidden="true"
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option value="" data-select2-id="5"></option>
                                    <option value="+3">+3-CIBUTI</option>

                                    <option value="ZZ">ZZ-NAHÇIVAN</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-group datetime_picker optional position_arrival_date">
                              <label
                                className="control-label datetime_picker optional"
                                htmlFor="position_arrival_date"
                              >
                                Arrival Date
                              </label>
                              <input
                                className="form-control string datetime_picker optional flatpickr-input"
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
                          <div className="col-12 col-sm-6 col-md-5 col-lg-5 col-xl-5">
                            <div className="form-group place optional position_arv_place_id">
                              <label
                                className="control-label place optional"
                                htmlFor="position_arv_place_id"
                              >
                                Arrival Airport
                              </label>
                              <div>
                                <div className="input-group">
                                  <select
                                    className="form-control chosen_input place_select select2-hidden-accessible"
                                    name="position[arv_place_id]"
                                    id="position_arv_place_id"
                                    tabIndex="-1"
                                    aria-hidden="true"
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option value="" data-select2-id="21"></option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                            <div className="form-group select optional position_arv_country_id">
                              <label
                                className="control-label select optional"
                                htmlFor="position_arv_country_id"
                              >
                                Delivery Country
                              </label>
                              <div>
                                <div className="input-group">
                                  <select
                                    className="form-control select optional select2-hidden-accessible"
                                    data-plugin="select2"
                                    name="position[arv_country_id]"
                                    id="position_arv_country_id"
                                    data-select2-id="position_arv_country_id"
                                    tabIndex="-1"
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option value="" data-select2-id="8"></option>
                                    <option value="+3">+3-CIBUTI</option>
                                    <option value="AA">AA-N/A</option>

                                    <option value="ZZ">ZZ-NAHÇIVAN</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
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
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
                        <div className="row">
                          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <h4 className="fs-h4 font-weight-bolder mb-6 py-3 border-bottom">
                              Transfer Details
                            </h4>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group place optional position_transit_point1_id">
                              <label
                                className="control-label place optional"
                                htmlFor="position_transit_point1_id"
                              >
                                1st Transfer Airport
                              </label>
                              <div>
                                <div className="input-group">
                                  <select
                                    className="form-control chosen_input place_select select2-hidden-accessible"
                                    name="position[transit_point1_id]"
                                    id="position_transit_point1_id"
                                    tabIndex="-1"
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option value="" data-select2-id="23"></option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-group datetime_picker optional position_transit_date1">
                              <label
                                className="control-label datetime_picker optional"
                                htmlFor="position_transit_date1"
                              >
                                1. Transfer Date
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
                          <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-group string optional position_transit_code1">
                              <label
                                className="control-label string optional"
                                htmlFor="position_transit_code1"
                              >
                                1. Voyage No
                              </label>
                              <input
                                className="form-control string optional"
                                type="text"
                                name="position[transit_code1]"
                                id="position_transit_code1"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group place optional position_transit_point2_id">
                              <label
                                className="control-label place optional"
                                htmlFor="position_transit_point2_id"
                              >
                                2nd Transfer Airport
                              </label>
                              <div>
                                <div className="input-group">
                                  <select
                                    className="form-control chosen_input place_select select2-hidden-accessible"
                                    name="position[transit_point2_id]"
                                    id="position_transit_point2_id"
                                    data-select2-id="position_transit_point2_id"
                                    tabIndex="-1"
                                    aria-hidden="true"
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option value="" data-select2-id="25"></option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-group datetime_picker optional position_transit_date2">
                              <label
                                className="control-label datetime_picker optional"
                                htmlFor="position_transit_date2"
                              >
                                2. Transfer Date
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
                          <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-group string optional position_transit_code2">
                              <label
                                className="control-label string optional"
                                htmlFor="position_transit_code2"
                              >
                                2. Voyage No
                              </label>
                              <input
                                className="form-control string optional"
                                type="text"
                                name="position[transit_code2]"
                                id="position_transit_code2"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group place optional position_transit_point3_id">
                              <label
                                className="control-label place optional"
                                htmlFor="position_transit_point3_id"
                              >
                                3rd Transfer Airport
                              </label>
                              <div>
                                <div className="input-group">
                                  <select
                                    className="form-control chosen_input place_select select2-hidden-accessible"
                                    name="position[transit_point3_id]"
                                    id="position_transit_point3_id"
                                    data-select2-id="position_transit_point3_id"
                                    tabIndex="-1"
                                    aria-hidden="true"
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option value="" data-select2-id="27"></option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-group datetime_picker optional position_transit_date3">
                              <label
                                className="control-label datetime_picker optional"
                                htmlFor="position_transit_date3"
                              >
                                3. Transfer Date
                              </label>
                              <input
                                className="form-control string datetime_picker optional flatpickr-input"
                                type="hidden"
                                data-plugin="datetimepicker"
                                name="position[transit_date3]"
                                id="position_transit_date3"
                              />
                              <input
                                className="form-control string datetime_picker optional form-control input"
                                placeholder=""
                                tabIndex="0"
                                type="text"
                              />
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                            <div className="form-group string optional position_transit_code3">
                              <label
                                className="control-label string optional"
                                htmlFor="position_transit_code3"
                              >
                                3. Voyage No
                              </label>
                              <input
                                className="form-control string optional"
                                type="text"
                                name="position[transit_code3]"
                                id="position_transit_code3"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="separator separator-solid my-4"></div>

                    <div className="row">
                      <div className="col-12 col-sm-4 col-md-6 col-lg-6 col-xl-6">
                        <div className="form-group string optional position_route_notes">
                          <label
                            className="control-label string optional"
                            htmlFor="position_route_notes"
                          >
                            Route Notes
                          </label>
                          <input
                            className="form-control string optional"
                            type="text"
                            name="position[route_notes]"
                            id="position_route_notes"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group decimal optional position_freight_price_rate">
                          <label
                            className="control-label decimal optional"
                            htmlFor="position_freight_price_rate"
                          >
                            Tariff Rate
                          </label>
                          <input
                            className="form-control numeric decimal optional"
                            type="number"
                            step="any"
                            value="0.0"
                            name="position[freight_price_rate]"
                            id="position_freight_price_rate"
                            onChange={(e) => handleChangeForm(e)}
                          />
                        </div>
                        {/* eslint-disable-next-line */}
                        <a
                          href="#"
                          id="select_tariff"
                          data-company-id="#position_owner_id"
                          data-dep-place-id="#position_dep_place_id"
                          data-arv-place-id="#position_arv_place_id"
                        >
                          Select from Saved Tariff
                        </a>
                      </div>
                      <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
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
                      <div className="col-12 col-sm-4 col-md-6 col-lg-6 col-xl-6">
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

export default DepotFuel
