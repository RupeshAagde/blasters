<template>
    <div class="panel">
        <div class="header-position">
            <adm-page-header @backClick="onCancel" @openHelp="docRedirect" :title="`Edit Webhook`"
                :contextMenuItems="isOrganisationUser ? [] : contextMenuItems" :noContextMenu="true"> 
                <div class="button-box">
                    <div class="toggle-text" :class="{ disabled: !requestStatus }">
                        {{ requestStatus ? 'Enabled' : 'Disabled' }}
                    </div>
                    <nitrozen-toggle class="pad-right toggle-switch" v-model="requestStatus"></nitrozen-toggle>

                    <nitrozen-button class="pad-left" :theme="'secondary'" v-flatBtn
                        :disabled="validateUrl || webhookUrl.length == 0" @click="testWebhook">Test Webhook
                    </nitrozen-button>
                    <nitrozen-button class="pad-left" :theme="'secondary'" v-flatBtn :disabled="
                        !isFormValid || !checkFormValidation || validateUrl || this.saveButtonClicked
                    " @click="save">Update</nitrozen-button>
                </div>
                <template slot="page-slot-mobile-footer">
                    <nitrozen-button :theme="'secondary'" @click="save" :disabled="!isFormValid || !checkFormValidation"
                        class="footer-actions" v-flatBtn>Save</nitrozen-button>
                </template>
            </adm-page-header>
        </div>
        <loader v-if="startLoader" class="loading"></loader>
        <page-error v-if="pageError && !pageLoading"></page-error>
        <div class="main-container">
            <nitrozen-dialog class="test_status_dialog" ref="test_status_dialog">
                <template slot="body">
                    <div v-if="testSuccess" class="header-block">
                        <img v-if="testDialogInfo == 'SUCCESS'" class="test-webhook-icon"
                            src="/public/assets/pngs/success_tick.png" />
                        <img v-if="testDialogInfo != 'SUCCESS'" class="test-webhook-icon alert"
                            src="/public/assets/pngs/alert.png" />
                        <div class="header-text">{{ testDialogInfo }}!</div>
                    </div>
                    <div v-if="testSuccess" class="test-webhook-message">
                        {{ testDialogMessage }}
                    </div>
                    <img v-if="!testSuccess" class="loader-icon" src="/public/assets/adm-loader.gif" />
                    <div v-if="!testSuccess" class="header-webhook-message">
                        Testing in progress...
                    </div>
                    <div v-if="!testSuccess" class="test-webhook-message">
                        Might take up a few seconds to complete
                    </div>
                </template>
                <template slot="footer">
                    <div class="test-webhook-footer">
                        <nitrozen-button v-if="testSuccess" @click="closeTestDialog" class="webhook-clear-btn"
                            v-strokeBtn :theme="'secondary'">Close</nitrozen-button>
                        <nitrozen-button v-if="!testSuccess" @click="closeTestDialog" class="webhook-clear-btn"
                            v-strokeBtn :theme="'secondary'">Cancel</nitrozen-button>
                    </div>
                </template>
            </nitrozen-dialog>
            <div class="full-width">
                <div class="webhook-settings-container">
                    <div class="sub-header">
                        <label class="bold-xs cl-Mako">Details </label>
                    </div>
                    <div class="event-span-text">
                        To consume our webhooks, you must provide us a URL on
                        which we can send an HTTP POST request containing the
                        information of the subscribed event. To learn about
                        webhooks
                        <a class="description-link" target="_blank" :href="docUrl">visit our documentation.</a>
                    </div>
                    <div class="event-span-text whitelist-span">
                        <span class="password-icon whitelist-icon" v-html="whiteListIcon"></span>
                        <span class="whitelist">
                            If you have a private server, make sure you
                            whitelist the following IP address (13.126.188.0)

                            <a class="whitelist-link" target="_blank" href="https://en.wikipedia.org/wiki/Whitelisting">
                                &nbsp;Know more</a>
                        </span>
                    </div>
                    <div>
                        <div>
                            <nitrozen-input :class="[
                                specialChar
                                    ? 'inputs '
                                    : 'inputs url-webhook',
                            ]" @focusout="isFormValid" :autofocus="true" :showTooltip="true"
                                :tooltipText="'Name- Title of subscriber.'" :label="'Name*'" :type="'text'"
                                v-model="name" :maxlength="30" @keypress="checkSpecialChar($event)">
                            </nitrozen-input>
                            <nitrozen-error :class="[
                                specialChar
                                    ? 'visibility-visible url-webhook'
                                    : 'visibility-hidden',
                                'error',
                            ]">{{ 'special characters are not allowed' }}
                            </nitrozen-error>
                            <nitrozen-error :class="[
                                false
                                    ? 'visibility-visible url-webhook'
                                    : 'visibility-hidden',
                                'error',
                            ]">{{
        'Please enter a valid subscriber name'
}}</nitrozen-error>
                        </div>
                        <div>
                            <nitrozen-input :class="[
                                validateUrl
                                    ? 'inputs '
                                    : 'inputs url-webhook',
                            ]" :autofocus="true" @focusout="isFormValid" :showTooltip="true"
                                :tooltipText="'Webhook URL- Endpoint supporting HTTP POST method.'"
                                :label="'Webhook URL*'" :type="'text'" @click="urlTriggered" v-model="webhookUrl">
                            </nitrozen-input>
                            <nitrozen-error :class="[
                                validateUrl
                                    ? 'visibility-visible url-webhook'
                                    : 'visibility-hidden',
                                'error',
                            ]">{{
        'Please enter a valid details'
}}</nitrozen-error>
                        </div>
                        <div>
                            <nitrozen-input class="inputs" @focusout="isFormValid" :showTooltip="true"
                                :tooltipText="'Alert Email- Email of webhook handler. e.g. It will be used in case webhook is disabled by system after multiple failed delivery attempts.'"
                                :label="'Alert Email*'" :type="'email'" @click="emailTriggered" v-model="alertEmail">
                            </nitrozen-input>
                            <nitrozen-error :class="[
                                validateEmail
                                    ? 'visibility-visible'
                                    : 'visibility-hidden',
                                'error',
                            ]">{{
        'Please enter a valid email'
}}</nitrozen-error>
                        </div>
                    </div>

                    <div class="header-container">
                        <div class="auth-toggle">
                            <nitrozen-checkbox class="toggle-switch-auth" v-model="customHeaderToggle" @change="
                                customHeaderToggleChange(customHeaderToggle)
                            "></nitrozen-checkbox>
                            <div class="toggle-text-auth-header" :class="{ disabled: !customHeaderToggle }">
                                Custom Headers
                            </div>
                        </div>
                        <div class="auth-toggle toggle-text-auth">
                            Send any headers in your webhook request
                        </div>
                        <div v-if="customHeaderToggle">
                            <span class="header-input" v-for="(item, index) in headers" :key="index">
                                <nitrozen-input class="inputs width" :label="'Key'" type="text" v-model="item.key"
                                @keypress="enableButton"
                                    maxlength="500">
                                </nitrozen-input>
                                <nitrozen-input class="inputs width" :label="'Value'" type="text" v-model="item.value"
                                    maxlength="500">
                                </nitrozen-input>
                                <span class="remove-header" @click="removeHeader(index)" v-html="deleteIcon"></span>
                            </span>
                        </div>
                        <span v-if="customHeaderToggle && !hideAddHeaderButton" class="add-another-link-icon"
                            @click="addHeader()">+</span>
                        <span v-if="customHeaderToggle && !hideAddHeaderButton" class="add-another-link"
                            @click="addHeader()">
                            Add More</span>
                    </div>

                    <div class="header-container">
                        <div class="auth-toggle">
                            <nitrozen-checkbox class="toggle-switch-auth" v-model="authStatus"
                                @change="toggleChange(authStatus)"></nitrozen-checkbox>
                            <div class="toggle-text-auth-header" :class="{ disabled: !authStatus }">
                                Authentication
                            </div>
                        </div>
                        <div class="auth-toggle toggle-text-auth">
                            You can now authenticate the Webhook URL with a
                            secret password
                        </div>
                        <span v-if="authStatus && disableToggle" class="password-input">
                            <nitrozen-input class="inputs width" :label="'Secret*'" :type="inputType"
                                v-model="password">
                            </nitrozen-input>
                            <span v-if="password.length !== 0" class="password-icon" @click="toggleView" :class="
                                currentVisibility ===
                                    visibility.makeInvisible
                                    ? 'password-icon-eye-cancel'
                                    : 'password-icon-eye'
                            " v-html="eyeIcon"></span>
                        </span>
                        <span v-if="authStatus && !disableToggle" class="password-input-non-hmac">
                            <div class="inline-column">
                                <div class="width-full">
                                    <nitrozen-input class="inputs width padding-right" :label="'Username'"
                                        :type="'text'" v-model="username">
                                    </nitrozen-input>
                                </div>
                                <div class="width-full">
                                    <nitrozen-input class="inputs width" :label="'Password'" :type="inputType"
                                        v-model="password">
                                    </nitrozen-input>
                                    <span v-if="password.length !== 0" class="password-icon" @click="toggleView" :class="
                                        currentVisibility ===
                                            visibility.makeInvisible
                                            ? 'password-icon-eye-cancel'
                                            : 'password-icon-eye'
                                    " v-html="eyeIcon"></span>
                                </div>
                            </div>
                        </span>
                        <nitrozen-error :class="[
                            passwordValidation
                                ? 'visibility-visible'
                                : 'visibility-hidden',
                            'error',
                        ]">{{ 'Please enter secret' }}</nitrozen-error>
                    </div>
                </div>
                <div class="webhook-settings-container-events"
                    v-if="groupedEventlist && Object.keys(groupedEventlist).length < 0">No events available to select
                    please create events</div>
                <div v-else class="webhook-settings-container-events">
                    <div v-if="groupedEventlist['company'] && Object.keys(groupedEventlist['company']).length > 0"
                        class="event-grouping">
                        <div class="event-content-main">
                            <div class="event-span">
                                Events
                                <nitrozen-button class="clear-btn" v-strokeBtn :theme="'secondary'"
                                    :disabled="!eventSelected" @click="clear">Clear all</nitrozen-button>
                            </div>
                            <div class="event-span-text">
                                Select the events you wish to receive.
                            </div>
                        </div>
                        <div class="event-content">
                            <div class="event-span">Company</div>
                            <div class="event-span-text">
                                Select the company events you wish to receive.
                            </div>
                        </div>
                        <template>
                            <div class="events-group span-header">
                                <div v-for="(item, key) in groupedEventlist[
                                    'company'
                                ]" :key="key.replace('_', ' ')" class="checkbox-element">
                                    <div class="event_version">
                                        <nitrozen-checkbox @change.self="
                                            checkmarkData(
                                                key,
                                                item,
                                                'company'
                                            )
                                        " class="check-item" :value="
    selectedEventName.includes(
        key + 'company'
    )
