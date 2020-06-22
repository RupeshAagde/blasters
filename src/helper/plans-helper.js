'use strict'
import _ from 'lodash'

const getFilterToQuery = (filterObj) => {
  let filter_data = _.cloneDeep(filterObj)
  let query = {
    offset: Math.max(
      (filter_data.pagination.current - 1) *
        parseInt(filter_data.pagination.limit),
      0
    ),
    limit: filter_data.pagination.limit
  }

  // trim filter values
  Object.keys(filter_data.query).forEach((key) => {
    filter_data.query[key] = filter_data.query[key].toString().trim()
    if (filter_data.query[key] == '') {
      delete filter_data.query[key]
    }
  })

  if (filter_data.query.name) {
    filter_data.query.name = {
      $regex: filter_data.query.name,
      $options: 'gi'
    }
  }
  if (Object.keys(filter_data.query).length) {
    query.query = JSON.stringify(filter_data.query)
  }
  return query
}

export { getFilterToQuery }
