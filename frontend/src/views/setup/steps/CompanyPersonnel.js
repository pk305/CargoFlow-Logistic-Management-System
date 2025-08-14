import React, { useState } from 'react'
import { CForm, CButton, CRow, CCol } from '@coreui/react'
import { useHistory } from 'react-router-dom'
import { setupCompanyPersonel } from 'src/redux/slices/setupSlice'
import { useDispatch, useSelector } from 'react-redux'

const CompanyPersonnel = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const { updatingSetup } = useSelector((state) => state.setup)
  const { company } = useSelector((state) => state.system)
  const [setupPersona, setSetupPersona] = useState({
    setupPersona: 'freight_forwarder',
    steps: '3',
  })

  const handleChangeForm = (e) => {
    const { name, value } = e.target

    setSetupPersona({
      ...setupPersona,
      [name]: value,
    })
  }

  const handleSubmitSetup = async (e) => {
    e.preventDefault()
    if (company) {
      const resData = await dispatch(
        setupCompanyPersonel({ companyPersona: { ...setupPersona, companyId: company.id } }),
      ).unwrap()
      if (resData) {
        history.push(`/setups/new?step=${resData.steps}`)
      }
    }
  }

  return (
    <div>
      <div className="pageContainer-wrapper">
        <div className="pageBoxSizing-container">
          <div
            className="setupProccessWrapper spw-1"
            id="cstProcessWiz"
            data-stepstate="first"
            data-stepclickable="false"
          >
            <div className="setupProccess-nav">
              <div className="setupProccess-steps">
                <div className="setupProccess-step" data-stepstate="current">
                  <div className="setupProccess-label">
                    <i className="fa fa-building icon-xl setupProccess-icon"></i>
                    <h3 className="setupProccess-title">Company Information</h3>
                  </div>
                  <span className="setupProccess-arrow">
                    <i className="fa fa-arrow-right"></i>
                  </span>
                </div>
                <div className="setupProccess-step" data-stepstate="current">
                  <div className="setupProccess-label">
                    <i className="fa fa-users icon-xl setupProccess-icon"></i>
                    <h3 className="setupProccess-title">Company Personnel</h3>
                  </div>
                  <span className="setupProccess-arrow">
                    <i className="fa fa-arrow-right"></i>
                  </span>
                </div>
                <div className="setupProccess-step" data-stepstate="pending">
                  <div className="setupProccess-label">
                    <i className="fa fa-eye icon-xl setupProccess-icon"></i>
                    <h3 className="setupProccess-title">Company Logo</h3>
                  </div>
                  <span className="setupProccess-arrow">
                    <i className="fa fa-arrow-right"></i>
                  </span>
                </div>
                <div className="setupProccess-step" data-stepstate="pending">
                  <div className="setupProccess-label">
                    <i className="fa fa-sitemap icon-xl setupProccess-icon"></i>
                    <h3 className="setupProccess-title">Branch Information</h3>
                  </div>
                  <span className="setupProccess-arrow">
                    <i className="fa fa-arrow-right"></i>
                  </span>
                </div>
                <div className="setupProccess-step" data-stepstate="pending">
                  <div className="setupProccess-label">
                    <i className="fa fa-users icon-xl setupProccess-icon"></i>
                    <h3 className="setupProccess-title">Operations</h3>
                  </div>
                  <span className="setupProccess-arrow last">
                    <i className="fa fa-arrow-right"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pageContainer-body">
        <CForm className="setupProccessForm" id="new_setup" onSubmit={(e) => handleSubmitSetup(e)}>
          <CRow>
            <CCol sm={12} md={12} lg={12} xl={12}>
              <h4 className="titleHeading">Company Personnel</h4>
            </CCol>
          </CRow>
          <h6 className="subTitleHeading">Step: 2/6</h6>
          <CRow>
            <CCol sm={12} md={6} lg={6} xl={6}>
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <input type="hidden" name="setupPersona" value="" />
                <span className="radio-custom radio-default">
                  <input
                    wrapper="remark_checkbox"
                    type="radio"
                    value="freight_forwarder"
                    defaultChecked={true}
                    name="setupPersona"
                    id="setup_persona_freight_forwarder"
                    onChange={(e) => handleChangeForm(e)}
                  />
                  <label
                    className="collection_radio_buttons"
                    htmlFor="setup_persona_freight_forwarder"
                  >
                    Freight Forwarder
                  </label>
                </span>
                <span className="radio-custom radio-default">
                  <input
                    wrapper="remark_checkbox"
                    type="radio"
                    value="fleet_operator"
                    name="setupPersona"
                    id="setup_persona_fleet_operator"
                    onChange={(e) => handleChangeForm(e)}
                  />
                  <label
                    className="collection_radio_buttons"
                    htmlFor="setup_persona_fleet_operator"
                  >
                    Fleet Operator
                  </label>
                </span>
                <span className="radio-custom radio-default">
                  <input
                    wrapper="remark_checkbox"
                    type="radio"
                    value="third_party_company"
                    name="setupPersona"
                    id="setup_persona_third_party_company"
                    onChange={(e) => handleChangeForm(e)}
                  />
                  <label
                    className="collection_radio_buttons"
                    htmlFor="setup_persona_third_party_company"
                  >
                    Third Party Logistics Company (3PL)
                  </label>
                </span>
                <span className="radio-custom radio-default">
                  <input
                    wrapper="remark_checkbox"
                    type="radio"
                    value="fourth_party_company"
                    name="setupPersona"
                    id="setup_persona_fourth_party_company"
                    onChange={(e) => handleChangeForm(e)}
                  />
                  <label
                    className="collection_radio_buttons"
                    htmlFor="setup_persona_fourth_party_company"
                  >
                    Fourth Party Logistics Company (4PL)
                  </label>
                </span>
                <span className="radio-custom radio-default">
                  <input
                    wrapper="remark_checkbox"
                    type="radio"
                    value="fifth_party_company"
                    name="setupPersona"
                    id="setup_persona_fifth_party_company"
                    onChange={(e) => handleChangeForm(e)}
                  />
                  <label
                    className="collection_radio_buttons"
                    htmlFor="setup_persona_fifth_party_company"
                  >
                    Fifth Party Logistics Company (5PL)
                  </label>
                </span>
                <span className="radio-custom radio-default">
                  <input
                    wrapper="remark_checkbox"
                    type="radio"
                    value="trader"
                    name="setupPersona"
                    id="setup_persona_trader"
                    onChange={(e) => handleChangeForm(e)}
                  />
                  <label className="collection_radio_buttons" htmlFor="setup_persona_trader">
                    Export/Import Company
                  </label>
                </span>
              </div>
            </CCol>
          </CRow>
          <div className="separator"></div>
          <CRow>
            <CCol sm={12} md={12} lg={12} xl={12}>
              <a className="btn btn-info mr-2" href="/setups/new?step=1">
                Previous
              </a>
              <CButton type="submit" color="primary" disabled={updatingSetup ? true : false}>
                {updatingSetup ? 'Processing...' : 'Next'}
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </div>
    </div>
  )
}

export default CompanyPersonnel
