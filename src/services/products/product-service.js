'use strict';

import { getCommonHeaderOptions } from './utils.service';
import { Object } from 'window-or-global';

// mock data as of now

const variants = [
    
]

const variantService = {
    getVariants () {
        Object.assign(
            {},
            getCommonHeaderOptions()
        )
        // return ApiService.get('waiting url', axiosOptions)
        return variants
    }

}

export default variantService