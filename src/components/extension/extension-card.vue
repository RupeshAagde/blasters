

<template>
    <div class="blaster-list-card-container"  @click="onClick" v-if="extension" >
        <div class="card-avatar banner-image">
            <img
                    v-if="extension.listing_info.icon"
                    :src="extension.listing_info.icon"
                    class="default-image circle-clip"
                />
                <adm-text-avatar
                    v-else
                    :text="extension.name"
                    class="default-image circle-clip"
                ></adm-text-avatar>
        </div>
        <div class="card-content-section">
            <div class="card-content-line-1"> {{ extension.listing_info.name }}</div>
            <div class="card-content-line-2">
                
                {{ extension.contact_info.review_notification_email }} on
                     {{ toDateTimeString(extension.created_at) }} ( {{extension.organization_name}} )
            </div>
            <div class="card-content-line-3" v-if="extension.current_status!=='pending'"> 
               <span v-if="extension.current_status==='approved'">Approved</span> 
                <span v-if="extension.current_status==='rejected'">Rejected</span> On: {{ toDateTimeString(extension.modified_at) }}
                

            </div>
        </div>
        <div class="card-badge-section">
           <nitrozen-badge v-if="extension.current_status==='pending'" state="warn">
                    Pending
                </nitrozen-badge>
                <nitrozen-badge v-if="extension.current_status==='rejected'" state="default">
                    Rejected
                </nitrozen-badge>
        </div>
    </div>
</template>
<style lang="less" scoped>



</style>

<script>
import moment from 'moment';
import inlineSvg from '@/components/common/inline-svg.vue';
import admTextAvatar from '@/components/common/text-avatar.vue';
import {
    NitrozenBadge,
    NitrozenButton,
    NitrozenToggleBtn,
    NitrozenMenu,
    NitrozenMenuItem
} from '@gofynd/nitrozen-vue';

export default {
    name: 'extension-list-card',
    components: {
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-button': NitrozenButton,
        'nitrozen-toggle': NitrozenToggleBtn,
        'nitrozen-menu' : NitrozenMenu,
        'nitrozen-menu-item' : NitrozenMenuItem,
        'inline-svg': inlineSvg,
        'adm-text-avatar': admTextAvatar,
    },
    props: {
        extension: {
            type: Object,
        },
    },
    methods: {
        onClick(event) {
            this.$emit('click', event);
        },
        toDateTimeString(date) {
            return moment(date).format('MMMM Do YYYY, h:mm:ss a');
        },
        
    },
};
</script>
