import React from 'react'
import { CButton, CCard, CFormInput, CFormSelect } from '@coreui/react'
// import { useDispatch, useSelector } from 'react-redux'
// import $ from 'jquery'
// import Noty from 'noty'
import PropTypes from 'prop-types'
// import { clearFinitemError, createFinitem, showFinitemError } from 'src/redux/slices/finitemSlice'
// import { isEmpty } from 'lodash'
// import { fetchTaxcodes } from 'src/redux/slices/taxcodeSlice'
// import { fetchCurrencies } from 'src/redux/slices/currencySlice'

const AccIntergration = ({ setAccIntergrationModal }) => {
  // const dispatch = useDispatch()
  // const [invoiceItemData, setInvoiceItemData] = useState({
  //   Code: '',
  //   Name: '',
  //   InvolineType: '',
  //   ItemType: '',
  //   Status: 'active',
  //   NameForeign: '',
  //   IntegrationNames: '',
  //   Salable: '0',
  //   Purchasable: '0',
  //   SalesPrice: '0.0',
  //   SalesCurr: '',
  //   PurchasePrice: '0.0',
  //   PurchaseNotes: '',
  //   AutoCalcRate: '0.0',
  //   PurchaseControllRate: '',
  //   PurchaseCurr: '',
  //   PurchaseTaxId: '',
  //   SalesControllRate: '',
  //   SalesNotes: '',
  //   SalesTaxId: '',
  //   ExtsServiceId: '',
  //   AutoCalcFinitemId: '',
  // })
  // const { creatingFinitem, finitemErrors } = useSelector((state) => state.finitem)
  // const { fetchingCurrencies, currencies } = useSelector((state) => state.currency)
  // const { taxcodes } = useSelector((state) => state.taxcode)

  // const handleChangeForm = (e) => {
  //   const { name, value } = e.target
  //   setInvoiceItemData({
  //     ...invoiceItemData,
  //     [name]: value,
  //   })
  // }

  // const handleCheckedForm = (e) => {
  //   const { name, checked } = e.target
  //   setInvoiceItemData({
  //     ...invoiceItemData,
  //     [name]: checked ? '1' : '0',
  //   })
  // }

  // const handleSelectFocus = (c, _) => {
  //   dispatch(clearFinitemError({ type: c, errorType: 'errFinitem' }))

  //   if (c === 'SalesCurr' || c === 'PurchaseCurr') {
  //     if (isEmpty(currencies)) {
  //       dispatch(fetchCurrencies())
  //     }
  //   } else if (c === 'SalesTaxId' || c === 'PurchaseTaxId') {
  //     if (isEmpty(taxcodes)) {
  //       dispatch(fetchTaxcodes())
  //     }
  //   }
  // }

  // const handleSubmitFinitem = async (e) => {
  //   e.preventDefault()
  //   const form = $('#new_finitem')
  //   if (form.length > 0) {
  //     const bd = 'html, body'
  //     if (invoiceItemData.Code === '') {
  //       dispatch(showFinitemError({ type: 'Code', errorType: 'errFinitem' }))
  //       $(bd).animate({ scrollTop: 0 }, 300)
  //       return false
  //     }
  //   }
  //   //form data
  //   let arrForm = Object.entries(invoiceItemData)
  //   const formData = new FormData()
  //   if (arrForm.length > 0) {
  //     for (const [key, value] of arrForm) {
  //       formData.append([key], value)
  //     }
  //   }

  //   const resData = await dispatch(createFinitem(formData)).unwrap()
  //   if (resData) {
  //     clearInvItemData()
  //     setAccIntergrationModal(false)
  //     new Noty({
  //       type: 'alert',
  //       text: ' Currency has been created succesfully',
  //       timeout: 3000,
  //     }).show()
  //   }
  // }

  // const clearInvItemData = () => {
  //   setInvoiceItemData({
  //     ...invoiceItemData,
  //     Code: '',
  //   })
  // }

  return (
    <section className="slidePanel-inner-section" data-select2-id="45">
      <div className="card card-custom gutter-b">
        <div className="card-body">
          <form className="simple_form horizontal-form" id="new_account">
            <div className="row" data-select2-id="44">
              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4" data-select2-id="43">
                <div className="form-group finitem optional account_parent_id" data-select2-id="42">
                  <label className="control-label finitem optional" htmlFor="account_parent_id">
                    Parent Object
                  </label>
                  <CFormSelect
                    className="form-control-cst finitem_select select2-hidden-accessible"
                    data-url="/roster/autocompletes.json?model=Financor::Finitem"
                    data-newurl="/finitems/new"
                    data-minimuminputlength="0"
                    data-placeholder=""
                    data-plugin="lookup"
                    name="account[parent_id]"
                    id="account_parent_id"
                    data-select2-id="account_parent_id"
                    aria-hidden="true"
                  >
                    <option value="" data-select2-id="32"></option>
                    <option value="13320" data-select2-id="33">
                      DEMURRAGE Demurrage Fee
                    </option>
                  </CFormSelect>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group account_parent_type2">
                  <label className="control-label" htmlFor="account_parent_type2">
                    Account Type
                  </label>
                  <CFormSelect
                    className="form-control-cst"
                    name="account[parent_type2]"
                    id="account_parent_type2"
                  >
                    <option value="debit">Debit Account</option>
                    <option value="credit">Credit Account</option>
                    <option value="debit_rebate">Debit Rebate Account</option>
                    <option value="credit_rebate">Credit Rebate Account</option>
                    <option value="debit_note">Debit Note Account</option>
                    <option value="credit_note">Credit Note Account</option>
                  </CFormSelect>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group account_work_type">
                  <label className="control-label" htmlFor="account_work_type">
                    Integration Type
                  </label>
                  <CFormSelect
                    className="form-control-cst"
                    name="account[work_type]"
                    id="account_work_type"
                  >
                    <option value="static">Static</option>
                    <option value="dynamic">Dynamic</option>
                  </CFormSelect>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group account_fiscal_year">
                  <label className="control-label" htmlFor="account_fiscal_year">
                    Fiscal Year
                  </label>
                  <CFormSelect
                    className="form-control-cst"
                    name="account[fiscal_year]"
                    id="account_fiscal_year"
                  >
                    <option value="2017">2017</option>
                    <option value="2018">2018</option>
                    <option value="2019">2019</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </CFormSelect>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group account_status">
                  <label className="control-label" htmlFor="account_status">
                    Status
                  </label>
                  <CFormSelect
                    className="form-control-cst"
                    name="account[status]"
                    id="account_status"
                  >
                    <option value="active">Active</option>
                    <option value="passive">Passive</option>
                  </CFormSelect>
                </div>
              </div>
            </div>
            <div className="row mb-4" id="account_static_ids_input_div">
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="d-flex flex-column">
                  <a
                    data-remote="true"
                    href="/ledger_accounts/new?form_type=instant&amp;ledgerable=true&amp;name=DEMURRAGE+Demurrage+Fee&amp;parent_type=Financor%3A%3AFinitem"
                  >
                    Create Ledger Account
                  </a>
                  <div className="form-group ledger_account optional account_ledger_account_id">
                    <label
                      className="control-label ledger_account optional"
                      htmlFor="account_ledger_account_id"
                    >
                      Ledger Account
                    </label>
                    <CFormSelect
                      className="form-control-cst ledger_account_select select2-hidden-accessible"
                      data-url="/roster/autocompletes.json?model=Financor::LedgerAccount"
                      data-placeholder=""
                      data-status=""
                      data-plugin="lookup"
                      name="account[ledger_account_id]"
                      id="account_ledger_account_id"
                      data-select2-id="account_ledger_account_id"
                      aria-hidden="true"
                    >
                      <option value="" data-select2-id="36"></option>
                    </CFormSelect>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="d-flex flex-column">
                  <a
                    data-remote="true"
                    href="/profit_centers/new?form_type=instant&amp;ledgerable=true&amp;name=DEMURRAGE+Demurrage+Fee&amp;parent_type=Financor%3A%3AFinitem"
                  >
                    Create Profit Center
                  </a>
                  <div className="form-group profit_center optional account_profit_center_id">
                    <label
                      className="control-label profit_center optional"
                      htmlFor="account_profit_center_id"
                    >
                      Cost Center
                    </label>
                    <CFormSelect
                      className="form-control-cst profit_center_select select2-hidden-accessible"
                      data-url="/roster/autocompletes.json?model=Financor::ProfitCenter"
                      data-placeholder=""
                      data-status=""
                      data-plugin="lookup"
                      name="account[profit_center_id]"
                      id="account_profit_center_id"
                      data-select2-id="account_profit_center_id"
                      aria-hidden="true"
                    >
                      <option value="" data-select2-id="38"></option>
                      <option value="18300" data-select2-id="39">
                        B00-BALANCE ACCOUNT
                      </option>
                    </CFormSelect>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-4" id="account_dynamic_codes_div" style={{ display: 'none' }}>
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group string optional account_ledger_account_code">
                  <label
                    className="control-label string optional"
                    htmlFor="account_ledger_account_code"
                  >
                    Ledger Account Code
                  </label>
                  <CFormInput
                    className="form-control-cst string optional"
                    type="text"
                    name="account[ledger_account_code]"
                    id="account_ledger_account_code"
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group string optional account_profit_center_code">
                  <label
                    className="control-label string optional"
                    htmlFor="account_profit_center_code"
                  >
                    Cost Center Code
                  </label>
                  <CFormInput
                    className="form-control-cst string optional"
                    type="text"
                    name="account[profit_center_code]"
                    id="account_profit_center_code"
                  />
                </div>
              </div>
            </div>
            <div className="row pt-4 border-top">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <CButton color="success" type="submit">
                  Save
                </CButton>
              </div>
            </div>
          </form>
        </div>
      </div>

      <CCard className="cardCustom gutter-b">
        <div className="card-header">
          <div className="card-title">
            <h6 className="card-label">Existing Ledger Integrations</h6>
          </div>
        </div>
        <div className="card-body">
          <div id="accounts_list">
            <div className="table-responsive table-truncate">
              <table className="table table-vertical-center" id="accounts_list_table">
                <thead>
                  <tr className="text-dark">
                    <th></th>
                    <th>Account Name</th>
                    <th>Parent Object</th>
                    <th>Parent Type</th>
                    <th>Account Type</th>
                    <th>Ledger Account</th>
                    <th>Cost Center</th>
                  </tr>
                </thead>
                <tbody id="accounts_list_tbody"></tbody>
              </table>
            </div>
          </div>
        </div>
      </CCard>
    </section>
  )
}

AccIntergration.propTypes = {
  setAccIntergrationModal: PropTypes.func,
}
export default AccIntergration
