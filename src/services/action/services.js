import ProductDetailService from './../product-details.service'
import { FETCH_PRODUCT_SIZE_PRICE, ADD_CART_ITEMS } from './constants'
import Vue from 'vue'

export default (mapAction, ...args) => {
  switch (mapAction) {
    case FETCH_PRODUCT_SIZE_PRICE: {
      return ProductDetailService.fetchProductSizePriceDetails(...args)
    }
    case ADD_CART_ITEMS: {
      return import('./../../entry-client').then((appModule) => {
        const appStore = appModule.getAppStore()
        return appStore.dispatch(ADD_CART_ITEMS, ...args)
      })
    }
  }
}
