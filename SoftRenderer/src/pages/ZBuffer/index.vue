<template>
    <nano_cg_experiment_page 
        :prop_des_data="desData" 
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
import {Vector3} from '/src/classes/vector3'
import { ClearBuffer, DrawGrid,DrawModelByCanvasAPIWithZBufferAndCache, DrawModelByImageDataWithZBufferAndCache, DrawTriangleByImageDataWithZBuffer, DrawTriangleInGrid, DrawTriangleInGridWithZBuffer, DrawTriangleInGridWithZBufferAndCache, DrawTriangleWithZBufferByCavasAPI, Hex2Rgb, InitCacheCtx, InitZBuffer } from './utils';
import nano_cg_experiment_page from '../nano_software_renderer_page.vue'
import { Point } from '../../classes/point';
import uiSetting from '../ui-setting';
import { vectorCross, vectorMultiply, vectorNormalize, vectorSubtract } from '../../classes/math';
import { ZbufferPageCache } from '../../classes/zbufferPageCache';
const desData = {
    category: "SoftwareRenderer",
    name: "ZBuffer",
    buttonContent: "查看源码",
    title: "Z缓冲",
    content: "Visualization of zbuffer."
}

export default defineComponent({
    name: 'ZBuffer',
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

        let zbufferPageCache:ZbufferPageCache = {normals:[],points:[]};
        
        let cacheOver = false;

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

        }

        //section render.
        const Render = ()=>{
            DrawFaces[page.value.getDrawModel()]();
        }

        //draw faces by methods.
        const DrawFaces:{[index:string]:()=>void;} = {
            Grid:()=>{
                DrawGrid(ctx,sectionParams.girdSize,canvas.width,canvas.height);
                let girdSize = sectionParams.girdSize;
                Draw(DrawTriangleInGridWithZBuffer,DrawTriangleInGridWithZBufferAndCache,[ctx,girdSize])

            },
            ImgData:()=>{
                imgData = ctx.createImageData(canvas.width,canvas.height);
                Draw(DrawTriangleByImageDataWithZBuffer,DrawModelByImageDataWithZBufferAndCache,[imgData]);
                ctx.putImageData(imgData,0,0);
            },
            CanvasApi:()=>{
                Draw(DrawTriangleWithZBufferByCavasAPI,DrawModelByCanvasAPIWithZBufferAndCache,[ctx]) 
            }
        }

        const Draw = (initFun:any,cacheFun:any,args:Array<any>)=>{
                const c = Hex2Rgb(sectionParams.color);
                let color = new Vector3(c[0],c[1],c[2]);
                if (!cacheOver){
                    let points:Array<Vector3> = [];
                    let worldVec3:Array<Vector3> = [];
                    let worldPoint:Vector3 =  new Vector3(0,0,0);
                    let tNormals:Array<Vector3> = [];
                    model.value?.facetVrt.forEach((element,index) => {
                        points = [];
                        worldVec3 = [];
                        tNormals = [];
                        for (let j = 0; j < 3; j++){
                            worldPoint = getVertByFaceMap.call(model.value,index,j);
                            worldVec3.push(
                                worldPoint,
                            )
                            points.push(
                                getWorldToScreen(worldPoint)
                            )
                            tNormals.push(
                                model.value?.getNormalByFaceMap(index,j)
                            )

                        }
                        initFun(...args,points,tNormals,color);      
    
                    });
                    cacheOver = true;
                }else{
                    //with cache.
                    console.log("cache")
                    let offset = page.value.getOffset();
                    let lightDir = sectionParams.lightDir.copy()
                    cacheFun(
                        ...args,
                        color,
                        offset,
                        lightDir
                    );
                }
        }

        //while model changed.
        const ModelChange = ()=>{
            ClearBuffer();
            cacheOver = false;
        }

        //while draw model changed.
        const DrawModelChange = (callback:any)=>{
            console.log("change model")
            ClearBuffer();
            InitCacheCtx(zbufferPageCache);
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
