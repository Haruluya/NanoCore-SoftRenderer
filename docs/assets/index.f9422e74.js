import{d as O,n as d,r as $,V as k,u as j,v as q,g as J,h as N,i as U,_ as K,o as Q,b as S,e as z}from"./index.36e2076f.js";import{E as W,P as H}from"./poloygon.960524dd.js";import{P as F}from"./point.4d2fb8c9.js";let Z=[];const g=(s,e)=>{Z=[];let r=Math.floor(s.width/e)-1,u=Math.floor(s.height/e)-1;for(let l=0;l<r*u;l++)Z.push(!1)},R=(s,e,r,u)=>{let l=s.data;if(e>s.width||e<0||r>s.height||r<0)return;e=Math.floor(e),r=Math.floor(r);const a=(e+r*s.width)*4;l[a+0]=u.X,l[a+1]=u.Y,l[a+2]=u.Z,l[a+3]=255},i=(s,e,r,u)=>{let l=Math.floor(u/e),a=Math.floor(r/e);for(let f=0;f<l;f++)s.beginPath(),s.moveTo(0,e*f),s.lineTo((a-1)*e,e*f),s.strokeStyle="#ccc",s.stroke();for(let f=0;f<a;f++)s.beginPath(),s.moveTo(e*f,0),s.lineTo(e*f,(l-1)*e),s.strokeStyle="#ccc",s.stroke()},n=(s,e,r,u,l)=>{s.fillStyle="rgb("+l.X+","+l.Y+","+l.Z+")",s.beginPath(),s.moveTo(e.X,e.Y),s.lineTo(r.X,r.Y),s.lineTo(u.X,u.Y),s.fill()},b=(s,e,r,u,l)=>{const a=new H([e,r,u]);if(a.size()<3)return;let f,p=0,t=0,c,Y,h,T,_,B,v={},D=[],C=[],X,m,M;_=a.minPointY(),B=a.maxPointY(),T=B-_;for(let o=0;o<a.size();o++)o<a.size()-1?(X=a.indexValue(o),m=a.indexValue(o+1)):(X=a.indexValue(o),m=a.indexValue(0)),X.Y>m.Y&&(h=X,X=m,m=h),X.Y!=m.Y&&(M=new W(X.X,(m.X-X.X)/(m.Y-X.Y),m.Y-1),v[X.Y-_]||(v[X.Y-_]=[]),v[X.Y-_].push(M));for(let o=0;o<T;o++){if(c=o+_,v[o]&&v[o].forEach(w=>{D.push(w)}),v[o]=null,D)for(let w=0;w<D.length;)D[w].Ymax<c?D.splice(w,1):w++;if(D){for(D.forEach(w=>{C.push(w.X),w.X=w.X+w.Dx}),C.sort(),f=0;f<C.length;f++)f%2==0&&(Y=C[f],C[f]-Y?p=Y+1:p=Y,t=C[f+1]),P(s,new F(p,c),new F(t,c),l);C=[]}}v=[]},P=(s,e,r,u)=>{let l=null,a,f,p=0,t=-.5;if(e.Y==r.Y){for(e.X>r.X&&(l=e,e=r,r=l),f=e.X;f<r.X;f++)R(s,f,e.Y,u);return}if(e.X==r.X){for(e.Y>r.Y&&(l=e,e=r,r=l),p=e.Y;p<r.Y;p++)R(s,e.X,p,u);return}if(a=(r.Y-e.Y)/(r.X-e.X),a>0&&a<=1)for(e.X>r.X&&(l=e,e=r,r=l),t=-.5,f=e.X,p=e.Y;f<r.X;)R(s,f,p,u),t=t+a,t>0&&(p++,t=t-1),f++;else if(a>=-1&&a<0)for(e.X>r.X&&(l=e,e=r,r=l),t=.5,f=e.X,p=e.Y;f<r.X;)R(s,f,p,u),t=t+a,t<0&&(p--,t=t+1),f++;else if(a>1)for(e.Y>r.Y&&(l=e,e=r,r=l),t=-.5,f=e.X,p=e.Y;p<r.Y;)R(s,f,p,u),t=t+1/a,t>0&&(f=f+1,t=t-1),p++;else for(e.Y>r.Y&&(l=e,e=r,r=l),t=.5,f=e.X,p=e.Y;p<r.Y;)R(s,f,p,u),t=t+1/a,t<0&&(f--,t=t+1),p++},ee=(s,e,r,u,l,a,f,p)=>{const t=new H([l,a,f]);if(t.size()<3)return;let c,Y=0,h=0,T,_,B,v,D,C,X={},m=[],M=[],o,w,E;D=t.minPointY(),C=t.maxPointY(),v=C-D;for(let I=0;I<t.size();I++)I<t.size()-1?(o=t.indexValue(I),w=t.indexValue(I+1)):(o=t.indexValue(I),w=t.indexValue(0)),o.Y>w.Y&&(B=o,o=w,w=B),o.Y!=w.Y&&(E=new W(o.X,(w.X-o.X)/(w.Y-o.Y),w.Y-1),X[o.Y-D]||(X[o.Y-D]=[]),X[o.Y-D].push(E));for(let I=0;I<v;I++){if(T=I+D,X[I]&&X[I].forEach(y=>{m.push(y)}),X[I]=null,m)for(let y=0;y<m.length;)m[y].Ymax<T?m.splice(y,1):y++;if(m){for(m.forEach(y=>{M.push(y.X),y.X=y.X+y.Dx}),M.sort(),c=0;c<M.length;c++)c%2==0&&(_=M[c],M[c]-_?Y=_+1:Y=_,h=M[c+1]),ae(s,e,r,u,new F(Y,T),new F(h,T),p);M=[]}}X=[]},ae=(s,e,r,u,l,a,f)=>{let p=null,t,c,Y=0,h=-.5;if(l.Y==a.Y){for(l.X>a.X&&(p=l,l=a,a=p),c=l.X;c<a.X;c++)A(s,e,c,l.Y,r,u,f);return}if(l.X==a.X){for(l.Y>a.Y&&(p=l,l=a,a=p),Y=l.Y;Y<a.Y;Y++)A(s,e,l.X,Y,r,u,f);return}if(t=(a.Y-l.Y)/(a.X-l.X),t>0&&t<=1)for(l.X>a.X&&(p=l,l=a,a=p),h=-.5,c=l.X,Y=l.Y;c<a.X;)A(s,e,c,Y,r,u,f),h=h+t,h>0&&(Y++,h=h-1),c++;else if(t>=-1&&t<0)for(l.X>a.X&&(p=l,l=a,a=p),h=.5,c=l.X,Y=l.Y;c<a.X;)A(s,e,c,Y,r,u,f),h=h+t,h<0&&(Y--,h=h+1),c++;else if(t>1)for(l.Y>a.Y&&(p=l,l=a,a=p),h=-.5,c=l.X,Y=l.Y;Y<a.Y;)A(s,e,c,Y,r,u,f),h=h+1/t,h>0&&(c=c+1,h=h-1),Y++;else for(l.Y>a.Y&&(p=l,l=a,a=p),h=.5,c=l.X,Y=l.Y;Y<a.Y;)A(s,e,c,Y,r,u,f),h=h+1/t,h<0&&(c--,h=h+1),Y++},A=(s,e,r,u,l,a,f)=>{if(r>Math.floor(l/e)-1||r<0||u>Math.floor(a/e)-1||u<0)return;let p=r*e,t=u*e;s.fillStyle="rgb("+f[0]+","+f[1]+","+f[2]+")",s.fillRect(p,t,e,e)},le=s=>{let e=/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/,r=s.toLowerCase();if(e.test(r)){if(r.length===4){let l="#";for(let a=1;a<4;a+=1)l+=r.slice(a,a+1).concat(r.slice(a,a+1));r=l}let u=[];for(let l=1;l<7;l+=2)u.push(parseInt("0x"+r.slice(l,l+2)));return u}else return[0,0,0]},re={category:"SoftwareRenderer",name:"DrawFaces",buttonContent:"\u67E5\u770B\u6E90\u7801",title:"\u7ED8\u5236\u6A21\u578B\u9762",content:"Draw model faces."},se=O({name:"DrawFaces",components:{nano_cg_experiment_page:d},setup(){const s=$();let e,r,u=$(),l,a,f,p,t=[];const c=()=>{var C,X;e=s.value.getCanvas(),r=s.value.getContext(),u=s.value.getModel(),l=s.value.getImgData(),a=s.value.getSectionParams(),f=s.value.getWorldToScreen,p=(C=u.value)!=null&&C.getVertByFaceMap?(X=u.value)==null?void 0:X.getVertByFaceMap:(m,M)=>k;const v=new k(0,0,1),D=!1;s.value.addParam({name:"normal",value:D}),s.value.addParam({name:"lightDir",value:v}),s.value.addUIItem({type:"checkbox",id:"normal",value:a.normal,default:!1,callback:j.globalUiCallbacks.updateValue(a,s.value.Render,"normal")}),s.value.addUIItem({type:"slider-vector",id:"lightDir",value:a.lightDir,min:{0:-100,1:-100,2:-100},max:{0:100,1:100,2:100},callback:j.globalUiCallbacks.updateVector3(a,s.value.Render,"lightDir")})},Y=()=>{h[s.value.getDrawModel()]()},h={Grid:()=>{g(e,a.girdSize),i(r,a.girdSize,e.width,e.height);const v=[r,a.girdSize,e.width,e.height];T(ee,v)},ImgData:()=>{l=r.createImageData(e.width,e.height),T(b,[l]),r.putImageData(l,0,0)},CanvasApi:()=>{T(n,[r])}},T=(v,D)=>{var I;const C=le(a.color);let X=new k(C[0],C[1],C[2]),m=[],M=[],o=new k(0,0,0),w=new k(0,0,0),E=1;if(!t.length)(I=u.value)==null||I.facetVrt.forEach((y,L)=>{m=[],M=[];for(let V=0;V<3;V++)w=p.call(u.value,L,V),M.push(w),m.push(f(w));o=q(J(N(M[1],M[0]),N(M[2],M[0]))),E=U(o,a.lightDir),t.push({points:m,normal:o}),a.normal||(E=1),E>0&&v(...D,m[0],m[1],m[2],X.mutiply(E))});else{let y=[],L=s.value.getOffset();t.forEach(V=>{for(let x=0;x<V.points.length;x++)y[x]=new k(V.points[x].X+L.x,V.points[x].Y+L.y,V.points[x].Z);let G=U(V.normal,a.lightDir);G>0&&v(...D,y[0],y[1],y[2],X.mutiply(a.normal?G:1))})}};return{desData:re,page:s,Init:c,Render:Y,ModelChange:()=>{t=[]},DrawModelChange:()=>{Y()}}}});function fe(s,e,r,u,l,a){const f=z("nano_cg_experiment_page");return Q(),S(f,{prop_des_data:s.desData,onInit:s.Init,onRender:s.Render,onModelChange:s.ModelChange,onDrawModelChange:s.DrawModelChange,ref:"page"},null,8,["prop_des_data","onInit","onRender","onModelChange","onDrawModelChange"])}const ce=K(se,[["render",fe]]);export{ce as default};