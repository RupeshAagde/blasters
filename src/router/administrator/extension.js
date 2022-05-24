'use strict';

import ExtensionReviewList from './../../pages/extensions/extension-review-list.vue';
import ExtensionReview from '../../pages/extensions/extension-review.vue';
import { checkUserPermission } from '../guards';

export default [
    {
        path: 'extensions/review',
        component: ExtensionReviewList,
        beforeEnter: (to, from, next) => {
            return  checkUserPermission(to, from, next, ['extension']);
        }
    },
    {
        path: 'extensions/review/:review_id',
        component: ExtensionReview,
        beforeEnter: (to, from, next) => {
            return checkUserPermission(to, from, next, ['extension']);
        }
    }
];
