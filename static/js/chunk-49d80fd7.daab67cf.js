(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-49d80fd7"],{"16fc":function(t,i,e){"use strict";e.r(i);var n=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticClass:"components-container"},[t._m(0),t._v(" "),e("div",{staticClass:"editor-container"},[e("dnd-list",{attrs:{list1:t.list1,list2:t.list2,"list1-title":"List","list2-title":"Article pool"}})],1)])},s=[function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("aside",[t._v("\n    drag-list base on\n    "),e("a",{attrs:{href:"https://github.com/SortableJS/Vue.Draggable",target:"_blank"}},[t._v("Vue.Draggable")])])}],a=(e("96cf"),e("3b8d")),r=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticClass:"dndList"},[e("div",{staticClass:"dndList-list",style:{width:t.width1}},[e("h3",[t._v(t._s(t.list1Title))]),t._v(" "),e("draggable",{staticClass:"dragArea",attrs:{"set-data":t.setData,list:t.list1,group:"article"}},t._l(t.list1,(function(i){return e("div",{key:i.id,staticClass:"list-complete-item"},[e("div",{staticClass:"list-complete-item-handle"},[t._v("\n          "+t._s(i.id)+"["+t._s(i.author)+"] "+t._s(i.title)+"\n        ")]),t._v(" "),e("div",{staticStyle:{position:"absolute",right:"0px"}},[e("span",{staticStyle:{float:"right","margin-top":"-20px","margin-right":"5px"},on:{click:function(e){return t.deleteEle(i)}}},[e("i",{staticClass:"el-icon-delete",staticStyle:{color:"#ff4949"}})])])])})),0)],1),t._v(" "),e("div",{staticClass:"dndList-list",style:{width:t.width2}},[e("h3",[t._v(t._s(t.list2Title))]),t._v(" "),e("draggable",{staticClass:"dragArea",attrs:{list:t.list2,group:"article"}},t._l(t.list2,(function(i){return e("div",{key:i.id,staticClass:"list-complete-item"},[e("div",{staticClass:"list-complete-item-handle2",on:{click:function(e){return t.pushEle(i)}}},[t._v("\n          "+t._s(i.id)+" ["+t._s(i.author)+"] "+t._s(i.title)+"\n        ")])])})),0)],1)])},l=[],c=(e("ac4d"),e("8a81"),e("ac6a"),e("1980")),u=e.n(c),o={name:"DndList",components:{draggable:u.a},props:{list1:{type:Array,default:function(){return[]}},list2:{type:Array,default:function(){return[]}},list1Title:{type:String,default:"list1"},list2Title:{type:String,default:"list2"},width1:{type:String,default:"48%"},width2:{type:String,default:"48%"}},methods:{isNotInList1:function(t){return this.list1.every((function(i){return t.id!==i.id}))},isNotInList2:function(t){return this.list2.every((function(i){return t.id!==i.id}))},deleteEle:function(t){var i=!0,e=!1,n=void 0;try{for(var s,a=this.list1[Symbol.iterator]();!(i=(s=a.next()).done);i=!0){var r=s.value;if(r.id===t.id){var l=this.list1.indexOf(r);this.list1.splice(l,1);break}}}catch(c){e=!0,n=c}finally{try{i||null==a.return||a.return()}finally{if(e)throw n}}this.isNotInList2(t)&&this.list2.unshift(t)},pushEle:function(t){var i=!0,e=!1,n=void 0;try{for(var s,a=this.list2[Symbol.iterator]();!(i=(s=a.next()).done);i=!0){var r=s.value;if(r.id===t.id){var l=this.list2.indexOf(r);this.list2.splice(l,1);break}}}catch(c){e=!0,n=c}finally{try{i||null==a.return||a.return()}finally{if(e)throw n}}this.isNotInList1(t)&&this.list1.push(t)},setData:function(t){t.setData("Text","")}}},d=o,f=(e("7f49"),e("2877")),h=Object(f["a"])(d,r,l,!1,null,"005c1ad2",null),p=h.exports,v=e("2423"),m={name:"DndListDemo",components:{DndList:p},data:function(){return{list1:[],list2:[]}},created:function(){this.getData()},methods:{getData:function(){var t=Object(a["a"])(regeneratorRuntime.mark((function t(){var i;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return this.listLoading=!0,t.next=3,Object(v["c"])();case 3:i=t.sent,this.list1=i.data.items.splice(0,5),this.list2=i.data.items,this.listLoading=!1;case 7:case"end":return t.stop()}}),t,this)})));function i(){return t.apply(this,arguments)}return i}()}},g=m,b=Object(f["a"])(g,n,s,!1,null,null,null);i["default"]=b.exports},2423:function(t,i,e){"use strict";e.d(i,"c",(function(){return s})),e.d(i,"b",(function(){return a})),e.d(i,"d",(function(){return r})),e.d(i,"a",(function(){return l})),e.d(i,"e",(function(){return c}));var n=e("b775");function s(t){return Object(n["a"])({url:"/vue-element-admin/article/list",method:"get",params:t})}function a(t){return Object(n["a"])({url:"/vue-element-admin/article/detail",method:"get",params:{id:t}})}function r(t){return Object(n["a"])({url:"/vue-element-admin/article/pv",method:"get",params:{pv:t}})}function l(t){return Object(n["a"])({url:"/vue-element-admin/article/create",method:"post",data:t})}function c(t){return Object(n["a"])({url:"/vue-element-admin/article/update",method:"post",data:t})}},"7f49":function(t,i,e){"use strict";var n=e("b338"),s=e.n(n);s.a},b338:function(t,i,e){}}]);