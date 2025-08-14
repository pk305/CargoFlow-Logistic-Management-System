import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'
import { API_URL } from './domainLinks'

export default function XhrApi(field) {
  const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
  const endpointUrl = `${API_URL}/v1/adminapi/orgs/${utxId}/files`

  const XhrApi = {
    endpoint: endpointUrl,
    withCredentials: true,
    formData: true,
    metaFields: ['name', 'type', 'userId', 'companyId', 'mediaType', field ? field : ''],
  }

  return XhrApi
}
