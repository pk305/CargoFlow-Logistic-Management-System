import React from 'react'
import { CCard, CCardBody } from '@coreui/react'

const GeneralSetings = () => {
  return (
    <div>
      <CCard className="cardCustom">
        <div className="card-header">
          <div className="toolBarContainer">
            <div className="customHeaderContainer">
              <div className="customHeaderContainer-footer">
                <div className="card-title">
                  <h3 className="st-Title">General Settings</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CCardBody>
          <div className="pageContainer-wrapper">
            <form
              className="simple_form horizontal-form"
              id="new_patron_config"
              action="/patron_configs"
              data-remote="true"
              method="post"
            >
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="row">
                    <div className="col-10">
                      <div className="form-group text optional patron_config_settings_invoice_notes">
                        <label
                          className="control-label text optional"
                          htmlFor="patron_config_settings_invoice_notes"
                        >
                          Invoice Notes Generation Rules
                        </label>
                        <textarea
                          className="form-control text optional"
                          name="patron_config[settings][invoice_notes]"
                          id="patron_config_settings_invoice_notes"
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-2">
                      <div className="d-flex mt-8">
                        <a
                          className="btn btn-default"
                          data-tag-code="quick-slider-company"
                          data-remote="true"
                          href="/patron_configs/default_value"
                        >
                          <i className="fal fa-search" title="Quick View "></i>
                        </a>{' '}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group email optional patron_config_settings_invoice_sender_email">
                        <label
                          className="control-label email optional"
                          htmlFor="patron_config_settings_invoice_sender_email"
                        >
                          Default invoice sending e-mail
                        </label>
                        <input
                          className="form-control string email optional"
                          type="email"
                          name="patron_config[settings][invoice_sender_email]"
                          id="patron_config_settings_invoice_sender_email"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group select optional patron_config_settings_require_invoice_notes">
                        <label
                          className="control-label select optional"
                          htmlFor="patron_config_settings_require_invoice_notes"
                        >
                          Invoice notes Mandatory/Optional
                        </label>
                        <select
                          className="form-control select optional"
                          name="patron_config[settings][require_invoice_notes]"
                          id="patron_config_settings_require_invoice_notes"
                        >
                          <option value="true">Empty Passable</option>
                          <option value="false">Compulsory</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group select optional patron_config_settings_patron_currencies">
                        <label
                          className="control-label select optional"
                          htmlFor="patron_config_settings_patron_currencies"
                        >
                          Default currency for sales invoices
                        </label>
                        <select
                          className="form-control select optional"
                          name="patron_config[settings][patron_currencies]"
                          id="patron_config_settings_patron_currencies"
                        >
                          <option value="EUR">EUR</option>
                          <option value="USD">USD</option>
                          <option value="CHF">CHF</option>
                          <option value="CAD">CAD</option>
                          <option value="CZK">CZK</option>
                          <option value="SEK">SEK</option>
                          <option value="PLN">PLN</option>
                          <option value="NOK">NOK</option>
                          <option value="AUD">AUD</option>
                          <option value="DKK">DKK</option>
                          <option value="KWD">KWD</option>
                          <option value="SAR">SAR</option>
                          <option value="RON">RON</option>
                          <option value="BGN">BGN</option>
                          <option value="RUB">RUB</option>
                          <option value="PKR">PKR</option>
                          <option value="CNY">CNY</option>
                          <option value="IRR">IRR</option>
                          <option value="JPY">JPY</option>
                          <option value="SGD">SGD</option>
                          <option value="AZN">AZN</option>
                          <option value="AED">AED</option>
                          <option value="HKD">HKD</option>
                          <option value="HUF">HUF</option>
                          <option value="MKD">MKD</option>
                          <option value="MYR">MYR</option>
                          <option value="KRW">KRW</option>
                          <option value="INR">INR</option>
                          <option value="XAU">XAU</option>
                          <option value="XAG">XAG</option>
                          <option value="XPT">XPT</option>
                          <option value="ZAR">ZAR</option>
                          <option value="VND">VND</option>
                          <option value="GEL">GEL</option>
                          <option value="GBP">GBP</option>
                          <option value="TRY">TRY</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group string optional patron_config_settings_credit_invoice_due_days">
                        <label
                          className="control-label string optional"
                          htmlFor="patron_config_settings_credit_invoice_due_days"
                        >
                          Default due days for purchase invoices
                        </label>
                        <input
                          className="form-control string optional"
                          type="text"
                          name="patron_config[settings][credit_invoice_due_days]"
                          id="patron_config_settings_credit_invoice_due_days"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group select optional patron_config_settings_require_account_for_invoice">
                        <label
                          className="control-label select optional"
                          htmlFor="patron_config_settings_require_account_for_invoice"
                        >
                          Companies need to have an account for invoicing
                        </label>
                        <select
                          className="form-control select optional"
                          name="patron_config[settings][require_account_for_invoice]"
                          id="patron_config_settings_require_account_for_invoice"
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group select optional patron_config_settings_ignore_cheques_on_mapping">
                        <label
                          className="control-label select optional"
                          htmlFor="patron_config_settings_ignore_cheques_on_mapping"
                        >
                          Don&apos;t encounter unpaid cheques on invoice mapping
                        </label>
                        <select
                          className="form-control select optional"
                          name="patron_config[settings][ignore_cheques_on_mapping]"
                          id="patron_config_settings_ignore_cheques_on_mapping"
                        >
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group select optional patron_config_settings_show_currency_equivalent_of_balances_on_ledger_entry">
                        <label
                          className="control-label select optional"
                          htmlFor="patron_config_settings_show_currency_equivalent_of_balances_on_ledger_entry"
                        >
                          List local values in statements
                        </label>
                        <select
                          className="form-control select optional"
                          name="patron_config[settings][show_currency_equivalent_of_balances_on_ledger_entry]"
                          id="patron_config_settings_show_currency_equivalent_of_balances_on_ledger_entry"
                        >
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group select optional patron_config_settings_profit_base_mapping">
                        <label
                          className="control-label select optional"
                          htmlFor="patron_config_settings_profit_base_mapping"
                        >
                          Distribute payments according to the profit-cost centers
                        </label>
                        <select
                          className="form-control select optional"
                          name="patron_config[settings][profit_base_mapping]"
                          id="patron_config_settings_profit_base_mapping"
                        >
                          <option value="true">true</option>
                          <option value="false">false</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group select optional patron_config_settings_customer_supplier_accounts_differentiated">
                        <label
                          className="control-label select optional"
                          htmlFor="patron_config_settings_customer_supplier_accounts_differentiated"
                        >
                          Companies need different accounts as customer or supplier
                        </label>
                        <select
                          className="form-control select optional"
                          name="patron_config[settings][customer_supplier_accounts_differentiated]"
                          id="patron_config_settings_customer_supplier_accounts_differentiated"
                        >
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default GeneralSetings
