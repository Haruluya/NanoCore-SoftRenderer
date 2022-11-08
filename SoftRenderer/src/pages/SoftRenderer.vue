<template>
    <div id="SoftRenderer">
        <canvas ref="canvas" width="800" height="800"/>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref,onMounted} from 'vue';
import { Model } from '../classes/model';
import { DrawLineByBresenham,DrawTriangleByEdgeTablePolygon,DrawTriangle,DrawLine,DrawTriangleWithZBuffer} from '../classes/utils';
import { Point, Vector2, Vector3 } from '../classes/point';
import {vectorMultiply,vectorSubtract,vectorNormalize,vectorCross,
        perspective,degToRad,lookAt,inverse,matrixMutiply,v2m,m2v,
        getTransformMatrix,mat4MutVec4
    
    } from '../classes/math'

export default defineComponent({
  name: 'SoftRenderer',
  setup(){
    const canvas = ref<HTMLCanvasElement | any>();
    const model = ref<Model>(new Model(""));
    const MAX_DEEP = 999;
    const MIN_DEEP = -999;
    const width  = 800;
    const height = 800;
    const depth  = 255;
    const camera = {
        target:new Vector3(0, 0, 0),
        position:new Vector3(0, 0, -1),
        up:new Vector3(0,1,0)
    };
    const perspectiveValue = {
        aspect:width/height,
        fieldOfViewRadians: degToRad(60),
        zNear: 1,
        zFar: 10,
    }
    let transform = {
        translation:[0,0,0],
        rotation:[degToRad(180),degToRad(180),degToRad(0)],
        scale:[1,1,1]
    }

    onMounted(()=>{
        if (canvas == null){
            console.log("Canvas not found!");
            return;
        }
        const ctx = canvas.value.getContext('2d');
        const imgData = ctx?.createImageData(canvas.value?.width,canvas.value?.height);
        
        let projectionMatrix = perspective(
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
        const worldToScreen = (point:Vector3):Vector3=>{
            return new Vector3(
                (point.X + 1.) * canvas.value.width / 4,
                (point.Y + 2.) * canvas.value.height / 4,
                point.Z
            )
        }

        let viewMatrix = inverse(cameraMatrix);
        let viewProjectionMatrix = matrixMutiply(viewMatrix,projectionMatrix);
        let modelMatrix = getTransformMatrix(transform);

        //Draw Lines.
        // model.value.getModel().then(()=>{
        //     for(let i = 0; i < model.value.faces.length; i++){

        //         for (let j =0; j < 3; j++){
        //             let v0 = model.value.vertIndex(
        //                 model.value.faces[i][j] - 1
        //             );
                    
        //             let v1 = model.value.vertIndex(
        //                 model.value.faces[i][(j+1)%3] - 1
        //             );

        //             let x0 = Math.floor((v0.X+1)*canvas.value.width/4);
        //             let y0 = Math.floor((v0.Y+2)*canvas.value.height/4);
        //             let x1 = Math.floor((v1.X+1)*canvas.value.width/4);
        //             let y1 = Math.floor((v1.Y+2)*canvas.value.height/4);
        //             // console.log(new Point(x0,y0),new Point(x1,y1))
        //             DrawLineByBresenham(imgData,new Point(x0,y0),new Point(x1,y1),"");
        //         }
                
        //     }
        //     ctx?.putImageData(imgData,0,0);
        // })

        // //Draw faces.
        // model.value.getModel().then(()=>{
        //     for (let i=0; i< model.value.faces.length; i++) {
        //         let points:Array<Point> = [];
        //         for (let j =0; j < 3; j++){
        //             let point = model.value.vertIndex(
        //                 model.value.faces[i][j] - 1
        //             );
        //             points.push(new Point(
        //                 Math.floor((point.X + 1) * canvas.value.width / 2),
        //                 Math.floor((point.Y + 1) * canvas.value.height / 2),
        //             ))
        //         }
        //         console.log(points)
        //         DrawTriangleByEdgeTablePolygon(imgData,points,'');
        //     }
        //     ctx?.putImageData(imgData,0,0);
        // })

        // model.value.getModel().then(()=>{
        //     for (let i=0; i< model.value.faces.length; i++) {
        //         let points:Array<Point> = [];

        //         for (let j =0; j < 3; j++){
        //             let point = model.value.vertIndex(
        //                 model.value.faces[i][j] - 1
        //             );
        //             points.push(new Point(
        //                 Math.round((point.X + 1.) * canvas.value.width / 4),
        //                Math.round((point.Y + 2.) * canvas.value.height / 4),
        //             ))
        //         }
        //         console.log(points)
        //         DrawTriangle(imgData,points[0],points[1],points[2]);
        //     }
        //     ctx?.putImageData(imgData,0,0);
        // })


        //Draw face and simple light.
        // model.value.getModel().then(()=>{
        //     for (let i=0; i< model.value.faces.length; i++) {
        //         let screenCoords:Array<Point> = []; let worldCoords:Array<Vector3> = [];
        //         for (let j =0; j < 3; j++){
        //             let point = model.value.vertIndex(
        //                 model.value.faces[i][j] - 1
        //             );
        //             screenCoords.push(new Point(
        //                 Math.round((point.X + 1) * canvas.value.width / 4),
        //                 Math.round((point.Y + 2) * canvas.value.height / 4),
        //                 ))
        //             worldCoords.push(point);
        //         }

        //         // focus on dir.
        //         let normal:Vector3 = vectorCross(
        //             vectorSubtract(worldCoords[1],worldCoords[0]),
        //             vectorSubtract(worldCoords[2],worldCoords[0])
        //         )

        //         normal = vectorNormalize(normal);
        //         let lightDir = new Vector3(0,0,1);
        //         let intensity = vectorMultiply(normal,lightDir);

        //         if (intensity > 0){
        //             DrawTriangleByEdgeTablePolygon(
        //                 imgData,
        //                 screenCoords,
        //                 new Vector3(intensity*255,intensity*255,intensity*255));
        //         }
        //     }
        //     ctx?.putImageData(imgData,0,0);
        // })

        let zbuffer:Array<number> = [];
        for (let i = 0; i < canvas.value.width * canvas.value.height; i++){
            zbuffer.push(-1 * MAX_DEEP);
        }

    

        // Draw with zbuffer.
        model.value.getModel().then(()=>{
            for (let i=0; i< model.value.faces.length; i++) {
                let screenCoords:Array<Vector3> = []; let worldCoords:Array<Vector3> = [];
                for (let j =0; j < 3; j++){
                    let point = model.value.vertIndex(
                        model.value.faces[i][j] - 1
                    );
                    worldCoords.push(point);

                    point = m2v(matrixMutiply(viewProjectionMatrix,v2m(point)));
                    point = m2v(matrixMutiply(modelMatrix,v2m(point)));
                    point = worldToScreen(point);

                    screenCoords.push(point)

                }
                let normal:Vector3 = vectorCross(
                    vectorSubtract(worldCoords[1],worldCoords[0]),
                    vectorSubtract(worldCoords[2],worldCoords[0])
                )

                normal = vectorNormalize(normal);
                let lightDir = new Vector3(0,0,1);
                let intensity = vectorMultiply(normal,lightDir);
             
                if (intensity > 0){
                    DrawTriangleWithZBuffer(
                        zbuffer,
                        imgData,
                        screenCoords,
                        new Vector3(intensity*255,intensity*255,intensity*255));
                }
            }
            console.log(zbuffer)
            console.log("OVER");
            ctx?.putImageData(imgData,0,0);
        })


        // DrawTriangleWithZBuffer(
        //                 zbuffer,
        //                 imgData,
        //                 [new Vector3(0,0,0),new Vector3(100,100,0),new Vector3(200,0,0)],
        //                 new Vector3(0*255,0*255,0*255));

        ctx?.putImageData(imgData,0,0);



    })
    return{
        canvas,
    }
  }
});
</script>
<style lang="less" scoped>
@import "./SoftRenderer.less";
</style>