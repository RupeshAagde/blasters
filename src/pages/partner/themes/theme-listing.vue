<template>
  <div class="theme-listing">
    <div class="theme-listing__header">
      <div class="theme-listing__header--title">
        <h2>Themes</h2>
        <p>Themes developed by your organization</p>
      </div>
      <div class="theme-listing__header--actions">
        <nitrozen-input
          class="nitrozen__input"
          :showSearchIcon="true"
          :type="'search'"
          placeholder="Search"
          v-model="searchtext"
        ></nitrozen-input>
        <!-- <nitrozen-dropdown
          class="nitrozen__dropdown"
          placeholder="Theme Type"
          label="Theme Type"
          :items="themeType"
          v-model="selectedThemeType"
        ></nitrozen-dropdown> -->
      </div>
    </div>
    <div class="theme-listing__themes">
      <div
        class="theme-listing__themes--empty"
        v-if="getFilteredThemes.length === 0"
      >
        <page-empty text="No themes found"></page-empty>
      </div>
      <div
        class="theme-listing__themes--item"
        v-for="(theme, index) in getFilteredThemes"
        :key="index"
        v-else
      >
        <theme-item
          :isLoading="isLoading"
          :theme="{ ...theme.information, _id: theme._id }"
          @update_theme="updateCurrentTheme($event)"
        ></theme-item>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { NitrozenDropdown, NitrozenInput } from '@gofynd/nitrozen-vue'
import pageEmpty from '@/components/common/page-empty.vue'
import { GET_ORGANIZATION_DETAILS } from '@/store/getters.type'

import themeitem from './theme-item.vue'
import ThemeService from '@/services/themes.service'

export default {
  name: 'theme-listing',
  components: {
    'nitrozen-input': NitrozenInput,
    'nitrozen-dropdown': NitrozenDropdown,
    'theme-item': themeitem,
    'page-empty': pageEmpty
  },
  data() {
    return {
      searchtext: '',
      themeType: [
        {
          text: 'Free',
          value: 'free'
        },
        {
          text: 'Premium',
          value: 'premium'
        }
      ],
      themes: [],
      selectedThemeType: '',
      isLoading: true
    }
  },
  mounted() {
    this.isLoading = true
    let params = {
      page: 1,
      limit: 100
    }
    ThemeService.getOrganizationThemes(this.organization._id, params).then(
      ({ data }) => {
        this.themes = data
        this.isLoading = false
      }
    )
  },
  methods: {
    updateCurrentTheme(theme) {
      this.$emit('update_current_theme', theme)
    }
  },
  computed: {
    ...mapGetters({
      organization: GET_ORGANIZATION_DETAILS
    }),
    getFilteredThemes() {
      if (this.themes) {
        return this.themes.filter((item) => {
          if (this.searchtext.length > 0) {
            if (
              item.information.name
                .toLowerCase()
                .includes(this.searchtext.toLowerCase())
            ) {
              console.log(item)
              return item
            }
          } else {
            return item
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import './theme-variables.less';
.theme-listing {
  padding: 24px;
  &__header {
    margin-top: 5px;
    .flex-center();
    justify-content: space-between;
    &--title {
      h2 {
        font-size: @fs-md;
        font-weight: 600;
        margin-bottom: 10px;
      }
    }
    &--actions {
      display: flex;
      width: 50%;
      justify-content: space-between;
    }
  }
  &__themes {
    margin-top: 15px;
    display: flex;
    flex-wrap: wrap;
    &--item {
      width: 33.3%;
    }
    &--empty {
      display: block;
      margin: 0 auto;
    }
  }
}
.nitrozen {
  &__input {
    width: 65%;
  }
  &__dropdown {
    width: 30%;
  }
}
</style>
