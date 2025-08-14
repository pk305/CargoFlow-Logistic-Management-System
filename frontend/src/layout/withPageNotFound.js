import React from 'react'

export default function withPageNotFound(Component) {
  const DefaultComponent = (props) => {
    return <Component {...props} />
  }

  return DefaultComponent
}
