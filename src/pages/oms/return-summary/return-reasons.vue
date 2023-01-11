<template>
    <div class="return-reasons-container" v-if="item.qc.bad.quantity > 0">
        <div v-for="(reason, index) in item.qc.bad.reasons" :key="`reason-${index}`" class="reason-wrapper">
            <div class="qty-reason-container">
                <div class="qty">
                    <div class="qty-label">
                        <span>Quantity</span>
                    </div>
                    <custom-input-number
                        :min="1"
                        :max="findMax(item, index)"
                        :id="item.bag_id"
                        :value="item.qc.bad.reasons[index].quantity"
                        :disabled="true"
                        :allowNegative="false"
                        @increment="increment($event, index)"
                        @decrement="decrement($event, index)"
                    />
                </div>
                <div class="reason">
                    <nitrozen-dropdown
                        :label="`How is the quality of the returned item?`"
                        :placeholder="'Select Reason'"
                        :items="reasons"
                    />
                </div>
            </div>

            <div class="remarks">
                <div class="remarks-box">
                    <input 
                        type="text"
                        placeholder="Write a remark"
                        class="remark-input"
                        @change="onAddingRemark($event, item.bag_id, index, false)"
                    />
                    <div @click.stop="onAttachClick(item.bag_id, index)">
                        <ukt-inline-svg :src="'attachment'" class="attachment-icon" />
                    </div>
                </div>
                <div class="uploaded-file" v-if="item.qc.bad.reasons[index].img">
                    <span>{{ item.qc.bad.reasons[index].img.file_name }}</span>
                    <span
                        class="remove-file" 
                        @click.stop="removeFile(item.bag_id, index)"
                    >x</span>
                </div>
            </div>

            <div 
                class="add-qty-btn" 
                @click.stop="onAddingQty(item.bag_id)"
                v-if="showAddReasonsBtn(item, index)">
                + Add Reason
            </div>
        </div>
        <input 
            type="file" 
            class="remark-file-upload" 
            ref="remark-file-upload"
            accept="image/*"
            @change.stop="onFileUpload" />
    </div>
</template>

<script>
const REASONS = [
    {
        text: 'Good',
        value: 'good'
    },
    {
        text: 'Bad',
        value: 'bad'
    }
]

/* Package imports */
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import { NitrozenDropdown } from '@gofynd/nitrozen-vue';

/* Component imports */
import CustomInputNumber from '@/components/common/adm-input-number-controls.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg';

/* Services import */
import GrindorService from '@/services/grindor.service';
import OrderService from '@/services/orders.service';

