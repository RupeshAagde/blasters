<template>
    <div class="comment-section">
        <div v-if="allComments.length > 0">
            <p>Comments</p>
            <div v-for="(event, index) in allComments" v-bind:key="index">
                <div class="comment">
                    <p>{{ event.value.text }}</p>
                    <p class="comment-info">{{ commentInfo(event) }}</p>
                </div>
            </div>
        </div>
        <br />
        <div class="add-comment">
            <nitrozen-input
                class="comment-input"
                label="Add new comment"
                placeholder="Enter your comment"
                v-model="newComment"
                @input="onCommentChange"
            />
            <nitrozen-button
                class="comment-button"
                :theme="'secondary'"
                :showProgress="loading"
                :disabled="!isSubmitable"
                @click="addComment"
                v-flatBtn
            >
                <template v-if="detectMobileWidth()"
                    ><adm-inline-svg
                        class="svg-icon"
                        src="arrow-continue"
                    ></adm-inline-svg
                ></template>
                <template v-else>Comment</template>
            </nitrozen-button>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import SupportService from '@/services/support.service';
import admininlinesvg from '@/components/common/adm-inline-svg';
import { detectMobileWidth } from '@/helper/utils';
import { mapGetters } from 'vuex';
import { GET_USER_INFO } from '@/store/getters.type';
import {
    NitrozenInput,
    NitrozenButton,
    NitrozenError,
    flatBtn,
    strokeBtn,
} from '@gofynd/nitrozen-vue';

export default {
    name: 'comments',
    data() {
        return {
            newComment: '',
            isSubmitable: false,
            loading: false,
        };
    },
    components: {
        'nitrozen-input': NitrozenInput,
        'nitrozen-button': NitrozenButton,
        'nitrozen-error': NitrozenError,
        'adm-inline-svg': admininlinesvg,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    props: {
        allComments: {
            type: Array
        }
    },
    computed: {
        ...mapGetters({
            userdata: GET_USER_INFO,
        }),
    },
    methods: {
        detectMobileWidth,
        readableDate(date) {
            var isToday = moment(date).isSame(moment(), 'day');
            if (isToday) {
                return moment(date).format('h:mm a');
            }
            var isSameYear = moment(date).isSame(moment(), 'year');
            if (isSameYear) {
                return moment(date).format('MMM Do, h:mm a');
            } else {
                return moment(date).format('MMM Do y, h:mm a');
            }
        },
        commentInfo(event) {
            let creator = 'User';
            let final = '';
            if (event.created_by) {
                let selfUserID = this.userdata.user._id;
                let userID = event.created_by._id;
                if (selfUserID === userID) {
                    creator = "You "
                } else {
                    creator =
                    event.created_by.firstName +
                    ' ' +
                    event.created_by.lastName +
                    ' ';
                }
            }
            final =
                '- ' +
                creator +
                ' at ' +
                this.readableDate(new Date(event.createdAt));
            return final;
        },
        onCommentChange() {
            this.isSubmitable =
                this.newComment && this.newComment.trim().length > 0;
        },
        addComment() {
            let dataToSend = {
                text: this.newComment,
                media: [],
            };
            this.loading = true;
            SupportService.addComment(
                this.$route.params.ticket_id,
                dataToSend
            )
                .then((response) => {
                    response.data.created_by = this.userdata.user;
                    this.allComments.push(response.data);
                    this.newComment = '';
                    this.isSubmitable = false;
                })
                .catch((err) =>
                    this.$snackbar.global.showError('Failed to add comment')
                )
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style lang="less" scoped>
.add-comment {
    text-align: center;
    display: flex;
    align-items: flex-end;
}
.comment-input {
    flex: 1 1 auto;
    margin-right: 5px
}
.comment-button {
    width: fit-content;
    @media @mobile {
        padding: 0px 10px;
    }
}
.svg-icon {
    ::v-deep svg {
        width: 32px;
        height: 32px;
    }
}
.comment-section {
    color: #9b9b9b;
    font-family: Poppins, sans-serif;
    font-size: 13px;
    font-weight: 600;
    line-height: 14px;
    margin-bottom: 4px;

    .comment {
        font-size: 11.5px;
        font-weight: 500;
        border: solid 1px#f0f0f0;
        background-color: #f8f8f8;
        border-radius: 5px;
        padding: 7px;
        margin-top: 8px;
        margin-bottom: 8px;
    }
    .comment-info {
        padding-top: 5px;
        font-size: 10px;
        font-weight: 300;
    }
}
</style>