import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { CButton } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty, isNull } from 'lodash'
import { useHistory, useLocation } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { BASE_URL } from 'src/config/domainLinks'
import $ from 'jquery'
import defCorpImage from 'src/assets/images/default-corporate-image.jpg'
import countryList from 'react-select-country-list'
import moment from 'moment'
import { createTempdoc } from 'src/redux/slices/tempdocSlice'

const PaymentReceiptPDF = ({ findocData }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { authUser } = useSelector((state) => state.auth)
  const { creatingTempdoc } = useSelector((state) => state.tempdoc)
  const [tempdocData, setTempdocData] = useState({
    findocId: null,
    templateId: '',
    imgLogoUrl: `${
      authUser && authUser.company && authUser.company.logoUrl ? authUser.company.logoUrl : ''
    }`,
    companyTitle: `${
      authUser && authUser.company && authUser.company.name ? authUser.company.name : ''
    }`,
    companyTitle2: `${
      authUser && authUser.company && authUser.company.name ? authUser.company.name : ''
    }`,
    companyAddress: `${
      authUser && authUser.company && authUser.company.address
        ? authUser.company.address + ' / ' + countryList().getLabel(authUser.company.countryId)
        : ''
    }`,
    companyAddress2: `${
      authUser && authUser.company && authUser.company.address
        ? authUser.company.address + ' / ' + countryList().getLabel(authUser.company.countryId)
        : ''
    }`,
    subject: 'Dear,',
    subject2: 'Dear,',
    message: '',
    message2: '',
    mainTitle: 'RECEIPT OF ',
    mainTitle2: 'RECEIPT OF ',
    titleHeader: 'PAYMENT',
    titleHeader2: 'PAYMENT',
    docNoHeader: 'Document No',
    docNoHeader2: 'Document No',
    docNo: '',
    docNo2: '',
    dateHeader: 'Date',
    dateHeader2: 'Date',
    date: '',
    date2: '',
    confirmHeader: 'Confirming',
    confirmHeader2: 'Confirming',
    confirm: '',
    confirm2: '',
    operatorHeader: 'Operator',
    operatorHeader2: 'Operator',
    operator: '',
    operator2: '',
    accountHeader: 'Account',
    accountHeader2: 'Account',
    account: '',
    account2: '',
    explanationHeader: 'Explanation',
    explanationHeader2: 'Explanation',
    explanation: '',
    explanation2: '',
    amountHeader: 'Amount',
    amountHeader2: 'Amount',
    amount: '',
    amount2: '',
    alone: 'ALONE : ',
    alone2: 'ALONE : ',
    totalHeader: 'Total',
    totalHeader2: 'Total',
    total: '',
    total2: '',
    exchangeHeader: 'Exchange',
    exchangeHeader2: 'Exchange',
    exchange: '',
    exchange2: '',
    nameSignature: 'Name / Signature',
    qrcodeUrl: '',
  })
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
    //form data
    const formData = new FormData()
    formData.append('tempCode', tempdocData.templateId)
    formData.append('tempdocData', JSON.stringify(tempdocData))
    formData.append('findocId', tempdocData.findocId)
    formData.append('tempHtml', JSON.stringify($('#templatediv').clone().html()))

    const resData = await dispatch(createTempdoc(formData)).unwrap()
    if (resData) {
      history.push(`/tempdocs/${resData.name}`)
    }
  }

  let query = useQuery()

  const handleSetTempDoc = useCallback(() => {
    if (authUser && findocData) {
      const fin = findocData

      // console.log(fin)
      setTempdocData((state) => ({
        ...state,
        findocId: fin.id,
        docNo: fin.code,
        docNo2: fin.code,
        date: fin.createdAt ? moment(fin.createdAt).format('L') : '',
        date2: fin.createdAt ? moment(fin.createdAt).format('L') : '',
        operator: fin.createdBy ? fin.createdBy.name : '',
        operator2: fin.createdBy ? fin.createdBy.name : '',
        qrcodeUrl: `${BASE_URL}/findocs/${fin.id}`,
      }))

      if (query.get('template_id')) {
        setTempdocData((state) => ({
          ...state,
          templateId: query.get('template_id'),
        }))
      }
    }
  }, [authUser, findocData, query])

  // useEffect(() => {
  //   handleSetTempDoc()
  // }, [handleSetTempDoc])

  if (isNull(findocData) && isNull(authUser)) return null

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
              Save
            </CButton>
          </form>
        </div>
      </div>
      <div id="templatediv" style={{ backgroundColor: '#FFFFFF !important' }}>
        <div id="doc_div" style={{ height: '1110px', width: '794px' }}>
          <div
            style={{
              padding: '5mm 10mm 0mm',
              position: 'absolute',
              left: '0.994324px',
              top: '0px',
            }}
          >
            <table cellPadding="0" cellSpacing="0" align="center">
              <tbody>
                <tr>
                  <td style={{ width: '100%' }}>
                    <table cellPadding="0" cellSpacing="0" width="100%">
                      <tbody>
                        <tr className="line-tr">
                          <td
                            className="line-td"
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
                                height: '5mm',
                                fontSize: '10px',
                                textAlign: 'right',
                                color: 'rgb(51, 51, 51)',
                                fontWight: 'normal',
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
                <tr>
                  <td style={{ width: '200mm', paddingBottom: '20mm' }}>
                    <table cellPadding="0" cellSpacing="0" width="100%">
                      <tbody>
                        <tr className="line-tr">
                          <td
                            className="line-td"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              width: '60%',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <table cellPadding="0" cellSpacing="0" width="100%">
                              <tbody>
                                <tr className="line-tr">
                                  <td
                                    className="line-td"
                                    style={{
                                      verticalAlign: 'top',
                                      wordBreak: 'normal',
                                      width: '60mm',
                                      backgroundColor: 'transparent',
                                    }}
                                  >
                                    <span
                                      style={{
                                        height: '20mm',
                                        padding: '0mm',
                                        width: '60mm',
                                        fontSize: '12px',
                                        textAlign: 'left',
                                        color: 'rgb(51, 51, 51)',
                                        fontWeight: 'normal',
                                        fontStyle: 'normal',
                                        textDecoration: 'none',
                                      }}
                                    >
                                      {!isEmpty(tempdocData.imgLogoUrl) ? (
                                        <img
                                          src={tempdocData.imgLogoUrl}
                                          height={80}
                                          style={{
                                            maxWidth: '300px',
                                            objectFit: 'contain',
                                            verticalAlign: 'middle',
                                          }}
                                          alt=""
                                        />
                                      ) : (
                                        <img
                                          src={defCorpImage}
                                          height={80}
                                          style={{
                                            maxWidth: '300px',
                                            objectFit: 'contain',
                                            verticalAlign: 'middle',
                                          }}
                                          alt=""
                                        />
                                      )}
                                    </span>
                                  </td>
                                  <td
                                    className="line-td"
                                    style={{
                                      verticalAlign: 'top',
                                      wordBreak: 'normal',
                                      width: '100%',
                                      backgroundColor: 'transparent',
                                    }}
                                  >
                                    <span
                                      style={{
                                        height: '20mm',
                                        padding: '0mm',
                                        width: '60mm',
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
                                <tr className="line-tr">
                                  <td
                                    colSpan="2"
                                    className="line-td"
                                    style={{
                                      verticalAlign: 'top',
                                      wordBreak: 'normal',
                                      width: '100%',
                                      backgroundColor: 'transparent',
                                      paddingRight: '5mm',
                                      paddingTop: '5mm',
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: '100%',
                                        padding: '0mm',
                                        fontSize: '12px',
                                        textAlign: 'left',
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
                                <tr className="line-tr">
                                  <td
                                    colSpan="2"
                                    className="line-td"
                                    style={{
                                      verticalAlign: 'top',
                                      wordBreak: 'normal',
                                      width: '100%',
                                      backgroundColor: 'transparent',
                                      paddingRight: '25mm',
                                      paddingBottom: '5mm',
                                    }}
                                  >
                                    <span
                                      style={{
                                        borderBottom: '2px solid black',
                                        width: '100%',
                                        paddingBottom: '5mm',
                                        fontSize: '12px',
                                        textAlign: 'left',
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
                                <tr className="line-tr">
                                  <td
                                    colSpan="2"
                                    className="line-td"
                                    style={{
                                      verticalAlign: 'top',
                                      wordBreak: 'normal',
                                      width: '100%',
                                      backgroundColor: 'transparent',
                                      paddingRight: '25mm',
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: '100%',
                                        fontSize: '12px',
                                        textAlign: 'left',
                                        color: 'rgb(51, 51, 51)',
                                        fontWeight: 'bold',
                                        fontStyle: 'normal',
                                        textDecoration: 'none',
                                      }}
                                      data-name="subject"
                                      onInput={(e) => handleChangeTemp(e)}
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      {tempdocData.subject2}
                                    </span>
                                  </td>
                                </tr>
                                <tr className="line-tr">
                                  <td
                                    colSpan="2"
                                    className="line-td"
                                    style={{
                                      verticalAlign: 'top',
                                      wordBreak: 'normal',
                                      width: '100%',
                                      backgroundColor: 'transparent',
                                      paddingRight: '25mm',
                                    }}
                                  >
                                    <span
                                      style={{
                                        borderBottom: '2px solid black',
                                        width: '100%',
                                        paddingBottom: '5mm',
                                        fontSize: '12px',
                                        textAlign: 'left',
                                        color: 'rgb(51, 51, 51)',
                                        fontWeight: 'normal',
                                        fontStyle: 'normal',
                                        textDecoration: 'none',
                                      }}
                                      data-name="message"
                                      onInput={(e) => handleChangeTemp(e)}
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      {tempdocData.message2}
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                          <td
                            className="line-td"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              width: '40%',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <table cellPadding="0" cellSpacing="0" width="100%">
                              <tbody>
                                <tr className="line-tr">
                                  <td
                                    className="line-td"
                                    style={{
                                      verticalAlign: 'top',
                                      wordBreak: 'normal',
                                      width: '55%',
                                      backgroundColor: 'transparent',
                                      paddingBottom: '10mm',
                                      paddingTop: '10mm',
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: '100%',
                                        padding: '0mm',
                                        height: '5mm',
                                        fontSize: '24px',
                                        textAlign: 'right',
                                        color: 'rgb(51, 51, 51)',
                                        fontWeight: 'normal',
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
                                  <td
                                    className="line-td"
                                    style={{
                                      verticalAlign: 'top',
                                      wordBreak: 'normal',
                                      width: '45%',
                                      backgroundColor: 'transparent',
                                      paddingBottom: '10mm',
                                      paddingTop: '10mm',
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: '100%',
                                        padding: '0mm',
                                        height: '5mm',
                                        fontSize: '24px',
                                        textAlign: 'left',
                                        color: 'rgb(51, 51, 51)',
                                        fontWeight: 'bold',
                                        fontStyle: 'normal',
                                        textDecoration: 'none',
                                      }}
                                      data-name="titleHeader"
                                      onInput={(e) => handleChangeTemp(e)}
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      {tempdocData.titleHeader2}
                                    </span>
                                  </td>
                                </tr>
                                <tr className="line-tr">
                                  <td
                                    className="line-td"
                                    style={{
                                      paddingLeft: '16mm',
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
                                        fontWeight: 'normal',
                                        fontStyle: 'normal',
                                        textDecoration: 'none',
                                      }}
                                      data-name="docNoHeader"
                                      onInput={(e) => handleChangeTemp(e)}
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      {tempdocData.docNoHeader2}
                                    </span>
                                  </td>
                                  <td
                                    className="line-td"
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
                                        fontWeight: 'normal',
                                        fontStyle: 'normal',
                                        textDecoration: 'none',
                                      }}
                                      data-name="docNo"
                                      onInput={(e) => handleChangeTemp(e)}
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      : {tempdocData.docNo2}
                                    </span>
                                  </td>
                                </tr>
                                <tr className="line-tr">
                                  <td
                                    className="line-td"
                                    style={{
                                      paddingLeft: '16mm',
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
                                        fontWeight: 'normal',
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
                                    className="line-td"
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
                                        fontWeight: 'normal',
                                        fontStyle: 'normal',
                                        textDecoration: 'none',
                                      }}
                                      data-name="date"
                                      onInput={(e) => handleChangeTemp(e)}
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      : {tempdocData.date2}
                                    </span>
                                  </td>
                                </tr>
                                <tr className="line-tr">
                                  <td
                                    className="line-td"
                                    style={{
                                      paddingLeft: '16mm',
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
                                        fontWeight: 'normal',
                                        fontStyle: 'normal',
                                        textDecoration: 'none',
                                      }}
                                      data-name="confirmHeader"
                                      onInput={(e) => handleChangeTemp(e)}
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      {tempdocData.confirmHeader2}
                                    </span>
                                  </td>
                                  <td
                                    className="line-td"
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
                                        fontWeight: 'normal',
                                        fontStyle: 'normal',
                                        textDecoration: 'none',
                                      }}
                                      data-name="confirm"
                                      onInput={(e) => handleChangeTemp(e)}
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      : {tempdocData.confirm2}
                                    </span>
                                  </td>
                                </tr>
                                <tr className="line-tr">
                                  <td
                                    className="line-td"
                                    style={{
                                      paddingLeft: '16mm',
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
                                        fontWeight: 'normal',
                                        fontStyle: 'normal',
                                        textDecoration: 'none',
                                      }}
                                      data-name="operatorHeader"
                                      onInput={(e) => handleChangeTemp(e)}
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      {tempdocData.operatorHeader2}
                                    </span>
                                  </td>
                                  <td
                                    className="line-td"
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
                                        fontWeight: 'normal',
                                        fontStyle: 'normal',
                                        textDecoration: 'none',
                                      }}
                                      data-name="operator"
                                      onInput={(e) => handleChangeTemp(e)}
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      : {tempdocData.operator2}
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
                  <td style={{ width: '100%', paddingBottom: '10mm' }}>
                    <table cellPadding="0" cellSpacing="0" width="100%">
                      <tbody>
                        <tr className="line-tr">
                          <td
                            className="line-td"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                              padding: '1mm',
                              width: '35%',
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
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                                borderBottom: '2px solid black',
                              }}
                              data-name="accountHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.accountHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                              padding: '1mm',
                              width: '40%',
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
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                                borderBottom: '2px solid black',
                              }}
                              data-name="explanationHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.explanationHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                              padding: '1mm',
                              width: '25%',
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
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                                borderBottom: '2px solid black',
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
                        <tr>
                          <td colSpan="3"></td>
                        </tr>
                        <tr>
                          <td colSpan="3"></td>
                        </tr>
                        <tr>
                          <td colSpan="3"></td>
                        </tr>
                        <tr className="line-tr">
                          <td
                            className="line-td"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                              padding: '1mm',
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
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="account"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.account2}
                            </span>
                          </td>
                          <td
                            className="line-td"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                              padding: '1mm',
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
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="explanation"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.explanation2}
                            </span>
                          </td>
                          <td
                            className="line-td"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                              padding: '1mm',
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
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="amount"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.amount2}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="3"></td>
                        </tr>
                        <tr>
                          <td colSpan="3"></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style={{ width: '100%', paddingBottom: '3mm' }}>
                    <table cellPadding="0" cellSpacing="0" width="100%">
                      <tbody>
                        <tr className="line-tr">
                          <td
                            className="line-td"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              width: '60%',
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
                              data-name="alone"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {/* ALONE : {inWords(29400)} EUR */}
                              {tempdocData.alone2}
                            </span>
                          </td>
                          <td
                            className="line-td"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              width: '40%',
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
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="companyTitle"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              <table cellPadding="0" cellSpacing="0" width="100%">
                                <tbody>
                                  <tr className="line-tr">
                                    <td
                                      className="line-td"
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
                                          fontWeight: 'normal',
                                          fontStyle: 'normal',
                                          textDecoration: 'none',
                                        }}
                                        data-name="companyTitle"
                                        onInput={(e) => handleChangeTemp(e)}
                                        contentEditable="true"
                                        suppressContentEditableWarning={true}
                                      >
                                        {tempdocData.totalHeader2}
                                      </span>
                                    </td>
                                    <td
                                      className="line-td"
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
                                          fontWeight: 'normal',
                                          fontStyle: 'normal',
                                          textDecoration: 'none',
                                        }}
                                        data-name="total"
                                        onInput={(e) => handleChangeTemp(e)}
                                        contentEditable="true"
                                        suppressContentEditableWarning={true}
                                      >
                                        {tempdocData.total2}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr className="line-tr">
                                    <td
                                      className="line-td"
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
                                          fontWeight: 'normal',
                                          fontStyle: 'normal',
                                          textDecoration: 'none',
                                        }}
                                        data-name="exchangeHeader"
                                        onInput={(e) => handleChangeTemp(e)}
                                        contentEditable="true"
                                        suppressContentEditableWarning={true}
                                      >
                                        {tempdocData.exchangeHeader2}
                                      </span>
                                    </td>
                                    <td
                                      className="line-td"
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
                                          fontWeight: 'normal',
                                          fontStyle: 'normal',
                                          textDecoration: 'none',
                                        }}
                                        data-name="exchange"
                                        onInput={(e) => handleChangeTemp(e)}
                                        contentEditable="true"
                                        suppressContentEditableWarning={true}
                                      >
                                        {tempdocData.exchange2}
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style={{ width: '100%', paddingBottom: '10mm' }}>
                    <table cellPadding="0" cellSpacing="0" width="100%">
                      <tbody>
                        <tr className="line-tr">
                          <td
                            className="line-td"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              width: '100%',
                              padding: '1mm',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '55mm',
                                padding: '2mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                                borderBottom: '2px solid black',
                              }}
                              data-name="companyTitle"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.nameSignature}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style={{ width: '100%' }}>
                    <table cellPadding="0" cellSpacing="0" width="100%">
                      <tbody>
                        <tr className="line-tr">
                          <td
                            className="line-td"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              width: '168mm',
                              height: '32mm',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '2mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                            ></span>
                          </td>
                          <td
                            className="line-td"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              width: '32mm',
                              height: '32mm',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                                background: '#fff',
                              }}
                            >
                              {tempdocData.qrcodeUrl ? (
                                <QRCodeSVG size="74" level="Q" value={tempdocData.qrcodeUrl} />
                              ) : null}
                            </span>
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

PaymentReceiptPDF.propTypes = {
  findocData: PropTypes.object,
}

export default PaymentReceiptPDF