">
                                            <p class="event-text">
                                                {{ key.replace('_', ' ') }}
                                            </p>
                                            <a target="_blank" :href="
                                                baseDocUrl +
                                                key
                                                    .replace(/\s+/g, '-')
                                                    .toLowerCase() +
                                                (selectedVersionObject[
                                                    key + 'company'
                                                ] == undefined
                                                    ? ''
                                                    : '/#v' +
                                                    selectedVersionObject[
                                                    key + 'company'
                                                    ])
                                            " class="
                                                    password-icon
                                                    version-icon
                                                " v-html="linkIcon"></a>
                                        </nitrozen-checkbox>
                                        <div class="version-container">
                                            <div class="tooltip">
                                                <span class="
                                                        tooltiptext
                                                        tooltiptextlarge
                                                    ">The current selected
                                                    version is going to
                                                    deprecate, please select the
                                                    latest version</span>
                                                <a v-if="
                                                    item['versions']
                                                        .length >
                                                    selectedVersionObject[
                                                    key + 'company'
                                                    ] &&
                                                    selectedEventName.includes(
                                                        key + 'company'
                                                    )
                                                " class="alert-icon" v-html="alertIcon">
                                                </a>
                                            </div>
                                            <div class="tooltip">
                                                <span class="tooltiptext">Select an Event
                                                    version</span>
                                                <nitrozen-dropdown :disabled="
                                                    !selectedEventName.includes(
                                                        key + 'company'
                                                    )
                                                " class="version-dropdown" placeholder="Versions"
                                                    :items="item['versions']" v-model="
                                                        selectedVersionObject[
                                                        key + 'company'
                                                        ]
                                                    " @change="
    selectedVersion(
        $event,
        item,
        key + 'company'
    )
"></nitrozen-dropdown>
                                            </div>
                                        </div>
                                    </div>
                                    <nitrozen-dropdown :disabled="
                                        selectedVersionValue[
                                        key + 'company'
                                        ] == undefined ||
                                        !selectedEventName.includes(
                                            key + 'company'
                                        )
                                    " :items="
    item[
    selectedVersionObject[
    key + 'company'
    ]
    ]
" :id="key" v-model="
    eventsObj[
    key +
    'company' +
    selectedVersionObject[
    key + 'company'
    ]
    ]
