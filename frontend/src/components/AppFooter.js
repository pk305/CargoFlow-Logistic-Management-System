import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        {/* eslint-disable-next-line */}
        {/* <a href="#" target="_blank" rel="noopener noreferrer">
          Nueklabs Tech.
        </a> */}
        {/* <span className="ms-1">&copy; 2021 </span> */}
      </div>
      <div className="ms-auto">
        <span className="me-1">Developed by</span>
        <a
          href="https://www.nueklabs.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.preventDefault()}
        >
          Nueklabs Tech.
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
