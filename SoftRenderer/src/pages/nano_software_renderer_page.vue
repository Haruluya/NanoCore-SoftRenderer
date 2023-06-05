<template>
    <div class="pageContainer">
        <div class="webglContainer" id="canvasSlot">
            <nano_canvas ref="nanoCanvas"/>
        </div>
        <div class="desPanel">
            <nano_webgl_des_panel
                :prop_category="prop_des_data.category"
                :prop_name="prop_des_data.name"
                :prop_button_content="prop_des_data.buttonContent"
                :prop_title="prop_des_data.title"
                :prop_content="prop_des_data.content"
                :prop_core_slot_id="slotID.CORE_SLOT_TOP_ID"
                @handleClick="pageCallback().handleClick"
            />
        </div>

        <div class="sidePanel" ref="sidePanel"
            >
            <div class="mainPanel"
                :style="{left:sidePanelPos.mainPanel.x + 'px',top:sidePanelPos.mainPanel.y + 'px'}"
                @mousedown="uiSetting.panelDrag(sidePanelPos,'mainPanel',$event)" >
                <nano_param_panel
                    :prop_ui_setter="uiSetter"
                    :prop_panel_slot_id="slotID.MAIN_PANEL_SLOT_ID"
                    :prop_debug_slot_id="slotID.DEBUG_OUT_SLOT_ID"
                    @showDebug="pageCallback().showDebugPanel"
                    @updateSlot="uiSetting.updateSlot"
                />
            </div>
            <transition name="debugPanelTransition">
                <div class="debugPanel"
                    v-show="showDebug"
                    :style="{left:sidePanelPos.debugPanel.x + 'px',top:sidePanelPos.debugPanel.y + 'px'}"
                    @mousedown="uiSetting.panelDrag(sidePanelPos,'debugPanel',$event)">
                    <nano_param_output_panel
                        prop_title="Debug"
                        :prop_slot_id="slotID.DEBUG_IN_SLOT_ID"
                        :prop_content="debugContent"
                    />
                </div>
            </transition>
        </div>
        <div class="textures" ref="texture" >
            <canvas class="diffuse" :width="textureWidth" :height="textureHeight" v-show="false">
            </canvas>
            <canvas class="normal"  :width="textureWidth" :height="textureHeight" v-show="false">
            </canvas>
        </div>

    </div>

</template>
<script lang="ts">
import dog from  '../../public/static/obj/dog/dog'
import assassin from '../../public/static/obj/assassin/assassin'
import cube from  '../../public/static/obj/cube/cube'
import head from  '../../public/static/obj/head/head'

