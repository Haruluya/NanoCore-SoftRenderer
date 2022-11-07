<template>
    <div id="SoftRenderer">
        <canvas ref="canvas"/>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref,onMounted} from 'vue';
export default defineComponent({
  name: 'SoftRenderer',
  setup(){
    const canvas = ref<HTMLCanvasElement | null>();


    onMounted(()=>{
        if (canvas == null){
            console.log("Canvas not found!");
            return;
        }
        const ctx = canvas.value.getContext('2d');
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(300,300);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();

    })
    return{
        canvas,
    }
  }
});
</script>
<style lang="less" scoped>
@import "./SoftRenderer.less";
</style>