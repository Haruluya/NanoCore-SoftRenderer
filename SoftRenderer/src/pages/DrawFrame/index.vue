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
import { Vector3 } from '../../classes/vector3';
import { DrawGrid, DrawLineByBresenham, DrawLineByCanvasApi, DrawLineInGrid, Hex2Rgb, InitGridBuffer } from './utils';
import nano_cg_experiment_page from '../nano_software_renderer_page.vue'
import { Point } from '../../classes/point';


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
        let getWorldToScreen:(arg0:Vector3)=>Vector3;
        let getVertByFaceMap:(arg0:number,arg1:number)=> Vector3;
        let frameCache:Array<Array<Vector3>> = [];

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
 
                //just for some pages.
                InitGridBuffer(canvas,sectionParams.girdSize);
                DrawGrid(ctx,sectionParams.girdSize,canvas.width,canvas.height);
                const color = Hex2Rgb(sectionParams.color);
                ctx.fillStyle = 'rgb('+color[0]+','+color[1]+','+color[2]+')';
                const args = [
                    ctx,
                    sectionParams.girdSize,
                    canvas.width,
                    canvas.height,
                ];
                Draw(DrawLineInGrid,args);
                
            },
            ImgData:()=>{
                imgData = ctx.createImageData(canvas.width,canvas.height);
                const color = Hex2Rgb(sectionParams.color);
                const args = [
                    imgData,
                    new Vector3(color[0],color[1],color[2]),
                ];
                Draw(DrawLineByBresenham,args);
                ctx.putImageData(imgData,0,0);
            },
            CanvasApi:()=>{

                ctx.beginPath();
                ctx.strokeStyle = sectionParams.color;
                const args = [
                    ctx,
                    canvas.width,
                    canvas.height
                ];
                Draw(DrawLineByCanvasApi,args);
                ctx.stroke();
            }
        }

        //unit draw function.
        const Draw = (modelFun:any,args:any)=>{
                let offset = page.value.getOffset();
                if(!frameCache.length) {
                    model.value?.facetVrt.forEach((element,index) => {
                        for (let j = 0; j < 3; j++){
                            let v0 = getVertByFaceMap.call(model.value,index,j);
                            let v1 = getVertByFaceMap.call(model.value,index,(j+1)%3);
                            
                            //cache.
                            let p0 = getWorldToScreen(v0);
                            let p1 = getWorldToScreen(v1);
                            frameCache.push([p0,p1]);
                            modelFun(...args,p0,p1); 
                        }
                    });
                }else{
                    let p0:Point = new Point(0,0);
                    let p1:Point = new Point(0,0);

                    frameCache.forEach(e=>{
                        //vertex offset.
                        p0.X = e[0].X + offset.x; p0.Y = e[0].Y + offset.y;
                        p1.X = e[1].X + offset.x; p1.Y = e[1].Y + offset.y;
                        modelFun(...args,p0,p1); 
                    })
                }
        }

        //while model changed.
        const ModelChange = ()=>{
            frameCache = []
        }
        //while draw model changed.
        const DrawModelChange = ()=>{
            Render();
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
