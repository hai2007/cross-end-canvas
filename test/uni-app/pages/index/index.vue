<template>
  <view>
    <canvas id='canvas'></canvas>
  </view>
</template>

<script>
import CrossEndCanvas from "cross-end-canvas";
export default {
  mounted() {
    CrossEndCanvas({
      id: "canvas",
      platform: "uni-app",
      target:this
    }).then(function (painter) {
      console.log(painter);
    });
  },
};
</script>
