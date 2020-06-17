import Vue from 'vue'

const currencyFormat = (value, fractionDigits = 0) => {
  if (value || value === 0) {
    return value.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: fractionDigits
    })
  }
}

Vue.filter('currencyformat', currencyFormat)

export default currencyFormat
