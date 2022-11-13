<template>
    <nano_cg_experiment_page :prop_des_data="desData" :prop_ui_setter="uiSetter" :prop_section_params="sectionParams"
        ref="page" />
</template>

<script lang='ts'>
import { Model } from '../../classes/model';
import { defineComponent, reactive, ref,onMounted, computed, getCurrentInstance,} from 'vue';
import uiSetting from "../ui-setting"
import { Point, Vector2, Vector3 } from '../../classes/point';
import { DrawGrid, DrawLineByBresenham, DrawLineByCanvasApi, DrawLineInGrid, Hex2Rgb } from '../../classes/utils';
import { worldToScreen } from '@/classes/shaders/shader';

const desData = {
    category: "SoftwareRenderer",
    name: "DrawFrame",
    buttonContent: "查看源码",
    title: "绘制模型线框",
    content: "Draw model wireframe."
}

export default defineComponent({
    name: 'DrawFrame',
    setup(){
        const page = ref();

        let canvas:HTMLCanvasElement;
        let ctx:CanvasRenderingContext2D;
        let model:Model;
        let imgData:ImageData;

        let sectionParams = reactive({
            girdSize:1,
            offset:{x:0,y:0},
            color:"#ffffff",
            debugContent: [{}],
            drawModel:'CanvasApi',
        });

        const Init = ()=>{
            page.value.Init();
            canvas = page.value.getCanvas();
            if (!canvas){console.log("canvas not found!"); return;}
            ctx = canvas.getContext('2d');
            if (!ctx){console.log("ctx not found!");return;}
            imgData = ctx.createImageData(canvas.width,canvas.height);
            model = new Model("");
            model.getModel().then(Render);
        }

        const Render = ()=>{
            sectionParams.debugContent = [{}];
            const gridx = Math.floor(canvas.width / sectionParams.girdSize) - 1;
            const gridy = Math.floor(canvas.height / sectionParams.girdSize) - 1;

            sectionParams.debugContent.push({
                title:"grid",content:"The number of cells in the x direction: " + gridx + '.'+ "  The number of cells in the y direction: " + gridy,
            });

            ctx.clearRect(0,0,canvas.width,canvas.height)

            const beforeTime = Date.now();
            page.value.Render();
            DrawFrame[sectionParams.drawModel]();

            sectionParams.debugContent.push({
                title:"FPS",content:1000 / (Date.now() - beforeTime)
            });

        }

        

        const SetUI = ()=>{
            page.value.SetUI();
        }


        const uiSetter = computed(()=>{
            return [
                {
                    type:"slider", id:"girdSize", value: sectionParams.girdSize, min:1, max:100, 
                    callback:uiSetting.globalUiCallbacks.updateValue(sectionParams,Render,"girdSize")
                },
                { 
                    type: "slider-vector", id: "offset", value: sectionParams.offset, min: { x: -500, y: -500 }, max: { x: 500, y: 500 }, 
                callback: uiSetting.globalUiCallbacks.updatePoint(sectionParams,Render,"offset") 
                },
                { 
                    type: "color", id: "color", default: sectionParams.color, callback: uiSetting.globalUiCallbacks.updateValue(sectionParams,Render, "color") 
                }
            ]
        })

        const frameWorldToScreen = (v:Point)=>{
            let x0 = Math.floor((v.X+130)*canvas.width/280) +sectionParams.offset.x;
            let y0 = canvas.height - Math.floor((v.Y+1)*canvas.height/280) +sectionParams.offset.y;
            return new Point(x0,y0);
        };

        const DrawFrame = {
            Grid:()=>{
                    DrawGrid(ctx,sectionParams.girdSize,canvas.width,canvas.height);

                    const color = Hex2Rgb(sectionParams.color);
                    model.facetVrt.forEach((element,index) => {
                        for (let j = 0; j < 3; j++){
                            let v0 = model.getVertByFaceMap(index,j);
                            let v1 = model.getVertByFaceMap(index,(j+1)%3);
                            let p0 = frameWorldToScreen(v0);
                            let p1 = frameWorldToScreen(v1);
                            DrawLineInGrid(ctx,sectionParams.girdSize,canvas.width,canvas.height, p0,p1,new Vector3(color[0],color[1],color[2])); 
                        }
                    })
                    ;

            },
            ImgData:()=>{
                    const color = Hex2Rgb(sectionParams.color);
                    model.facetVrt.forEach((element,index) => {
                        for (let j = 0; j < 3; j++){
                            let v0 = model.getVertByFaceMap(index,j);
                            let v1 = model.getVertByFaceMap(index,(j+1)%3);
                            let p0 = frameWorldToScreen(v0);
                            let p1 = frameWorldToScreen(v1);
                            DrawLineByBresenham(imgData,p0,p1,new Vector3(color[0],color[1],color[2]))
                        }
                    });

                    ctx.putImageData(imgData,0,0);
            },
            CanvasApi:()=>{
                ctx.beginPath();
                const color = Hex2Rgb(sectionParams.color);
                model.facetVrt.forEach((element,index) => {
                        for (let j = 0; j < 3; j++){
                            let v0 = model.getVertByFaceMap(index,j);
                            let v1 = model.getVertByFaceMap(index,(j+1)%3);
                            let p0 = frameWorldToScreen(v0);
                            let p1 = frameWorldToScreen(v1);
                            DrawLineByCanvasApi(ctx, p0,p1,new Vector3(color[0],color[1],color[2]));
                        }
                    });
                ctx.stroke();
            }
        }

        onMounted(()=>{
            Init();
            SetUI();
        });

        return{
            canvas:null,
            ctx:null,
            desData,
            sectionParams,
            uiSetter,
            page,
        }
    }
})
</script>
