import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormSelect,
  CFormTextarea,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import $ from 'jquery'
import Noty from 'noty'
import PropTypes from 'prop-types'
import { clearFinitemError, createFinitem, showFinitemError } from 'src/redux/slices/finitemSlice'
import { isEmpty } from 'lodash'
import { fetchTaxcodes } from 'src/redux/slices/taxcodeSlice'
import { fetchCurrencies } from 'src/redux/slices/currencySlice'

const NewInvoiceItem = ({ setInvItemModal }) => {
  const dispatch = useDispatch()
  const [invoiceItemData, setInvoiceItemData] = useState({
    Code: '',
    Name: '',
    InvolineType: '',
    ItemType: '',
    Status: 'active',
    NameForeign: '',
    IntegrationNames: '',
    Salable: '0',
    Purchasable: '0',
    SalesPrice: '0.0',
    SalesCurr: '',
    PurchasePrice: '0.0',
    PurchaseNotes: '',
    AutoCalcRate: '0.0',
    PurchaseControllRate: '',
    PurchaseCurr: '',
    PurchaseTaxId: '',
    SalesControllRate: '',
    SalesNotes: '',
    SalesTaxId: '',
    ExtsServiceId: '',
    AutoCalcFinitemId: '',
  })
  const { creatingFinitem, finitemErrors } = useSelector((state) => state.finitem)
  const { fetchingCurrencies, currencies } = useSelector((state) => state.currency)
  const { taxcodes, fetchingTaxcodes } = useSelector((state) => state.taxcode)

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setInvoiceItemData({
      ...invoiceItemData,
      [name]: value,
    })
  }

  const handleCheckedForm = (e) => {
    const { name, checked } = e.target
    setInvoiceItemData({
      ...invoiceItemData,
      [name]: checked ? '1' : '0',
    })
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearFinitemError({ type: c, errorType: 'errFinitem' }))

    if (c === 'SalesCurr' || c === 'PurchaseCurr') {
      if (isEmpty(currencies)) {
        dispatch(fetchCurrencies())
      }
    } else if (c === 'SalesTaxId' || c === 'PurchaseTaxId') {
      if (isEmpty(taxcodes)) {
        dispatch(fetchTaxcodes())
      }
    }
  }

  const handleSubmitFinitem = async (e) => {
    e.preventDefault()
    const form = $('#new_finitem')
    if (form.length > 0) {
      const bd = 'html, body'
      if (invoiceItemData.Code === '') {
        dispatch(showFinitemError({ type: 'Code', errorType: 'errFinitem' }))
        $(bd).animate({ scrollTop: 0 }, 300)
        return false
      }
    }
    //form data
    let arrForm = Object.entries(invoiceItemData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }

    const clearInvItemData = () => {
      setInvoiceItemData({
        ...invoiceItemData,
        Code: '',
        Name: '',
        InvolineType: '',
        ItemType: '',
        Status: 'active',
        NameForeign: '',
        IntegrationNames: '',
        Salable: '0',
        Purchasable: '0',
        SalesPrice: '0.0',
        SalesCurr: '',
        PurchasePrice: '0.0',
        PurchaseNotes: '',
        AutoCalcRate: '0.0',
        PurchaseControllRate: '',
        PurchaseCurr: '',
        PurchaseTaxId: '',
        SalesControllRate: '',
        SalesNotes: '',
        SalesTaxId: '',
        ExtsServiceId: '',
        AutoCalcFinitemId: '',
      })
    }

    const resData = await dispatch(createFinitem(formData)).unwrap()
    if (resData) {
      clearInvItemData()
      setInvItemModal(false)
      new Noty({
        type: 'alert',
        text: ' Invoice Item has been created succesfully',
        timeout: 3000,
      }).show()
    }
  }

  return (
    <div>
      <CCard className="card cardCustom">
        <CCardBody>
          <div className="pageContainer-wrapper">
            <CForm
              className="simple_form horizontal-form"
              id="new_finitem"
              onSubmit={(e) => handleSubmitFinitem(e)}
            >
              <div className="row">
                <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div className="form-group finitem_code">
                    <label className="control-label" htmlFor="finitem_code">
                      Code <span title="required">*</span>
                    </label>
                    <CFormInput
                      className="form-control-cst"
                      type="text"
                      name="Code"
                      id="finitem_code"
                      value={invoiceItemData.Code}
                      onChange={(e) => handleChangeForm(e)}
                      invalid={finitemErrors && !isEmpty(finitemErrors.Code) ? true : false}
                      onFocus={() =>
                        dispatch(
                          clearFinitemError({
                            type: 'Code',
                            errorType: 'errFinitem',
                          }),
                        )
                      }
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {finitemErrors.Code}
                    </CFormFeedback>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div className="form-group finitem_name">
                    <label className="control-label" htmlFor="finitem_name">
                      Name <span title="required">*</span>
                    </label>
                    <CFormInput
                      className="form-control-cst"
                      type="text"
                      name="Name"
                      id="finitem_name"
                      value={invoiceItemData.Name}
                      onChange={(e) => handleChangeForm(e)}
                      invalid={finitemErrors && !isEmpty(finitemErrors.Name) ? true : false}
                      onFocus={() =>
                        dispatch(
                          clearFinitemError({
                            type: 'Name',
                            errorType: 'errFinitem',
                          }),
                        )
                      }
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {finitemErrors.Name}
                    </CFormFeedback>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div className="form-group select required finitem_item_type">
                    <label className="control-label select required" htmlFor="finitem_item_type">
                      Type <span title="required">*</span>
                    </label>
                    <CFormSelect
                      className="form-control-cst"
                      name="ItemType"
                      id="finitem_item_type"
                      value={invoiceItemData.ItemType}
                      onChange={(e) => handleChangeForm(e)}
                      invalid={finitemErrors && !isEmpty(finitemErrors.ItemType) ? true : false}
                      onFocus={() =>
                        dispatch(
                          clearFinitemError({
                            type: 'ItemType',
                            errorType: 'errFinitem',
                          }),
                        )
                      }
                    >
                      <option value=""></option>
                      <option value="cost_type">Cost Account</option>
                      <option value="invoice_line">Invoice Account</option>
                      <option value="inventory_item">Inventory Item</option>
                    </CFormSelect>
                    <CFormFeedback invalid className="fieldError-cst">
                      {finitemErrors.ItemType}
                    </CFormFeedback>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div className="form-group select finitem_involine_type">
                    <label className="control-label select" htmlFor="finitem_involine_type">
                      Invoice Type
                    </label>
                    <CFormSelect
                      className="form-control-cst"
                      name="InvolineType"
                      id="finitem_involine_type"
                      value={invoiceItemData.InvolineType}
                      onChange={(e) => handleChangeForm(e)}
                      invalid={finitemErrors && !isEmpty(finitemErrors.InvolineType) ? true : false}
                      onFocus={(e) => handleSelectFocus('InvolineType', e)}
                    >
                      <option value=""></option>
                      <option value="freight">Freight Charge</option>
                      <option value="stock">Warehouse Storage</option>
                      <option value="demurrage">Demurrage</option>
                      <option value="ordino">Ordino</option>
                      <option value="warrisk">War Risk</option>
                      <option value="port">Air-Sea Port Change</option>
                      <option value="handling">Handling Charge</option>
                      <option value="thc">THC</option>
                      <option value="fsc">FSC</option>
                      <option value="awa">AWA</option>
                      <option value="moc">MOC</option>
                      <option value="scc">SCC</option>
                      <option value="cgc">CGC</option>
                      <option value="rac">RAC</option>
                      <option value="ics">ics</option>
                      <option value="mdc">MDC</option>
                      <option value="asc">ASC</option>
                      <option value="dfc">DFC</option>
                      <option value="travel_pay">Travel Pay</option>
                      <option value="fuel">Fuel</option>
                      <option value="prim">Prim</option>
                      <option value="stoppage">Stoppage</option>
                      <option value="fec">fec</option>
                      <option value="other">Other</option>
                    </CFormSelect>
                    <CFormFeedback invalid className="fieldError-cst">
                      {finitemErrors.InvolineType}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div className="form-group finitem_name_foreign">
                    <label className="control-label" htmlFor="finitem_name_foreign">
                      Foreign Name
                    </label>
                    <CFormInput
                      className="form-control-cst strin-cstg"
                      type="text"
                      name="NameForeign"
                      id="finitem_name_foreign"
                      value={invoiceItemData.NameForeign}
                      onChange={(e) => handleChangeForm(e)}
                      invalid={finitemErrors && !isEmpty(finitemErrors.NameForeign) ? true : false}
                      onFocus={(e) => handleSelectFocus('NameForeign', e)}
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {finitemErrors.NameForeign}
                    </CFormFeedback>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div className="form-group select finitem_status">
                    <label className="control-label select" htmlFor="finitem_status">
                      Status
                    </label>
                    <CFormSelect
                      className="form-control-cst"
                      name="Status"
                      id="finitem_status"
                      value={invoiceItemData.Status}
                      onChange={(e) => handleChangeForm(e)}
                      invalid={finitemErrors && !isEmpty(finitemErrors.Status) ? true : false}
                      onFocus={(e) => handleSelectFocus('Status', e)}
                    >
                      <option value="active">Active</option>
                      <option value="passive">Passive</option>
                    </CFormSelect>
                    <CFormFeedback invalid className="fieldError-cst">
                      {finitemErrors.Status}
                    </CFormFeedback>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div className="form-group select finitem_ext_service_id">
                    <label className="control-label select" htmlFor="finitem_ext_service_id">
                      Associate with acc. service
                    </label>
                    <CFormSelect
                      className="form-control-cst"
                      name="ExtsServiceId"
                      id="finitem_ext_service_id"
                      value={invoiceItemData.ExtsServiceId}
                      onChange={(e) => handleChangeForm(e)}
                      invalid={
                        finitemErrors && !isEmpty(finitemErrors.ExtsServiceId) ? true : false
                      }
                      onFocus={(e) => handleSelectFocus('ExtsServiceId', e)}
                    >
                      <option value=""></option>
                    </CFormSelect>
                    <CFormFeedback invalid className="fieldError-cst">
                      {finitemErrors.ExtsServiceId}
                    </CFormFeedback>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"></div>
                <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"></div>
              </div>
              <div className="row mb-2">
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                  <div className="form-group text finitem_integration_names">
                    <label className="control-label text" htmlFor="finitem_integration_names">
                      Integration names
                    </label>
                    <CFormTextarea
                      className="form-control-cst"
                      style={{ height: '34px', maxHeight: '300px' }}
                      name="IntegrationNames"
                      id="finitem_integration_names"
                      value={invoiceItemData.IntegrationNames}
                      onChange={(e) => handleChangeForm(e)}
                      invalid={
                        finitemErrors && !isEmpty(finitemErrors.IntegrationNames) ? true : false
                      }
                      onFocus={(e) => handleSelectFocus('IntegrationNames', e)}
                    ></CFormTextarea>
                    <CFormFeedback invalid className="fieldError-cst">
                      {finitemErrors.IntegrationNames}
                    </CFormFeedback>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  You must type the new definition between # #! For example; #Free Out ## Postal
                  Service Revenue #
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div className="form-group boolean finitem_salable">
                    <label className="boolean" htmlFor="finitem_salable">
                      Saleable
                    </label>
                    <div className="checkbox-custom checkbox-primary">
                      <input
                        className="boolean"
                        type="checkbox"
                        name="Salable"
                        id="finitem_salable"
                        value={invoiceItemData.Salable}
                        checked={invoiceItemData.Salable === '1' ? true : false}
                        onChange={(e) => handleCheckedForm(e)}
                        onFocus={(e) => handleSelectFocus('Salable', e)}
                      />
                      <CFormFeedback
                        invalid={finitemErrors && !isEmpty(finitemErrors.Salable) ? true : false}
                        className="fieldError-cst"
                      >
                        {finitemErrors.Salable}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" id="sales_details">
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group finitem_sales_price">
                        <label className="control-label" htmlFor="finitem_sales_price">
                          Sales Price
                        </label>
                        <CFormInput
                          className="form-control-cst"
                          type="number"
                          step="any"
                          style={{ textAlign: 'right' }}
                          name="SalesPrice"
                          id="finitem_sales_price"
                          disabled={invoiceItemData.Salable === '0' ? true : false}
                          value={invoiceItemData.SalesPrice}
                          onChange={(e) => handleChangeForm(e)}
                          invalid={
                            finitemErrors && !isEmpty(finitemErrors.SalesPrice) ? true : false
                          }
                          onFocus={(e) => handleSelectFocus('SalesPrice', e)}
                        />
                        <CFormFeedback invalid className="fieldError-cst">
                          {finitemErrors.SalesPrice}
                        </CFormFeedback>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group select finitem_sales_curr">
                        <label className="control-label select" htmlFor="finitem_sales_curr">
                          Sales Currency
                        </label>
                        <CFormSelect
                          className="form-control-cst"
                          name="SalesCurr"
                          id="finitem_sales_curr"
                          disabled={invoiceItemData.Salable === '0' ? true : false}
                          invalid={
                            finitemErrors && !isEmpty(finitemErrors.SalesCurr) ? true : false
                          }
                          value={invoiceItemData.SalesCurr}
                          onChange={(e) => handleChangeForm(e)}
                          onFocus={(e) => handleSelectFocus('SalesCurr', e)}
                        >
                          {!fetchingCurrencies ? (
                            currencies && currencies.length > 0 ? (
                              <>
                                <option value=""></option>
                                {currencies.map((itm, i) => (
                                  <option key={i} value={itm.id}>
                                    {itm.name}
                                  </option>
                                ))}
                              </>
                            ) : (
                              <>
                                <option value=""></option>
                                <option disabled>No results found.</option>
                              </>
                            )
                          ) : (
                            <>
                              <option value=""></option>
                              <option>Loading...</option>
                            </>
                          )}
                        </CFormSelect>
                        <CFormFeedback invalid className="fieldError-cst">
                          {finitemErrors.SalesCurr}
                        </CFormFeedback>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group select finitem_sales_tax_id">
                        <label className="control-label select" htmlFor="finitem_sales_tax_id">
                          Sales Tax Rate
                        </label>
                        <CFormSelect
                          className="form-control-cst"
                          name="SalesTaxId"
                          id="finitem_sales_tax_id"
                          disabled={invoiceItemData.Salable === '0' ? true : false}
                          invalid={
                            finitemErrors && !isEmpty(finitemErrors.SalesTaxId) ? true : false
                          }
                          value={invoiceItemData.SalesTaxId}
                          onChange={(e) => handleChangeForm(e)}
                          onFocus={(e) => handleSelectFocus('SalesTaxId', e)}
                        >
                          {!fetchingTaxcodes ? (
                            taxcodes && taxcodes.length > 0 ? (
                              <>
                                <option value=""></option>
                                {taxcodes.map((itm, i) => (
                                  <option key={i} data-rate={itm.ratePerc} value={itm.id}>
                                    {itm.name}
                                  </option>
                                ))}
                              </>
                            ) : (
                              <>
                                <option value=""></option>
                                <option disabled>No results found.</option>
                              </>
                            )
                          ) : (
                            <>
                              <option value=""></option>
                              <option>Loading...</option>
                            </>
                          )}
                        </CFormSelect>
                        <CFormFeedback invalid className="fieldError-cst">
                          {finitemErrors.SalesTaxId}
                        </CFormFeedback>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group finitem_sales_controll_rate">
                        <label className="control-label" htmlFor="finitem_sales_controll_rate">
                          Control Rate
                        </label>
                        <CFormInput
                          className="form-control-cst"
                          style={{ textAlign: 'right' }}
                          type="number"
                          step="any"
                          name="SalesControllRate"
                          id="finitem_sales_controll_rate"
                          disabled={invoiceItemData.Salable === '0' ? true : false}
                          invalid={
                            finitemErrors && !isEmpty(finitemErrors.SalesControllRate)
                              ? true
                              : false
                          }
                          value={invoiceItemData.SalesControllRate}
                          onChange={(e) => handleChangeForm(e)}
                          onFocus={(e) => handleSelectFocus('SalesControllRate', e)}
                        />
                        <CFormFeedback invalid className="fieldError-cst">
                          {finitemErrors.SalesControllRate}
                        </CFormFeedback>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group text finitem_sales_notes">
                        <label className="control-label text" htmlFor="finitem_sales_notes">
                          Sales Notes
                        </label>
                        <CFormTextarea
                          className="form-control-cst tex-cstt"
                          style={{ height: '34px', maxHeight: '300px' }}
                          name="SalesNotes"
                          id="finitem_sales_notes"
                          disabled={invoiceItemData.Salable === '0' ? true : false}
                          invalid={
                            finitemErrors && !isEmpty(finitemErrors.SalesNotes) ? true : false
                          }
                          value={invoiceItemData.SalesNotes}
                          onChange={(e) => handleChangeForm(e)}
                          onFocus={(e) => handleSelectFocus('SalesNotes', e)}
                        ></CFormTextarea>
                        <CFormFeedback invalid className="fieldError-cst">
                          {finitemErrors.SalesNotes}
                        </CFormFeedback>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                  <div className="form-group boolean finitem_purchasable">
                    <label className="boolean" htmlFor="finitem_purchasable">
                      Purchasable
                    </label>
                    <div className="checkbox-custom checkbox-primary">
                      <input
                        className="boolean"
                        type="checkbox"
                        name="Purchasable"
                        id="finitem_purchasable"
                        value={invoiceItemData.Purchasable}
                        checked={invoiceItemData.Purchasable === '1' ? true : false}
                        onChange={(e) => handleCheckedForm(e)}
                        onFocus={(e) => handleSelectFocus('Purchasable', e)}
                      />
                      <CFormFeedback
                        invalid={
                          finitemErrors && !isEmpty(finitemErrors.Purchasable) ? true : false
                        }
                        className="fieldError-cst"
                      >
                        {finitemErrors.Purchasable}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div
                  className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
                  id="purchase_details"
                >
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group finitem_purchase_price">
                        <label className="control-label" htmlFor="finitem_purchase_price">
                          Purchase Price
                        </label>
                        <CFormInput
                          className="form-control-cst"
                          style={{ textAlign: 'right' }}
                          type="number"
                          step="any"
                          name="PurchasePrice"
                          id="finitem_purchase_price"
                          disabled={invoiceItemData.Purchasable === '0' ? true : false}
                          invalid={
                            finitemErrors && !isEmpty(finitemErrors.PurchasePrice) ? true : false
                          }
                          value={invoiceItemData.PurchasePrice}
                          onChange={(e) => handleChangeForm(e)}
                          onFocus={(e) => handleSelectFocus('PurchasePrice', e)}
                        />
                        <CFormFeedback invalid className="fieldError-cst">
                          {finitemErrors.Purchasable}
                        </CFormFeedback>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group select finitem_purchase_curr">
                        <label className="control-label select" htmlFor="finitem_purchase_curr">
                          Purchase Currency
                        </label>
                        <CFormSelect
                          className="form-control-cst"
                          name="PurchaseCurr"
                          id="finitem_purchase_curr"
                          disabled={invoiceItemData.Purchasable === '0' ? true : false}
                          invalid={
                            finitemErrors && !isEmpty(finitemErrors.PurchaseCurr) ? true : false
                          }
                          value={invoiceItemData.PurchaseCurr}
                          onChange={(e) => handleChangeForm(e)}
                          onFocus={(e) => handleSelectFocus('PurchaseCurr', e)}
                        >
                          {!fetchingCurrencies ? (
                            currencies && currencies.length > 0 ? (
                              <>
                                <option value=""></option>
                                {currencies.map((itm, i) => (
                                  <option key={i} value={itm.id}>
                                    {itm.name}
                                  </option>
                                ))}
                              </>
                            ) : (
                              <>
                                <option value=""></option>
                                <option disabled>No results found.</option>
                              </>
                            )
                          ) : (
                            <>
                              <option value=""></option>
                              <option>Loading...</option>
                            </>
                          )}
                        </CFormSelect>
                        <CFormFeedback invalid className="fieldError-cst">
                          {finitemErrors.PurchaseCurr}
                        </CFormFeedback>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                      <label
                        style={{ fontSize: '11px' }}
                        className="integer"
                        htmlFor="finitem_purchase_tax_id"
                      >
                        Purchase Tax Rate
                      </label>
                      <div className="form-group select finitem_purchase_tax_id">
                        <CFormSelect
                          className="form-control-cst"
                          name="PurchaseTaxId"
                          id="finitem_purchase_tax_id"
                          disabled={invoiceItemData.Purchasable === '0' ? true : false}
                          invalid={
                            finitemErrors && !isEmpty(finitemErrors.PurchaseTaxId) ? true : false
                          }
                          value={invoiceItemData.PurchaseTaxId}
                          onChange={(e) => handleChangeForm(e)}
                          onFocus={(e) => handleSelectFocus('PurchaseTaxId', e)}
                        >
                          {!fetchingTaxcodes ? (
                            taxcodes && taxcodes.length > 0 ? (
                              <>
                                <option value=""></option>
                                {taxcodes.map((itm, i) => (
                                  <option key={i} data-rate={itm.ratePerc} value={itm.id}>
                                    {itm.name}
                                  </option>
                                ))}
                              </>
                            ) : (
                              <>
                                <option value=""></option>
                                <option disabled>No results found.</option>
                              </>
                            )
                          ) : (
                            <>
                              <option value=""></option>
                              <option>Loading...</option>
                            </>
                          )}
                        </CFormSelect>
                        <CFormFeedback invalid className="fieldError-cst">
                          {finitemErrors.PurchaseTaxId}
                        </CFormFeedback>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group finitem_purchase_controll_rate">
                        <label className="control-label" htmlFor="finitem_purchase_controll_rate">
                          Control Rate
                        </label>
                        <CFormInput
                          className="form-control-cst"
                          style={{ textAlign: 'right' }}
                          type="number"
                          step="any"
                          name="PurchaseControllRate"
                          id="finitem_purchase_controll_rate"
                          disabled={invoiceItemData.Purchasable === '0' ? true : false}
                          invalid={
                            finitemErrors && !isEmpty(finitemErrors.PurchaseControllRate)
                              ? true
                              : false
                          }
                          value={invoiceItemData.PurchaseControllRate}
                          onChange={(e) => handleChangeForm(e)}
                          onFocus={(e) => handleSelectFocus('PurchaseControllRate', e)}
                        />
                        <CFormFeedback invalid className="fieldError-cst">
                          {finitemErrors.PurchaseControllRate}
                        </CFormFeedback>
                      </div>
                    </div>
                    <div className="ccol-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group text finitem_purchase_notes">
                        <label className="control-label text" htmlFor="finitem_purchase_notes">
                          Purchase Notes
                        </label>
                        <CFormTextarea
                          className="form-control-cst tex-cstt"
                          style={{ height: '34px', maxHeight: '300px' }}
                          name="PurchaseNotes"
                          id="finitem_purchase_notes"
                          disabled={invoiceItemData.Purchasable === '0' ? true : false}
                          invalid={
                            finitemErrors && !isEmpty(finitemErrors.PurchaseNotes) ? true : false
                          }
                          value={invoiceItemData.PurchaseNotes}
                          onChange={(e) => handleChangeForm(e)}
                          onFocus={(e) => handleSelectFocus('PurchaseNotes', e)}
                        ></CFormTextarea>
                        <CFormFeedback invalid className="fieldError-cst">
                          {finitemErrors.PurchaseNotes}
                        </CFormFeedback>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div className="form-group finitem finitem_auto_calc_finitem_id">
                    <label className="control-label finitem" htmlFor="finitem_auto_calc_finitem_id">
                      Auto Calculate By
                    </label>
                    <CFormSelect
                      className="form-control-cst"
                      name="AutoCalcFinitemId"
                      id="finitem_auto_calc_finitem_id"
                      invalid={
                        finitemErrors && !isEmpty(finitemErrors.AutoCalcFinitemId) ? true : false
                      }
                      value={invoiceItemData.AutoCalcFinitemId}
                      onChange={(e) => handleChangeForm(e)}
                      onFocus={(e) => handleSelectFocus('AutoCalcFinitemId', e)}
                    >
                      <option value=""></option>
                    </CFormSelect>
                    <CFormFeedback invalid className="fieldError-cst">
                      {finitemErrors.AutoCalcFinitemId}
                    </CFormFeedback>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                  <div className="form-group finitem_auto_calc_rate">
                    <label className="control-label" htmlFor="finitem_auto_calc_rate">
                      Auto Calculate Rate
                    </label>
                    <CFormInput
                      className="form-control-cst"
                      type="number"
                      step="any"
                      name="AutoCalcRate"
                      id="finitem_auto_calc_rate"
                      invalid={finitemErrors && !isEmpty(finitemErrors.AutoCalcRate) ? true : false}
                      value={invoiceItemData.AutoCalcRate}
                      onChange={(e) => handleChangeForm(e)}
                      onFocus={(e) => handleSelectFocus('AutoCalcRate', e)}
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {finitemErrors.AutoCalcRate}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <CButton
                    className="float-right"
                    color="success"
                    type="submit"
                    disabled={creatingFinitem ? true : false}
                  >
                    {creatingFinitem ? (
                      'Processing...'
                    ) : (
                      <span>
                        Save <i className="fa fa-check"></i>
                      </span>
                    )}
                  </CButton>
                </div>
              </div>
            </CForm>
          </div>
        </CCardBody>
      </CCard>
    </div>
  )
}

NewInvoiceItem.propTypes = {
  setInvItemModal: PropTypes.func,
}
export default NewInvoiceItem
