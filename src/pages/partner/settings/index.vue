<template>
  <div class="panel">
    <div class="header-position" v-if="editMode">
      <page-header
        class="header"
        :showBackButton="false"
        title="Organization Setting"
      >
        <div class="button-box">
          <nitrozen-button :theme="'secondary'" v-flatBtn @click="submitForm">
            Save
          </nitrozen-button>
        </div>
      </page-header>
    </div>
    <loader class="loading" v-if="loading"></loader>
    <div class="content-container">
      <div class="left-column">
        <section>
          <label class="bold-xs cl-Mako">Basic Details</label>
          <nitrozen-input
            v-model="form.name.value"
            :label="form.name.label"
            :required="form.name.required"
            placeholder="Enter name"
            :maxlength="form.name.maxLength"
          ></nitrozen-input>
          <nitrozen-error v-if="form.name.showerror && !form.name.value">
            {{ form.name.errortext }}
          </nitrozen-error>
          <nitrozen-input
            v-model="form.details.value"
            type="textarea"
            :label="form.details.label"
            placeholder="Enter details"
          ></nitrozen-input>
          <nitrozen-error v-if="form.details.showerror && !form.details.value">
            {{ form.details.errortext }}
          </nitrozen-error>
        </section>

        <section>
          <label class="bold-xs cl-Mako"> Address </label
          ><nitrozen-input
            :label="form.business.address.address.label"
            v-model="form.business.address.address.value"
            placeholder="Enter Address"
          ></nitrozen-input>
          <nitrozen-error
            v-if="
              form.business.address.address.showerror &&
                !form.business.address.address.value
            "
          >
            {{ form.business.address.address.errortext }}
          </nitrozen-error>

          <nitrozen-input
            :label="form.business.address.area.label"
            v-model="form.business.address.area.value"
            placeholder="Enter Area"
          ></nitrozen-input>
          <nitrozen-error
            v-if="
              form.business.address.area.showerror &&
                !form.business.address.area.value
            "
          >
            {{ form.business.address.area.errortext }}
          </nitrozen-error>

          <nitrozen-input
            :label="form.business.address.landmark.label"
            placeholder="Enter landmark"
            v-model="form.business.address.landmark.value"
          ></nitrozen-input>
          <nitrozen-error
            v-if="
              form.business.address.landmark.showerror &&
                !form.business.address.landmark.value
            "
          >
            {{ form.business.address.landmark.errortext }}
          </nitrozen-error>

          <nitrozen-input
            :label="form.business.address.area_code.label"
            v-model="form.business.address.area_code.value"
            :maxlength="10"
            placeholder="Enter ZIP/ Postal code"
            @input="() => {}"
            class="pincode-div"
          ></nitrozen-input>
          <nitrozen-error
            v-if="
              form.business.address.area_code.showerror &&
                !form.business.address.area_code.value
            "
          >
            {{ form.business.address.area_code.errortext }}
          </nitrozen-error>
          <div class="info-map">
            <nitrozen-input
              :label="form.business.address.city.label"
              placeholder="Enter city"
              v-model="form.business.address.city.value"
              class="city-div"
            ></nitrozen-input>
            <nitrozen-error
              v-if="
                form.business.address.city.showerror &&
                  !form.business.address.city.value
              "
            >
              {{ form.business.address.city.errortext }}
            </nitrozen-error>

            <nitrozen-input
              :label="form.business.address.state.label"
              placeholder="Enter state"
              v-model="form.business.address.state.value"
              class="city-div"
            ></nitrozen-input>
            <nitrozen-error
              v-if="
                form.business.address.state.showerror &&
                  !form.business.address.state.value
              "
            >
              {{ form.business.address.state.errortext }}
            </nitrozen-error>

            <nitrozen-input
              :label="form.business.address.country.label"
              placeholder="Enter country/region"
              v-model="form.business.address.country.value"
            ></nitrozen-input>
            <nitrozen-error
              v-if="
                form.business.address.country.showerror &&
                  !form.business.address.country.value
              "
            >
              {{ form.business.address.country.errortext }}
            </nitrozen-error>
          </div>
        </section>
      </div>

      <div class="right-column">
        <section>
          <label class="bold-xs cl-Mako">Business Details</label>
          <nitrozen-input
            v-model="form.business.pan_card.value"
            :label="form.business.pan_card.label"
            placeholder="Enter PAN card number"
          ></nitrozen-input>
          <nitrozen-error v-if="form.business.pan_card.showerror">
            {{ form.business.pan_card.errortext }}
          </nitrozen-error>
          <nitrozen-input
            v-model="form.business.gstin.value"
            :label="form.business.gstin.label"
            placeholder="Enter GSTIN"
          ></nitrozen-input>
          <nitrozen-error v-if="form.business.gstin.showerror">
            {{ form.business.gstin.errortext }}
          </nitrozen-error>
        </section>

        <section>
          <label class="bold-xs cl-Mako">Contact Details</label>
          <nitrozen-input
            v-model="form.business.emails[0].email.value"
            type="email"
            :label="form.business.emails[0].email.label"
            placeholder="Enter business email"
          ></nitrozen-input>
          <nitrozen-error
            v-if="
              form.business.emails[0].email.showerror &&
                !form.business.emails[0].email.value
            "
          >
            {{ form.business.emails[0].email.errortext }}
          </nitrozen-error>
          <label class="n-input-label nitrozen-form-input">{{
            form.business.phoneNumbers[0].phone.label
          }}</label>
          <vue-tel-input
            class="phone-input-text regular-xs"
            defaultCountry="India"
            :enabledCountryCode="true"
            :onlyCountries="['IN']"
            :required="true"
            autocomplete="off"
            @input="checkValidPhoneNumber"
            :value="form.business.phoneNumbers[0].phone.value"
          ></vue-tel-input>
          <nitrozen-error v-if="form.business.phoneNumbers[0].phone.showerror">
            {{ form.business.phoneNumbers[0].phone.errortext }}
          </nitrozen-error>
          <nitrozen-input
            v-model="form.business.website.value"
            :label="form.business.website.label"
            placeholder="Enter business website"
          ></nitrozen-input>
          <nitrozen-error
            v-if="
              form.business.website.showerror && !form.business.website.value
            "
          >
            {{ form.business.website.errortext }}
          </nitrozen-error>
        </section>
        <section>
          <label class="bold-xs cl-Mako">Social Accounts </label>
          <div
            v-for="(social, name, index) in form.business.social_meta"
            :key="index"
            class="social-links"
          >
            <div class="social-link">
              <!-- <inline-svg :src="name" /> -->
              <img
                :src="`/public/assets/svgs/social/${name}.svg`"
                class="sl-icon"
              />
              <span class="sl-text bold-xs">{{ social.title }}</span>
              <nitrozen-input
                type="url"
                v-model="social.value"
                :placeholder="`Enter ${name} profile link`"
              ></nitrozen-input>
            </div>
          </div>
        </section>

        <section v-if="!editMode">
          <label class="bold-xs cl-Mako"> Other information</label>
          <label class="n-input-label checkbox-label">
            {{ form.meta.ecomm_platform_used.label }}
          </label>
          <nitrozen-checkbox
            class="checkbox-item"
            v-for="(chk, chkid) in form.meta.ecomm_platform_used.enums"
            :checkboxValue="chk.value"
            v-model="form.meta.ecomm_platform_used.value"
            @input="() => {}"
            :key="`${form.meta.ecomm_platform_used.label}-${chkid}`"
          >
            {{ chk.display }}
          </nitrozen-checkbox>

          <label class="n-input-label checkbox-label">
            {{ form.meta.goals.label }}
          </label>
          <nitrozen-checkbox
            class="checkbox-item"
            v-for="(chk, chkid) in form.meta.goals.enums"
            :checkboxValue="chk.value"
            v-model="form.meta.goals.value"
            @input="() => {}"
            :key="`${form.meta.goals.label}-${chkid}`"
          >
            {{ chk.display }}
          </nitrozen-checkbox>
        </section>
      </div>
    </div>
    <!-- <div class="page-container" v-if="true">
      <div class="organization-setting">
        <label class="cl-Mako bold-lg">Account Information</label>
        <form-gen :formjson="form" :errors="errors"></form-gen>
        <div class="sbmit"></div>
      </div>
    </div> -->
  </div>
