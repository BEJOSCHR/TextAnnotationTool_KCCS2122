<template>
  <div class="container" style="background-color: #2c3e50; color: lightgreen; font-size: 12px;" v-if="this.submitted === true && checkFilter()">
    <a style="font-family: 'Calibri Light', serif; font-size: 18px; margin-top: 20px"> Submitted </a>
  </div>
  <div class="container" v-else-if="checkFilter()">
    <a style="font-family: 'Calibri Light', serif; font-size: 18px; margin-top: 20px" v-html="highlightText()"></a>
    <br>
    <div style="margin-top: 10px;">
      <input style="text-align: center" v-model="labelPrediction" placeholder="Enter Label" v-text="this.labelPrediction" @input="percentage=100" @keyup.enter="()=>submitLabel()">
      <button v-if="checkContent()" class="submitLabel" @click="submitLabel">Submit</button>
      <button v-else class="dummy">Submit</button>
      <a style="font-size: 12px; margin-left: 4px"> {{this.percentage}}% certainty</a>
      <a style="position: absolute; right: 19%; font-size: 12px"> Doc. {{this.documentNumber}} </a>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

let position, index;
export default {
  //Each container represents one text part with a related label, item is the data container given from the v-for loop
  name: "LabelDataContainer",
  props: {
    position,
    index,
    item: {
      type: Object,
      required: true,
    },
  },
  created() {
    //called on create, and transfers the data from the item localy
    this.isTrained = this.item.is_trained;
    this.text = this.item.text;
    this.labelPos = this.getLabelPos(this.item.predictions);
    this.labelPrediction = this.$labels[this.labelPos];
    if(this.labelPos !== -1) {
      //labelPos = -1 means no label prediction from the AI was given
      this.percentage = (this.item.logits[this.labelPos]*100).toFixed(2);
    }else {
      this.percentage = 0;
    }
    this.documentNumber = this.item.doc_id;
  },
  data() {
    return {
      //The local data set from the item in create()
      isTrained: false,
      text: "",
      labelPos: 0,
      labelPrediction: "",
      percentage: 0,
      documentNumber: 0,
      submitted: false,
    }
  },
  methods: {
    //This methode is called if you press the submit button,
    //here the represented text part is saved as submitted so it can later be exported
    submitLabel() {
      //Only can be pressed if a label is entered in the text field
      if(this.checkContent()) {
        let labelPos = this.percentage === 100 ? -1 : this.labelPos;
        Vue.prototype.$submittedLabels.push( { index: this.index, text: this.text, label: this.labelPrediction, percentage: this.percentage, labelPos: labelPos, docNumber: this.documentNumber} )
        this.submitted = true;
        this.$parent.$forceUpdate();
      }
    },
    //This methode checks if the entered label is set correctly
    checkContent() {
      return this.labelPrediction != null && this.labelPrediction !== "";
    },
    //This is the main methode doing the filtering part,
    //if it returns true this text part is displayed, if not it is false
    checkFilter() {
      if(this.isTrained !== 1) {
        //NO TRAIN DATA
        if(Vue.prototype.$shownLabels.length === 0) {
          //THERE IS NO FILTERED LABEL
          if(Vue.prototype.$searchKeyWord !== null && Vue.prototype.$searchKeyWord !== '') {
            //THERE IS A FILTER KEYWORD
            if(this.text.includes(Vue.prototype.$searchKeyWord)) {
              //THIS LABEL CONTAINS WORD
              if(Vue.prototype.$searchDocNumber !== -1) {
                //THERE IS A DOC FILTER
                if(this.documentNumber == Vue.prototype.$searchDocNumber) {
                  //THIS HAS THIS DOC NUMBER
                  if((this.percentage >= Vue.prototype.$percentageMin && this.percentage <= Vue.prototype.$percentageMax) || this.percentage == 100) {
                    //IN PERCENTAGE RANGE OR BYPASS
                    return true;
                  }
                }
              }else {
                //NO DOC FILTER
                if((this.percentage >= Vue.prototype.$percentageMin && this.percentage <= Vue.prototype.$percentageMax) || this.percentage == 100) {
                  //IN PERCENTAGE RANGE OR BYPASS
                  return true;
                }
              }
            }
          }else {
            //NO FILTER KEYWORD
            if(Vue.prototype.$searchDocNumber !== -1) {
              //THERE IS A DOC FILTER
              if(this.documentNumber == Vue.prototype.$searchDocNumber) {
                //THIS HAS THIS DOC NUMBER
                if((this.percentage >= Vue.prototype.$percentageMin && this.percentage <= Vue.prototype.$percentageMax) || this.percentage == 100) {
                  //IN PERCENTAGE RANGE OR BYPASS
                  return true;
                }
              }
            }else {
              //THERE IS NO DOC FILTER - DEFAULT if nothing is changed -> only percentage check
              if((this.percentage >= Vue.prototype.$percentageMin && this.percentage <= Vue.prototype.$percentageMax) || (this.percentage == 100 && this.submitted == false)) {
                //IN PERCENTAGE RANGE OR BYPASS
                return true;
              }
            }
          }
        }else{
          //THERE IS A FILTER LABEL
          if(Vue.prototype.$shownLabels.includes(this.labelPos)) {
            //THIS LABEL IS IN IT
            if(Vue.prototype.$searchKeyWord !== null && Vue.prototype.$searchKeyWord !== '') {
              //THERE IS A FILTER KEYWORD
              if(this.text.includes(Vue.prototype.$searchKeyWord)) {
                //THIS LABEL CONTAINS WORD
                if(Vue.prototype.$searchDocNumber !== -1) {
                  //THERE IS A DOC FILTER
                  if(this.documentNumber == Vue.prototype.$searchDocNumber) {
                    //THIS HAS THIS DOC NUMBER
                    if((this.percentage >= Vue.prototype.$percentageMin && this.percentage <= Vue.prototype.$percentageMax) || this.percentage == 100) {
                      //IN PERCENTAGE RANGE OR BYPASS
                      return true;
                    }
                  }
                }else {
                  //NO DOC FILTER
                  if((this.percentage >= Vue.prototype.$percentageMin && this.percentage <= Vue.prototype.$percentageMax) || this.percentage == 100) {
                    //IN PERCENTAGE RANGE OR BYPASS
                    return true;
                  }
                }
              }
            }else {
              //THERE IS NO FILTER KEYWORD
              if(Vue.prototype.$searchDocNumber !== -1) {
                //THERE IS A DOC FILTER
                if(this.documentNumber == Vue.prototype.$searchDocNumber) {
                  //THIS HAS THIS DOC NUMBER
                  if((this.percentage >= Vue.prototype.$percentageMin && this.percentage <= Vue.prototype.$percentageMax) || this.percentage == 100) {
                    //IN PERCENTAGE RANGE OR BYPASS
                    return true;
                  }
                }
              }else {
                //NO DOC FILTER
                if((this.percentage >= Vue.prototype.$percentageMin && this.percentage <= Vue.prototype.$percentageMax) || this.percentage == 100) {
                  //IN PERCENTAGE RANGE OR BYPASS
                  return true;
                }
              }
            }
          }
        }
      }
      return false;
    },
    //This returns true if no filter is set at all
    noFilterSet() {
      if(Vue.prototype.$shownLabels.length === 0) {
        //NO LABEL FILTERED
        if(Vue.prototype.$searchKeyWord === null || Vue.prototype.$searchKeyWord === '') {
          //NO KEYWORD
          return true;
        }
      }
    },
    //This methode is used on loading the item data to get the labelPos information
    // so input looks like this: [0,0,0,1,0] and the first 1 is located and returned
    getLabelPos(input) {
      if(input[0] === 1) {
        return 0;
      }else if(input[1] === 1) {
        return 1;
      }if(input[2] === 1) {
        return 2;
      }if(input[3] === 1) {
        return 3;
      }if(input[4] === 1) {
        return 4;
      }else {
        return -1;
      }
    },
    //This methode is called by the key filter check and draws the keyword with a RegularExpression
    highlightText() {
      return this.text.replace(new RegExp(Vue.prototype.$searchKeyWord, "gi"), match => {
        return '<a style="background-color: lightcyan">' + match + '</a>';
      });
    }
  }
}
</script>

<style scoped>
.container {
  background-color: lightgrey;
  color: black;
  letter-spacing: 1px;
  word-spacing: 2px;
  border: 1.5px solid black;
  margin-block: 7px;
  margin-left: 1%;
  margin-top: 0px;
  padding: 6px;
  max-width: 80%;
}
.submitLabel {
  width: 70px;
  margin-left: 7px;
  color: darkgreen;
}
.dummy {
  width: 70px;
  margin-left: 7px;
  color: darkred;
}
</style>