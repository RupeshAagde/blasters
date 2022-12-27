<template>
  <div class="main" v-if="shouldLoadData">
    <draggable @start="drag = true" @end="drag = false" v-bind="dragOptions" tag="div"
               class="draggable-container"
               :draggable="`.${draggableClassName}`" handle=".draggable-icon" v-model="headerCard">
      <transition-group type="transition" :name="!drag ? 'flip-list' : null" class="grid-container" tag="div">
        <div class="grid-items" v-for="card in headerCard" :key="card.id"
             :class="shouldBeAbleToDrag(card)" ref="gridItems">
          <div class="card-container-grid">
            <super-header-controls @close="closeGraph(card.cardIndex, card.panelIndex)"
                                   @refresh="refreshGraph(card.id)" :card="card"></super-header-controls>
            <dashboard-grid-header :card="card" :is-header-card="card.cardIndex === 0 && card.panelIndex === 0"
                                   :card-index="card.cardIndex"></dashboard-grid-header>
            <graph-loading-controller
                :item="card"
                :card-index="card.cardIndex"
                :panel-index="card.panelIndex"
                :key="card.id"
                :ref="card.id"
            ></graph-loading-controller>
          </div>
        </div>
      </transition-group>
    </draggable>
    <div class="grid-wrapper">
      <draggable group="body-graphs" @start="dragColumn1 = true" @end="dragColumn1 = false" v-bind="dragOptions"
                 tag="div"
                 class="draggable-container list" @change="onGridChange($event, 'list1')"
                 :draggable="`.${draggableClassName}`" handle=".draggable-icon" v-model="list1">
        <transition-group type="transition" :name="!dragColumn1 ? 'flip-list' : null" class="grid-container" tag="div">
          <div class="grid-items" v-for="card in list1" :key="card.id"
               :class="shouldBeAbleToDrag(card)" ref="gridItems">
            <div class="card-container-grid">
              <super-header-controls @close="closeGraph(card.cardIndex, card.panelIndex)"
                                     @refresh="refreshGraph(card.id)" :card="card"></super-header-controls>
              <dashboard-grid-header :card="card" :is-header-card="card.cardIndex === 0 && card.panelIndex === 0"
                                     :card-index="card.cardIndex"></dashboard-grid-header>
              <graph-loading-controller
                  :item="card"
                  :card-index="card.cardIndex"
                  :panel-index="card.panelIndex"
                  :key="card.id"
                  :ref="card.id"
              ></graph-loading-controller>
            </div>
          </div>
        </transition-group>
      </draggable>
      <draggable group="body-graphs" @start="dragColumn2 = true" @end="dragColumn2 = false" v-bind="dragOptions"
                 tag="div"
                 class="draggable-container list"
                 :draggable="`.${draggableClassName}`" handle=".draggable-icon" v-model="list2"
                 @change="onGridChange($event, 'list2')">
        <transition-group type="transition" :name="!dragColumn2 ? 'flip-list' : null" class="grid-container" tag="div">
          <div class="grid-items" v-for="card in list2" :key="card.id"
               :class="shouldBeAbleToDrag(card)" ref="gridItems">
            <div class="card-container-grid">
              <super-header-controls @close="closeGraph(card.cardIndex, card.panelIndex)"
                                     @refresh="refreshGraph(card.id)" :card="card"></super-header-controls>
              <dashboard-grid-header :card="card" :is-header-card="card.cardIndex === 0 && card.panelIndex === 0"
                                     :card-index="card.cardIndex"></dashboard-grid-header>
              <graph-loading-controller
                  :item="card"
                  :card-index="card.cardIndex"
                  :panel-index="card.panelIndex"
                  :key="card.id"
                  :ref="card.id"
              ></graph-loading-controller>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>
  </div>
  <div class="error-cases" v-else>
    <adm-loader v-if="loading"></adm-loader>
    <error-handlers v-else :error-code="500" :show-try-again="true"></error-handlers>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {ANALYTICS_STATE} from "../../../../../store/modules/admin-analytics.module";
