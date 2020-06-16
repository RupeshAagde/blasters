'use strict'
//Ported from jetfire
function paymentOptionsNormalizer(paymentOption) {
  var payment_mode_id = paymentOption.payment_mode_id
  var name = paymentOption.name
  var display_name = paymentOption.display_name
  var option = paymentOption.option || {}
  var logo = '/public/assets/icon.svg'
  option.aggregator_name = option.aggregator_name || 'Juspay'
  if (name === 'NB') {
    logo =
      option.logo ||
      option.url ||
      option.card_brand_image ||
      (option.logo_url && option.logo_url.small) ||
      logo
    return {
      payment_mode_id: payment_mode_id,
      mode_display: display_name || 'Net Banking',
      mode_name: name,
      option_id: option.bank_code,
      option_display: option.bank_name,
      option_name: option.bank_code,
      option_logo: logo,
      option: option,
      aggregator_name: option.aggregator_name,
      merchant_code: option.merchant_code
    }
  } else if (name === 'WL') {
    logo =
      option.logo ||
      option.url ||
      (option.logo_url && option.logo_url.small) ||
      logo
    return {
      payment_mode_id: payment_mode_id,
      mode_display: display_name || 'Wallet',
      mode_name: name,
      option_id: option.wallet_code,
      option_display: option.wallet_name,
      option_name: option.wallet_code,
      option_logo: logo,
      option: option,
      aggregator_name: option.aggregator_name,
      merchant_code: option.merchant_code
    }
  } else if (name === 'COD') {
    return {
      payment_mode_id: payment_mode_id,
      mode_display: display_name,
      mode_name: name,
      option_display: 'Cash on Delivery',
      option_name: name,
      option_logo: paymentOption.logo_url.small,
      aggregator_name: 'Fynd'
    }
  } else if (name === 'FC') {
    return {
      payment_mode_id: payment_mode_id,
      mode_display: 'Fynd Cash',
      mode_name: name,
      option_display: 'Fynd Cash',
      option_name: name,
      option_logo: '/public/imgs/pngs/cod.svg',
      aggregator_name: option.aggregator_name
    }
  } else if (name === 'CARD') {
    if (option.pay_by_card) {
      return {
        payment_mode_id: payment_mode_id,
        mode_display: display_name,
        mode_name: name,
        option_display: 'Pay Using Card',
        option_name: '',
        option_logo: logo,
        option: option,
        aggregator_name: option.aggregator_name,
        pay_by_card: option.pay_by_card,
        show_card_form: option.show_card_form,
        uiType: 'cardForm',
        merchant_code: option.merchant_code
      }
    } else {
      logo =
        option.logo ||
        (option.card_brand &&
          '/public/assets/pngs/' + option.card_brand.toLowerCase() + '.png') ||
        logo
      return {
        payment_mode_id: payment_mode_id,
        mode_display: display_name,
        mode_name: name,
        option_id: option.card_id,
        option_display: option.card_number,
        option_name: option.name_on_card || option.card_name,
        option_logo: logo,
        option: option,
        aggregator_name: option.aggregator_name,
        merchant_code: option.merchant_code
      }
    }
  } else if (name === 'PL') {
    var isSimple = option.aggregator_name.indexOf('Simpl') !== -1
    var message = 'Hang in there while we check your eligibility for Simpl'
    return {
      payment_mode_id: payment_mode_id,
      mode_display: display_name,
      mode_name: name,
      option_display: option.name,
      option_name: isSimple ? message : option.name,
      option_id: option.code,
      option_logo: option.logo,
      option: option,
      disabled: isSimple,
      aggregator_name: option.aggregator_name,
      id: option.aggregator_name + option.code + payment_mode_id,
      merchant_code: option.merchant_code
    }
  } else if (name === 'PS') {
    return {
      payment_mode_id: payment_mode_id,
      mode_display: display_name,
      mode_name: name,
      option_display: '',
      option_name: option.name,
      option_id: option.code,
      option_logo: option.logo,
      option: option,
      aggregator_name: option.aggregator_name,
      id: option.aggregator_name + option.code + payment_mode_id,
      merchant_code: option.merchant_code
    }
  } else if (name === 'UPI') {
    logo =
      option.logo ||
      option.url ||
      (option.logo_url && option.logo_url.small) ||
      logo
    var message = 'I have a UPI supported app'
    return {
      payment_mode_id: payment_mode_id,
      mode_display: display_name || 'UPI',
      mode_name: name,
      option_display: option.display_name,
      option_name: message,
      option_id: option.code,
      option_logo: logo,
      option: option,
      aggregator_name: option.aggregator_name,
      merchant_code: option.merchant_code
    }
  } else if (name === 'OP') {
    return {
      payment_mode_id: payment_mode_id,
      mode_display: display_name,
      mode_name: name,
      option_display: option.name,
      option_name: option.name,
      option_id: option.code,
      option_logo: option.logo,
      option: option,
      aggregator_name: option.aggregator_name,
      id: option.aggregator_name + option.code + payment_mode_id,
      merchant_code: option.merchant_code
    }
  } else if (name === 'QR') {
    logo =
      option.logo ||
      option.url ||
      (option.logo_url && option.logo_url.small) ||
      logo
    return {
      payment_mode_id: payment_mode_id,
      mode_display: display_name,
      mode_name: name,
      option_display: option.display_name,
      option_name: option.name,
      option_id: option.code,
      option_logo: logo,
      option: option,
      aggregator_name: option.aggregator_name
    }
  }

  return {}
}

module.exports = {
  paymentOptionsNormalizer: paymentOptionsNormalizer
}
