import _ from 'lodash'

export const fullName = (staff) => {
  if (!(staff.first_name && staff.last_name)) return 'Team Member'

  const arrName = [staff.first_name, staff.last_name]
  return _.compact(arrName).join(' ')
}

export const reduce = (entities) => {
  if (_.isEmpty(entities)) return {}

  let entity = entities.find(
    (entity) => entity.active && entity.primary && entity.verified
  )
  if (!_.isEmpty(entity)) return entity

  entity = entities.find((entity) => entity.active && entity.primary)
  if (!_.isEmpty(entity)) return entity

  entity = entities.find((entity) => entity.active)
  if (!_.isEmpty(entity)) return entity

  entity = entities.find((entity) => true)
  return entity || {}
}

export const fullPhNo = (phone) => {
  if (!phone.phone) return ''
  return `+${phone.countryCode} ${phone.phone}` || ''
}
