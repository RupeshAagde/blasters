<template>
    <div class="admin-actions">
        <oms-dropdown 
            :items="dropdownItems"
            :placeholder="'Actions'"
            @change="onActionSelection"
        />
    </div>
</template>

<script>
/* Package imports */
import { NitrozenDropdown } from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';

/* Component imports */
import OMSDropdown from '@/pages/oms/oms-dropdown/oms-dropdown.vue';

/* Fixtures imports */
import { adminActionDropdownItems } from '@/pages/oms/fixtures/dropdown-items.js';

export default {
    name: 'admin-actions',
    components: {
        NitrozenDropdown,
        'oms-dropdown': OMSDropdown
    },
    data() {
        return {
            dropdownItems: cloneDeep(adminActionDropdownItems),
            selectedAction: '',
        }
    },
    methods: {
        /**
         * Method to decide what happens when a user has selected an action.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {Object} $event The event object coming from nitrozen-dropdown.
         */
        onActionSelection($event) {
            if($event && $event.item && $event.item.value) {
                let value = $event.item.value;
                this.$emit('change', {value: value});
            } else {
                this.$snackbar.global.showError(
                    'We are facing some technical issues with the dropdown',
                    3000
                );
            }
        }
    }
}
</script>
