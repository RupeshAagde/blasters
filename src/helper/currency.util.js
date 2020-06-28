export function toCurrencyString(amount = 0, currencyCode = 'INR') {
    if (currencyCode === 'INR') {
        return `${CURRENCY_INR.symbol}${amount}`;
    }
    const symbol = getCurrencySymbol(currencyCode);
    if (!symbol) {
        return `${CURRENCY_INR.symbol}${amount}`;
    }
    return `${symbol}${amount}`;
}

export function getCurrencySymbol(currencyCode = 'INR') {
    if (currencyCode === 'INR') {
        return CURRENCY_INR.symbol;
    }
    const currency = CURRENCIES.find((currency) => {
        return currency.code === currencyCode;
    });
    if (!currency) {
        return CURRENCY_INR.symbol;
    }
    return currency.symbol;
}

// for faster access
const CURRENCY_INR = {
    _id: '5ec75d11f7bfb5a7d38f3524',
    name: 'Indian Rupee',
    code: 'INR',
    decimal_digits: 2,
    symbol: '₹'
};

export const CURRENCIES = [
    {
        _id: '5ec75d11f7bfb559d08f34d5',
        name: 'United Arab Emirates Dirham',
        code: 'AED',
        decimal_digits: 2,
        symbol: 'د.إ'
    },
    {
        _id: '5ec75d11f7bfb528298f34d6',
        name: 'Afghan Afghani',
        code: 'AFN',
        decimal_digits: 0,
        symbol: 'Af'
    },
    {
        _id: '5ec75d11f7bfb5c92f8f34d7',
        name: 'Albanian Lek',
        code: 'ALL',
        decimal_digits: 0,
        symbol: 'L'
    },
    {
        _id: '5ec75d11f7bfb552ca8f34d8',
        name: 'Armenian Dram',
        code: 'AMD',
        decimal_digits: 0,
        symbol: '֏'
    },
    {
        _id: '5ec75d11f7bfb553738f34d9',
        name: 'Netherlands Antillean Guilder',
        code: 'ANG',
        decimal_digits: 2,
        symbol: 'ƒ'
    },
    {
        _id: '5ec75d11f7bfb5d1e98f34da',
        name: 'Argentine Peso',
        code: 'ARS',
        decimal_digits: 2,
        symbol: 'AR$'
    },
    {
        _id: '5ec75d11f7bfb5826a8f34db',
        name: 'Australian Dollar',
        code: 'AUD',
        decimal_digits: 2,
        symbol: 'AU$'
    },
    {
        _id: '5ec75d11f7bfb534548f34dc',
        name: 'Angolan Kwanza',
        code: 'AOA',
        decimal_digits: 2,
        symbol: 'Kz'
    },
    {
        _id: '5ec75d11f7bfb53ea88f34dd',
        name: 'Aruban Florin',
        code: 'AWG',
        decimal_digits: 2,
        symbol: 'ƒ'
    },
    {
        _id: '5ec75d11f7bfb5721b8f34de',
        name: 'Bulgarian Lev',
        code: 'BGN',
        decimal_digits: 2,
        symbol: 'лв.'
    },
    {
        _id: '5ec75d11f7bfb5424a8f34e0',
        name: 'Bermudan Dollar',
        code: 'BMD',
        decimal_digits: 2,
        symbol: '$'
    },
    {
        _id: '5ec75d11f7bfb55ad08f34df',
        name: 'Bangladeshi Taka',
        code: 'BDT',
        decimal_digits: 2,
        symbol: 'Tk'
    },
    {
        _id: '5ec75d11f7bfb523048f34e4',
        name: 'Bahraini Dinar',
        code: 'BHD',
        decimal_digits: 3,
        symbol: 'BD'
    },
    {
        _id: '5ec75d11f7bfb528768f34eb',
        name: 'Congolese Franc',
        code: 'CDF',
        decimal_digits: 2,
        symbol: 'FC'
    },
    {
        _id: '5ec75d11f7bfb5a56f8f34e7',
        name: 'Bitcoin',
        code: 'BTC',
        decimal_digits: 8,
        symbol: 'B'
    },
    {
        _id: '5ec75d11f7bfb5a0238f34ea',
        name: 'Belarusian Ruble',
        code: 'BYN',
        decimal_digits: 0,
        symbol: 'Br'
    },
    {
        _id: '5ec75d11f7bfb5bc7f8f34e1',
        name: 'Bosnia-Herzegovina Convertible Mark',
        code: 'BAM',
        decimal_digits: 2,
        symbol: 'KM'
    },
    {
        _id: '5ec75d11f7bfb506928f34ee',
        name: 'Swiss Franc',
        code: 'CHF',
        decimal_digits: 2,
        symbol: 'CHF'
    },
    {
        _id: '5ec75d11f7bfb5f86b8f34e8',
        name: 'Bhutanese Ngultrum',
        code: 'BTN',
        decimal_digits: 2,
        symbol: 'Nu.'
    },
    {
        _id: '5ec75d11f7bfb51adb8f34e5',
        name: 'Barbadian Dollar',
        code: 'BBD',
        decimal_digits: 2,
        symbol: 'Bds$'
    },
    {
        _id: '5ec75d11f7bfb51c8a8f34e6',
        name: 'Brunei Dollar',
        code: 'BND',
        decimal_digits: 2,
        symbol: 'BN$'
    },
    {
        _id: '5ec75d11f7bfb544558f34e9',
        name: 'Bolivian Boliviano',
        code: 'BOB',
        decimal_digits: 2,
        symbol: 'Bs.'
    },
    {
        _id: '5ec75d11f7bfb5a2a68f34ec',
        name: 'Brazilian Real',
        code: 'BRL',
        decimal_digits: 2,
        symbol: 'R$'
    },
    {
        _id: '5ec75d11f7bfb5c1598f34e3',
        name: 'Burundian Franc',
        code: 'BIF',
        decimal_digits: 0,
        symbol: 'FBu'
    },
    {
        _id: '5ec75d11f7bfb5e25b8f34e2',
        name: 'Azerbaijani Manat',
        code: 'AZN',
        decimal_digits: 2,
        symbol: '₼'
    },
    {
        _id: '5ec75d11f7bfb52b0c8f34ef',
        name: 'Bahamian Dollar',
        code: 'BSD',
        decimal_digits: 2,
        symbol: '$'
    },
    {
        _id: '5ec75d11f7bfb523718f3501',
        name: 'Qatari Rial',
        code: 'QAR',
        decimal_digits: 2,
        symbol: 'QR'
    },
    {
        _id: '5ec75d11f7bfb552868f34f3',
        name: 'Cuban Peso',
        code: 'CUP',
        decimal_digits: 2,
        symbol: '₱'
    },
    {
        _id: '5ec75d11f7bfb5833d8f34fd',
        name: 'Hong Kong Dollar',
        code: 'HKD',
        decimal_digits: 2,
        symbol: 'HK$'
    },
    {
        _id: '5ec75d11f7bfb54fd98f351a',
        name: 'Indonesian Rupiah',
        code: 'IDR',
        decimal_digits: 0,
        symbol: 'Rp'
    },
    {
        _id: '5ec75d11f7bfb5f1538f34f0',
        name: 'Botswanan Pula',
        code: 'BWP',
        decimal_digits: 2,
        symbol: 'P'
    },
    {
        _id: '5ec75d11f7bfb5fe428f3513',
        name: 'Nigerian Naira',
        code: 'NGN',
        decimal_digits: 2,
        symbol: '₦'
    },
    {
        _id: '5ec75d11f7bfb53a288f34fa',
        name: 'Tanzanian Shilling',
        code: 'TZS',
        decimal_digits: 0,
        symbol: 'TSh'
    },
    {
        _id: '5ec75d11f7bfb5eeb68f34f7',
        name: 'Malaysian Ringgit',
        code: 'MYR',
        decimal_digits: 2,
        symbol: 'RM'
    },
    {
        _id: '5ec75d11f7bfb527a48f3507',
        name: 'Kenyan Shilling',
        code: 'KES',
        decimal_digits: 2,
        symbol: 'KSh'
    },
    {
        _id: '5ec75d11f7bfb5f7488f351d',
        name: 'Nepalese Rupee',
        code: 'NPR',
        decimal_digits: 2,
        symbol: 'रु'
    },
    {
        _id: '5ec75d11f7bfb5cc358f351c',
        name: 'Myanma Kyat',
        code: 'MMK',
        decimal_digits: 0,
        symbol: 'K'
    },
    {
        _id: '5ec75d11f7bfb58d008f352a',
        name: 'Vanuatu Vatu',
        code: 'VUV',
        decimal_digits: 0,
        symbol: 'Vt'
    },
    {
        _id: '5ec75d11f7bfb57a918f3551',
        name: 'Egyptian Pound',
        code: 'EGP',
        decimal_digits: 2,
        symbol: 'E£'
    },
    {
        _id: '5ec75d11f7bfb522d98f3535',
        name: 'Euro',
        code: 'EUR',
        decimal_digits: 2,
        symbol: '€'
    },
    {
        _id: '5ec75d11f7bfb5756d8f3549',
        name: 'Ghanaian Cedi',
        code: 'GHS',
        decimal_digits: 2,
        symbol: 'GH₵'
    },
    {
        _id: '5ec75d11f7bfb50af18f354b',
        name: 'Kazakhstani Tenge',
        code: 'KZT',
        decimal_digits: 2,
        symbol: '₸'
    },
    {
        _id: '5ec75d11f7bfb5de2e8f3561',
        name: 'Tajikistani Somoni',
        code: 'TJS',
        decimal_digits: 2,
        symbol: 'ЅМ'
    },
    {
        _id: '5ec75d11f7bfb54b2a8f356d',
        name: 'Yemeni Rial',
        code: 'YER',
        decimal_digits: 0,
        symbol: '﷼'
    },
    {
        _id: '5ec75d11f7bfb542078f357d',
        name: 'Somali Shilling',
        code: 'SOS',
        decimal_digits: 0,
        symbol: 'Sh.So.'
    },
    {
        _id: '5ec75d11f7bfb5ce5a8f3503',
        name: 'Ukrainian Hryvnia',
        code: 'UAH',
        decimal_digits: 2,
        symbol: '₴'
    },
    {
        _id: '5ec75d11f7bfb5f4948f3519',
        name: 'Falkland Islands Pound',
        code: 'FKP',
        decimal_digits: 2,
        symbol: '£'
    },
    {
        _id: '5ec75d11f7bfb5347a8f3525',
        name: 'Cayman Islands Dollar',
        code: 'KYD',
        decimal_digits: 2,
        symbol: '$'
    },
    {
        _id: '5ec75d11f7bfb5fadd8f3527',
        name: 'Panamanian Balboa',
        code: 'PAB',
        decimal_digits: 2,
        symbol: 'B/.'
    },
    {
        _id: '5ec75d11f7bfb55ea08f354d',
        name: 'Peruvian Nuevo Sol',
        code: 'PEN',
        decimal_digits: 2,
        symbol: 'S/.'
    },
    {
        _id: '5ec75d11f7bfb54ab08f357a',
        name: 'Liberian Dollar',
        code: 'LRD',
        decimal_digits: 2,
        symbol: '$'
    },
    {
        _id: '5ec75d11f7bfb58faf8f3511',
        name: 'Kyrgystani Som',
        code: 'KGS',
        decimal_digits: 2,
        symbol: 'лв'
    },
    {
        _id: '5ec75d11f7bfb5abf58f351e',
        name: 'Saudi Riyal',
        code: 'SAR',
        decimal_digits: 2,
        symbol: 'SR'
    },
    {
        _id: '5ec75d11f7bfb51ebf8f3567',
        name: 'Comorian Franc',
        code: 'KMF',
        decimal_digits: 0,
        symbol: 'CF'
    },
    {
        _id: '5ec75d11f7bfb54f9f8f3569',
        name: 'Norwegian Krone',
        code: 'NOK',
        decimal_digits: 2,
        symbol: 'Nkr'
    },
    {
        _id: '5ec75d11f7bfb5ac168f351f',
        name: 'Swazi Lilangeni',
        code: 'SZL',
        decimal_digits: 2,
        symbol: 'L'
    },
    {
        _id: '5ec75d11f7bfb5a7d38f3524',
        name: 'Indian Rupee',
        code: 'INR',
        decimal_digits: 2,
        symbol: '₹'
    },
    {
        _id: '5ec75d11f7bfb510d98f3522',
        name: 'Djiboutian Franc',
        code: 'DJF',
        decimal_digits: 0,
        symbol: 'Fdj'
    },
    {
        _id: '5ec75d11f7bfb560af8f352b',
        name: 'Algerian Dinar',
        code: 'DZD',
        decimal_digits: 2,
        symbol: 'DA'
    },
    {
        _id: '5ec75d11f7bfb54bac8f3565',
        name: 'Fijian Dollar',
        code: 'FJD',
        decimal_digits: 2,
        symbol: '$'
    },
    {
        _id: '5ec75d11f7bfb553b88f355f',
        name: 'Omani Rial',
        code: 'OMR',
        decimal_digits: 3,
        symbol: '﷼'
    },
    {
        _id: '5ec75d11f7bfb52bd68f357b',
        name: 'Mexican Peso',
        code: 'MXN',
        decimal_digits: 2,
        symbol: 'MEX$'
    },
    {
        _id: '5ec75d11f7bfb5e38e8f350d',
        name: 'Palladium Ounce',
        code: 'XPD',
        decimal_digits: null,
        symbol: null
    },
    {
        _id: '5ec75d11f7bfb5213c8f353d',
        name: 'Platinum Ounce',
        code: 'XPT',
        decimal_digits: null,
        symbol: null
    },
    {
        _id: '5ec75d11f7bfb5e5a98f3518',
        name: 'Colombian Peso',
        code: 'COP',
        decimal_digits: 0,
        symbol: 'CO$'
    },
    {
        _id: '5ec75d11f7bfb5d1908f3556',
        name: 'Pakistani Rupee',
        code: 'PKR',
        decimal_digits: 0,
        symbol: 'Rs'
    },
    {
        _id: '5ec75d11f7bfb56da28f3539',
        name: 'Nicaraguan Córdoba',
        code: 'NIO',
        decimal_digits: 2,
        symbol: 'C$'
    },
    {
        _id: '5ec75d11f7bfb56d678f3537',
        name: 'Cambodian Riel',
        code: 'KHR',
        decimal_digits: 2,
        symbol: '៛'
    },
    {
        _id: '5ec75d11f7bfb560fe8f353f',
        name: 'British Pound Sterling',
        code: 'GBP',
        decimal_digits: 2,
        symbol: '£'
    },
    {
        _id: '5ec75d11f7bfb565988f354a',
        name: 'Iraqi Dinar',
        code: 'IQD',
        decimal_digits: 0,
        symbol: 'د.ع'
    },
    {
        _id: '5ec75d11f7bfb5642a8f356a',
        name: 'Rwandan Franc',
        code: 'RWF',
        decimal_digits: 0,
        symbol: 'FRw'
    },
    {
        _id: '5ec75d11f7bfb5d8e98f3557',
        name: 'Sierra Leonean Leone',
        code: 'SLL',
        decimal_digits: 2,
        symbol: 'Le'
    },
    {
        _id: '5ec75d11f7bfb569a48f356b',
        name: 'Syrian Pound',
        code: 'SYP',
        decimal_digits: 0,
        symbol: 'LS'
    },
    {
        _id: '5ec75d11f7bfb5cd1f8f3577',
        name: 'Eritrean Nakfa',
        code: 'ERN',
        decimal_digits: 2,
        symbol: 'Nfk'
    },
    {
        _id: '5ec75d11f7bfb58d878f34f5',
        name: 'Jordanian Dinar',
        code: 'JOD',
        decimal_digits: 3,
        symbol: 'JD'
    },
    {
        _id: '5ec75d11f7bfb530238f34fb',
        name: 'Special Drawing Rights',
        code: 'XDR',
        decimal_digits: 2,
        symbol: 'XDR'
    },
    {
        _id: '5ec75d11f7bfb508dc8f357c',
        name: 'Polish Zloty',
        code: 'PLN',
        decimal_digits: 2,
        symbol: 'zł'
    },
    {
        _id: '5ec75d11f7bfb507a88f3514',
        name: 'Serbian Dinar',
        code: 'RSD',
        decimal_digits: 0,
        symbol: 'din'
    },
    {
        _id: '5ec75d11f7bfb550f08f3536',
        name: 'Haitian Gourde',
        code: 'HTG',
        decimal_digits: 2,
        symbol: 'G'
    },
    {
        _id: '5ec75d11f7bfb567e88f353e',
        name: 'Costa Rican Colón',
        code: 'CRC',
        decimal_digits: 0,
        symbol: '₡'
    },
    {
        _id: '5ec75d11f7bfb501d88f3559',
        name: 'Gold Ounce',
        code: 'XAU',
        decimal_digits: null,
        symbol: null
    },
    {
        _id: '5ec75d11f7bfb559988f3555',
        name: 'Malawian Kwacha',
        code: 'MWK',
        decimal_digits: 2,
        symbol: 'MK'
    },
    {
        _id: '5ec75d11f7bfb592d38f356e',
        name: 'Dominican Peso',
        code: 'DOP',
        decimal_digits: 2,
        symbol: 'RD$'
    },
    {
        _id: '5ec75d11f7bfb566698f3533',
        name: 'Silver Ounce',
        code: 'XAG',
        decimal_digits: null,
        symbol: null
    },
    {
        _id: '5ec75d11f7bfb5b7a48f3515',
        name: 'São Tomé and Príncipe Dobra',
        code: 'STN',
        decimal_digits: 2,
        symbol: 'Db'
    },
    {
        _id: '5ec75d11f7bfb57d2b8f34f1',
        name: 'Chilean Unit of Account (UF)',
        code: 'CLF',
        decimal_digits: 4,
        symbol: 'UF'
    },
    {
        _id: '5ec75d11f7bfb5a8bc8f34f9',
        name: 'Surinamese Dollar',
        code: 'SRD',
        decimal_digits: 2,
        symbol: '$'
    },
    {
        _id: '5ec75d11f7bfb51b5c8f34f4',
        name: 'Guyanaese Dollar',
        code: 'GYD',
        decimal_digits: 2,
        symbol: '$'
    },
    {
        _id: '5ec75d11f7bfb506028f34f6',
        name: 'Lesotho Loti',
        code: 'LSL',
        decimal_digits: 2,
        symbol: 'L'
    },
    {
        _id: '5ec75d11f7bfb517b88f3500',
        name: 'Mozambican Metical',
        code: 'MZN',
        decimal_digits: 2,
        symbol: 'MT'
    },
    {
        _id: '5ec75d11f7bfb516a58f3504',
        name: 'CFA Franc BCEAO',
        code: 'XOF',
        decimal_digits: 0,
        symbol: 'CFA'
    },
    {
        _id: '5ec75d11f7bfb525538f350f',
        name: 'Ethiopian Birr',
        code: 'ETB',
        decimal_digits: 2,
        symbol: 'Br'
    },
    {
        _id: '5ec75d11f7bfb5d8488f3530',
        name: 'Philippine Peso',
        code: 'PHP',
        decimal_digits: 2,
        symbol: '₱'
    },
    {
        _id: '5ec75d11f7bfb5180f8f353b',
        name: 'Salvadoran Colón',
        code: 'SVC',
        decimal_digits: 2,
        symbol: '$'
    },
    {
        _id: '5ec75d11f7bfb5c1db8f353c',
        name: 'Uruguayan Peso',
        code: 'UYU',
        decimal_digits: 2,
        symbol: '$U'
    },
    {
        _id: '5ec75d11f7bfb5d5618f355d',
        name: 'Kuwaiti Dinar',
        code: 'KWD',
        decimal_digits: 3,
        symbol: 'KD'
    },
    {
        _id: '5ec75d11f7bfb57d6c8f3508',
        name: 'Moroccan Dirham',
        code: 'MAD',
        decimal_digits: 2,
        symbol: 'DH'
    },
    {
        _id: '5ec75d11f7bfb5b21a8f350c',
        name: 'Ugandan Shilling',
        code: 'UGX',
        decimal_digits: 0,
        symbol: 'USh'
    },
    {
        _id: '5ec75d11f7bfb5fd4f8f350e',
        name: 'Chilean Peso',
        code: 'CLP',
        decimal_digits: 0,
        symbol: 'CL$'
    },
    {
        _id: '5ec75d11f7bfb5b5a28f3512',
        name: 'Moldovan Leu',
        code: 'MDL',
        decimal_digits: 2,
        symbol: 'MDL'
    },
    {
        _id: '5ec75d11f7bfb53b088f354c',
        name: 'Mauritanian Ouguiya',
        code: 'MRU',
        decimal_digits: 2,
        symbol: 'UM'
    },
    {
        _id: '5ec75d11f7bfb550618f352c',
        name: 'Gambian Dalasi',
        code: 'GMD',
        decimal_digits: 2,
        symbol: 'D'
    },
    {
        _id: '5ec75d11f7bfb579bd8f355b',
        name: 'Georgian Lari',
        code: 'GEL',
        decimal_digits: 2,
        symbol: 'GEL'
    },
    {
        _id: '5ec75d11f7bfb5a5428f3545',
        name: 'Thai Baht',
        code: 'THB',
        decimal_digits: 2,
        symbol: '฿'
    },
    {
        _id: '5ec75d11f7bfb525158f3566',
        name: 'Hungarian Forint',
        code: 'HUF',
        decimal_digits: 0,
        symbol: 'Ft'
    },
    {
        _id: '5ec75d11f7bfb5342a8f3562',
        name: 'Vietnamese Dong',
        code: 'VND',
        decimal_digits: 0,
        symbol: '₫'
    },
    {
        _id: '5ec75d11f7bfb5485d8f3570',
        name: 'Iranian Rial',
        code: 'IRR',
        decimal_digits: 0,
        symbol: '﷼'
    },
    {
        _id: '5ec75d11f7bfb543238f3575',
        name: "Tongan Pa'anga",
        code: 'TOP',
        decimal_digits: 2,
        symbol: 'T$'
    },
    {
        _id: '5ec75d11f7bfb558e38f34fe',
        name: 'Japanese Yen',
        code: 'JPY',
        decimal_digits: 0,
        symbol: '¥'
    },
    {
        _id: '5ec75d11f7bfb563a88f3509',
        name: 'Namibian Dollar',
        code: 'NAD',
        decimal_digits: 2,
        symbol: 'N$'
    },
    {
        _id: '5ec75d11f7bfb52f9b8f350a',
        name: 'Romanian Leu',
        code: 'RON',
        decimal_digits: 2,
        symbol: 'RON'
    },
    {
        _id: '5ec75d11f7bfb5a0618f3517',
        name: 'CFP Franc',
        code: 'XPF',
        decimal_digits: 0,
        symbol: 'Fr'
    },
    {
        _id: '5ec75d11f7bfb542918f3532',
        name: 'Turkish Lira',
        code: 'TRY',
        decimal_digits: 2,
        symbol: '₺'
    },
    {
        _id: '5ec75d11f7bfb55afd8f3543',
        name: 'New Zealand Dollar',
        code: 'NZD',
        decimal_digits: 2,
        symbol: 'NZ$'
    },
    {
        _id: '5ec75d11f7bfb59d4d8f3540',
        name: 'Israeli New Sheqel',
        code: 'ILS',
        decimal_digits: 2,
        symbol: '₪'
    },
    {
        _id: '5ec75d11f7bfb57ea58f356f',
        name: 'Gibraltar Pound',
        code: 'GIP',
        decimal_digits: 2,
        symbol: '£'
    },
    {
        _id: '5ec75d11f7bfb556358f3546',
        name: 'Venezuelan Bolívar Soberano',
        code: 'VES',
        decimal_digits: 2,
        symbol: 'Bs'
    },
    {
        _id: '5ec75d11f7bfb5c9388f3558',
        name: 'Trinidad and Tobago Dollar',
        code: 'TTD',
        decimal_digits: 2,
        symbol: 'TT$'
    },
    {
        _id: '5ec75d11f7bfb504828f357e',
        name: 'New Taiwan Dollar',
        code: 'TWD',
        decimal_digits: 2,
        symbol: 'NT$'
    },
    {
        _id: '5ec75d11f7bfb5248a8f3564',
        name: 'Chinese Yuan',
        code: 'CNY',
        decimal_digits: 2,
        symbol: 'RMB'
    },
    {
        _id: '5ec75d11f7bfb5f6b98f3578',
        name: 'Guatemalan Quetzal',
        code: 'GTQ',
        decimal_digits: 2,
        symbol: 'Q'
    },
    {
        _id: '5ec75d11f7bfb5223d8f34fc',
        name: 'Cape Verdean Escudo',
        code: 'CVE',
        decimal_digits: 2,
        symbol: 'CVE'
    },
    {
        _id: '5ec75d11f7bfb581918f3510',
        name: 'Croatian Kuna',
        code: 'HRK',
        decimal_digits: 2,
        symbol: 'kn'
    },
    {
        _id: '5ec75d11f7bfb52a018f3538',
        name: 'Malagasy Ariary',
        code: 'MGA',
        decimal_digits: 0,
        symbol: 'Ar'
    },
    {
        _id: '5ec75d11f7bfb5c4c68f3547',
        name: 'Zambian Kwacha',
        code: 'ZMW',
        decimal_digits: 2,
        symbol: 'ZK'
    },
    {
        _id: '5ec75d11f7bfb5936b8f3523',
        name: 'Guernsey Pound',
        code: 'GGP',
        decimal_digits: 2,
        symbol: '£'
    },
    {
        _id: '5ec75d11f7bfb502578f352d',
        name: 'Icelandic Króna',
        code: 'ISK',
        decimal_digits: 0,
        symbol: 'Íkr'
    },
    {
        _id: '5ec75d11f7bfb508ea8f354e',
        name: 'Swedish Krona',
        code: 'SEK',
        decimal_digits: 2,
        symbol: 'kr'
    },
    {
        _id: '5ec75d11f7bfb5c5558f3550',
        name: 'Samoan Tala',
        code: 'WST',
        decimal_digits: 2,
        symbol: 'T'
    },
    {
        _id: '5ec75d11f7bfb57ec08f3579',
        name: 'Jamaican Dollar',
        code: 'JMD',
        decimal_digits: 2,
        symbol: 'J$'
    },
    {
        _id: '5ec75d11f7bfb5a5458f3506',
        name: 'Honduran Lempira',
        code: 'HNL',
        decimal_digits: 2,
        symbol: 'L'
    },
    {
        _id: '5ec75d11f7bfb54d798f3516',
        name: 'United States Dollar',
        code: 'USD',
        decimal_digits: 2,
        symbol: '$'
    },
    {
        _id: '5ec75d11f7bfb5baba8f3560',
        name: 'Seychellois Rupee',
        code: 'SCR',
        decimal_digits: 2,
        symbol: '₨'
    },
    {
        _id: '5ec75d11f7bfb5cd3a8f3548',
        name: 'Danish Krone',
        code: 'DKK',
        decimal_digits: 2,
        symbol: 'Dkr'
    },
    {
        _id: '5ec75d11f7bfb5263e8f3541',
        name: 'South Korean Won',
        code: 'KRW',
        decimal_digits: 0,
        symbol: '₩'
    },
    {
        _id: '5ec75d11f7bfb538928f3554',
        name: 'Sri Lankan Rupee',
        code: 'LKR',
        decimal_digits: 2,
        symbol: 'Rs.'
    },
    {
        _id: '5ec75d11f7bfb54b738f3574',
        name: 'Singapore Dollar',
        code: 'SGD',
        decimal_digits: 2,
        symbol: 'S$'
    },
    {
        _id: '5ec75d11f7bfb54a3f8f3553',
        name: 'Jersey Pound',
        code: 'JEP',
        decimal_digits: 2,
        symbol: '£'
    },
    {
        _id: '5ec75d11f7bfb5a6fa8f34f8',
        name: 'Paraguayan Guarani',
        code: 'PYG',
        decimal_digits: 0,
        symbol: '₲'
    },
    {
        _id: '5ec75d11f7bfb5f1d58f3502',
        name: 'South Sudanese Pound',
        code: 'SSP',
        decimal_digits: 2,
        symbol: '£'
    },
    {
        _id: '5ec75d11f7bfb5e2c08f352e',
        name: 'Lebanese Pound',
        code: 'LBP',
        decimal_digits: 0,
        symbol: 'ل.ل.‏'
    },
    {
        _id: '5ec75d11f7bfb5694a8f34ff',
        name: 'Libyan Dinar',
        code: 'LYD',
        decimal_digits: 3,
        symbol: 'LD'
    },
    {
        _id: '5ec75d11f7bfb52b868f351b',
        name: 'North Korean Won',
        code: 'KPW',
        decimal_digits: 2,
        symbol: '₩'
    },
    {
        _id: '5ec75d11f7bfb5b55e8f352f',
        name: 'Maldivian Rufiyaa',
        code: 'MVR',
        decimal_digits: 2,
        symbol: '.ރ'
    },
    {
        _id: '5ec75d11f7bfb549328f3544',
        name: 'Solomon Islands Dollar',
        code: 'SBD',
        decimal_digits: 2,
        symbol: '$'
    },
    {
        _id: '5ec75d11f7bfb51d088f354f',
        name: 'Tunisian Dinar',
        code: 'TND',
        decimal_digits: 3,
        symbol: 'DT'
    },
    {
        _id: '5ec75d11f7bfb5c5f38f3563',
        name: 'Zimbabwean Dollar',
        code: 'ZWL',
        decimal_digits: 2,
        symbol: 'Z$'
    },
    {
        _id: '5ec75d11f7bfb573908f3572',
        name: 'Mauritian Rupee',
        code: 'MUR',
        decimal_digits: 0,
        symbol: 'Rs'
    },
    {
        _id: '5ec75d11f7bfb577648f3571',
        name: 'Laotian Kip',
        code: 'LAK',
        decimal_digits: 2,
        symbol: '₭'
    },
    {
        _id: '5ec75d11f7bfb50ead8f3542',
        name: 'Mongolian Tugrik',
        code: 'MNT',
        decimal_digits: 2,
        symbol: '₮'
    },
    {
        _id: '5ec75d11f7bfb545998f3520',
        name: 'Venezuelan Bolívar Fuerte (Old)',
        code: 'VEF',
        decimal_digits: 2,
        symbol: 'Bs.F.'
    },
    {
        _id: '5ec75d11f7bfb5005f8f3521',
        name: 'South African Rand',
        code: 'ZAR',
        decimal_digits: 2,
        symbol: 'R'
    },
    {
        _id: '5ec75d11f7bfb577bc8f3534',
        name: 'Chinese Yuan (Offshore)',
        code: 'CNH',
        decimal_digits: 2,
        symbol: '¥'
    },
    {
        _id: '5ec75d11f7bfb568a48f3552',
        name: 'Guinean Franc',
        code: 'GNF',
        decimal_digits: 0,
        symbol: 'FG'
    },
    {
        _id: '5ec75d11f7bfb54bbc8f355a',
        name: 'Cuban Convertible Peso',
        code: 'CUC',
        decimal_digits: 2,
        symbol: 'CUC'
    },
    {
        _id: '5ec75d11f7bfb51af28f3568',
        name: 'Macedonian Denar',
        code: 'MKD',
        decimal_digits: 2,
        symbol: 'den'
    },
    {
        _id: '5ec75d11f7bfb50ac68f350b',
        name: 'São Tomé and Príncipe Dobra (pre-2018)',
        code: 'STD',
        decimal_digits: 2,
        symbol: 'Db'
    },
    {
        _id: '5ec75d11f7bfb5557a8f3526',
        name: 'Mauritanian Ouguiya (pre-2018)',
        code: 'MRO',
        decimal_digits: 2,
        symbol: 'UM'
    },
    {
        _id: '5ec75d11f7bfb55a2e8f353a',
        name: 'Russian Ruble',
        code: 'RUB',
        decimal_digits: 2,
        symbol: '₽'
    },
    {
        _id: '5ec75d11f7bfb57bf88f355c',
        name: 'Manx pound',
        code: 'IMP',
        decimal_digits: 2,
        symbol: '£'
    },
    {
        _id: '5ec75d11f7bfb571f68f356c',
        name: 'Uzbekistan Som',
        code: 'UZS',
        decimal_digits: 0,
        symbol: 'UZS'
    },
    {
        _id: '5ec75d11f7bfb5f9398f34ed',
        name: 'Belize Dollar',
        code: 'BZD',
        decimal_digits: 2,
        symbol: 'BZ$'
    },
    {
        _id: '5ec75d11f7bfb51b398f34f2',
        name: 'Canadian Dollar',
        code: 'CAD',
        decimal_digits: 2,
        symbol: 'CA$'
    },
    {
        _id: '5ec75d11f7bfb5079a8f3529',
        name: 'Turkmenistani Manat',
        code: 'TMT',
        decimal_digits: 2,
        symbol: 'm'
    },
    {
        _id: '5ec75d11f7bfb555688f3505',
        name: 'Czech Republic Koruna',
        code: 'CZK',
        decimal_digits: 2,
        symbol: 'Kč'
    },
    {
        _id: '5ec75d11f7bfb5f93b8f3531',
        name: 'Saint Helena Pound',
        code: 'SHP',
        decimal_digits: 2,
        symbol: '£'
    },
    {
        _id: '5ec75d11f7bfb5123b8f3528',
        name: 'Sudanese Pound',
        code: 'SDG',
        decimal_digits: 2,
        symbol: 'SD'
    },
    {
        _id: '5ec75d11f7bfb5e69b8f355e',
        name: 'Macanese Pataca',
        code: 'MOP',
        decimal_digits: 2,
        symbol: 'MOP$'
    },
    {
        _id: '5ec75d11f7bfb5ea838f3573',
        name: 'Papua New Guinean Kina',
        code: 'PGK',
        decimal_digits: 2,
        symbol: 'K'
    },
    {
        _id: '5ec75d11f7bfb5f8be8f357f',
        name: 'East Caribbean Dollar',
        code: 'XCD',
        decimal_digits: 2,
        symbol: '$'
    },
    {
        _id: '5ec75d11f7bfb5689d8f3576',
        name: 'CFA Franc BEAC',
        code: 'XAF',
        decimal_digits: 0,
        symbol: 'CFA'
    }
];