" @change="eventTypeChange(item)" :searchable="false" label="Select Event Types" placeholder="Select Event Types"
                                        :multiple="true">
                                    </nitrozen-dropdown>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div
                         v-show="groupedEventlist['application'] && Object.keys(groupedEventlist['application']).length > 0"
                        class="event-grouping"
                    >
                        <div class="event-content">
                            <div class="event-span">Sales Channel</div>
                            <div class="event-span-text">
                                Select channels and events you wish to receive
                                for that channel.
                            </div>
                        </div>
                        <template>
                            <!-- <nitrozen-dropdown
                                :class="'filter-dropdown-field filter-date'"
                                :label="'Sales Channels'"
                                :enable_select_all="true"
                                :id="'ChannelFilter'"
                                :items="applications"
                                @change="selectedApplication()"
                                @searchInputChange="searchApplication($event)"
                                v-model="applicationSelected"
                                placeholder="Sales Channels"
                                :searchable="true"
                                :multiple="true"
                            >
                            </nitrozen-dropdown> -->
                            <div class="selectedItems">
                                <div
                                    v-for="(
                                        item, index
                                    ) in selectedApplications"
                                    :key="index"
                                    class="items"
                                >
                                    <span class="items-content">{{
                                        item.text
                                    }}</span>
                                    <img
                                        @click="deleteItem(item.value)"
                                        class="cross-icon"
                                        src="/public/admin/assets/admin/svgs/cross-black.svg"
                                        alt="profile"
                                    />
                                </div>
                                <div
                                    v-if="selectedApplications.length > 0"
                                    class="clear-section"
                                    @click="deleteItem('all')"
                                >
                                    <span> Clear all </span>
                                </div>
                            </div>
                            <div class="events-group span-header">
                                <div
                                    v-for="(item, key) in groupedEventlist[
                                        'application'
                                    ]"
                                    :key="key.replace('_', ' ')"
                                    class="checkbox-element"
                                >
                                    <div class="event_version">
                                        <nitrozen-checkbox
                                            @change.self="
                                                checkmarkData(
                                                    key,
                                                    item,
                                                    'application'
                                                )
                                            "
                                            class="check-item"
                                            :value="
                                                selectedEventName.includes(
                                                    key + 'application'
                                                )
                                            "
                                        >
                                            <p class="event-text">
                                                {{ key.replace('_', ' ') }}
                                            </p>
                                            <a
                                                target="_blank"
                                                :href="
                                                    baseDocUrl +
                                                    key
                                                        .replace(/\s+/g, '-')
                                                        .toLowerCase() +
                                                    (selectedVersionObject[
                                                        key + 'application'
                                                    ] == undefined
                                                        ? ''
                                                        : '/#v' +
                                                          selectedVersionObject[
                                                              key +
                                                                  'application'
                                                          ])
                                                "
                                                class="
                                                    password-icon
                                                    version-icon
                                                "
                                                v-html="linkIcon"
                                            ></a>
                                        </nitrozen-checkbox>
                                        <div class="version-container">
                                            <div class="tooltip">
                                                <span
                                                    class="
                                                        tooltiptext
                                                        tooltiptextlarge
                                                    "
                                                    >The current selected
                                                    version is going to
                                                    deprecate, please select the
                                                    latest version</span
                                                >
                                                <a
                                                    v-if="
                                                        item['versions']
                                                            .length >
                                                            selectedVersionObject[
                                                                key +
                                                                    'application'
                                                            ] &&
                                                        selectedEventName.includes(
                                                            key + 'application'
                                                        )
                                                    "
                                                    class="alert-icon"
                                                    v-html="alertIcon"
                                                ></a>
                                            </div>
                                            <div class="tooltip">
                                                <span class="tooltiptext"
                                                    >Select an Event
                                                    version</span
                                                >
                                                <nitrozen-dropdown
                                                    :disabled="
                                                        !selectedEventName.includes(
                                                            key + 'application'
                                                        )
                                                    "
                                                    class="version-dropdown"
                                                    :id="key"
                                                    placeholder="Versions"
                                                    :items="item['versions']"
                                                    v-model="
                                                        selectedVersionObject[
                                                            key + 'application'
                                                        ]
                                                    "
                                                    @change="
                                                        selectedVersion(
                                                            $event,
                                                            item,
                                                            key + 'application'
                                                        )
                                                    "
                                                ></nitrozen-dropdown>
                                            </div>
                                        </div>
                                    </div>
                                    <nitrozen-dropdown
                                        :disabled="
                                            selectedVersionValue[
                                                key + 'application'
                                            ] == undefined ||
                                            !selectedEventName.includes(
                                                key + 'application'
                                            )
                                        "
                                        :items="
                                            item[
                                                selectedVersionObject[
                                                    key + 'application'
                                                ]
                                            ]
                                        "
                                        :id="key"
                                        v-model="
                                            eventsObj[
                                                key +
                                                    'application' +
                                                    selectedVersionObject[
                                                        key + 'application'
                                                    ]
                                            ]
                                        "
                                        @change="eventTypeChange(item)"
                                        :searchable="false"
                                        label="Select Event Types"
                                        placeholder="Select Event Types"
                                        :multiple="true"
                                    ></nitrozen-dropdown>
                                </div>
                            </div>
                        </template>
                    </div>
                    <!-- //? GLOBAL EVENT -->
                    <div v-if="groupedEventlist['global'] && Object.keys(groupedEventlist['global']).length > 0">
                        <div class="event-content">
                            <div class="event-span-inner">Global</div>
                            <div class="event-span-text">
                                Select global events you wish to receive
                                for that channel.
                            </div>
                        </div>
                        <template>
                            <!-- //? GLOBAL EVENTS SEARCH DROPDOWN  -->

                            <div class="events-group span-header">
                                <div v-for="(item, key) in groupedEventlist[
                                    'global'
                                ]" :key="key.replace('_', ' ')" class="checkbox-element">
                                    <div class="event_version">
                                        <nitrozen-checkbox @change.self="
                                            checkmarkData(
                                                key,
                                                item,
                                                'global'
                                            )
                                        " class="check-item" :value="
    selectedEventName.includes(
        key + 'global'
    )
">
                                            <p class="event-text">
                                                {{ key.replace('_', ' ') }}
                                            </p>
                                            <a target="_blank" :href="
                                                baseDocUrl +
                                                key
                                                    .replace(/\s+/g, '-')
                                                    .toLowerCase() +
                                                (selectedVersionObject[
                                                    key + 'global'
                                                ] == undefined
                                                    ? ''
                                                    : '/#v' +
                                                    selectedVersionObject[
                                                    key +
                                                    'global'
                                                    ])
                                            " class="
                                                    password-icon
                                                    version-icon
                                                " v-html="linkIcon"></a>
                                        </nitrozen-checkbox>
                                        <div class="version-container">
                                            <div class="tooltip">
                                                <span class="
                                                        tooltiptext
                                                        tooltiptextlarge
                                                    ">The current selected
                                                    version is going to
                                                    deprecate, please select the
                                                    latest version</span>
                                                <a v-if="
                                                    item['versions']
                                                        .length >
                                                    selectedVersionObject[
                                                    key +
                                                    'global'
                                                    ] &&
                                                    selectedEventName.includes(
                                                        key + 'global'
                                                    )
                                                " class="alert-icon" v-html="alertIcon"></a>
                                            </div>
                                            <div class="tooltip">
                                                <span class="tooltiptext">Select an Event
                                                    version</span>
                                                <nitrozen-dropdown :disabled="
                                                    !selectedEventName.includes(
                                                        key + 'global'
                                                    )
                                                " class="version-dropdown" placeholder="Versions"
                                                    :items="item['versions']" v-model="
                                                        selectedVersionObject[
                                                        key + 'global'
                                                        ]
                                                    " @change="
    selectedVersion(
        $event,
        item,
        key + 'global'
    )
"></nitrozen-dropdown>
                                            </div>
                                        </div>
                                    </div>
                                    <nitrozen-dropdown :disabled="
                                        selectedVersionValue[
                                        key + 'global'
                                        ] == undefined ||
                                        !selectedEventName.includes(
                                            key + 'global'
                                        )
                                    " :items="
    item[
    selectedVersionObject[
    key + 'global'
    ]
    ]
" :id="key" v-model="
    eventsObj[
    key +
    'global' +
    selectedVersionObject[
    key + 'global'
    ]
    ]
" @change="eventTypeChange(item)" :searchable="false" label="Select Event Types" placeholder="Select Event Types"
                                        :multiple="true">
                                    </nitrozen-dropdown>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

.event-text {
    margin-right: 5px;
}

.version-icon {
    align-self: baseline;
}

.tooltip {
    position: relative;
    display: inline-block;
    align-self: center;
    margin-top: 8px;
}

.tooltip .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: 150%;
    left: 50%;
    margin-left: -60px;
}

.tooltip .tooltiptext::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
}

.tooltiptextlarge {
    width: 400px !important;
    bottom: 131% !important;
    margin-left: -203px !important;
}

.tooltip:hover .tooltiptext {
    visibility: visible;
}

.version-container {
    display: flex;
    margin-left: auto;
}

.alert-icon {
    align-self: center;
    margin-left: auto;
    margin-top: 7px;
}

::v-deep .version-dropdown>.nitrozen-select-wrapper>.nitrozen-select {
    .nitrozen-select__trigger {
        padding: 1px 14px;
        height: 30px;
    }

    .nitrozen-dropup {
        top: auto !important;
        bottom: 33px;
    }

    .nitrozen-options {
        .ripple {
            height: 30px;
            margin-right: 0;
        }

        top: -10px;
    }
}

