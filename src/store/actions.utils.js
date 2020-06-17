/*
 * createAsyncMutation('GET_INFO_ASYNC') will lead to:
 *
 * GET_INFO_ASYNC = {
 *      BASE: GET_INFO_ASYNC_BASE,
 *      SUCCESS: GET_INFO_ASYNC_SUCCESS,
 *      PENDING: GET_INFO_ASYNC_PENDING,
 *      FAILURE: GET_INFO_ASYNC_FAILURE,
 *      KEY:"whatever"
 * }
 *
 */

export const createAsyncMutation = (type, key) => ({
  BASE: `${type}`,
  SUCCESS: `${type}_SUCCESS`,
  FAILURE: `${type}_FAILURE`,
  PENDING: `${type}_PENDING`,
  KEY: key
})
/*
    commit=> Commit handler
    promiseFn=> Services Promise API wrapper
    mutationTypes=> Defines mutation handler
    reqOpt=> pass request data
    callback=> Any callback on success
*/
export const doAsync = (
  commit,
  promiseFn,
  mutationTypes,
  reqOpt,
  callback = null
) => {
  commit(mutationTypes.BASE, { type: mutationTypes.PENDING, reqOpt: reqOpt })

  promiseFn
    .then((res) => {
      commit(mutationTypes.BASE, {
        type: mutationTypes.SUCCESS,
        data: res.data,
        reqOpt: reqOpt
      })
      if (callback) {
        callback(reqOpt, res.data)
      }
    })
    .catch((err) => {
      let errObj = {
        statusCode: (err.response && err.response.status) || '',
        data: (err.response && err.response.data) || 'Unable to connect'
      }

      commit(mutationTypes.BASE, {
        type: mutationTypes.FAILURE,
        value: false,
        pageError: errObj
      })
    })
}
