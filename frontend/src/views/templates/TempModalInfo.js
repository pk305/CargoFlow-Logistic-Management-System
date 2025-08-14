import React from 'react'
import { CCardBody, CRow, CCol, CNav, CNavItem, CNavLink } from '@coreui/react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import qs from 'query-string'

const TempModalInfo = ({ findingTemplate, tempLinkUrl }) => {
  const { showTemplate } = useSelector((state) => state.template)

  const removeTempDocs = (e, temp) => {
    e.preventDefault()
  }

  if (findingTemplate) return null

  return (
    <>
      <div className="card-header cstHeaderTabs-line">
        <div className="cstHeaderNav">
          <CNav variant="tabs" className="nav-tabs-line nav-bold nav-tabs-line-2x">
            <CNavItem>
              <CNavLink href="#loading_details" active>
                <span className="nav-icon">
                  <i className="fa fa-layer-group ico"></i>
                </span>
                <span className="nav-text">Default Templates</span>
                <span className="pl-2" style={{ marginLeft: '.5rem' }}>
                  {showTemplate && showTemplate.length > 0 && showTemplate.length}
                </span>
              </CNavLink>
            </CNavItem>
          </CNav>
        </div>
      </div>
      <CCardBody className="p-3">
        <div className="tab-content">
          <div className="tab-pane fade show active" role="tabpanel">
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="systemTemplates"
                role="tabpanel"
                aria-labelledby="systemTemplates"
              >
                <CRow>
                  <CCol sm={12} md={12} lg={12} xl={12}>
                    <div id="position_details" className="tab-pane active" role="tabpanel">
                      <div className="table-scrollable">
                        <table className="table table-vertical-center table-bordered">
                          <tbody>
                            {showTemplate.length > 0 &&
                              showTemplate.map((temp) => (
                                <tr key={temp.refCode} id={`template_${temp.refCode}`}>
                                  <td>
                                    <div id={`tempdocs_plus_${temp.refCode}`}></div>
                                    <div id={`tempdocs_minus_${temp.refCode}`} className="hide">
                                      {/* eslint-disable-next-line */}
                                      <a href="#" onClick={(e) => removeTempDocs(e, temp)}>
                                        <i className="fa fa-minus"></i>
                                      </a>
                                    </div>
                                  </td>
                                  <td className="font-weight-bold">
                                    {temp.name}
                                    <span className="badge badge-info"></span>
                                  </td>
                                  <td className="font-weight-bold">en</td>
                                  <td>
                                    {/* eslint-disable-next-line */}
                                    <a
                                      target="_blank"
                                      className="btn btn-sm btn-ghost-primary btn-pill"
                                      href={
                                        tempLinkUrl
                                          ? tempLinkUrl +
                                            `/preview?${qs.stringify({
                                              template_id: temp.refCode,
                                            })}`
                                          : null
                                      }
                                    >
                                      <i className="fa fa-plus mr-2"></i>Create New Document
                                    </a>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CCol>
                </CRow>
              </div>
            </div>
          </div>
        </div>
      </CCardBody>
    </>
  )
}

TempModalInfo.propTypes = {
  findingTemplate: PropTypes.bool,
  tempLinkUrl: PropTypes.string,
}

export default TempModalInfo
