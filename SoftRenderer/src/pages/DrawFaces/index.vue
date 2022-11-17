<template>
    <nano_cg_experiment_page 
        :prop_des_data="desData" 
        @Init="Init"
        @Render="Render"
        @ModelChange="ModelChange"
        ref="page" 
    /> 
</template>

<script lang='ts'>
import { Model } from '../../classes/model';
import { defineComponent, ref} from 'vue';
import {Vector3} from '/src/classes/vector3'
import { DrawGrid, DrawTriangleByCanvasAPI, DrawTriangleByImageData, DrawTriangleInGrid, Hex2Rgb, InitGridBuffer } from './utils';
import nano_cg_experiment_page from '../nano_software_renderer_page.vue'
import { Point } from '../../classes/point';
import uiSetting from '../ui-setting';
import {FaceCache} from '../../classes/faceCache'
import { vectorCross, vectorMultiply, vectorNormalize, vectorSubtract } from '../../classes/math';
import { Vector2 } from '/classes/vector2';
import { off } from 'process';
const desData = {
    category: "SoftwareRenderer",
    name: "DrawFaces",
    buttonContent: "查看源码",
    title: "绘制模型面",
    content: "Draw model faces."
}

export default defineComponent({
    name: 'DrawFaces',
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


        let facesCache:Array<FaceCache> = [];


        //section init.
        const Init = ()=>{
            canvas = page.value.getCanvas();
            ctx = page.value.getContext();
            model = page.value.getModel();
            imgData = page.value.getImgData();
            sectionParams = page.value.getSectionParams();
            getWorldToScreen = page.value.getWorldToScreen;
            getVertByFaceMap = model.value?.getVertByFaceMap ? model.value?.getVertByFaceMap: (arg0:number,arg1:number)=> Vector3;


            const lightDir = new Vector3(0,0,1);
            const normal = false;

            //section ui.
            page.value.addParam({name:"normal",value:normal})
            page.value.addParam({name:"lightDir",value:lightDir})
            
            page.value.addUIItem(
                {
                    type:"checkbox",id:"normal", value:sectionParams.normal,default:false,
                    callback: uiSetting.globalUiCallbacks.updateValue(sectionParams,page.value.Render,"normal")
                },
            )
            page.value.addUIItem(
                { 
                    type: "slider-vector", id: "lightDir", value: sectionParams.lightDir, min: { 0: -100, 1: -100,2:-100}, max: { 0: 100, 1: 100,2:100 }, 
                    callback: uiSetting.globalUiCallbacks.updateVector3(sectionParams,page.value.Render,"lightDir") 
                },
            )

        }

        //section render.
        const Render = ()=>{
            DrawFaces[page.value.getDrawModel()]();
        }

        //draw faces by methods.
        const DrawFaces:{[index:string]:()=>void;} = {
            Grid:()=>{
                InitGridBuffer(canvas,sectionParams.girdSize);
                DrawGrid(ctx,sectionParams.girdSize,canvas.width,canvas.height);
                const args = [ctx,sectionParams.girdSize,canvas.width,canvas.height];
                Draw(DrawTriangleInGrid,args);
            },
            ImgData:()=>{
                imgData = ctx.createImageData(canvas.width,canvas.height);
                const args = [imgData];
                Draw(DrawTriangleByImageData,args);
                ctx.putImageData(imgData,0,0);
            },
            CanvasApi:()=>{
                const args = [ctx];
                Draw(DrawTriangleByCanvasAPI,args);
            }
        }

        const Draw = (modelFun:any,args:Array<any>)=>{
             //Temp value defined before loop.
             const c = Hex2Rgb(sectionParams.color);
                let color = new Vector3(c[0],c[1],c[2]);
                let points:Array<Point> = [];
                let worldVec3:Array<Vector3> = [];
                let normalPerFace:Vector3 = new Vector3(0,0,0);
                let worldPoint:Vector3 =  new Vector3(0,0,0);
                let intensity = 1;

                //first init.
                if (!facesCache.length){
                    model.value?.facetVrt.forEach((element,index) => {
                        points = [];
                        worldVec3 = [];

                        for (let j = 0; j < 3; j++){
                            worldPoint = getVertByFaceMap.call(model.value,index,j);
                            worldVec3.push(worldPoint,)
                            points.push(getWorldToScreen(worldPoint))
                        }
                        // normal just caculate once.
                        normalPerFace = vectorNormalize(
                            vectorCross(
                                vectorSubtract(worldVec3[1],worldVec3[0]),
                                vectorSubtract(worldVec3[2],worldVec3[0])
                            )
                        )
                        intensity = vectorMultiply(normalPerFace,sectionParams.lightDir);
                        //cache.
                        facesCache.push({points,normal:normalPerFace})

                        // if normal shutdown.
                        if (!sectionParams.normal){
                            intensity = 1;
                        }
                        
                        if (intensity > 0){
                            modelFun(...args,points[0],points[1],points[2],color.mutiply(intensity));
                        }
                        
                    });
                }else{
                    //with cache.
                    let p:Array<Vector3> = [];
                    let offset = page.value.getOffset();
                    facesCache.forEach(e => {
                        for(let i = 0; i < e.points.length; i++){
                            p[i] = new Vector3(
                                e.points[i].X + offset.x,
                                e.points[i].Y + offset.y,
                                e.points[i].Z    
                            );
                        }
                        let intensity = vectorMultiply(e.normal,sectionParams.lightDir);
                        if (intensity > 0){
                            modelFun(...args,p[0],p[1],p[2],
                                color.mutiply(sectionParams.normal?intensity:1)
                            );
                        }
                    });
                }

        }
        
        //while model changed.
        const ModelChange = ()=>{
            facesCache = []
        }

        return{
            desData,
            page,
            Init,
            Render,
            ModelChange
        }
    }
})
</script>
