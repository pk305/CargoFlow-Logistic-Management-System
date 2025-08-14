import React, { Suspense, useCallback, useEffect } from 'react'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import routes from '../routes'
import { useDispatch, useSelector } from 'react-redux'
import SetupAccount from '../views/setup/SetupAccount'
import qs from 'query-string'
import { fetchOperations } from 'src/redux/slices/operationSlice'
import { fetchCompanyLogoDataUrl } from 'src/redux/slices/systemSlice'

const appLoader = () => (
  <div
    className="footerLoader"
    style={{ left: 0, bottom: '24px', width: '100%', position: 'fixed', pointerEvents: 'none' }}
  >
    <div id="spinner" style={{ textAlign: 'center' }} className="h-100">
      <CSpinner
        color="primary"
        style={{ width: '48px', height: '48px' }}
        visuallyHiddenLabel="Loading..."
      />
    </div>
  </div>
)

const AppContent = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const history = useHistory()
  const { authUser } = useSelector((state) => state.auth)

  useEffect(() => {
    if (authUser) {
      if (!authUser.isSetupCompany) {
        if (location.pathname !== '/setups/new') {
          if (authUser.setupCompanyProgress > 0) {
            history.push(
              `/setups/new?${qs.stringify({
                step: authUser.setupCompanyProgress,
              })}`,
            )
          } else {
            history.push('/setups/new')
          }
        }
      }
    }
  })

  const fetchOperationData = useCallback(() => {
    dispatch(fetchOperations())
    dispatch(fetchCompanyLogoDataUrl())
  }, [dispatch])

  useEffect(() => {
    if (authUser) {
      fetchOperationData()
    }
  }, [authUser, fetchOperationData])

  return (
    <CContainer fluid>
      <Suspense fallback={appLoader()}>
        <Switch>
          {routes.map((route, idx) => {
            return route.component && authUser && !authUser.isSetupCompany ? (
              <Route
                key="rQds3EqgsA"
                path="/setups/new"
                exact
                name="Setup Account"
                render={(props) => <SetupAccount {...props} />}
              />
            ) : (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                render={(props) => (
                  <>
                    <route.component {...props} />
                  </>
                )}
              />
            )
          })}
        </Switch>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
