<script setup lang="ts">
import Logo from "./assets/images/Logo.png"

const menuData = [
  {name:"DrawFrame",link:"drawframe"},
  {name:"DrawFaces",link:"drawfaces"},
  {name:"ZBuffer",link:"zbuffer"},
  {name:"Camera",link:"camera"},
  {name:"Texture",link:"texture"},
  {name:"Shader",link:"shader"},
  {name:"BlinePhone",link:"blinephone"},
]

</script>

<template>
  <div class="app">
    <div class="app-menu">
      <nano_widget_menu_tab
        :prop_logo="Logo" 
        prop_title="NanoRenderer"
        :prop_menu_data="menuData"
      />
    </div>
    <div class="app-content">
      <nano_totop_button/>
      <router-view>
      </router-view>
  </div>
  <div class="app-footer">
      <nano_footer></nano_footer>
  </div>
  </div>
</template>

<style>
html{
  overflow-x: hidden !important; 
}

.app-content{
  width: 100vw;
}
.app-footer{
  height: 40vh;
  width: 100vw;
}

span{
  font-family: "Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif;;
  mask:radial-gradient(circle at 0 50%, #000, transparent 10%, transparent 0);
  -webkit-mask: radial-gradient(circle at 0 50%, #000, transparent 10%, transparent 0);
  mask-size: 10000% ;
  -webkit-mask-size: 10000% ;
  animation: textShow 3s ;

}

@keyframes textShow {
  from{
      mask-size: 100% ;
      -webkit-mask-size:100% ;
  }
  to{
      mask-size: 10000% ;
      -webkit-mask-size:10000%;
  }
}

</style>
