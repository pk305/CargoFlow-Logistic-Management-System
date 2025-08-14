import React from 'react'
import { CCol, CContainer, CRow } from '@coreui/react'
import { Link } from 'react-router-dom'

const Page500 = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <span className="clearfix">
              <h1 className="float-start display-3 me-4">500</h1>
              <h4 className="pt-3">Oops!, we have a problem!</h4>
              <p className="text-medium-emphasis float-start">
                An Error occured at our, Please try again later
              </p>
              <br />
              <Link
                to={'/dashboard'}
                className="btn btn-primary btn-ghost mt-2 btn-sm btn-square  px-3 py-1 m-0"
              >
                Home
              </Link>
            </span>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page500
