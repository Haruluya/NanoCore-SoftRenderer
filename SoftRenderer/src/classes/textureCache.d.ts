import { Vector2 } from "./vector2";

export interface TextureCache{
    worldPoints:Array<Vector4>;
    vertNormals:Array<Vector3>;
    vertsUV:Array<Vector2>;
}