</template>

<style lang="less" scoped>
.header-position {
  height: 58.5px;
}
.content-container {
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  flex-wrap: wrap;
  .left-column,
  .right-column {
    flex: 1;
  }
  section {
    margin: 24px 12px;
    padding: 24px;
    background-color: #fff;
    border-radius: @BorderRadius;
    min-width: 400px;
    flex: 0.5;

    .nitrozen-form-input {
      margin-top: 12px;
      flex: 1;
    }
    .phone-input-text {
      padding: 4px 0px 2px 0px;
      background-color: @White;
      border: 1px solid @LightGray;
      border-radius: @BorderRadius;
      box-shadow: none !important;
      ::v-deep input {
        color: @Mako;
        font-weight: 300;
        &:focus {
          outline: 0 none;
          box-shadow: none;
          -webkit-box-shadow: none;
        }
      }

      ::v-deep ul {
        visibility: hidden;
      }
    }

    .social-links {
      .social-link {
        display: flex;
        align-items: center;
        margin-top: 12px;
        img {
          width: 40px;
          height: 40px;
          margin-right: 24px;
        }
      }
    }

    .checkbox-label {
      margin-top: 12px;
      max-width: 400px;
    }
    .checkbox-item {
      display: flex;
      justify-content: left;
      align-items: center;
      margin: 6px 0px;
    }
  }
}
.organization-setting {
  background-color: @White;
  border-radius: @BorderRadius;
  label {
    display: block;
    margin: 0px 0px 20px 0px;
  }
  .sbmit {
    .flex-center();
  }
}
</style>
<script>
import { mapGetters } from 'vuex'
import jumbotronVue from '@/components/common/jumbotron.vue'
import pageHeader from './../../../components/common/layout/page-header.vue'
import { isBrowser, isNode } from 'browser-or-node'
import {
  NitrozenButton,
  NitrozenCheckBox,
  NitrozenError,
  NitrozenInput,
  strokeBtn,
  flatBtn
} from '@gofynd/nitrozen-vue'
import inlinesvg from '@/components/common/inline-svg.vue'
import { VueTelInput } from 'vue-tel-input'
import OrganizationService from '@/services/organization.service'
import formGenVue from '@/components/common/form-gen.vue'
import { GET_ORGANIZATION_DETAILS, GET_STAFF } from '@/store/getters.type'
import loader from '@/components/common/loader.vue'
import NoSSR from 'vue-no-ssr'
import { scrollToTop } from '@/helper/animate'

