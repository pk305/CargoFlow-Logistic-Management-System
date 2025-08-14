import { isUndefined } from 'lodash'
import { API_URL } from './domainLinks'
import Cookies from 'js-cookie'

export default function TusApi(url, requestData) {
  const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null

  const TusApi = {
    endpoint: 'https://tusd.tusdemo.net/files/',
    // endpoint: `${API_URL}/v1/adminapi/orgs/${utxId}/s3files`,
    withCredentials: true,
    metaFields: requestData,
    chunkSize: 5 * 1024 * 1024,
    limit: 10,
    // :
    //             resume: true,
    //             autoRetry: true,
    //             retryDelays: [0, 1000, 3000, 5000]
    // limit: 5,
    // retryDelays: [0, 3000, 5000, 10000, 20000],

    // headers: {
    //   authorization: `Bearer ${window.getCurrentUserToken()}`,
    //   expires: file.meta.expires,
    // },
    // withCredentials
    //   // Start the second upload
    //   upload2.start()
    // },
    // async onBeforeRequest(req) {
    //   // const token = await getAuthToken()
    //   // req.setHeader('Authorization', `Bearer ${token}`)
    // },
    // onShouldRetry(err, retryAttempt, options, next) {
    //   if (err?.originalResponse?.getStatus() === 401) {
    //     return true
    //   }
    //   return next(err)
    // },
    // async onAfterResponse(req, res) {
    //   console.log(res.getStatus())
    //   // if (res.getStatus() === 401) {
    //   //   await refreshAuthToken()
    //   // }
    // },
  }

  return TusApi
}
