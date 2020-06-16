import services from './services'
import Vue from 'vue'
import { FETCH_PRODUCT_SIZE_PRICE } from './constants'
import { ADD_CART_ITEMS } from '../../store/action.type'

Vue.prototype.$themeAction = {
  dispatch: services
}

export const actionMaps = {
  THEME_ACTIONS: {
    [FETCH_PRODUCT_SIZE_PRICE]: 'FETCH_PRODUCT_SIZE_PRICE',
    [ADD_CART_ITEMS]: 'ADD_CART_ITEMS'
  }
}