import GraphLoadingController from "../graph-loading-controller";
import {ANALYTICS_PAGES, GENERIC_GRAPHS} from "../../../../../components/generic-graphs/data/constants";
import draggable from "vuedraggable";
import DashboardGridHeader from "./dashboard-grid-header";
import {DASHBOARD_PAGE_PANELS} from "../../../../../constants/chart/dashboardConstants";
import {
  ADMIN_FETCH_DASHBOARD_DATA,
  ADMIN_SAVE_DASHBOARD_DRAGGABLE
} from "../../../../../store/action.type";
import {DashboardCommonMixins} from "../mixins/dashboard-common.mixins";
import {DashboardReportSharedMixins} from "../mixins/dashboard-report-shared.mixins";
import ErrorHandlers from "../../../../../components/generic-graphs/graphs/error-handlers";
import AdmLoader from "../../../../../components/admin/common/adm-loader";
import {convertToGridIndex, gridUtils} from "../utils/grid-utils";
import SuperHeaderControls from "../super-header-controls";

function isGenericGraphs(id) {
  // console.log(this.cardMap, 'id: ', id);
  if (!this.cardMap || !this.cardMap[id] || !this.cardMap[id].graphInfo || !this.cardMap[id].graphInfo.graphType) {
    return false;
  }
  return GENERIC_GRAPHS.includes(this.cardMap[id].graphInfo.graphType.toLowerCase());
}

