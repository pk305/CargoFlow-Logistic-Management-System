import React from 'react'
import { CButton, CFormInput, CFormSelect } from '@coreui/react'

const NewPeriodicDoc = () => {
  // const handleChangeForm = (e) => {}

  return (
    <div>
      <div className="row">
        <div className="col-md-4 col-sm-6 col-xs-12">
          <div className="form-group select required periodoc_periodoc_type_id">
            <label className="control-label select required" htmlFor="periodoc_periodoc_type_id">
              Document Type <span>*</span>
            </label>
            <div>
              <div className="input-group">
                <CFormSelect
                  className="form-control-cst select required select2-hidden-accessible"
                  name="periodoc[periodoc_type_id]"
                  id="periodoc_periodoc_type_id"
                >
                  <option value="" data-select2-id="40"></option>
                  <option value="486">EHLİYET</option>
                  <option value="485">PASAPORT</option>
                  <option value="488">SRC</option>
                  <option value="487">VİZE</option>
                </CFormSelect>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-sm-6 col-xs-12">
          <div className="form-group string required periodoc_doc_no">
            <label className="control-label string required" htmlFor="periodoc_doc_no">
              Document No <span>*</span>
            </label>
            <CFormInput
              className="form-control-cst string required"
              type="text"
              name="periodoc[doc_no]"
              id="periodoc_doc_no"
            />
          </div>
        </div>
        <div className="col-md-2 col-sm-4 col-xs-12">
          <div className="form-group date_picker optional periodoc_doc_date">
            <label className="control-label date_picker optional" htmlFor="periodoc_doc_date">
              Document Date
            </label>

            <CFormInput
              className="form-control-cst string date_picker optional form-control-cst input"
              placeholder=""
              type="text"
            />
          </div>
        </div>
        <div className="col-md-2 col-sm-6 col-xs-12">
          <div className="form-group select optional periodoc_operation_id">
            <label className="control-label select optional" htmlFor="periodoc_operation_id">
              Operation Team
            </label>
            <CFormSelect
              className="form-control-cst select optional"
              name="periodoc[operation_id]"
              id="periodoc_operation_id"
            >
              <option value=""></option>
              <option value="6639">Fleet Management Team</option>
            </CFormSelect>
          </div>
        </div>
        <div className="col-md-2 col-sm-4 col-xs-12">
          <div className="form-group select optional periodoc_branch_id">
            <label className="control-label select optional" htmlFor="periodoc_branch_id">
              Branch
            </label>
            <CFormSelect
              className="form-control-cst select optional"
              name="periodoc[branch_id]"
              id="periodoc_branch_id"
            >
              <option selected="selected" value="1380">
                Head Office
              </option>
            </CFormSelect>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-2 col-sm-4 col-xs-12">
          <div className="form-group date_picker required periodoc_start_date">
            <label className="control-label date_picker required" htmlFor="periodoc_start_date">
              Starting Date <span>*</span>
            </label>

            <CFormInput
              className="form-control-cst string date_picker required form-control-cst input"
              placeholder=""
              type="text"
            />
          </div>
        </div>
        <div className="col-md-2 col-sm-4 col-xs-12">
          <div className="form-group date_picker required periodoc_due_date">
            <label className="control-label date_picker required" htmlFor="periodoc_due_date">
              Due Date <span>*</span>
            </label>

            <CFormInput
              className="form-control-cst string date_picker required form-control-cst input"
              placeholder=""
              type="text"
            />
          </div>
        </div>
        <div className="col-md-4 col-sm-6 col-xs-12">
          <div className="form-group company optional periodoc_company_id">
            <label className="control-label company optional" htmlFor="periodoc_company_id">
              Company
            </label>
            <div>
              <div className="input-group">
                <CFormSelect
                  className="form-control-cst company-select select2-hidden-accessible"
                  name="periodoc[company_id]"
                  id="periodoc_company_id"
                >
                  <option value="" data-select2-id="48"></option>
                </CFormSelect>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-sm-6 col-xs-12">
          <div className="form-group vehicle optional periodoc_vehicle_id">
            <label className="control-label vehicle optional" htmlFor="periodoc_vehicle_id">
              Vehicle
            </label>
            <div>
              <div className="input-group">
                <CFormSelect
                  className="form-control-cst"
                  name="periodoc[vehicle_id]"
                  id="periodoc_vehicle_id"
                >
                  <option value="" data-select2-id="50"></option>
                </CFormSelect>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 col-sm-6 col-xs-12">
          <div className="form-group driver optional periodoc_driver_id">
            <label className="control-label driver optional" htmlFor="periodoc_driver_id">
              Driver
            </label>
            <div>
              <div className="input-group">
                <CFormSelect
                  className="form-control-cst driver-select select2-hidden-accessible"
                  name="periodoc[driver_id]"
                  id="periodoc_driver_id"
                >
                  <option value="" data-select2-id="52"></option>
                </CFormSelect>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-sm-6 col-xs-12" id="new_s3file">
          <div className="form-group file optional periodoc_file">
            <label className="control-label file optional" htmlFor="periodoc_file">
              Add Document
            </label>
            <CFormInput
              className="form-control-cst file optional upload-file"
              type="file"
              name="periodoc[file]"
              id="periodoc_file"
            />
          </div>
        </div>
        <div className="col-md-4 col-sm-6 col-xs-12">
          <div className="form-group text optional periodoc_notes">
            <label className="control-label text optional" htmlFor="periodoc_notes">
              Notes
            </label>
            <textarea
              className="form-control-cst text optional"
              rows="1"
              name="periodoc[notes]"
              id="periodoc_notes"
            ></textarea>
          </div>
        </div>
      </div>
      <hr />
      <div className="findoc-line row">
        <div className="col-md-2 col-sm-4 col-xs-12">
          <div className="form-group decimal optional periodoc_amount">
            <label className="control-label decimal optional" htmlFor="periodoc_amount">
              Amount
            </label>
            <CFormInput
              className="form-control-cst text-right"
              placeholder="Unit price"
              type="number"
              step="any"
              value="0.0"
              name="periodoc[amount]"
              id="periodoc_amount"
            />
          </div>
        </div>
        <div className="col-md-2 col-sm-4 col-xs-12">
          <div className="form-group select optional periodoc_curr">
            <label className="control-label select optional" htmlFor="periodoc_curr">
              Currency
            </label>
            <CFormSelect
              className="form-control-cst select optional line-curr"
              name="periodoc[curr]"
              id="periodoc_curr"
            >
              <option value=""></option>
              <option value="EUR">EUR</option>
              <option value="TRY">TRY</option>
            </CFormSelect>
          </div>
        </div>
        <div className="col-md-2 col-sm-4 col-xs-12">
          <div className="form-group decimal optional periodoc_curr_rate">
            <label className="control-label decimal optional" htmlFor="periodoc_curr_rate">
              Kur
            </label>
            <CFormInput
              className="form-control-cst text-right"
              value="1"
              type="number"
              step="any"
              name="periodoc[curr_rate]"
              id="periodoc_curr_rate"
            />
          </div>
        </div>
        <div className="col-md-2 col-sm-4 col-xs-12">
          <div className="form-group select optional periodoc_vat_id">
            <label className="control-label select optional" htmlFor="periodoc_vat_id">
              VAT
            </label>
            <CFormSelect
              className="form-control-cst select optional involine-vat-code changes-invoice-total line-vat-rate"
              name="periodoc[vat_id]"
              id="periodoc_vat_id"
            >
              <option value=""></option>
              <option data-rate="5.0" value="3457">
                VAT5
              </option>
              <option data-rate="20.0" value="3458">
                VAT20
              </option>
              <option data-rate="0.0" value="3459">
                EXEMPTVAT
              </option>
              <option data-rate="0.0" value="3460">
                ZEROVAT
              </option>
              <option data-rate="2.0" value="3704">
                SampleVat
              </option>
            </CFormSelect>
          </div>
        </div>
        <div className="col-md-2 col-sm-4 col-xs-12">
          <div className="form-group decimal optional periodoc_total_amount">
            <label className="control-label decimal optional" htmlFor="periodoc_total_amount">
              Total Amount
            </label>
            <CFormInput
              className="form-control-cst  text-right"
              placeholder="Total"
              type="number"
              step="any"
              value="0.0"
              name="periodoc[total_amount]"
              id="periodoc_total_amount"
            />
          </div>
        </div>
      </div>

      <div className="separator separator-solid my-4"></div>
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

export default NewPeriodicDoc
