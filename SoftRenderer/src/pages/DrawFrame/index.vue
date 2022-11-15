<template>
    <nano_cg_experiment_page 
        :prop_des_data="desData" 
        @Init="Init"
        @Render="Render"
        ref="page" 
    /> 
</template>

<script lang='ts'>
import { Model } from '../../classes/model';
import { defineComponent, ref} from 'vue';
import {Vector3} from '/src/classes/vector3'
import { DrawGrid, DrawLineByBresenham, DrawLineByCanvasApi, DrawLineInGrid, Hex2Rgb } from '../../classes/utils';
import nano_cg_experiment_page from '../nano_software_renderer_page.vue'
import { Point } from '/classes/point';

const desData = {
    category: "SoftwareRenderer",
    name: "DrawFrame",
    buttonContent: "查看源码",
    title: "绘制模型线框",
    content: "Draw model wireframe."
}

export default defineComponent({
    name: 'DrawFrame',
    components:{nano_cg_experiment_page},
    setup(){
        //store. 
        const page = ref();
        //canvas context.
        let canvas:HTMLCanvasElement;
        let ctx:CanvasRenderingContext2D;
        let model = ref<Model>();
        let imgData:ImageData;
        let sectionParams:any;
        let getWorldToScreen:(arg0:Vector3)=>Point;
        let getVertByFaceMap:(arg0:number,arg1:number)=> Vector3;

        //section init.
        const Init = ()=>{
            canvas = page.value.getCanvas();
            ctx = page.value.getContext();
            model = page.value.getModel();
            imgData = page.value.getImgData();
            sectionParams = page.value.getSectionParams();
            getWorldToScreen = page.value.getWorldToScreen;
            getVertByFaceMap = model.value?.getVertByFaceMap ? model.value?.getVertByFaceMap: (arg0:number,arg1:number)=> Vector3;
        }

        //section render.
        const Render = ()=>{
            DrawFrame[page.value.getDrawModel()]();
        }

        //draw frame by methods.
        const DrawFrame:{[index:string]:()=>void;} = {
            Grid:()=>{
                    DrawGrid(ctx,sectionParams.girdSize,canvas.width,canvas.height);
                    const color = Hex2Rgb(sectionParams.color);
                    model.value?.facetVrt.forEach((element,index) => {
                        for (let j = 0; j < 3; j++){
                            let v0 = getVertByFaceMap.call(model.value,index,j);
                            let v1 = getVertByFaceMap.call(model.value,index,(j+1)%3);
                            let p0 = getWorldToScreen(v0);
                            let p1 = getWorldToScreen(v1);
                            DrawLineInGrid(ctx,sectionParams.girdSize,canvas.width,canvas.height, p0,p1,new Vector3(color[0],color[1],color[2])); 
                        }
                    })
                    ;

            },
            ImgData:()=>{
                imgData = ctx.createImageData(canvas.width,canvas.height);
                const color = Hex2Rgb(sectionParams.color);
                model.value?.facetVrt.forEach((element,index) => {
                    for (let j = 0; j < 3; j++){
                        let v0 = getVertByFaceMap.call(model.value,index,j);
                        let v1 = getVertByFaceMap.call(model.value,index,(j+1)%3);
                        let p0 = getWorldToScreen(v0);
                        let p1 = getWorldToScreen(v1);
                        DrawLineByBresenham(imgData,p0,p1,new Vector3(color[0],color[1],color[2]))
                    }
                });

                ctx.putImageData(imgData,0,0);
            },
            CanvasApi:()=>{
                ctx.beginPath();
                const color = Hex2Rgb(sectionParams.color);
                model.value?.facetVrt.forEach((element,index) => {
                        for (let j = 0; j < 3; j++){
                            let v0 = getVertByFaceMap.call(model.value,index,j);
                            let v1 = getVertByFaceMap.call(model.value,index,(j+1)%3);
                            let p0 = getWorldToScreen(v0);
                            let p1 = getWorldToScreen(v1);
                            DrawLineByCanvasApi(ctx, p0,p1,new Vector3(color[0],color[1],color[2]));
                        }
                    });
                ctx.stroke();
            }
        }

        return{
            desData,
            page,
            Init,
            Render,
        }
    }
})
</script>
