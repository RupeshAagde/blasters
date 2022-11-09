<template>
  <div class="row">
    <h3>{{ name }}</h3>
    <custom-progress-bar :percentage="percentage" :opacity="opacity"></custom-progress-bar>
    <h3 class="percentage">{{ percentage }}%</h3>
    <change-in-value :value="changeInPercentage" class="change-in-value"></change-in-value>
  </div>
</template>

<script>
import CustomProgressBar from "./progress-bar";
import ChangeInValue from "../../change-in-value";

export default {
  name: "single-row",
  components: { CustomProgressBar, ChangeInValue },
  props: {
    name: { type: String, required: true },
    percentage: { type: Number, required: true, default: 0 },
    changeInPercentage: { type: Number, required: true },
    opacity: { type: Number, required: true }
  }
};
</script>

<style lang="less" scoped>
.row {
  display: grid;
  grid-template-columns: 35% 38% 12% 17%;
  @media screen and (max-width: 1350px) {
    grid-template-columns: 27% 35% 15% 15%;
  }
  align-items: center;
  justify-items: start;
  margin-block: 0.8rem;

  .percentage, .change-in-value {
    margin-left: 1rem;
  }
}

.row > h3:first-child {
  justify-self: start;
}

.row > h3 {
  color: #666666;
  font-size: 13px;
}

.row h3:last-child {
  color: #219653;
}

.row div > h3 {
  margin-left: 1em;
  color: #41434c;
  font-size: 13px;
  font-family: Inter;
}
</style>
