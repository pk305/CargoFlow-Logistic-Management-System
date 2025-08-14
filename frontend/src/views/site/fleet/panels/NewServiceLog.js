import React from 'react'
import { CButton, CFormInput, CFormSelect, CFormTextarea } from '@coreui/react'

const NewServiceLog = () => {
  // const handleChangeForm = (e) => {}

  return (
    <div>
      <div className="row">
        <div className="col-md-4 col-sm-6 col-xs-12">
          <div className="form-group select optional servicelog_service_type">
            <label className="control-label select optional" htmlFor="servicelog_service_type">
              Service Type
            </label>
            <CFormSelect
              className="form-control-cst select optional"
              name="servicelog[service_type]"
              id="servicelog_service_type"
            >
              <option selected="selected" value="our_team_remote_car">
                Our Team Remote Car
              </option>
            </CFormSelect>
          </div>
        </div>

        <div className="col-md-2"></div>
        <div className="col-md-2">
          <div className="form-group select required servicelog_operation_id">
            <label className="control-label select required" htmlFor="servicelog_operation_id">
              <abbr title="required">*</abbr> Operations
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
            <label className="control-label date_picker required" htmlFor="servicelog_service_date">
              <abbr title="required">*</abbr> Service Date
            </label>

            <CFormInput
              className="form-control-cst string date_picker required form-control-cst input"
              placeholder=""
              type="text"
            />
          </div>
        </div>
        <div className="col-md-2 col-sm-6 col-xs-12">
          <div className="form-group date_picker optional servicelog_finish_date">
            <label className="control-label date_picker optional" htmlFor="servicelog_finish_date">
              Finish Date
            </label>

            <CFormInput
              className="form-control-cst string date_picker optional form-control-cst input"
              placeholder=""
              type="text"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div id="vehicle_code_input_div" className="col-md-2 col-sm-6 col-xs-12">
          <div className="form-group string optional servicelog_vehicle_code">
            <label className="control-label string optional" htmlFor="servicelog_vehicle_code">
              Vehicle Code
            </label>
            <CFormInput
              className="form-control-cst string optional"
              type="text"
              name="servicelog[vehicle_code]"
              id="servicelog_vehicle_code"
            />
          </div>
        </div>
        <div className="col-md-2 col-sm-6 col-xs-12">
          <div className="form-group integer optional servicelog_odemeter">
            <label className="control-label integer optional" htmlFor="servicelog_odemeter">
              Odemeter
            </label>
            <CFormInput
              className="form-control-cst text-right"
              type="number"
              step="1"
              value="0"
              name="servicelog[odemeter]"
              id="servicelog_odemeter"
            />
          </div>
        </div>
        <div className="col-md-2"></div>
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
      <div className="row" id="invoice_fields">
        <div className="col-md-4 col-sm-6 col-xs-12">
          <div className="form-group company optional servicelog_vendor_id">
            <label className="control-label company optional" htmlFor="servicelog_vendor_id">
              Supplier Company
            </label>
            <div>
              <div className="input-group">
                <CFormSelect
                  className="form-control-cst company-select select2-hidden-accessible"
                  name="servicelog[vendor_id]"
                  id="servicelog_vendor_id"
                >
                  <option value="" data-select2-id="84"></option>
                </CFormSelect>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-sm-6 col-xs-12">
          <div className="form-group decimal optional servicelog_invoice_amount">
            <label className="control-label decimal optional" htmlFor="servicelog_invoice_amount">
              Invoice Amount
            </label>
            <CFormInput
              className="form-control-cst numeric decimal optional"
              type="number"
              step="any"
              value="0.0"
              name="servicelog[invoice_amount]"
              id="servicelog_invoice_amount"
            />
          </div>
        </div>
        <div className="col-md-2 col-sm-6 col-xs-12">
          <div className="form-group select optional servicelog_invoice_curr">
            <label className="control-label select optional" htmlFor="servicelog_invoice_curr">
              Invoice Currency
            </label>
            <CFormSelect
              className="form-control-cst select optional"
              name="servicelog[invoice_curr]"
              id="servicelog_invoice_curr"
            >
              <option value=""></option>
              <option value="EUR">EUR</option>
              <option value="TRY">TRY</option>
            </CFormSelect>
          </div>
        </div>
        <div className="col-md-2 col-sm-6 col-xs-12">
          <div className="form-group string optional servicelog_invoice_no">
            <label className="control-label string optional" htmlFor="servicelog_invoice_no">
              Invoice No
            </label>
            <CFormInput
              className="form-control-cst string optional"
              type="text"
              name="servicelog[invoice_no]"
              id="servicelog_invoice_no"
            />
          </div>
        </div>
        {/* <!--div className="col-md-3 col-sm-6 col-xs-12">
          </div--> */}
      </div>
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="form-group text optional servicelog_changed_parts">
            <label className="control-label text optional" htmlFor="servicelog_changed_parts">
              Vehicle&apos;s changed parts during service
            </label>
            <CFormTextarea
              className="form-control-cst text optional"
              rows="2"
              name="servicelog[changed_parts]"
              id="servicelog_changed_parts"
            ></CFormTextarea>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group select optional servicelog_part_stock_id">
            <label className="control-label select optional" htmlFor="servicelog_part_stock_id">
              Spare Parts Stock Location
            </label>
            <CFormSelect
              className="form-control-cst select optional"
              name="servicelog[part_stock_id]"
              id="servicelog_part_stock_id"
            >
              <option value=""></option>
            </CFormSelect>
          </div>
        </div>
      </div>
      <div className="separator separator-solid my-4"></div>
      <div className="row" id="new_serviceloglines">
        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div className="row servicelog_details">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" id="pack_details">
              <div className="row">
                <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">Spare parts used</div>
                <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">Unit</div>
                <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">Total Amount</div>
                <div className="col-12 col-sm-1 col-md-1 col-lg-1 col-xl-1"></div>
                <div className="col-12 col-sm-1 col-md-1 col-lg-1 col-xl-1"></div>
              </div>

              <div className="row servicelog-field servicelog-line" id="servicelogline_form__div">
                <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                  <div className="form-group part optional servicelog_serviceloglines_part_id">
                    <CFormSelect
                      className="form-control-cst part-select select2-hidden-accessible"
                      name="servicelog[serviceloglines_attributes][0][part_id]"
                      id="servicelog_serviceloglines_attributes_0_part_id"
                    >
                      <option value="" data-select2-id="86"></option>
                    </CFormSelect>
                  </div>
                </div>
                <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <div className="form-group servicelog_serviceloglines_quantity">
                    <CFormInput
                      className="form-control-cst numeric text-right"
                      placeholder="Unit"
                      type="number"
                      step="any"
                      value="0.0"
                      name="servicelog[serviceloglines_attributes][0][quantity]"
                      id="servicelog_serviceloglines_attributes_0_quantity"
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <div className="form-group float">
                    <CFormInput
                      className="form-control-cst text-right"
                      placeholder="Total Price"
                      type="number"
                      step="any"
                      value="0.0"
                      name="servicelog[serviceloglines_attributes][0][total_price]"
                      id="servicelog_serviceloglines_attributes_0_total_price"
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-1 col-md-1 col-lg-1 col-xl-1 overflow-visible">
                  <div className="dropdown dropleft">
                    <button
                      className="btn btn-link dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="fas fa-cogs"></i>
                    </button>
                    <div
                      className="dropdown-menu px-2 min-w-300px"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <div className="d-flex">
                        <div className="form-group servicelog_serviceloglines_discount_rate">
                          <label
                            className="control-label"
                            htmlFor="servicelog_serviceloglines_attributes_0_discount_rate"
                          >
                            Discount Rate
                          </label>
                          <CFormInput
                            className="form-control-cst text-right"
                            type="number"
                            step="any"
                            value="0.0"
                            name="servicelog[serviceloglines_attributes][0][discount_rate]"
                            id="servicelog_serviceloglines_attributes_0_discount_rate"
                          />
                        </div>
                        &nbsp;
                        <div className="form-group integer required servicelog_serviceloglines_number_of_month">
                          <label
                            className="control-label integer required"
                            htmlFor="servicelog_serviceloglines_attributes_0_number_of_month"
                          >
                            <abbr title="required">*</abbr> Months
                          </label>
                          <CFormInput
                            className="form-control-cst text-right"
                            type="number"
                            step="1"
                            value="1"
                            name="servicelog[serviceloglines_attributes][0][number_of_month]"
                            id="servicelog_serviceloglines_attributes_0_number_of_month"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-1 col-md-1 col-lg-1 col-xl-1">
                  <a
                    className="btn btn-sm btn-icon btn-light-danger remove_nested_item"
                    data-confirm="The record will be deleted, do you want to continue ?"
                    href="#remove_form_list"
                  >
                    <i className="fa fa-times"></i>
                  </a>{' '}
                  <div className="form-group hidden servicelog_serviceloglines_servicelog_id">
                    <CFormInput
                      className="form-control-cst hidden"
                      type="hidden"
                      name="servicelog[serviceloglines_attributes][0][servicelog_id]"
                      id="servicelog_serviceloglines_attributes_0_servicelog_id"
                    />
                  </div>
                  <CFormInput
                    className="removable_item"
                    type="hidden"
                    value="false"
                    name="servicelog[serviceloglines_attributes][0][_destroy]"
                    id="servicelog_serviceloglines_attributes_0__destroy"
                  />
                  <div className="form-group hidden servicelog_serviceloglines_id">
                    <CFormInput
                      className="form-control-cst hidden"
                      type="hidden"
                      name="servicelog[serviceloglines_attributes][0][id]"
                      id="servicelog_serviceloglines_attributes_0_id"
                    />
                  </div>
                </div>
              </div>

              <hr />
            </div>
          </div>
        </div>
      </div>
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

export default NewServiceLog
