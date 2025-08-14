import React from 'react'
import Noty from 'noty'
import { CButton, CCard, CFormTextarea } from '@coreui/react'
import PropTypes from 'prop-types'

const LedgerModal = ({ closeSendAcc }) => {
  const handleSubmitsendAcc = (e) => {
    e.preventDefault()
    new Noty({
      type: 'alert',
      layout: 'topRight',
      id: 'prccAcc',
      text: 'Batch process started, please check again after one minute',
    }).show()
    closeSendAcc()
  }

  return (
    <div className="slidePanel-inner-section">
      <CCard className="cardCustom gutter-b">
        <div className="card-body">
          <form
            className="simple_form horizontal-form"
            id="new_ledger"
            onSubmit={(e) => handleSubmitsendAcc(e)}
          >
            <div className="d-flex flex-column p-4">
              <div className="d-block">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <div className="form-group date_picker optional ledger_ledger_date">
                      <label
                        className="control-label date_picker optional"
                        htmlFor="ledger_ledger_date"
                      >
                        Ledger Date
                      </label>
                      <input
                        className="form-control string date_picker optional flatpickr-input"
                        type="date"
                        autoComplete="off"
                        data-plugin="datepicker"
                        value="2022-05-15"
                        name="ledger[ledger_date]"
                        id="ledger_ledger_date"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <div className="form-group text required ledger_notes">
                      <label className="control-label text required" htmlFor="ledger_notes">
                        Notes <span title="required">*</span>
                      </label>
                      <CFormTextarea
                        className="form-control-cst"
                        rows="1"
                        name="ledger[notes]"
                        id="ledger_notes"
                      ></CFormTextarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-block pt-3 border-top">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="form-group hidden ledger_doc_type">
                      <input
                        className="form-control hidden"
                        type="hidden"
                        name="ledger[doc_type]"
                        id="ledger_doc_type"
                      />
                    </div>
                    <div className="form-group hidden ledger_doc_id">
                      <input
                        className="form-control hidden"
                        type="hidden"
                        name="ledger[doc_id]"
                        id="ledger_doc_id"
                      />
                    </div>
                    <div className="form-group hidden ledger_action_type">
                      <input
                        className="form-control hidden"
                        type="hidden"
                        value="active"
                        name="ledger[action_type]"
                        id="ledger_action_type"
                      />
                    </div>
                    <div className="form-group hidden ledger_ledger_type">
                      <input
                        className="form-control hidden"
                        type="hidden"
                        name="ledger[ledger_type]"
                        id="ledger_ledger_type"
                      />
                    </div>
                    <div className="form-group hidden ledger_object_type">
                      <input
                        className="form-control hidden"
                        type="hidden"
                        value="Financor::Invoice"
                        name="ledger[object_type]"
                        id="ledger_object_type"
                      />
                    </div>
                    <div className="form-group hidden ledger_object_ids">
                      <input
                        className="form-control hidden"
                        type="hidden"
                        value="1538664,1502762,1502760,1502596,1502538"
                        name="ledger[object_ids]"
                        id="ledger_object_ids"
                      />
                    </div>
                    <div className="d-flex justify-content-between">
                      <CButton color="primary" type="submit">
                        Send to Accounting
                      </CButton>
                      <CButton color="info">
                        <i className="fa fa-search"></i> Preview
                      </CButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </CCard>
      <div id="ledgers_preview_div"></div>
    </div>
  )
}

LedgerModal.propTypes = {
  closeSendAcc: PropTypes.func,
}
export default LedgerModal
