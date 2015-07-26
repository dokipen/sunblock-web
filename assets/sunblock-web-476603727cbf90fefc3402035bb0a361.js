define("sunblock-web/app",["exports","ember","ember/resolver","ember/load-initializers","sunblock-web/config/environment"],function(e,t,n,r,i){"use strict";var a;t["default"].MODEL_FACTORY_INJECTIONS=!0,a=t["default"].Application.extend({modulePrefix:i["default"].modulePrefix,podModulePrefix:i["default"].podModulePrefix,Resolver:n["default"]}),console.log(d3),r["default"](a,i["default"].modulePrefix),e["default"]=a}),define("sunblock-web/components/spf-chart",["exports","ember"],function(e,t){"use strict";function n(e){Em.BOB=this,this.conf=e,this.nodes=this.conf.get("content.nodes"),this.links=this.conf.get("content.links"),this.id=this.conf.get("elementId"),this.svg=d3.select("#"+this.id),this.linksG=this.svg.select(".links"),this.nodesG=this.svg.select(".nodes");var t=this;this.svg.select("defs marker").attr({markerWidth:this.conf.get("markerSize"),markerHeight:this.conf.get("markerSize"),refX:this.conf.get("radius")/this.conf.get("strokeWidth")+this.conf.get("markerSize")/2,refY:this.conf.get("markerSize")/2}),this.svg.select("defs marker path").attr({d:"M0,0 V"+this.conf.get("markerSize")+" L"+this.conf.get("markerSize")/2+","+this.conf.get("markerSize")/2+" Z"}),this.force=d3.layout.force().size([this.conf.get("width"),this.conf.get("height")]).nodes(this.nodes).links(this.links).charge(this.conf.get("charge")).gravity(this.conf.get("gravity")).linkDistance(this.conf.get("linkDistance")).on("tick",function(){t.tick()})}n.prototype.tick=function(){this.linksG.selectAll(".link").attr({d:function(e){var t=e.source.x,n=e.source.y,r=e.target.x,i=e.target.y;return"M"+t+","+n+" "+r+","+i}}),this.nodesG.selectAll(".node").attr({transform:function(e){return"translate("+e.x+","+e.y+")"}})},n.prototype.start=function(){var e=this.linksG.selectAll(".link").data(this.force.links());e.enter().insert("path").attr({"class":function(){return console.log("inserting link"),"link"},"stroke-width":this.conf.get("strokeWidth")}),e.exit().remove();var t=this.nodesG.selectAll(".node").data(this.force.nodes()),n=t.enter().append("g").attr("class","node").call(this.force.drag);n.append("circle").attr({"class":function(e,t){return console.log("appending circle"),0===t&&"head"||"nohead"},r:this.conf.get("radius"),"stroke-width":this.conf.get("strokeWidth")}),n.append("text").attr({"font-size":this.conf.get("fontSize")}),t.exit().remove(),t.select("text").text(function(e){return e.id}),this.force.start()},e["default"]=t["default"].Component.extend({tagName:"svg",attributeBindings:"width height".w(),graph:null,charge:-800,gravity:.05,radiusRatio:12,radius:function(){return Math.min(this.get("width"),this.get("height"))/this.get("radiusRatio")}.property("width","height"),markerSize:function(){return Math.sqrt(this.get("radius"))}.property("radius"),strokeWidth:function(){return this.get("radius")/20}.property("radius"),linkDistance:function(){return 3*this.get("radius")}.property("radius"),fontSize:function(){return this.get("radius")/7+"pt"}.property("radius"),startGraph:function(){this.graph=new n(this)}.on("didInsertElement"),transform:function(){return"translate(0,0)"}.property("width","height"),update:function(){this.graph&&this.get("graph").start()}.observes("content.links.[]")})}),define("sunblock-web/controllers/array",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Controller}),define("sunblock-web/controllers/index",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Controller.extend({queryTxt:function(e){return $.getJSON("http://sunblock.doki-pen.org/1/txt",{name:e})},querySpf:function(e){var t=this.queryTxt(e).then(function(t){if(t.error)throw new Error("Txt query "+e+" failed with "+t.error_message);var n=_(t.response).filter(function(e){return e.startsWith("v=spf1 ")}).value();return n});return t},parseSpfIncludes:function(e){var t=_(e).map(function(e){return e.split(" ")}).flatten().filter(function(e){return e.startsWith("include:")}).map(function(e){return e.split(":")[1]}).value();return t},querySpfIncludes:function(e){var t=this,n=this.querySpf(e).then(function(e){return t.parseSpfIncludes(e)});return n},indexOfNode:function(e,t){var n=_(e).findIndex(function(e){return e.id===t});return n},makeNodesAndLinks:function(){function e(t){-1===n.indexOfNode(o,t)&&o.addObject({id:t}),-1===a.indexOf(t)&&(a.addObject(t),i.addObject(t),n.querySpfIncludes(t).then(function(r){r.forEach(function(r){e(r),s.addObject({source:n.indexOfNode(o,t),target:n.indexOfNode(o,r)})})}).always(function(){i.removeObject(t),0===i.length&&(n.model.nodes.clear(),n.model.nodes.addObjects(o),n.model.links.clear(),n.model.links.addObjects(s))}).done())}console.log("updating");var n=this,r=n.model.domain,i=t["default"].A([]),a=t["default"].A([]),o=t["default"].A([]),s=t["default"].A([]);t["default"].set(n.model,"ready",!1),e(r)}.observes("model.domain"),model:{domain:"",nodes:[],links:[]}})}),define("sunblock-web/controllers/object",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Controller}),define("sunblock-web/initializers/export-application-global",["exports","ember","sunblock-web/config/environment"],function(e,t,n){"use strict";function r(e,r){if(n["default"].exportApplicationGlobal!==!1){var i,a=n["default"].exportApplicationGlobal;i="string"==typeof a?a:t["default"].String.classify(n["default"].modulePrefix),window[i]||(window[i]=r,r.reopen({willDestroy:function(){this._super.apply(this,arguments),delete window[i]}}))}}e.initialize=r,e["default"]={name:"export-application-global",initialize:r}}),define("sunblock-web/instance-initializers/app-version",["exports","sunblock-web/config/environment","ember"],function(e,t,n){"use strict";var r=n["default"].String.classify,i=!1;e["default"]={name:"App Version",initialize:function(e){if(!i){var a=r(e.toString());n["default"].libraries.register(a,t["default"].APP.version),i=!0}}}}),define("sunblock-web/router",["exports","ember","sunblock-web/config/environment"],function(e,t,n){"use strict";var r=t["default"].Router.extend({location:n["default"].locationType});r.map(function(){}),e["default"]=r}),define("sunblock-web/templates/application",["exports"],function(e){"use strict";e["default"]=Ember.HTMLBars.template(function(){return{meta:{revision:"Ember@1.13.3",loc:{source:null,start:{line:1,column:0},end:{line:6,column:0}},moduleName:"sunblock-web/templates/application.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),n=e.createElement("div");e.setAttribute(n,"class","row");var r=e.createTextNode("\n    ");e.appendChild(n,r);var r=e.createElement("h2");e.setAttribute(r,"id","title"),e.setAttribute(r,"class","col-md-6");var i=e.createTextNode("Sunblock");e.appendChild(r,i),e.appendChild(n,r);var r=e.createTextNode("\n");e.appendChild(n,r),e.appendChild(t,n);var n=e.createTextNode("\n\n");e.appendChild(t,n);var n=e.createComment("");e.appendChild(t,n);var n=e.createTextNode("\n");return e.appendChild(t,n),t},buildRenderNodes:function(e,t,n){var r=new Array(1);return r[0]=e.createMorphAt(t,2,2,n),r},statements:[["content","outlet",["loc",[null,[5,0],[5,10]]]]],locals:[],templates:[]}}())}),define("sunblock-web/templates/components/spf-chart",["exports"],function(e){"use strict";e["default"]=Ember.HTMLBars.template(function(){return{meta:{revision:"Ember@1.13.3",loc:{source:null,start:{line:1,column:0},end:{line:10,column:0}},moduleName:"sunblock-web/templates/components/spf-chart.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),n=e.createElement("defs"),r=e.createTextNode("\n  ");e.appendChild(n,r);var r=e.createElement("marker");e.setAttribute(r,"id","head"),e.setAttribute(r,"orient","auto");var i=e.createTextNode("\n    ");e.appendChild(r,i);var i=e.createElement("path");e.appendChild(r,i);var i=e.createTextNode("\n  ");e.appendChild(r,i),e.appendChild(n,r);var r=e.createTextNode("\n");e.appendChild(n,r),e.appendChild(t,n);var n=e.createTextNode("\n");e.appendChild(t,n);var n=e.createElement("g");e.setAttribute(n,"class","graph");var r=e.createTextNode("\n  ");e.appendChild(n,r);var r=e.createElement("g");e.setAttribute(r,"class","links"),e.appendChild(n,r);var r=e.createTextNode("\n  ");e.appendChild(n,r);var r=e.createElement("g");e.setAttribute(r,"class","nodes"),e.appendChild(n,r);var r=e.createTextNode("\n");e.appendChild(n,r),e.appendChild(t,n);var n=e.createTextNode("\n");return e.appendChild(t,n),t},buildRenderNodes:function(e,t,n){var r=e.childAt(t,[2]),i=new Array(1);return i[0]=e.createAttrMorph(r,"transform"),i},statements:[["attribute","transform",["get","transform",["loc",[null,[6,29],[6,38]]]]]],locals:[],templates:[]}}())}),define("sunblock-web/templates/index",["exports"],function(e){"use strict";e["default"]=Ember.HTMLBars.template(function(){return{meta:{revision:"Ember@1.13.3",loc:{source:null,start:{line:1,column:0},end:{line:7,column:0}},moduleName:"sunblock-web/templates/index.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),n=e.createElement("div");e.setAttribute(n,"class","row");var r=e.createTextNode("\n    ");e.appendChild(n,r);var r=e.createComment("");e.appendChild(n,r);var r=e.createTextNode("\n");e.appendChild(n,r),e.appendChild(t,n);var n=e.createTextNode("\n");e.appendChild(t,n);var n=e.createElement("div");e.setAttribute(n,"class","row");var r=e.createTextNode("\n    ");e.appendChild(n,r);var r=e.createComment("");e.appendChild(n,r);var r=e.createTextNode("\n");e.appendChild(n,r),e.appendChild(t,n);var n=e.createTextNode("\n");return e.appendChild(t,n),t},buildRenderNodes:function(e,t,n){var r=new Array(2);return r[0]=e.createMorphAt(e.childAt(t,[0]),1,1),r[1]=e.createMorphAt(e.childAt(t,[2]),1,1),r},statements:[["inline","input",[],["placeholder","google.com","class","col-md-12","value",["subexpr","@mut",[["get","model.domain",["loc",[null,[2,61],[2,73]]]]],[],[]]],["loc",[null,[2,4],[2,75]]]],["inline","spf-chart",[],["width",800,"height",800,"content",["subexpr","@mut",[["get","model",["loc",[null,[5,45],[5,50]]]]],[],[]],"class","col-md-12"],["loc",[null,[5,4],[5,70]]]]],locals:[],templates:[]}}())}),define("sunblock-web/config/environment",["ember"],function(e){var t="sunblock-web";try{var n=t+"/config/environment",r=e["default"].$('meta[name="'+n+'"]').attr("content"),i=JSON.parse(unescape(r));return{"default":i}}catch(a){throw new Error('Could not read config from meta tag with name "'+n+'".')}}),runningTests?require("sunblock-web/tests/test-helper"):require("sunblock-web/app")["default"].create({name:"sunblock-web",version:"0.0.0+373dc0ed"});