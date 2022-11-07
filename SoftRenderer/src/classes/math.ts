
import { Vector3} from "./point";
export const Barycentric = (A:Vector3,B:Vector3,C:Vector3,P:Vector3)=>{
    let s:Array<Vector3> = [];
    for (let i=2; i--; ) {
        s[i][0] = C[i]-A[i];
        s[i][1] = B[i]-A[i];
        s[i][2] = A[i]-P[i];
    }
    let u:Vector3 = cross(s[0],s[1]);
    if (Math.abs(u.Z)>1e-2)
        return new Vector3(1.-(u.X+u.Y)/u.Z, u.Y/u.Z, u.X/u.Z);

    return new Vector3(-1,1,1);
}

function cross(a:Vector3, b:Vector3) {
    return new Vector3(a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]);
  }