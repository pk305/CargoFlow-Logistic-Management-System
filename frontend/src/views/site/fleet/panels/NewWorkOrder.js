import React from 'react'
import { CButton, CFormInput, CFormSelect, CFormTextarea } from '@coreui/react'

const NewWorkOrder = () => {
  // const handleChangeForm = (e) => {}

  return (
    <div>
      <div className="row">
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
          <div className="form-group select optional road_voyage_contract_type">
            <label className="control-label select optional" htmlFor="road_voyage_contract_type">
              Owned/Rental
            </label>
            <CFormSelect
              className="form-control-cst select optional"
              name="road_voyage[contract_type]"
              id="road_voyage_contract_type"
            >
              <option value="owned">Owned/Contractual</option>
              <option value="rented">Contracted</option>
            </CFormSelect>
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
          <div className="form-group select optional road_voyage_operator_id">
            <label className="control-label select optional" htmlFor="road_voyage_operator_id">
              Operator
            </label>
            <CFormSelect
              className="form-control-cst select optional "
              data-plugin="select2"
              name="road_voyage[operator_id]"
              id="road_voyage_operator_id"
              data-select2-id="road_voyage_operator_id"
              aria-hidden="true"
            >
              <option value=""></option>
              <option selected="selected" value="3835" data-select2-id="530">
                Kennedy Peter
              </option>
            </CFormSelect>
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
          <div className="form-group select required road_voyage_operation_id">
            <label className="control-label select required" htmlFor="road_voyage_operation_id">
              Operation <span>*</span>
            </label>
            <CFormSelect
              className="form-control-cst select required"
              name="road_voyage[operation_id]"
              id="road_voyage_operation_id"
            >
              <option value=""></option>
              <option value="6639">Fleet Management Team</option>
            </CFormSelect>
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
          <div className="form-group select optional road_voyage_branch_id">
            <label className="control-label select optional" htmlFor="road_voyage_branch_id">
              Branch
            </label>
            <CFormSelect
              className="form-control-cst select optional"
              name="road_voyage[branch_id]"
              id="road_voyage_branch_id"
            >
              <option selected="selected" value="1380">
                Head Office
              </option>
            </CFormSelect>
          </div>
        </div>
      </div>
      <div className="row" id="road_voyage_owned_vehicle">
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
          <div className="form-group vehicle optional road_voyage_vehicle_id">
            <label className="control-label vehicle optional" htmlFor="road_voyage_vehicle_id">
              Vehicle
            </label>
            <div>
              <div className="input-group">
                <CFormSelect
                  className="form-control-cst vehicle-select "
                  name="road_voyage[vehicle_id]"
                  id="road_voyage_vehicle_id"
                >
                  <option value="" data-select2-id="545"></option>
                </CFormSelect>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
          <div className="form-group vehicle optional road_voyage_trailer_id">
            <label className="control-label vehicle optional" htmlFor="road_voyage_trailer_id">
              Trailer
            </label>
            <div>
              <div className="input-group">
                <CFormSelect
                  className="form-control-cst vehicle-select "
                  name="road_voyage[trailer_id]"
                  id="road_voyage_trailer_id"
                >
                  <option value=""></option>
                </CFormSelect>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
          <div className="form-group select optional road_voyage_driver_type">
            <label className="control-label select optional" htmlFor="road_voyage_driver_type">
              Driver type
            </label>
            <CFormSelect
              className="form-control-cst select optional"
              name="road_voyage[driver_type]"
              id="road_voyage_driver_type"
            >
              <option value="driver">Driver</option>
              <option value="personel">Employee</option>
            </CFormSelect>
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3" id="road_voyage_driver_id_field">
          <div className="form-group driver optional road_voyage_driver_id">
            <label className="control-label driver optional" htmlFor="road_voyage_driver_id">
              Driver
            </label>
            <div>
              <div className="input-group">
                <CFormSelect
                  className="form-control-cst driver-select "
                  name="road_voyage[driver_id]"
                  id="road_voyage_driver_id"
                >
                  <option value=""></option>
                </CFormSelect>
              </div>
            </div>
          </div>
        </div>
        <div
          className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 slidingDiv"
          id="road_voyage_driver_name_field"
          style={{ display: 'none' }}
        >
          <div className="form-group driver optional road_voyage_driver_name">
            <label className="control-label driver optional" htmlFor="road_voyage_driver_name">
              Driver Name
            </label>
            <div>
              <div className="input-group">
                <CFormSelect
                  className="form-control-cst driver-select "
                  name="road_voyage[driver_name]"
                  id="road_voyage_driver_name"
                >
                  <option value=""></option>
                </CFormSelect>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row" id="road_voyage_rented_vehicle" style={{ display: 'none' }}>
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
          <div className="form-group string optional road_voyage_vehicle_code">
            <label className="control-label string optional" htmlFor="road_voyage_vehicle_code">
              Vehicle Code
            </label>
            <CFormInput
              className="form-control-cst string optional"
              type="text"
              name="road_voyage[vehicle_code]"
              id="road_voyage_vehicle_code"
            />
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
          <div className="form-group string optional road_voyage_trailer_code">
            <label className="control-label string optional" htmlFor="road_voyage_trailer_code">
              Trailer Code
            </label>
            <CFormInput
              className="form-control-cst string optional"
              type="text"
              name="road_voyage[trailer_code]"
              id="road_voyage_trailer_code"
            />
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
          <div className="form-group string optional road_voyage_driver_name">
            <label className="control-label string optional" htmlFor="road_voyage_driver_name">
              Driver Name
            </label>
            <CFormInput
              className="form-control-cst string optional"
              type="text"
              name="road_voyage[driver_name]"
              id="road_voyage_driver_name"
            />
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
          <div className="form-group string optional road_voyage_driver_tel">
            <label className="control-label string optional" htmlFor="road_voyage_driver_tel">
              Driver Phone
            </label>
            <CFormInput
              className="form-control-cst string optional"
              type="text"
              name="road_voyage[driver_tel]"
              id="road_voyage_driver_tel"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-sm-6 col-md-6 col-lg-5 col-xl-5">
          <div className="d-flex align-items-center">
            <div className="form-group select required road_voyage_voyage_type">
              <label className="control-label select required" htmlFor="road_voyage_voyage_type">
                Transport Type <span>*</span>
              </label>
              <div>
                <div className="input-group">
                  <CFormSelect
                    className="form-control-cst select required"
                    name="road_voyage[voyage_type]"
                    id="road_voyage_voyage_type"
                  >
                    <option value=""></option>
                    <option value="position_delivery">Truck movement for road positions</option>
                    <option value="nonposition">Truck movement for other positions</option>
                  </CFormSelect>
                </div>
              </div>
            </div>
            <span className="ml-2 mt-3">
              <span
                className="btn btn-sm btn-icon btn-primary btn-floating btn-tooltip btn-drooltip"
                title=":ajax[/tooltips.json?c=road_voyage_position_connection_types, setDrooltip()]:"
              >
                <i className="fa fa-question"></i>
              </span>
            </span>
          </div>
        </div>
        <div
          className="col-12 col-sm-6 col-md-4 col-lg-7 col-xl-7 slidingDiv"
          id="road_voyage_status_div"
          style={{ display: 'none' }}
        >
          <div className="form-group select optional road_voyage_voyage_status">
            <label className="control-label select optional" htmlFor="road_voyage_voyage_status">
              Vehicle Status
            </label>
            <div>
              <div className="input-group">
                <CFormSelect
                  className="form-control-cst select optional"
                  name="road_voyage[voyage_status]"
                  id="road_voyage_voyage_status"
                >
                  <option value=""></option>
                  <option value="current">
                    Truck will start to carry these loads, update position&apos;s truck and driver
                  </option>
                  <option value="logging">
                    This is a historical record, don&apos;t update position
                  </option>
                </CFormSelect>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div id="positions_list" className="col-md-12 col-sm-12 col-xs-12 card-scroll"></div>
      </div>
      <div className="separator"></div>
      <div className="row">
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
          <div className="form-group string optional road_voyage_dep_place_name">
            <label className="control-label string optional" htmlFor="road_voyage_dep_place_name">
              Departure Point
            </label>
            <CFormInput
              className="form-control-cst string optional"
              type="text"
              name="road_voyage[dep_place_name]"
              id="road_voyage_dep_place_name"
            />
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
          <div className="form-group select required road_voyage_dep_country_id">
            <label className="control-label select required" htmlFor="road_voyage_dep_country_id">
              Departure Country <span>*</span>
            </label>
            <CFormSelect
              className="form-control-cst select required "
              data-plugin="select2"
              name="road_voyage[dep_country_id]"
              id="road_voyage_dep_country_id"
              data-select2-id="road_voyage_dep_country_id"
            >
              <option value=""></option>
              <option value="AD">AD-ANDORRA</option>
              <option value="ZW">ZW-ZIMBABWE</option>
              <option value="ZZ">ZZ-NAHÇIVAN</option>
            </CFormSelect>
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
          <div className="form-group date_picker optional road_voyage_start_date">
            <label className="control-label date_picker optional" htmlFor="road_voyage_start_date">
              Voyage Start Date
            </label>
            <CFormInput
              className="form-control-cst string date_picker optional flatpickr-input"
              type="hidden"
              autoComplete="off"
              data-plugin="datepicker"
              value="2022-04-03"
              name="road_voyage[start_date]"
              id="road_voyage_start_date"
            />
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
          <div className="form-group integer optional road_voyage_vehicle_start_km">
            <label
              className="control-label integer optional"
              htmlFor="road_voyage_vehicle_start_km"
            >
              vehicle Start km
            </label>
            <CFormInput
              className="form-control-cst numeric integer optional"
              type="number"
              step="1"
              name="road_voyage[vehicle_start_km]"
              id="road_voyage_vehicle_start_km"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
          <div className="form-group string optional road_voyage_arv_place_name">
            <label className="control-label string optional" htmlFor="road_voyage_arv_place_name">
              Arrival Point
            </label>
            <CFormInput
              className="form-control-cst string optional"
              type="text"
              name="road_voyage[arv_place_name]"
              id="road_voyage_arv_place_name"
            />
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
          <div className="form-group select required road_voyage_arv_country_id">
            <label className="control-label select required" htmlFor="road_voyage_arv_country_id">
              Arrival Country <span>*</span>
            </label>
            <CFormSelect
              className="form-control-cst select required "
              data-plugin="select2"
              name="road_voyage[arv_country_id]"
              id="road_voyage_arv_country_id"
            >
              <option value=""></option>
              <option value="AD">AD-ANDORRA</option>

              <option value="ZW">ZW-ZIMBABWE</option>
              <option value="ZZ">ZZ-NAHÇIVAN</option>
            </CFormSelect>
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
          <div className="form-group date_picker optional road_voyage_finish_date">
            <label className="control-label date_picker optional" htmlFor="road_voyage_finish_date">
              Voyage Finish Date
            </label>
            <CFormInput
              className="form-control-cst string date_picker optional flatpickr-input"
              type="hidden"
              autoComplete="off"
              data-plugin="datepicker"
              name="road_voyage[finish_date]"
              id="road_voyage_finish_date"
            />
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
          <div className="form-group integer optional road_voyage_vehicle_finish_km">
            <label
              className="control-label integer optional"
              htmlFor="road_voyage_vehicle_finish_km"
            >
              vehicle Finish km
            </label>
            <CFormInput
              className="form-control-cst numeric integer optional"
              type="number"
              step="1"
              name="road_voyage[vehicle_finish_km]"
              id="road_voyage_vehicle_finish_km"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <div className="form-group text optional road_voyage_notes">
            <label className="control-label text optional" htmlFor="road_voyage_notes">
              Notes
            </label>
            <CFormTextarea
              className="form-control-cst text optional"
              name="road_voyage[notes]"
              id="road_voyage_notes"
            ></CFormTextarea>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="form-group boolean optional road_voyage_send_sms_message">
                <input
                  className="boolean optional"
                  type="checkbox"
                  value="1"
                  name="road_voyage[send_sms_message]"
                  id="road_voyage_send_sms_message"
                />
                <label className="boolean optional" htmlFor="road_voyage_send_sms_message">
                  Send SMS To Driver
                </label>
              </div>
            </div>
            <div
              id="sms_details"
              className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 slidingDiv"
              style={{ display: 'none' }}
            >
              <div className="form-group string optional road_voyage_driver_gsm">
                <label className="control-label string optional" htmlFor="road_voyage_driver_gsm">
                  Mobile Phone
                </label>
                <CFormInput
                  className="form-control-cst string optional"
                  type="text"
                  name="road_voyage[driver_gsm]"
                  id="road_voyage_driver_gsm"
                />
              </div>
              <div className="form-group text optional road_voyage_sms_message_content">
                <label
                  className="control-label text optional"
                  htmlFor="road_voyage_sms_message_content"
                >
                  Message Content
                </label>
                <CFormTextarea
                  className="form-control-cst text optional"
                  rows="2"
                  name="road_voyage[sms_message_content]"
                  id="road_voyage_sms_message_content"
                  style={{ width: '100%' }}
                ></CFormTextarea>
              </div>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a className="btn btn-sm btn-light-info" href="#">
                Generate Text
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="separator"></div>
      <div className="row">
        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <CButton type="submit" color="success" size="sm">
            Save
          </CButton>
        </div>
      </div>
    </div>
  )
}

export default NewWorkOrder
