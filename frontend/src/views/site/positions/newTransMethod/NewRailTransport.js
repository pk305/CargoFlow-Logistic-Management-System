import React, { useState } from 'react'
import { AppBreadcrumb } from 'src/components'
import { CCard, CCardBody, CForm, CCardFooter, CButton } from '@coreui/react'
// import { useDispatch } from 'react-redux'

const NewRailTransport = () => {
  // const dispatch = useDispatch()
  const [breadcrumbList] = useState([
    { name: 'Bookings', pathname: '/loadings' },
    { name: 'Planning', pathname: '/transports' },
    { name: 'Road Freight', pathname: '/positions?trans_method=road' },
    { name: 'Air Freight', pathname: '/positions?trans_method=air' },
    { name: 'Sea Freight', pathname: '/positions?trans_method=sea' },
    { name: 'Rail Freight', pathname: '/positions?trans_method=rail', active: true },
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
                        <i className="fa fa-train icon-2x"></i>
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
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group string optional position_truck_code">
                          <label
                            className="control-label string optional"
                            htmlFor="position_truck_code"
                          >
                            Train
                          </label>
                          <input
                            className="form-control string optional"
                            type="text"
                            name="position[truck_code]"
                            id="position_truck_code"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
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
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
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
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
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
                            <option value="K">Complete</option>
                            <option value="P">Partial</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
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
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
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
                                <option selected="selected" value="1380">
                                  Head Office
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col-12 col-sm-4 col-md-3 col-lg-3 col-xl-3">
                        <div className="form-group company optional position_owner_id">
                          <label
                            className="control-label company optional"
                            htmlFor="position_owner_id"
                          >
                            Train Company
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
                      <div className="col-12 col-sm-4 col-md-3 col-lg-3 col-xl-3">
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
                                <option value="" data-select2-id="13"></option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                        <div className="row">
                          <div className="col-12 col-sm-4 col-md-6 col-lg-6 col-xl-6">
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
                          <div className="col-12 col-sm-4 col-md-6 col-lg-6 col-xl-6">
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
                        </div>
                      </div>
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
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
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
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
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <h4 className="fs-h4 font-weight-bolder mb-6 py-3 border-bottom">
                          Operation Status &amp; Dates
                        </h4>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
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
                            <option selected="selected" value="planning">
                              Planning
                            </option>
                            <option value="active">In Transit</option>
                            <option value="delivered">Completed / Delivered</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
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
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
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
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
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
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
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
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group select optional position_operator_id">
                          <label
                            className="control-label select optional"
                            htmlFor="position_operator_id"
                          >
                            Operator
                          </label>
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control is-valid select optional select2-hidden-accessible"
                                data-plugin="select2"
                                name="position[operator_id]"
                                id="position_operator_id"
                                data-select2-id="position_operator_id"
                                tabIndex="-1"
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value=""></option>
                                <option selected="selected" value="3835" data-select2-id="2">
                                  Kennedy Peter
                                </option>
                              </select>
                            </div>
                          </div>
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
                    <div className="row">
                      <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group place optional position_dep_place_id">
                          <label
                            className="control-label place optional"
                            htmlFor="position_dep_place_id"
                          >
                            Departure Station
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
                                <option value="" data-select2-id="19"></option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
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
                                <option value="AA">AA-N/A</option>
                                <option value="AD">AD-ANDORRA</option>
                                <option value="ZZ">ZZ-NAHÇIVAN</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group place optional position_arv_place_id">
                          <label
                            className="control-label place optional"
                            htmlFor="position_arv_place_id"
                          >
                            Arrival Station
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
                                <option value="" data-select2-id="21"></option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
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
                                aria-hidden="true"
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
                      <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                        <div className="form-group string optional position_route_notes">
                          <label
                            className="control-label string optional"
                            htmlFor="position_route_notes"
                          >
                            Route Notes
                          </label>
                          <input
                            className="form-control string optional"
                            rows="1"
                            type="text"
                            name="position[route_notes]"
                            id="position_route_notes"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group select optional position_tag_names">
                          <label
                            className="control-label select optional"
                            htmlFor="position_tag_names"
                          >
                            Booking Category
                          </label>
                          <div>
                            <div className="input-group">
                              <select
                                className="form-control select optional select2-hidden-accessible"
                                data-plugin="tag_select"
                                multiple=""
                                name="position[tag_names][]"
                                id="position_tag_names"
                                data-select2-id="position_tag_names"
                                tabIndex="-1"
                                aria-hidden="true"
                                onChange={(e) => handleChangeForm(e)}
                              ></select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
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

export default NewRailTransport
