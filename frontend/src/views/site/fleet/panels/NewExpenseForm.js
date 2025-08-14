import React from 'react'
import { CButton, CFormInput, CFormSelect, CFormTextarea } from '@coreui/react'

const NewExpenseForm = () => {
  // const handleChangeForm = (e) => {}

  return (
    <div>
      <div className="row">
        <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <div className="form-group date_picker optional expense_form_form_date">
            <label className="control-label date_picker optional" htmlFor="expense_form_form_date">
              Form Date
            </label>
            <CFormInput
              className="form-control-cst string date_picker optional flatpickr-input"
              type="hidden"
              autoComplete="off"
              data-plugin="datepicker"
              value="2022-04-03"
              name="expense_form[form_date]"
              id="expense_form_form_date"
            />
            <CFormInput
              className="form-control-cst string date_picker optional form-control-cst input"
              placeholder=""
              type="text"
            />
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
          <div className="form-group driver optional expense_form_driver_id">
            <label className="control-label driver optional" htmlFor="expense_form_driver_id">
              Driver
            </label>
            <div>
              <div className="input-group">
                <CFormSelect
                  className="form-control-cst driver-select select2-hidden-accessible"
                  name="expense_form[driver_id]"
                  id="expense_form_driver_id"
                >
                  <option value="" data-select2-id="84"></option>
                </CFormSelect>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-5 col-lg-5 col-xl-5">
          <div className="row">
            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <div className="form-group vehicle optional expense_form_vehicle_id">
                <label className="control-label vehicle optional" htmlFor="expense_form_vehicle_id">
                  Vehicle
                </label>
                <div>
                  <div className="input-group">
                    <CFormSelect
                      className="form-control-cst vehicle-select select2-hidden-accessible"
                      name="expense_form[vehicle_id]"
                      id="expense_form_vehicle_id"
                    >
                      <option value="" data-select2-id="86"></option>
                    </CFormSelect>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <div className="form-group vehicle optional expense_form_trailer_id">
                <label className="control-label vehicle optional" htmlFor="expense_form_trailer_id">
                  Trailer
                </label>
                <div>
                  <div className="input-group">
                    <CFormSelect
                      className="form-control-cst vehicle-select select2-hidden-accessible"
                      name="expense_form[trailer_id]"
                      id="expense_form_trailer_id"
                    >
                      <option value="" data-select2-id="88"></option>
                    </CFormSelect>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <div className="form-group select required expense_form_branch_id">
            <label className="control-label select required" htmlFor="expense_form_branch_id">
              Branch <span>*</span>
            </label>
            <CFormSelect
              className="form-control-cst select required"
              name="expense_form[branch_id]"
              id="expense_form_branch_id"
            >
              <option value=""></option>
              <option value="1380">Head Office</option>
            </CFormSelect>
          </div>
        </div>
      </div>
      <div className="row" data-select2-id="94">
        <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <div className="form-group select optional expense_form_export_import">
            <label className="control-label select optional" htmlFor="expense_form_export_import">
              Doc Type
            </label>
            <CFormSelect
              className="form-control-cst select optional"
              name="expense_form[export_import]"
              id="expense_form_export_import"
            >
              <option value="export">International</option>
              <option value="import">Domestic</option>
            </CFormSelect>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
          <div className="form-group select required expense_form_operation_id">
            <label className="control-label select required" htmlFor="expense_form_operation_id">
              Fleet Team <span>*</span>
            </label>
            <CFormSelect
              className="form-control-cst select required"
              name="expense_form[operation_id]"
              id="expense_form_operation_id"
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
        <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3" data-select2-id="93">
          <div className="form-group voyage optional expense_form_voyage_id" data-select2-id="92">
            <label className="control-label voyage optional" htmlFor="expense_form_voyage_id">
              Voyage(Work Order) No
            </label>
            <div>
              <div className="input-group">
                <CFormSelect
                  className="form-control-cst voyage-select select2-hidden-accessible"
                  name="expense_form[voyage_id]"
                  id="expense_form_voyage_id"
                >
                  <option value="" data-select2-id="90"></option>
                </CFormSelect>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
          <div className="form-group text optional expense_form_notes">
            <label className="control-label text optional" htmlFor="expense_form_notes">
              Notes
            </label>
            <CFormTextarea
              className="form-control-cst text optional"
              rows="1"
              name="expense_form[notes]"
              id="expense_form_notes"
            ></CFormTextarea>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <div className="form-group integer optional expense_form_empty_vehicle_km">
            <label
              className="control-label integer optional"
              htmlFor="expense_form_empty_vehicle_km"
            >
              Km with empty trailer
            </label>
            <CFormInput
              className="form-control-cst numeric integer optional"
              type="number"
              step="1"
              value="0"
              name="expense_form[empty_vehicle_km]"
              id="expense_form_empty_vehicle_km"
            />
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <div className="form-group integer optional expense_form_full_vehicle_km">
            <label
              className="control-label integer optional"
              htmlFor="expense_form_full_vehicle_km"
            >
              Km with full vehicle
            </label>
            <CFormInput
              className="form-control-cst numeric integer optional"
              type="number"
              step="1"
              value="0"
              name="expense_form[full_vehicle_km]"
              id="expense_form_full_vehicle_km"
            />
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <div className="form-group integer optional expense_form_just_trailer_km">
            <label
              className="control-label integer optional"
              htmlFor="expense_form_just_trailer_km"
            >
              Km Only with Tow Truck
            </label>
            <CFormInput
              className="form-control-cst numeric integer optional"
              type="number"
              step="1"
              value="0"
              name="expense_form[just_trailer_km]"
              id="expense_form_just_trailer_km"
            />
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <div className="form-group date_picker optional expense_form_start_date">
            <label className="control-label date_picker optional" htmlFor="expense_form_start_date">
              Start Date
            </label>

            <CFormInput
              className="form-control-cst string date_picker optional form-control-cst input"
              placeholder=""
              type="text"
            />
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <div className="form-group date_picker optional expense_form_finish_date">
            <label
              className="control-label date_picker optional"
              htmlFor="expense_form_finish_date"
            >
              Finish Date
            </label>

            <CFormInput
              className="form-control-cst string date_picker optional form-control-cst input"
              placeholder=""
              type="text"
            />
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <div className="form-group integer optional expense_form_abroad_time">
            <label className="control-label integer optional" htmlFor="expense_form_abroad_time">
              Abroad Time
            </label>
            <CFormInput
              className="form-control-cst numeric integer optional"
              type="number"
              step="1"
              name="expense_form[abroad_time]"
              id="expense_form_abroad_time"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-sm-6 col-md-12 col-lg-12 col-xl-12">
          <span id="driver_patron_details"></span>
        </div>
        <div className="col-12 col-sm-6 col-md-12 col-lg-12 col-xl-12">
          <span id="vehicle_patron_details"></span>
        </div>
        <div className="col-12 col-sm-6 col-md-12 col-lg-12 col-xl-12">
          <span id="trailer_patron_details"></span>
        </div>
      </div>

      <div className="form-group hidden expense_form_position_id">
        <CFormInput
          className="form-control-cst hidden"
          type="hidden"
          name="expense_form[position_id]"
          id="expense_form_position_id"
        />
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

export default NewExpenseForm
