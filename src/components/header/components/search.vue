<template>
  <div class="search-input">
    <nitrozen-input
      :showSearchIcon="true"
      :placeholder="'Search'"
      class="search-box"
      :type="'search'"
      v-on:input="debounceInput"
      v-on:focus="showlist = true"
      v-model="searchtext"
    ></nitrozen-input>
    <div
      class="searchautocomplete nitrozen-scrollbar"
      v-click-outside="clickOutside"
      v-if="isSearchOpen()"
    >
      <ul>
        <li
          class="regular-xs"
          v-for="(item, index) in filteredRouteJson"
          :key="item.name + index"
          v-on:click="
            showlist = false
            reset
          "
        >
          <router-link :to="item.path">
            <inline-svg v-if="item.icon" :src="item.icon"></inline-svg>
            <span class="groupTitle">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { NitrozenButton, NitrozenInput, strokeBtn } from '@gofynd/nitrozen-vue'
import root from 'window-or-global'
import { mapGetters } from 'vuex'
import partnerRoutes from './../../../router/partners/'
import inlineSvgVue from '../../common/inline-svg.vue'

export default {
  components: {
    'nitrozen-input': NitrozenInput,
    'inline-svg': inlineSvgVue
  },
  directives: {
    strokeBtn
  },
  data() {
    return {
      routeJson: [],
      showlist: false,
      searchtext: '',
      filteredRouteJson: []
    }
  },
  mounted() {
    this.getRoutes(partnerRoutes)
  },
  methods: {
    getRoutes(partnerRoutes, basePath = '') {
      const { partnerId } = this.$route.params
      for (let i = 0; i < partnerRoutes.length; i++) {
        let { children, path, meta } = partnerRoutes[i]
        path = path.replace(':partnerId', partnerId)
        if (meta) {
          this.routeJson.push({
            path: basePath + path,
            icon: meta && meta.icon,
            name: meta && meta.name
          })
        }
        if (children && children.length) {
          this.getRoutes(children, basePath + path)
        }
      }
    },
    debounceInput: function() {
      this.showlist = true

      let regex = new RegExp(`^${this.searchtext.toLowerCase()}`)
      this.filteredRouteJson = this.routeJson.filter((it) => {
        return regex.test(it.name.toLowerCase())
      })
    },
    isSearchOpen: function() {
      return (
        this.searchtext &&
        Object.keys(this.filteredRouteJson).length &&
        this.showlist
      )
    },
    reset: function() {
      this.$emit('route-change')
      this.searchtext = ''
    },
    clickOutside: function() {
      this.showlist = false
    }
  }
}
</script>

<style lang="less">
.search-input {
  width: 100%;
  .flex-center();
  .search-box {
    width: 40%;
  }
}
.searchautocomplete {
  position: absolute;
  background: #fff;
  width: calc(40% - 60px);
  border-top: 0;
  padding: 0;
  z-index: 16;
  top: 52px;
  border-radius: 2px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  max-height: 250px;
  overflow-y: auto;

  ul {
    li {
      line-height: 20px;
      a {
        display: flex;
        width: 100%;
        color: #000;
        margin: 0px;
        text-decoration: none;
        &:hover {
          background-color: #eee;
          cursor: pointer;
        }
        span {
          padding: 10px;
        }
      }
    }
  }
}
</style>
