import React, { useEffect, useMemo } from 'react'
import { CCard, CCardBody } from '@coreui/react'
import { useHistory, useLocation } from 'react-router-dom'
import {
  BranchInformation,
  CompanyInfo,
  CompanyLogo,
  CompanyPersonnel,
  Operations,
  StartUsingApp,
} from './steps'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCompanyOrganization } from 'src/redux/slices/systemSlice'
import { isNull } from 'lodash'

const SetupAccount = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { authUser } = useSelector((state) => state.auth)
  const { company } = useSelector((state) => state.system)

  const useQuery = () => {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
  }

  let query = useQuery()

  const SwitchQuery = () => {
    switch (query.get('step')) {
      case '1':
        return <CompanyInfo />

      case '2':
        return <CompanyPersonnel />

      case '3':
        return <CompanyLogo />

      case '4':
        return <BranchInformation />

      case '5':
        return <Operations />

      case '6':
        return <StartUsingApp />

      default:
        return <CompanyInfo />
    }
  }

  useEffect(() => {
    if (authUser) {
      function fetchCompany() {
        if (isNull(company)) {
          dispatch(fetchCompanyOrganization(authUser.uuid))
        }
      }
      fetchCompany()
    }
  }, [dispatch, authUser, company])

  useEffect(() => {
    if (authUser) {
      if (isNull(authUser.company)) {
        if (query.get('step') !== '1') {
          history.push('/setups/new?step=1')
        }
      }
    }
  }, [authUser, query, history])

  return (
    <div className="setupProccessContainer">
      <div className="pageContainer">
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <CCard className="cardCustom">
            <div className="card-header">
              <div className="toolBarContainer">
                <div className="customHeaderContainer">
                  <div className="customHeaderContainer-body">
                    <div className="symbolWrapper">
                      <span className="symbol-label">
                        <i className="fa fa-store icon-20"></i>
                      </span>
                    </div>
                  </div>
                  <div className="customHeaderContainer-footer">
                    <div className="card-title">
                      <h3 className="card-label">Welcome to Nueklabs TMS</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CCard className="cardCustom">
              <CCardBody className="p-0">
                <SwitchQuery />
              </CCardBody>
            </CCard>
          </CCard>
        </div>
      </div>
    </div>
  )
}

export default SetupAccount
