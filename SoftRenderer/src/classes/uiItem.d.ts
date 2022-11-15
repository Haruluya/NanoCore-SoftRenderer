export interface UIItem{
    type:string,
    id:string,
    default?:any,
    value:any,
    callback:any,
    min?:{x:number,y:number};
    max?:{x:number,y:number};
}