::v-deep .version-dropdown>.nitrozen-select-wrapper>.nitrozen-select>.nitrozen-options>.nitrozen-option>.nitrozen-option-container {
    padding: 3px 14px;
}

.event_version {
    display: flex;
}

.version-dropdown {
    width: 70px;
    align-self: center;
    margin-left: 10px;
}

.add-another-link-icon {
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    line-height: 17px;
    color: #2e31be;
    cursor: pointer;
    font-size: 20px;
}

.header-container {
    border: 1px solid #e0e0e0;
    box-sizing: border-box;
    border-radius: 4px;
    padding-left: 4%;
    margin-top: 45px;
    padding-bottom: 15px;
    padding-right: 15px;
}

.add-another-link {
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 17px;
    color: #2e31be;
    cursor: pointer;
}

.remove-header {
    align-self: center;
    margin-top: 3%;
    cursor: pointer;
    border: 1px solid #828282;
    border-radius: 4px;
}

.header-input {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    margin-top: 20px;
}

.events-group::after {
    content: '';
    flex: 45%;
}

::v-deep .event-span>button {
    margin-right: 0;
}

::v-deep .filter-date>.nitrozen-dropdown-label {
    display: block;
}

.filter-date {
    margin-bottom: 20px;
    padding: 5px 5px 5px 0;
    padding-left: 0;
}

.selectedItems {
    gap: 10px;
    flex-wrap: wrap;
    display: flex;
}

.items-content {
    flex: 50%;
    font-size: 14px;
    margin-right: 10px;
}

.items {
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 0px 10px 0px 24px;
    font-size: 12px;
    position: static;
    height: 40px;
    background: #fafafa;
    border: 1px solid #e4e5e6;
    box-sizing: border-box;
    border-radius: 22px;
    flex: none;
    order: 4;
    flex-grow: 0;
}

.cross-icon {
    cursor: pointer;
}

.clear-section {
    cursor: pointer;
    align-self: center;
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    color: #2e31be;
    flex: none;
    order: 5;
    flex-grow: 0;
    margin: 0px 12px;
}

.event-content-main {
    margin-bottom: 8%;
}

.event-span-inner {
    font-size: 15px;
    margin-bottom: 10px;
    color: #41434c;
    -webkit-font-smoothing: antialiased;
    font-weight: 700;
}

.loader-icon {
    width: 25%;
    margin-left: 35%;
    margin-top: 5%;
}

.header-webhook-message {
    margin-bottom: 10px;
    text-align: center;
    font-family: Inter;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 25px;
    text-align: center;
    color: #333333;
}

::v-deep .whitelist-icon>svg {
    margin-top: 6px;
}

.whitelist-link {
    padding-right: 10px;
    color: blue;
    font-size: 12px;
}

.whitelist-span {
    display: flex;
    background: #e7eeff;
    border-radius: 4px;
    padding-left: 10px;
    height: 56px;
    align-items: center;
}

.whitelist {
    margin-left: 10px;
    font-size: 12px;
    line-height: 18px;
}

.event-info {
    display: flex;
    align-items: center;
}

::v-deep .nitrozen-dialog-footer {
    justify-content: center !important;
}

::v-deep .nitrozen-toggle-container .nitrozen-switch {
    margin: 0 10px 0 0;
}

.description-link {
    color: blue;
}

.webhook-clear-btn {
    font-family: Inter;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 21px;
    text-align: center;
    color: #2e31be;
}

.test-webhook-message {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 150%;
    text-align: center;
    color: #333333;
}

.header-block {
    text-align: center;
    margin: 40px 0 10px 0;
}

.header-text {
    font-family: Inter;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 25px;
    text-align: center;
    color: #333333;
}

.password-input {
    width: 50%;
    margin-top: 20px;

    .password-icon {
        float: right;
        margin-right: 7px;
        margin-top: -28px;
        position: relative;
        cursor: pointer;
        z-index: 2;
        height: 24px;
        width: 24px;
    }

    .password-icon-eye {
        margin-top: -28px;
        margin-right: 6px;
        float: left;
        margin-left: 45%;
    }

    .password-icon-eye-cancel {
        margin-top: -32px;
        margin-right: 7px;
        float: left;
        margin-left: 45%;
    }
}

.password-input-non-hmac {
    width: 50%;

    .password-icon {
        float: right;
        margin-right: 7px;
        margin-top: -28px;
        position: relative;
        cursor: pointer;
        z-index: 2;
        height: 24px;
        width: 24px;
    }

    .password-icon-eye-cancel {
        margin-top: -32px;
    }
}

.ort-tooltip {
    align-self: center;
}

.clear-btn {
    float: right;
    width: 20%;
    padding: 0;
    font-family: Inter;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 21px;
    text-align: center;
    color: #2e31be;
}

::v-deep .nitrozen-dropdown-container .nitrozen-select.disabled .nitrozen-select__trigger {
    background-color: #ffffff;
}

.event-type-dropdown {
    background: #ffffff;
    border: 1px solid #e0e0e0;
    box-sizing: border-box;
    border-radius: 4px;
}

.checkbox-element {
    flex: 45%;
    min-width: 20%;
    margin-bottom: 32px;
}

.alert {
    opacity: 0.7;
}

.event-span-text {
    font-size: 14px;
    margin: 5px 0 20px 0;
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 20px;
    color: #666666;
}

.auth-toggle {
    display: flex;
    padding: 15px 0 0 0;
}

::v-deep .nitrozen-tooltip-top {
    z-index: 100 !important;
    bottom: 100%;
    margin-left: -45px;
    line-height: 1.2;
}

.event-checkbox {
    border-bottom: 1px dotted #e0e0e0;
    margin-bottom: 10px;
}

.sort-tooltip {
    line-height: 1.4;
}

.toggle-text {
    font-size: 12px;
    font-weight: 700;
    color: @RoyalBlue;
    cursor: pointer;

    &.disabled {
        color: @DustyGray2;
    }
}

.toggle-text-auth-header {
    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 140%;
    color: #41434c;
}

.toggle-text-auth {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    color: #666666;
    align-self: end;
}

.event-grouping {
    margin-top: 20px;
}

.event-span {
    font-size: 18px;
    margin-bottom: 10px;
    color: #41434c;
    -webkit-font-smoothing: antialiased;
    font-weight: 700;
}

.section-content {
    height: auto;
}

.delete-staff {
    font-size: 24px;
}

.header-position {
    height: 58.5px;
}

.button-box {
    display: flex;
    align-items: center;

    .menu {
        margin-left: 24px;
    }
}

.event-grouping {
    margin-top: 20px;
}

.inline {
    display: flex;
}

.mt-md {
    margin-top: 24px;
}

.mt-sm {
    margin-top: 8px;
}

.mr24 {
    margin-right: 24px;
}

.toggle-switch {
    margin: 10px 10px;
}

::v-deep .n-input-label {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 17px;
    color: #9b9b9b;
}

.span-header {
    color: #9b9b9b;
    font-family: Inter, sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
}

.span-header-auth {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 17px;
    color: #9b9b9b;
}

.jumbotron-h {
    box-sizing: border-box;
    width: 100%;

    @media @mobile {
        min-height: initial;
    }
}

.test-webhook-btn {
    align-self: flex-start;
    background-color: #2e35be;
    color: white;
}

.main-container {
    justify-content: center;
    display: flex;
    margin: 24px;
    border-radius: 4px;

    @media @mobile {
        margin: 0px !important;
    }
}

.padding-right {
    padding-right: 30px;
}

.url-webhook {
    padding-bottom: 35px;
}

