<template>
    <div id="SoftRenderer">
        <img :src="Proj"/>
    </div>
</template>
<script lang="ts">
import Proj from './Proj.png'
import { defineComponent} from 'vue';
export default defineComponent({
    name: 'Main',
    setup(){
        return{
            Proj
        }
    }
})

</script>
<style lang="less" scoped>
@import "./index.less";
</style>