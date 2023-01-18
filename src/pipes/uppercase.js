import Vue from 'vue'

Vue.filter('uppercase', function(value) {
  value = value || ''
  return value.toUpperCase()
})
