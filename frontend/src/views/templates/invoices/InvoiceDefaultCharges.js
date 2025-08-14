import React from 'react'
import PropTypes from 'prop-types'

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

const InvoiceDefaultCharges = ({ handleChangeTemp, invDataItem }) => {
  return (
    <>
      <tr>
        <td colSpan="7"></td>
      </tr>
      <tr className="">
        <td
          colSpan="3"
          className="line-td show_on_doc_div"
          style={{
            borderLeft: '1px solid black',
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
          >
            {invDataItem.finitem.name}
          </span>
        </td>
        <td
          className="line-td show_on_doc_div"
          style={{
            borderRight: '1px solid black',
            borderLeft: '1px solid black',
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
              textAlign: 'center',
              color: 'rgb(51, 51, 51)',
              fontWeight: 'normal',
              fontStyle: 'normal',
              textDecoration: 'none',
            }}
          ></span>
        </td>
        <td
          className="line-td show_on_doc_div"
          style={{
            borderRight: '1px solid black',
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
              textAlign: 'right',
              color: 'rgb(51, 51, 51)',
              fontWeight: 'normal',
              fontStyle: 'normal',
              textDecoration: 'none',
            }}
          >
            {formatMoney(invDataItem.unitNumber)}
          </span>
        </td>
        <td
          className="line-td show_on_doc_div"
          style={{
            borderRight: '1px solid black',
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
              textAlign: 'right',
              color: 'rgb(51, 51, 51)',
              fontWeight: 'normal',
              fontStyle: 'normal',
              textDecoration: 'none',
            }}
          >
            {formatMoney(invDataItem.unitprice)}
          </span>
        </td>
        <td
          className="line-td show_on_doc_div"
          style={{
            borderRight: '1px solid black',
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
              textAlign: 'right',
              color: 'rgb(51, 51, 51)',
              fontWeight: 'normal',
              fontStyle: 'normal',
              textDecoration: 'none',
            }}
          >
            {formatMoney(invDataItem.amountWithVat)}
          </span>
        </td>
      </tr>
    </>
  )
}

InvoiceDefaultCharges.propTypes = {
  handleChangeTemp: PropTypes.func,
  invDataItem: PropTypes.object,
}

export default InvoiceDefaultCharges
