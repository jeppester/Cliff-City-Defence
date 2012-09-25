
function Loader(){this.sounds=new Object();this.images=new Object();this.loaded=new Object();this.loaded.images=0;this.loaded.sounds=0;this.loadImages=function(_paths){for(var i in _paths){var fPath=_paths[i];this.images[fPath]=new Image;this.images[fPath].src=fPath;this.images[fPath].onload=function(){loader.loaded.images++;if(loader.loaded.images==Object.keys(loader.images).length){game.onLoaded();}}}}
this.loadSounds=function(_paths){for(var i in _paths){var fPath=_paths[i];this.sounds[fPath]=new Audio(_paths[i]);this.sounds[fPath].addEventListener("canplaythrough",function(){loader.loaded.sounds++;},false);}}}
Animation=function(){}
Animation.prototype.animate=function(_prop,_to,_dur,_callback,_layer,_easing){var anim=new Object();anim.obj=this;if(!_dur){var map=_prop,opt=_to?_to:{};if(!map){return false;}
var layer=opt['layer']!=undefined?opt['layer']:1;anim.callback=opt['callback']?opt['callback']:function(){};anim.easing=opt['easing']?opt['easing']:"quadInOut";anim.dur=opt['dur']?opt['dur']:1000;anim.prop={};for(var i=0 in map){anim.prop[i]={begin:this[i],end:map[i]}}}else{if(_to===false||_to===undefined){return false;}
var layer=_layer!=undefined?_layer:1;anim.callback=_callback?_callback:function(){};anim.easing=_easing?_easing:"quadInOut";anim.prop={};anim.prop[_prop]={begin:this[_prop],end:_to}
anim.dur=_dur?_dur:1000;}
var c=0;for(var i in anim.prop){if(anim.prop[i].begin==anim.prop[i].end){delete anim.prop[i];}else{c++;}}
if(!c&&anim.callback==function(){}){return;};if(layer==0){anim.start=gameTime;}else{anim.start=new Date().getTime();}
if(animator.animations[layer][this.id]!=undefined){delete animator.animations[layer][this.id];}
animator.animations[layer][this.id]=anim;return anim;}
function ObjectContainer(){this.children=[];}
ObjectContainer.prototype.addChild=function(child){this.children.push(child);return child;}
ObjectContainer.prototype.remove=function(){this.removeChildren();purge(this);}
ObjectContainer.prototype.removeChildren=function(){while(this.children.length>0){this.children[this.children.length-1].remove();this.children.pop();}}
function Sprite(){importClass(this,ObjectContainer);importClass(this,Animation);constructIfNew(this,this.sprite,arguments);}
Sprite.prototype.sprite=function(_src,_depth,_x,_y,_dir,_addOpt){this.x=_x?_x:0;this.y=_y?_y:0;this.dir=_dir?_dir:0;this.depth=_depth!==undefined?_depth:0;this.id="obj"+curId;curId++
this.bmSize=1;this.opacity=1;copyVars(_addOpt,this);if(!useCanvas){this.bm=new Image();this.bm.src=loader.images[_src].src;this.bm.style.position="absolute";}else{this.bm=loader.images[_src];}
if(this.bm==undefined){}
this.bmWidth=this.bm.width;this.bmHeight=this.bm.height;this.xOff=this.xOff!=undefined?this.xOff:this.bmWidth/2;this.yOff=this.yOff!=undefined?this.yOff:this.bmHeight/2;depth[this.depth][this.id]=this;}
Sprite.prototype.cols=function(){};Sprite.prototype.drawCanvas=function(){var c=depthMap[this.depth];c.save();c.translate(this.x,this.y);c.globalAlpha=this.opacity;c.rotate(this.dir);c.drawImage(this.bm,-this.xOff*this.bmSize,-this.yOff*this.bmSize,this.bmWidth*this.bmSize,this.bmHeight*this.bmSize);c.restore();}
function TextBlock(){importClass(this,Animation);importClass(this,ObjectContainer);constructIfNew(this,this.textBlock,arguments);}
TextBlock.prototype.textBlock=function(_string,_depth,_x,_y,_width,_addOpt){if(_x===undefined||_y===undefined||!_string||_depth===undefined||!_width){return false;}
this.x=_x;this.y=_y;this.string=_string;this.width=_width;this.depth=_depth?_depth:0;this.font='normal 14px Verdana';this.align='left';this.xOff=0;this.yOff=0;this.fillStyle="#000000";this.opacity=1;this.bmSize=1;copyVars(_addOpt,this);this.lineHeight=this.lineHeight?this.lineHeight:this.font.match(/[.0-9]+/)*1.25;this.lines=[];this.lineWidth=[];this.cache=document.createElement('canvas');this.cacheCtx=this.cache.getContext('2d');this.cache.width=this.width;this.cache.height=1000;this.id="obj"+curId;curId++;depth[this.depth][this.id]=this;this.stringToLines();this.cacheRendering();}
TextBlock.prototype.setString=function(_str){this.string=_str;this.stringToLines();this.cacheRendering();}
TextBlock.prototype.cacheRendering=function(){this.cacheCtx.clearRect(0,0,this.cache.width,this.cache.height);this.cacheCtx.font=this.font;this.cacheCtx.fillStyle=this.fillStyle;for(var i=0;i<this.lines.length;i++){var xOffset=0;switch(this.align){case'left':xOffset=0;break;case'right':xOffset=this.width-this.lineWidth[i];break;case'center':xOffset=(this.width-this.lineWidth[i])/2;break;}
if(this.lines[i]){this.cacheCtx.fillText(this.lines[i],xOffset,this.lineHeight*(1+i));}}}
TextBlock.prototype.drawCanvas=function(){var c=depthMap[this.depth];c.save();c.translate(this.x,this.y);c.globalAlpha=this.opacity;c.drawImage(this.cache,-this.xOff*this.bmSize,-this.yOff*this.bmSize,this.cache.width*this.bmSize,this.cache.height*this.bmSize);c.restore();}
TextBlock.prototype.stringToLines=function(){var lt=document.createElement('span');lt.style.font=this.font;lt.style.visibility='hidden';document.body.appendChild(lt);var line=0;this.lines[line]='';var paragraphs=this.string.split("\n");for(var pid=0;pid<paragraphs.length;pid++){var words=paragraphs[pid].split(' ');for(var wid=0;wid<words.length;wid++){var word=words[wid];lt.innerHTML+=word+" ";if(lt.offsetWidth>this.width){line++;this.lines[line]='';lt.innerHTML='';lt.innerHTML+=word+" ";}
else{this.lineWidth[line]=lt.offsetWidth;}
this.lines[line]+=word+" ";}
line++;lt.innerHTML='';this.lines[line]='';}
lt.parentNode.removeChild(lt);}
function GameObject(_src,_depth,_x,_y,_dir,_addOpt){importClass(this,Sprite);this.sprite(_src,_depth,_x,_y,_dir,_addOpt);this.update=this.update?this.update:'onRunning';updateObjects[this.update][this.id]=this;this.dX=this.dX?this.dX:0;this.dY=this.dY?this.dY:0;this.alive=true;this.remove=function(time){if(this.alive){this.alive=false;time=time?time:200;this.animate({"bmSize":0},{'dur':time,callback:"purge(depth["+this.depth+"]['"+this.id+"'])",'layer':1});return true;}
return false;}
this.update=function(){if(this.alive){this.x+=this.dX*(now-last)/1000;this.y+=this.dY*(now-last)/1000;this.step();}}
this.step=function(){}
return this;}
function GravityObject(_src,_depth,_x,_y,_dir,_addOpt){GameObject.call(this,_src,_depth,_x,_y,_dir,_addOpt);this.gravity=this.gravity?this.gravity:0;this.gravDir=this.gravity_direction?this.gravity_direction:Math.PI/2;this.step=function(){this.doGrav();this.doBorders();}
this.doGrav=function(){this.dX+=Math.cos(this.gravDir)*this.gravity*(now-last)/1000;this.dY+=Math.sin(this.gravDir)*this.gravity*(now-last)/1000;}
this.doBorders=function(){var border=false;if(this.x<this.bmSize/2||this.x>canvasResX-this.bmSize/2){while(this.x<this.bmSize/2||this.x>canvasResX-this.bmSize/2){this.x-=this.dX*(now-last)/1000;}
this.dX=-this.dX;}
if(this.y>canvasResY-this.bmSize/2){this.y=canvasResY-this.bmSize/2;if(Math.abs(this.dY)<100){this.dY*=-0.4;if(Math.abs(this.dY*(now-last)/1000)<1){this.dY=0;}}else{this.dY=-this.dY*0.6;}
this.dX*=0.8;}}}
function Animator(){this.animations=new Array();this.animations.push(new Array(),new Array());this.updateAll=function(layer){layer=layer?layer:0
for(var i in this.animations[layer]){this.update(this.animations[layer][i],layer);}}
this.isAnimated=function(obj){for(var i=0;i<this.animations.length;i++){for(var ii in this.animations[i]){if(this.animations[i][ii].obj==obj){return true;}}}
return false;}
this.update=function(animation,layer){var a=animation,t;if(layer==0){t=gameTime-a.start;}else{t=(new Date().getTime())-a.start;}
if(t>a.dur){delete animator.animations[layer][a.obj.id];for(var i=0 in a.prop){a.obj[i]=a.prop[i].end;}
if(a.callback.length){eval(a.callback);}else{a.callback.call(a.obj);}}else{for(var i=0 in a.prop){a.obj[i]=this.ease(a.easing,t,a.prop[i].begin,a.prop[i].end-a.prop[i].begin,a.dur);}}}
this.ease=function(type,t,b,c,d){switch(type){case"linear":t/=d
return b+c*t;break;case"quadIn":t/=d
return b+c*t*t;break;case"quadOut":t/=d
return b-c*t*(t-2);break;case"quadInOut":t=t/d*2;if(t<1){return b+c*t*t/2;}else{t--;return b+c*(1-t*(t-2))/2;}
break;case"powerIn":t/=d;a=c/Math.abs(c);return b+a*Math.pow(Math.abs(c),t);break;case"powerOut":t/=d;a=c/Math.abs(c);return b+c-a*Math.pow(Math.abs(c),1-t);break;case"powerInOut":t=t/d*2;a=c/Math.abs(c);if(t<1){return b+a*Math.pow(Math.abs(c),t)/2;}else{t--;return b+c-a*Math.pow(Math.abs(c),1-t)/2;}
break;case"sinusInOut":t/=d
return b+c*(1+Math.cos(Math.PI*(1+t)))/2;break;}
return b+c;}}
function KeyboardIndex(){document.addEventListener('keydown',function(event){keyboard.onKeyDown.call(keyboard,event)},false);document.addEventListener('keyup',function(event){keyboard.onKeyUp.call(keyboard,event)},false);this.events=new Array();this.onKeyDown=function(event){if(this.isDown(event.keyCode)){return;}
var frame=frames;if(updatesPerformed){frame++;}
this.cleanUp(event.keyCode);this.events.push({'key':event.keyCode,'frame':frame,'type':'pressed'});}
this.onKeyUp=function(event){var frame=frames;for(var i=this.events.length-1;i>=0;i--){var evt=this.events[i];if(evt.key==event.keyCode){if(evt.frame>=frames){frame=evt.frame+1;}}}
this.cleanUp(event.keyCode);this.events.push({'key':event.keyCode,'frame':frame,'type':'released'});}
this.cleanUp=function(button){var clean=false;for(var i=this.events.length-1;i>=0;i--){var evt=this.events[i];if(evt.key==button){if(clean){this.events.splice(i,1);}
if(evt.frame<=frames){clean=true;}}}}
this.isDown=function(key){for(var i=this.events.length-1;i>=0;i--){var evt=this.events[i];if(evt.key==key&&evt.frame<=frames){return(evt.type=='pressed');}}
return false;}
this.isPressed=function(key){for(var i=this.events.length-1;i>=0;i--){var evt=this.events[i];if(evt.key==key){if(evt.frame==frames&&evt.type=='pressed'){return true;}}}
return false;}}
function MouseIndex(){arena.addEventListener('mousedown',function(event){mouse.onMouseDown.call(mouse,event)},false);arena.addEventListener('mouseup',function(event){mouse.onMouseUp.call(mouse,event)},false);document.addEventListener('mousemove',function(event){mouse.onMouseMove.call(mouse,event)},false);this.x=0;this.y=0;this.windowX=0;this.windowY=0;this.events=new Array();this.onMouseDown=function(event){var frame=frames;if(updatesPerformed){frame++;}
this.cleanUp(event.which);this.events.push({'button':event.which,'frame':frame,'type':'pressed'});}
this.onMouseUp=function(event){var frame=frames;for(var i=this.events.length-1;i>=0;i--){var evt=this.events[i];if(evt.button==event.which){if(evt.frame>=frames){frame=evt.frame+1;}}}
this.cleanUp(event.which);this.events.push({'button':event.which,'frame':frame,'type':'released'});}
this.onMouseMove=function(event){this.windowX=event.pageX;this.windowY=event.pageY;this.x=this.windowX-arena.offsetLeft+document.body.scrollLeft;this.y=this.windowY-arena.offsetTop+document.body.scrollTop;this.x=this.x/arena.offsetWidth*canvasResX;this.y=this.y/arena.offsetHeight*canvasResY;}
this.cleanUp=function(button){var clean=false;for(var i=this.events.length-1;i>=0;i--){var evt=this.events[i];if(evt.button==button){if(clean){this.events.splice(i,1);}
if(evt.frame<=frames){clean=true;}}}}
this.isDown=function(button){for(var i=this.events.length-1;i>=0;i--){var evt=this.events[i];if(evt.button==button&&evt.frame<=frames){return(evt.type=='pressed');}}
return false;}
this.isPressed=function(button){for(var i=this.events.length-1;i>=0;i--){var evt=this.events[i];if(evt.button==button){if(evt.frame==frames&&evt.type=='pressed'){return true;}}}
return false;}
this.outside=function(){if(this.x<0||this.x>arena.offsetWidth||this.y<0||this.y>arena.offsetHeight){return true;}else{return false;}}}
function Particle(_src,_depth,_x,_y,_dir,_lifetime,_addOpt){if(_lifetime===undefined){throw new Error('Missing argument "lifetime"');}
GravityObject.call(this,_src,_depth,_x,_y,_dir,_addOpt);this.spawnTime=gameTime;this.lifetime=_lifetime;this.step=function(){this.doGrav();this.updateLife();}
this.updateLife=function(){var left=1-(gameTime-this.spawnTime)/this.lifetime;this.bmSize=left;if(left<0){purge(this)}}}
function Cloud(){GameObject.call(this,pImg+'Cloud.png',2,Math.random()*arena.style.width.replace('px',''),50+Math.random()*100,0,{'dX':5+Math.random()*10,'dY':0});updateObjects['onPaused'][this.id]=this;this.bmWidth*=.7+Math.random()*.3
this.bmHeight*=.7+Math.random()*.3
this.step=function(){if(this.x>canvasResX){this.x=0;}}}
function Destroyable(_src,_depth,_x,_y,_dir){importClass(this,Sprite);if(_src==undefined){return false;}
this.sprite(_src,_depth,_x,_y,_dir);this.alive=true;this.remove=function(time){if(this.alive){time=time?time:200;this.alive=false;this.animate({"bmSize":1.5,"opacity":0},{'dur':time,callback:"purge(depth["+this.depth+"]['"+this.id+"'])",'layer':1});return true;}
return false;}
this.cols=function(){if(!this.alive){return;}
for(var i in depth[5]){cObj=depth[5][i];if(!cObj.alive){continue;}
cDist=this.bmWidth/2+cObj.bmWidth/2;if(Math.sqrt(Math.pow(cObj.x-this.x,2)+Math.pow(cObj.y-this.y,2))<cDist){this.remove();cObj.impacted=true;cObj.remove();}}}}
function Building(type,_depth,_x,_y,_dir){importClass(this,Sprite);if(type==undefined){return false;}
this.type=type;switch(type){case 1:this.spritePos={'gunStand':{'x':-13,'y':-28,'dir':0},'gun':{'x':-13,'y':-40}};break;case 2:this.spritePos={'gunStand':{'x':2,'y':-42,'dir':0},'gun':{'x':2,'y':-54}};break;case 3:this.spritePos={'gunStand':{'x':-4,'y':-36,'dir':0},'gun':{'x':-4,'y':-47}};break;case 4:this.spritePos={'gunStand':{'x':-4,'y':-32,'dir':0},'gun':{'x':-4,'y':-43}};break;case 5:this.spritePos={'gunStand':{'x':-20,'y':-30,'dir':-Math.PI/4},'gun':{'x':-29,'y':-39}};break;case 6:this.spritePos={'gunStand':{'x':0,'y':-36,'dir':0},'gun':{'x':0,'y':-48}};break;}
this.gunStand=new Sprite(pImg+'BuildingGunStand.png',_depth-1,_x+this.spritePos.gunStand.x,_y+this.spritePos.gunStand.y,this.spritePos.gunStand.dir,{opacity:0});this.gun=false;Sprite.call(this,pImg+'Building'+this.type+'.png',_depth,_x,_y,_dir);this.shield=new Shield(this.type,this.x,this.y);this.gunType=0;updateObjects.onRunning[this.id]=this;this.life=2;this.die=function(time){if(this.life){this.life=0;time=time?time:200;this.animate({"bmSize":1.5,"opacity":0},{'dur':time});this.gunStand.animate({"bmSize":1.5,"opacity":0},{'dur':time});this.gunType=0;if(this.gun){this.gun.remove();delete this.gun;}
return true;}
return false;}
this.update=function(){cDist=this.bmWidth/2;if(mouse.isPressed(1)&&this.life){if(Math.sqrt(Math.pow(mouse.x-this.x,2)+Math.pow(mouse.y-this.y,2))<cDist){if(typeof shopCircle!="undefined"){if(shopCircle.building!=this){shopCircle.remove();shopCircle=new ShopCircle(this);}}else{shopCircle=new ShopCircle(this);}}}}
this.remove=function(){purge(this.shield);purge(this.gunStand);if(this.gun){purge(this.gun);}
purge(this);}
this.cols=function(){if(!this.life){return;}
for(var i in depth[5]){cObj=depth[5][i];if(!cObj.alive){continue;}
cDist=this.bmWidth/2+cObj.bmWidth/2;if(Math.sqrt(Math.pow(cObj.x-this.x,2)+Math.pow(cObj.y-this.y,2))<cDist){if(this.shield.enabled){this.shield.life-=cObj.life;if(this.shield.life<=0){this.shield.disable();}}else{this.setLife(this.life-1);}
cObj.impacted=true;cObj.remove();}}}
this.setLife=function(life){if(this.life===0){this.bmSize=0;this.opacity=1;}
switch(life){case 0:this.die();return;break;case 1:this.bm=loader.images[pImg+'Building'+this.type+'Damaged.png'];break;case 2:this.bm=loader.images[pImg+'Building'+this.type+'.png'];break;}
this.animate({"bmSize":1},{'dur':200});this.life=life;}
this.setShield=function(type){this.shield.set(type);}
this.setGun=function(type){if(this.gun){this.gun.remove();}
this.gunType=type;if(this.gunType==0){this.gunStand.animate({'opacity':0},{'dur':200});if(this.gun){delete this.gun;}
return}
this.gun=new AiGun(type,this.x+this.spritePos.gun.x,this.y+this.spritePos.gun.y,this);this.gunStand.bmSize=1;this.gunStand.animate({'opacity':1},{'dur':200});}}
function CannonBuilding(){importClass(this,Sprite);this.cannon=new Sprite(pImg+'Cannon.png',4,300,628,-90,{'xOff':0,'yOff':10});this.cannon.alive=true;this.sprite(pImg+'RocketBuilding.png',4,315,660);updateObjects.onRunning[this.id]=this;this.alive=true;this.loadedAfter=0;this.update=function(){if(this.cannon.alive==false){return;}
var x=this.cannon.x;var y=this.cannon.y;var mDir=Math.atan2(mouse.y-y,mouse.x-x);if(mDir>-10/180*Math.PI||mDir<-170/180*Math.PI){if(mDir>90/180*Math.PI||mDir<-170/180*Math.PI){mDir=-170/180*Math.PI;}else{mDir=-10/180*Math.PI;}}
this.cannon.dir=mDir;if(mouse.y>y){return}
var shoot=player.cannonAutomatic?mouse.isDown(1):mouse.isPressed(1);if(shoot&&this.loadedAfter<=gameTime){new Rocket(this.cannon.dir);this.loadedAfter=gameTime+500;this.cannon.xOff=5;this.cannon.animate({'xOff':0},{'dur':300})}}
this.cols=function(){if(!this.alive){return;}
for(var i in depth[5]){cObj=depth[5][i];if(!cObj.alive){continue;}
cDist=this.bmWidth/2+cObj.bmWidth/2;if(Math.sqrt(Math.pow(cObj.x-this.x,2)+Math.pow(cObj.y-this.y,2))<cDist){this.die();cObj.impacted=true;cObj.remove();}}}
this.remove=function(time){purge(this.cannon);purge(this);}}
CannonBuilding.prototype.revive=function(){this.bmSize=0;this.opacity=1
this.cannon.bmSize=0;this.cannon.opacity=1;this.animate({"bmSize":1},{'dur':200});this.cannon.animate({"bmSize":1},{'dur':200});this.alive=true;}
CannonBuilding.prototype.die=function(){this.animate({"bmSize":1.5,"opacity":0},{'dur':200});this.cannon.animate({"bmSize":1.5,"opacity":0},{'dur':200});this.cannon.alive=false;this.alive=false;}
CannonBuilding.prototype.setCannon=function(alive){this.cannon.alive=alive;if(this.cannon.alive==false){if(this.cannon.dir>-Math.PI/2){var deadDir=10/180*Math.PI;}else{var deadDir=-190/180*Math.PI;}
this.cannon.animate({'dir':deadDir,'xOff':7},{'dur':200,'easing':'quadOut'});}else{this.cannon.animate({'xOff':0,bmSize:1,opacity:1},{dur:200});}}
function AiGun(){importClass(this,Sprite);constructIfNew(this,this.aiGun,arguments);}
AiGun.prototype.aiGun=function(_type,_x,_y,_parent){if(_type===undefined||_x===undefined||_y===undefined||_parent===undefined){return false;}
this.type=_type;this.parent=_parent;switch(this.type){case 1:_offset={'xOff':10,'yOff':5.5};this.rotSpeed=4/180*Math.PI;this.loadTime=500;this.range=400;this.spread=8/180*Math.PI;break;case 2:_offset={'xOff':10,'yOff':9};this.rotSpeed=6/180*Math.PI;this.loadTime=75;this.range=300;this.spread=20/180*Math.PI;break;case 3:_offset={'xOff':10,'yOff':9};this.rotSpeed=5/180*Math.PI;this.loadTime=700;this.range=400;this.spread=10/180*Math.PI;break;case 4:_offset={'xOff':8,'yOff':6};this.rotSpeed=4/180*Math.PI;this.loadTime=1000;this.range=400;this.spread=0;break;}
this.sprite(pImg+'BuildingGun'+this.type+'.png',4,_x,_y,-45-Math.random()*90,_offset);updateObjects['onRunning'][this.id]=this;this.alive=true;this.loadedAfter=0;this.targetId=false;return this;}
AiGun.prototype.update=function(){if(!this.alive){return;}
if(!updateObjects.onRunning[this.targetId]){var cDist=this.range;for(var i in depth[5]){var cObj=depth[5][i];var cObjDist=Math.min(cDist,Math.sqrt(Math.pow(cObj.x-this.x,2)+Math.pow(cObj.y-this.y,2)))
if(cObjDist<cDist){cDist=cObjDist;this.targetId=cObj.id;}}}
if(updateObjects.onRunning[this.targetId]){var t=updateObjects.onRunning[this.targetId];var tDir=Math.atan2(t.y-this.y,t.x-this.x);var relDir=tDir-this.dir+2*Math.PI;while(relDir>Math.PI){relDir-=Math.PI*2;}
if(relDir>0){this.dir+=Math.min(relDir,this.rotSpeed);}else{this.dir+=Math.max(relDir,-this.rotSpeed);}
if(gameTime>this.loadedAfter){if(Math.abs(relDir)<this.rotSpeed){if(this.type<4){new GunShot(this.type,this.dir-this.spread/2+Math.random()*this.spread,this.x,this.y,updateObjects.onRunning[this.targetId]);}else{var lx=t.x+0*Math.cos(tDir+Math.PI);var ly=t.y+0*Math.sin(tDir+Math.PI);var beam=new Sprite(pImg+'GunShot4.png',6,lx,ly,0,{"opacity":0,"bmSize":1.5});beam.animate({"opacity":1},{'dur':200,easing:'quadIn',callback:function(){this.animate({"bmSize":0,"opacity":0},{"dur":400,easing:'quadOut',callback:function(){this.remove();}})}})
var lx=this.x+24*Math.cos(tDir);var ly=this.y+24*Math.sin(tDir);var beam=new Sprite(pImg+'GunShot4.png',10,lx,ly,0,{"opacity":0,"bmSize":0});beam.animate({"bmSize":0.5,"opacity":1},{'dur':100,easing:'quadIn',callback:function(){this.animate({"bmSize":0,"opacity":0},{"dur":100,easing:'quadOut',callback:function(){this.remove();}})}})
t.damage(1000);}
this.loadedAfter=gameTime+this.loadTime;}}}}
AiGun.prototype.remove=function(time){if(this.alive){this.alive=false;time=time?time:200;this.animate({"bmSize":0},{'dur':time,callback:"purge(depth["+this.depth+"]['"+this.id+"'])",'layer':1});this.parent.gun=false;this.parent.gunType=0;return true;}
return false;}
AiGun.prototype.cols=function(){if(!this.alive){return;}
for(var i in depth[5]){var cObj=depth[5][i];if(!cObj.alive){continue;}
cDist=this.bmWidth/2+cObj.bmWidth/2;if(Math.sqrt(Math.pow(cObj.x-this.x,2)+Math.pow(cObj.y-this.y,2))<cDist){this.remove();cObj.remove();break;}}}
function Shield(_building,_x,_y){importClass(this,Sprite);if(_building==undefined||_x===undefined||_y===undefined){throw new Error('Arguments: building, type, x or y missing');return false;}
this.enabled=false;this.type=0;this.building=_building;_spr=pImg+'Building'+this.building+'Shield1.png';this.sprite(_spr,4,_x,_y,0,{'bmSize':0});this.disable=function(){this.animate({bmSize:2,opacity:0},{dur:300});this.enabled=false;};this.set=function(type){this.type=type;if(this.type==0){this.disable();return;}
switch(this.type){case 1:this.life=100
switch(this.building){case 1:this.xOff=39;this.yOff=37;break;case 2:this.xOff=39
this.yOff=47;break;case 3:this.xOff=38
this.yOff=43;break;case 4:this.xOff=36
this.yOff=35;break;case 5:this.xOff=28
this.yOff=48;break;case 6:this.xOff=27
this.yOff=40;break;}
break;case 2:this.life=250
switch(this.building){case 1:this.xOff=37
this.yOff=35;break;case 2:this.xOff=43
this.yOff=45;break;case 3:this.xOff=42
this.yOff=44;break;case 4:this.xOff=37
this.yOff=32;break;case 5:this.xOff=25
this.yOff=48;break;case 6:this.xOff=31
this.yOff=38;break;}
break;case 4:this.life=800
case 3:this.life=500
switch(this.building){case 1:this.xOff=32;this.yOff=35;break;case 2:this.xOff=38;this.yOff=45;break;case 3:this.xOff=35;this.yOff=34;break;case 4:this.xOff=37;this.yOff=34;break;case 5:this.xOff=22;this.yOff=46;break;case 6:this.xOff=24;this.yOff=35;break;}
break;}
this.enabled=true;this.bm.src=loader.images[pImg+'Building'+this.building+'Shield'+this.type+'.png'].src;this.bmWidth=this.bm.width;this.bmHeight=this.bm.height;this.bmSize=0;this.opacity=1;this.animate({bmSize:1},{dur:300});}}
function StageController(){this.id='StageController';this.level=0;this.curObj=0;this.running=false;this.playerLevelStartState=false;this.onLevelSucceed=function(){};this.onLevelFail=function(){};this.scheduledTasks=[];this.messages={};this.stats={rocks:[]};updateObjects['onRunning'][this.id]=this;}
StageController.prototype.prepareBackgrounds=function(){if(typeof ground=="undefined"){ground=new Sprite(pBg+'cliffCityGround.png',0,0,0,0,{'xOff':0,'yOff':0});road=new Sprite(pBg+'cliffCityRoad.png',0,0,0,0,{'xOff':0,'yOff':0});cliff=new Sprite(pBg+'cliffSide.png',8,0,0,0,{'xOff':0,'yOff':0});redrawStaticLayers();for(var i=0;i<5;i++){new Cloud();}}
else{}}
StageController.prototype.prepareGame=function(){player=new Player();cannonBuilding=new CannonBuilding();this.destroyables=[];this.destroyables.push(new Destroyable(pImg+'Tree.png',4,421,680),new Destroyable(pImg+'AppleTree.png',4,520,673));b1=new Building(1,4,91,665);b2=new Building(2,4,163,665);this.destroyables.push(new Destroyable(pImg+'Tree.png',4,200,690));b3=new Building(3,4,232,680);b4=new Building(4,4,392,687);b5=new Building(5,4,446,663);b6=new Building(6,4,490,668);this.destroyables.push(new Destroyable(pImg+'Tree.png',4,98,700),new Destroyable(pImg+'AppleTree.png',4,151,725),new Destroyable(pImg+'Tree.png',4,225,718),new Destroyable(pImg+'AppleTree.png',4,362,700),new Destroyable(pImg+'AppleTree.png',4,436,718),new Destroyable(pImg+'Tree.png',4,473,694));}
StageController.prototype.destroyGame=function(){this.running=false;cannonBuilding.remove();b1.remove();b2.remove();b3.remove();b4.remove();b5.remove();b6.remove();for(var i=0;i<this.destroyables.length;i++){purge(this.destroyables[i]);}
if(typeof shopCircle!=="undefined"){shopCircle.remove();}
clearDepth(5);clearDepth(3);for(var i in this.messages){this.messages[i].remove();delete this.messages[i];}
this.stopAllTasks();if(player){purge(player.inGameScore);delete player;}}
StageController.prototype.destroyBackgrounds=function(){if(typeof ground!="undefined"){purge(ground);purge(road);purge(cliff);delete ground;delete road;delete cliff;clearDepth(2);redrawStaticLayers();}
else{}}
StageController.prototype.getPlayerState=function(){var states={};for(var i=1;i<7;i++){var b=window['b'+i];states['b'+i]={life:b.life,gunType:b.gunType,shieldType:b.shield.type}}
states.cannonBuilding={cannon:{alive:cannonBuilding.cannon.alive}};states.player={points:player.points,pointsTotal:player.pointsTotal}
return states;}
StageController.prototype.loadPlayerState=function(playerState){for(var i=1;i<7;i++){bState=playerState['b'+i];b=window['b'+i];b.setGun(bState.gunType);b.setShield(bState.shieldType);b.setLife(bState.life);}
if(!cannonBuilding.alive){cannonBuilding.revive();}
cannonBuilding.setCannon(playerState.cannonBuilding.cannon.alive);player.points=playerState.player.points;player.pointsTotal=playerState.player.pointsTotal;player.inGameScore.setString(player.points.toString()+"$");}
StageController.prototype.update=function(){if(pause){return}
for(var i=0;i<this.scheduledTasks.length;i++){var t=this.scheduledTasks[i];if(gameTime>=t.fireTime){t.callback();this.scheduledTasks.splice(i,1);i--;}}
if(!this.running){return}
this.levelTime+=now-last
if(frames%4===0){if(this.curObj==this.level.rocks.length&&Object.keys(depth[5]).length===0){this.endLevel();}
for(var i=this.curObj;i<this.level.rocks.length;i++){var r=this.level.rocks[i];r.level=r.level?r.level:1;this.curObj=i;if(this.cumulatedTime+r.spawnDelay<=this.levelTime){this.cumulatedTime+=r.spawnDelay;r.dir=r.dir?r.dir:Math.random()*Math.PI;r.x=r.x?r.x:55+Math.random()*(arena.offsetWidth-110);var t=rocks[r.type.toLowerCase()];var l=t.levels[r.level-1];new Rock(pImg+'Rocks/'+t.prefix+r.level+".png",pImg+'Rocks/'+t.prefix+r.level+"Cracks.png",r.x,r.dir,l.gravity,l.life,l.value,l.maxSpeed,t.onStep,t.onDestroy);this.curObj++;}
else{break;}}}}
StageController.prototype.startLevel=function(level,onLevelSucceed,onLevelFail){delete this.stats;this.stats={rocks:[]};this.levelStartPlayerState=this.getPlayerState();this.curObj=0;this.level=level;this.levelTime=-8000;this.running=0;this.cumulatedTime=0;this.onLevelSucceed=onLevelSucceed?onLevelSucceed:this.onLevelSucceed;this.onLevelFail=onLevelFail?onLevelFail:this.onLevelFail;loadedAfter=0;if(player.currentLevel!==undefined){new FadeMessage("Prepare for\nlevel "+(player.currentLevel+1)+"/"+game.levels.length,10,200,0,1500,{align:'center',font:'normal 58px Verdana',bmSize:3,opacity:0,xOff:300,yOff:60,fillStyle:'#000000'});}
else{new FadeMessage("Prepare for\nlevel test",10,200,0,1500,{align:'center',font:'normal 58px Verdana',bmSize:3,opacity:0,xOff:300,yOff:60,fillStyle:'#000000'});}
var firstDelay=this.level.rocks[0].spawnDelay;var addOpt={align:'center',font:'normal 58px Verdana',bmSize:3,opacity:0,xOff:300,yOff:60,fillStyle:'#000000'};new FadeMessage('5',10,260,3000+firstDelay,1000,addOpt);new FadeMessage('4',10,260,4000+firstDelay,1000,addOpt);new FadeMessage('3',10,260,5000+firstDelay,1000,addOpt);new FadeMessage('2',10,260,6000+firstDelay,1000,addOpt);new FadeMessage('1',10,260,7000+firstDelay,1000,addOpt);this.running=true;}
StageController.prototype.endLevel=function(){if(typeof shopCircle!=="undefined"){shopCircle.remove();}
this.running=false;if(!this.checkPlayerAlive()){new FadeMessage("You\nfailed",10,200,0,1500,{align:'center',font:'normal 58px Verdana',bmSize:3,opacity:0,xOff:300,yOff:60,fillStyle:'#000000'});this.scheduleTask(this.onLevelFail,2100,'levelFail');}else{game.store.levelsCompleted++;if(player.currentLevel!==undefined){new FadeMessage("Level "+(player.currentLevel+1)+"/"+game.levels.length+"\ncompleted!",10,200,0,1500,{align:'center',font:'normal 58px Verdana',bmSize:3,opacity:0,xOff:300,yOff:60,fillStyle:'#000000'});}
else{new FadeMessage("Level test\ncomplete!",10,200,0,1500,{align:'center',font:'normal 58px Verdana',bmSize:3,opacity:0,xOff:300,yOff:60,fillStyle:'#000000'});}
this.levelStartPlayerState
for(var i=1;i<7;i++){var b=window['b'+i];var bStart=this.levelStartPlayerState['b'+i];if(b.life==1&&bStart.life==2){player.buildingsDamaged++;}
if(b.life==0){if(bStart.life==2){player.buildingsDamaged++;player.buildingsLost++;}else if(bStart.life==1){player.buildingsLost++;}}}
this.scheduleTask(this.onLevelSucceed,2100,'levelSucceed');}
return true}
StageController.prototype.calculateLevelStats=function(){var totalImpacts=0,totalFallDistance=0,stats={};for(var i=0;i<this.stats.rocks.length;i++){var r=this.stats.rocks[i];totalImpacts+=r.impacted?1:0;totalFallDistance+=r.fallDistance;}
stats.impactFactor=totalImpacts/this.stats.rocks.length;stats.meanFallDistance=totalFallDistance/this.stats.rocks.length;return stats;}
StageController.prototype.restartLevel=function(){if(!this.levelStartPlayerState){return false;}
this.loadPlayerState(this.levelStartPlayerState);this.startLevel(this.level);}
StageController.prototype.checkPlayerAlive=function(){var aliveCount=0;for(var i=1;i<7;i++){if(window['b'+i].life>0){aliveCount++;}}
if(aliveCount==0){return false;}
return cannonBuilding.alive;}
StageController.prototype.scheduleTask=function(callback,delayTime,id){if(callback===undefined){throw new Error('Missing argument: callback');}
if(delayTime===undefined){throw new Error('Missing argument: delayTime');}
var id=id===undefined?false:id;var task={callback:callback,fireTime:gameTime+delayTime,id:id}
this.scheduledTasks.push(task);}
StageController.prototype.stopTask=function(taskId){for(var i=0;i<this.scheduledTasks.length;i++){if(this.scheduledTasks[i].id===taskId){this.scheduledTasks.splice(i,1);return true;}}
return false;}
StageController.prototype.stopAllTasks=function(){this.scheduledTasks=[];}
StageController.prototype.createDummies=function(){if(typeof this.dummies!=="undefined"){return;}
this.dummies=[new Sprite(pImg+'RocketBuilding.png',4,315,660),new Sprite(pImg+'Tree.png',4,421,680),new Sprite(pImg+'AppleTree.png',4,520,673),new Sprite(pImg+'Building1.png',4,91,665),new Sprite(pImg+'Building2.png',4,163,665),new Sprite(pImg+'Tree.png',4,200,690),new Sprite(pImg+'Building3.png',4,232,680),new Sprite(pImg+'Building4.png',4,392,687),new Sprite(pImg+'Building5.png',4,446,663),new Sprite(pImg+'Building6.png',4,490,668),new Sprite(pImg+'Tree.png',4,98,700),new Sprite(pImg+'AppleTree.png',4,151,725),new Sprite(pImg+'Tree.png',4,225,718),new Sprite(pImg+'AppleTree.png',4,362,700),new Sprite(pImg+'AppleTree.png',4,436,718),new Sprite(pImg+'Tree.png',4,473,694)]}
StageController.prototype.removeDummies=function(){if(typeof this.dummies=="undefined"){return;}
for(var i=0;i<this.dummies.length;i++){purge(this.dummies[i]);}
delete this.dummies;}
function ScorePoints(){importClass(this,TextBlock);constructIfNew(this,this.scorePoints,arguments);}
ScorePoints.prototype.scorePoints=function(points,_x,_y){this.points=points?points:0;this.textBlock("+"+this.points.toString()+"$",10,_x,_y,200,{'font':'bold 30px Verdana','align':'right','xOff':200,'yOff':40,'bmSize':0,'fillStyle':'#ff2200'});this.animate({'x':590,'y':700,'bmSize':1},{'dur':300,'easing':'quadOut','callback':function(){if(typeof player!=="undefined"){player.addPoints(this.points);}
this.animate({'opacity':0},{'dur':1000,'easing':'linear','callback':function(){this.remove();}});}});}
function Player(){this.points=0;this.pointsTotal=0;this.rocksDestroyed=0;this.buildingsLost=0;this.buildingsDamaged=0;this.weaponsBought=0;this.shieldsBought=0;this.shieldsAvailable=0;this.weaponsAvailable=0;this.weaponIntelligence=0;this.rocketBlastRangeLevel=0;this.rocketDmgLevel=0;this.cannonAutomatic=0;this.rocketBounces=0;this.inGameScore=new TextBlock(this.points.toString()+"$",10,590,740,200,{'font':'bold 30px Verdana','align':'right','xOff':200,'yOff':40,'fillStyle':'#ff2200'});this.addPoints=function(points){this.points+=points;this.pointsTotal+=Math.max(0,points);this.inGameScore.setString(this.points.toString()+"$");}}
function Rock(_spr,_dmgSpr,_x,_dir,_grav,_life,_value,_maxSpeed,_onStep,_onDestroy){if(_dmgSpr===undefined){throw new Error('Missing argument "dmgSpr"');}
if(_life===undefined){throw new Error('Missing argument "life"');}
if(_value===undefined){throw new Error('Missing argument "value"');}
if(_grav===undefined){throw new Error('Missing argument "grav"');}
if(_maxSpeed===undefined){throw new Error('Missing argument "maxSpeed"');}
this.onStep=_onStep===undefined?function(){}:_onStep;this.onDestroy=_onDestroy===undefined?function(){}:_onDestroy;var acc=5000;var x=_x
var y=-25;var dX=Math.cos(_dir)*acc*loopSpeed/1000;var dY=Math.sin(_dir)*acc*loopSpeed/1000;GravityObject.call(this,_spr,5,x,y,_dir,{'dX':dX,'dY':dY,'gravity':_grav});this.dmgSprite=new Sprite(_dmgSpr,5,x,y,_dir);this.dmgSprite.opacity=0;this.maxLife=_life
this.life=_life;this.value=_value;this.maxSpeed=_maxSpeed;this.impacted=false;this.damage=function(dhp){this.life=Math.max(0,this.life-dhp);this.dmgSprite.opacity=(this.maxLife-this.life)/this.maxLife;if(this.life==0){this.remove();player.rocksDestroyed++;var relDist=1-(this.y-150)/450;var value=Math.min(1,relDist)*this.value;var value=Math.round(value/10)*10;new ScorePoints(value,this.x,this.y);}}
this.step=function(){this.dmgSprite.x=this.x;this.dmgSprite.y=this.y;this.dmgSprite.dir=this.dir;this.doGrav();this.doBorders();this.onStep();}
this.remove=function(time){if(this.alive){this.alive=false;time=time?time:150;var animOpt={'bmSize':1.5,'opacity':0};this.animate(animOpt,{'dur':time,callback:"purge(depth["+this.depth+"]['"+this.id+"'])",'layer':1});this.dmgSprite.animate(animOpt,{'dur':time,callback:"purge(depth["+this.dmgSprite.depth+"]['"+this.dmgSprite.id+"'])",'layer':1});stageController.stats.rocks.push({fallDistance:this.y,impacted:this.impacted});this.onDestroy();return true;}}
this.doBorders=function(){var border=false;if(this.x<50||this.x>canvasResX-50){while(this.x<50||this.x>canvasResX-50){this.x-=this.dX*(now-last)/1000;}
this.dX=-this.dX;}
if(this.y>canvasResY-35){this.impacted=true;this.remove();}
if(this.dY>this.maxSpeed){this.dY=this.maxSpeed;}
this.dir=Math.atan2(this.dY,this.dX);}}
function Rocket(_dir){var acc=20000;var x=canvasResX/2;var y=canvasResY-120;var dX=Math.cos(_dir)*acc*loopSpeed/1000;var dY=Math.sin(_dir)*acc*loopSpeed/1000;GravityObject.call(this,pImg+'Rocket.png',3,x,y,_dir,{'dX':dX,'dY':dY,'gravity':300});this.bounces=0;switch(player.rocketBlastRangeLevel){case 1:this.blastRange=10;break;case 2:this.blastRange=30;break;case 3:this.blastRange=60;break;case 4:this.blastRange=100;break;default:this.blastRange=0;break;}
this.doBorders=function(){var border=false;if(this.x<50||this.x>canvasResX-50){if(this.bounces>=player.rocketBounces){this.remove();}
this.bounces++;while(this.x<this.bmSize/2||this.x>canvasResX-this.bmSize/2){this.x-=this.dX/Math.abs(this.X);}
this.dX=-this.dX;}
if(this.y>canvasResY-200&&this.dY>0){this.remove();}
this.dir=Math.atan2(this.dY,this.dX);}
this.cols=function(){if(!this.alive){return;}
for(var i in depth[5]){var cObj=depth[5][i];if(!cObj.alive){continue;}
var cDist=this.bmWidth/2+cObj.bmWidth/2;if(Math.sqrt(Math.pow(cObj.x-this.x,2)+Math.pow(cObj.y-this.y,2))<cDist){this.remove();if(this.blastRange){new Explosion(this.x,this.y,this.blastRange+this.bmWidth,400);for(var i in depth[5]){var bObj=depth[5][i];if(!bObj.alive){continue;}
var cDist2=this.bmWidth/2+cObj.bmWidth/2;var objDist=Math.sqrt(Math.pow(bObj.x-this.x,2)+Math.pow(bObj.y-this.y,2));if(objDist<cDist2){bObj.damage(150);}else{if(objDist<this.bmWidth+this.blastRange){var blastDist=objDist-this.bmWidth;if(blastDist<0){var dmg=150;}else{var dmg=150-blastDist/this.blastRange*150;}
bObj.damage(dmg);}}}}else{cObj.damage(150);}
break;}}}}
function Explosion(_x,_y,_radius,_dur){importClass(this,Sprite);this.sprite(pImg+'Explosion.png',7,_x,_y,0,{bmSize:0,opacity:0});this.animate({bmSize:_radius/100,opacity:1},{easing:'quadOut',dur:_dur/2,callback:function(){this.animate({opacity:0},{dur:_dur/2,callback:function(){this.remove();}})}})}
function GunShot(_type,_dir,_x,_y,_target){this.type=_type?_type:1;this.target=_target!==undefined?_target:false;var _acc=0;switch(this.type){case 1:this.damage=50;this.blastRange=0;_acc=800;break;case 2:this.damage=20;this.blastRange=0;_acc=600;break;case 3:this.damage=200;this.blastRange=75;_acc=400;break;}
var _x=_x?_x:0;var _y=_y?_y:0;var _dX=Math.cos(_dir)*_acc;var _dY=Math.sin(_dir)*_acc;GameObject.call(this,pImg+'GunShot'+this.type+'.png',2,_x,_y,_dir,{'dX':_dX,'dY':_dY,'update':'onRunning','xOff':17,'yOff':1});this.step=function(){}
this.cols=function(){if(!this.alive){return;}
this.doBorders();if(this.type==3){if(this.y<this.target.y){this.remove();this.explode();return;}}
for(var i in depth[5]){var cObj=depth[5][i];if(!cObj.alive){continue;}
var cDist=10+cObj.bmWidth/2;if(Math.sqrt(Math.pow(cObj.x-this.x,2)+Math.pow(cObj.y-this.y,2))<cDist){this.remove();if(!this.blastRange){cObj.damage(this.damage);}else{this.explode();}}}}
this.doBorders=function(){if(this.x<40||this.x>arena.offsetWidth-40){this.remove();}
if(this.y>arena.offsetHeight-200&&this.dY>0){this.remove();}
if(this.y<-17){this.remove();}}}
GunShot.prototype.explode=function(){new Explosion(this.x,this.y,this.blastRange+this.bmWidth,400);for(var i in depth[5]){var bObj=depth[5][i];if(!bObj.alive){continue;}
var cDist2=this.bmWidth/2+cObj.bmWidth/2;var objDist=Math.sqrt(Math.pow(bObj.x-this.x,2)+Math.pow(bObj.y-this.y,2));if(objDist<cDist2){bObj.damage(this.damage);}else{if(objDist<this.bmWidth+this.blastRange){var blastDist=objDist-this.bmWidth;if(blastDist<0){var dmg=this.damage;}else{var dmg=this.damage-blastDist/this.blastRange*this.damage;}
bObj.damage(dmg);}}}}
function CustomMenu(_depth,_x,_y,_buttons){importClass(this,Animation);if(_depth===undefined){throw new Error('Missing argument: depth');}
if(_x===undefined){throw new Error('Missing argument: x');}
if(_y===undefined){throw new Error('Missing argument: y');}
if(_buttons===undefined){throw new Error('Missing argument: buttons');}
if(_buttons.length===0){throw new Error('Argument buttons is empty');}
this.depth=_depth;this.x=_x;this.y=_y;this.opacity=1;this.buttons=[];this.id="obj"+curId;curId++
updateObjects.onRunning[this.id]=this;updateObjects.onPaused[this.id]=this;for(var i=0;i<_buttons.length;i++){var b=_buttons[i];this.buttons.push(new Button(this.depth,this.x,this.y-62*(_buttons.length-1)/2+i*62,0,b.text,b.onClick));this.buttons[i].parent=this;}}
CustomMenu.prototype.enable=function(){for(var i=0;i<this.buttons.length;i++){this.buttons[i].enable();}}
CustomMenu.prototype.disable=function(){for(var i=0;i<this.buttons.length;i++){this.buttons[i].disable();}}
CustomMenu.prototype.update=function(){for(var i=0;i<this.buttons.length;i++){var btn=this.buttons[i];btn.x=this.x;btn.y=this.y-62*(this.buttons.length-1)/2+i*62;btn.opacity=this.opacity;}}
CustomMenu.prototype.remove=function(){for(var i=0;i<this.buttons.length;i++){this.buttons[i].remove();}
redrawStaticLayers();}
function UpgradeMenu(onContinue){this.headerBox=new Sprite(pImg+'HeaderBox.png',9,300,55,0);this.headerText=new TextBlock('UPGRADES AVAILABLE:',9,0,24,600,{'font':'normal 36px Verdana','align':'center'});this.icons=[];this.onContinue=onContinue?onContinue:function(){};pause=1;this.makeUpgradeTree=function(_animate){var animate=_animate?_animate:0;while(this.icons.length>0){test=this.icons[0];this.icons[0].remove();this.icons.splice(0,1);}
var c=0;for(var i in game.upgradeTypes){c++;var t=game.upgradeTypes[i];this.icons.push(new UpgradeIcon(t,0,0,10,c*100,140,animate));for(var ii=1;ii<5;ii++){var lock=ii-player[t.lockVar]+1;if(lock>3){break;}
lock=Math.max(lock,1);this.icons.push(new UpgradeIcon(t,lock,ii,10,c*100,220+(ii-1)*74,animate));}}}
this.resetInfo=function(){if(this.infoCurrent=='default'){return;}
this.infoCurrent='default';this.infoHeader.setString('UPGRADES');this.infoText.setString('Buy different upgrades to enhance Cliff City\'s defence against the falling rocks.')}
this.infoBox=new Sprite(pImg+'TextBox.png',9,300,568,0);this.infoHeader=new TextBlock(' ',10,80,510,400,{'font':'bold 14px Verdana'});this.infoText=new TextBlock(' ',10,80,540,440);this.infoCurrent='';this.resetInfo();this.btnNext=new Button(10,400,710,0,'CONTINUE',function(){upgradeMenu.remove();pause=0;upgradeMenu.onContinue();});this.makeUpgradeTree(1);redrawStaticLayers();this.remove=function(){this.headerBox.remove();this.headerText.remove();this.infoBox.remove();this.infoHeader.remove();this.infoText.remove();this.btnNext.remove();while(this.icons.length>0){this.icons[this.icons.length-1].remove();this.icons.splice(this.icons.length-1,1);}
redrawStaticLayers();purge(this);}}
function UpgradeIcon(){importClass(this,Sprite);constructIfNew(this,this.upgradeIcon,arguments);}
UpgradeIcon.prototype.upgradeIcon=function(_upgradeType,_buttonType,_level,_depth,_x,_y,_animate){this.buttonType=_buttonType!=undefined?_buttonType:0;this.upgradeType=_upgradeType?_upgradeType:false;this.level=_level!=undefined?_level:false;animate=_animate?_animate:0;var spr;switch(this.buttonType){case 0:spr='0';this.name=this.upgradeType.name
this.description=this.upgradeType.description;break;case 1:spr='1';this.name=this.upgradeType.upgrades[this.level-1].name
this.description=this.upgradeType.upgrades[this.level-1].description;break;case 2:this.name=this.upgradeType.upgrades[this.level-1].name+" ("+this.upgradeType.upgrades[this.level-1].price+"$)";this.description=this.upgradeType.upgrades[this.level-1].description;if(player.points<this.upgradeType.upgrades[this.level-1].price){this.name+=" - Insufficient funds";spr='2c';}else{spr='2a';}
break;case 3:spr='3';this.name='Mysterious future upgrade';this.description='A description of this upgrade is not available yet.';break;}
this.sprite(pImg+'Upgrades/btn'+spr+'.png',_depth,_x,_y,0);this.icon=this.addChild(new Sprite(pImg+'Upgrades/'+this.upgradeType.folder+'/'+this.level+(this.buttonType==3?2:1)+'.png',_depth,_x,_y,0));updateObjects.onPaused[this.id]=this;if(animate){this.bmSize=0;this.icon.bmSize=0;this.animate({bmSize:1},{dur:400});this.icon.animate({bmSize:1},{dur:400});}}
UpgradeIcon.prototype.update=function(){if(Math.abs(mouse.x-this.x)<36&&Math.abs(mouse.y-this.y)<36){if(mouse.isPressed(1)&&this.buttonType==2&&player.points>=this.upgradeType.upgrades[this.level-1].price){player[this.upgradeType.lockVar]++;player.addPoints(-this.upgradeType.upgrades[this.level-1].price);upgradeMenu.makeUpgradeTree();}
if(this.buttonType==2&&player.points>=this.upgradeType.upgrades[this.level-1].price){this.bm=loader.images[pImg+'Upgrades/btn2b.png'];}
if(upgradeMenu.infoCurrent!=this.id){upgradeMenu.infoCurrent=this.id;upgradeMenu.infoHeader.setString(this.name);upgradeMenu.infoText.setString(this.description);}}else{if(this.buttonType==2&&player.points>=this.upgradeType.upgrades[this.level-1].price){this.bm=loader.images[pImg+'Upgrades/btn2a.png'];}
if(upgradeMenu.infoCurrent==this.id){upgradeMenu.resetInfo();}}}
function ShopCircle(building){importClass(this,ObjectContainer);this.building=building;this.x=building.x;this.y=building.y;this.id="shopCircle";updateObjects.onRunning[this.id]=this;this.selectType=function(){this.removeChildren();if(player.shieldsAvailable>0){if(player.weaponsAvailable>0){this.addChild(new ShopIcon(game.upgradeTypes[1],0,this.x,this.y,this.x+15,this.y));this.addChild(new ShopIcon(game.upgradeTypes[0],0,this.x,this.y,this.x-15,this.y));}else{this.addChild(new ShopIcon(game.upgradeTypes[1],0,this.x,this.y,this.x,this.y));}}else{if(player.weaponsAvailable>0){this.addChild(new ShopIcon(game.upgradeTypes[0],0,this.x,this.y,this.x,this.y));}else{this.building=false;}}}
this.update=function(){cursorDist=Math.sqrt(Math.pow(mouse.x-this.x,2)+Math.pow(mouse.y-this.y,2));if(cursorDist>Math.max(this.building.bmWidth,this.building.bmHeight)+10){this.remove();}}
this.circleMenu=function(upgradeType){this.removeChildren();var u=upgradeType;switch(player[u.lockVar]){case 4:this.addChild(new ShopIcon(u,4,this.x,this.y,this.x+15,this.y+15));case 3:this.addChild(new ShopIcon(u,1,this.x,this.y,this.x-15,this.y-15));this.addChild(new ShopIcon(u,2,this.x,this.y,this.x+15,this.y-15));this.addChild(new ShopIcon(u,3,this.x,this.y,this.x-15,this.y+15));break;case 2:this.addChild(new ShopIcon(u,1,this.x,this.y,this.x-15,this.y));this.addChild(new ShopIcon(u,2,this.x,this.y,this.x+15,this.y));break;case 1:this.addChild(new ShopIcon(u,1,this.x,this.y,this.x,this.y));break;}}
this.selectType()}
ShopCircle.prototype.remove=function(){this.removeChildren();purge(this);delete shopCircle;}
function ShopIcon(){importClass(this,Sprite);constructIfNew(this,this.shopIcon,arguments);}
ShopIcon.prototype.shopIcon=function(_type,_level,_x,_y,_toX,_toY){this.sprite(pImg+'Upgrades/btn11c.png',10,_x,_y,0);if(_type==undefined||_level==undefined){return;}
this.type=_type;this.level=_level;this.alive=true;this.icon=new Sprite(pImg+'Upgrades/'+this.type.folder+'/'+this.level+'1.png',10,_x,_y,0);updateObjects.onRunning[this.id]=this;updateObjects.onPaused[this.id]=this;this.bmSize=0;this.icon.opacity=0;this.animate({bmSize:0.4},{dur:150,callback:function(){this.animate({x:_toX,y:_toY},{dur:200});}});}
ShopIcon.prototype.remove=function(){this.alive=false;this.icon.animate({bmSize:0.0},{dur:150,callback:function(){purge(this);}});this.animate({bmSize:0.0},{dur:150,callback:function(){purge(this);}});}
ShopIcon.prototype.update=function(){if(!this.alive){return;}
this.icon.x=this.x;this.icon.y=this.y;this.icon.opacity=this.opacity;this.icon.bmSize=this.bmSize;if(this.level!=0){if(this.type.upgrades[this.level-1].shopPrice>player.points){return;}
switch(this.type.lockVar){case'weaponsAvailable':if(shopCircle.building.gun){if(shopCircle.building.gun.type==this.level){return;}}
break;case'shieldsAvailable':if(shopCircle.building.shield.type==this.level&&shopCircle.building.shield.enabled){return;}
break;}}
if(Math.abs(mouse.x-this.x)<15&&Math.abs(mouse.y-this.y)<15){if(mouse.isPressed(1)){if(this.level==0){shopCircle.circleMenu(this.type);}else{if(this.type.folder=="Weapons"){player.weaponsBought++;}else{player.shieldsBought++;}
this.type.upgrades[this.level-1].onBought();player.addPoints(-this.type.upgrades[this.level-1].shopPrice);shopCircle.remove();}}
this.bm=loader.images[pImg+'Upgrades/btn11b.png'];}else{this.bm=loader.images[pImg+'Upgrades/btn11.png'];}}
function SpecialUpgrades(){new Sprite(pImg+'HeaderBox.png',9,300,55,0);new TextBlock('SPECIAL OFFERS:',9,0,24,600,{'font':'normal 36px Verdana','align':'center'});new Sprite(pImg+'FarmerHeadSelected.png',9,150,170,0);new Sprite(pImg+'ScientistHead.png',9,300,162,0);new Sprite(pImg+'WomanHead.png',9,450,172,0);new Sprite(pImg+'Farmer.png',9,155,395,0);new Sprite(pImg+'Bubble.png',9,390,395,0);text='I\'ve looked around my barn and I\'ve managed to find a large pile of wood boards behind one of my silos.\n\nThe boards will make a weak but yet useful defence against the rocks, if we cover our buildings with them.\n\nI\'ll do the work if you take care of my cows meanwhile.\n\nDo we have a deal? (2000$)';new TextBlock(text,9,307,270,210);new Sprite(pImg+'TextBox.png',9,300,638,0);text="Upgrade info:";new TextBlock(text,9,88,580,400,{'font':'bold 14px Verdana'});text='All buildings will be covered with wood, making them more resistant to the rocks.';new TextBlock(text,9,88,610,450);new Button(10,400,710,0,'ACCEPT OFFER',function(){console.write('BTN 2 clicked')});redrawStaticLayers();}
function Button(){importClass(this,Sprite);constructIfNew(this,this.button,arguments);}
Button.prototype.button=function(_depth,_x,_y,_dir,_text,_onClick){this.sprite(pImg+'Button.png',_depth,_x,_y,_dir);this.disabled=false;if(!_onClick||!_text){return false;}
this.onClick=_onClick;this.textBlock=this.addChild(new TextBlock(_text,_depth,this.x-108,this.y-13,217,{'font':'16px Verdana','lineHeight':20,'align':'center'}));updateObjects['onPaused'][this.id]=this;updateObjects['onRunning'][this.id]=this;}
Button.prototype.enable=function(){this.disabled=false;}
Button.prototype.disable=function(){this.disabled=true;}
Button.prototype.update=function(){this.textBlock.x=this.x-108;this.textBlock.y=this.y-13;this.textBlock.opacity=this.opacity;if(this.disabled){this.bm=loader.images[pImg+'ButtonDisabled.png'];return;}
if(Math.abs(mouse.x-this.x)<84&&Math.abs(mouse.y-this.y)<27){if(mouse.isPressed(1)){this.onClick();}
this.bm=loader.images[pImg+'ButtonSelected.png'];}else{this.bm=loader.images[pImg+'Button.png'];}}
function SpriteButton(){importClass(this,Sprite);constructIfNew(this,this.spriteButton,arguments);}
SpriteButton.prototype.spriteButton=function(x,y,depth,onClick,sprite1,sprite2){if(x===undefined){throw new error('Argument missing: x')}
if(y===undefined){throw new error('Argument missing: y')}
if(depth===undefined){throw new error('Argument missing: depth')}
if(sprite1===undefined){throw new error('Argument missing: sprite1')}
if(onClick===undefined){throw new error('Argument missing: onClick')}
this.sprite(sprite1,depth,x,y,0);this.disabled=false;updateObjects.onRunning[this.id]=this;updateObjects.onPaused[this.id]=this;this.onClick=onClick;this.fg=sprite2===undefined?false:this.addChild(new Sprite(sprite2,depth,x,y,0));}
SpriteButton.prototype.enable=function(){this.disabled=false;}
SpriteButton.prototype.disable=function(){this.disabled=true;}
SpriteButton.prototype.update=function(){if(this.fg){this.fg.x=this.x;this.fg.y=this.y;this.fg.opacity=this.opacity;}
if(this.disabled){return;}
var sprX=this.x-this.xOff,sprY=this.y-this.yOff;if(mouse.x>sprX&&mouse.x<sprX+this.bmWidth&&mouse.y>sprY&&mouse.y<sprY+this.bmHeight){if(mouse.isPressed(1)){this.onClick(1);}
if(mouse.isPressed(3)){this.onClick(3);}}}
function FadeMessage(){importClass(this,TextBlock);constructIfNew(this,this.fadeMessage,arguments);}
FadeMessage.prototype.fadeMessage=function(text,depth,y,spawnTime,lifeTime,addOpt){this.textBlock(text,depth,300,y,600,addOpt);this.timeOfBirth=gameTime+spawnTime;this.spawned=false;this.timeOfDeath=gameTime+spawnTime+lifeTime-300;this.dead=false;updateObjects.onRunning[this.id]=this;stageController.messages[this.id]=this;}
FadeMessage.prototype.update=function(){if(gameTime>this.timeOfBirth&&this.spawned===false){this.spawned=true;this.animate({bmSize:1,opacity:1},{dur:300});}
if(gameTime>this.timeOfDeath&&this.dead===false){this.dead=true;this.animate({bmSize:3,opacity:0},{dur:300,callback:function(){delete stageController.messages[this.id];purge(this);}});}}
function Editor(){stageController.prepareBackgrounds();this.newSpawnArrow();this.rockType="Orange";this.rockLevel=1;this.rocks=[];this.testModeStarted=false;this.placeMode=0;this.id="Editor";this.rockButtons=[];var count=0;for(var i in rocks){if(!rocks[i].prefix){continue;}
for(var ii=0;ii<rocks[i].levels.length;ii++){var btn;btn=new SpriteButton(25,27+count*55,10,function(){editor.rockType=this.rockType;editor.rockLevel=this.rockLevel;editor.selector.animate({y:this.y},{dur:400});},pImg+"Editor/RockButtonBackground.png",pImg+"Rocks/"+rocks[i].prefix+(ii+1)+".png");btn.rockType=rocks[i].prefix;btn.rockLevel=ii+1;btn.xOff+=5;count++;this.rockButtons.push(btn);}}
this.selector=new Sprite(pImg+"Editor/RockSelectorBox.png",10,-10,27,0,{xOff:0});this.btnSave=new SpriteButton(25,613,10,function(){var level={'name':'Saved Level','prepareTime':'5000','rocks':editor.rocks};editor.testBeforeSave();},pImg+"Editor/RockButtonBackground.png",pImg+"Editor/Floppy.png");this.btnSave.xOff+=5;this.btnTestMode=new SpriteButton(25,668,10,function(){if(editor.testModeStarted){editor.endTestMode();}else{editor.startTestMode();}},pImg+"Editor/RockButtonBackground.png",pImg+"Editor/Play.png");this.btnTestMode.xOff+=5;this.btnMainMenu=new SpriteButton(25,723,10,function(){editor.remove();game.spawnMainMenu();},pImg+"Editor/RockButtonBackground.png",pImg+"Editor/Quit.png");this.btnMainMenu.xOff+=5;updateObjects.onRunning[this.id]=this;stageController.createDummies();this.showTooltips();}
Editor.prototype.remove=function(){this.btnTestMode.remove();this.btnSave.remove();this.btnMainMenu.remove();this.selector.remove();this.spawnArrow.remove();stageController.removeDummies();for(var i=0;i<this.rockButtons.length;i++){this.rockButtons[i].remove();}
for(var i=0;i<this.rocks.length;i++){var markers=this.rocks[i].markers;for(var ii=0;ii<markers.length;ii++){markers[ii].animate({opacity:0},{dur:200,callback:function(){purge(this);}})}}
delete this.rocks;stageController.destroyBackgrounds()
purge(this);}
Editor.prototype.newSpawnArrow=function(){this.spawnArrow=new Sprite(pImg+"Editor/SpawnArrow.png",11,-50,-25,Math.PI/2,{xOff:-50,opacity:0});this.spawnArrow.x=Math.max(100,Math.min(500,Math.round(mouse.x/editorSettings.spawnPositionStepSize)*50));}
Editor.prototype.startTestMode=function(){if(this.rocks.length===0){return;}
this.testModeStarted=true;this.btnTestMode.fg.bm=loader.images[pImg+'Editor/Stop.png'];this.selector.animate({x:-65},{dur:200});this.btnSave.animate({x:-30},{dur:200});this.btnMainMenu.animate({x:-30},{dur:200});for(var i=0;i<this.rocks.length;i++){var rock=this.rocks[i];for(var ii=0;ii<rock.markers.length;ii++){rock.markers[ii].animate({opacity:0},{dur:500});}}
for(var i=0;i<this.rockButtons.length;i++){this.rockButtons[i].animate({x:-30},{dur:200});}
var level={'name':'Saved Level','prepareTime':'5000','rocks':editor.rocks};stageController.prepareGame();player.shieldsAvailable=4;player.weaponsAvailable=4;player.weaponIntelligence=0;player.rocketBlastRangeLevel=4;player.rocketDmgLevel=0;player.cannonAutomatic=0;player.rocketBounces=0;player.addPoints(10000);stageController.removeDummies();redrawStaticLayers();stageController.startLevel(level,function(){editor.endTestMode();});}
Editor.prototype.testBeforeSave=function(){if(this.rocks.length<10){this.testModeStarted=true;this.btnSave.disable();this.btnMainMenu.disable();this.btnTestMode.disable();for(var i=0;i<this.rocks.length;i++){var rock=this.rocks[i];for(var ii=0;ii<rock.markers.length;ii++){if(!rock.markers[ii].disable){continue;}
rock.markers[ii].disable();}}
for(var i=0;i<this.rockButtons.length;i++){this.rockButtons[i].disable();}
game.showDialog(new Sprite(pBg+'EditorNotEnoughRocks.png',11,320,345,0,{opacity:0}),new Button(11,320,421,0,'Back to editor',function(){game.clearDialog();editor.testModeStarted=false;editor.btnSave.enable();editor.btnMainMenu.enable();editor.btnTestMode.enable();for(var i=0;i<editor.rocks.length;i++){var rock=editor.rocks[i];for(var ii=0;ii<rock.markers.length;ii++){if(!rock.markers[ii].enable){continue;}
rock.markers[ii].enable();}}
for(var i=0;i<editor.rockButtons.length;i++){editor.rockButtons[i].enable();}}))
return;}
this.btnSave.disable();this.testModeStarted=true;this.btnTestMode.fg.bm=loader.images[pImg+'Editor/Stop.png'];this.selector.animate({x:-65},{dur:200});this.btnSave.animate({x:-30},{dur:200});this.btnMainMenu.animate({x:-30},{dur:200});for(var i=0;i<this.rocks.length;i++){var rock=this.rocks[i];for(var ii=0;ii<rock.markers.length;ii++){rock.markers[ii].animate({opacity:0},{dur:500});}}
for(var i=0;i<this.rockButtons.length;i++){this.rockButtons[i].animate({x:-30},{dur:200});}
var level={'name':'Saved Level','prepareTime':'5000','rocks':editor.rocks};stageController.prepareGame();player.shieldsAvailable=4;player.weaponsAvailable=4;player.weaponIntelligence=0;player.rocketBlastRangeLevel=4;player.rocketDmgLevel=0;player.cannonAutomatic=0;player.rocketBounces=0;player.addPoints(10000);stageController.removeDummies();redrawStaticLayers();stageController.startLevel(level,function(){levelServer.saveLevel(level,function(data){levelServer.saveStats(data,stageController.calculateLevelStats());stageController.destroyGame();editor.remove();stageController.createDummies();stageController.prepareBackgrounds();game.btnPause.animate({x:-30},{dur:200});game.showDialog(new Sprite(pBg+'EditorSaved.png',10,320,345,0,{opacity:0}),new Button(10,320,421,0,'To main menu',function(){game.clearDialog();game.spawnMainMenu();}))});});}
Editor.prototype.endTestMode=function(){this.testModeStarted=false;this.btnTestMode.fg.bm=loader.images[pImg+'Editor/Play.png'];this.selector.animate({x:-10},{dur:200});this.btnSave.animate({x:25},{dur:200});this.btnMainMenu.animate({x:25},{dur:200});this.updateRockQueue();for(var i=0;i<this.rockButtons.length;i++){this.rockButtons[i].animate({x:25},{dur:200})}
stageController.destroyGame();stageController.createDummies();}
Editor.prototype.update=function(){if(this.testModeStarted){return;}
if(mouse.y<200&&mouse.x>52){if(this.spawnArrow.opacity!=1&&!animator.isAnimated(this.spawnArrow)){this.spawnArrow.animate({opacity:1},{dur:200});}
if(this.placeMode===0){var x=Math.max(100,Math.min(500,Math.round(mouse.x/editorSettings.spawnPositionStepSize)*50));this.spawnArrow.x=x;if(mouse.isPressed(1)){this.placeX=this.spawnArrow.x;this.placeMode=1;}}
else{test=this.spawnArrow;var d=Math.atan2(mouse.y-this.spawnArrow.y,mouse.x-this.spawnArrow.x);d=Math.max(Math.PI/6,Math.min(Math.PI/6*5,Math.round(d/(Math.PI/6))*Math.PI/6));this.spawnArrow.dir=d;if(mouse.isPressed(3)){this.placeMode=0;this.spawnArrow.dir=Math.PI/2;var x=Math.max(100,Math.min(500,Math.round(mouse.x/editorSettings.spawnPositionStepSize)*50));this.spawnArrow.x=x;this.placeX=this.spawnArrow.x;}
if(mouse.isPressed(1)){this.addRock(this.spawnArrow.x,this.spawnArrow.dir,this.rockType,this.rockLevel);}}}
else{if(this.spawnArrow.opacity!=0&&!animator.isAnimated(this.spawnArrow)){this.spawnArrow.animate({opacity:0},{dur:200});}
this.spawnArrow.dir=Math.PI/2;this.placeMode=0;}}
Editor.prototype.showTooltips=function(){pause=1;game.showDialog(new Sprite(pBg+'EditorHelp.png',10,320,375,0,{opacity:0}),btn=new Button(10,320,436,0,'Continue',function(){game.clearDialog();pause=0}));}
Editor.prototype.addRock=function(position,dir,type,level){var rock=new SpriteButton(545,230,10,function(){},pImg+'Rocks/'+type+level+'.png'),up=new SpriteButton(560,230,10,function(){var rock=editor.rocks[this.position];editor.rocks.splice(this.position,1);editor.rocks.splice(this.position+1,0,rock);editor.updateRockQueue();},pImg+'Editor/Up.png'),down=new SpriteButton(575,230,10,function(){if(!this.position){return;}
var rock=editor.rocks[this.position];editor.rocks.splice(this.position,1);editor.rocks.splice(this.position-1,0,rock);editor.updateRockQueue();},pImg+'Editor/Down.png'),cross=new SpriteButton(590,230,10,function(){var markers=editor.rocks[this.position].markers;for(var i=0;i<markers.length;i++){var m=markers[i];if(m.disable){m.disable();}
m.animate({opacity:0},{dur:200,callback:function(){purge(this);}})}
editor.rocks.splice(this.position,1);editor.updateRockQueue();},pImg+'Editor/Cross.png'),timer=new SpriteButton(571,230,10,function(btn){t=parseFloat(this.text.string);if(btn==1){t+=.5;}else{t-=.5;}
var tMin=0;if(t>=10){t=tMin;}else if(t<tMin){t=9.5;}
t=Math.round(t*10)/10;editor.rocks[this.position].spawnDelay=t*1000;t=t.toString();if(t.length==1){t+='.0'}
this.text.setString(t.toString());},pImg+'Editor/IntervalTimer.png');up.yOff=down.yOff=cross.yOff=15;up.position=down.position=this.rocks.length;timer.yOff=0;var line=new Sprite(pImg+'Editor/EditorLine.png',10,300,230,0,{'opacity':0});rock.opacity=up.opacity=down.opacity=cross.opacity=timer.opacity=0;timer.text=new TextBlock(editor.rocks.length===0?'0.0':'1.0',10,570,230,18,{font:'normal 9px Verdana',align:'right',fillStyle:'#fff',yOff:-1});this.rocks.push({'spawnDelay':Math.round(parseFloat(timer.text.string)*1000),'x':position,'dir':dir,'type':type,'level':level,'markers':[line,rock,down,up,cross,timer,timer.text,this.spawnArrow]});this.placeMode=0;this.newSpawnArrow();this.updateRockQueue(1);}
Editor.prototype.updateRockQueue=function(){for(var i=0;i<this.rocks.length;i++){var rock=this.rocks[i];for(var ii=0;ii<rock.markers.length;ii++){var marker=rock.markers[ii],newY=230+(this.rocks.length-1-i)*50,newOpacity=Math.max(0,Math.min(1,1-(newY-600)/150));if(marker.disable){marker.disable();}
marker.position=i;var props={opacity:newOpacity,y:newY};if(marker.depth==11){props.xOff=marker.bmWidth/2;}
marker.animate(props,{dur:200,callback:function(){if(this.enable){this.enable();}}});}}}
function LevelServer(serverUrl){this.serverUrl=serverUrl;}
LevelServer.prototype.doRequest=function(request,data,callback){if(callback===undefined){callback=function(){};}
var xmlHttp=new XMLHttpRequest();xmlHttp.onreadystatechange=function(){if(xmlHttp.readyState==4&&xmlHttp.status==200){callback(xmlHttp.responseText);}};xmlHttp.open("GET",this.serverUrl+'/'+request+'.php?json='+data,true);xmlHttp.send(null);}
LevelServer.prototype.saveLevel=function(level,callback){var json=jsonEncode(level,['markers']);this.doRequest('saveLevel',json,callback);}
LevelServer.prototype.saveStats=function(level,stats){json=jsonEncode({level:level,impactFactor:stats.impactFactor,meanFallDistance:stats.meanFallDistance});this.doRequest('saveStats',json,function(data){});}
LevelServer.prototype.getLevel=function(levelId,onloaded){}
LevelServer.prototype.getCollections=function(onloaded){}
LevelServer.prototype.getLevelCollection=function(levelCollection,onloaded){this.doRequest('getLevels','{"levelCollection":"'+levelCollection+'"}',onloaded);}
editorSettings={"spawnPositionStepSize":50,"spawnAngleStepSize":15,"spawnTimeStepSize":500,"spawnTimeIntervals":[100,200,300,500,750,1000,1500,2000,3000]}
var loopSpeed=30;var loopsPerColCheck=2;var layers=12;var staticDepths=new Array(0,1,8,9);var canvasResX=600;var canvasResY=750;game={upgradeTypes:[{name:'Building weapons',description:'Enable your buildings to defend themselves with automatic weapons.\nEach purchased upgrade will be available as a building enhancement.',folder:'Weapons',lockVar:'weaponsAvailable',upgrades:[{name:'Heavy rifle',price:'3000',shopPrice:'1000',description:'A heavy rifle capable of damaging rocks.',onBought:function(){shopCircle.building.setGun(1);},},{name:'Minigun',price:'7000',shopPrice:'2000',description:'A fully automatic machine gun capable of shooting barrages of light ammunition.',onBought:function(){shopCircle.building.setGun(2);},},{name:'Rocket launcher',price:'20000',shopPrice:'4000',description:'Fires highly explosive shells with a blast range.',onBought:function(){shopCircle.building.setGun(3);},},{name:'Laser beamer',price:'40000',shopPrice:'8000',description:'High powered laser beamer. Hits instantly with a very powerfull laser beam, that will wipe out most rocks..',onBought:function(){shopCircle.building.setGun(4);},},]},{name:'Building shielding',description:"Buy different types of shielding for Cliff City\'s buildings.\nEach purchased upgrade will be available in the shop.",folder:'Shields',lockVar:'shieldsAvailable',upgrades:[{name:'Tree shielding',price:'3000',shopPrice:'1000',description:'Very weak but yet useable shielding.',onBought:function(){shopCircle.building.setShield(1);},},{name:'Rock shielding',price:'7000',shopPrice:'2000',description:'Slighty stronger than tree shielding.',onBought:function(){shopCircle.building.setShield(2);},},{name:'Metal shielding',price:'20000',shopPrice:'4000',description:'Strong shielding. Can take much damage.',onBought:function(){shopCircle.building.setShield(3);},},{name:'Kryptonite shielding',price:'40000',shopPrice:'8000',description:'Very strong shielding. Capable of resisting even the toughest rocks.',onBought:function(){shopCircle.building.setShield(4);},},]},{name:'Rocket Blast Ranges',description:'Make the main cannon\'s rockets more deadly by upgrading their blast ranges.\nEach upgrade permanently increases all rocket\'s blast range.',folder:'BlastRanges',lockVar:'rocketBlastRangeLevel',upgrades:[{name:'Small blast range',price:'3000',description:'Improve the main cannon\'s rockets with a noticable but not very effective blast range.',},{name:'Medium blast range',price:'7000',description:'Improve the rockets\' blast range to a useable level.',},{name:'Large blast range',price:'20000',description:'Improve the rockets\' blast range to make them very effective against groups of rocks.',},{name:'Enormeous blast range',price:'40000',description:'Improve the rockets\' blast range to the max!',},]}]}
game.levels=[{'name':'The first shakes','rocks':[{'type':'orange','spawnDelay':5000,"level":2},{'type':'orange','spawnDelay':1000},{'type':'orange','spawnDelay':4000},{'type':'orange','spawnDelay':2000},{'type':'orange','spawnDelay':2000},{'type':'orange','spawnDelay':5000},{'type':'orange','spawnDelay':1000},{'type':'orange','spawnDelay':4000},{'type':'orange','spawnDelay':500},{'type':'orange','spawnDelay':1000},{'type':'orange','spawnDelay':3000},{'type':'orange','spawnDelay':0},{'type':'orange','spawnDelay':2000},{'type':'orange','spawnDelay':2000},{'type':'orange','spawnDelay':2000},{'type':'orange','spawnDelay':0},]},{'name':'Level 2','rocks':[{'type':'orange','spawnDelay':5000,"x":100,"dir":Math.PI/2},{'type':'orange','spawnDelay':1000,"x":200,"dir":Math.PI/2},{'type':'orange','spawnDelay':1000,"x":300,"dir":Math.PI/2},{'type':'orange','spawnDelay':1000,"x":400,"dir":Math.PI/2},{'type':'orange','spawnDelay':1000,"x":500,"dir":Math.PI/2},{'type':'orange','spawnDelay':4000,"x":500,"dir":Math.PI/2},{'type':'orange','spawnDelay':1000,"x":400,"dir":Math.PI/2},{'type':'orange','spawnDelay':1000,"x":300,"dir":Math.PI/2},{'type':'orange','spawnDelay':1000,"x":200,"dir":Math.PI/2},{'type':'orange','spawnDelay':1000,"x":100,"dir":Math.PI/2},{'type':'orange','spawnDelay':4000,"x":80,"dir":Math.PI/2},{'type':'orange','spawnDelay':0,"x":120,"dir":Math.PI/2},{'type':'orange','spawnDelay':2000,"x":180,"dir":Math.PI/2},{'type':'orange','spawnDelay':0,"x":220,"dir":Math.PI/2},{'type':'orange','spawnDelay':2000,"x":280,"dir":Math.PI/2},{'type':'orange','spawnDelay':0,"x":320,"dir":Math.PI/2},{'type':'orange','spawnDelay':2000,"x":380,"dir":Math.PI/2},{'type':'orange','spawnDelay':0,"x":420,"dir":Math.PI/2},{'type':'orange','spawnDelay':2000,"x":480,"dir":Math.PI/2},{'type':'orange','spawnDelay':0,"x":520,"dir":Math.PI/2},]},{'name':'Shake 3','rocks':[{'type':'orange','spawnDelay':5000,'x':500,"dir":Math.PI/4*3},{'type':'orange','spawnDelay':500,'x':100,"dir":Math.PI/4},{'type':'orange','spawnDelay':500,'x':500,"dir":Math.PI/4*3},{'type':'orange','spawnDelay':500,'x':100,"dir":Math.PI/4},{'type':'orange','spawnDelay':500,'x':500,"dir":Math.PI/4*3},{'type':'orange','spawnDelay':500,'x':100,"dir":Math.PI/4},{'type':'orange','spawnDelay':500,'x':500,"dir":Math.PI/4*3},{'type':'orange','spawnDelay':500,'x':500,"dir":Math.PI/4},{'type':'orange','spawnDelay':500,'x':100,"dir":Math.PI/4*3},{'type':'orange','spawnDelay':500,'x':100,"dir":Math.PI/4},{'type':'orange','spawnDelay':500,'x':100,"dir":Math.PI/4},{'type':'orange','spawnDelay':500,'x':100,"dir":Math.PI/4},{'type':'orange','spawnDelay':500,'x':100,"dir":Math.PI/4*3},{'type':'orange','spawnDelay':500,'x':100,"dir":Math.PI/4*3},{'type':'orange','spawnDelay':1500,'x':100,"dir":Math.PI/4*3},{'type':'orange','spawnDelay':500,'x':200,"dir":Math.PI/4*3},{'type':'orange','spawnDelay':500,'x':300,"dir":Math.PI/4*3},{'type':'orange','spawnDelay':500,'x':400,"dir":Math.PI/4*3},{'type':'orange','spawnDelay':5000,'x':500,"dir":Math.PI/4*3},{'type':'orange','spawnDelay':1000,'x':500,"dir":Math.PI/4},{'type':'orange','spawnDelay':500,'x':400,"dir":Math.PI/4},{'type':'orange','spawnDelay':500,'x':300,"dir":Math.PI/4},{'type':'orange','spawnDelay':500,'x':200,"dir":Math.PI/4},{'type':'orange','spawnDelay':500,'x':100,"dir":Math.PI/4},]},{'name':'Magnetism','rocks':[{'type':'magnetic','spawnDelay':5000},{'type':'magnetic','spawnDelay':2000},{'type':'magnetic','spawnDelay':5000},{'type':'magnetic','spawnDelay':5000},{'type':'magnetic','spawnDelay':1000},{'type':'magnetic','spawnDelay':4000},{'type':'magnetic','spawnDelay':500},{'type':'magnetic','spawnDelay':500},{'type':'magnetic','spawnDelay':3000},{'type':'magnetic','spawnDelay':0},{'type':'magnetic','spawnDelay':2000},{'type':'magnetic','spawnDelay':1000},{'type':'magnetic','spawnDelay':1000},{'type':'magnetic','spawnDelay':4000,'level':2},]},];pImg='img/';pBg='img/Backgrounds/';var images=new Array(pImg+'GameLogo.png',pImg+'GameLogoPipes.png',pImg+'GameComplete.png',pImg+'Positioner.png',pImg+'Rocket.png',pImg+'Explosion.png',pImg+'GunShot1.png',pImg+'GunShot2.png',pImg+'GunShot3.png',pImg+'GunShot4.png',pImg+'Cloud.png',pImg+'Cannon.png',pImg+'RocketBuilding.png',pImg+'Building1.png',pImg+'Building2.png',pImg+'Building3.png',pImg+'Building4.png',pImg+'Building5.png',pImg+'Building6.png',pImg+'Building1Damaged.png',pImg+'Building2Damaged.png',pImg+'Building3Damaged.png',pImg+'Building4Damaged.png',pImg+'Building5Damaged.png',pImg+'Building6Damaged.png',pImg+'Building1Shield1.png',pImg+'Building2Shield1.png',pImg+'Building3Shield1.png',pImg+'Building4Shield1.png',pImg+'Building5Shield1.png',pImg+'Building6Shield1.png',pImg+'Building1Shield2.png',pImg+'Building2Shield2.png',pImg+'Building3Shield2.png',pImg+'Building4Shield2.png',pImg+'Building5Shield2.png',pImg+'Building6Shield2.png',pImg+'Building1Shield3.png',pImg+'Building2Shield3.png',pImg+'Building3Shield3.png',pImg+'Building4Shield3.png',pImg+'Building5Shield3.png',pImg+'Building6Shield3.png',pImg+'Building1Shield4.png',pImg+'Building2Shield4.png',pImg+'Building3Shield4.png',pImg+'Building4Shield4.png',pImg+'Building5Shield4.png',pImg+'Building6Shield4.png',pImg+'BuildingGunStand.png',pImg+'BuildingGun1.png',pImg+'BuildingGun2.png',pImg+'BuildingGun3.png',pImg+'BuildingGun4.png',pImg+'Tree.png',pImg+'AppleTree.png',pImg+'Mayor.png',pImg+'Scientist.png',pImg+'ScientistHead.png',pImg+'ScientistHeadSelected.png',pImg+'Farmer.png',pImg+'FarmerHead.png',pImg+'FarmerHeadSelected.png',pImg+'Woman.png',pImg+'WomanHead.png',pImg+'WomanHeadSelected.png',pImg+'Bubble.png',pImg+'Button.png',pImg+'ButtonSelected.png',pImg+'ButtonDisabled.png',pImg+'ButtonShadowless.png',pImg+'ButtonShadowlessSelected.png',pImg+'HeaderBox.png',pImg+'TextBox.png',pBg+'cliffCityGround.png',pBg+'cliffCityRoad.png',pBg+'cliffSide.png',pBg+'MainMenu.png',pBg+'Instructions.png',pBg+'EnhancementInstructions.png',pBg+'EditorDenial.png',pImg+'Upgrades/btn0.png',pImg+'Upgrades/btn1.png',pImg+'Upgrades/btn11.png',pImg+'Upgrades/btn11b.png',pImg+'Upgrades/btn11c.png',pImg+'Upgrades/btn2a.png',pImg+'Upgrades/btn2b.png',pImg+'Upgrades/btn2c.png',pImg+'Upgrades/btn3.png',pImg+'Upgrades/BlastRanges/01.png',pImg+'Upgrades/BlastRanges/11.png',pImg+'Upgrades/BlastRanges/21.png',pImg+'Upgrades/BlastRanges/22.png',pImg+'Upgrades/BlastRanges/31.png',pImg+'Upgrades/BlastRanges/32.png',pImg+'Upgrades/BlastRanges/41.png',pImg+'Upgrades/BlastRanges/42.png',pImg+'Upgrades/Weapons/01.png',pImg+'Upgrades/Weapons/11.png',pImg+'Upgrades/Weapons/21.png',pImg+'Upgrades/Weapons/22.png',pImg+'Upgrades/Weapons/31.png',pImg+'Upgrades/Weapons/32.png',pImg+'Upgrades/Weapons/41.png',pImg+'Upgrades/Weapons/42.png',pImg+'Upgrades/Shields/01.png',pImg+'Upgrades/Shields/11.png',pImg+'Upgrades/Shields/21.png',pImg+'Upgrades/Shields/22.png',pImg+'Upgrades/Shields/31.png',pImg+'Upgrades/Shields/32.png',pImg+'Upgrades/Shields/41.png',pImg+'Upgrades/Shields/42.png',pImg+'Rocks/Orange1.png',pImg+'Rocks/Orange1Cracks.png',pImg+'Rocks/Orange2.png',pImg+'Rocks/Orange2Cracks.png',pImg+'Rocks/Magnetic1.png',pImg+'Rocks/Magnetic1Cracks.png',pImg+'Rocks/Magnetic2.png',pImg+'Rocks/Magnetic2Cracks.png',pImg+'Rocks/Fast1.png',pImg+'Rocks/Fast1Cracks.png',pImg+'Rocks/Fast2.png',pImg+'Rocks/Fast2Cracks.png',pImg+'Particles/MagneticFracture.png',pImg+'Particles/OrangeFracture.png',pImg+'Editor/SpawnArrow.png',pImg+'Editor/RockButtonBackground.png',pImg+'Editor/RockSelectorBox.png',pImg+'Editor/EditorLine.png',pImg+'Editor/Up.png',pImg+'Editor/Down.png',pImg+'Editor/IntervalTimer.png',pImg+'Editor/Cross.png',pImg+'Editor/Floppy.png',pImg+'Editor/Play.png',pImg+'Editor/Stop.png',pImg+'Editor/Quit.png',pImg+'Editor/Pause.png',pBg+'EditorHelp.png',pBg+'EditorSaved.png',pBg+'EditorNotEnoughRocks.png')
var sounds=new Array('sfx/astroid1.wav','sfx/explosion3.wav','sfx/shield2.wav','sfx/powerup2.wav','sfx/Gun412.wav','sfx/Gun422.wav','sfx/Gun432.wav','sfx/Gun442.wav')
rocks={orange:{description:"A regular piece of orange cliff.",prefix:"Orange",onDestroy:function(){for(var i=0;i<5;i++){var speed=100+Math.random()*100;var dir=Math.random()*2*Math.PI;var dX=Math.cos(dir)*speed;var dY=Math.sin(dir)*speed;new Particle(pImg+'Particles/OrangeFracture.png',4,this.x,this.y,dir,300+Math.random()*300,{gravity:500,dX:dX,dY:dY})}},levels:[{life:100,value:400,gravity:150,maxSpeed:120},{life:350,value:1600,gravity:80,maxSpeed:100}]},magnetic:{description:"A solid and magnetic rock.",prefix:"Magnetic",onDestroy:function(){for(var i=0;i<5;i++){var speed=100+Math.random()*100;var dir=Math.random()*2*Math.PI;var dX=Math.cos(dir)*speed;var dY=Math.sin(dir)*speed;new Particle(pImg+'Particles/MagneticFracture.png',4,this.x,this.y,dir,300+Math.random()*300,{gravity:500,dX:dX,dY:dY})}},onStep:function(){if(frames%2){return;}
if(!this.alive){return;}
for(var i in depth[3]){var cObj=depth[3][i];if(!cObj.alive){continue;}
var dist=Math.sqrt(Math.pow(cObj.x-this.x,2)+Math.pow(cObj.y-this.y,2))
var dir=Math.atan2(this.y-cObj.y,this.x-cObj.x);var b=0.9;var acc=100*Math.pow(b,dist/5);this.dX+=Math.cos(dir)*acc;this.dY+=Math.sin(dir)*acc;}},levels:[{life:150,value:600,gravity:200,maxSpeed:150},{life:500,value:2000,gravity:100,maxSpeed:130}]},fast:{description:"A fast but not very solid rock.",prefix:"Fast",onDestroy:function(){for(var i=0;i<5;i++){var speed=100+Math.random()*100;var dir=Math.random()*2*Math.PI;var dX=Math.cos(dir)*speed;var dY=Math.sin(dir)*speed;new Particle(pImg+'Particles/OrangeFracture.png',4,this.x,this.y,dir,300+Math.random()*300,{gravity:500,dX:dX,dY:dY})}},levels:[{life:70,value:500,gravity:200,maxSpeed:200},{life:200,value:1200,gravity:200,maxSpeed:150}]},}
function copyVars(from,to){for(var i in from){if(i==undefined){continue;}
to[i]=from[i];}}
function importClass(importer,Class){if(typeof Class!=="function"){throw new Error('Invalid className');}
var inheritFrom=new Class;importerClass={};importerClass=Object.getPrototypeOf(importer);for(var i in inheritFrom){if(i==undefined||typeof(importerClass[i])=="function"){continue;}
importer[i]=inheritFrom[i];}
return true;}
function constructIfNew(object,constructor,arguments){if(arguments.length>0){constructor.apply(object,arguments);}}
function purge(obj){if(!obj){return;}
if(obj.bm!==undefined){delete obj.bm;}
if(updateObjects['onRunning'][obj.id]!==undefined){delete updateObjects['onRunning'][obj.id];}
if(updateObjects['onPaused'][obj.id]!==undefined){delete updateObjects['onPaused'][obj.id];}
if(obj.depth!==undefined){delete depth[obj.depth][obj.id];}}
jsonEncode=function(obj,ignore){function jsonIterate(obj,ignore){var ignore=ignore==undefined?[]:ignore;var ret='';switch(typeof obj){case'string':case'number':ret+='"'+obj+'",';break;case'object':if(obj instanceof Array){ret+='['
for(var i=0;i<obj.length;i++){ret+=jsonIterate(obj[i],ignore);}
ret+='],'}else{ret+='{';for(var i in obj){if(ignore.indexOf(i)!=-1){continue};ret+='"'+i+'":';ret+=jsonIterate(obj[i],ignore);}
ret+='},'}
break;}
return ret;}
var json=jsonIterate(obj,ignore);return json.replace(/,\}/gi,'}').replace(/,\]/gi,']').replace(/,$/,'');}
var frames=0,steps=0,last=new Date().getTime(),gameTime=0,timeLeft,now=last,updatesPerformed=false,loopSpeed=loopSpeed?loopSpeed:30,loopsPerColCheck=loopsPerColCheck?loopsPerColCheck:2,useCanvas=useCanvas?useCanvas:true;curId=0,pause=true,arena=document.getElementById('arena'),depth=new Array(),nonStaticDepths=[],nonStaticCtxs=[],staticDepths=staticDepths?staticDepths:[],staticCtxs=[],updateObjects={'onRunning':{},'onPaused':{}},images=images?images:array(),sounds=sounds?sounds:array();for(var i=0;i<layers;i++){depth.push(new Object());}
arena.oncontextmenu=function(){return false;}
if(useCanvas){function makeCanvas(){c=document.createElement("canvas");c.setAttribute('style',"position:absolute;left:0px;top:0px;width:100%;height:100%");c.width=canvasResX;c.height=canvasResY;arena.appendChild(c);ctx=c.getContext('2d');return ctx;}
depthMap=[];var lastStat,lastCtx;for(var i=0;i<depth.length;i++){stat=staticDepths.indexOf(i)!=-1?true:false;if(!stat){nonStaticDepths.push(i);}
if(stat===lastStat){depthMap[i]=lastCtx;}else{lastCtx=depthMap[i]=makeCanvas();if(stat){staticCtxs.push(lastCtx);}else{nonStaticCtxs.push(lastCtx);}
lastStat=stat;}}}
var keyboard=new KeyboardIndex(),mouse=new MouseIndex(),loader=new Loader(),animator=new Animator();loader.loadImages(images)
loader.loadSounds(sounds);function clearStage(){for(var i in depth){for(var ii in depth[i]){depth[i][ii].remove();}}
last=new Date().getTime();gameTime=0;now=last;pause=1;curId=0;timeLeft=0;}
function clearDepth(depth){if(depth==="undefined"){throw new Error('Missing argument: "depth"');}
if(typeof depth=="number"){depth=window.depth[depth];}
for(var i in depth){purge(depth[i]);}}
function startGame(){clearStage();pause=0;game.onStart();}
function mainLoop(){now=new Date().getTime();updatesPerformed=false;frames++;animator.updateAll(1);if(!pause){game.onStep();var c=frames/loopsPerColCheck;if(c/Math.floor(c)==1){for(var i in depth[2]){var obj=depth[2][i];if(obj.cols()){obj.cols();}}
for(var i in depth[3]){depth[3][i].cols();}
for(var i in depth[4]){depth[4][i].cols();}
for(var i in depth[5]){depth[5][i].cols();}}
animator.updateAll(0);for(var i in updateObjects['onRunning']){updateObjects['onRunning'][i].update();}
gameTime+=now-last;steps++;}else{for(var i in updateObjects['onPaused']){updateObjects['onPaused'][i].update();}}
updatesPerformed=true;game.onFrame();if(useCanvas){redrawNonStaticLayers();}
else{for(var i in depth){for(var ii in depth[i]){depth[i][ii].drawHTML();}}}
last=now;setTimeout("mainLoop()",loopSpeed);}
function redrawStaticLayers(){for(var i=0;i<staticCtxs.length;i++){staticCtxs[i].clearRect(0,0,canvasResX,canvasResY);}
for(var i=0;i<staticDepths.length;i++){var d=staticDepths[i];for(var ii in depth[d]){depth[d][ii].drawCanvas();}}}
function redrawNonStaticLayers(){var nSC=nonStaticCtxs,nSD=nonStaticDepths,d=depth;for(var i=0;i<nSC.length;i++){nSC[i].clearRect(0,0,canvasResX,canvasResY);}
for(var i=0;i<nSD.length;i++){for(var ii in d[nSD[i]]){d[nSD[i]][ii].drawCanvas();}}}
setTimeout("mainLoop()",loopSpeed);game.onStartGame=function(){};game.onGameStep=function(){};game.onFrame=function(){};game.onLoaded=function(){};game.onClearStage=function(){};game.dialogObjects=[]
game.onLoaded=function(){stageController=new StageController();levelServer=new LevelServer(location.href.replace(/\/\w*\.*\w*$/,'')+'/levelServer');game.spawnMainMenu();game.store=localStorage;game.store.levelsCompleted=game.store.levelsCompleted?game.store.levelsCompleted:0;game.btnPause=new SpriteButton(-30,723,10,function(){game.spawnInGameMenu();this.animate({x:-30},{dur:200});pause=1;},pImg+"Editor/RockButtonBackground.png",pImg+"Editor/Pause.png");game.btnPause.xOff+=5;}
game.showDialog=function(obj1,obj2,obj3){this.dialogObjects.push.apply(this.dialogObjects,arguments);for(var i=0;i<this.dialogObjects.length;i++){var obj=this.dialogObjects[i];obj.animate({opacity:1,x:300},{dur:500});}}
game.clearDialog=function(){while(this.dialogObjects.length){var obj=this.dialogObjects[0];if(obj.disable){obj.disable();}
obj.animate({opacity:0,bmSize:1.2},{dur:200,callback:function(){this.remove();}})
this.dialogObjects.splice(0,1);}}
game.onLevelSucceed=function(){levelServer.saveStats(stageController.level.lid,stageController.calculateLevelStats());if(player.currentLevel==game.levels.length-1){game.showDialog(new Sprite(pImg+'GameLogoPipes.png',10,320,360,0,{opacity:0}),new Sprite(pImg+'GameLogoPipes.png',10,320,550,0,{opacity:0}),new Sprite(pImg+'GameLogo.png',10,320,180,0,{opacity:0}),new Sprite(pImg+'GameComplete.png',10,320,429,0,{opacity:0}),new TextBlock(parseInt(player.pointsTotal).toString(),10,320,462,90,{align:'right',font:'normal 12px Verdana',opacity:0}),new TextBlock(parseInt(player.rocksDestroyed).toString(),10,320,477,90,{align:'right',font:'normal 12px Verdana',opacity:0}),new TextBlock(parseInt(player.buildingsLost).toString(),10,320,492,90,{align:'right',font:'normal 12px Verdana',opacity:0}),new TextBlock(parseInt(player.buildingsDamaged).toString(),10,320,507,90,{align:'right',font:'normal 12px Verdana',opacity:0}),new TextBlock(parseInt(player.weaponsBought).toString(),10,320,522,90,{align:'right',font:'normal 12px Verdana',opacity:0}),new TextBlock(parseInt(player.shieldsBought).toString(),10,320,537,90,{align:'right',font:'normal 12px Verdana',opacity:0}),new Button(10,320,598,0,'TO MAIN MENU',function(){game.clearDialog();stageController.destroyGame();stageController.destroyBackgrounds();game.spawnMainMenu();}))
game.btnPause.animate({x:-30},{dur:200});}
else{player.currentLevel++;upgradeMenu=new UpgradeMenu(function(){stageController.startLevel(game.levels[player.currentLevel]);if(this.player.shieldsAvailable+this.player.weaponsAvailable==0&&player.shieldsAvailable+player.weaponsAvailable>0){pause=1;game.instructions=new Sprite(pBg+'EnhancementInstructions.png',10,320,375,0,{opacity:0});var btn=new Button(10,320,466,0,'Continue',function(){game.instructions.animate({opacity:0,bmSize:1.2},{dur:200,easing:'quadOut',callback:function(){this.remove();}})
this.animate({opacity:0,bmSize:1.2},{dur:200,easing:'quadOut',callback:function(){this.remove();pause=0;}})});game.instructions.animate({opacity:1,x:300},{dur:500,easing:'quadOut'});btn.animate({opacity:1,x:300},{dur:500,easing:'quadOut'});}
stageController.running=true;game.btnPause.animate({x:25},{dur:200});});game.btnPause.animate({x:-30},{dur:200});upgradeMenu.player={shieldsAvailable:player.shieldsAvailable,weaponsAvailable:player.weaponsAvailable}}}
game.onLevelFail=function(){levelServer.saveStats(stageController.level.lid,stageController.calculateLevelStats());pause=1;new CustomMenu(10,300,375,[{text:'Retry level',onClick:function(){stageController.restartLevel();pause=0;this.parent.remove();}},{text:'Go to main menu',onClick:function(){stageController.destroyGame();stageController.destroyBackgrounds();game.spawnMainMenu();this.parent.remove();}}])}
game.spawnMainMenu=function(){stageController.prepareBackgrounds();stageController.createDummies();game.showDialog(new Sprite(pImg+'GameLogoPipes.png',10,320,430,0,{opacity:0}),new Sprite(pImg+'GameLogo.png',10,320,254,0,{opacity:0}),new CustomMenu(10,320,450,[{text:'PLAY',onClick:function(){stageController.prepareBackgrounds();stageController.prepareGame();stageController.removeDummies();game.clearDialog();pause=0;player.currentLevel=0;levelServer.getLevelCollection('',function(data){eval('var collection='+data);game.levels=collection.levels;stageController.startLevel(game.levels[player.currentLevel],game.onLevelSucceed,game.onLevelFail);game.showGameplayInstructions();})}},{text:"CREATE LEVELS",onClick:function(){game.clearDialog();if(game.store.levelsCompleted>2){editor=new Editor();}
else{game.instructions=new Sprite(pBg+'EditorDenial.png',10,320,345,0,{opacity:0});btn=new Button(10,320,421,0,'Back to menu',function(){game.instructions.animate({opacity:0,bmSize:1.2},{dur:200,easing:'quadOut',callback:function(){this.remove();}})
this.animate({opacity:0,bmSize:1.2},{dur:200,easing:'quadOut',callback:function(){this.remove();pause=0;}})
game.spawnMainMenu();});game.instructions.animate({opacity:1,x:300},{dur:500,easing:'quadOut'});btn.animate({opacity:1,x:300},{dur:500,easing:'quadOut'});}}}]))
pause=0;}
game.spawnInGameMenu=function(){this.showDialog(new Sprite(pImg+'GameLogoPipes.png',10,320,430,0,{opacity:0}),new Sprite(pImg+'GameLogo.png',10,320,254,0,{opacity:0}),new CustomMenu(10,320,450,[{text:'CONTINUE',onClick:function(){game.clearDialog();game.btnPause.animate({x:25},{dur:200});setTimeout(function(){pause=0},500);}},{text:"TO MAIN MENU",onClick:function(){game.clearDialog();stageController.destroyGame();game.spawnMainMenu();}}]))}
game.showGameplayInstructions=function(){pause=1;this.showDialog(new Sprite(pBg+'Instructions.png',10,320,375,0,{opacity:0}),new Button(10,320,412,0,'Start playing',function(){game.clearDialog();game.btnPause.animate({x:25},{dur:200,callback:function(){pause=0}});}));}
game.onStart=function(){};game.onStep=function(){};game.onFrame=function(){};function resizeCanvas(){windowWH=window.innerWidth/window.innerHeight;gameWH=canvasResX/canvasResY;if(windowWH>gameWH){var h=window.innerHeight;var w=canvasResX/canvasResY*h;}else{var w=window.innerWidth;var h=canvasResY/canvasResX*w;}
w=Math.min(w,canvasResX);h=Math.min(h,canvasResY);arena.style.top="50%";arena.style.left="50%";arena.style.marginTop=-h/2+"px";arena.style.marginLeft=-w/2+"px";arena.style.height=h+"px";arena.style.width=w+"px";}
window.addEventListener('resize',resizeCanvas,false)
resizeCanvas();