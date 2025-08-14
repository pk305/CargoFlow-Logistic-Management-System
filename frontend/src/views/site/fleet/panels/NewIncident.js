import React from 'react'
import { CButton, CFormInput, CFormSelect, CFormTextarea } from '@coreui/react'

const NewIncident = () => {
  // const handleChangeForm = (e) => {}

  return (
    <div>
      <div className="form-body">
        <div className="row">
          <div className="col-md-3 col-xs-6 col-sm-4">
            <div className="form-group  servicelog_damage_type">
              <label className="control-label " htmlFor="servicelog_damage_type">
                Damage Type
              </label>
              <CFormSelect
                className="form-control-cst "
                name="servicelog[damage_type]"
                id="servicelog_damage_type"
              >
                <option value="engine_failure">Engine Failure</option>
                <option value="electronic_failure">Electronic Failure</option>
                <option value="tire_breakdown">Tire Breakdown</option>
                <option value="other_failure">Other failure</option>
              </CFormSelect>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group select required servicelog_operation_id">
              <label className="control-label select required" htmlFor="servicelog_operation_id">
                Operations <span>*</span>
              </label>
              <CFormSelect
                className="form-control-cst select required"
                name="servicelog[operation_id]"
                id="servicelog_operation_id"
              >
                <option value=""></option>
                <option value="6641">Air Transports Team</option>
                <option value="6639">Fleet Management Team</option>
                <option value="6642">Ocean Transports Team</option>
                <option selected="selected" value="6638">
                  Road Transports Team
                </option>
                <option value="6643">Warehouse</option>
              </CFormSelect>
            </div>
          </div>
          <div className="col-md-2 col-sm-6 col-xs-12">
            <div className="form-group date_picker required servicelog_service_date">
              <label
                className="control-label date_picker required"
                htmlFor="servicelog_service_date"
              >
                Service Date <span>*</span>
              </label>

              <CFormInput
                className="form-control-cst string date_picker required form-control-cst input"
                placeholder=""
                type="text"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div id="vehicle_id_input_div" className="col-md-3 col-sm-6 col-xs-12">
            <div className="form-group vehicle optional servicelog_vehicle_id">
              <label className="control-label vehicle optional" htmlFor="servicelog_vehicle_id">
                Vehicle
              </label>
              <div>
                <div className="input-group">
                  <CFormSelect
                    className="form-control-cst vehicle-select select2-hidden-accessible"
                    data-url="/roster/autocompletes.json?model=Fleet::Vehicle"
                    name="servicelog[vehicle_id]"
                    id="servicelog_vehicle_id"
                  >
                    <option value="" data-select2-id="38"></option>
                  </CFormSelect>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 col-xs-12">
            <div className="form-group integer optional servicelog_odemeter">
              <label className="control-label integer optional" htmlFor="servicelog_odemeter">
                Odemeter
              </label>
              <CFormInput
                className="form-control-cst numeric integer optional text-right"
                type="number"
                step="1"
                value="0"
                name="servicelog[odemeter]"
                id="servicelog_odemeter"
              />
            </div>
          </div>
          <div className="col-md-4 col-sm-6 col-xs-12" id="new_s3file">
            <div className="form-group file optional servicelog_file">
              <label className="control-label file optional" htmlFor="servicelog_file">
                Add Document
              </label>
              <CFormInput
                className="form-control-cst file optional upload-file"
                data-multiple-upload="true"
                data-auto-process="true"
                type="file"
                name="servicelog[file]"
                id="servicelog_file"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group text optional servicelog_notes">
              <label className="control-label text optional" htmlFor="servicelog_notes">
                Notes
              </label>
              <CFormTextarea
                className="form-control-cst text optional"
                rows="2"
                name="servicelog[notes]"
                id="servicelog_notes"
              ></CFormTextarea>
            </div>
          </div>
        </div>
      </div>
      <div className="row" id="new_serviceloglines"></div>
      <div className="form-actions">
        <CButton type="submit" color="success" size="sm">
          Save
        </CButton>
      </div>
    </div>
  )
}

export default NewIncident
