import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import { CCard, CFormFeedback, CFormTextarea } from '@coreui/react'
import { isEmpty, isNull } from 'lodash'
import moment from 'moment'
import { useSelector } from 'react-redux'
import Noty from 'noty'
import PropTypes from 'prop-types'

const SendToAcc = ({ closeSendAcc }) => {
  const [sendAccData, setSendAccData] = useState({
    ledgerDate: '',
    notes: '',
  })
  const [loadDateTime, setLoadDateTime] = useState(new Date())
  const { sendAccLedgerErrors } = useSelector((state) => state.ledger)

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setSendAccData({
      [name]: value,
    })
  }

  const handleDateTime = (c, date) => {
    setLoadDateTime(date)
    const e = {
      target: {
        name: c,
        value: !isNull(date) ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '',
      },
    }
    handleChangeForm(e)
  }

  const handleSubmitsendAcc = (e, items) => {
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
            action="/ledgers"
            method="post"
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
                      <DatePicker
                        id="ledger_ledger_date"
                        selected={loadDateTime}
                        onChange={(date) => handleDateTime('loadDate', date)}
                        className="form-control form-control-cst"
                        style={{ paddingLeft: '2px', paddingRight: '2px' }}
                        dateFormat="d/MM/yyyy"
                      />
                      <CFormFeedback
                        invalid={
                          sendAccLedgerErrors && !isEmpty(sendAccData.ledgerDate) ? true : false
                        }
                        className="fieldError-cst"
                      >
                        {sendAccData.ledgerDate}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <div className="form-group ledger_notes">
                      <label className="control-label" htmlFor="ledger_notes">
                        Notes <span title="required">*</span>
                      </label>
                      <CFormTextarea
                        className="form-control-cst"
                        rows="1"
                        name="notes"
                        id="ledger_notes"
                      ></CFormTextarea>
                      <CFormFeedback
                        invalid={sendAccLedgerErrors && !isEmpty(sendAccData.notes) ? true : false}
                        className="fieldError-cst"
                      >
                        {sendAccData.notes}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-block pt-3 border-top">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="d-flex justify-content-between">
                      <input
                        type="submit"
                        name="commit"
                        value="Send to Accounting"
                        className="btn btn-default btn btn-info"
                        id="ledger_submit_button"
                        data-disable-with="Creating Accounting"
                      />
                      <button
                        name="preview"
                        type="submit"
                        id="ledgers_preview_button"
                        className="btn btn-outline-success hide"
                        value="true"
                      >
                        <i className="far fa-search"></i> Preview
                      </button>{' '}
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

SendToAcc.propTypes = {
  closeSendAcc: PropTypes.func,
}
export default SendToAcc
