//TODO:
//Filter mit dem screen scrollend machen
//Document Filter (field mit nummer zur eingabe)
//Percentage Filter (slider von 50 bis 100% und enable checkbox)
//export into json datei
<template>
  <div id="app">
    <div>
      <h1 style="margin-left: 10%; margin-top: 30px">TextAnnotationTool V1.0</h1>
    </div>
    <br>
    <LabelDataContainer v-for="(labelContainer, index, position) in this.$inputData" :item="labelContainer" :index="index" :position="position" :key="labelContainer.id+index">
    </LabelDataContainer>
    <div class="surroundingContainer" style="top: 107px;">
      <h2 style="margin-left: 10px">Label filter</h2>
      <div class="sortBox_Labels" v-for="(label, position) in this.$labels" :key="position+'. '+label">
        <input type="checkbox" v-model="shownLabels" @click="()=>{labelFilterUpdate(position)}" :value="position">
        <a style="margin-left: 8px">{{label}}</a>
      </div>
      <div class="sortBox_Labels">
        <input type="checkbox" v-model="shownLabels" @click="()=>{labelFilterUpdate(-1)}" :value="-1">
        <a style="margin-left: 8px">Unknown</a>
      </div>
      <div>
        <button class="labelFilterButton" @click="()=>labelFilterAllUpdate(true)">All on</button>
        <button class="labelFilterButton" @click="()=>labelFilterAllUpdate(false)">All off</button>
      </div>
    </div>
    <div class="surroundingContainer" style="top: 450px; padding-bottom: 3px">
      <div class="sortBox_Labels">
        <a style="ont-family: Bahnschrift;">Search for keyword: </a>
      </div>
      <div class="sortBox_Labels">
        <input style="text-align: left; width: 50%;" placeholder="Enter keyword..." v-model="searchKeyWord" @keyup.enter="()=>keyWordUpdate(false)">
        <button style="margin-left: 8px" @click="()=>keyWordUpdate(false)">Search</button>
        <button style="margin-left: 8px" @click="()=>keyWordUpdate(true)">Reset</button>
      </div>
    </div>
    <div class="surroundingContainer" style="top: 545px; padding-bottom: 3px">
      <div class="sortBox_Labels">
        <a style="font-family: Bahnschrift;">Search for document: </a>
      </div>
      <div class="sortBox_Labels">
        <input style="text-align: left; width: 50%;" placeholder="Enter doc number..." v-model="searchDocNumber" @keyup.enter="()=>docNumberUpdate(false)">
        <button style="margin-left: 8px" @click="()=>docNumberUpdate(false)">Search</button>
        <button style="margin-left: 8px" @click="()=>docNumberUpdate(true)">Reset</button>
      </div>
    </div>
    <transition name="fade">
      <div class="cornerBottomRight" v-show="scY > 280" @click="toTop">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
             stroke="red"
             stroke-width="3" stroke-linecap="square">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </div>
    </transition>
  </div>
</template>

<script>

import DataSet from './assets/dummy_manifesto_data_short.json'
import LabelDataContainer from "@/components/LabelDataContainer";
import Vue from "vue";

export default {
  name: 'App',
  components: {
    LabelDataContainer
  },
  data(){
    return{
      searchKeyWord: "",
      searchDocNumber: -1,
      inputData: [],
      dataLoaded: false,
      minimumPercentage: 0.5,
      shownLabels: [],
      scTimer: 0,
      scY: 0,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  created() {
    this.loadingData();
    Vue.prototype.$shownLabels = this.shownLabels;
  },
  methods: {
    docNumberUpdate(reset) {
      if(reset === true) {
        Vue.prototype.$searchDocNumber = -1;
        this.searchDocNumber = -1;
      }else {
        Vue.prototype.$searchDocNumber = this.searchDocNumber;
      }
      for (let i = 0; i < this.$children.length; i++) {
        this.$children[i].$forceUpdate();
      }
    },
    keyWordUpdate(reset) {
      if(reset === true) {
        Vue.prototype.$searchKeyWord = "";
        this.searchKeyWord = "";
      }else {
        Vue.prototype.$searchKeyWord = this.searchKeyWord;
      }
      for (let i = 0; i < this.$children.length; i++) {
        this.$children[i].$forceUpdate();
      }
    },
    labelFilterAllUpdate(on) {
      if(on === true) {
        this.shownLabels = [-1, 0, 1, 2, 3, 4];
      }else {
        this.shownLabels = [];
      }
      Vue.prototype.$shownLabels = this.shownLabels;
      for (let i = 0; i < this.$children.length; i++) {
        this.$children[i].$forceUpdate();
      }
    },
    labelFilterUpdate(pos) {
      if(this.shownLabels.includes(pos)) {
        this.shownLabels = this.shownLabels.filter(function(value) {
          return value !== pos;
        });
      }else {
        this.shownLabels.push(pos);
      }
      Vue.prototype.$shownLabels = this.shownLabels;
      for (let i = 0; i < this.$children.length; i++) {
        this.$children[i].$forceUpdate();
      }
    },
    handleScroll() {
      if (this.scTimer) return;
      this.scTimer = setTimeout(() => {
        this.scY = window.scrollY;
        clearTimeout(this.scTimer);
        this.scTimer = 0;
      }, 100);
    },
    toTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    },
    loadingData() {
      console.log("Loading Data...");
      Vue.prototype.$inputData = DataSet;
      this.dataLoaded = true;
      console.log("Finsihed Loading Data!")
    },
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  font-size: medium;
}
.surroundingContainer {
  position: absolute;
  right: 2%;
  background-color: lightgrey;
  width: 14%;
  max-width: 14%;
  padding-bottom: 10px;
  border: 1.5px solid black;
}
.sortBox_Labels {
  font-size: 15px;
  font-family: Arial, serif;
  padding: 8px;
  margin-left: 5px;
}
.labelFilterButton {
  width: 40%;
  margin-left: 7%;
  margin-top: 10px;
}
.cornerBottomRight {
  position: fixed;
  bottom: 10px;
  right: 10px;
}
</style>
