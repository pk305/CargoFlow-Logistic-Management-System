import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownItemPlain,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import $ from 'jquery'
import defaultAvatar from 'src/assets/images/avatars/defaultAvatar.png'
import { Link, useHistory } from 'react-router-dom'
import { useClient } from 'src/config/useAuth'
import { useSelector } from 'react-redux'
import { isNull } from 'lodash'
import PropTypes from 'prop-types'

const AppHeaderDropdown = ({ setShowInfo }) => {
  const { signout } = useClient()
  const history = useHistory()
  const { authUser } = useSelector((state) => state.auth)

  const handleLogout = (e) => {
    e.preventDefault()
    closeDropdownMenu()
    signout()
  }

  const openChangeLog = (e) => {
    e.preventDefault()
    closeDropdownMenu()
    setShowInfo(true)
  }

  const handleShowProfile = (e) => {
    e.preventDefault()
    closeDropdownMenu()
    if (authUser) {
      history.push(`/users/${authUser.uuid}-${authUser.slug}`)
    }
  }

  const handleEditUser = (e) => {
    e.preventDefault()
    closeDropdownMenu()
    if (authUser) {
      history.push(`/users/edit/${authUser.uuid}-${authUser.slug}`)
    }
  }

  const closeDropdownMenu = () => {
    $('.navmenu-dropdown-menu').toggleClass('show')
    $('.navmenu-dropdown').toggleClass('show')
    $('.linkDropdown').attr('aria-expanded', true)
    $('.navmenu-dropdown-menu').removeAttr('style')
  }

  return (
    <CDropdown variant="nav-item" className="navmenu-dropdown">
      <div>
        <CDropdownToggle placement="bottom-end" className="linkDropdown" caret={false}>
          <div className="avatar-clause">
            {authUser && !isNull(authUser.avatar) ? (
              <CAvatar src={authUser.avatar} size="md" />
            ) : (
              <CAvatar src={defaultAvatar} size="md" />
            )}
          </div>
        </CDropdownToggle>
      </div>
      <div>
        <CDropdownMenu className="navmenu-dropdown-menu dropdown-menu-md" placement="bottom-end">
          <CDropdownItemPlain>
            <div className="profile-menu-wrap">
              <div className="symbol-wrapper">
                <div className="symbol-avatar">
                  {authUser && !isNull(authUser.avatar) ? (
                    <img
                      width="30"
                      height="30"
                      className="object-cover"
                      title={authUser.name}
                      src={authUser.avatar}
                      alt=""
                    />
                  ) : (
                    <img
                      width="30"
                      height="30"
                      className="object-cover"
                      title=""
                      src={defaultAvatar}
                      alt=""
                    />
                  )}
                </div>
              </div>

              <div className="profile-menu-body">
                <span className="text-titleheader">{authUser ? authUser.name : null}</span>
                <span className="text-titleemail">{authUser ? authUser.email : null}</span>
                {/*  eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#" onClick={(e) => handleShowProfile(e)}>
                  <span className="font-weight-bolder text-brand">Show Profile</span>
                </a>
              </div>
            </div>
          </CDropdownItemPlain>
          <CDropdownItemPlain className="menu-body">
            <ul className="navi navi-hover">
              {/* <li className="navi-item">
                <Link
                  className="navi-link px-3 rounded"
                  title="My Tickets"
                  to="/"

                  // to="/helpdesk/todos/demands?scope=all"
                >
                  <span className="navi-icon">
                    <i className="fa fa-tasks"></i>
                  </span>
                  <span className="navi-text font-weight-bold truncate">My Tickets</span>
                </Link>
              </li> */}
              <li className="navi-item">
                <Link
                  className="navi-link px-3 rounded"
                  // to="/notifies"
                  to="/"
                >
                  <span className="navi-icon">
                    <i className="far fa-bell"></i>
                  </span>
                  <span className="navi-text font-weight-bold truncate">Notifications</span>
                </Link>
              </li>
              <li className="navi-item">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className="navi-link px-3 rounded" href="#" onClick={(e) => handleEditUser(e)}>
                  <span className="navi-icon">
                    <i className="fa fa-cogs"></i>
                  </span>
                  <span className="navi-text font-weight-bold truncate">Settings</span>
                </a>
              </li>
              <li className="navi-item">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  className="navi-link px-3 rounded"
                  title="Changelog"
                  href="#"
                  onClick={(e) => openChangeLog(e)}
                >
                  <span className="navi-icon">
                    <i className="fa fa-file"></i>
                  </span>
                  <span className="navi-text font-weight-bold truncate">Changelog</span>
                </a>
              </li>
              <li className="navi-item">
                <a
                  className="navi-link px-3 rounded"
                  href="/logout"
                  onClick={(e) => handleLogout(e)}
                >
                  <span className="navi-icon">
                    <i className="fa fa-sign-out-alt"></i>
                  </span>
                  <span className="navi-text font-weight-bold truncate">Logout</span>
                </a>
              </li>
            </ul>
          </CDropdownItemPlain>
        </CDropdownMenu>
      </div>
    </CDropdown>
  )
}

AppHeaderDropdown.propTypes = {
  setShowInfo: PropTypes.func,
}

export default AppHeaderDropdown