.width-full {
    width: 100%;
}

.inline-column {
    width: auto !important;
    display: flex;
    column-gap: 35px;
    border-radius: 3px;
    padding: 2% 0 2% 0;
    font-family: Inter, sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
}

.inline-test-webhook-column {
    display: flex;
    margin-top: 60px;
}

.width {
    width: 100%;
}

.events-group {
    display: flex;
    flex-wrap: wrap;
    column-gap: 21px;
}

.page-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 24px;
    background-color: #fff;
    border-radius: 4px;

    .copy {
        cursor: pointer;
    }

    @media @mobile {
        padding: 24px 24px 0px 24px;
    }
}

.webhook-settings-container-events {
    flex-wrap: wrap;
    padding: 30px 40px 25px 40px;
    margin: 0 0 40px 0;
    background-color: #fff;
    border-radius: 4px;

    .page-container {
        padding-bottom: 24px;
    }

    @media @mobile {
        width: 100%;
        margin-right: 0px;
    }

    .error {
        margin-bottom: 10px;
    }

    .logo-upload {
        margin-bottom: 10px;
    }

    .visibility-visible {
        display: block;
        visibility: visible;
    }

    .visibility-hidden {
        display: none;
        visibility: hidden;
    }
}

.webhook-settings-container {
    flex-wrap: wrap;
    padding: 30px 40px 25px 40px;
    margin: 0 0 40px 0;
    background-color: #fff;
    border-radius: 4px;

    .page-container {
        padding-bottom: 24px;
    }

    @media @mobile {
        width: 100%;
        margin-right: 0px;
    }

    .error {
        margin-bottom: 10px;
    }

    .logo-upload {
        margin-bottom: 10px;
    }

    .visibility-visible {
        display: block;
        visibility: visible;
    }

    .visibility-hidden {
        display: none;
        visibility: hidden;
    }
}

.sp-settings-container {
    width: 40%;

    @media @mobile {
        width: 100%;
        margin-bottom: 24px;
    }
}

.sub-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 35px;

    .bold-xs {
        font-size: 18px;
    }
}

.full-width {
    width: 66%;
    display: block;

    @media @mobile {
        flex-direction: column-reverse;
    }
}

.common-container {
    width: auto;
    padding: 0 24px 24px 24px;
    padding: 0 24px;
    display: flex;
    flex-direction: column;
}

::v-deep .password-input>div {
    width: 50%;
    margin-top: 20px;
}

.form-row {
    .input-container {
        display: flex;

        .nitrozen-form-input {
            flex-grow: 1;
        }

        nitrozen-button {
            margin-left: 15px;
        }

        .svg {
            margin-left: 5px;
        }
    }
}

.tooltip-div {
    text-align: left;
    padding: 5px;
}

.tooltip-content {
    margin-bottom: 4px;
}

.no-role-container {
    display: flex;
}

.refresh-icon {
    margin: 0px 10px;
    cursor: pointer;
}

.check-item {
    margin: 20px 5px 20px 0;
    min-width: 50%;
    color: #9b9b9b;
    font-family: Inter, sans-serif;
    font-weight: 500;
    font-size: 13px;
    line-height: 5px;
}

::v-deep .nitrozen-dropdown-label {
    display: none;
}

.mb15 {
    margin: 15px 0;
}

.event-type {
    display: flex;
}

::v-deep .ripple {
    margin-right: 15px;
}

.test-webhook-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 10px;
}

@media (max-width: 1320px) {
    .password-input {
        .password-icon-eye {
            margin-left: 44%;
        }

        .password-icon-eye-cancel {
            margin-left: 44%;
        }
    }

    .clear-btn {
        width: 25%;
        padding: 0;
    }

    .checkbox-element {
        width: 42%;
    }

    .whitelist {
        margin-left: 10px;
        width: 76%;
    }
}

@media (max-width: 1491px) {
    .whitelist-icon {
        margin-bottom: 18px;
    }
}
</style>

