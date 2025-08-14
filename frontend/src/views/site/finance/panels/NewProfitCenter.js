import { CButton, CFormCheck, CFormInput, CFormSelect, CFormTextarea } from '@coreui/react'
import React from 'react'
import { useSelector } from 'react-redux'

const NewProfitCenter = () => {
  const { creatingProfitCenter } = useSelector((state) => state.profitCenter)

  return (
    <div className="slidePanel-inner-section">
      <div className="card card-custom gutter-b">
        <div className="card-body">
          <form className="simple_form horizontal-form" id="new_profit_center">
            <div className="alert dark alert-danger alert-dismissible p-2">
              Please enter only the main accounts here. Child accounts next to the account &#34;Add
              Sub Account&#34; Click on the button to enter! ..
            </div>
            <div className="row mt-8">
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group profit_center_code">
                  <label className="control-label" htmlFor="profit_center_code">
                    Account Code <span title="required">*</span>
                  </label>
                  <CFormInput
                    className="form-control-cst"
                    type="text"
                    name="profit_center[code]"
                    id="profit_center_code"
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group profit_center_name">
                  <label className="control-label" htmlFor="profit_center_name">
                    Account
                  </label>
                  <CFormInput
                    className="form-control-cst"
                    type="text"
                    name="profit_center[name]"
                    id="profit_center_name"
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group boolean optional profit_center_ledgerable">
                  <label className="boolean optional" htmlFor="profit_center_ledgerable">
                    Ledgerable ?
                  </label>
                  <div className="checkbox-custom checkbox-primary">
                    <CFormCheck
                      className="form-control-cst"
                      type="checkbox"
                      value="1"
                      name="profit_center[ledgerable]"
                      id="profit_center_ledgerable"
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group boolean optional profit_center_is_default">
                  <label className="boolean optional" htmlFor="profit_center_is_default">
                    Default Profit center
                  </label>
                  <div className="checkbox-custom checkbox-primary">
                    <CFormCheck
                      className="form-control-cst"
                      type="checkbox"
                      value="1"
                      name="profit_center[is_default]"
                      id="profit_center_is_default"
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group profit_center_status">
                  <label className="control-label" htmlFor="profit_center_status">
                    Status
                  </label>
                  <CFormSelect
                    className="form-control-cst"
                    name="profit_center[status]"
                    id="profit_center_status"
                  >
                    <option selected="selected" value="active">
                      Active
                    </option>
                    <option value="passive">Passive</option>
                  </CFormSelect>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <div className="form-group profit_center_account_filter">
                  <label className="control-label" htmlFor="profit_center_account_filter">
                    Account Range Filter
                  </label>
                  <CFormInput
                    className="form-control-cst"
                    type="text"
                    name="profit_center[account_filter]"
                    id="profit_center_account_filter"
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <div className="form-group profit_center_notes">
                  <label className="control-label" htmlFor="profit_center_notes">
                    Notes
                  </label>
                  <CFormTextarea
                    className="form-control-cst"
                    rows="2"
                    name="profit_center[notes]"
                    id="profit_center_notes"
                  ></CFormTextarea>
                </div>
              </div>
            </div>
            <hr />
            <div className="row hidden" id="profit_center_sharing_settings">
              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mt-3">
                <div className="form-group profit_center_sharing_type">
                  <label className="control-label" htmlFor="profit_center_sharing_type">
                    Sharing Type
                  </label>
                  <CFormSelect
                    className="form-control-cst sharing_type_field"
                    name="profit_center[sharing_type]"
                    id="profit_center_sharing_type"
                  >
                    <option value="standart">Standart</option>
                    <option value="sharing">Sharing</option>
                  </CFormSelect>
                </div>
              </div>
              <div
                className="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8"
                id="profit_share_nested"
                style={{ display: 'none' }}
              >
                <div className="table">
                  <table className="table table-sm table-borderless table-vertical-center">
                    <thead>
                      <tr className="table">
                        <td className="font-weight-bolder">Share Profit Center</td>
                        <td colSpan="2" className="font-weight-bolder">
                          Share Rate
                        </td>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="findoc-line shared-lines">
                        <td className="p-0">
                          <div className="form-group profit_center optional profit_center_profit_center_share_rates_sharing_profit_center_id">
                            <div>
                              <div className="input-group">
                                <select
                                  className="form-control-cst profit_center_select select2-hidden-accessible"
                                  data-url="/roster/autocompletes.json?model=Financor::ProfitCenter"
                                  data-placeholder=""
                                  data-status=""
                                  data-plugin="lookup"
                                  name="profit_center[profit_center_share_rates_attributes][0][sharing_profit_center_id]"
                                  id="profit_center_profit_center_share_rates_attributes_0_sharing_profit_center_id"
                                >
                                  <option value="" data-select2-id="10"></option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-0">
                          <div className="form-group float optional profit_center_profit_center_share_rates_share_rate">
                            <CFormInput
                              className="form-control-cst numeric float optional sharing-rate"
                              type="number"
                              step="any"
                              value="0.0"
                              name="profit_center[profit_center_share_rates_attributes][0][share_rate]"
                              id="profit_center_profit_center_share_rates_attributes_0_share_rate"
                            />
                          </div>
                        </td>
                        <td className="recover-doc-line hidden">
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <a href="#">
                            <i className="fas fa-reply recover-doc-link"></i>
                          </a>
                        </td>
                        <td className="remove-doc-line">
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <a href="#">
                            <i className="fas fa-times remove-doc-link"></i>
                          </a>
                        </td>
                        <td className="hidden">
                          <CFormInput
                            className="line-removable-item"
                            type="hidden"
                            value="false"
                            name="profit_center[profit_center_share_rates_attributes][0][_destroy]"
                            id="profit_center_profit_center_share_rates_attributes_0__destroy"
                          />
                          <div className="form-group hidden profit_center_profit_center_share_rates_id">
                            <CFormInput
                              className="form-control-cst hidden"
                              type="hidden"
                              name="profit_center[profit_center_share_rates_attributes][0][id]"
                              id="profit_center_profit_center_share_rates_attributes_0_id"
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="new_record_button">
                        <td>
                          <button
                            type="button"
                            className="btn btn-info btn-outline"
                            id="allocate_rate_button"
                          >
                            <i className="fas fa-random"></i>
                          </button>
                        </td>
                        <td colSpan="2" className="text-right">
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <a className="btn btn-info add_nested_fields_btn" href="#">
                            <i className="fa fa-plus"></i>Add Line
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <CButton
                  color="success"
                  type="submit"
                  disabled={creatingProfitCenter ? true : false}
                >
                  {creatingProfitCenter ? (
                    'Processing...'
                  ) : (
                    <span>
                      Save <i className="fa fa-check"></i>
                    </span>
                  )}
                </CButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewProfitCenter
