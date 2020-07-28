import Vue from 'vue';
import { generateHufferUrl } from '@/helper/image.utils';

const imageTransform = (imageUrl, options = {}) => {
    if (imageUrl) {
        return generateHufferUrl(imageUrl, options);
    }
    return imageUrl;
};

Vue.filter('imagetransform', imageTransform);

export default imageTransform;
