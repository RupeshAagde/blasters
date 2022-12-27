e.vue<template>
  <div class="cards-container">
    <div class="card flex" v-for="(card, index) in cards" :key="index">
      <image-container
        :src="card.image"></image-container>
      <div class="card-texts" v-if="card.image">
        <h5>{{ card.productName }}</h5>
        <h6><span>SKU:</span> {{ card.sku }}</h6>
        <h6 class="flex">Qty: <span>
          <graph-value-formatter :value="card.qty.growth_value"
                                 :config="card.qty.valueFormatter"
          ></graph-value-formatter></span>&nbsp;|&nbsp;
          <change-in-value :value="card.qty.growth_percentage"></change-in-value>
        </h6>
      </div>
    </div>
  </div>
</template>

<script>
import { analyticsTablePropsMixins } from "../mixins/analytics-props.mixins";
import ImageContainer from "../../responsive-image-container";
import ChangeInValue from "../../change-in-value";
import GraphValueFormatter from "../../graph-value-formatter";
import { TABLE_COLUMN_TYPES } from "../../data/constants";

export default {
  name: "table-cards",
  components: { GraphValueFormatter, ChangeInValue, ImageContainer },
  mixins: [analyticsTablePropsMixins],
  computed: {
    typeHashMaps() {
      return this.columns.reduce((a, x) => {
        a[x.type] = x;
        return a;
      }, {});
    },
    cards() {
      console.log('maps: ', this.typeHashMaps);
      return this.rows.map(x => {
        return {
          image: x[this.typeHashMaps[TABLE_COLUMN_TYPES.IMAGE].field].image,
          productName: x[this.typeHashMaps[TABLE_COLUMN_TYPES.IMAGE].field].text,
          sku: x[this.typeHashMaps[TABLE_COLUMN_TYPES.STRING].field],
          qty: x[this.typeHashMaps[TABLE_COLUMN_TYPES.GROWTH].field]
        };
      });

      // return this.rows;
    }
  }
};
</script>

<style scoped lang="less">
@import "../graph.less";

@heading-color: #41434C;
@text-light-color: #666666;
@card-width: 15%;

.flex {
  display: flex;
}

.card {
  gap: 0.3em;
  padding-block: 0.2em;

  & > div:last-child {
    width: calc(100% - @card-width);
  }

  & > div:first-child {
    min-width: 1.6em;
    //width: 2em;
  }
}

.card-texts {
  & > h5 {
    color: @heading-color;
    font-weight: 600;
    font-size: 0.87rem;
    text-overflow: ellipsis;
    overflow: hidden;
    .text-wrap()
  }

  & > h6 {
    color: @text-light-color;
    //padding-block: 0.3em;
    font-size: 0.78rem;
    padding-top: 0.625em;

    & span {
      .bold();
      //margin-right: 0.4em;
    }

    &:last-child {
      padding: 1em;
    }
  }
}

.bold {
  font-weight: 700;
}
</style>
