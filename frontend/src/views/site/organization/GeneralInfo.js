import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

const GeneralInfo = () => {
  const { company } = useSelector((state) => state.system)

  return (
    <div
      className="tab-pane fade show active"
      id="loading_details"
      role="tabpanel"
      aria-labelledby="loading_details"
    >
      <div className="d-block bg-white p-3 rounded">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div className="d-flex flex-column gutter-b">
              <h4 className="cstPageTitle">General Information</h4>
              <div className="d-block">
                <div className="table-responsive">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td className="font-weight-bolder">Company Name</td>
                        <td>{company && company.name}</td>
                        <td className="font-weight-bolder">Contact Name</td>
                        <td>{company && company.contact && company.contact.name}</td>
                      </tr>
                      <tr>
                        <td className="font-weight-bolder">Phone/Fax</td>
                        <td>
                          {company && company.phone}/{company && company.fax}
                        </td>
                        <td className="font-weight-bolder">Invoice Title</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td className="font-weight-bolder">Email</td>
                        <td>{company && company.email}</td>
                        <td className="font-weight-bolder">Bank/Local Currency</td>
                        <td>/</td>
                      </tr>
                      <tr>
                        <td className="font-weight-bolder">Address</td>
                        <td>{company && company.address}</td>
                        <td className="font-weight-bolder">Tax No</td>
                        <td>{company && company.taxno}</td>
                      </tr>
                      <tr>
                        <td className="font-weight-bolder">Website</td>
                        <td>
                          <a
                            href={`https://${company && company.website}`}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {company && company.website}
                          </a>
                        </td>
                        <td className="font-weight-bolder">EORI Number</td>
                        <td>{company && company.eoriCode}</td>
                      </tr>
                      <tr>
                        <td className="font-weight-bolder">Company Tariff / Payment Currency</td>
                        <td>/</td>
                        <td className="font-weight-bolder">Credit Limit</td>
                        <td>0.00 KES</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

GeneralInfo.propTypes = {
  company: PropTypes.object,
}

export default GeneralInfo
