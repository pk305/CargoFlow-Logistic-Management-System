import React, { useState } from 'react'
import { CButton, CCard, CFormTextarea } from '@coreui/react'
import { useSelector } from 'react-redux'
import Noty from 'noty'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { confirmInvoiceStatus } from 'src/redux/slices/invoiceSlice'

const CancelInvoice = ({ closeCancelInv, invId }) => {
  const dispatch = useDispatch()
  const [invoiceData, setInvoiceData] = useState({
    invoiceId: `${invId.id}`,
    notes: `${invId.invoiceName}`,
  })
  const { confirmingInvoices } = useSelector((state) => state.invoice)

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setInvoiceData({
      [name]: value,
    })
  }

  const handleUpdateInvoice = async (e) => {
    e.preventDefault()
    let invIds = [invId.id]
    const resData = await dispatch(
      confirmInvoiceStatus({ invIds: JSON.stringify(invIds), status: 'cancelled' }),
    ).unwrap()

    if (resData) {
      new Noty({
        type: 'alert',
        layout: 'topRight',
        id: 'updtAcc',
        text: 'Invoice has been updated succesfully',
      }).show()
    }

    closeCancelInv()
  }

  return (
    <div className="slidePanel-inner-section">
      <CCard className="cardCustom gutter-b">
        <div className="card-header">
          <div className="card-title">
            <h6 className="card-label">Cancel Invoice</h6>
          </div>
        </div>
        <div className="card-body">
          <form
            className="simple_form edit_invoice"
            id="edit_invoice"
            onSubmit={(e) => handleUpdateInvoice(e)}
          >
            <div className="row" id="cancel_invoice">
              <div className="coll-md-6 col-sm-6 col-xs-12">
                <div className="form-group  invoice_notes">
                  <label className="control-label " htmlFor="invoice_notes">
                    <span
                      className="translation_missing"
                      title="translation missing: en.simple_form.labels.invoice.notes"
                    >
                      Notes
                    </span>
                  </label>
                  <CFormTextarea
                    className="form-control-cst"
                    rows="3"
                    name="notes"
                    id="invoice_notes"
                    value={invoiceData.notes}
                    onChange={(e) => handleChangeForm(e)}
                  ></CFormTextarea>
                </div>
              </div>
            </div>
            <div className="form-group mt-2">
              <CButton color="success" type="submit" disabled={confirmingInvoices ? true : false}>
                {confirmingInvoices ? (
                  'Processing...'
                ) : (
                  <span>
                    Save <i className="fa fa-check"></i>
                  </span>
                )}
              </CButton>
            </div>
          </form>
        </div>
      </CCard>
    </div>
  )
}

CancelInvoice.propTypes = {
  invId: PropTypes.object,
  closeCancelInv: PropTypes.func,
}
export default CancelInvoice
