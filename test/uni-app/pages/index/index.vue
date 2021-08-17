<template>
  <view>
    <canvas canvas-id="canvas" style="width: 400px; height: 400px"></canvas>
  </view>
</template>

<script>
import CrossEndCanvas from "cross-end-canvas";
export default {
  mounted() {
    CrossEndCanvas({
      id: "canvas",
      platform: "uni-app",
      target: this,
    }).then(function (painter) {
      console.log(painter);

      painter
        .config({
          fillStyle: "red",
          strokeStyle: "pink",
          lineWidth: 50,
        })
        .fullCircle(200, 200, 120)
        .fillText("我是文字", 50, 50)
        .draw();
    });
  },
};
</script>
