


        // Draw face and simple light.
        // model.value.getModel(texture.value).then(()=>{
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
        //                 new Vector3(inten255,intensity*255,intensity*255));
        //         }
        //     }
        //     ctx?.putImageData(imgData,0,0);
        // })


        
        // Draw with zbuffer.
        // model.value.getModel().then(()=>{
        //     for (let i=0; i< model.value.faces.length; i++) {
        //         let screenCoords:Array<Vector3> = []; let worldCoords:Array<Vector3> = [];
        //         for (let j =0; j < 3; j++){
        //             let point = model.value.vertIndex(
        //                 model.value.faces[i][j] - 1
        //             );
        //             worldCoords.push(point);

        //             // point = m2v(matrixMutiply(viewProjectionMatrix,v2m(point)));
        //             // point = m2v(matrixMutiply(modelMatrix,v2m(point)));
        //             point = worldToScreen(point);

        //             screenCoords.push(point)

        //         }
        //         let normal:Vector3 = vectorCross(
        //             vectorSubtract(worldCoords[1],worldCoords[0]),
        //             vectorSubtract(worldCoords[2],worldCoords[0])
        //         )

        //         normal = vectorNormalize(normal);
        //         let lightDir = new Vector3(0,0,1);
        //         let intensity = vectorMultiply(normal,lightDir);
             
        //         if (intensity > 0){
        //             DrawTriangleWithZBuffer(
        //                 zbuffer,
        //                 imgData,
        //                 screenCoords,
        //                 new Vector3(intensity*255,intensity*255,intensity*255));
        //         }
        //     }
        //     console.log(zbuffer)
        //     console.log("OVER");
        //     ctx?.putImageData(imgData,0,0);
        // })

                    // caculate normal.
                    // let normal:Vector3 = vectorCross(
                    //     vectorSubtract(worldCoords[1],worldCoords[0]),
                    //     vectorSubtract(worldCoords[2],worldCoords[0])
                    // )

                    
            // test.
            // model.value.getModel(texture.value).then(()=>{
            //     for (let i = 0.001; i < 1.; i += 0.001){
            //         for (let j = 0.001; j < 1.; j += 0.001){
            //             let color = getDiffuseByUV(model.value,new Vector2(i,j));
            //             DrawPoint(imgData,i*400,j*400,color);
            //         }
            //     }
            //     ctx?.putImageData(imgData,0,0);

            // })