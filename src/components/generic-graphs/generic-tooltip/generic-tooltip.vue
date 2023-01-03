<template>
    <div class="tooltip-box">
      <slot />
      <div
        class="tooltip"
        v-if="text"
      >
        <span
          class="text"
        >{{ text }}</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "generic-tooltip",
    props: { 
      text: {
        type: String,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .tooltip-box { 
    position: relative;
    display: inline-block;
  }
  
  .tooltip-box:hover .tooltip{
    opacity: 1;
  }
  
  .tooltip { 
    /* color: #ffffff; */
    text-align: center;
    padding: 5px 0;
    border-radius: 4px;
    
    width: 120px;
    bottom: 150%;
    left: 50%;
    margin-left: -60px;
  
    opacity: 0;
    transition: opacity 0.4s;
  
    position: absolute;
    z-index: 1;
  
    background-color: #ebedfb;
    color: #41434c;
  }
  
  .text::after {
    content: " ";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #ebedfb transparent transparent transparent;
  }
  </style>