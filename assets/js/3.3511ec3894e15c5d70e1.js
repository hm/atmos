webpackJsonp([3],{"2E4m":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n("Xxa5"),i=n.n(r),a=n("exGp"),s=n.n(a),o=n("xhVP"),c={name:"Episode",props:["episode","mirrors","title","max"],data:function(){return{selectedMirrorString:void 0,selectedMirror:void 0,links:{},loading:!1}},computed:{screenWidth:function(){return window.innerWidth}},mounted:function(){var e=this;return s()(i.a.mark(function t(){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:e.getLinks(e.episode);case 1:case"end":return t.stop()}},t,e)}))()},methods:{sanitize:function(e){return e.replace(/ä/g,"a").replace(/Ⅲ/g,"iii").replace(/[^a-zA-Z0-9[\t][-]]*/g,"").replace(/ /g,"-").replace(/[^\u0000-\u007F]+/g,"-").replace(/[:]*[?]*[!]*[(]*[)]*[,]*[.]*[~]*[']*["]*[*]*[@]*[;]*/g,"")},getLinks:function(e){var t=this;return s()(i.a.mark(function n(){var r,a,s,c;return i.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:if(t.links[e]){n.next=20;break}return t.loading=!0,r=(r=(r=t.title.toLowerCase()).replace("hangyaku no lelouch","lelouch of the rebellion")).replace("kakegurui××","kakegurui xx"),r=t.sanitize(r),n.next=8,o.a.get("https://gogoanimes.co/"+r+"-episode-"+e);case 8:a=n.sent,!0;case 10:if(-1!==(s=a.indexOf('data-video="'))){n.next=14;break}return n.abrupt("break",19);case 14:a=a.substring(s+12),c=a.indexOf('"'),t.links[e]?t.links[e].push(a.substring(0,c)):(t.links[e]=[],t.links[e].push(a.substring(0,c))),n.next=10;break;case 19:t.loading=!1;case 20:t.selectedMirror=t.links[e][0],t.$forceUpdate();case 22:case"end":return n.stop()}},n,t)}))()},getBaseLink:function(e){return e.data.json_metadata.attachment.value.match(/^.+?[^\/:](?=[?\/]|$)/)[0]},getMirrorLabel:function(e){return this.getBaseLink(e)+" - "+e.data.poster+" - "+e.up+" upvotes"},updateEpisode:function(e){this.$emit("update",e),this.episode=e,this.getLinks(e)}}},l={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],key:"episode-"+e.episode,staticClass:"episode",attrs:{"element-loading-text":"Loading...","element-loading-background":"rgba(0, 0, 0, 0.8)"}},[n("div",[n("el-select",{staticClass:"mirror-select",model:{value:e.selectedMirror,callback:function(t){e.selectedMirror=t},expression:"selectedMirror"}},e._l(e.links[e.episode],function(e){return n("el-option",{key:e,attrs:{value:e}})}))],1),e._v(" "),e.selectedMirror?n("div",[n("iframe",{key:e.selectedMirror+"-episode-"+e.episode,attrs:{scrolling:"no",src:e.selectedMirror,allow:"encrypted-media",allowfullscreen:""}})]):e._e(),e._v(" "),n("h4",[n("el-pagination",{staticClass:"pagination",attrs:{background:"","page-size":1,"current-page":e.episode,layout:"pager, jumper",total:e.max},on:{"current-change":e.updateEpisode}})],1),e._v(" "),n("footer",[e._v("\n    It is strongly recommended you use an ad-blocker such as uBlock Origin to avoid potentially malicious ads while viewing content.\n  ")])])},staticRenderFns:[]};var d=n("VU/8")(c,l,!1,function(e){n("dmfB"),n("Ylcv")},"data-v-642ddcb8",null);t.default=d.exports},Ylcv:function(e,t){},dmfB:function(e,t){}});
//# sourceMappingURL=3.3511ec3894e15c5d70e1.js.map