export default {
    name: 'return-reasons',
    components: {
        'custom-input-number': CustomInputNumber,
        NitrozenDropdown,
        UktInlineSvg
    },
    props: {
        item: {
            type: Object
        },
        shipment: {
            type: Object
        }
    },

    data() {
        return {
            reasons: [],
            selectedBagIDForFileUpload: '',
            selectedReasonIndexForFileUpload: ''
        }
    },

    mounted() {
        if(!isEmpty(this.shipment) && !isEmpty(this.item)) {
            this.fetchReasons(this.shipment.shipment_id, this.item.bag_id);
        }
    },

    computed: {
        shipmentData() {
            return cloneDeep(this.shipment);
        }
    },

    methods: {
        /**
         * Handling the decrement of an individual input box
         * The combined data will be updated and it will be sent (emitted)
         * to the parent component.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {Object} event The native event object
         * @param {String} bag_id The bag id of the changed input box
         * @param {Number} index The index or the current position of the changed input box
         */
        decrement(event, index) {
            let shipData = cloneDeep(this.shipmentData);
            let selectedBag = shipData.bags.find(bag => bag.bag_id === event);
            selectedBag.qc.good.quantity += 1;
            selectedBag.qc.bad.reasons[index].quantity -= 1;
            this.$emit('update', shipData);
        },

        /**
         * The method to decided whether the current box should be enabled
         * or disabled. It will be in the case where the quantity is 1 or
         * equal to the maximum permissible value.
         * NOTE: This method is currently deprecated, as of, 12 December 2022. Kindly do not delete.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {Object} item The current bag object
         * @param {Number} index The current position of the input box in the reasons
         * @returns A boolean value whether the box should be enabled or disabled
         * @deprecated
         */
        disableInputCounter(item, index) {
            let quantity = item.qc.bad.reasons[index].quantity;
            return quantity === 1 || quantity === this.findMax(item);
        },

        /**
         * The method to fetch the reasons for QC.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {String} shipmentId Shipment ID
         * @param {String} bagId Bag ID
         */
        fetchReasons(shipmentId, bagId) {
            return OrderService.fetchQCReasons(shipmentId, bagId)
            .then(response => {
                if(response.data.success) {
                    if(response.data && response.data.reasons && !isEmpty(response.data.reasons)) {
                        this.reasons = cloneDeep(response.data.reasons).map(item => {
                            return {
                                ...item,
                                text: item.display_name,
                                value: item.id
                            }
                        });
                    }
                } else {
                    console.error("Error in fetching QC reasons:   ", response.data);
                    this.$snackbar.global.showError(
                        `We are facing issues in fetching the reasons for quality checks`,
                        3500
                    );
                }
            })
            .catch(error => {
                console.error("Error in fetching QC reasons:   ", error);
                this.$snackbar.global.showError(
                    `We are facing issues in fetching the reasons for quality checks`,
                    3500
                );
            })
        },

        /**
         * The method to determine what should be the maximum value of the 
         * individual input box, upto which the user can increase.
         * The basic idea, as of 12 Decemeber 2022, is 
         * total quantity of bag - total reasons of other input boxes
         * 
         * @author: Rushabh Mulraj Shah
         * @param {Object} item The current bag object
         * @param {Number} index The current position of the input box in the reasons
         * @returns The maximum allowed quantity of the input box
         */
        findMax(item, index) {
            let clonedReasons = cloneDeep(item.qc.bad.reasons);

            /** Fetch the other reasons by removing the current reason as described by index */
            clonedReasons.splice(index, 1);
            
            let otherReasonsTotalQty = clonedReasons.reduce((total, reason) => total + reason.quantity, 0);

            return item.quantity - otherReasonsTotalQty;
        },

         /**
         * Handling the increment of an individual input box
         * The combined data will be updated and it will be sent (emitted)
         * to the parent component.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {Object} event The native event object
         * @param {String} bag_id The bag id of the changed input box
         * @param {Number} index The index or the current position of the changed input box
         */
        increment(event, index) {
            let shipData = cloneDeep(this.shipmentData);
            let selectedBag = shipData.bags.find(bag => bag.bag_id === event);
            selectedBag.qc.good.quantity -= 1;
            selectedBag.qc.bad.reasons[index].quantity += 1;
            this.$emit('update', shipData);
        },
        onChange(event, index) {
            let shipData = cloneDeep(this.shipmentData);
            let selectedBag = shipData.bags.find(bag => bag.bag_id === event.id);
            if(selectedBag) {
                selectedBag.qc.bad.reasons[index].quantity = e.value;
                selectedBag.qc.good.quantity = item.quantity - e.value;
                this.$emit('update', shipData);
            } else {
                this.$snackbar.global.showError('Unable to change the quantity');
                console.error("Bag ID not found for changing");
            }
        },
        /**
         * The method to handle when a new bad reason will be added.
         * It will reduce the number of good QCs and increase the number of bad QCs.
         * It will also add an object for the bad QC.
         * It will send the updated data to the parent component.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {String} bag_id The bag ID for adding reasons
         */
        onAddingQty(bag_id) {
            let shipData = cloneDeep(this.shipmentData);
            let selectedBag = shipData.bags.find(bag => bag.bag_id === bag_id);
            selectedBag.qc.good.quantity -= 1;
            selectedBag.qc.bad.quantity += 1;
            selectedBag.qc.bad.reasons.push(
                {
                    quantity: 1,
                    quality: ''
                }
            );

            this.$emit('update', shipData);
        },

        /**
         * The method to add the remarks (textual content) for every reason.
         * After adding the required data, the updated data will be sent (emitted)
         * to the parent component.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {Object} event The native event object
         * @param {String} bag_id The bag ID for adding the remarks
         * @param {Number} index The position of the reason in the QCs to add the remark
         */
        onAddingRemark(event, bag_id, index) {
            let shipData = cloneDeep(this.shipmentData);
            let selectedBag = shipData.bags.find(bag => bag.bag_id === bag_id);

            if(selectedBag.qc.bad.reasons.length) {
                let entry = selectedBag.qc.bad.reasons[index];
                entry['remark'] = event.target.value;
            } else {
                let obj = {
                    remark: event.target.value
                };
                selectedBag.qc.bad.reasons.push(obj);
            }

            this.$emit('update', shipData);
        },

        /**
         * The method to handle the clicking of button to upload the file for a reason.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {String} bag_id The bag ID where the file needs to be attached
         * @param {Number} index The position of the reason where the image needs to be attached
         */
        onAttachClick(bag_id, index) {
            this.$refs['remark-file-upload'].click();
            this.selectedBagIDForFileUpload = bag_id;
            this.selectedReasonIndexForFileUpload = index;
        },

        /**
         * The method to handle the file upload.
         * It involves sending three consecutive and dependant requests
         * to the Grindor service which will finally give us the
         * uploaded URL which will be used for updating the data.
         * 
         * This has been an upgrade to the function below:
         * @see onFileUploadOld
         * 
         * @author: Rushabh Mulraj Shah
         * @param {Object} event The native event object for file upload.
         */
        onFileUpload(event) {
            let uploadedFileURL = '';

            if(!isEmpty(event.target.files)) {
                /* Create a payload for the file to be sent */
                let file = event.target.files[0];
                let body = {
                    file_name: file.name,
                    content_type: file.type,
                    size: file.size
                };

                /* Inform the user that file upload has begun */
                this.$snackbar.global.showInfo(
                    `Your file '${file.name}' is currently being uploaded`,
                    2000
                );

                /* If there is a company ID, add it to the payload */
                let companyId = this.$route.params.company_id;
                if(companyId) {
                    body.params = {
                        company_id: companyId
                    }
                }

                let request = { body };
                let uploadResponse = null;
                let namespace = 'misc';

                /* Start the upload process */
                return GrindorService.uploadToGrindorStart(namespace, body)
                .then(startResponse => {
                    if(startResponse.data && !isEmpty(startResponse.data)) {
                        /**
                         * If we receive the fetch URL as a response, we then
                         * proceed to upload this image to S3
                         */
                        uploadResponse = cloneDeep(startResponse.data);
                        uploadedFileURL = uploadResponse.upload && uploadResponse.upload.url ?
                        uploadResponse.upload.url :
                        '';

                        if(uploadedFileURL) {
                            return GrindorService.uploadToGrindorS3(uploadedFileURL, file);
                        } else {
                            throw {
                                message: 'Failed to upload your file'
                            }
                        }
                    }
                })
                .then(() => {
                    /**
                     * If the image has been successfully uploaded to S3,
                     * then we proceed to complete the upload.
                     */
                    let obj = {
                        ...request,
                        response: uploadResponse
                    };

                    return GrindorService.uploadToGrindorComplete(namespace, obj);
                })
                .then(completeResponse => {
                    /**
                     * If the image has been successfully uploaded to S3 and
                     * the upload has been flagged as a success from Grindor
                     * service, we finally show the user a success and send the
                     * response data ahead for final data modification.
                     */
                    if(
                        completeResponse.data && 
                        !isEmpty(completeResponse.data) &&
                        completeResponse.data.upload &&
                        completeResponse.data.upload.url
                    ) {
                        this.$snackbar.global.showSuccess(
                            `Your file '${file.name}' has been uploaded successfully`,
                            2500
                        );
                        this.updateDataOnFileUpload(completeResponse.data);
                    }
                    return completeResponse.data;
                })
                .catch(error => {
                    console.error("Error in uploading file:   ", error);
                    this.$snackbar.global.showError(
                        `Failed to upload and save your file to the database`,
                        3000
                    );
                })
            } else {
                console.error('Failed to upload the file natively');
                this.$snackbar.global.showError('Failed to upload the file');
            }
        },

        /**
         * The method to handle the file upload for a reason.
         * The said file will be attached to the respective reason before
         * the updated data will be sent (emitted) to the parent component.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {Object} event The native event object
         * @deprecated
         */
        onFileUploadOld(event) {
            let shipData = cloneDeep(this.shipmentData);
            let selectedBag = shipData.bags.find(bag => bag.bag_id === this.selectedBagIDForFileUpload);
            if(selectedBag.qc.bad.reasons.length) {
                let entry = selectedBag.qc.bad.reasons[this.selectedReasonIndexForFileUpload];
                entry.img = event.target.files[0];
            } else {
                let obj = {
                    img: event.target.files[0]
                };
                selectedBag.qc.bad.reasons.push(obj);
            }

            this.selectedBagIDForFileUpload = '';
            this.selectedReasonIndexForFileUpload = '';
            this.$emit('update', shipData);
        },

        /**
         * The method to handle the selection of a reason.
         * After adding the reason in the correct place, the updated data
         * will be sent (emitted) to the parent component.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {Object} event The native event object
         * @param {String} bag_id The bag ID where the reason needs to be added
         * @param {Number} index The position of the reason where the reason needs to be added. 
         */
        onReasonSelection(event, bag_id, index) {
            let selectedReason = this.reasons.find(reason => reason.id === event);
            let shipData = cloneDeep(this.shipmentData);
            let selectedBag = shipData.bags.find(bag => bag.bag_id === bag_id);
            selectedBag.qc.bad.reasons[index].reason_id = event;
            selectedBag.qc.bad.reasons[index].reason_text = selectedReason.text;
            this.$emit('update', shipData);
        },

        /**
         * The method to remove an uploaded file from the respective reason.
         * The updated data will then be sent (emitted) to the parent component.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {String} bag_id The bag ID where the file needs to be removed
         * @param {Number} index The position of the reason where the file needs to be removed
         */
        removeFile(bag_id, index) {
            let shipData = cloneDeep(this.shipmentData);
            let selectedBag = shipData.bags.find(bag => bag.bag_id === bag_id);
            delete selectedBag.qc.bad.reasons[index].img;
            this.$emit('update', shipData);
        },

        /**
         * This method is used to check whether the "Add Reason" button needs to be
         * displayed for a given bag.
         * 
         * @author: Rushabh Mulraj Shah
         */
        showAddReasonsBtn(item, index) {
            let totalReasons = item.qc.bad.reasons.reduce((total, reason) => total + reason.quantity, 0);

            return item.quantity > totalReasons && index === item.qc.bad.reasons.length - 1;
        },

        /**
         * The method to update the shipment data in case of a successful file upload.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {Object} uploadedData The uploaded data received after a successful upload to Grindor service.
         */
        updateDataOnFileUpload(uploadedData) {
            let shipData = cloneDeep(this.shipmentData);
            let selectedBag = shipData.bags.find(bag => { 
                return bag.bag_id === this.selectedBagIDForFileUpload;
            });
            if(selectedBag.qc.bad.reasons.length) {
                let entry = selectedBag.qc.bad.reasons[this.selectedReasonIndexForFileUpload];
                entry.img = uploadedData;
            } else {
                let obj = {
                    img: uploadedData
                };
                selectedBag.qc.bad.reasons.push(obj);
            }

            this.selectedBagIDForFileUpload = '';
            this.selectedReasonIndexForFileUpload = '';
            
            this.$emit('update', shipData);
        }
    }
}
</script>

