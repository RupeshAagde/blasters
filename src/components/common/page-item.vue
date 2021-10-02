<template>
    <div class="blaster-list-card-container" >
        <div class="card-avatar banner-image">
            <img
                v-if="itemType == 'blog'"
                :src="
                    pageDetail.feature_image.secure_url ||
                        '/public/admin/assets/pngs/default_icon_listing.png'
                "
            />
            <adm-text-avatar v-else :text="pageDetail.title"></adm-text-avatar>
        </div>
        <div class="card-content-section">
            <div class="card-content-line-1">{{ pageDetail.title }}</div>
            <div class="card-content-line-2">
                <page-link :link="pageUrl"></page-link>
            </div>
            <div class="card-content-line-3">
                <span v-if="itemType == 'page'">
                    {{ pageDetail.type.toUpperCase() }}
                    |
                </span>
                {{ getDate() }}
            </div>
        </div>
        <div class="card-badge-section">
            <nitrozen-badge v-if="pageDetail.published" state="success">
                Active
            </nitrozen-badge>
            <nitrozen-badge v-else>
                Inactive
            </nitrozen-badge>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import '../../../src/pages/less/form.less';
.banner-image {
    background-color: #d8d8d8;
    overflow: hidden;
    img {
        height: 100%;
        margin-left: -9px;
        @media @mobile {
            margin-left: 0px;
        }
    }
}
.card-content-section {
    .show-next-schedule {
        color: #00c853;
    }
}

</style>

<script>
import moment from 'moment';
import { NitrozenBadge } from '@gofynd/nitrozen-vue';
import AdmTextAvatar from '@/components/common/text-avatar.vue';
import pageLink from './page-link.vue';

export default {
    name: 'page-item',
    props: {
        pageDetail: {},
        pageUrl: '',
        itemType: ''
    },
    data: function() {
        return {};
    },
    components: { NitrozenBadge, AdmTextAvatar, 'page-link': pageLink },
    computed: {
        isActive() {
            return this.pageDetail.archived || this.pageDetail.published;
        }
    },
    methods: {
        onUpdate() {
            this.$emit('updatePage');
        },
        getDate() {
            let date;
            switch (this.itemType) {
                case 'page':
                    date = this.pageDetail.modified_on;
                    break;
                default:
                    break;
            }
            return date ? `${new Date(date).toDateString()}` : '';
        }
    }
};
</script>
