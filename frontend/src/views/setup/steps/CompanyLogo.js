import React, { useState } from 'react'
import { CForm, CButton, CRow, CCol } from '@coreui/react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { uploadLogoCompany } from 'src/redux/slices/setupSlice'
import LogoUpload from './LogoUpload'

const CompanyLogo = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { uploadingLogo } = useSelector((state) => state.setup)
  const { company } = useSelector((state) => state.system)
  const [setupData] = useState({
    steps: '4',
  })
  const [currentAvatar, setCurrentAvatar] = useState(null)

  const handleCancelUpload = () => {
    setCurrentAvatar(null)
  }

  const handleSubmitSetup = async (e) => {
    e.preventDefault()

    if (currentAvatar && company) {
      const resData = await dispatch(
        uploadLogoCompany({ companyLogo: { ...setupData, currentAvatar, companyId: company.id } }),
      ).unwrap()
      if (resData) {
        history.push(`/setups/new?step=${resData.steps}`)
        handleCancelUpload()
      }
    } else {
      history.push(`/setups/new?step=4`)
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
                <div className="setupProccess-step" data-stepstate="current">
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
        <CForm
          className="setupProccessForm"
          id="newSetup"
          noValidate="novalidate"
          action="/setups"
          acceptCharset="UTF-8"
          method="post"
          onSubmit={(e) => handleSubmitSetup(e)}
        >
          <CRow>
            <CCol sm={12} md={12} lg={12} xl={12}>
              <h4 className="titleHeading">Company Logo</h4>
            </CCol>
          </CRow>
          <h6 className="subTitleHeading">Step: 3/6</h6>
          <span>Please, Upload a logo of your company</span>

          <CRow>
            <CCol sm={12} md={6} lg={6} xl={6}>
              <LogoUpload setCurrentAvatar={setCurrentAvatar} currentAvatar={currentAvatar} />
            </CCol>
          </CRow>
          <div className="separator"></div>
          <CRow>
            <CCol sm={12} md={12} lg={12} xl={12}>
              <a className="btn btn-info mr-2" href="/setups/new?step=2">
                Previous
              </a>
              <CButton type="submit" color="primary" disabled={uploadingLogo ? true : false}>
                {uploadingLogo ? 'Processing...' : 'Next'}
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </div>
    </div>
  )
}

export default CompanyLogo
