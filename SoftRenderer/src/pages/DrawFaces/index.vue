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
import { defineComponent, Ref, ref} from 'vue';
import {Vector3} from '/src/classes/vector3'
import { DrawGrid, DrawLineByBresenham, DrawLineByCanvasApi, DrawLineInGrid, DrawTriangleByCanvasAPI, DrawTriangleByImageData, DrawTriangleInGrid, Hex2Rgb } from '../../classes/utils';
import nano_cg_experiment_page from '../nano_software_renderer_page.vue'
import { Point } from '../../classes/point';
import uiSetting from '../ui-setting';
import { vectorCross, vectorMultiply, vectorNormalize, vectorSubtract } from '../../classes/math';
const desData = {
    category: "SoftwareRenderer",
    name: "DrawFaces",
    buttonContent: "查看源码",
    title: "绘制模型面",
    content: "Draw model faces."
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

        //draw frame by methods.
        const DrawFaces:{[index:string]:()=>void;} = {
            Grid:()=>{
                    DrawGrid(ctx,sectionParams.girdSize,canvas.width,canvas.height);
                    const c = Hex2Rgb(sectionParams.color);
                    let color = new Vector3(c[0],c[1],c[2]);
                    let points:Array<Point> = [];
                    let worldVec3:Array<Vector3> = [];
                    let normalPerFace:Vector3 = new Vector3(0,0,0);
                    let worldPoint:Vector3 =  new Vector3(0,0,0);
                    let intensity = 1;
                    model.value?.facetVrt.forEach((element,index) => {
                        points = [];
                        worldVec3 = [];
                        for (let j = 0; j < 3; j++){
                            worldPoint = getVertByFaceMap.call(model.value,index,j);
                            worldVec3.push(
                                worldPoint,
                            )
                            points.push(
                                getWorldToScreen(getVertByFaceMap.call(model.value,index,j))
                            )
                        }
                        if(sectionParams.normal){
                            normalPerFace = vectorNormalize(
                                vectorCross(
                                    vectorSubtract(worldVec3[1],worldVec3[0]),
                                    vectorSubtract(worldVec3[2],worldVec3[0])
                                )
                            )
                            intensity = vectorMultiply(normalPerFace,sectionParams.lightDir);
                        }
        
                        if (intensity > 0){
                            DrawTriangleInGrid(ctx,sectionParams.girdSize,points[0],points[1],points[2],color.mutiply(intensity));
                        }
                    });

            },
            ImgData:()=>{
                imgData = ctx.createImageData(canvas.width,canvas.height);
                const c = Hex2Rgb(sectionParams.color);
                let color = new Vector3(c[0],c[1],c[2]);
                let points:Array<Point> = [];
                let worldVec3:Array<Vector3> = [];
                let normalPerFace:Vector3 = new Vector3(0,0,0);
                let worldPoint:Vector3 =  new Vector3(0,0,0);
                let intensity = 1;
                model.value?.facetVrt.forEach((element,index) => {
                    points = [];
                    worldVec3 = [];
                    for (let j = 0; j < 3; j++){
                        worldPoint = getVertByFaceMap.call(model.value,index,j);
                        worldVec3.push(
                            worldPoint,
                        )
                        points.push(
                            getWorldToScreen(getVertByFaceMap.call(model.value,index,j))
                        )
                    }
                    if(sectionParams.normal){
                        normalPerFace = vectorNormalize(
                            vectorCross(
                                vectorSubtract(worldVec3[1],worldVec3[0]),
                                vectorSubtract(worldVec3[2],worldVec3[0])
                            )
                        )
                        intensity = vectorMultiply(normalPerFace,sectionParams.lightDir);
                    }
    
                    if (intensity > 0){
                        DrawTriangleByImageData(imgData,points[0],points[1],points[2],color.mutiply(intensity));
                    }
                });
                ctx.putImageData(imgData,0,0);
            },
            CanvasApi:()=>{

                const c = Hex2Rgb(sectionParams.color);
                let color = new Vector3(c[0],c[1],c[2]);
                let points:Array<Point> = [];
                let worldVec3:Array<Vector3> = [];
                let normalPerFace:Vector3 = new Vector3(0,0,0);
                let worldPoint:Vector3 =  new Vector3(0,0,0);
                let intensity = 1;
                model.value?.facetVrt.forEach((element,index) => {
                    points = [];
                    worldVec3 = [];
                    for (let j = 0; j < 3; j++){
                        worldPoint = getVertByFaceMap.call(model.value,index,j);
                        worldVec3.push(
                            worldPoint,
                        )
                        points.push(
                            getWorldToScreen(worldPoint)
                        )
                    }
                   
                    if(sectionParams.normal){
                        normalPerFace = vectorNormalize(
                            vectorCross(
                                vectorSubtract(worldVec3[1],worldVec3[0]),
                                vectorSubtract(worldVec3[2],worldVec3[0])
                            )
                        )
                        intensity = vectorMultiply(normalPerFace,sectionParams.lightDir);
                    }
    
                    if (intensity > 0){
                        DrawTriangleByCanvasAPI(ctx,points[0],points[1],points[2],color.mutiply(intensity));
                    }
                });

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
