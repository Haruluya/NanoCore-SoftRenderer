import{V as E,f as N,B as k,i as R,d as b,n as P,r as O,u as S,j as ee,m as q,k as G,_ as ae,o as le,b as te,e as re}from"./index.a15bf386.js";import{E as fe,P as oe}from"./poloygon.960524dd.js";import{P as J}from"./point.6a53762d.js";const K=9999;let Q;const ce=r=>{Q=r};let x=[],D=0;const ue=(r,l)=>{D=r;for(let t=0;t<r*l;t++)x.push(-1*K)},$=()=>{for(let r=0;r<x.length;r++)x[r]=-1*K},F=(r,l,t,f)=>{let c=r.data;if(l>r.width||l<0||t>r.height||t<0)return;l=Math.floor(l),t=Math.floor(t);const u=(l+t*r.width)*4;c[u+0]=f.X,c[u+1]=f.Y,c[u+2]=f.Z,c[u+3]=255},j=(r,l,t,f,c)=>{let u=[[...t[0]],[...t[1]],[...t[2]]],C=[[...l[0]],l[1],l[2]];const h=new oe(l);if(h.size()<3)return;let i,p=0,n=0,s,o,m,a,Z,Y,y={},I=[],_=[],w,M,v;Z=h.minPointY(),Y=h.maxPointY(),a=Y-Z;for(let g=0;g<h.size();g++)g<h.size()-1?(w=h.indexValue(g),M=h.indexValue(g+1)):(w=h.indexValue(g),M=h.indexValue(0)),w.Y>M.Y&&(m=w,w=M,M=m),w.Y!=M.Y&&(v=new fe(w.X,(M.X-w.X)/(M.Y-w.Y),M.Y-1),y[w.Y-Z]||(y[w.Y-Z]=[]),y[w.Y-Z].push(v));for(let g=0;g<a;g++){if(s=g+Z,y[g]&&y[g].forEach(d=>{I.push(d)}),y[g]=null,I)for(let d=0;d<I.length;)I[d].Ymax<s?I.splice(d,1):d++;if(I){for(I.forEach(d=>{_.push(d.X),d.X=d.X+d.Dx}),_.sort(),i=0;i<_.length;i++)i%2==0&&(o=_[i],_[i]-o?p=o+1:p=o,n=_[i+1]),se(r,new J(p,s),new J(n,s),C,u,f,c);_=[]}}y=[]};let X=new E(0,0,1),V=new E(0,0,0),z=new N(0,0),e=new E(0,0,0);const se=(r,l,t,f,c,u,C)=>{let h=null,i,p,n=0,s=-.5,o=[],m=0;if(l[1]==t[1]){for(l[0]>t[0]&&(h=l,l=t,t=h),p=l[0];p<t[0];p++){e[0]=p,e[1]=l[1],e.Z=0,o=k(f[0],f[1],f[2],e);for(let a=0;a<3;a++)e.Z+=f[a][2]*o[a],V[a]=c[0][a]*o[0]+c[1][a]*o[1]+c[2][a]*o[2];z[0]=u[0][0]*o[0]+u[1][0]*o[1]+u[2][0]*o[2],z[1]=u[0][1]*o[0]+u[1][1]*o[1]+u[2][1]*o[2],C=Q.getDiffuseByUV(z),m=R(V,X),x[Math.floor(e[0]+e[1]*D)]<e.Z&&(x[Math.floor(e[0]+e[1]*D)]=e.Z,F(r,e[0],e[1],C.mutiply(m)))}return}if(l[0]==t[0]){for(l[1]>t[1]&&(h=l,l=t,t=h),n=l[1];n<t[1];n++){e[0]=l[0],e[1]=n,e.Z=0,o=k(f[0],f[1],f[2],e);for(let a=0;a<3;a++)e.Z+=f[a][2]*o[a],V[a]=c[0][a]*o[0]+c[1][a]*o[1]+c[2][a]*o[2];m=R(V,X),x[Math.floor(e[0]+e[1]*D)]<e.Z&&(x[Math.floor(e[0]+e[1]*D)]=e.Z,F(r,e[0],e[1],C.mutiply(m)))}return}if(i=(t[1]-l[1])/(t[0]-l[0]),i>0&&i<=1)for(l[0]>t[0]&&(h=l,l=t,t=h),s=-.5,p=l[0],n=l[1];p<t[0];){{e[0]=p,e[1]=n,e.Z=0,o=k(f[0],f[1],f[2],e);for(let a=0;a<3;a++)e.Z+=f[a][2]*o[a],V[a]=c[0][a]*o[0]+c[1][a]*o[1]+c[2][a]*o[2];m=R(V,X),x[Math.floor(e[0]+e[1]*D)]<e.Z&&(x[Math.floor(e[0]+e[1]*D)]=e.Z,F(r,e[0],e[1],C.mutiply(m)))}s=s+i,s>0&&(n++,s=s-1),p++}else if(i>=-1&&i<0)for(l[0]>t[0]&&(h=l,l=t,t=h),s=.5,p=l[0],n=l[1];p<t[0];){{e[0]=p,e[1]=n,e.Z=0,o=k(f[0],f[1],f[2],e);for(let a=0;a<3;a++)e.Z+=f[a][2]*o[a],V[a]=c[0][a]*o[0]+c[1][a]*o[1]+c[2][a]*o[2];m=R(V,X),x[Math.floor(e[0]+e[1]*D)]<e.Z&&(x[Math.floor(e[0]+e[1]*D)]=e.Z,F(r,e[0],e[1],C.mutiply(m)))}s=s+i,s<0&&(n--,s=s+1),p++}else if(i>1)for(l[1]>t[1]&&(h=l,l=t,t=h),s=-.5,p=l[0],n=l[1];n<t[1];){{e[0]=p,e[1]=n,e.Z=0,o=k(f[0],f[1],f[2],e);for(let a=0;a<3;a++)e.Z+=f[a][2]*o[a],V[a]=c[0][a]*o[0]+c[1][a]*o[1]+c[2][a]*o[2];m=R(V,X),x[Math.floor(e[0]+e[1]*D)]<e.Z&&(x[Math.floor(e[0]+e[1]*D)]=e.Z,F(r,e[0],e[1],C.mutiply(m)))}s=s+1/i,s>0&&(p=p+1,s=s-1),n++}else for(l[1]>t[1]&&(h=l,l=t,t=h),s=.5,p=l[0],n=l[1];n<t[1];){{e[0]=p,e[1]=n,e.Z=0,o=k(f[0],f[1],f[2],e);for(let a=0;a<3;a++)e.Z+=f[a][2]*o[a],V[a]=c[0][a]*o[0]+c[1][a]*o[1]+c[2][a]*o[2];m=R(V,X),x[Math.floor(e[0]+e[1]*D)]<e.Z&&(x[Math.floor(e[0]+e[1]*D)]=e.Z,F(r,e[0],e[1],C.mutiply(m)))}s=s+1/i,s<0&&(p--,s=s+1),n++}},he=r=>{let l=/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/,t=r.toLowerCase();if(l.test(t)){if(t.length===4){let c="#";for(let u=1;u<4;u+=1)c+=t.slice(u,u+1).concat(t.slice(u,u+1));t=c}let f=[];for(let c=1;c<7;c+=2)f.push(parseInt("0x"+t.slice(c,c+2)));return f}else return[0,0,0]},pe="/NanoCore-SoftRenderer/assets/diffuse.6f6f495f.png",ie={category:"SoftwareRenderer",name:"Texture",buttonContent:"\u67E5\u770B\u6E90\u7801",title:"UV\u4E0E\u8D34\u56FE",content:"UV and texture."},ne=b({name:"Texture",components:{nano_cg_experiment_page:P},setup(){const r=O();let l,t,f=O(),c,u,C,h=[],i=!1;const p=()=>{var Y,y;l=r.value.getCanvas(),t=r.value.getContext(),f=r.value.getModel(),c=r.value.getImgData(),u=r.value.getSectionParams(),C=(Y=f.value)!=null&&Y.getVertByFaceMap?(y=f.value)==null?void 0:y.getVertByFaceMap:(I,_)=>E;const Z=new E(0,0,1);ue(l.width,l.height),r.value.addParam({name:"lightDir",value:Z}),r.value.addUIItem({type:"slider-vector",id:"lightDir",value:u.lightDir,min:{0:-100,1:-100,2:-100},max:{0:100,1:100,2:100},callback:S.globalUiCallbacks.updateVector3(u,r.value.Render,"lightDir")}),r.value.addUIItem({type:"slider-vector",id:"translation",value:u.transform.translation,min:{0:-300,1:-300,2:-300},max:{0:300,1:300,2:300},callback:S.globalUiCallbacks.updateChildVector3(u,r.value.Render,"transform","translation")}),r.value.addUIItem({type:"slider-vector",id:"rotation",value:u.transform.rotation,min:{0:-300,1:-300,2:-300},max:{0:300,1:300,2:300},callback:S.globalUiCallbacks.updateChildVector3(u,r.value.Render,"transform","rotation")}),r.value.addUIItem({type:"slider-vector",id:"scale",value:u.transform.scale,min:{0:-200,1:-200,2:-200},max:{0:200,1:200,2:200},callback:S.globalUiCallbacks.updateChildVector3(u,r.value.Render,"transform","scale")})},n=()=>{r.value.caculateMatrix(),r.value.setTexture("diffuse",pe),i?s[r.value.getDrawModel()]():r.value.loadTexture().then(()=>{ce(f.value),s[r.value.getDrawModel()]()})},s={ImgData:()=>{c=t.createImageData(l.width,l.height),o(j,j,[c]),t.putImageData(c,0,0)}},o=(Z,Y,y)=>{var g;const I=he(u.color);let _=new E(I[0],I[1],I[2]),w=r.value.getMvpMatrix();new E(u.lightDir[0],u.lightDir[1],u.lightDir[2]);let M=[],v=new E(0,0,0);if(i)console.log("cache"),$(),h.forEach(d=>{M=[];for(let B=0;B<3;B++)v=q(G(w,d.worldPoints[B].getMatrix())),M.push(v.getVec3().toIntVec());j(c,M,d.vertNormals,d.vertsUV,_)});else{let d=[],B=[],T=[];(g=f.value)==null||g.facetVrt.forEach((me,A)=>{var L,W,H;M=[],d=[],B=[],T=[];for(let U=0;U<3;U++)v=new ee(C.call(f.value,A,U),1),d.push(v),v=q(G(w,v.getMatrix())),M.push(v.getVec3().toIntVec()),B.push((L=f.value)==null?void 0:L.getNormalByFaceMap(A,U)),(W=f.value)!=null&&W.getUVByFaceMap(A,U)&&T.push((H=f.value)==null?void 0:H.getUVByFaceMap(A,U));h.push({worldPoints:d,vertNormals:B,vertsUV:T}),Z(...y,M,B,T,_)}),i=!0}};return{desData:ie,page:r,Init:p,Render:n,ModelChange:()=>{$(),h=[],i=!1},DrawModelChange:Z=>{console.log("change model"),$(),cameraCache=[],i=!1,Z()}}}});function de(r,l,t,f,c,u){const C=re("nano_cg_experiment_page");return le(),te(C,{prop_des_data:r.desData,prop_page_config:{mutiMode:!1,offset:!1},onInit:r.Init,onRender:r.Render,onModelChange:r.ModelChange,onDrawModelChange:r.DrawModelChange,ref:"page"},null,8,["prop_des_data","onInit","onRender","onModelChange","onDrawModelChange"])}const xe=ae(ne,[["render",de]]);export{xe as default};