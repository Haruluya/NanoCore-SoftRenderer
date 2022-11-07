<template>
    <div id="SoftRenderer">
        <canvas ref="canvas" width="500" height="500"/>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref,onMounted} from 'vue';
import { Model } from '../classes/model';
import { DrawLineByBresenham,DrawTriangleByEdgeTablePolygon,DrawTriangle,DrawLine} from '../classes/utils';
import { Point, Vector3 } from '../classes/point';
export default defineComponent({
  name: 'SoftRenderer',
  setup(){
    const canvas = ref<HTMLCanvasElement | any>();
    const model = ref<Model>(new Model(""));

    onMounted(()=>{
        if (canvas == null){
            console.log("Canvas not found!");
            return;
        }
        const ctx = canvas.value.getContext('2d');
        const imgData = ctx?.createImageData(canvas.value?.width,canvas.value?.height);
        




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
        model.value.getModel().then(()=>{
            for (let i=0; i< model.value.faces.length; i++) {
                let points:Array<Point> = [];
                for (let j =0; j < 3; j++){
                    let point = model.value.vertIndex(
                        model.value.faces[i][j] - 1
                    );
                    points.push(new Point(
                        Math.floor((point.X + 1) * canvas.value.width / 2),
                        Math.floor((point.Y + 1) * canvas.value.height / 2),
                    ))
                }
                console.log(points)
                DrawTriangleByEdgeTablePolygon(imgData,points,'');
            }
            ctx?.putImageData(imgData,0,0);
        })

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