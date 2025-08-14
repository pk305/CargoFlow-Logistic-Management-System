import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { CButton, CForm } from '@coreui/react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { updateTempdoc } from 'src/redux/slices/tempdocSlice'
import $ from 'jquery'
import { useHistory } from 'react-router-dom'
import { toUpper, isEmpty } from 'lodash'
import moment from 'moment'
import Noty from 'noty'
import InvoiceDefaultCharges from '../invoices/InvoiceDefaultCharges'
import { InvoiceDefaultPdf } from '../pdfs/InvoiceDefaultPdf'
import { InvoiceDefaultExcel } from '../excels/InvoiceDefaultExcel'
import { fetchCompanyLogoDataUrl } from 'src/redux/slices/systemSlice'
// import html2canvas from 'html2canvas'
// import * as jspdf from 'jspdf'

//
Noty.overrideDefaults({
  layout: 'topRight',
  theme: 'nest',
  timeout: 6000,
  progressBar: false,
  // closeWith: ['click', 'button'],
})

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

const InvoiceDefaultTempdoc = ({ reqData, tempdocDataId }) => {
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
    vatTotalHeader: '',
    vatTotalHeader2: '',
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
  const { updatingTempdoc } = useSelector((state) => state.tempdoc)
  const { logoData } = useSelector((state) => state.system)

  const handleChangeTemp = (e) => {
    const name = e.currentTarget.getAttribute('data-name')
    const value = e.currentTarget.textContent
    setTempdocData({
      ...tempdocData,
      [name]: value,
    })
  }

  const companyLogoDataUrl = useMemo(() => {
    if (logoData) {
      return logoData.logoDataUrl
    }
  }, [logoData])

  const saveTempDoc = async (e) => {
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
      vatTotalHeader: d.vatTotalHeader,
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
    const formData = {
      tempdocData: JSON.stringify(data),
      tempHtml: JSON.stringify($('#templatediv').clone().html()),
    }

    const resData = await dispatch(updateTempdoc({ Id: tempdocDataId, ...formData })).unwrap()
    if (resData) {
      new Noty({
        text: 'Tempdoc successfully updated',
        type: 'alert',
      }).show()
      history.push('/financor/debit')
    }
  }

  const pdfDownload = (e) => {
    e.preventDefault()
    return InvoiceDefaultPdf(tempdocData, companyLogoDataUrl, 'download')
  }

  const sendMailTempdoc = (e) => {
    e.preventDefault()
    history.push(`/emails/new?tempdoc_id=${tempdocDataId}`)
  }

  const printTempdoc = (e) => {
    e.preventDefault()
    return InvoiceDefaultPdf(tempdocData, companyLogoDataUrl, 'print')
  }

  // const downloadPDF = () => {
  //   // const data = document.getElementById('purchaseTable') // Id of the table
  //   // html2canvas(data).then((canvas) => {
  //   //   // Few necessary setting options
  //   //   const imgWidth = 208
  //   //   const pageHeight = 295
  //   //   const imgHeight = (canvas.height * imgWidth) / canvas.width
  //   //   const heightLeft = imgHeight
  //   //   const contentDataURL = canvas.toDataURL('image/png')
  //   //   // Your 1st parameter (landscape [l] or portrait [p]) determines what becomes the width and the height.
  //   //   const pdf = new jspdf('p', 'mm', 'a4') // A4 size page of PDF
  //   //   const position = 0
  //   //   /* addImage explained below:
  //   //   param 1 -> image in code format
  //   //   param 2 -> type of the image. SVG not supported. needs to be either PNG or JPEG.
  //   //   all params are specified in integer
  //   //   param 3 -> X axis margin from left
  //   //   param 4 -> Y axis margin from top
  //   //   param 5 -> width of the image
  //   //   param 6 -> height of the image
  //   //   */
  //   //   // pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
  //   //   // pdf.addImage(contentDataURL, 'PNG', 18, 30, imgWidth - 17, imgHeight);
  //   //   pdf.addImage(contentDataURL, 'PNG', 18, 30, imgWidth - 21, imgHeight)
  //   //   pdf.save('MYPdf.pdf') // Generated PDF
  //   // })
  // }

  const excelDownload = (e) => {
    e.preventDefault()
    return InvoiceDefaultExcel(tempdocData, companyLogoDataUrl, tempdocDataId)
  }

  const handleSetTempDoc = useCallback(() => {
    if (reqData) {
      const req = reqData
      setTempdocData((state) => ({
        ...state,
        templateId: req.templateId,
        invoiceId: req.invoiceId,
        imgLogoUrl: req.imgLogoUrl,
        companyTitle: req.companyTitle,
        companyTitle2: req.companyTitle,
        companyAddress: req.companyAddress,
        companyAddress2: req.companyAddress,
        companyTel: req.companyTel,
        companyTel2: req.companyTel,
        companyEmail: req.companyEmail,
        companyEmail2: req.companyEmail,
        companyVat: req.companyVat,
        companyVat2: req.companyVat,
        mainTitle: req.mainTitle,
        mainTitle2: req.mainTitle,
        customerHeader: req.customerHeader,
        customerHeader2: req.customerHeader,
        customer: req.customer,
        customer2: req.customer,
        dateHeader: req.dateHeader,
        dateHeader2: req.dateHeader,
        date: req.date,
        date2: req.date ? moment(req.date).format('L') : null,
        refNoHeader: req.refNoHeader,
        refNoHeader2: req.refNoHeader,
        refNo: req.refNo,
        refNo2: req.refNo,
        invoiceNoHeader: req.invoiceNoHeader,
        invoiceNoHeader2: req.invoiceNoHeader,
        invoiceNo: req.invoiceNo,
        invoiceNo2: req.invoiceNo ? toUpper(req.invoiceName) : null,
        customerRefHeader: req.customerRefHeader,
        customerRefHeader2: req.customerRefHeader,
        customerRef: req.customerRef,
        customerRef2: req.customerRef,
        chargesHeader: req.chargesHeader,
        chargesHeader2: req.chargesHeader,
        charges: req.charges,
        addInfoHeader: req.addInfoHeader,
        addInfoHeader2: req.addInfoHeader,
        addInfo: req.addInfo,
        addInfo2: req.addInfo,
        unitPrice: req.unitPrice,
        unitPrice2: req.unitPrice,
        unitNumber: req.unitNumber,
        unitNumber2: req.unitNumber,
        vatTotalHeader: req.vatTotalHeader,
        vatTotalHeader2: req.vatTotalHeader,
        amountHeader: req.amountHeader,
        amountHeader2: req.amountHeader,
        amount: req.amount,
        amount2: req.amount,
        subTotalHeader: req.subTotalHeader,
        subTotalHeader2: req.subTotalHeader,
        subTotalAmount: req.subTotalAmount,
        subTotalAmount2: req.subTotalAmount ? formatMoney(req.subTotalAmount) : '0.00',
        totalHeader: req.totalHeader,
        totalHeader2: req.totalHeader,
        totalAmount: req.totalAmount,
        totalAmount2: req.totalAmount ? formatMoney(req.totalAmount) : '0.00',
        vatHeader: req.vatHeader,
        vatHeader2: req.vatHeader,
        vatAmount: req.vatAmount,
        vatAmount2: req.vatAmount ? formatMoney(req.vatAmount) : '0.00',
        paymentTerms: req.paymentTerms,
        paymentTerms2: req.paymentTerms,
        invoiceDueDate: req.invoiceDueDate,
        invoiceDueDate2: req.invoiceDueDate ? moment(req.invoiceDueDate).format('L') : '',
        ibanNo1: req.ibanNo1,
        ibanNo21: req.ibanNo1,
        beneficiary1: req.beneficiary1,
        beneficiary21: req.beneficiary21,
        bic1: req.bic1,
        bic21: req.bic1,
        bankDetails1: req.bankDetails1,
        bankDetails21: req.bankDetails21,
        ibanNo2: req.ibanNo2,
        ibanNo22: req.ibanNo22,
        beneficiary2: req.beneficiary2,
        beneficiary22: req.beneficiary22,
        bic2: req.bic2,
        bic22: req.bic22,
        bankDetails2: req.bankDetails2,
        bankDetails22: req.bankDetails22,
        ibanNo3: req.ibanNo3,
        ibanNo23: req.ibanNo23,
        beneficiary3: req.beneficiary3,
        beneficiary23: req.beneficiary23,
        bic3: req.bic3,
        bic23: req.bic23,
        bankDetails3: req.bankDetails3,
        bankDetails23: req.bankDetails23,
      }))
    }
  }, [reqData])

  useEffect(() => {
    handleSetTempDoc()
    //
    dispatch(fetchCompanyLogoDataUrl())
  }, [handleSetTempDoc, dispatch])

  if (!tempdocData) return null

  return (
    <div className="containerPreview">
      <div className="preview_button" id="hiddenPrint">
        <div className="form-actions">
          <CForm>
            <CButton
              color="primary"
              id="template_submit_button"
              className="mr-2"
              onClick={(e) => printTempdoc(e)}
            >
              Print
            </CButton>
            <CButton
              color="primary"
              className="mr-2"
              id="template_submit_button"
              onClick={(e) => pdfDownload(e)}
            >
              PDF
            </CButton>
            <CButton
              color="primary"
              className="mr-2"
              id="template_submit_button"
              onClick={(e) => excelDownload(e)}
            >
              Excel
            </CButton>
            <CButton
              color="primary"
              className="mr-2"
              id="template_submit_button"
              onClick={(e) => sendMailTempdoc(e)}
            >
              Send Mail
            </CButton>
            <CButton
              color="primary"
              id="template_submit_button"
              onClick={(e) => saveTempDoc(e)}
              disabled={updatingTempdoc ? true : false}
            >
              {updatingTempdoc ? 'Processing...' : 'Save'}
            </CButton>
          </CForm>
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
                              data-name="unitPrice"
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

InvoiceDefaultTempdoc.propTypes = {
  reqData: PropTypes.object,
  tempdocDataId: PropTypes.string,
}

export default InvoiceDefaultTempdoc
