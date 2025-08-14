import React from 'react'
import PropTypes from 'prop-types'
// import { useSelector } from 'react-redux'
// import { formatMoney } from 'src/config/helpers'

const FindocListTable = ({ findingSearchReport, reports }) => {
  //   const { totalReport } = useSelector((state) => state.report)

  return (
    <div className="table-responsive table-truncate" style={{ minHeight: '200px' }}>
      {!findingSearchReport && reports.length > 0 ? (
        <table className="table table-bordered">
          <tbody>
            <tr className="text-dark text-uppercase">
              <th>Document Type</th>
              <th className="text-right">Debit</th>
              <th className="text-right">Credit</th>
              <th className="text-center">Currency</th>
            </tr>
            <tr>
              <td className="text-left">
                <span
                  className="translation_missing"
                  title="translation missing: en.simple_form.helpers.findoc_types.eft_collection"
                >
                  Eft Collection
                </span>
              </td>
              <td className="text-right">0.00 </td>
              <td className="text-right">0.00 </td>
              <td className="text-center">USD</td>
            </tr>
            <tr>
              <td className="text-left">
                <span
                  className="translation_missing"
                  title="translation missing: en.simple_form.helpers.findoc_types.transfer"
                >
                  Transfer
                </span>
              </td>
              <td className="text-right">0.00 </td>
              <td className="text-right">0.00 </td>
              <td className="text-center">USD</td>
            </tr>
            <tr>
              <td className="text-left">
                <span
                  className="translation_missing"
                  title="translation missing: en.simple_form.helpers.findoc_types.work_advance"
                >
                  Work Advance
                </span>
              </td>
              <td className="text-right">0.00 </td>
              <td className="text-right">0.00 </td>
              <td className="text-center">USD</td>
            </tr>
          </tbody>
        </table>
      ) : null}
    </div>
  )
}

FindocListTable.propTypes = {
  reports: PropTypes.array,
  findingSearchReport: PropTypes.bool,
}
export default FindocListTable