import { Model } from '../classes/model';
import { defineComponent,defineExpose, reactive, ref,onMounted, computed,nextTick} from 'vue';
import uiSetting from "./ui-setting"
import { UIItem } from '../classes/uiItem';
import { Vector3 } from '../classes/vector3';
import { degToRad, getTransformMatrix, inverse, lookAt, matrixMutiply, perspective } from '../classes/math';
/*
    @author:haruluya.
    @des:This component is used to make the source code more concise.
*/
export default defineComponent({
    name: 'softwareRenderer',
    props:{
        prop_des_data:{
            type:Object,
            default:{
                category:"None",
                name:"None",
                buttonContent:"None",
                title:"None",
                content:"None"
            },
            required:true
        },
        prop_page_config:{
            type:Object,
            default:{
                mutiMode:true,
                offset:true,
            }
        }
    },
    setup(props,context){
        //origin canvas. 
        let nanoCanvas = ref();
        let texture = ref();

        //canvas context.
        let canvas:HTMLCanvasElement;
        let ctx:CanvasRenderingContext2D;
        let imgData:ImageData;

        //texture.
        let textureWidth = 1024;
        let textureHeight = 1024;
        let textureImg:Array<{name:string,img:HTMLImageElement}> = [];
        const textureId:{[index:string]:number} = {"diffuse":0,"normal":1}

        // basic params.
        let sectionParams:{[index:string]:any} = reactive({
            girdSize:1,
            offset:{x:0,y:0},
            color:"#ffffff",
            drawModel:0,
            modelFile:0,
            camera:{
                target:new Vector3(0, 0, 0),
                position:new Vector3(0, 0, -1),
                up:new Vector3(0,-1,0)  
            },
            perspective:{
                aspect:0,
                fieldOfViewRadians: degToRad(60),
                zNear: 1,
                zFar: 20,
            },
            transform:{
                translation:new Vector3(200,-100,0),
                rotation:new Vector3(degToRad(0),degToRad(0),degToRad(0)),
                scale:new Vector3(120,0,100)
            }
        });

        //matrix;
        let mvpMatrix:Float32Array = new Float32Array([])
        let projectionMatrix:Float32Array = new Float32Array([]);
        let viewMatrix:Float32Array = new Float32Array([]);
        let modelMatrix:Float32Array = new Float32Array([]);


        // vue component value.
        let currentModelFile = 0;
        let currentDrawModel = 0;
        let showDebug = ref<boolean>(false);
        let debugContent = ref([{}]);
        const slotID = {
            MAIN_PANEL_SLOT_ID : 1,
            DEBUG_IN_SLOT_ID : 2,
            DEBUG_OUT_SLOT_ID : 3,
            CORE_SLOT_TOP_ID : 4
        }
        const sidePanelPos = reactive({
            mainPanel:{ x: 1050, y: 150 },
            debugPanel:{x:1200, y:400}
        });

        //model.
        let model= ref<Model>();
        let modelData:{
            [index:string]:Object;
        } = {
            assassin,
            cube,
            head
        };
        const modelFileData = ["head","cube","assassin"];
        const drawModelData = ["ImgData","CanvasApi","Grid" ];

        //ui
        let sectionUI = ref<Array<UIItem>>([]);



        //basic init. 
        const Init = ()=>{
            //canvas.
            canvas = nanoCanvas.value.$refs.canvas;
            if (!canvas){console.log("canvas not found!"); return;}
            //context.
            ctx = canvas.getContext('2d');
            if (!ctx){console.log("ctx not found!");return;}
            //image data.
            imgData = ctx.createImageData(canvas.width,canvas.height);
            //model.
            model.value = new Model(modelFileData[sectionParams.modelFile]);  
            model.value.getModel().then(Render);
            // set canvas pixel.
            uiSetting.resizeCanvasToDisplaySize(getCanvas());
            
            //matrix.
            sectionParams.perspective.aspect = canvas.width/canvas.height;
            sectionParams.transform.scale[1] = Math.floor(sectionParams.transform.scale[0] * canvas.height/canvas.width);
            caculateMatrix();
            //section init.
            context.emit('Init');
        }

        //basic render.
        const Render = ()=>{
            uiSetting.resizeCanvasToDisplaySize(getCanvas());
            debugContent.value = [{}];
            //model changed.
            if (currentModelFile != sectionParams.modelFile){
                currentModelFile = sectionParams.modelFile;
                model.value = new Model(modelFileData[sectionParams.modelFile]);  
                model.value.getModel().then(Render);
                context.emit("ModelChange")
                return;  
            }

            //draw model changed.
            if (currentDrawModel != sectionParams.drawModel){
                currentDrawModel = sectionParams.drawModel;
                context.emit("DrawModelChange",Render)
                return;
            }

            //grid.
            const gridx = Math.floor(canvas.width / sectionParams.girdSize) - 1;
            const gridy = Math.floor(canvas.height / sectionParams.girdSize) - 1;
            //fps.
            const beforeTime = Date.now();
            ctx.clearRect(0,0,canvas.width,canvas.height)


            //section render.   
            context.emit("Render");
            //debug.
            debugLog("FPS",1000 / (Date.now() - beforeTime) + '')
            debugLog("Grid","GridX: " + gridx + '.'+ "  GridY: " + gridy)
            debugLog("Model","ModelVerts: "+ model.value?.nverts() + "\tModelFaces: " + model.value?.nfaces());
            debugLog("DrawModel",drawModelData[sectionParams.drawModel])
        }

        //set pageui.
        const SetUI = ()=>{
            uiSetting.setDefaultUI(slotID);
        }

        // ui configuration.
        let uiSetter = computed(()=>{
                        //ui.
                        
            let ui:Array<UIItem> = [
                {
                    type:"select",id:"modelFile",default:sectionParams.modelFile, value:modelFileData,
                    callback: uiSetting.globalUiCallbacks.updateValue(sectionParams,Render,"modelFile")
                },
                { 
                    type: "color", id: "color", default: sectionParams.color, value:sectionParams.color,
                    callback: uiSetting.globalUiCallbacks.updateValue(sectionParams, Render,"color") 
                },
            ]
            sectionUI.value.forEach((e)=>{
                ui.push(e);
            })
            //mutimode.
            if(props.prop_page_config.mutiMode){
                ui.push(
                    {
                    type:"select",id:"drawModel",default:sectionParams.drawModel, value:drawModelData,
                    callback: uiSetting.globalUiCallbacks.updateValue(sectionParams,Render,"drawModel")
                },
                )
            }
            //offset.
            if(props.prop_page_config.offset){
                ui.push(
                    { 
                    type: "slider-vector", id: "offset", value: sectionParams.offset, min: { x: -500, y: -500 }, max: { x: 500, y: 500 }, 
                    callback: uiSetting.globalUiCallbacks.updatePoint(sectionParams,Render,"offset") 
                },
                )
            }

            //grid model.
            if(sectionParams.drawModel == 2){
                ui.push(   
                    {
                    type:"slider", id:"girdSize", value: sectionParams.girdSize, min:1, max:100, 
                    callback:uiSetting.globalUiCallbacks.updateValue(sectionParams,Render,"girdSize")
                    },
                )
            }
            return ui;
        })


        onMounted(()=>{
            Init();
            SetUI();
        });

        //utils.
        const pageCallback = ()=>{
            return {
                handleClick: () => {
                    window.location.href =
                        "https://github.com/Haruluya/NanoCore-SoftRenderer/tree/master/SoftRenderer/src/pages/"+this.prop_des_data.name+"/index.vue";
                },
                showDebugPanel: () => {
                    showDebug.value = !showDebug.value;
                    if (showDebug.value) {
                        nextTick(() => {
                            uiSetting.setDebugPanelCon(slotID);
                            uiSetting.nodeLines.debugPanelLine.show("draw");
                        });
                    }
                    else {
                        uiSetting.nodeLines.debugPanelLine.hide("draw");
                        uiSetting.nodeLines.debugPanelLine.remove();
                        uiSetting.nodeLines.debugPanelLine = null;
                    }
                },
            };
        };

        const getCanvas = ()=>{
            return canvas;
        }

        const getContext = ()=>{
            return ctx;
        }

        const getImgData = ()=>{
            return imgData;
        }

        const getSectionParams = ()=>{
            return sectionParams;
        }

        const getModel = ()=>{
            return model;
        }

        const debugLog = (title:string,content:string)=>{
            debugContent.value.push({
                title,
                content
            })
        };

        const getDrawModel = ()=>{
            return drawModelData[sectionParams.drawModel];
        }

        const getModelFile = ()=>{
            return modelFileData[sectionParams.modelFile];
        }

        const getWorldToScreen = (v:Array<Vector3>):Array<Vector3>=>{
            return modelData[modelFileData[sectionParams.modelFile]].WorldToScreen(v,canvas,sectionParams.offset);
        }

        const getOffset = ()=>{
            return sectionParams.offset;
        } 

        const getMvpMatrix = ()=>{
            return mvpMatrix
        }

        const getModelMatrix = ()=>{
            return modelMatrix;
        }

        const addUIItem = (uiItem:UIItem)=>{
            sectionUI.value.push(uiItem);
        }
        const addParam = (param:{name:string,value:any})=>{
            sectionParams[param.name] = param.value;
        }


        const caculateMatrix = ()=>{
            projectionMatrix = perspective(
                sectionParams.perspective.fieldOfViewRadians,
                sectionParams.perspective.aspect,
                sectionParams.perspective.zNear,
                sectionParams.perspective.zFar
            )
            let cameraMatrix = lookAt(
                sectionParams.camera.position,
                sectionParams.camera.target,
                sectionParams.camera.up
            )
            viewMatrix = inverse(cameraMatrix);
            modelMatrix = getTransformMatrix(sectionParams.transform);
            let viewProjectionMatrix = matrixMutiply(projectionMatrix,viewMatrix);
            mvpMatrix = matrixMutiply(viewProjectionMatrix,modelMatrix);
        }

        // load all textureImg.
        const loadTexture = async () => {
            return await Promise.all(
                textureImg.map((item)=> (
                    new Promise(resolve=>(
                        item.img.addEventListener('load',()=> {
                            const textureCanvas = texture.value.children[textureId[item.name]];
                            textureCanvas.getContext('2d').drawImage(item.img,0,0);
                            model.value?.setTexture(item.name,textureCanvas);
                            resolve(item.img);
                        })
                    ))
                )
            ))

        }

        //set texture.
        const setTexture = (name:string,filePath:string)=>{
            const img = new Image();
            img.src = filePath;
            textureImg.push({name,img});
        }   

        return{
            sectionParams,
            uiSetting,
            uiSetter,
            slotID,
            sidePanelPos,
            nanoCanvas,

            showDebug,
            debugContent,
            modelData,
            getSectionParams,
            getModel,
            getDrawModel,
            getModelFile,
            getOffset,
            getMvpMatrix,
            getModelMatrix,
            Render,

            pageCallback,
            getCanvas,
            getContext,
            getImgData,
            debugLog,
            getWorldToScreen,

            addUIItem,
            addParam,
            caculateMatrix,

            texture,
            textureWidth,
            textureHeight,
            setTexture,
            loadTexture,
        }
    }
})

</script>

<style lang="less" scoped>
@import "./index.less";
</style>