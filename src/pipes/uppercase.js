import Vue from 'vue'
import * as dateformat from 'dateformat'

Vue.filter('uppercase', function(value) {
  value = value || ''
  return value.toUpperCase()
})
