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
    public facetVrt:Array<number> = [];
    public facetTex:Array<number> = [];
    public facetNrm:Array<number> = [];

    public faces:Array<Array<number>> =[]

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
                    return;
                }    
                const ctx = texture.getContext('2d');

                const imgData = ctx?.getImageData(0,0,texture.width,texture.height);
                console.log(imgData,"txture");

                this.diffuse = imgData?.data;

                const response = await fetch('./static/obj/head.obj');  
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
    nfaces():number{
        return this.facetVrt.length;
    }
    faceVrtIndex(index:number):number{
        return this.facetVrt[index];
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

                parts.forEach((element)=>{
                    const ptn = element.split('/');
                    if (ptn.length < 3){
                        console.log("ptn length < 3 !!!");
                    }
                    this.facetVrt.push(parseInt(ptn[0]));
                    this.facetNrm.push(parseInt(ptn[2]));
                    this.facetTex.push(parseInt(ptn[1]));

                    faceV.push(parseInt(ptn[0]));
                })

                this.faces.push([faceV[0],faceV[1],faceV[2]]);

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