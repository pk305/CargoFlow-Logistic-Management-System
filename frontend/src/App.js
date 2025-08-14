import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { PrivateRoute } from './config/helpers'
import { ClientWrapper, ProvideAuth } from './config/useAuth'
import './scss/style.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/auth/login/Login'))
const ForgotPassword = React.lazy(() => import('./views/auth/forgotPassword/ForgotPassword'))
const ResetPassword = React.lazy(() => import('./views/auth/resetPassword/ResetPassword'))
//Auth
const Page404 = React.lazy(() => import('./views/auth/page404/page404'))
const Page500 = React.lazy(() => import('./views/auth/Page500/Page500'))
//
const TemplatePreview = React.lazy(() => import('./views/templates/TemplatePreview'))
const ViewTempdoc = React.lazy(() => import('./views/templates/ViewTempdoc'))

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fallbackLoading: true,
    }
  }

  render() {
    return (
      <ClientWrapper>
        <ProvideAuth>
          <React.Suspense fallback={null}>
            <Switch>
              <Route
                exact
                path="/login"
                name="Login"
                render={(props) => (
                  <Login {...props} fallbackLoading={this.state.fallbackLoading} />
                )}
              />
              <Route
                exact
                path="/account/recovery/:query?"
                name="Forgot Password"
                render={(props) => <ForgotPassword {...props} />}
              />
              <Route
                exact
                path="/account/password/:query?"
                name="Reset Password"
                render={(props) => <ResetPassword {...props} />}
              />
              {/* template */}
              <Route
                exact
                path="/:template/:tempId/preview/:query?"
                name="Template Preview"
                render={(props) => <TemplatePreview {...props} />}
              />
              <Route
                exact
                path="/tempdocs/:tempid"
                name="View Tempdoc"
                render={(props) => <ViewTempdoc {...props} />}
              />
              <Route exact path="/500" name="Page500" render={(props) => <Page500 {...props} />} />
              <PrivateRoute
                path="/"
                name="Home"
                component={(props) => <DefaultLayout {...props} />}
              />
              <Route path="*" exact name="Page404" render={(props) => <Page404 {...props} />} />
            </Switch>
          </React.Suspense>
        </ProvideAuth>
      </ClientWrapper>
    )
  }
}

export default App
