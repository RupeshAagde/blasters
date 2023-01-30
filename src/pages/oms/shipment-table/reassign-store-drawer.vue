<template>
    <div class="reassign-store-head">
        <div class="title">
            <span>Following stores are available for the reassignment for Bag ID: {{ bagId }}</span>
        </div>

        <template v-if="stores && stores.length && reasons && reasons.length">
            <div class="inputs-dropdowns">
                <!-- <nitrozen-input
                    :showSearchIcon="true"
                    class="search-input"
                    type="search"
                    :placeholder="`Search by Shipment ID`"
                    v-model="search"
                    @keyup="onSearchInput"
                ></nitrozen-input> -->

                <div class="dropdown" tabindex="0" @blur="handleDropdown($event, 'reasonDropdown')">
                    <nitrozen-dropdown
                        class="dropdown-reason"
                        label="Store Reassign Reason"
                        @change="reassignStores"
                        :items="reasons"
                        v-model="selectedReason"
                        ref="reasonDropdown"
                        placeholder="Choose location reassignment reason"
                    />
                </div>
            </div>
        
            <div class="labels">
                <div v-for="(store, index) in stores"
                    :key="index"
                    :class="`store-card ${selectedStore == store.value ? 'active':''}`"
                    @click="changeEvent($event, store.value)"
                >
                    <div class="header-store-details-card">
                        <div class="store-details">
                            <input 
                                class="radio-button"
                                type="radio"
                                name="name"
                                :value="store.value"
                                v-model="selectedStore"
                                @change="reassignStores"
                                
                            />
                            <label class="store-info">
                                <p>Store: {{ store.name }}</p> 
                                <p>Store Code: {{ store.store_code }}</p> 
                                <p>Address: {{ store.address }}</p> 
                                <p>Contact: {{ store.contact }}</p> 
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <div class="no-content" v-if="!stores.length || !reasons.length">
            <adm-no-content
                helperText="No store/reasons found"
            ></adm-no-content>
        </div>
    </div>
</template>

<script>
/* Components import */
import { NitrozenDropdown, NitrozenInput } from '@gofynd/nitrozen-vue';
import InlineSvg from '@/components/common/inline-svg.vue';
import admNoContent from '@/components/common/adm-no-content.vue';

/* Service imports */
import OrderService from '@/services/orders.service';

export default {
    name: "reassign-store-drawer",
    props: {
        stores: Array,
        reasons: Array,
        bagId: String,
    },
    data() {
        return {
            search: "",
            selectedReason: "",
            selectedStore: "",
        }
    },
    components: {
        InlineSvg,
        NitrozenDropdown,
        admNoContent,
        NitrozenInput,
    },
    mounted() {
        this.$emit("enableSubmitForReassignStore", true)
    },
    methods: {
        reassignStores() {
            if(this.selectedReason && this.selectedStore) {
                this.$emit("enableSubmitForReassignStore", false);
            }
        },
        assignNewStore() {
            let data = {
                reason_ids: [
                    this.selectedReason
                ],
                store_id: this.selectedStore,
                bag_id: this.bagId
            }
            OrderService.changeStore(data).then((res)=>{
                this.$snackbar.global.showSuccess('Store reassigned successfully');
                this.$emit('closeDrawer');
            }).catch((err)=> {
                console.error("Store reassign failed ", err)
            })
        },
        onSearchInput(event) {
            console.log("The event", event);
        },
        changeEvent(e, selectedValue) {
            this.selectedStore = selectedValue;
            this.reassignStores();
        },
        handleDropdown(e, ref){
            if(this.$refs[ref]) this.$refs[ref].documentClick(e);
        }
    }

}
</script>

<style lang="less" scoped> 

.reassign-store-head {
    padding-bottom: 60px;
    .title {
        margin-bottom: 16px;
        font-weight: 600;
        font-size: 16px;
        line-height: 120%;
        color: #4D4D4E;
    }
    .inputs-dropdowns {
        margin-bottom: 24px;
        .search-input {
            margin-bottom: 24px;
        }
    }
}

.dropdown-reason {
    width: 48%;
}

.labels {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.store-card {
    background: #FFFFFF;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    padding: 14px;
    margin-bottom: 16px;
    width: 44%;
    min-height: 100px;
    cursor: pointer;
}

.store-card.active {
    border: 1px solid #2E31BE;
    width: 44%;
    height: 100px;
    background: #E7EEFF;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    padding: 14px;
    margin-bottom: 16px;
    cursor: pointer;
}

.header-store-details-card {
    .store-details {
        display: flex;
        align-items: flex-start;
    }
}

.store-info {
    padding-left: 12px;
    font-weight: 400;
    font-size: 12px;
    line-height: 160%;
    color: #41434C;
}

.no-content {
    height: 100%;
    width: 100%;
}
</style>