export default {
  name: "dashboard-grid",
  mixins: [DashboardCommonMixins, DashboardReportSharedMixins],
  components: {
    SuperHeaderControls,
    AdmLoader,
    ErrorHandlers,
    DashboardGridHeader,
    GraphLoadingController,
    draggable
  },
  data: () => ({
    ANALYTICS_PAGES: ANALYTICS_PAGES,
    DASHBOARD_PANELS: DASHBOARD_PAGE_PANELS,
    drag: false,
    dragColumn1: false,
    dragColumn2: false,
    draggableClassName: 'draggable',
    loading: false,
    _cards: [],
  }),
  computed: {
    ...mapGetters({
      panels: ANALYTICS_STATE.DASHBOARD_DATA
    }),
    cards: {
      // console.log("empty", this.panels);
      get() {
        if (!this.panels || !this.panels.length) {
          return [];
        }
        // console.log('panels are updated', this.panels)
        // console.log('panel cards: ', panelCards);
        return this.panels && this.panels.reduce((a, i, index) => {
          if (i.cards && i.cards.length) {
            return a.concat(i.cards.map((x, cardIndex) => ({
              ...x,
              panelIndex: index,
              cardIndex: cardIndex,
              showRefreshButton: false,
              // showRefreshButton: index !== 0,
            })).filter(x => !x.hidden));
          } else {
            return a;
          }
        }, []);
      },
      set({cards, list}) {
        // console.log('list: ', list, ' and cards: ', cards, 'list1: ', this.list1.map(x => x.id), 'list2: ', this.list2.map(x => x.id), 'orginal cards: ', this.cards.map(x => x.id));
        // console.log(' and cards: ', cards);
        // const finalCards = [];
        // if (list === 'list1') {
        //   finalCards.push(...this.list2, ...cards);
        // }
        const {added, moved, removed} = cards;
        let newArr = []
        if (added) {
          newArr = gridUtils.added(this.cards.slice(1).map(x => x.id), convertToGridIndex(added.newIndex, list), added.element.id)
          // console.log('new ele: ', newArr)
        }
        if (moved) {
          newArr = gridUtils.moved(this.cards.slice(1).map(x => x.id), convertToGridIndex(moved.newIndex, list), convertToGridIndex(moved.oldIndex, list), moved.element.id)
          // console.log('new ele: ', newArr)
        }
        if (removed) {
          return;
        }
        // console.log('new ele: ', this.mapToOriginalCards(newArr, this.cardMap))
        const finalCards = this.mapToOriginalCards(newArr, this.cardMap);
        this.$store.dispatch(ADMIN_SAVE_DASHBOARD_DRAGGABLE, {
          dashboardCards: finalCards,
          email: this.emailId,
          appId: this.appId,
          mobileNumber: this.mobileNumber
        }).then(x => {
          newArr.filter((id, i) => isGenericGraphs.call(this, id) && i % 2 !== 0).forEach(id => {
            const graphType = this.cardMap[id].graphInfo.graphType;
            console.log('refreshing id: ', id, 'type: ', graphType);
            this.refreshGraph(id)
          });
        });
      }
    },
    cardMap() {
      return this.cards.reduce((a, i) => {
        a[i.id] = i;
        return a;
      }, {});
    },
    bodyCards() {
      // console.log('bdy cards: ', this.cards);
      return this.cards.slice(1)
    },
    headerCard() {
      return this.cards.slice(0, 1);
    },
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    },
    list1: {
      get() {
        return this.bodyCards.filter((x, i) => i % 2 === 0)
      },
      set(cards) {
        // this.cards = {cards, list: 'list1'}
        // console.log('cards1: ', cards)
      }
    },
    list2: {
      get() {
        return this.bodyCards.filter((x, i) => i % 2 !== 0);
      },
      set(cards) {
        // this.cards = {cards, list: 'list2'}
        // console.log('cards2: ', cards)
      }
    },
    shouldLoadData() {
      return !this.loading && this.cards.length > 0;
    }
  },
  methods: {
    closeGraph(cardIndex, panelIndex) {
      // console.log('closing the card', panelIndex, cardIndex);
      this.$store.dispatch(ADMIN_SAVE_DASHBOARD_DRAGGABLE, {
        closeCards: {
          cardIndex,
          panelIndex,
        },
        email: this.emailId,
        appId: this.appId,
        mobileNumber: this.mobileNumber
      });
    },
    shouldBeAbleToDrag(card) {
      return card.panelIndex === 0 && card.cardIndex === 0 ? '' : this.draggableClassName;
    },
    onGridChange(data, list) {
      // console.log('data: ', data);
      this.cards = {list, cards: data};
    },
    mapToOriginalCards(cards, map) {
      // console.log('final:', cards, map)
      return cards.map(x => map[x]);
    },
    refreshGraph(id) {
      // console.log('id: ', id, this.$refs)
      this.$refs[id][0].resetData();
    }
  },
  mounted() {
    this.loading = true;
    this.$store.dispatch(ADMIN_FETCH_DASHBOARD_DATA, {
      appId: this.appId, emailId: this.emailId, mobileNumber: this.mobileNumber
    }).then(x => {
      this.loading = false;
    });
  }
};
</script>

<style scoped lang="less">
@import './../../../less/page-header.less';
@import './../../../less/form.less';
@import "../some-common.less";

@mobile-screen-length: 768px;
@grid-gap: 0.8rem;

.main {
  display: flex;
  flex-direction: column;
  gap: @grid-gap;
}

.grid-wrapper {
  display: flex;
  gap: @grid-gap;
  width: 100%;
}

.list {
  width: 49.5%;
  //width: 39vw;
  //flex: 1;
  //max-width: 49%;
}

.card-container-grid {
  position: relative;
}

.draggable-container {
  //width: @dashboard-content-width-md;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.flip-list {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.grid-container {
  width: auto;
  display: flex;
  flex-direction: column;
  gap: @grid-gap;
  @media only screen and (min-width: @mobile-screen-length) {
    grid-template-columns: repeat(2, minmax(39vw, 1fr));
  }


  .grid-items {
    background-color: #fff;
    color: grey;
    font-size: 30px;
    //padding: 1.3rem;
    padding: 1.6rem;
    @media @mobile {
      width: 100vw;
      padding: 0.5em;
    }
  }

  .grid-items:first-child {
    //width: 100%;
    @media only screen and (min-width: @mobile-screen-length) {
      grid-column: span 2;
    }
  }
}
</style>