export default {
  name: 'settings-form',
  components: {
    'no-ssr': NoSSR,
    'vue-tel-input': VueTelInput,
    'nitrozen-button': NitrozenButton,
    'nitrozen-checkbox': NitrozenCheckBox,
    'nitrozen-error': NitrozenError,
    'nitrozen-input': NitrozenInput,
    'inline-svg': inlinesvg,
    'page-header': pageHeader,
    'form-gen': formGenVue,
    loader
  },
  directives: {
    flatBtn,
    strokeBtn
  },
  computed: {
    ...mapGetters({
      organization: GET_ORGANIZATION_DETAILS
    })
  },
  data() {
    return {
      errors: {},
      editMode: this.$route.name != 'create-organization',
      loading: false,

      form: {
        name: {
          type: 'string',
          required: true,
          maxLength: 20,
          label: 'Business Name*',
          hint: '',
          ...this.getInitialValue()
        },
        details: {
          type: 'string',
          required: true,
          label: 'Details*',
          hint: '',
          ...this.getInitialValue()
        },
        business: {
          emails: [
            {
              email: {
                type: 'email',
                required: true,
                label: 'Business Email*',
                ...this.getInitialValue()
              }
            }
          ],
          phoneNumbers: [
            {
              countryCode: {
                type: 'number',
                required: true,
                label: 'Country Code*',
                maxLength: 2,
                default: 'IN',
                ...this.getInitialValue('IN')
              },
              phone: {
                type: 'string',
                required: true,
                label: 'Buisness Phone Number*',
                length: 10,
                ...this.getInitialValue()
              }
            }
          ],
          website: {
            type: 'url',
            required: false,
            label: 'Website',
            ...this.getInitialValue()
          },
          address: {
            area_code: {
              type: 'string',
              required: true,
              label: 'ZIP / Postal code*',
              hint: '',
              maxLength: 10,
              ...this.getInitialValue()
            },
            country: {
              type: 'string',
              required: true,
              label: 'Country/Region*',
              hint: '',
              ...this.getInitialValue()
            },
            country_code: {
              type: 'string',
              required: true,
              label: 'Country Code*',
              default: 'IND',
              hint: '',
              ...this.getInitialValue('IND')
            },
            state: {
              type: 'string',
              required: true,
              label: 'State*',
              hint: '',
              ...this.getInitialValue()
            },
            city: {
              type: 'string',
              required: true,
              label: 'City*',
              hint: '',
              ...this.getInitialValue()
            },
            address: {
              type: 'string',
              required: true,
              label: 'Address 1*',
              hint: '',
              ...this.getInitialValue()
            },
            area: {
              type: 'string',
              required: true,
              label: 'Area*',
              hint: '',
              ...this.getInitialValue()
            },
            landmark: {
              type: 'string',
              required: true,
              label: 'Landmark*',
              hint: '',
              ...this.getInitialValue()
            },
            google_map_point: {},
            meta: {},
            address_type: {
              type: 'string',
              label: 'Address Type',
              hint: '',
              enums: [{ value: 'Buisness', display: 'Buisness' }],
              default: 'Buissness',
              hidden: true,
              ...this.getInitialValue('Buisness')
            }
          },
          social_meta: {
            facebook: {
              type: 'url',
              required: false,
              label: 'Facebook URL',
              ...this.getInitialValue()
            },
            linkedin: {
              type: 'url',
              required: false,
              label: 'Linkedin URL',
              ...this.getInitialValue()
            }
          },
          pan_card: {
            type: 'string',
            required: false,
            label: 'PAN card',
            length: 10,
            pattern: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
            ...this.getInitialValue()
          },
          gstin: {
            type: 'string',
            required: false,
            label: 'GSTIN Number',
            length: 15,
            pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
            ...this.getInitialValue()
          }
        },
        meta: {
          ecomm_platform_used: {
            label:
              'Which ecommerce platforms have you worked with? Please select all that apply.',
            type: 'options',
            required: false,
            ...this.getInitialValue(),
            enums: [
              {
                value: 'big_cartel',
                display: 'Big Cartel'
              },
              {
                value: 'big_commerce',
                display: 'BigCommerce'
              },
              {
                value: 'clover',
                display: 'Clover'
              },
              {
                value: 'demandware',
                display: 'Demandware'
              },
              {
                value: 'go_daddy',
                display: 'GoDaddy'
              },
              {
                value: 'hybris',
                display: 'Hybris'
              },
              {
                value: 'lightspeed',
                display: 'Lightspeed'
              },
              {
                value: 'magento',
                display: 'Magento'
              },
              {
                value: 'magento_enterprise',
                display: 'Magento Enterprise'
              },
              {
                value: 'open_cart',
                display: 'OpenCart'
              },
              {
                value: 'prestashop',
                display: 'PrestaShop'
              },
              {
                value: 'revel',
                display: 'Revel'
              },
              {
                value: 'shop_keep',
                display: 'Shopkeep'
              },
              {
                value: 'square',
                display: 'Square'
              },
              {
                value: 'squarespace',
                display: 'Squarespace'
              },
              {
                value: 'symphony',
                display: 'Symphony'
              },
              {
                value: 'vend',
                display: 'Vend'
              },
              {
                value: 'volusion',
                display: 'Volusion'
              },
              {
                value: 'wix',
                display: 'Wix'
              },
              {
                value: 'woo_commerce',
                display: 'WooCommerce'
              },
              {
                value: 'wordpress',
                display: 'WordPress'
              }
            ]
          },
          goals: {
            label:
              'What is the primary way you plan to make money as a Fynd Partner?',
            type: 'options',
            required: false,
            ...this.getInitialValue(),
            enums: [
              {
                value: 'app_builder',
                display: 'Building application'
              },
              {
                value: 'collaborator',
                display: 'Providing services to existing merchants'
              },
              {
                value: 'affiliate',
                display: 'Referring merchants as an affiliate'
              },
              {
                value: 'seller',
                display: 'Selling products as a merchant'
              }
              // {
              //   value: 'other',
              //   display: 'Other (please specify)'
              // }
            ]
          }
        }
      }
    }
  },
  mounted() {
    OrganizationService.fetchOrganizationForm()
      .then(({ data }) => {
        //this.form = data
      })
      .catch((err) => {})
    if (this.editMode) {
      this.getOrgnization()
    }
  },
  methods: {
    getInitialValue(value = '') {
      return {
        showerror: false,
        value,
        errortext: ''
      }
    },
    getOrgnization() {
      OrganizationService.fetchOrganizationDetails(this.organization._id)
        .then(({ data }) => {
          this.form.name.value = data.name
          this.form.details.value = data.details

          this.form.business.emails[0].email.value = data.business.emails[0]
            ? data.business.emails[0].email
            : ''
          this.form.business.phoneNumbers[0].countryCode.value = data.business
            .phoneNumbers[0]
            ? data.business.phoneNumbers[0].countryCode
            : '91'
          this.form.business.phoneNumbers[0].phone.value = data.business
            .phoneNumbers[0]
            ? data.business.phoneNumbers[0].phone
            : ''
          this.form.business.website.value = data.business.website
          this.form.business.address.address.value =
            data.business.address.address
          this.form.business.address.address_type.value =
            data.business.address.address_type
          this.form.business.address.area.value = data.business.address.area
          this.form.business.address.landmark.value =
            data.business.address.landmark
          this.form.business.address.city.value = data.business.address.city
          this.form.business.address.state.value = data.business.address.state
          this.form.business.address.country_code.value =
            data.business.address.country_code
          this.form.business.address.country.value =
            data.business.address.country
          this.form.business.address.area_code.value =
            data.business.address.area_code

          this.form.business.pan_card.value = data.business.pan_card || ''
          this.form.business.gstin.value = data.business.gstin || ''

          this.form.business.social_meta.facebook.value =
            data.business.social_meta.facebook || ''
          this.form.business.social_meta.linkedin.value =
            data.business.social_meta.linkedin || ''

          this.form.meta.ecomm_platform_used.value =
            data.meta.ecomm_platform_used
          this.form.meta.goals.value = data.meta.goals
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {})
    },

    checkValidPhoneNumber(name, evt) {
      this.form.business.phoneNumbers[0].countryCode.value =
        evt.country.dialCode
      this.form.business.phoneNumbers[0].phone.value = evt.number.significant
    },
    submitForm() {
      this.errors = {}
      this.isValidForm(this.form, this.errors)
      console.info(this.errors)
      if (!Object.keys(this.errors).length) {
        //make api calls
        let orgData = {}
        orgData = this.getFormData(this.form, orgData)
        this.loading = true
        let api = this.editMode
          ? OrganizationService.updateOrganization(
              this.organization._id,
              orgData
            )
          : OrganizationService.createOrganization(orgData)
        api
          .then(({ data }) => {
            const { slug } = data
            if (this.editMode) {
              this.$snackbar.global.showSuccess('Settings saved', 1000)
            } else {
              this.$router.push('/partner/' + slug)
            }
          })
          .catch((err) => {
            console.error(err)
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        scrollToTop(750)
      }
    },
    isValidForm(formObj, errors) {
      for (let key in formObj) {
        let item = formObj[key]
        //if no type found, look recursively
        if (!item.type) {
          let errorDepth = this.isValidForm(item, {})
          if (Object.keys(errorDepth).length) {
            errors[key] = errorDepth
          }
        } else {
          //check validity

          switch (item.type) {
            case 'string':
            case 'url':
            case 'email':
            case 'number': {
              //check if value empty and required
              if (!item.value && item.required) {
                item.showerror = true
                item.errortext = item.label + ' is required'
                errors[key] = item.label + ' is required'
              } else {
                //check if filled something then validate
                if (item.value) {
                  if (item.type === 'email') {
                    const re = /\S+@\S+\.\S+/
                    let isEmail = re.test(item.value)
                    if (!isEmail) {
                      item.showerror = true
                      item.errortext = 'Email not in proper format'
                      errors[key] = 'Email not in proper format'
                    }
                  } else if (
                    item.length &&
                    item.value.toString().length != item.length
                  ) {
                    item.showerror = true
                    item.errortext = 'Length should be ' + item.length
                    errors[key] = 'Length should be ' + item.length
                  } else if (
                    item.maxLength &&
                    item.value.toString().length > item.maxLength
                  ) {
                    item.showerror = true
                    item.errortext = 'Maximum Length is ' + item.maxLength
                    errors[key] = 'Maximum Length is ' + item.maxLength
                  } else if (
                    item.minLength &&
                    item.value.toString().length < item.minLength
                  ) {
                    item.showerror = true
                    item.errortext = 'Minimum Length is ' + item.minLength
                    errors[key] = 'Minimum Length is ' + item.minLength
                  } else if (
                    item.pattern &&
                    !item.value.toString().match(item.pattern)
                  ) {
                    item.showerror = true
                    item.errortext = item.label + ' is not in valid format'
                    errors[key] = item.label + ' is not in valid format'
                  } else {
                    item.showerror = false
                  }
                }
              }
              break
            }
            case 'options': {
              if (item.required && item.length === 0) {
                errors[key] = 'Please select any one options'
              } else {
                //todo for valida options maxlength/minlength
              }
              break
            }
          }
        }
      }
      return errors
    },
    getFormData(formData, orgData) {
      for (let key in formData) {
        let item = formData[key]
        //if no type found, look recursively
        if (Array.isArray(item)) {
          orgData[key] = item.map((it) => {
            if (!it.type) {
              return this.getFormData(it, {})
            }
            return it.value
          })
        } else if (!item.type) {
          orgData[key] = this.getFormData(item, {})
        } else {
          if (item.hidden) {
            orgData[key] = item.default
          } else {
            orgData[key] = item.value
          }
        }
      }
      return orgData
    }
  }
}
</script>
