<template>
  <div class="child-container">
    <section class="explore-jumbotron">
      <div class="left">
        <h1>Explore the themes</h1>
        <p>
          Explore our range of free and paid themes to find the right look and
          feel for your store. Find inspiration, discover styles, and start
          building your brand.
        </p>
        <nitrozen-button v-flat-btn :theme="'secondary'">
          Explore
        </nitrozen-button>
      </div>
      <div class="right">
        <img src="/public/assets/pngs/home/build-themes.png" />
      </div>
    </section>
    <section class="explore">
      <div class="filters">
        <div class="tabs">
          <span class="tab"> Popular </span>
          <span class="tab"> Recent </span>
          <span class="tab active"> Free </span>
          <span class="tab"> Featured </span>
        </div>
        <div class="search">
          <nitrozen-input
            :showSearchIcon="true"
            type="search"
            placeholder="Search"
            v-model="themeSearch"
          >
          </nitrozen-input>
        </div>
        <!-- <div class="category">
          <nitrozen-dropdown
            placeholder="Choose category"
            :items="categories"
            v-model="category"
          ></nitrozen-dropdown>
        </div> -->
      </div>
      <div class="list">
        <div class="card" v-for="theme in filteredThemes" :key="theme._id">
          <div class="card-image">
            <img
              :src="
                theme.information.images.desktop.length
                  ? theme.information.images.desktop[0]
                  : ' /public/assets/theme_default_image.jpg'
              "
            />
          </div>
          <div class="card-content">
            <div class="avatar">
              <img
                src="https://res.cloudinary.com/dwzm9bysq/image/upload/w_46,ar_1:1,c_fill,g_auto//v1584955313/production/applications/app_000000000000000000000001/media/store/logo/lluozpswzotfrd2e4cz8.png"
              />
            </div>
            <div class="details">
              <div class="name">{{ theme.information.name }}</div>
              <div class="author">by <span>Fynd</span></div>
            </div>
            <div class="price">FREE</div>
          </div>
        </div>
      </div>
      <div class="load-more" v-if="remains > 0">
        <nitrozen-button v-stroke-btn :theme="'secondary'" @click="getThemes">
          Load More
        </nitrozen-button>
      </div>
    </section>
  </div>
</template>

<script>
import {
  NitrozenButton,
  NitrozenDropdown,
  NitrozenInput,
  strokeBtn,
  flatBtn
} from '@gofynd/nitrozen-vue'
import { mapGetters } from 'vuex'
import { IS_LOGGED_IN } from '@/store/getters.type'
import { SIGNOUT_USER, OPEN_LOGIN_MODAL } from '@/store/action.type'
import ThemesService from '@/services/themes.service.js'
export default {
  components: {
    'nitrozen-button': NitrozenButton,
    'nitrozen-dropdown': NitrozenDropdown,
    'nitrozen-input': NitrozenInput
  },
  directives: {
    flatBtn,
    strokeBtn
  },
  computed: {
    ...mapGetters({
      isLoggedIn: IS_LOGGED_IN
    }),
    filteredThemes() {
      if (this.themeSearch == '') {
        return this.themes
      }
      return this.themes.filter((t) => {
        return (
          t.information.name
            .toLowerCase()
            .indexOf(this.themeSearch.toLowerCase()) > -1
        )
      })
    }
  },
  mounted() {
    this.getThemes()
  },
  data: function() {
    return {
      categories: [
        {
          text: 'Clothing',
          value: 'clothing'
        },
        {
          text: 'Shoes',
          value: 'shoes'
        },
        {
          text: 'Electronics',
          value: 'electronics'
        }
      ],
      category: 'Clothing',
      themeSearch: '',
      themes: [],
      pagination: { page: 0, limit: 6 },
      remains: 0
    }
  },
  methods: {
    signOut() {
      this.$store.dispatch(SIGNOUT_USER)
    },
    openLogin() {
      if (this.isLoggedIn) {
        return this.$router.push('/organizations')
      }
      this.$store.dispatch(OPEN_LOGIN_MODAL)
    },
    getThemes() {
      this.pagination.page += 1
      ThemesService.listThemes(this.pagination).then(({ data }) => {
        this.themes = this.themes.concat(data.docs)
        this.remains = data.total - this.themes.length
      })
    }
  }
}
</script>

<style lang="less" scoped>
section {
  width: 100%;
  max-width: 1400px;
  min-height: 50px;
}
section:first-child {
  margin-top: 100px;
}
section:nth-child(2n + 1) {
  background-color: #f4f8fb;
}

section.explore-jumbotron {
  padding: 80px 0;
  display: flex;
  .left {
    width: 58%;
    padding-left: 40px;
    color: @HomePageText;
    font-family: Poppins;
    h1 {
      font-size: 36px;
      line-height: 55px;
      font-weight: bold;
    }
    p {
      max-width: 350px;
      font-size: 14px;
      line-height: 21px;
      margin: 55px 0;
    }
  }
  .right {
    width: 42%;
    padding-right: 40px;
    img {
      width: 100%;
    }
  }
}

section.explore {
  padding: 50px 0;
  .filters {
    display: flex;
    height: 40px;
    .tabs {
      width: 35%;
      .tab {
        color: @HomePageText;
        font-size: 16px;
        line-height: 40px;
        margin: 0 20px;
        cursor: pointer;
        &.active {
          border-bottom: 1px solid @HomePageText;
          font-weight: 800;
        }
      }
    }
    .search {
      display: flex;
      flex: 1;
      justify-content: flex-end;
      padding-right: 20px;
      .nitrozen-form-input {
        width: 300px;
      }
    }
  }
  .list {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    .card {
      padding: 22px;
      width: 25%;
      .card-image {
        height: 200px;
        border: 1px solid @Iron;
        border-radius: 5px 5px 0px 0px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .card-content {
        display: flex;
        height: 62px;
        font-size: 18px;
        line-height: 27px;
        .avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          margin: 8px;
        }
        .details {
          padding: 8px;
          line-height: 23px;
          .name {
            word-break: break-all;
          }
          .author {
            font-size: 12px;
            span {
              color: @RoyalBlue;
            }
          }
        }
        .price {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: flex-end;
          font-weight: 600;
          text-transform: capitalize;
          color: #04c40a;
        }
      }
    }
  }
  .load-more {
    display: flex;
    justify-content: center;
  }
}
</style>
