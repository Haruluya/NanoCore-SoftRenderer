


// export class OffscreenRCanvas{
//     private canvas:HTMLCanvasElement;

//     constructor(width:number,height:number){
//         this.canvas = new OffscreenCanvas(width,height);
//     }

//     TransferBuffer() {
//         let image_bitmap = this.canvas.transferToImageBitmap();
//         postMessage({name:"TransferBuffer", buffer:image_bitmap},
//           [image_bitmap]);
//       }
// }