<script>
import pageerror from '@/components/common/adm-no-content';
import inlinesvg from './../../components/common/ukt-inline-svg.vue';
import { GET_HELP_SECTION_DATA } from '@/store/getters.type';
import loader from '@/components/common/loader.vue';
import mirageimageuploader from '@/components/common/image-uploader/index.vue';
import admInlineSvg from '@/components/common/adm-inline-svg.vue';
import admpageheader from '@/components/common/layout/page-header';
import path from 'path';
import root from 'window-or-global';
import svg from '@/auto_gen/admin-svgs.js';
import admjumbotron from '@/components/common/jumbotron';
// import AdminSellerService from '../../services/admin/admin-seller.service';
// import {
//     getAppInfo,
//     getCompInfo,
//     getUrlWithCompanyId,
// } from '@/services/utils.service';
import {
    NitrozenButton,
    flatBtn,
    NitrozenInput,
    NitrozenDropdown,
    NitrozenError,
    strokeBtn,
    NitrozenCheckBox,
    NitrozenToggleBtn,
    NitrozenDialog,
    NitrozenTooltip,
} from '@gofynd/nitrozen-vue';
import { mapGetters } from 'vuex';
import AdminWebhookService from '../../services/admin-webhook.service';
const env = root.env || {};
export default {
    name: 'edit-webhooks',
    components: {
        'page-error': pageerror,
        'inline-svg': inlinesvg,
        'mirage-image-uploader': mirageimageuploader,
        'adm-jumbotron': admjumbotron,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-toggle': NitrozenToggleBtn,
        'nitrozen-error': NitrozenError,
        'adm-inline-svg': admInlineSvg,
        'adm-page-header': admpageheader,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-tooltip': NitrozenTooltip,
        loader: loader,
    },
    props: {
        initialState: {
            type: Boolean,
            default: false,
        },
        title: {},
        titleClass: {},
        active: {
            type: Boolean,
            default: false,
        },
        titleImage: {
            type: String,
        },
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    active: {
        type: Boolean,
        default: false,
    },
    computed: {
        ...mapGetters({
            helpData: GET_HELP_SECTION_DATA,
        }),
        isFormValid() {
            this.checkFormValidity();
            return (
                this.webhookUrl.length > 0 &&
                this.alertEmail.length > 0 &&
                this.name.length > 0
            );
        },
        hasUrl() {
            return this.webhookUrl.length > 0 && validateUrl();
        },
        validateEmail() {
            const pattern =
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return !pattern.test(this.alertEmail) && this.emailTriggeredStatus;
        },
        validateUrl() {
            const pattern = new RegExp(
                '^(https?:\\/\\/)?' +
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
                '((\\d{1,3}\\.){3}\\d{1,3}))' +
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
                '(\\?[;&a-z\\d%_.~+=-]*)?' +
                '(\\#[-a-z\\d_]*)?$',
                'i'
            );
            return (
                !pattern.test(this.webhookUrl) &&
                this.urlTriggeredStatus &&
                this.webhookUrl.length > 0
            );
        },
    },
    data() {
        return {
            pageError: false,
            pageLoading: false,
            authStatus: false,
            companyId: this.$route.params.company_id,
            webhookUrl: '',
            username: '',
            password: '',
            saveButtonClicked: false,
            eventsList: [],
            eventsObj: {},
            events: [],
            name: '',
            checkEventValidity: false,
            inputType: 'password',
            emailTriggeredStatus: false,
            selectedEventName: [],
            startLoader: false,
            urlTriggeredStatus: false,
            checkFormValidation: false,
            testSuccess: false,
            isOrganisationUser: [],
            contextMenuItems: [
                {
                    text: 'Remove',
                    action: 'remove',
                },
            ],
            alertEmail: '',
            requestStatus: true,
            toggleStatus: 'Enabled',
            selectedProvider: 0,
            assignRolesManually: false,
            toggleValue: { type: Boolean, default: false },
            groupedEventlist: '',
            baseDocUrl:
                env.SEARCHLIGHT_MAIN_DOMAIN +
                '/docs/company-settings/webhook/webhook-events/',
            docUrl:
                env.SEARCHLIGHT_MAIN_DOMAIN +
                '/docs/company-settings/webhook/webhook',
            dialogInfo: '',
            id: this.$route.params.id,
            dialogMessage: '',
            testDialogInfo: '',
            disableToggle: false,
            linkIcon: svg['webhook-link'],
            whiteListIcon: svg['webhook-warning'],
            testDialogMessage: '',
            visibility: {
                makeVisible: 'password-eye',
                makeInvisible: 'password-eye-cancel',
            },
            currentVisibility: null,
            testWebhookIcon: null,
            eventSelected: false,
            actualApplications: [],
            applications: [],
            applicationSelected: [],
            selectedApplications: [],
            passwordValidation: false,
            customHeaderToggle: false,
            deleteIcon: svg['delete'],
            headers: [{ key: '', value: '' }],
            headersCount: 0,
            hideAddHeaderButton: false,
            statusValue: 'inactive',
            alertIcon: svg['alert-icon'],
            selectedVersionValue: {},
            selectedVersionObject: {},
            specialChar: false
        };
    },
    mounted() {
        this.loadApplications();
        this.currentVisibility = this.visibility.makeVisible;
        this.eyeIcon = svg[this.currentVisibility];
    },
    methods: {
        selectedVersion(event, item, key) {
            this.selectedVersionValue[key] = event;
            this.selectedVersionObject = _.omit(
                this.selectedVersionObject,
                key
            );
            this.selectedVersionObject[key] = event;
            this.eventsObj[key + event] = [];
            let versionKeys = [];
            Object.keys(this.eventsObj).forEach((elem) => {
                if (elem.indexOf(key) > -1) {
                    versionKeys.push(elem);
                }
            });
            versionKeys.forEach((elem) => {
                if (elem != key + event) {
                    this.eventsObj[elem] = [];
                }
            });
            item[event].forEach((elem) => {
                this.eventsObj[key + event].push(elem.id);
            });
            this.checkFormValidity();
        },
        validateKey() {
            let isValid = true;
            const format = /[!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]+/;
            let headerKeys = [];
            let emptyKeyPresent = false;
            let previousEntryValid = true;
            this.headers.forEach((element) => {
                element.key = element.key.replace(/ /g, "");
                element.value = element.value.trim();
                if (format.test(element.key)) {
                    this.dialogInfo = 'ERROR';
                    this.dialogMessage =
                        'Header key cannot have special character';
                    this.openDialog(false);
                    isValid = false;
                }
                if (element.key == '' || element.value == '') {
                    this.dialogInfo = 'ERROR';
                    this.dialogMessage = 'Cannot put empty headers';
                    this.openDialog(false);
                    isValid = false;
                }
                if (headerKeys.includes(element.key)) {
                    this.dialogInfo = 'ERROR';
                    this.dialogMessage = 'Keys cannot have same name';
                    this.openDialog(false);
                    isValid = false;
                } else {
                    headerKeys.push(element.key);
                }
            });
            return isValid;
        },
        addHeader() {
            if (this.headers.length > 4) {
                this.dialogInfo = 'ERROR';
                this.dialogMessage = 'Max limit of adding header is 5';
                this.openDialog(false);
            } else {
                if (!this.validateKey()) {
                    return;
                }
                this.$set(this.headers, this.headers.length, {
                    key: '',
                    value: '',
                });
            }
            if (this.headers.length == 5) {
                this.hideAddHeaderButton = true;
            }
        },
        removeHeader(id) {
            if (this.headers.length - 1 > 0) {
                this.$delete(this.headers, id);
            } else {
                this.customHeaderToggle = false;
                this.$delete(this.headers, id);
            }
            if (this.headers.length < 5) {
                this.hideAddHeaderButton = false;
            }
        },
        customHeaderToggleChange(event) {
            this.customHeaderToggle = false;
        },
        docRedirect() {
            window.open(this.docUrl, '_blank');
        },
        toggleChange(event) {
            this.passwordValidation = false;
        },
        searchApplication(event) {
            const event_text = event.text.toLowerCase();
            this.applications = this.actualApplications.filter((item) => {
                const item_text = item.text.toLowerCase();
                if (item_text.includes(event_text)) {
                    return item;
                }
            });
        },
        loadApplications() {
            // AdminSellerService.fetchApplicationList({
            //     company_id: getCompInfo(),
            //     page_no: 1,
            //     page_size: 100,
            //     query: { is_active: true },
            // }).then((res) => {
            //     let items = res.data.items;
            //     items.forEach((elem) => {
            //         this.applications.push({ text: elem.name, value: elem.id });
            //         this.actualApplications.push({
            //             text: elem.name,
            //             value: elem.id,
            //         });
            //     });
            this.getWebhookSubscriberById();
            // });
        },
        deleteItem(itemName) {
            if (itemName == 'all') {
                this.applicationSelected = [];
                this.selectedApplications = [];
            } else {
                let index = this.applicationSelected.indexOf(itemName);
                if (index !== -1) {
                    this.applicationSelected.splice(index, 1);
                }

                this.selectedApplications = this.selectedApplications.filter(
                    (elem) => {
                        return elem.value != itemName;
                    }
                );
            }
            if (this.applicationSelected.length == 0) {
                Object.keys(this.groupedEventlist['application']).forEach(
                    (key) => {
                        let events = {};
                        Object.keys(this.eventsObj).forEach((item) => {
                            if (!item.includes('application')) {
                                events[item] = this.eventsObj[item];
                            }
                        });
                        this.eventsObj = events;
                        let index = this.selectedEventName.indexOf(
                            key + 'application'
                        );
                        if (index !== -1) {
                            this.selectedEventName.splice(index, 1);
                        }
                    }
                );
            }
            this.checkFormValidity();
        },
        selectedApplication() {
            this.selectedApplications = [];
            this.applicationSelected.forEach((item) => {
                this.applications.forEach((elem) => {
                    if (item == elem.value) {
                        this.selectedApplications.push(elem);
                    }
                });
            });
        },
        eventDoc() { },
        selectedEventsDropdown(items) {
            return [];
        },
        toggleView() {
            if (this.inputType === 'password') {
                this.inputType = 'text';
                this.currentVisibility = this.visibility.makeInvisible;
            } else {
                this.inputType = 'password';
                this.currentVisibility = this.visibility.makeVisible;
            }
            this.eyeIcon = svg[this.currentVisibility];
        },
        clear() {
            this.eventsObj = {};
            this.selectedEventName = [];
            this.eventsList = [];
            this.applicationSelected = [];
            this.selectedApplications = [];
        },
        eventTypeChange(event_type) {
            this.checkFormValidity();
        },
        urlTriggered() {
            this.urlTriggeredStatus = true;
        },
        emailTriggered() {
            this.emailTriggeredStatus = true;
        },
        checkmarkData(event, items, type) {
            this.selectedVersionValue[event + type];
            if (!this.selectedEventName.includes(event + type)) {
                this.selectedEventName.push(event + type);
                this.eventsObj[
                    event + type + this.selectedVersionObject[event + type]
                ] = [];
                let version = Object.keys(items);
                let maxVersion = version[version.length - 2];
                this.selectedVersionObject[event + type] = maxVersion;
                this.selectedVersion(maxVersion, items, event + type);
            } else {
                this.selectedEventName = this.selectedEventName.filter(
                    function (value) {
                        return value != event + type;
                    }
                );
                this.eventsObj[
                    event + type + this.selectedVersionObject[event + type]
                ] = [];
            }
            this.checkFormValidity();
        },
        checkFormValidity() {
            let eventLength = 0;
            Object.keys(this.eventsObj).forEach((key) => {
                eventLength = eventLength + this.eventsObj[key].length;
            });
            if (eventLength > 0) {
                this.eventSelected = true;
            } else {
                this.eventSelected = false;
            }
            this.checkFormValidation =
                this.webhookUrl.length > 0 &&
                eventLength > 0 &&
                this.alertEmail.length > 0 &&
                this.name.length > 0;
        },
        enableButton(){
            this.saveButtonClicked=false;
        },
        save() {
            let isValid = true;
            let headerKeys = [];
            let headers = {};
            this.saveButtonClicked = true;
            if (this.customHeaderToggle) {
                if (!this.validateKey()) {
                    this.saveButtonClicked = false;
                    return;
                }
                this.headers.forEach((element) => {
                    if (element.key != '' && element.value != '') {
                        headers[element.key] = element.value;
                    }
                });
            }
            if (this.authStatus == true && this.password.length == 0) {
                this.passwordValidation = true;
                this.saveButtonClicked = false;
                return;
            }
            this.startLoader = true;
            let authentication = {};
            if (
                this.password.length > 0 &&
                this.authStatus &&
                this.disableToggle
            ) {
                authentication = {
                    type: 'hmac',
                    secret: this.password,
                };
            }
            if (
                this.password.length > 0 &&
                this.authStatus &&
                !this.disableToggle
            ) {
                authentication = {
                    type: 'basic',
                    username: this.username,
                    password: this.password,
                };
            }
            let events = [];
            Object.keys(this.eventsObj).forEach((key) => {
                events = events.concat(this.eventsObj[key]);
            });
            let association = {};
            if (this.applicationSelected.length > 0) {
                association['application_id'] = this.applicationSelected;
                association['criteria'] = 'SPECIFIC-EVENTS';
            }

            if (this.applicationSelected.length == 0) {
                association['application_id'] = [];
                association['criteria'] = 'EMPTY';
            }
            if (this.statusValue != 'blocked') {
                this.statusValue = 'inactive';
            }
            var request = {
                id: this.id,
                name: this.name,
                webhook_url: this.webhookUrl,
                association: association,
                status: this.requestStatus ? 'active' : this.statusValue,
                auth_meta: authentication,
                email_id: this.alertEmail,
                event_id: events,
                custom_headers: headers,
            };
            AdminWebhookService.updateSubscriber(request)
                .then((res) => {
                    this.dialogInfo = 'Success';
                    this.dialogMessage = 'Webhook updated successfully';
                    this.startLoader = false;
                    this.openDialog(true);
                })
                .catch((err) => {
                    this.dialogInfo = 'ERROR';
                    this.dialogMessage =
                        err.response.data.err[0].msg.toString();
                    this.startLoader = false;
                    this.openDialog(false);
                    this.saveButtonClicked = false;
                });
        },
        onCancel() {
            let historyLength = window.history.length;
            if (historyLength > 2) {
                this.$router.go(-1);
            } else {
                this.$router
                    .push(`webhook`)
                    .catch(() => { });
            }
        },
        testWebhook() {
            let headers = {};
            if (this.customHeaderToggle) {
                this.headers.forEach((element) => {
                    if (element.key != '' && element.value != '') {

                        headers[element.key] = element.value;
                    }
                });
            }
            if (this.authStatus == true && this.password.length == 0) {
                this.passwordValidation = true;
                return;
            }
            this.testSuccess = false;
            this.openTestDialog();
            let authentication = {};
            if (this.password.length > 0 && this.authStatus) {
                authentication = {
                    type: 'hmac',
                    secret: this.password,
                };
            }
            let request = {
                webhook_url: this.webhookUrl,
                auth_meta: authentication,
                custom_headers: headers,
            };
            AdminWebhookService.pingUrl(request)
                .then((res) => {
                    if (res.data.status == 'SUCCESS') {
                        this.testDialogInfo = res.data.status;
                        this.testDialogMessage =
                            'Your Webhook URL is working successfully';
                        this.requestStatus = true;
                        this.testWebhookIcon = svg['webhook-report-issue'];
                    } else {
                        this.testDialogInfo = res.data.status;
                        this.testDialogMessage =
                            'Your Webhook URL is not working correctly, please check if it’s a valid Webhook URL that is capable of receiving a payload.';
                        this.requestStatus = false;
                        this.testWebhookIcon = svg['webhook-report-issue'];
                    }
                    this.closeTestDialog();
                    this.testSuccess = true;
                    this.openTestDialog();
                })
                .catch((err) => {
                    this.testDialogInfo = 'ERROR';
                    this.testDialogMessage =
                        'Your Webhook URL is not working correctly, please check if it’s a valid Webhook URL that is capable of receiving a payload.';
                    this.startLoader = false;
                    this.requestStatus = false;
                    this.testWebhookIcon = svg['webhook-report-issue'];
                    this.closeTestDialog();
                    this.testSuccess = true;
                    this.openTestDialog();
                });
        },
        getWebhookSubscriberById() {
            this.startLoader = true;
            AdminWebhookService.getWebhookSubscriberById(this.id)
                .then((res) => {
                    let response = res.data;
                    if (
                        response.hasOwnProperty('custom_headers') &&
                        response.custom_headers
                    ) {
                        let custom_headers = response.custom_headers;
                        if (Object.keys(custom_headers).length != 0) {
                            this.headers = [];
                            for (let key of Object.keys(custom_headers)) {
                                let objectHeader = {};
                                objectHeader['key'] = key;
                                objectHeader['value'] = custom_headers[key];
                                this.$set(
                                    this.headers,
                                    this.headers.length,
                                    objectHeader
                                );
                            }
                            this.customHeaderToggle = true;
                        }
                        if (this.headers.length == 5) {
                            this.hideAddHeaderButton = true;
                        }
                    }
                    if (response.association.application_id) {
                        if (response.association.criteria == 'ALL') {
                            this.applications.forEach((item) => {
                                this.applicationSelected.push(item.value);
                            });
                        } else {
                            this.applicationSelected =
                                response.association.application_id;
                        }
                    } else {
                        this.applicationSelected = [];
                    }
                    this.selectedApplication();
                    this.name = response.name;
                    this.webhookUrl = response.webhook_url;
                    this.id = response.id;
                    if (Object.keys(response.auth_meta).length > 0) {
                        this.username =
                            response.auth_meta.type == 'basic'
                                ? response.auth_meta.username
                                : '';
                        this.password =
                            response.auth_meta.type == 'hmac'
                                ? response.auth_meta.secret
                                : response.auth_meta.password;
                        if (this.password.length > 0) {
                            this.authStatus = true;
                        }
                        if (response.auth_meta.type == 'hmac') {
                            this.disableToggle = true;
                        }
                    } else {
                        this.password = '';
                        this.disableToggle = true;
                    }
                    this.alertEmail = response.email_id;
                    this.requestStatus = response.status == 'active';
                    this.statusValue = response.status;
                    AdminWebhookService.getEventList()
                        .then((resp) => {
                            let eventlist = resp.data.event_configs;
                            eventlist.map((element) => {
                                response.event_configs.forEach((item) => {
                                    if (
                                        element.event_name == item.event_name &&
                                        element.event_type == item.event_type &&
                                        element.event_category ==
                                        item.event_category &&
                                        element.version == item.version
                                    ) {
                                        const words =
                                            item.display_name.split('-');
                                        for (let i = 0; i < words.length; i++) {
                                            words[i] =
                                                words[i][0].toUpperCase() +
                                                words[i].substr(1);
                                        }
                                        let keyName =
                                            words.join(' ') +
                                            element.event_category;
                                        this.selectedVersionObject[keyName] =
                                            item.version;
                                        this.selectedVersionValue[keyName] =
                                            item.version;
                                        if (
                                            !this.selectedEventName.includes(
                                                keyName
                                            )
                                        ) {
                                            this.selectedEventName.push(
                                                keyName
                                            );
                                        }
                                        if (
                                            this.eventsObj[
                                            keyName + item.version
                                            ] == undefined
                                        ) {
                                            this.eventsObj[
                                                keyName + item.version
                                            ] = [];
                                        }
                                        element.isActive = true;
                                        if (
                                            !this.eventsObj[
                                                keyName + item.version
                                            ].includes(element.id)
                                        ) {
                                            this.eventsObj[
                                                keyName + item.version
                                            ].push(element.id);
                                        }
                                    }
                                });
                                const words = element.display_name.split('-');
                                for (let i = 0; i < words.length; i++) {
                                    words[i] =
                                        words[i][0].toUpperCase() +
                                        words[i].substr(1);
                                }
                                element['value'] = element.id;
                                element['display_name'] = words.join(' ');
                                element['event_type'] =
                                    element.event_type.charAt(0).toUpperCase() +
                                    element.event_type.slice(1);
                                element['text'] = element.event_type;
                                return element;
                            });
                            let groupEventBasedOnType = _.mapValues(
                                _.groupBy(eventlist, 'event_category'),
                                (clist) =>
                                    clist.map((event) =>
                                        _.omit(event, 'event_category')
                                    )
                            );
                            let groupEvent = {};
                            groupEvent['application'] = _.mapValues(
                                _.groupBy(
                                    groupEventBasedOnType['application'],
                                    'display_name'
                                ),
                                (clist) =>
                                    clist.map((event) =>
                                        _.omit(event, 'display_name')
                                    )
                            );
                            groupEvent['company'] = _.mapValues(
                                _.groupBy(
                                    groupEventBasedOnType['company'],
                                    'display_name'
                                ),
                                (clist) =>
                                    clist.map((event) =>
                                        _.omit(event, 'display_name')
                                    )
                            );
                            //? global events
                            groupEvent['global'] = _.mapValues(
                                _.groupBy(
                                    groupEventBasedOnType['global'],
                                    'display_name'
                                ),
                                (clist) =>
                                    clist.map((event) => _.omit(event, 'display_name'))
                            );
                            let groupEventConf = {};
                            let applicationArrayGroup = {};
                            let countApplication = 0;
                            Object.keys(groupEvent['application']).map(
                                (elem, index) => {
                                    applicationArrayGroup[elem] = _.mapValues(
                                        _.groupBy(
                                            groupEvent['application'][elem],
                                            'version'
                                        ),
                                        (clist) =>
                                            clist.map((event) =>
                                                _.omit(event, 'version')
                                            )
                                    );
                                    let applicationArrayGroupKeys = [];
                                    Object.keys(
                                        applicationArrayGroup[elem]
                                    ).map((item) => {
                                        applicationArrayGroupKeys.push({
                                            text: 'V' + item,
                                            value: item,
                                        });
                                        if (
                                            this.selectedVersionObject[
                                            elem + 'application'
                                            ] == undefined ||
                                            countApplication > 0
                                        ) {
                                            countApplication =
                                                countApplication + 1;
                                            this.selectedVersionObject[
                                                elem + 'application'
                                            ] = item;
                                        }
                                    });
                                    applicationArrayGroup[elem]['versions'] =
                                        applicationArrayGroupKeys;
                                }
                            );
                            let companyArrayGroup = {};

                            Object.keys(groupEvent['company']).map(
                                (elem, index) => {
                                    companyArrayGroup[elem] = _.mapValues(
                                        _.groupBy(
                                            groupEvent['company'][elem],
                                            'version'
                                        ),
                                        (clist) =>
                                            clist.map((event) =>
                                                _.omit(event, 'version')
                                            )
                                    );
                                    let companyArrayGroupKeys = [];
                                    let countCompany = 0;
                                    Object.keys(companyArrayGroup[elem]).map(
                                        (item) => {
                                            companyArrayGroupKeys.push({
                                                text: 'V' + item,
                                                value: item,
                                            });
                                            if (
                                                this.selectedVersionObject[
                                                elem + 'company'
                                                ] == undefined ||
                                                countCompany > 0
                                            ) {
                                                countCompany = countCompany + 1;
                                                this.selectedVersionObject[
                                                    elem + 'company'
                                                ] = item;
                                            }
                                        }
                                    );
                                    companyArrayGroup[elem]['versions'] =
                                        companyArrayGroupKeys;
                                }
                            );
                            //? global events
                            let globalArrayGroup = {};
                            Object.keys(groupEvent['global']).map((elem, index) => {
                                globalArrayGroup[elem] = _.mapValues(
                                    _.groupBy(groupEvent['global'][elem], 'version'),
                                    (clist) =>
                                        clist.map((event) => _.omit(event, 'version'))
                                );
                                let globalArrayGroupKeys = [];
                                Object.keys(globalArrayGroup[elem]).map((item) => {
                                    globalArrayGroupKeys.push({
                                        text: 'V' + item,
                                        value: item,
                                    });
                                    this.selectedVersionObject[elem + 'global'] = item;
                                });
                                globalArrayGroup[elem]['versions'] =
                                    globalArrayGroupKeys;
                            });
                            groupEventConf['application'] =
                                applicationArrayGroup;
                            groupEventConf['company'] = companyArrayGroup;
                            groupEventConf['global'] = globalArrayGroup;
                            this.groupedEventlist = groupEventConf;
                            this.checkFormValidity();
                        })
                        .catch((err) => {
                            this.dialogInfo = 'ERROR';
                            this.dialogMessage = err.toString();
                            this.openDialog(false);
                            console.log(err, 'error');
                        });
                    this.startLoader = false;
                })
                .catch((err) => {
                    this.dialogInfo = 'ERROR';
                    this.dialogMessage = err.toString();
                    this.openDialog(false);
                    this.startLoader = false;
                    console.log(err, 'error');
                });
        },
        showError(err) {
            const { message } = err && err.response && err.response.data;
            if (this.$snackbar) {
                this.$snackbar.global.showError(
                    message || 'Something went wrong'
                );
            }
        },
        openDialog(route) {
            if (this.dialogInfo == 'ERROR') {
                this.$snackbar.global.showError(this.dialogMessage, 1000);
            } else {
                this.$snackbar.global.showInfo(this.dialogMessage, 1000);
                if (route) {
                    let historyLength = window.history.length;
                    if (historyLength > 2) {
                        this.$router.go(-1);
                    } else {
                        this.$router
                            .push(`webhook`)
                            .catch(() => { });
                    }
                }
            }
        },
        openTestDialog: function () {
            this.$refs['test_status_dialog'].open({
                width: '384px',
                showCloseButton: true,
                dismissible: true,
            });
        },
        closeTestDialog: function () {
            this.$refs['test_status_dialog'].close();
        },
        checkSpecialChar(e) {
            if (/^\W$/.test(e.key) && (e.key === ',' || e.key === "\"")) {
                e.preventDefault();
                this.specialChar = true;
            } else {
                this.specialChar = false;
            }
        },
    },
};
</script>
