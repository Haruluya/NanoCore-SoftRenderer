import { Vector3,Vector2} from "./point";
import diffuse from "../../static/texture/diffuse.png"
/*
@author:Haruluya.
@des:Simple model(.obj).
*/
type Path = string;



export class Model{
    //Array of vertices.
    private verts:Array<Vector3> = [];
    //per-vertex array of tex coords.
    public texCoord:Array<Vector2> = [];
    // per-vertex array of normal vectors
    public norms:Array<Vector3> = [];
    // per-triangle indices in the above arrays.
    public facetVrt:Array<Vector3> = [];
    public facetTex:Array<Vector2> = [];
    public facetNrm:Array<Vector3> = [];

    public faces:Array<Vector3> =[]

    public diffuse?:Uint8ClampedArray;

    // Diffuse color texture.
    private diffusemap:Path = '';
    // normal map texture.
    private normalmap:Path = '';
    // specular map texture.
    private specularmap:Path = '';

    //init model.
    constructor(filename:Path){
    } 

    async getModel(texture?:HTMLCanvasElement):Promise<void>{
        return new Promise<void>(async (resolve,reject)=>{
            // https://webglfundamentals.org/webgl/resources/models/cube/cube.obj
                if(!texture){
                    console.log("TXTURE NONE")
                }    
                // const ctx = texture.getContext('2d');

                // const imgData = ctx?.getImageData(0,0,texture.width,texture.height);
                // console.log(imgData,"txture");

                // this.diffuse = imgData?.data;

                const response = await fetch('./static/obj/assassin/assassin.obj');  
                const text:string = await response.text();
                this.parseOBJ(text);
                console.log("THIS",this);
                if (response){
                    resolve()
                }else{
                    reject()
                }
            }
        );

    }

    nverts():number{
        return this.verts.length;
    }
    vertIndex(index:number):Vector3{
        return this.verts[index];
    }
    texIndex(index:number):Vector2{
        return this.texCoord[index];
    }
    normalIndex(index:number):Vector3{
        return this.norms[index];
    }
    nfaces():number{
        return this.facetVrt.length;
    }
    // faceVrtIndex(index:number):number{
    //     return this.facetVrt[index];
    // }
    getVertByFaceMap(nindex:number,index:number):Vector3{
        return this.vertIndex(this.faces[nindex*3+index][0]);
    }
    getUVByFaceMap(nindex:number,index:number):Vector2{
        return this.texIndex(this.faces[nindex*3+index][1]);
    }
    getNormalByFaceMap(nindex:number,index:number):Vector3{
        return this.normalIndex(this.faces[nindex*3+index][2]);
    }

    getDiffuseByUV(uv:Vector2):Vector3{
        let x = Math.floor(uv.X * 1023);
        // Be careful ! V dirction is inversed!
        let y = Math.floor((1- uv.Y) * 1023);
        // you can`t using float uv!!!
        if (!this.diffuse){
            console.log("DIFFUSE NOT FOUND!")
            return new Vector3(0,0,0);
        }else{
            return new Vector3(
                this.diffuse[(x+y*1024)*4 + 0],
                this.diffuse[(x+y*1024)*4 + 1],
                this.diffuse[(x+y*1024)*4 + 2],
            )
        }
    }

    parseOBJ(text:string) {


        const handles = {
            v:(parts:Array<string>)=>{
                if (parts.length < 3){
                    console.log("v parts length < 3 !!!");
                    return;
                }
                this.verts.push(new Vector3(parseFloat(parts[0]),parseFloat(parts[1]),parseFloat(parts[2])));
            },
            vn:(parts:Array<string>)=>{
                if (parts.length < 3){
                    console.log("vn parts length < 3 !!!");
                    return;
                }
                this.norms.push(new Vector3(parseFloat(parts[0]),parseFloat(parts[1]),parseFloat(parts[2])));
            },
            vt:(parts:Array<string>)=>{
                if (parts.length < 2){
                    console.log("vt parts length < 2 !!!");
                    return;
                }
                this.texCoord.push(new Vector2(parseFloat(parts[0]) ,parseFloat(parts[1])));
            },
            f:(parts:Array<string>)=>{
                let faceV:Array<number> = [];
                let faceN:Array<number> = [];
                let faceT:Array<number> = [];
                parts.forEach((element)=>{
                    const ptn = element.split('/');
                    const ptnNum:Array<number> = []
                    if (ptn.length < 3){
                        console.log("ptn length < 3 !!!");
                    }

                    ptn.forEach((e)=>{
                        ptnNum.push(parseInt(e) - 1);
                    })

                    faceV.push(ptnNum[0]);
                    faceT.push(ptnNum[1]);
                    faceN.push(ptnNum[2]);
                    this.faces.push(new Vector3(ptnNum[0],ptnNum[1],ptnNum[2]));
                })

              
                this.facetVrt.push(new Vector3(faceV[0],faceV[1],faceV[2]));
                this.facetTex.push(new Vector3(faceT[0],faceT[1],faceT[2]));
                this.facetNrm.push(new Vector3(faceN[0],faceN[1],faceN[2]));
            },
          };

        // handle by line.
        const keywordRE = /(\w*)(?: )*(.*)/;
        const lines = text.split('\n');
        for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
            const line = lines[lineNo].trim();
            if (line === '' || line.startsWith('#')) {
            continue;
            }
            const m = keywordRE.exec(line);
            if (!m) {
            continue;
            }
            const [, keyword, unparsedArgs] = m;
            const parts = line.split(/\s+/).slice(1);
            const handler = handles[keyword];
            if (!handler) {
                console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
                continue;
            }
            handler(parts, unparsedArgs);
        }
    }
}