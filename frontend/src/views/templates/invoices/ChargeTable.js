import React from 'react'
import PropTypes from 'prop-types'

function formatMoney(n, c, d, t) {
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

const ChargeTable = ({ idx, handleChangeTemp, itm }) => {
  return (
    <React.Fragment key={idx}>
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
            data-name="charge"
            onInput={(e) => handleChangeTemp(e)}
            contentEditable="true"
            suppressContentEditableWarning={true}
          >
            {itm.name}
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
            data-name="addInfo"
            onInput={(e) => handleChangeTemp(e)}
            contentEditable="true"
            suppressContentEditableWarning={true}
          >
            {formatMoney(itm.unitNumber)}
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
            data-name="vat"
            onInput={(e) => handleChangeTemp(e)}
            contentEditable="true"
            suppressContentEditableWarning={true}
          >
            {formatMoney(itm.vatAmount)}
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
            data-name="amountTotal"
            onInput={(e) => handleChangeTemp(e)}
            contentEditable="true"
            suppressContentEditableWarning={true}
          >
            {formatMoney(itm.amountWithoutVat)} {itm.currency ? itm.currency : ''}
          </span>
        </td>
      </tr>
      <tr>
        <td colSpan="6"></td>
      </tr>
    </React.Fragment>
  )
}

ChargeTable.propTypes = {
  idx: PropTypes.number,
  handleChangeTemp: PropTypes.func,
  itm: PropTypes.object,
}
export default ChargeTable
