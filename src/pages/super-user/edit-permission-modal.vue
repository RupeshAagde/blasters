<template>
    <div>
        <nitrozen-dialog
            ref="edit_permissions_dialog"
            :title="
                `${edit_mode ? 'Edit' : 'Add'} ${
                    active_user ? getFullName() : ''
                } ${edit_mode ? 'permissions' : 'as administrator'}`
            "
            @close="close"
        >
            <template slot="body">
                <user-permissions
                    ref="permissions"
                    :user_data="active_user"
                    :selected_company="userCompanyData"
                ></user-permissions>
            </template>
        </nitrozen-dialog>
    </div>
</template>

<style lang="less" scoped></style>

<script>
import { NitrozenDialog } from '@gofynd/nitrozen-vue';
import UserService from '@/services/user-access.service';
import userPermissions from './user-permissions.vue';

export default {
    name: 'edit-permissions-modal',
    props: {
        active_user: {
            type: Object,
            required: true
        },
        edit_mode: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            userCompanyData: []
        };
    },
    components: {
        'user-permissions': userPermissions,
        'nitrozen-dialog': NitrozenDialog
    },
    methods: {
        open() {
            this.$refs['edit_permissions_dialog'].open({
                width: '800px',
                height: 'calc(100% - 20px)',
                showCloseButton: true,
                dismissible: true,
                positiveButtonLabel: this.edit_mode ? 'Update' : 'Add',
                negativeButtonLabel: 'Cancel',
                neutralButtonLabel: false
            });
            if (this.edit_mode) {
                UserService.getUserList({}, this.active_user._id)
                    .then(({ data }) => {
                        this.userCompanyData = data.companies;
                    })
                    .catch((err) => {
                        this.$snackbar.global.showError(
                            'Failed to fetch company details'
                        );
                        console.log(err);
                    });
            }
        },
        close(clickBtn) {
            this.$emit('close', clickBtn, this.$refs['permissions'].userData);
        },
        getFullName() {
            return (
                (this.active_user.first_name || this.active_user.firstName) +
                ' ' +
                (this.active_user.last_name || this.active_user.lastName)
            );
        }
    }
};
</script>
