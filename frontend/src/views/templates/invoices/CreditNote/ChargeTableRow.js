import React from 'react'
import PropTypes from 'prop-types'
import { formatMoney } from 'src/config/helpers'

const ChargeTableRow = ({
  handleChangeTemp,
  itemName,
  unitNumber,
  vatAmount,
  amountWithoutVat,
  currency,
}) => {
  return (
    <>
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
            {itemName}
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
            {formatMoney(unitNumber)}
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
            {formatMoney(vatAmount)}
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
            {formatMoney(amountWithoutVat)} {currency ? currency.name : ''}
          </span>
        </td>
      </tr>
      <tr>
        <td colSpan="6"></td>
      </tr>
    </>
  )
}

ChargeTableRow.propTypes = {
  handleChangeTemp: PropTypes.func,
  itemName: PropTypes.string,
  unitNumber: PropTypes.number,
  vatAmount: PropTypes.number,
  amountWithoutVat: PropTypes.number,
  currency: PropTypes.object,
}

export default ChargeTableRow
