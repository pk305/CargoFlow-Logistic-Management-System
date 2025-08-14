import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { formatMoney } from 'src/config/helpers'

const InvoiceListTable = ({ findingSearchReport, reports }) => {
  const { totalReport } = useSelector((state) => state.report)

  return (
    <div className="invoices-list" style={{ minHeight: '300px' }}>
      {!findingSearchReport && reports.length > 0 ? (
        <div className="table-responsive">
          {/* <pre>{JSON.stringify(totalReport, null, 2)}</pre> */}
          <table className="table table-vertical-center">
            <tbody>
              <tr>
                <td colSpan="12"></td>
              </tr>
              <tr className="text-dark text-uppercase bg-success-o-50">
                <td colSpan="2"></td>
                <th>Tax Free Amount</th>
                <th>Taxed Amount</th>
                <th>VAT</th>
                <th>Net Total</th>
                <th>Currency</th>
                <th className="text-right">Total()</th>
                <th className="text-right">Total(USD)</th>
                <th className="text-right">Total(EUR)</th>
                <th className="text-right">VAT()</th>
              </tr>
              <tr>
                <td colSpan="2"></td>
                <th className="text-right">
                  {totalReport && formatMoney(totalReport.taxFreeAmount)}
                </th>
                <th className="text-right">
                  {totalReport && formatMoney(totalReport.taxedAmount)}
                </th>
                <th className="text-right">{totalReport && formatMoney(totalReport.vatAmount)} </th>
                <th className="text-right">{totalReport && formatMoney(totalReport.netTotal)}</th>
                <th className="text-center">{totalReport && totalReport.currency}</th>
                <th className="text-right">{totalReport && formatMoney(totalReport.netTotal)}</th>
                <th className="text-right">{totalReport && formatMoney(totalReport.totalUSD)}</th>
                <th className="text-right">{totalReport && formatMoney(totalReport.totalEUR)}</th>
                <th className="text-right">{totalReport && formatMoney(totalReport.vatTotal)}</th>
              </tr>
              {/* <tr>
                <td colSpan="2"></td>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
                <th className="text-center">JPY</th>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
              </tr>
              <tr>
                <td colSpan="2"></td>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
                <th className="text-center">IRR</th>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
              </tr>
              <tr>
                <td colSpan="2"></td>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
                <th className="text-center">CNY</th>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
              </tr>
              <tr>
                <td colSpan="2"></td>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
                <th className="text-center">CAD</th>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
                <th className="text-right">0.00 </th>
              </tr> */}
              <tr>
                <td colSpan="2"></td>
                <th className="text-right"></th>
                <th className="text-right"></th>
                <th className="text-right"></th>
                <th className="text-right"></th>
                <th className="text-center bg-success-o-50">Total</th>
                <th className="text-right bg-success-o-50">
                  {totalReport && formatMoney(totalReport.totalAmount)}
                </th>
                <th className="text-right bg-success-o-50">
                  {totalReport && formatMoney(totalReport.totalUSD)}
                </th>
                <th className="text-right bg-success-o-50">
                  {totalReport && formatMoney(totalReport.totalEUR)}
                </th>
                <th className="text-right bg-success-o-50">
                  {totalReport && formatMoney(totalReport.vatTotal)}
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}

InvoiceListTable.propTypes = {
  reports: PropTypes.array,
  findingSearchReport: PropTypes.bool,
}
export default InvoiceListTable
