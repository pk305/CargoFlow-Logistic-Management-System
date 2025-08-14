import React from 'react'
import PropTypes from 'prop-types'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import classNames from 'classnames'
import { useHistory } from 'react-router-dom'

const AppBreadcrumb = ({ items }) => {
  const history = useHistory()

  const redirectTo = (e, path) => {
    e.preventDefault()
    history.push(path)
  }

  return (
    <CBreadcrumb>
      {items.length > 0 &&
        items.map((itm, index) => (
          <CBreadcrumbItem
            className={classNames('', { itemActive: itm.active })}
            href="/"
            onClick={(e) => redirectTo(e, itm.pathname)}
            key={index}
          >
            {itm.name}
          </CBreadcrumbItem>
        ))}
    </CBreadcrumb>
  )
}

AppBreadcrumb.propTypes = {
  items: PropTypes.array,
}

export default React.memo(AppBreadcrumb)
