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
                @mousedown="uiSetting.panelDrag(this.sidePanelPos,'mainPanel',$event)" >
                <nano_param_panel
                    :prop_ui_setter="prop_ui_setter"
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
                    @mousedown="uiSetting.panelDrag(this.sidePanelPos,'debugPanel',$event)">
                    <nano_param_output_panel
                        prop_title="Debug"
                        :prop_slot_id="slotID.DEBUG_IN_SLOT_ID"
                        :prop_content="prop_section_params.debugContent"
                    />
                </div>
            </transition>
        </div>
    </div>
</template>
<script>

/*
    @author:haruluya.
    @des:This component is used to make the source code more concise.
*/

const slotID = {
    MAIN_PANEL_SLOT_ID : 1,
    DEBUG_IN_SLOT_ID : 2,
    DEBUG_OUT_SLOT_ID : 3,
    CORE_SLOT_TOP_ID : 4
}

import uiSetting from "./ui-setting"
export default {

    name:"nano_cg_experiment_page",
    data() {
        return {
            uiSetting,
   
            //vue watching data.
            sidePanelPos:{
                mainPanel:{ x: 1050, y: 150 },
                debugPanel:{x:1200, y:400}
            },
            showDebug:false,
            debugContent:null,
            slotID,
            }

    },

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
        prop_ui_setter:{
            type:Array,
            default:[],
            required:true
        },
        prop_section_params:{
            type:Object,
            default:{
            },
            required:true
        }
    },
    mounted(){
        if (document.body.clientWidth < 992){
            this.sidePanelPos.mainPanel = { x: 150, y: 150 };
            this.sidePanelPos.debugPanel = {x:120, y:400};
        }
    },
    methods:{
        Init(){
            uiSetting.resizeCanvasToDisplaySize(this.getCanvas());
        },
        Render(){
            uiSetting.resizeCanvasToDisplaySize(this.getCanvas());
        },
        Destroy() {
            uiSetting.destroy();
        },
        SetUI(){
            uiSetting.setDefaultUI(this);
        },
        getCanvas(){
            return this.$refs.nanoCanvas.$refs.canvas;
        },
        pageCallback() {
            return {
                handleClick: () => {
                    window.location.href =
                        "https://github.com/Haruluya/NanoCore-SoftRenderer/tree/master/SoftRenderer/src/pages/"+this.prop_des_data.name+"/index.vue";
                },
                showDebugPanel: () => {
                    this.showDebug = !this.showDebug;
                    if (this.showDebug) {
                        this.$nextTick(() => {
                            uiSetting.setDebugPanelCon(this);
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
        }
    },
    unmounted(){
        this.Destroy();
    }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>