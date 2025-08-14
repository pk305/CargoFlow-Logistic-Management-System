import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { CButton } from '@coreui/react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import countryList from 'react-select-country-list'
import { isNull, toUpper, isEmpty } from 'lodash'
import moment from 'moment'
import { useLocation, useHistory } from 'react-router-dom'
import { createTempdoc } from 'src/redux/slices/tempdocSlice'
import $ from 'jquery'
import InvoiceDefaultCharges from './InvoiceDefaultCharges'

const formatMoney = (n, c, d, t) => {
  let j = ''
  c = isNaN((c = Math.abs(c))) ? 2 : c
  d = d === undefined ? '.' : d
  t = t === undefined ? ',' : t
  let s = n < 0 ? '-' : ''
  let i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c))))
  j = (j = i.length) > 3 ? j % 3 : 0

  return (
    s +
    (j ? i.substr(0, j) + t : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
    (c
      ? d +
        Math.abs(n - i)
          .toFixed(c)
          .slice(2)
      : '')
  )
}

const InvoiceDefaultTemplate = ({ invoiceData }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [tempdocData, setTempdocData] = useState({
    templateId: '',
    invoiceId: '',
    imgLogoUrl: '',
    companyTitle: '',
    companyTitle2: '',
    companyAddress: '',
    companyAddress2: '',
    companyTel: '',
    companyTel2: '',
    companyEmail: '',
    companyEmail2: '',
    companyVat: ': ',
    companyVat2: '',
    mainTitle: 'INVOICE',
    mainTitle2: 'INVOICE',
    customerHeader: 'CUSTOMER',
    customerHeader2: 'CUSTOMER',
    customer: '',
    customer2: '',
    dateHeader: 'DATE',
    dateHeader2: 'DATE',
    date: '',
    date2: '',
    refNoHeader: 'REF. NO',
    refNoHeader2: 'REF. NO',
    refNo: '',
    refNo2: '',
    invoiceNoHeader: 'INVOICE NO',
    invoiceNoHeader2: 'INVOICE NO',
    invoiceNo: '',
    invoiceNo2: '',
    customerRefHeader: 'CUSTOMER REF',
    customerRefHeader2: 'CUSTOMER REF',
    customerRef: '',
    customerRef2: '',
    chargesHeader: 'CHARGES',
    chargesHeader2: 'CHARGES',
    charges: [],
    addInfoHeader: 'ADD. İNFO',
    addInfoHeader2: 'ADD. İNFO',
    addInfo: [],
    addInfo2: [],
    unitPrice: 'UNIT PRICE',
    unitPrice2: 'UNIT PRICE',
    unitNumber: 'QTY',
    unitNumber2: 'QTY',
    amountHeader: 'AMOUNT',
    amountHeader2: 'AMOUNT',
    amount: '',
    amount2: '',
    subTotalHeader: 'SUB TOTAL',
    subTotalHeader2: 'SUB TOTAL',
    subTotalAmount: '',
    subTotalAmount2: '',
    totalHeader: 'TOTAL',
    totalHeader2: 'TOTAL',
    totalAmount: '',
    totalAmount2: '',
    vatHeader: 'VAT',
    vatHeader2: 'VAT',
    vatAmount: '',
    vatAmount2: '',
    paymentTerms: '',
    paymentTerms2: '',
    invoiceDueDate: '',
    invoiceDueDate2: '',
    ibanNo1: '',
    ibanNo21: '',
    beneficiary1: '',
    beneficiary21: '',
    bic1: '',
    bic21: '',
    bankDetails1: '',
    bankDetails21: '',
    ibanNo2: '',
    ibanNo22: '',
    beneficiary2: '',
    beneficiary22: '',
    bic2: '',
    bic22: '',
    bankDetails2: '',
    bankDetails22: '',
    ibanNo3: '',
    ibanNo23: '',
    beneficiary3: '',
    beneficiary23: '',
    bic3: '',
    bic23: '',
    bankDetails3: '',
    bankDetails23: '',
  })
  const { creatingTempdoc } = useSelector((state) => state.tempdoc)
  const { company } = useSelector((state) => state.system)

  const useQuery = () => {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
  }

  const handleChangeTemp = (e) => {
    const name = e.currentTarget.getAttribute('data-name')
    const value = e.currentTarget.textContent
    setTempdocData({
      ...tempdocData,
      [name]: value,
    })
  }

  const addTempDoc = async (e) => {
    e.preventDefault()
    const d = tempdocData
    const data = {
      templateId: d.templateId,
      invoiceId: d.invoiceId,
      imgLogoUrl: d.imgLogoUrl,
      companyTitle: d.companyTitle,
      companyAddress: d.companyAddress,
      companyTel: d.companyTel,
      companyEmail: d.companyEmail,
      companyVat: d.companyVat,
      mainTitle: d.mainTitle,
      customerHeader: d.customerHeader,
      customer: d.customer,
      dateHeader: d.dateHeader,
      date: d.date,
      refNoHeader: d.refNoHeader,
      refNo: d.refNo,
      invoiceNoHeader: d.invoiceNoHeader,
      invoiceNo: d.invoiceNo,
      customerRefHeader: d.customerRefHeader,
      customerRef: d.customerRef,
      chargesHeader: d.chargesHeader,
      charges: d.charges,
      addInfoHeader: d.addInfoHeader,
      addInfo: d.addInfo,
      unitPrice: d.unitPrice,
      unitNumber: d.unitNumber,
      amountHeader: d.amountHeader,
      amount: d.amount,
      subTotalHeader: d.subTotalHeader,
      subTotalAmount: d.subTotalAmount,
      totalHeader: d.totalHeader,
      totalAmount: d.totalAmount,
      vatHeader: d.vatHeader,
      vatAmount: d.vatAmount,
      paymentTerms: d.paymentTerms,
      invoiceDueDate: d.invoiceDueDate,
      ibanNo1: d.ibanNo1,
      beneficiary1: d.beneficiary1,
      bic1: d.bic1,
      bankDetails1: d.bankDetails1,
      ibanNo2: d.ibanNo2,
      beneficiary2: d.beneficiary2,
      bic2: d.bic2,
      bankDetails2: d.bankDetails2,
      ibanNo3: d.ibanNo3,
      beneficiary3: d.beneficiary3,
      bic3: d.bic3,
      bankDetails3: d.bankDetails3,
    }
    //form data
    const formData = new FormData()
    formData.append('tempCode', tempdocData.templateId)
    formData.append('tempdocData', JSON.stringify(data))
    formData.append('invoiceId', tempdocData.invoiceId)
    formData.append('tempHtml', JSON.stringify($('#templatediv').clone().html()))

    const resData = await dispatch(createTempdoc(formData)).unwrap()
    if (resData) {
      history.push(`/tempdocs/${resData.name}`)
    }
  }

  let query = useQuery()

  const handleSetTempDoc = useCallback(() => {
    if (company) {
      setTempdocData((state) => ({
        ...state,
        imgLogoUrl: company.logoUrl,
        companyTitle: company.name,
        companyTitle2: company.name,
        companyAddress: `${company.address} / ${
          company.countryId ? countryList().getLabel(company.countryId) : ''
        }`,
        companyAddress2: `${company.address} / ${
          company.countryId ? countryList().getLabel(company.countryId) : ''
        }`,
        companyTel: company.phone,
        companyTel2: company.phone,
        companyEmail: company.email,
        companyEmail2: company.email,
        companyVat: company.taxno ? 'VAT: ' + company.taxno : 'VAT: ',
        companyVat2: company.taxno ? 'VAT: ' + company.taxno : 'VAT: ',
        ibanNo1: '',
        ibanNo21: '',
        beneficiary1: '',
        beneficiary21: '',
        bic1: '',
        bic21: '',
        bankDetails1: '',
        bankDetails21: '',
        ibanNo2: '',
        ibanNo22: '',
        beneficiary2: '',
        beneficiary22: '',
        bic2: '',
        bic22: '',
        bankDetails2: '',
        bankDetails22: '',
        ibanNo3: '',
        ibanNo23: '',
        beneficiary3: '',
        beneficiary23: '',
        bic3: '',
        bic23: '',
        bankDetails3: '',
        bankDetails23: '',
      }))
    }

    if (invoiceData) {
      const inv = invoiceData

      // console.log(inv)
      setTempdocData((state) => ({
        ...state,
        invoiceId: inv.id,
        invoiceNo: inv.invoiceName ? toUpper(inv.invoiceName) : null,
        date: inv.invoiceDate,
        date2: inv.invoiceDate ? moment(inv.invoiceDate).format('L') : null,
        refNo: inv.refNo,
        refNo2: inv.refNo,
        customer: `${inv.invoicedCompany.name}\n${
          inv.invoicedCompany.address ? inv.invoicedCompany.address : ''
        }\n${inv.invoicedCompany.cityName} / ${
          inv.invoicedCompany.countryId ? countryList().getLabel(inv.invoicedCompany.countryId) : ''
        }\nVAT: ${inv.invoicedCompany.taxno ? inv.invoicedCompany.taxno : ''}\n`,
        customer2: `${inv.invoicedCompany.name}\n${
          inv.invoicedCompany.address ? inv.invoicedCompany.address : ''
        }\n${inv.invoicedCompany.cityName} / ${
          inv.invoicedCompany.countryId ? countryList().getLabel(inv.invoicedCompany.countryId) : ''
        }\nVAT: ${inv.invoicedCompany.taxno ? inv.invoicedCompany.taxno : ''}\n`,
        charges: inv.invoicedCharges.length > 0 ? inv.invoicedCharges : [],
        invoiceDueDate: inv.dueDate,
        invoiceDueDate2: inv.dueDate ? moment(inv.dueDate).format('L') : null,
        subTotalAmount: inv.subTotal,
        subTotalAmount2: inv.subTotal ? formatMoney(inv.subTotal) : '0.00',
        totalAmount: inv.netTotal,
        totalAmount2: inv.netTotal ? formatMoney(inv.netTotal) : '0.00',
        vatAmount: inv.vatTotal,
        vatAmount2: inv.vatTotal ? formatMoney(inv.vatTotal) : '0.00',
      }))
    }

    if (query.get('template_id')) {
      setTempdocData((state) => ({
        ...state,
        templateId: query.get('template_id'),
      }))
    }
  }, [company, invoiceData, query])

  useEffect(() => {
    handleSetTempDoc()
  }, [handleSetTempDoc])

  if (isNull(company) && isNull(invoiceData)) return null

  return (
    <div className="containerPreview">
      <div className="hidden-print preview_button">
        <div className="form-actions">
          <form id="newtempdocs" onSubmit={(e) => addTempDoc(e)}>
            <CButton
              type="submit"
              color="primary"
              id="template_submit_button"
              disabled={creatingTempdoc ? true : false}
            >
              {creatingTempdoc ? 'Processing...' : 'Save'}
            </CButton>
          </form>
        </div>
      </div>
      <div id="templatediv" style={{ backgroundColor: '#FFFFFF !important' }}>
        <div id="doc_div" style={{ height: '1110px', width: '794px' }}>
          <div style={{ padding: '5mm 10mm 0mm', position: 'absolute', left: '0px', top: '0px' }}>
            <table cellSpacing="0" cellPadding="0" align="center">
              <tbody>
                <tr>
                  <td style={{ width: '100%' }}>
                    <table width="100%" cellSpacing="0" cellPadding="0">
                      <tbody>
                        <tr>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              width: '100%',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <div
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '10px',
                                textAlign: 'right',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            ></div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingBottom: '3mm', width: '100%' }}>
                    <table width="100%" cellSpacing="0" cellPadding="0">
                      <tbody>
                        <tr className="">
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              width: '60mm',
                              backgroundColor: 'transparent',
                              border: isEmpty(tempdocData.imgLogoUrl) ? '1px solid #c4c9d0' : '',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '20mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                            >
                              {!isEmpty(tempdocData.imgLogoUrl) && (
                                <img
                                  width="120"
                                  height="30"
                                  src={tempdocData.imgLogoUrl}
                                  style={{ width: '219px', height: '86px', objectFit: 'contain' }}
                                  alt=""
                                />
                              )}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              width: '140mm',
                              backgroundColor: 'transparent',
                              paddingTop: '3mm',
                            }}
                          >
                            <table width="100%" cellSpacing="0" cellPadding="0">
                              <tbody>
                                <tr className="">
                                  <td
                                    className="line-td show_on_doc_div"
                                    style={{
                                      verticalAlign: 'top',
                                      wordBreak: 'normal',
                                      width: '100%',
                                      backgroundColor: 'transparent',
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: '100%',
                                        padding: '0mm',
                                        fontSize: '14px',
                                        textAlign: 'right',
                                        color: 'rgb(51, 51, 51)',
                                        fontWeight: 'bold',
                                        fontStyle: 'normal',
                                        textDecoration: 'none',
                                      }}
                                      data-name="companyTitle"
                                      onInput={(e) => handleChangeTemp(e)}
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      {tempdocData.companyTitle2}
                                    </span>
                                  </td>
                                </tr>
                                <tr className="">
                                  <td
                                    className="line-td show_on_doc_div"
                                    style={{
                                      verticalAlign: 'top',
                                      wordBreak: 'normal',
                                      width: '100%',
                                      backgroundColor: 'transparent',
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: '100%',
                                        padding: '0mm',
                                        fontSize: '12px',
                                        textAlign: 'right',
                                        color: 'rgb(51, 51, 51)',
                                        fontWeight: 'normal',
                                        fontStyle: 'normal',
                                        textDecoration: 'none',
                                      }}
                                      data-name="companyAddress"
                                      onInput={(e) => handleChangeTemp(e)}
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      {tempdocData.companyAddress2}
                                    </span>
                                  </td>
                                </tr>
                                <tr className="">
                                  <td
                                    className="line-td show_on_doc_div"
                                    style={{
                                      verticalAlign: 'top',
                                      wordBreak: 'normal',
                                      width: '100%',
                                      backgroundColor: 'transparent',
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: '100%',
                                        padding: '0mm',
                                        fontSize: '12px',
                                        textAlign: 'right',
                                        color: 'rgb(51, 51, 51)',
                                        fontWeight: 'normal',
                                        fontStyle: 'normal',
                                        textDecoration: 'none',
                                      }}
                                      data-name="companyTel"
                                      onInput={(e) => handleChangeTemp(e)}
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      {tempdocData.companyTel2}
                                    </span>
                                  </td>
                                </tr>
                                <tr className="">
                                  <td
                                    className="line-td show_on_doc_div"
                                    style={{
                                      verticalAlign: 'top',
                                      wordBreak: 'normal',
                                      width: '100%',
                                      backgroundColor: 'transparent',
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: '100%',
                                        padding: '0mm',
                                        fontSize: '12px',
                                        textAlign: 'right',
                                        color: 'rgb(51, 51, 51)',
                                        fontWeight: 'normal',
                                        fontStyle: 'normal',
                                        textDecoration: 'none',
                                      }}
                                      data-name="companyEmail"
                                      onInput={(e) => handleChangeTemp(e)}
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      {tempdocData.companyEmail2}
                                    </span>
                                  </td>
                                </tr>
                                <tr className="">
                                  <td
                                    className="line-td show_on_doc_div"
                                    style={{
                                      verticalAlign: 'top',
                                      wordBreak: 'normal',
                                      width: '100%',
                                      backgroundColor: 'transparent',
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: '100%',
                                        padding: '0mm',
                                        fontSize: '12px',
                                        textAlign: 'right',
                                        color: 'rgb(51, 51, 51)',
                                        fontWeight: 'normal',
                                        fontStyle: 'normal',
                                        textDecoration: 'none',
                                      }}
                                      data-name="companyVat"
                                      onInput={(e) => handleChangeTemp(e)}
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      {tempdocData.companyVat2}
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style={{ width: '100%', paddingBottom: '2mm' }}>
                    <table width="100%" cellSpacing="0" cellPadding="0">
                      <tbody>
                        <tr className="">
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              width: '100%',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '16px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="mainTitle"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.mainTitle2}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style={{ width: '100%', paddingBottom: '5mm' }}>
                    <table width="100%" cellSpacing="0" cellPadding="0">
                      <tbody>
                        <tr className="">
                          <td
                            colSpan="3"
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                              width: '50%',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="customerHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.customerHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                              width: '16,6666666667%',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="dateHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.dateHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            colSpan="2"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                              width: '16,6666666667%',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="refNoHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.refNoHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                              width: '16,6666666667%',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="invoiceNoHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.invoiceNoHeader2}
                            </span>
                          </td>
                        </tr>
                        <tr className="">
                          <td
                            rowSpan="3"
                            colSpan="3"
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="customer"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                              spellCheck="false"
                              dangerouslySetInnerHTML={{ __html: tempdocData.customer2 }}
                            ></span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="date"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.date2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            colSpan="2"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="refNo"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.refNo2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="invoiceNo"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.invoiceNo2}
                            </span>
                          </td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="4"
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                              height: '5mm',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="customerRefHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.customerRefHeader2}
                            </span>
                          </td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="4"
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                                minHeight: '14mm',
                              }}
                              data-name="customerRef"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.customerRef2}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="6" style={{ height: '3mm' }}></td>
                        </tr>
                        <tr>
                          <td colSpan="6" style={{ height: '3mm' }}></td>
                        </tr>
                        <tr>
                          <td colSpan="6" style={{ height: '3mm' }}></td>
                        </tr>
                        {/* charges */}
                        <tr className="">
                          <td
                            colSpan="3"
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="chargesHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.chargesHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="addInfoHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.addInfoHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="vatHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.unitPrice2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="unitNumber"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.unitNumber2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="amountHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.amountHeader2}
                            </span>
                          </td>
                        </tr>
                        {/* looop */}
                        {tempdocData.charges && tempdocData.charges.length > 0
                          ? tempdocData.charges.map((item, idx) => (
                              <InvoiceDefaultCharges
                                key={idx}
                                handleChangeTemp={handleChangeTemp}
                                invDataItem={item}
                              />
                            ))
                          : null}
                        {/*</loop>  */}
                        <tr>
                          <td colSpan="7"></td>
                        </tr>
                        {/* vatHeader */}
                        <tr className="">
                          <td
                            colSpan="3"
                            className="line-td show_on_doc_div"
                            style={{
                              borderTop: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'right',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                            ></span>
                          </td>
                          <td
                            colSpan="3"
                            className="line-td show_on_doc_div"
                            style={{
                              borderTop: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'right',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                            >
                              {tempdocData.subTotalHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'right',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                            >
                              {tempdocData.subTotalAmount2}
                            </span>
                          </td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="3"
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'right',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                            ></span>
                          </td>
                          <td
                            colSpan="3"
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'right',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                            >
                              {tempdocData.vatHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'right',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                            >
                              {/* formatMoney(invData.vatTotal) */}
                              {tempdocData.vatAmount2}
                            </span>
                          </td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="3"
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'right',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                            ></span>
                          </td>
                          <td
                            colSpan="3"
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'right',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                            >
                              {tempdocData.totalHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'right',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                            >
                              {tempdocData.totalAmount2}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                {/* footer */}
                <tr>
                  <td style={{ width: '100%' }}>
                    <table width="100%" cellSpacing="0" cellPadding="0">
                      <tbody>
                        <tr className="">
                          <td
                            colSpan="2"
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              width: '50%',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="paymentTerms"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              Payment Terms:{' '}
                              <span
                                style={{ float: 'none', fontWeight: 'normal', minWidth: '10mm' }}
                              >
                                {tempdocData.paymentTerms2}
                              </span>
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              width: '50%',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="invoiceDueDate"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              Invoice Due Date:{' '}
                              <span
                                style={{ float: 'none', fontWeight: 'normal', minWidth: '10mm' }}
                              >
                                {tempdocData.invoiceDueDate2}
                              </span>
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="3" style={{ height: '3mm' }}></td>
                        </tr>
                        <tr>
                          <td></td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="2"
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="ibanNo1"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              EUR/USD IBAN No:{' '}
                              <span
                                style={{ float: 'none', fontWeight: 'normal', minWidth: '10mm' }}
                              >
                                {tempdocData.ibanNo21}
                              </span>
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="bic1"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              BIC:{' '}
                              <span
                                style={{ float: 'none', fontWeight: 'normal', minWidth: '10mm' }}
                              >
                                {tempdocData.bic21}
                              </span>
                            </span>
                          </td>
                        </tr>

                        <tr className="">
                          <td
                            colSpan="2"
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="beneficiary1"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              Beneficiary:{' '}
                              <span
                                style={{ float: 'none', fontWeight: 'normal', minWidth: '10mm' }}
                              >
                                {tempdocData.beneficiary21}
                              </span>
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="bankDetails1"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              Bank Details:{' '}
                              <span
                                style={{ float: 'none', fontWeight: 'normal', minWidth: '10mm' }}
                              >
                                {tempdocData.bankDetails21}
                              </span>
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="3" style={{ height: '3mm' }}></td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="2"
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="ibanNo2"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              EUR/USD IBAN No:{' '}
                              <span
                                style={{ float: 'none', fontWeight: 'normal', minWidth: '10mm' }}
                              >
                                {tempdocData.ibanNo22}
                              </span>
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="bic2"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              BIC:{' '}
                              <span
                                style={{ float: 'none', fontWeight: 'normal', minWidth: '10mm' }}
                              >
                                {tempdocData.bic22}
                              </span>
                            </span>
                          </td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="2"
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="beneficiary2"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              Beneficiary:{' '}
                              <span
                                style={{ float: 'none', fontWeight: 'normal', minWidth: '10mm' }}
                              >
                                {tempdocData.beneficiary22}
                              </span>
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="bankDetails2"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              Bank Details:{' '}
                              <span
                                style={{ float: 'none', fontWeight: 'normal', minWidth: '10mm' }}
                              >
                                {tempdocData.bankDetails22}
                              </span>
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="3" style={{ height: '3mm' }}></td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="2"
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="ibanNo3"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              EUR/USD IBAN No:{' '}
                              <span
                                style={{ float: 'none', fontWeight: 'normal', minWidth: '10mm' }}
                              >
                                {tempdocData.ibanNo23}
                              </span>
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="bic3"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              BIC:{' '}
                              <span
                                style={{ float: 'none', fontWeight: 'normal', minWidth: '10mm' }}
                              >
                                {tempdocData.bic23}
                              </span>
                            </span>
                          </td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="2"
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="beneficiary3"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              Beneficiary:{' '}
                              <span
                                style={{ float: 'none', fontWeight: 'normal', minWidth: '10mm' }}
                              >
                                {tempdocData.beneficiary23}
                              </span>
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="bankDetails3"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              Bank Details:{' '}
                              <span
                                style={{ float: 'none', fontWeight: 'normal', minWidth: '10mm' }}
                              >
                                {tempdocData.bankDetails23}
                              </span>
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="3" style={{ height: '3mm' }}></td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="3"
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                            ></span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

InvoiceDefaultTemplate.propTypes = {
  invoiceData: PropTypes.object,
}

export default InvoiceDefaultTemplate
