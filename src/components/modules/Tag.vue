<template>
  <el-button
  class="tag"
  :style="{
    'background-color': color,
    'border-color': color
  }">
    <div :style="{'color': textColor }"> {{ label }} </div>
  </el-button>
</template>

<script>
export default {
  name: 'tag',
  props: {
    label: String
  },
  computed: {
    color () {
      return '#' + this.intToRGB(this.hashCode(this.label))
    },
    textColor() {
      let hex = this.color;
      if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
      }
      // convert 3-digit hex to 6-digits.
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
      }
      const r = parseInt(hex.slice(0, 2), 16),
          g = parseInt(hex.slice(2, 4), 16),
          b = parseInt(hex.slice(4, 6), 16);
      return (r * 0.299 + g * 0.587 + b * 0.114) > 186
          ? '#000000'
          : '#FFFFFF';
    }
  },
  methods: {
    hashCode(str) {
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return hash;
    },
    intToRGB(i){
      var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();
      return "00000".substring(0, 6 - c.length) + c;
    },
  }
}
</script>

<style lang="scss" scoped>
.tag {
  margin: 2px;
  padding: 2px;
  :hover {
    opacity: 0.8;
  }
  div {
    color: white;
  }
}
</style>