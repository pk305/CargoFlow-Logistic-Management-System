import React from 'react'
import { CImage } from '@coreui/react'
import { Link } from 'react-router-dom'
import page404Img from 'src/assets/images/404-error-page-not-found.png'
import withPageNotFound from 'src/layout/withPageNotFound'

const Page404 = () => {
  return (
    <div className="pageNotfoundWrapper">
      <div className="image-content">
        <CImage src={page404Img} alt="404_error_page" />
      </div>
      <h1 className="error-title">Page not found</h1>
      <div className="error-description">
        <p>The page you&apos;re looking for cant&apos;t be found.</p>
        <p>Please confirm the path or contact the developer.</p>
      </div>
      <div>
        <Link to="/" className="btn btn-primary btn-lg">
          Click to go back
        </Link>
      </div>
    </div>
  )
}

export default withPageNotFound(Page404)
