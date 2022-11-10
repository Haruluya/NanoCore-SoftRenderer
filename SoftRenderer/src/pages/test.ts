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

        // model.value.getModel(texture.value).then(()=>{
        //     for (let i=0; i< model.value.faces.length; i++) {
        //         let points:Array<Point> = [];

        //         for (let j =0; j < 3; j++){
        //             let point = model.value.vertIndex(
        //                 model.value.faces[i][j] - 1
        //             );
        //             points.push(new Point(
        //                 Math.floor((point.X + 1.) * canvas.value.width / 4),
        //                Math.floor((point.Y + 2.) * canvas.value.height / 4),
        //             ))
        //         }
        //         DrawTriangle(imgData,points[0],points[1],points[2]);
        //     }
        //     ctx?.putImageData(imgData,0,0);
        // })


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