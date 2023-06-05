<template>
    <nano_cg_experiment_page 
        :prop_des_data="desData" 
        :prop_page_config="{mutiMode:false,offset:false}"
        @Init="Init"
        @Render="Render"
        @ModelChange="ModelChange"
        @DrawModelChange="DrawModelChange"
        ref="page" 
    /> 
</template>

<script lang='ts'>
import { Model } from '../../classes/model';
import { defineComponent, ref} from 'vue';
import {Vector3} from '../../classes/vector3'
import { ClearBuffer, DrawModelByImageDataWithZBufferAndCache, DrawTriangleByImageDataWithZBuffer, DrawTriangleInGrid, DrawTriangleInGridWithZBuffer, DrawTriangleInGridWithZBufferAndCache, DrawTriangleWithZBufferByCavasAPI, Hex2Rgb, InitCacheCtx, InitZBuffer } from './utils';
import nano_cg_experiment_page from '../nano_software_renderer_page.vue'
import uiSetting from '../ui-setting';
import { m2v4, matrixMutiply, vectorCross, vectorMultiply, vectorNormalize, vectorSubtract } from '../../classes/math';
import { Vector4 } from '../../classes/vector4';
import { CameraCache } from '../../classes/cameraCache';

const desData = {
    category: "SoftwareRenderer",
    name: "Camera",
    buttonContent: "查看源码",
    title: "相机与变换",
    content: "Camera and transform."
}

export default defineComponent({
    name: 'Camera',
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
        let getVertByFaceMap:(arg0:number,arg1:number)=> Vector3;


        let cameraCache:Array<CameraCache> = []
        let cacheOver = false;

        //section init.
        const Init = ()=>{
            canvas = page.value.getCanvas();
            ctx = page.value.getContext();
            model = page.value.getModel();
            imgData = page.value.getImgData();
            sectionParams = page.value.getSectionParams();
            getVertByFaceMap = model.value?.getVertByFaceMap ? model.value?.getVertByFaceMap: (arg0:number,arg1:number)=> Vector3;
            
            const lightDir = new Vector3(0,0,1);

            //zbuffer.
            InitZBuffer(canvas.width,canvas.height);

            //section ui.
            page.value.addParam({name:"lightDir",value:lightDir})
            
            page.value.addUIItem(
                { 
                    type: "slider-vector", id: "lightDir", value: sectionParams.lightDir, min: { 0: -100, 1: -100,2:-100}, max: { 0: 100, 1: 100,2:100 }, 
                    callback: uiSetting.globalUiCallbacks.updateVector3(sectionParams,page.value.Render,"lightDir") 
                },
            )

            page.value.addUIItem(
                { 
                    type: "slider-vector", id: "translation", value: sectionParams.transform.translation, min: { 0: -300, 1: -300,2:-300}, max: { 0: 300, 1: 300,2:300 }, 
                    callback: uiSetting.globalUiCallbacks.updateChildVector3(sectionParams,page.value.Render,"transform","translation") 
                },
            )
            page.value.addUIItem(
                { 
                    type: "slider-vector", id: "rotation", value: sectionParams.transform.rotation, min: { 0: -300, 1: -300,2:-300}, max: { 0: 300, 1: 300,2:300 }, 
                    callback: uiSetting.globalUiCallbacks.updateChildVector3(sectionParams,page.value.Render,"transform","rotation") 
                },
            )
            page.value.addUIItem(
                { 
                    type: "slider-vector", id: "scale", value: sectionParams.transform.scale, min: { 0: -200, 1: -200,2:-200}, max: { 0: 200, 1: 200,2:200   }, 
                    callback: uiSetting.globalUiCallbacks.updateChildVector3(sectionParams,page.value.Render,"transform","scale") 
                },
            )
        }

        //section render.
        const Render = ()=>{
            //matrix.
            page.value.caculateMatrix();
            DrawModel[page.value.getDrawModel()]();
        }

        //draw faces by methods.
        const DrawModel:{[index:string]:()=>void;} = {
            ImgData:()=>{
                imgData = ctx.createImageData(canvas.width,canvas.height);
                Draw(DrawTriangleByImageDataWithZBuffer,DrawTriangleByImageDataWithZBuffer,[imgData]);
                ctx.putImageData(imgData,0,0);
            },
        }

        const Draw = (initFun:any,cacheFun:any,args:Array<any>)=>{
            const c = Hex2Rgb(sectionParams.color);
            let color = new Vector3(c[0],c[1],c[2]);
            let mvp = page.value.getMvpMatrix();
            let lightDir = new Vector3(sectionParams.lightDir[0],sectionParams.lightDir[1],sectionParams.lightDir[2])

            let points:Array<Vector3> = [];
            let worldPoint:Vector4 =  new Vector3(0,0,0);
            
            if (!cacheOver){
                let worldVec4:Array<Vector4> = [];
                let tNormals:Array<Vector3> = [];
                model.value?.facetVrt.forEach((element,index) => {
                    points = [];
                    worldVec4 = [];
                    tNormals = [];
                    for (let j = 0; j < 3; j++){
                        worldPoint = new Vector4(getVertByFaceMap.call(model.value,index,j),1);
                        worldVec4.push(
                            worldPoint,
                        )
                        worldPoint = m2v4(matrixMutiply(mvp,worldPoint.getMatrix()));
                
                        points.push(worldPoint.getVec3().toIntVec())

                        tNormals.push(
                            model.value?.getNormalByFaceMap(index,j)
                        )

                    }
                    cameraCache.push({worldPoints:worldVec4,vertNormals:tNormals})
                    initFun(...args,lightDir,points,tNormals,color);      

                });
                cacheOver = true;
            }else{
                //with cache.
                console.log("with cache")
                ClearBuffer();
                cameraCache.forEach(e=>{
                    points = [];
                    for (let j = 0; j < 3; j++){
                        worldPoint = m2v4(matrixMutiply(mvp,e.worldPoints[j].getMatrix()));
                        points.push(
                            worldPoint.getVec3().toIntVec()
                        )
                    }
                    DrawTriangleByImageDataWithZBuffer(imgData,lightDir,points,e.vertNormals,color);      
                })
                
            }
        }

        //while model changed.
        const ModelChange = ()=>{
            ClearBuffer();
            cameraCache = [];
            cacheOver = false;
        }

        //while draw model changed.
        const DrawModelChange = (callback:any)=>{
            console.log("change model")
            ClearBuffer();
            cameraCache = [];
            cacheOver = false;
            callback();
        }

        return{
            desData,
            page,
            Init,
            Render,
            ModelChange,
            DrawModelChange
        }
    }
})
</script>
