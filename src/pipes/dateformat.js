import Vue from 'vue'
import * as dateformat from 'dateformat'

const formatDate = (value, format) => {
  if (!format) {
    format = 'dddd, mmmm dS, yyyy, h:MM:ss TT'
  }
  if (value) {
    return dateformat(new Date(value), format)
  }
}

Vue.filter('formatDate', formatDate)

export default formatDate
