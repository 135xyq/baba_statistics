(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/addProblem/addProblem"],{"28d7":function(e,t,n){"use strict";n.r(t);var r=n("82b1"),o=n("2b4c");for(var i in o)["default"].indexOf(i)<0&&function(e){n.d(t,e,(function(){return o[e]}))}(i);n("9c88");var u=n("f0c5"),a=Object(u["a"])(o["default"],r["b"],r["c"],!1,null,"5a90c0ad",null,!1,r["a"],void 0);t["default"]=a.exports},"2b4c":function(e,t,n){"use strict";n.r(t);var r=n("b7a4"),o=n.n(r);for(var i in r)["default"].indexOf(i)<0&&function(e){n.d(t,e,(function(){return r[e]}))}(i);t["default"]=o.a},"82b1":function(e,t,n){"use strict";n.d(t,"b",(function(){return o})),n.d(t,"c",(function(){return i})),n.d(t,"a",(function(){return r}));var r={uniForms:function(){return Promise.all([n.e("common/vendor"),n.e("uni_modules/uni-forms/components/uni-forms/uni-forms")]).then(n.bind(null,"5885"))},uniFormsItem:function(){return n.e("uni_modules/uni-forms/components/uni-forms-item/uni-forms-item").then(n.bind(null,"0749"))},uniDataSelect:function(){return n.e("uni_modules/uni-data-select/components/uni-data-select/uni-data-select").then(n.bind(null,"638c"))},uniNumberBox:function(){return n.e("uni_modules/uni-number-box/components/uni-number-box/uni-number-box").then(n.bind(null,"9e17"))},uniDatetimePicker:function(){return Promise.all([n.e("common/vendor"),n.e("uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker")]).then(n.bind(null,"a64a"))},uButton:function(){return Promise.all([n.e("common/vendor"),n.e("uni_modules/uview-ui/components/u-button/u-button")]).then(n.bind(null,"aad7"))}},o=function(){var e=this.$createElement;this._self._c},i=[]},9847:function(e,t,n){"use strict";(function(e,t){var r=n("4ea4");n("c541"),n("a9ff");r(n("66fd"));var o=r(n("28d7"));e.__webpack_require_UNI_MP_PLUGIN__=n,t(o.default)}).call(this,n("bc2e")["default"],n("543d")["createPage"])},"9c88":function(e,t,n){"use strict";var r=n("f254"),o=n.n(r);o.a},b7a4:function(e,t,n){"use strict";(function(e,r){var o=n("4ea4");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=o(n("9523")),u=o(n("278c"));function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){(0,i.default)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var c={data:function(){return{openId:"",loading:!1,type:"add",dataInfo:{type:"",totalNumber:0,errorNumber:0,time:new Date},typeList:[{text:"言语理解",value:1},{text:"资料分析",value:2},{text:"判断推理",value:3},{text:"数量关系",value:4},{text:"常识判断",value:5},{text:"申论",value:6}],rules:{type:{rules:[{required:!0,errorMessage:"请选择题目类型"}],label:"题目类型",validateTrigger:"submit"},totalNumber:{rules:[{maximum:999,minimum:1,errorMessage:"做题数量不合法"}],label:"做题数量",validateTrigger:"submit"},errorNumber:{rules:[{maximum:999,minimum:0,errorMessage:"错题数量不合法"}],label:"错题数量",validateTrigger:"submit"}},actiobs:[]}},onReady:function(){this.$refs.baseForm.setRules(this.rules)},onShow:function(){var t,n;if(null!==(t=this.$store.state.userInfo)&&void 0!==t&&null!==(n=t.userInfo)&&void 0!==n&&n.openid){var r,o=null===(r=this.$store.state.userInfo)||void 0===r?void 0:r.userInfo;this.openId=o.openid}else e.switchTab({url:"/pages/login/login"})},onLoad:function(e){if(console.log(e.data),e.date){var t=new Date,n=t.getHours(),r=t.getMinutes(),o=t.getSeconds(),i=e.date.split("-"),a=(0,u.default)(i,3),s=a[0],c=a[1],l=a[2];this.dataInfo.time=new Date(s,c-1,l,n,r,o)}if(e.data){var d=JSON.parse(e.data);this.dataInfo={type:d.type,totalNumber:d.totalNumber,errorNumber:d.errorNumber,time:d.time,_id:d._id},this.type="edit"}else this.taInfo={type:"",totalNumber:0,errorNumber:0},this.type="add"},methods:{getText:function(e){for(var t in this.typeList)if(e===this.typeList[t].value)return this.typeList[t].text;return"未知类型"},onAdd:function(){var t=this;this.loading?this.loading=!1:this.$refs.baseForm.validate((function(n,o){if(!n){if(t.dataInfo.errorNumber>t.dataInfo.totalNumber)return void e.showToast({title:"错题数量不合法？",icon:"error"});"add"===t.type?r.callFunction({name:"problem_add",data:s(s({openid:t.openId},t.dataInfo),{},{typeName:t.getText(t.dataInfo.type)}),success:function(t){e.showToast({title:"新增成功",icon:"success"}),setTimeout((function(){e.navigateBack()}),1e3)}}):r.callFunction({name:"problem_edit",data:s(s({},t.dataInfo),{},{typeName:t.getText(t.dataInfo.type)}),success:function(t){e.showToast({title:"修改成功",icon:"success"}),setTimeout((function(){e.navigateBack()}),1e3)}})}console.log("error",n)})).then((function(e){}))}}};t.default=c}).call(this,n("543d")["default"],n("a9ff")["default"])},f254:function(e,t,n){}},[["9847","common/runtime","common/vendor"]]]);