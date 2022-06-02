'use strict';

import ExtensionReviewList from './../../pages/extensions/extension-review-list.vue';
import ExtensionCollection from './../../pages/extensions/extension-collection.vue';
import ExtensionCollectionForm from './../../pages/extensions/extension-collection-create.vue';
import ExtensionReview from '../../pages/extensions/extension-review.vue';

export default [
    {
        path: 'extensions/review',
        component: ExtensionReviewList,
        beforeEnter: (to, from, next) => {
            return  checkUserPermission(to, from, next, ['extension']);
        }
    },
    {
        path: 'extensions/collection',
        component: ExtensionCollection,
        beforeEnter: (to, from, next) => {
            return next(); // checkUserPermission(to, from, next, ['plans']);
        }
    },
    {
        path: 'extensions/collection/create',
        component: ExtensionCollectionForm,
        beforeEnter: (to, from, next) => {
            return next(); // checkUserPermission(to, from, next, ['plans']);
        }
    },
    {
        path: 'extensions/collection/edit/:collection_id',
        component: ExtensionCollectionForm,
        beforeEnter: (to, from, next) => {
            return next(); // checkUserPermission(to, from, next, ['plans']);
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