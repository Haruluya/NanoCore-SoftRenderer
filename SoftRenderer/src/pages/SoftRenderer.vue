<template>
    <div id="SoftRenderer">
        <canvas class="show" ref="canvas" :width="width" :height="height"/>
        <canvas class="textureCanvas" ref="texture" :width="textureWidth" :height="textureHeight">
        </canvas>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref,onMounted} from 'vue';
import { Model } from '../classes/model';

import { 
    DrawLineByBresenham,
    DrawTriangleByEdgeTablePolygon,
    DrawTriangle,
    DrawLine,
    DrawTriangleWithZBuffer,
    DrawTriangleWithUV,
    InitZBuffer,
    DrawTriangleWithShader
} from '../classes/utils';

import { 
    Point, 
    Vector2, 
    Vector3,
    Vector4 
} from '../classes/point';

import {
    vectorMultiply,
    vectorSubtract,
    vectorNormalize,
    vectorCross,
    perspective,
    degToRad,
    lookAt,
    inverse,
    matrixMutiply,
    v2m,
    m2v,
    getTransformMatrix,mat4MutVec4,    
} from '../classes/math'

import diffuse from "../../static/texture/diffuse.png"
import {InitShaderContext} from "../classes/shaders/shader"
import {BasicPerVertexShader} from "../classes/shaders/basicPerVertexShader"
import {FlatShader} from "../classes/shaders/flatShader"

export default defineComponent({
  name: 'SoftRenderer',
  setup(){

    const texture = ref<HTMLCanvasElement | any>();
    const canvas = ref<HTMLCanvasElement | any>();

    const model = ref<Model>(new Model(""));

    const width  = ref<number>(800);
    const height = ref<number>(800);
    const textureWidth = ref<number>(1024);
    const textureHeight = ref<number>(1024);

    let basicPerVertexShader = new BasicPerVertexShader();
    let flatShader = new FlatShader();

    let camera = {
        target:new Vector3(0, 0, 0),
        position:new Vector3(0, 0, -1),
        up:new Vector3(0,1,0)
    };
    
    let perspectiveValue = {
        aspect:width.value/height.value,
        fieldOfViewRadians: degToRad(60),
        zNear: 1,
        zFar: 10,
    }

    let transform = {
        translation:[0,0,0],
        rotation:[degToRad(180),degToRad(180),degToRad(0)],
        scale:[1,1,1]
    }

    let projectionMatrix:Float32Array = new Float32Array([]);
    let viewMatrix:Float32Array = new Float32Array([]);
    let modelMatrix:Float32Array = new Float32Array([]);

    let lightDir = new Vector3(0,0,1);


    onMounted(()=>{
        if (!canvas){
            console.log("Canvas not found!");
            return;
        }
        const ctx = canvas.value.getContext('2d');
        const imgData = ctx?.createImageData(canvas.value?.width,canvas.value?.height);
        
        InitZBuffer(width.value,height.value);

        projectionMatrix = perspective(
            perspectiveValue.fieldOfViewRadians,
            perspectiveValue.aspect,
            perspectiveValue.zNear,
            perspectiveValue.zFar
        )

        let cameraMatrix = lookAt(
            camera.position,
            camera.target,
            camera.up
        )

        viewMatrix = inverse(cameraMatrix);
        let viewProjectionMatrix = matrixMutiply(viewMatrix,projectionMatrix);
        modelMatrix = getTransformMatrix(transform);



        //texture.
        const ctx2 = texture.value.getContext('2d');
        const img = new Image();
        img.src = diffuse;
        img.onload = ()=>{
            ctx2?.drawImage(img,0,0);
            // Render.
            model.value.getModel(texture.value).then(()=>{

                InitShaderContext(model.value);
                //per face.
                model.value.facetVrt.forEach((e,index)=>{
                    //per vertex.
                    let screenCoords:Array<Vector4> = []; 
                        
                    for (let i = 0; i < 3; i++){

                        flatShader.setUnifrom('unifromProjectionMatrix',projectionMatrix);
                        flatShader.setUnifrom('unifromModelMatrix',modelMatrix);
                        flatShader.setUnifrom('unifromViewMatrix',viewMatrix);
                        flatShader.setUnifrom('unifromLightDir',lightDir);
                        
                        screenCoords.push(
                            flatShader.vertex(index*3,i)
                        )
     

                    }
                    DrawTriangleWithShader(
                        flatShader,
                        imgData,
                        screenCoords,
                    )

                })
                console.log("OVER");
                ctx?.putImageData(imgData,0,0);
     

            })
        }
        ctx?.putImageData(imgData,0,0);



    })
    return{
        canvas,
        texture,
        diffuse,
        width,
        height,
        textureWidth,
        textureHeight
    }
  },

});
</script>
<style lang="less" scoped>
@import "./SoftRenderer.less";
</style>