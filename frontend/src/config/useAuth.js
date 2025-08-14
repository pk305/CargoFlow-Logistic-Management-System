import React, { useState, useEffect, useContext, createContext, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { fetchUserDetails, logoutUser } from 'src/redux/slices/authSlice'
import Cookies from 'js-cookie'

const authContext = createContext()
const clientContext = createContext()

const ClientWrapper = ({ children }) => {
  const [client, setClient] = useState({ payload: null, code: null })
  const dispatch = useDispatch()
  const [working, setWorking] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const resData = await dispatch(fetchUserDetails()).unwrap()
      if (resData) {
        if (resData.statusCode === 200) {
          setClient((state) => ({
            ...state,
            code: 200,
            payload: resData.userDetails,
          }))
          setWorking(false)
        }
      }
    } catch (error) {
      if (error) {
        if (error.message === 'Network Error')
          setClient((state) => ({
            ...state,
            payload: error,
            code: 500,
          }))
      }

      setWorking(false)
    }
  }, [dispatch])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const signout = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const resData = await dispatch(
          logoutUser({ isAuth: client.code === 200 ? true : false }),
        ).unwrap()
        if (resData) {
          if (resData.statusCode === 200) {
            setClient((state) => ({
              ...state,
              code: 401,
              payload: resData,
            }))

            Cookies.remove('utx_')
          }
          resolve()
        }
      } catch (error) {
        reject()
      }
    })
  }

  return (
    <clientContext.Provider value={{ client, signout }}>
      {working ? null : children}
    </clientContext.Provider>
  )
}

const ProvideAuth = ({ children }) => {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

const useAuth = () => {
  return useContext(authContext)
}

const useClient = () => {
  return useContext(clientContext)
}

const useProvideAuth = () => {
  const [user] = useState(null)

  // const refreshToken = () => {
  //   // console.log('client')
  // }

  // useEffect(() => {
  //   refreshToken()
  //   // eslint-disable-next-line
  // }, [])

  return {
    user,
  }
}

ClientWrapper.propTypes = {
  children: PropTypes.object,
}

ProvideAuth.propTypes = {
  children: PropTypes.object,
}

export { ClientWrapper, ProvideAuth, useAuth, useClient }