<style lang="less" scoped>
.remarks {
    margin-bottom: 1rem;
}

.remarks-box {
    display: grid;
    grid-template-columns: 93% 5%;
    align-items: center;
    width: 100%;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
    height: 50px;
    padding-right: 8px;
    box-sizing: border-box;
}

.remark-input {
    height: 42px;
    padding: 0 8px;
    outline: none;
    border: none;
}

.attachment-icon {
    width: 30px;
    height: 30px;
    cursor: pointer;
}

.remark-file-upload {
    display: none !important;
}

.uploaded-file { 
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #F4F8FF;
    border: 1px solid #E0E0E0;
    border-radius: 0px 0px 4px 4px;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 500;
    line-height: 17px;
    color: #2E31BE;
}

.reason-wrapper {
    position: relative;
}

.qty-reason-container {
    margin-bottom: 24px;

    ::v-deep .n-input,
    ::v-deep .nitrozen-select__trigger {
        border-radius: 4px;
    }
}

.add-qty-btn {
    font-weight: 600;
    font-size: 12px;
    line-height: 140%;
    color: #2E31BE;
    cursor: pointer;
}

.remove-file {
    cursor: pointer;
}

.reason-wrapper {
    margin-bottom: 1rem;

    &:last-child {
        margin-bottom: 0;
    }
}

.qty {
    margin-right: 8px;
}

.qty-reason-container {
    display: grid;
    grid-template-columns: 1fr 3fr;
}

.qty-label {
    font-weight: 500;
    font-size: 12px;
    line-height: 21px;
    color: #9B9B9B;
    font-family: Inter,sans-serif;
}
</style>
