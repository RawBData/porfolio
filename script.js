(function(){
'use strict';

/* ───────────────────────── content ───────────────────────── */
var LINKS={
  email:'BenRaw11@gmail.com',
  linkedin:'https://www.linkedin.com/in/benjaminrawner/',
  github:'https://github.com/RawBData'
};
var SUMMARY='Web developer with four years of professional front-end and CMS work and a full-stack background in React, JavaScript, Node and Rails. I build and ship client sites end to end, from responsive front ends and Stripe checkout flows to analytics tracking, hosting and AI agent workflows.';
var SKILLS=['JavaScript','React','React Native','Redux','Node.js','Rails','PostgreSQL','MongoDB','HTML5','CSS3','SQL','Swift','WordPress','Contentful','Stripe API','GA4 + GTM','n8n','Docker','Git','Claude Code'];
var SKILL_GROUPS=[
  ['Languages','JavaScript (ES6+), HTML5, CSS3, SQL, Ruby, Swift'],
  ['Front end','React, React Native, Redux, jQuery, responsive and mobile-first builds, accessibility (WAI, Section 508)'],
  ['Back end and data','Node.js, Express, Ruby on Rails, REST APIs, PostgreSQL, MongoDB, SQLite'],
  ['CMS and platforms','WordPress, Contentful, Magnolia CMS, Stripe API'],
  ['Analytics and automation','Google Tag Manager, Google Analytics (GA4), Microsoft Clarity, n8n'],
  ['AI','Agent workflows with Claude Code and the Claude, OpenAI and Gemini APIs'],
  ['DevOps and tools','Git, Docker, VPS hosting (CyberPanel, HestiaCP), RSpec, test-driven development']
];
var PROJECTS=[
  {id:'sfrider',name:'SFRider',sub:'Bike data on a map',color:'#1e6fd9',tags:['React','JavaScript','HTML','CSS'],
   blurb:'A single-page React app that lays San Francisco bicycle data over several maps at once.',
   points:['Pulls from multiple OpenSF data API endpoints and shapes the JSON for each display.','Custom markers, pop-ups and routes keep the layers easy to tell apart.','A hand-built legend component replaces the stock one so every layer stays readable.'],
   link:'https://github.com/RawBData/SFRider'},
  {id:'wordstar',name:'Child Word Star',sub:'iOS reading app',color:'#f6c21c',ink:'#1b2333',tags:['Swift','iOS','CoreData','AVFoundation'],
   blurb:'A multilingual, multimedia iOS app that helps children learn to read, and that parents can fully customize.',
   points:['Designed, built and released from the ground up.','Recorded and edited 400 sound bites in 4 languages in Pro Tools.','Parents can record their own audio in any language with AVFoundation.','CoreData keeps each family\'s recordings, images and text between sessions.']},
  {id:'checkoff',name:'Checkoff',sub:'Full-stack to-do app',color:'#3aa655',tags:['Rails','React','Redux','PostgreSQL'],
   blurb:'A full-stack single-page app inspired by Remember the Milk, with to-dos, lists, schedules and tags.',
   points:['Encrypted sign-in with Rails, BCrypt, session tokens and React Router.','A PostgreSQL schema with Rails associations for fast access to user data.','Redux holds non-sensitive data for quick display and updates.','Responsive, mobile-friendly React interface.'],
   link:'https://github.com/RawBData/Checkoff'},
  {id:'tower',name:'Tower Guard',sub:'Tower defense game',color:'#7b8494',tags:['JavaScript','HTML','CSS'],
   blurb:'A single-player tower defense game in vanilla JavaScript.',
   points:['A 2D physics engine written from scratch handles collision detection and scoring.','Tuned to keep the frame rate steady as waves grow.']}
];
var JOBS=[
  {id:'freelance',name:'Freelance Web Developer',sub:'2025 to now',years:2,color:'#d8352a',org:'Independent contractor, San Francisco (remote)',when:'2025 to present',
   points:['Design, build and deploy web apps and e-commerce sites in React, JavaScript, HTML and CSS, tuned mobile-first for fast loading.','Build secure checkout and payment flows with the Stripe API.','Run one shared Google Tag Manager and Analytics framework across several client domains.','Automate client operations with AI agent workflows in n8n and Claude Code on the Claude, OpenAI and Gemini APIs.','Configure VPS hosting and Docker deployments with CyberPanel and HestiaCP.']},
  {id:'braindo',name:'BrainDo',sub:'2022 to 2025',years:3,color:'#1e6fd9',org:'Project manager with hands-on web development, Philadelphia (remote)',when:'2022 to 2025',
   points:['Built and maintained client sites on WordPress, Contentful and Magnolia CMS alongside senior developers, from months-long builds to daily updates.','Coordinated timelines and stakeholders, and checked deliverables against functional and technical requirements.','Ran QA and regression testing for new features and production releases on web and mobile.','Specified the data-layer events and interaction tracking that client reporting relied on.','Kept accessibility (WAI, Section 508) and front-end performance standards in every release.']},
  {id:'behb',name:'BEHB Law',sub:'2013 to 2019',years:6,color:'#f6c21c',ink:'#1b2333',org:'Accountant\'s assistant, San Francisco',when:'2013 to 2019',
   points:['Designed the procedures the firm used to track, manage and appeal billed-time deductions for partners and associates.','Named employee of the year for the cut those procedures made in firm losses.']}
];
var EDUCATION=[
  ['App Academy','San Francisco, 2019','Immersive full-stack program: Ruby, Rails, MongoDB, Express, React, Node, Redux, SQL.'],
  ['UC Berkeley','2004 to 2008','BA in Sociology, focused on organizational structure.']
];
var VOLUNTEER=['Taught a technology class for 20+ seniors at the SF 30th Street Senior Center.','Uhuru Furniture, a charitable donations furniture store.','Poll worker on election days.'];

function ul(a){return '<ul>'+a.map(function(t){return '<li>'+t+'</li>';}).join('')+'</ul>';}
function tags(a){return '<div class="tags">'+a.map(function(t){return '<span>'+t+'</span>';}).join('')+'</div>';}
function ext(href,label,cls){return '<a class="brick '+(cls||'')+'" href="'+href+'" target="_blank" rel="noopener">'+label+'</a>';}
function contactHTML(){
  return '<p>Email is the fastest way to reach me.</p><p class="mono">'+LINKS.email+'</p>'+
    '<div class="links">'+ext('mailto:'+LINKS.email,'Write to me','red')+ext(LINKS.linkedin,'LinkedIn')+ext(LINKS.github,'GitHub','green')+'</div>';
}

/* zones: pad position is 4 studs in front of each landmark */
var ZONES=[];
ZONES.push({id:'about',kind:'About',title:'Hi, I\'m Ben',sub:'Start here',color:'#f6c21c',ink:'#1b2333',at:[8,7.5],
  html:'<p>'+SUMMARY+'</p><p>Open to web developer and project manager roles.</p><p><strong>Outside work</strong></p>'+ul(VOLUNTEER)});
PROJECTS.forEach(function(p,i){
  ZONES.push({id:p.id,kind:'Project',title:p.name,sub:p.sub,color:p.color,ink:p.ink,at:[[-22,4],[-22,-12],[-10,-20],[4,-22]][i],
    html:'<p>'+p.blurb+'</p>'+tags(p.tags)+ul(p.points)+(p.link?'<div class="links">'+ext(p.link,'Code on GitHub')+'</div>':'')});
});
JOBS.forEach(function(j,i){
  ZONES.push({id:j.id,kind:'Experience · '+j.when,title:j.name,sub:j.sub,color:j.color,ink:j.ink,at:[[18,-18],[23,-6],[22,6]][i],
    html:'<p><strong>'+j.org+'</strong></p>'+ul(j.points)+'<p>The stack behind this sign is one brick per year.</p>'});
});
ZONES.push({id:'skills',kind:'Skills',title:'The skills wall',sub:'Go on, run through it',color:'#d8352a',at:[-16,17],
  html:SKILL_GROUPS.map(function(g){return '<p><strong>'+g[0]+'.</strong> '+g[1]+'</p>';}).join('')});
ZONES.push({id:'education',kind:'Education',title:'School',sub:'App Academy · UC Berkeley',color:'#1e6fd9',at:[-3,19],
  html:EDUCATION.map(function(e){return '<p><strong>'+e[0]+'</strong>, '+e[1]+'. '+e[2]+'</p>';}).join('')});
ZONES.push({id:'contact',kind:'Contact',title:'Say hello',sub:'Email · LinkedIn · GitHub',color:'#3aa655',at:[16,19],html:contactHTML()});
ZONES.forEach(function(z){z.pad=[z.at[0],z.at[1]+4];});

/* ───────────────────────── DOM ───────────────────────── */
var $=function(id){return document.getElementById(id);};
var canvas=$('stage'),card=$('card'),resume=$('resume'),prompt=$('prompt'),toast=$('toast');
var uiOpenZone=null,activeZone=null,resumeOpen=false,toastT=0;

function buildResume(){
  var h='<div class="top"><div><h1 id="resumeName">Ben Rawner</h1><p class="lede">Web developer and project manager, San Francisco Bay Area</p></div>'+
    '<button class="brick" id="resumeClose" type="button">Back to the island</button></div>'+
    '<p class="lede">'+SUMMARY+'</p>'+
    '<section><h2>Contact</h2><div><article>'+contactHTML()+'</article></div></section>'+
    '<section><h2>Experience</h2><div>'+JOBS.map(function(j){return '<article><h3>'+j.name+'</h3><p class="meta">'+j.org+' · '+j.when+'</p>'+ul(j.points)+'</article>';}).join('')+'</div></section>'+
    '<section><h2>Projects</h2><div>'+PROJECTS.map(function(p){return '<article><h3>'+p.name+'</h3><p class="meta">'+p.tags.join(' · ')+'</p><p>'+p.blurb+'</p>'+ul(p.points)+(p.link?'<p><a href="'+p.link+'" target="_blank" rel="noopener">Code on GitHub</a></p>':'')+'</article>';}).join('')+'</div></section>'+
    '<section><h2>Skills</h2><div><article>'+SKILL_GROUPS.map(function(g){return '<p><strong>'+g[0]+'.</strong> '+g[1]+'</p>';}).join('')+'</article></div></section>'+
    '<section><h2>Education</h2><div>'+EDUCATION.map(function(e){return '<article><h3>'+e[0]+'</h3><p class="meta">'+e[1]+'</p><p>'+e[2]+'</p></article>';}).join('')+'</div></section>'+
    '<section><h2>Volunteer work</h2><div><article>'+ul(VOLUNTEER)+'</article></div></section>';
  $('sheet').innerHTML=h;
  $('resumeClose').addEventListener('click',function(){setResume(false);});
}
function setResume(on){
  resumeOpen=on;resume.hidden=!on;
  if(on){$('resumeClose').focus();}else{canvas.focus();}
}
function openCard(z){
  uiOpenZone=z;
  card.style.setProperty('--zone',z.color);
  card.style.setProperty('--zone-ink',z.ink||'#ffffff');
  $('cardKind').textContent=z.kind;$('cardTitle').textContent=z.title;$('cardBody').innerHTML=z.html;
  card.hidden=false;card.scrollTop=0;
}
function closeCard(){uiOpenZone=null;card.hidden=true;}
function say(msg){toast.textContent=msg;toast.hidden=false;clearTimeout(toastT);toastT=setTimeout(function(){toast.hidden=true;},2600);}
function isWide(){return window.innerWidth>720;}

buildResume();
$('btnResume').addEventListener('click',function(){setResume(true);});
$('cardClose').addEventListener('click',function(){closeCard();canvas.focus();});
$('btnOpen').addEventListener('click',function(){if(activeZone){uiOpenZone===activeZone?closeCard():openCard(activeZone);}canvas.focus();});

/* ───────────────────────── 3D world ───────────────────────── */
var okGL=false;
try{var t=document.createElement('canvas');okGL=!!(window.THREE&&(t.getContext('webgl')||t.getContext('experimental-webgl')));}catch(e){}
if(!okGL){
  ['tools','score','who'].forEach(function(id){$(id).hidden=true;$(id).style.display='none';});
  setResume(true);$('resumeClose').style.display='none';
  return;
}
var T=THREE;
var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var HALF=30,STUD_H=0.16;

var renderer=new T.WebGLRenderer({canvas:canvas,antialias:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.outputEncoding=T.sRGBEncoding;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
var scene=new T.Scene();
scene.background=new T.Color('#9bdcff').convertSRGBToLinear();
scene.fog=new T.Fog(scene.background.getHex(),70,150);
var camera=new T.PerspectiveCamera(38,1,0.5,300);

scene.add(new T.HemisphereLight(0xffffff,0x7fa0c0,0.72));
var sun=new T.DirectionalLight(0xfff4dc,0.95);
sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
var sc=sun.shadow.camera;sc.left=-36;sc.right=36;sc.top=36;sc.bottom=-36;sc.near=1;sc.far=90;sun.shadow.bias=-0.0006;
scene.add(sun);scene.add(sun.target);

var mats={},geos={};
function lin(hex){return new T.Color(hex).convertSRGBToLinear();}
function mat(hex){return mats[hex]||(mats[hex]=new T.MeshStandardMaterial({color:lin(hex),roughness:0.42,metalness:0.02}));}
function geoBox(x,y,z){var k=x+'|'+y+'|'+z;return geos[k]||(geos[k]=new T.BoxGeometry(x,y,z));}
var studGeo=new T.CylinderGeometry(0.3,0.3,STUD_H,14);
function box(sx,sy,sz,hex,x,y,z,parent){
  var m=new T.Mesh(geoBox(sx,sy,sz),mat(hex));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;(parent||scene).add(m);return m;
}
function studs(parent,sx,sz,topY,hex){
  for(var i=0;i<sx;i++)for(var j=0;j<sz;j++){
    var s=new T.Mesh(studGeo,mat(hex));s.position.set(i-(sx-1)/2,topY+STUD_H/2,j-(sz-1)/2);s.castShadow=true;parent.add(s);
  }
}
function brick(sx,sy,sz,hex){ /* a studded brick, origin at its centre */
  var g=new T.Group();box(sx,sy,sz,hex,0,0,0,g);studs(g,sx,sz,sy/2,hex);return g;
}
function tex(w,h,draw){
  var c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t;
}
function fitText(g,text,weight,size,family,maxW){
  do{g.font=weight+' '+size+'px '+family;size-=2;}while(g.measureText(text).width>maxW&&size>10);
}
var FD="Fredoka,'Trebuchet MS',sans-serif",FB="'Atkinson Hyperlegible','Segoe UI',sans-serif";

/* static colliders: {x0,x1,z0,z1,h} */
var solids=[];
function solid(cx,cz,sx,sz,h){solids.push({x0:cx-sx/2,x1:cx+sx/2,z0:cz-sz/2,z1:cz+sz/2,h:h});}

/* ── paths ── */
var RX=17,RZ=13,segs=[[-RX,-RZ,RX,-RZ],[RX,-RZ,RX,RZ],[RX,RZ,-RX,RZ],[-RX,RZ,-RX,-RZ],[0,9,0,RZ]];
function clamp(v,a,b){return v<a?a:v>b?b:v;}
ZONES.forEach(function(z){
  var x=z.pad[0],y=z.pad[1],cx=clamp(x,-RX,RX),cz=clamp(y,-RZ,RZ);
  if(cx===x&&cz===y){var dx=RX-Math.abs(x),dz=RZ-Math.abs(y);if(dx<dz)cx=x<0?-RX:RX;else cz=y<0?-RZ:RZ;}
  segs.push([x,y,cx,cz]);
});
function segDist(px,pz,s){
  var vx=s[2]-s[0],vz=s[3]-s[1],l=vx*vx+vz*vz,t=l?clamp(((px-s[0])*vx+(pz-s[1])*vz)/l,0,1):0;
  var dx=px-s[0]-vx*t,dz=pz-s[1]-vz*t;return Math.sqrt(dx*dx+dz*dz);
}
function onPath(x,z){for(var i=0;i<segs.length;i++)if(segDist(x,z,segs[i])<1.15)return true;return false;}

/* ── island ── */
(function(){
  var N=HALF*2;
  var ground=tex(N,N,function(g){
    for(var px=0;px<N;px++)for(var py=0;py<N;py++){
      var x=px-HALF+0.5,z=py-HALF+0.5;
      g.fillStyle=onPath(x,z)?'#e9c98a':(((px>>2)+(py>>2))%2?'#3fa654':'#45ad5a');g.fillRect(px,py,1,1);
    }
  });
  ground.magFilter=T.NearestFilter;ground.minFilter=T.NearestFilter;ground.generateMipmaps=false;
  var top=new T.Mesh(new T.PlaneGeometry(N,N),new T.MeshStandardMaterial({map:ground,roughness:0.5}));
  top.rotation.x=-Math.PI/2;top.receiveShadow=true;scene.add(top);
  var slab=box(N,3,N,'#2f8a45',0,-1.51,0);slab.castShadow=false;
  var skirt=box(N+2,1.2,N+2,'#e3d3a2',0,-3.2,0);skirt.castShadow=false;
  var sea=new T.Mesh(new T.PlaneGeometry(600,600),new T.MeshStandardMaterial({color:lin('#2f9fe0'),roughness:0.25}));
  sea.rotation.x=-Math.PI/2;sea.position.y=-3.4;scene.add(sea);
  var inst=new T.InstancedMesh(studGeo,new T.MeshStandardMaterial({roughness:0.42}),N*N);
  var m4=new T.Matrix4(),col=new T.Color(),k=0;
  for(var i=0;i<N;i++)for(var j=0;j<N;j++){
    var x=i-HALF+0.5,z=j-HALF+0.5;
    m4.makeTranslation(x,STUD_H/2,z);inst.setMatrixAt(k,m4);
    col.set(onPath(x,z)?'#e9c98a':'#45ad5a').convertSRGBToLinear();inst.setColorAt(k,col);k++;
  }
  inst.receiveShadow=true;scene.add(inst);
})();

/* ── knockable bricks ── */
var bodies=[],groups=[],knocked=0;
function addBody(mesh,size,r,group){
  scene.add(mesh);
  var b={mesh:mesh,size:size,r:r,group:group,state:0,rest:0,v:new T.Vector3(),w:new T.Vector3(),homeP:mesh.position.clone(),homeQ:mesh.quaternion.clone(),counted:false};
  mesh.userData.body=b;bodies.push(b);groups[group].push(b);return b;
}
function newGroup(){groups.push([]);return groups.length-1;}
var NAMEC=['#d8352a','#f6c21c','#1e6fd9','#fffdf5'];
var FONT={
  B:['110','101','110','101','110'],E:['111','100','110','100','111'],N:['1001','1101','1011','1001','1001'],
  R:['110','101','110','101','101'],A:['010','101','111','101','101'],W:['10001','10001','10101','10101','01010']
};
function word(text,z,ci){
  var w=-1,i;for(i=0;i<text.length;i++)w+=FONT[text[i]][0].length+1;
  var x=-w/2+0.5;
  for(i=0;i<text.length;i++){
    var f=FONT[text[i]],g=newGroup(),hex=NAMEC[(ci+i)%NAMEC.length];
    for(var r=0;r<5;r++)for(var c=0;c<f[r].length;c++)if(f[r][c]==='1'){
      var m=brick(1,1,1,hex);m.position.set(x+c,4.5-r,z);addBody(m,[1,1,1],0.48,g);
    }
    x+=f[0].length+1;
  }
}
word('BEN',-4,0);word('RAWNER',2,1);

/* loose piles */
[[8,-9],[-8,-9],[26,17],[-26,-22],[11,-25],[-27,24]].forEach(function(p,n){
  var g=newGroup(),k=0;
  [[-1,0],[0,0],[1,0],[-0.5,1],[0.5,1],[0,2]].forEach(function(o){
    var m=brick(1,1,1,NAMEC[(n+k++)%3]);m.position.set(p[0]+o[0],0.5+o[1],p[1]);addBody(m,[1,1,1],0.48,g);
  });
});

/* skills wall */
(function(){
  var z=ZONES.filter(function(q){return q.id==='skills';})[0],g=newGroup(),cols=['#d8352a','#1e6fd9','#f6c21c','#3aa655','#fffdf5'];
  SKILLS.forEach(function(name,i){
    var row=Math.floor(i/4),c=i%4,hex=cols[(i+row)%cols.length],dark=(hex==='#f6c21c'||hex==='#fffdf5');
    var label=tex(384,128,function(q,w,h){
      q.fillStyle=hex;q.fillRect(0,0,w,h);q.fillStyle=dark?'#1b2333':'#ffffff';q.textAlign='center';q.textBaseline='middle';
      fitText(q,name,'600',62,FD,w-36);q.fillText(name,w/2,h/2+4);
    });
    var plain=mat(hex),face=new T.MeshStandardMaterial({map:label,roughness:0.42});
    var grp=new T.Group(),m=new T.Mesh(geoBox(3,1,1),[plain,plain,plain,plain,face,face]);
    m.castShadow=true;m.receiveShadow=true;grp.add(m);studs(grp,3,1,0.5,hex);
    grp.position.set(z.at[0]-4.5+c*3+(row%2?0.75:-0.75),0.5+row,z.at[1]);
    addBody(grp,[3,1,1],0.7,g);
  });
})();

/* ── signs and landmarks ── */
function sign(z,h,dz){
  var g=new T.Group();g.position.set(z.at[0],0,z.at[1]+(dz===undefined?-1.9:dz));scene.add(g);
  box(0.22,h+1,0.22,'#4a5366',-2.7,(h+1)/2,0,g);box(0.22,h+1,0.22,'#4a5366',2.7,(h+1)/2,0,g);
  var b=new T.Group();b.position.set(0,h+1.75,0);b.rotation.x=-0.38;g.add(b);
  box(6.6,2.2,0.22,'#1b2333',0,0,0,b);
  var t=tex(640,200,function(q,w,hh){
    q.fillStyle='#fffdf5';q.fillRect(0,0,w,hh);q.fillStyle=z.color;q.fillRect(0,0,26,hh);
    q.fillStyle='#1b2333';q.textBaseline='alphabetic';
    fitText(q,z.title,'700',78,FD,w-80);q.fillText(z.title,52,100);
    q.fillStyle='#5a6478';fitText(q,z.sub,'400',40,FB,w-80);q.fillText(z.sub,52,160);
  });
  var p=new T.Mesh(new T.PlaneGeometry(6.3,1.95),new T.MeshStandardMaterial({map:t,roughness:0.6}));
  p.position.z=0.12;b.add(p);
}
var spinners=[],pads=[];
var build={
  about:function(z,g){
    var b=brick(2,1,2,'#f6c21c');b.position.y=0.5;g.add(b);var c=brick(1,1,1,'#d8352a');c.position.y=1.5;g.add(c);
    solid(z.at[0],z.at[1],2,2,1);return 2.2;
  },
  sfrider:function(z,g){
    box(4.4,0.3,1.6,'#4a5366',0,0.15,0,g);
    var tg=new T.TorusGeometry(0.8,0.13,10,28);
    [-1.15,1.15].forEach(function(x){var w=new T.Mesh(tg,mat('#1b2333'));w.position.set(x,1.23,0);w.castShadow=true;g.add(w);});
    function bar(x1,y1,x2,y2,hex){var dx=x2-x1,dy=y2-y1,l=Math.sqrt(dx*dx+dy*dy),m=box(0.14,l,0.14,hex,(x1+x2)/2,(y1+y2)/2,0,g);m.rotation.z=-Math.atan2(dx,dy);}
    bar(-1.15,1.23,-0.35,2.25,'#1e6fd9');bar(-1.15,1.23,0.05,1.23,'#1e6fd9');bar(-0.35,2.25,0.05,1.23,'#1e6fd9');
    bar(-0.35,2.25,0.85,2.3,'#1e6fd9');bar(0.05,1.23,0.85,2.3,'#1e6fd9');bar(1.15,1.23,0.8,2.65,'#1e6fd9');
    box(0.6,0.14,0.3,'#1b2333',-0.4,2.42,0,g);box(0.14,0.14,1,'#1b2333',0.8,2.7,0,g);
    solid(z.at[0],z.at[1],4.4,1.6,2.6);return 2.7;
  },
  wordstar:function(z,g){
    var a=brick(2,1,2,'#d8352a');a.position.y=0.5;g.add(a);var b=brick(2,1,2,'#1e6fd9');b.position.y=1.5;g.add(b);
    var s=new T.Shape();
    for(var i=0;i<10;i++){var r=i%2?0.75:1.7,an=Math.PI/2+i*Math.PI/5;i?s.lineTo(Math.cos(an)*r,Math.sin(an)*r):s.moveTo(Math.cos(an)*r,Math.sin(an)*r);}
    var geo=new T.ExtrudeGeometry(s,{depth:0.5,bevelEnabled:true,bevelSize:0.08,bevelThickness:0.08,bevelSegments:2});geo.translate(0,0,-0.25);
    var st=new T.Mesh(geo,mat('#f6c21c'));st.position.y=4;st.castShadow=true;g.add(st);spinners.push(st);
    solid(z.at[0],z.at[1],2,2,2);return 5;
  },
  checkoff:function(z,g){
    box(3.6,0.3,1.4,'#4a5366',0,0.15,0,g);box(3.2,3.2,0.4,'#fffdf5',0,1.9,0,g);
    var a=box(0.5,1.2,0.24,'#3aa655',-0.62,1.45,0.25,g);a.rotation.z=0.78;
    var b=box(0.5,2.3,0.24,'#3aa655',0.42,1.95,0.25,g);b.rotation.z=-0.62;
    solid(z.at[0],z.at[1],3.6,1.4,3.5);return 3.5;
  },
  tower:function(z,g){
    var c=new T.Mesh(new T.CylinderGeometry(1.3,1.5,4,10),mat('#9aa2b1'));c.position.y=2;c.castShadow=true;c.receiveShadow=true;g.add(c);
    var r=new T.Mesh(new T.CylinderGeometry(1.6,1.6,0.4,10),mat('#7b8494'));r.position.y=4.2;r.castShadow=true;g.add(r);
    for(var i=0;i<6;i++){var an=i*Math.PI/3;box(0.5,0.6,0.5,'#7b8494',Math.cos(an)*1.3,4.7,Math.sin(an)*1.3,g).rotation.y=-an;}
    box(0.12,2,0.12,'#1b2333',0,5.4,0,g);box(1,0.6,0.06,'#d8352a',0.55,6.05,0,g);box(0.7,1.1,0.1,'#1b2333',0,0.55,1.42,g);
    solid(z.at[0],z.at[1],2.9,2.9,4.4);return 6;
  },
  education:function(z,g){
    box(2.2,0.5,1.6,'#d8352a',0,0.25,0,g).rotation.y=0.12;box(2,0.5,1.5,'#1e6fd9',0,0.75,0,g).rotation.y=-0.1;
    box(1.2,0.5,1.2,'#1b2333',0,1.25,0,g);var cap=box(2.1,0.12,2.1,'#1b2333',0,1.56,0,g);cap.rotation.y=0.6;
    box(0.1,0.7,0.1,'#f6c21c',0.9,1.25,0.6,g);
    solid(z.at[0],z.at[1],2.2,1.6,1);return 2.2;
  },
  contact:function(z,g){
    box(0.35,1.7,0.35,'#4a5366',0,0.85,0,g);box(1.1,1.1,1.8,'#1e6fd9',0,2.25,0,g);
    box(0.9,0.5,0.06,'#fffdf5',0,2.25,0.92,g);box(0.1,0.8,0.1,'#d8352a',0.62,2.7,0.4,g);box(0.1,0.35,0.5,'#d8352a',0.62,3.0,0.2,g);
    solid(z.at[0],z.at[1],1.1,1.8,2.8);return 3;
  },
  skills:function(){return 5;}
};
function jobStack(z,g,years){
  var hexes=['#d8352a','#f6c21c','#1e6fd9','#fffdf5','#3aa655','#f6c21c'];
  for(var i=0;i<years;i++){var b=brick(2,1,2,hexes[(i+years)%hexes.length]);b.position.y=0.5+i;g.add(b);}
  solid(z.at[0],z.at[1],2,2,years);return years+0.3;
}
ZONES.forEach(function(z){
  var g=new T.Group();g.position.set(z.at[0],0,z.at[1]);scene.add(g);
  var job=JOBS.filter(function(j){return j.id===z.id;})[0];
  var h=job?jobStack(z,g,job.years):build[z.id](z,g);
  sign(z,h,z.id==='skills'?-1.6:undefined);
  var c=lin(z.color);
  var disc=new T.Mesh(new T.CircleGeometry(2,40),new T.MeshBasicMaterial({color:c,transparent:true,opacity:0.3,depthWrite:false}));
  disc.rotation.x=-Math.PI/2;disc.position.set(z.pad[0],STUD_H+0.03,z.pad[1]);scene.add(disc);
  var ring=new T.Mesh(new T.RingGeometry(1.85,2.2,48),new T.MeshBasicMaterial({color:c,transparent:true,opacity:0.95,depthWrite:false}));
  ring.rotation.x=-Math.PI/2;ring.position.set(z.pad[0],STUD_H+0.05,z.pad[1]);scene.add(ring);
  pads.push(ring);
});

/* trees */
(function(){
  var seed=11;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647;}
  var keep=[[0,9,5]];ZONES.forEach(function(z){keep.push([z.at[0],z.at[1],5.5],[z.pad[0],z.pad[1],4]);});
  [[8,-9],[-8,-9],[26,17],[-26,-22],[11,-25],[-27,24]].forEach(function(p){keep.push([p[0],p[1],4]);});
  var n=0,tries=0;
  while(n<16&&tries++<600){
    var x=Math.round(rnd()*52-26),z=Math.round(rnd()*52-26),ok=!onPath(x,z)&&!(Math.abs(x)<16&&z>-7&&z<5);
    for(var i=0;ok&&i<keep.length;i++){var dx=x-keep[i][0],dz=z-keep[i][1];if(dx*dx+dz*dz<keep[i][2]*keep[i][2])ok=false;}
    if(!ok)continue;
    var th=2+Math.floor(rnd()*2),g=newGroup(),m,t;
    for(t=0;t<th;t++){m=brick(1,1,1,'#8a5a2e');m.position.set(x,0.5+t,z);addBody(m,[1,1,1],0.48,g);}
    m=brick(3,1,3,'#2f8a45');m.position.set(x,th+0.5,z);addBody(m,[3,1,3],1.3,g).big=true;
    m=brick(2,1,2,'#3aa655');m.position.set(x,th+1.5,z);addBody(m,[2,1,2],0.95,g).big=true;
    m=brick(1,1,1,'#45ad5a');m.position.set(x,th+2.5,z);addBody(m,[1,1,1],0.48,g);
    keep.push([x,z,5]);n++;
  }
})();

/* ── the figure ── */
var SKIN='#eec39a';
var hero=new T.Group();scene.add(hero);
var bodyG=new T.Group();hero.add(bodyG);
function limb(x,y,w,h,d,hex,endHex){
  var p=new T.Group();p.position.set(x,y,0);bodyG.add(p);box(w,h,d,hex,0,-h/2,0,p);
  if(endHex)box(w+0.02,0.22,d+0.02,endHex,0,-h+0.05,0,p);return p;
}
var legL=limb(-0.27,0.95,0.46,0.95,0.52,'#24467a','#1b2333'),legR=limb(0.27,0.95,0.46,0.95,0.52,'#24467a','#1b2333');
box(1.02,0.2,0.54,'#1b2333',0,1.03,0,bodyG);
var shirt=tex(128,128,function(q){q.fillStyle='#d8352a';q.fillRect(0,0,128,128);q.fillStyle='#fffdf5';q.font='700 56px '+FD;q.textAlign='center';q.textBaseline='middle';q.fillText('BR',64,62);});
var red=mat('#d8352a'),torso=new T.Mesh(geoBox(1.02,0.95,0.56),[red,red,red,red,new T.MeshStandardMaterial({map:shirt,roughness:0.42}),red]);
torso.position.y=1.6;torso.castShadow=true;bodyG.add(torso);
var armL=limb(-0.66,2.02,0.28,0.85,0.32,'#d8352a',SKIN),armR=limb(0.66,2.02,0.28,0.85,0.32,'#d8352a',SKIN);
var face=tex(128,128,function(q){
  q.fillStyle=SKIN;q.fillRect(0,0,128,128);q.fillStyle='#1b2333';
  q.beginPath();q.arc(42,58,8,0,7);q.arc(86,58,8,0,7);q.fill();
  q.lineWidth=7;q.lineCap='round';q.strokeStyle='#1b2333';q.beginPath();q.arc(64,66,28,Math.PI*0.2,Math.PI*0.8);q.stroke();
});
var skin=mat(SKIN),head=new T.Mesh(geoBox(0.78,0.7,0.74),[skin,skin,skin,skin,new T.MeshStandardMaterial({map:face,roughness:0.42}),skin]);
head.position.y=2.45;head.castShadow=true;bodyG.add(head);
box(0.84,0.24,0.8,'#1e6fd9',0,2.9,0,bodyG);box(0.84,0.08,0.4,'#1e6fd9',0,2.8,0.55,bodyG);

var P={x:0,y:6,z:9,vx:0,vy:0,vz:0,ground:false,face:0,phase:0};
var SPEED=9.5,GRAV=28,JUMP=10,PR=0.55;
function inside(x,z,m){return Math.abs(x)<HALF+(m||0)&&Math.abs(z)<HALF+(m||0);}
function groundAt(x,z,y){
  var g=inside(x,z,0.3)?0:-1e9;
  for(var i=0;i<solids.length;i++){var s=solids[i];if(x>s.x0-0.25&&x<s.x1+0.25&&z>s.z0-0.25&&z<s.z1+0.25&&s.h<=y+0.4&&s.h>g)g=s.h;}
  return g;
}
function collide(){
  for(var i=0;i<solids.length;i++){
    var s=solids[i];if(P.y>=s.h-0.4)continue;
    var cx=clamp(P.x,s.x0,s.x1),cz=clamp(P.z,s.z0,s.z1),dx=P.x-cx,dz=P.z-cz,d2=dx*dx+dz*dz;
    if(d2>=PR*PR)continue;
    if(d2>1e-8){var d=Math.sqrt(d2);P.x=cx+dx/d*PR;P.z=cz+dz/d*PR;}
    else{
      var a=P.x-s.x0,b=s.x1-P.x,c=P.z-s.z0,e=s.z1-P.z,m=Math.min(a,b,c,e);
      if(m===a)P.x=s.x0-PR;else if(m===b)P.x=s.x1+PR;else if(m===c)P.z=s.z0-PR;else P.z=s.z1+PR;
    }
  }
}

/* ── input ── */
var keys={},joy={id:null,ox:0,oy:0,x:0,y:0},wantJump=false;
function typing(e){var t=e.target;return t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA');}
window.addEventListener('keydown',function(e){
  if(typing(e))return;
  if(e.key==='Escape'){if(resumeOpen)setResume(false);else closeCard();return;}
  if(resumeOpen)return;
  var k=e.key.length===1?e.key.toLowerCase():e.key;
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].indexOf(k)>=0&&e.target.tagName!=='BUTTON'&&e.target.tagName!=='A')e.preventDefault();
  if(e.target.tagName==='BUTTON'||e.target.tagName==='A'){if(k===' '||k==='Enter')return;}
  if(!e.repeat){
    if(k===' ')wantJump=true;
    if(k==='Enter'||k==='e'){if(activeZone){uiOpenZone===activeZone?closeCard():openCard(activeZone);}}
    if(k==='r')rebuild();
    if(k==='f')grabOrThrow();
  }
  keys[k]=true;
});
window.addEventListener('keyup',function(e){var k=e.key.length===1?e.key.toLowerCase():e.key;keys[k]=false;});
window.addEventListener('blur',function(){keys={};});
var joyEl=$('joy'),knob=joyEl.firstElementChild,jumpBtn=$('jump'),grabBtn=$('grab');
canvas.addEventListener('pointerdown',function(e){
  canvas.focus();
  if(e.pointerType==='mouse'){if(e.button===0)clickAt(e.clientX,e.clientY);return;}
  jumpBtn.hidden=false;grabBtn.hidden=false;
  if(joy.id===null){joy.id=e.pointerId;joy.ox=e.clientX;joy.oy=e.clientY;joy.t0=performance.now();joy.moved=0;joy.x=joy.y=0;joyEl.hidden=false;joyEl.style.left=e.clientX+'px';joyEl.style.top=e.clientY+'px';knob.style.transform='';}
});
window.addEventListener('pointermove',function(e){
  if(e.pointerId!==joy.id)return;
  var dx=e.clientX-joy.ox,dy=e.clientY-joy.oy,l=Math.sqrt(dx*dx+dy*dy),m=48;if(l>joy.moved)joy.moved=l;if(l>m){dx*=m/l;dy*=m/l;}
  joy.x=dx/m;joy.y=dy/m;knob.style.transform='translate('+dx+'px,'+dy+'px)';
});
function joyEnd(e){if(e.pointerId===joy.id){joy.id=null;joy.x=joy.y=0;joyEl.hidden=true;if(e.type==='pointerup'&&joy.moved<10&&performance.now()-joy.t0<350)clickAt(e.clientX,e.clientY);}}
window.addEventListener('pointerup',joyEnd);window.addEventListener('pointercancel',joyEnd);
jumpBtn.addEventListener('pointerdown',function(e){e.preventDefault();wantJump=true;});
grabBtn.addEventListener('pointerdown',function(e){e.preventDefault();grabOrThrow();});
$('btnRebuild').addEventListener('click',function(){rebuild();canvas.focus();});

/* ── brick physics ── */
var tq=new T.Quaternion(),tv=new T.Vector3(),tm=new T.Matrix4(),te=new T.Euler(),H=Math.PI/2;
function halfH(b){tm.makeRotationFromQuaternion(b.mesh.quaternion);var e=tm.elements;return (Math.abs(e[1])*b.size[0]+Math.abs(e[5])*b.size[1]+Math.abs(e[9])*b.size[2])/2;}
function wake(b){
  if(b.state===0){
    groups[b.group].forEach(function(o){
      if(o.state!==0)return;o.state=1;o.rest=0;
      o.v.set((Math.random()-0.5)*1.6,Math.random()*1.5,(Math.random()-0.5)*1.6);
      o.w.set((Math.random()-0.5)*3,(Math.random()-0.5)*3,(Math.random()-0.5)*3);
      if(!o.counted){o.counted=true;knocked++;}
    });
  }else if(b.state===2){b.state=1;b.rest=0;}
}
var held=null,nav=null,ray=new T.Raycaster(),ndc=new T.Vector2();
var marker=new T.Mesh(new T.RingGeometry(0.45,0.7,28),new T.MeshBasicMaterial({color:lin('#fffdf5'),transparent:true,opacity:0.9,depthWrite:false}));
marker.rotation.x=-Math.PI/2;marker.visible=false;scene.add(marker);
function pick(b){
  if(b.state===0)wake(b);
  b.state=4;b.v.set(0,0,0);b.w.set(0,0,0);held=b;grabBtn.textContent='Throw';
}
function throwHeld(t){ /* t: a point to land on, or nothing to throw straight ahead */
  var b=held,fx,fz;held=null;b.state=1;b.rest=0;b.thrown=true;b.grace=0.4;grabBtn.textContent='Grab';
  if(t){
    var s=b.mesh.position,dx=t.x-s.x,dz=t.z-s.z,d=Math.sqrt(dx*dx+dz*dz)||0.001,ft=clamp(d/15,0.45,1.4);
    P.face=Math.atan2(dx,dz);fx=dx/d;fz=dz/d;
    b.v.set(dx/ft,(t.y-s.y+0.5*GRAV*ft*ft)/ft,dz/ft);
  }else{
    fx=Math.sin(P.face);fz=Math.cos(P.face);b.v.set(fx*15+P.vx*0.6,7.5,fz*15+P.vz*0.6);
  }
  b.w.set(fz*7,0,-fx*7);
}
function grabOrThrow(){
  if(resumeOpen)return;
  var b,i;nav=null;
  if(held){throwHeld(null);return;}
  var best=null,bd=2.3*2.3;
  for(i=0;i<bodies.length;i++){
    b=bodies[i];if(b.state===3)continue;
    var p=b.mesh.position,dy=p.y-P.y;if(dy<-0.6||dy>3.2)continue;
    var dx=p.x-P.x,dz=p.z-P.z,d2=dx*dx+dz*dz;if(d2<bd){bd=d2;best=b;}
  }
  if(!best){say('No brick close enough to grab.');return;}
  pick(best);
}
function clickAt(cx,cy){
  if(resumeOpen)return;
  ndc.set(cx/window.innerWidth*2-1,-(cy/window.innerHeight)*2+1);ray.setFromCamera(ndc,camera);
  var list=[],i,body=null,pt=null;
  for(i=0;i<bodies.length;i++)if(bodies[i].state!==3&&bodies[i]!==held)list.push(bodies[i].mesh);
  var hits=ray.intersectObjects(list,true);
  if(hits.length){var o=hits[0].object;while(o&&!o.userData.body)o=o.parent;if(o){body=o.userData.body;pt=hits[0].point.clone();}}
  if(!pt){
    var r=ray.ray;if(r.direction.y>-1e-4)return;
    var k=-r.origin.y/r.direction.y;pt=new T.Vector3(r.origin.x+r.direction.x*k,0.5,r.origin.z+r.direction.z*k);
  }
  if(held){throwHeld(pt);nav=null;return;}
  nav=body?{body:body,stall:0}:{x:clamp(pt.x,-29.4,29.4),z:clamp(pt.z,-29.4,29.4),stall:0};
}
function rebuild(){
  held=null;nav=null;grabBtn.textContent='Grab';
  bodies.forEach(function(b){b.thrown=false;b.grace=0;b.mesh.position.copy(b.homeP);b.mesh.quaternion.copy(b.homeQ);b.mesh.visible=true;b.state=0;b.v.set(0,0,0);b.w.set(0,0,0);b.counted=false;});
  say('All rebuilt. Have another go.');
}
function stepBodies(dt){
  var i,j,b,sp=Math.sqrt(P.vx*P.vx+P.vz*P.vz);
  if(held){held.mesh.position.set(P.x,P.y+3.35+held.size[1]/2,P.z);held.mesh.rotation.set(0,P.face,0);}
  for(i=0;i<bodies.length;i++){
    b=bodies[i];if(b.state>=3)continue;
    if(b.grace>0){b.grace-=dt;continue;}
    if(b.big&&b.state===0)continue;
    var p=b.mesh.position,dx=p.x-P.x,dz=p.z-P.z,dy=p.y-P.y,min=PR+b.r;
    if(dy>-0.6&&dy<3.1&&dx*dx+dz*dz<min*min&&(sp>0.5||!P.ground||b.state!==0)){
      if(b.state!==1)wake(b);
      var d=Math.sqrt(dx*dx+dz*dz)||0.001,nx=dx/d,nz=dz/d;
      p.x=P.x+nx*min;p.z=P.z+nz*min;
      b.v.x=nx*(sp*1.05+2.5)+P.vx*0.35;b.v.z=nz*(sp*1.05+2.5)+P.vz*0.35;b.v.y=Math.max(b.v.y,2.2+sp*0.4+(P.ground?0:2));
      b.w.set(nz*6,(Math.random()-0.5)*4,-nx*6);b.rest=0;
    }
  }
  for(i=0;i<bodies.length;i++){
    b=bodies[i];if(b.state!==1)continue;
    var q=b.mesh.position;
    b.v.y-=GRAV*dt;q.x+=b.v.x*dt;q.y+=b.v.y*dt;q.z+=b.v.z*dt;
    var wl=b.w.length();if(wl>1e-3){tq.setFromAxisAngle(tv.copy(b.w).multiplyScalar(1/wl),wl*dt);b.mesh.quaternion.premultiply(tq);}
    var hy=halfH(b);
    if(inside(q.x,q.z)&&q.y<hy&&q.y>-1.5){
      q.y=hy;b.v.y=b.v.y<-2.5?-b.v.y*0.32:0;
      var f=Math.max(0,1-5*dt);b.v.x*=f;b.v.z*=f;b.w.multiplyScalar(Math.max(0,1-3.5*dt));
      if(b.v.lengthSq()<0.5&&b.w.lengthSq()<2.5){
        te.setFromQuaternion(b.mesh.quaternion,'YXZ');te.x=Math.round(te.x/H)*H;te.z=Math.round(te.z/H)*H;tq.setFromEuler(te);
        b.mesh.quaternion.slerp(tq,Math.min(1,10*dt));b.w.multiplyScalar(0.8);b.rest+=dt;
        if(b.rest>0.7){b.mesh.quaternion.copy(tq);q.y=halfH(b);b.v.set(0,0,0);b.w.set(0,0,0);b.state=2;b.thrown=false;}
      }else b.rest=0;
    }
    if(q.y<-30){b.state=3;b.mesh.visible=false;}
  }
  for(i=0;i<bodies.length;i++){
    var a=bodies[i];if(a.state!==1)continue;
    for(j=0;j<bodies.length;j++){
      b=bodies[j];if(b===a||b.state>=3)continue;if(b.state===0&&!a.thrown)continue;if(b.state===1&&j<i)continue;
      var pa=a.mesh.position,pb=b.mesh.position,ex=pb.x-pa.x,ey=pb.y-pa.y,ez=pb.z-pa.z,mn=a.r+b.r,dd=ex*ex+ey*ey+ez*ez;
      if(dd>=mn*mn||dd<1e-6)continue;
      var l=Math.sqrt(dd),ux=ex/l,uy=ey/l,uz=ez/l,ov=mn-l;
      var rel=(a.v.x-b.v.x)*ux+(a.v.y-b.v.y)*uy+(a.v.z-b.v.z)*uz;
      if(b.state===0)wake(b);
      if(b.state===2&&rel>3.5)wake(b);
      if(b.state===1){
        pa.x-=ux*ov/2;pa.y-=uy*ov/2;pa.z-=uz*ov/2;pb.x+=ux*ov/2;pb.y+=uy*ov/2;pb.z+=uz*ov/2;
        if(rel>0){var k=rel*0.6;a.v.x-=ux*k;a.v.y-=uy*k;a.v.z-=uz*k;b.v.x+=ux*k;b.v.y+=uy*k;b.v.z+=uz*k;}
      }else{
        pa.x-=ux*ov;pa.y-=uy*ov;pa.z-=uz*ov;
        if(rel>0){var k2=rel*1.2;a.v.x-=ux*k2;a.v.y-=uy*k2;a.v.z-=uz*k2;}
      }
    }
  }
}

/* ── loop ── */
var cam=new T.Vector3(P.x,0,P.z),found={},foundN=0,lastKnocked=-1,zoom=1,clock=new T.Clock(),time=0;
function resize(){
  var w=window.innerWidth,h=window.innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
  var a=w/h;zoom=a<0.7?1.75:a<1?1.45:a<1.5?1.15:1;
}
window.addEventListener('resize',resize);resize();

function stepHero(dt){
  var ix=0,iz=0;
  if(!resumeOpen){
    if(keys.a||keys.ArrowLeft)ix-=1;if(keys.d||keys.ArrowRight)ix+=1;if(keys.w||keys.ArrowUp)iz-=1;if(keys.s||keys.ArrowDown)iz+=1;
    ix+=joy.x;iz+=joy.y;
    if(ix||iz)nav=null;
    else if(nav){
      var tx=nav.body?nav.body.mesh.position.x:nav.x,tz=nav.body?nav.body.mesh.position.z:nav.z;
      var ndx=tx-P.x,ndz=tz-P.z,nd=Math.sqrt(ndx*ndx+ndz*ndz)||0.001;
      if(nav.body&&nav.body.state>=3)nav=null;
      else if(nav.body&&nd<1.9){pick(nav.body);nav=null;}
      else if(!nav.body&&nd<0.3)nav=null;
      else{
        var ease=nav.body?1:Math.min(1,nd/1.5+0.25);ix=ndx/nd*ease;iz=ndz/nd*ease;
        var mv=Math.sqrt((P.x-nav.lx)*(P.x-nav.lx)+(P.z-nav.lz)*(P.z-nav.lz))/dt;nav.lx=P.x;nav.lz=P.z;
        nav.stall=mv<1?nav.stall+dt:0;if(nav.stall>0.9)nav=null;
      }
    }
  }
  var l=Math.sqrt(ix*ix+iz*iz);if(l>1){ix/=l;iz/=l;}
  var acc=Math.min(1,(P.ground?14:5)*dt);
  P.vx+=(ix*SPEED-P.vx)*acc;P.vz+=(iz*SPEED-P.vz)*acc;
  P.x+=P.vx*dt;P.z+=P.vz*dt;collide();
  if(wantJump&&P.ground&&!resumeOpen){P.vy=JUMP;P.ground=false;}
  wantJump=false;
  P.vy-=GRAV*dt;P.y+=P.vy*dt;
  var g=groundAt(P.x,P.z,P.y-P.vy*dt);
  if(P.y<=g&&P.vy<=0){P.y=g;P.vy=0;P.ground=true;}else if(P.y>g+0.05)P.ground=false;
  if(P.y<-26){P.x=0;P.z=9;P.y=7;P.vx=P.vz=P.vy=0;say('Splash. Back to the start you go.');}
  var sp=Math.sqrt(P.vx*P.vx+P.vz*P.vz);
  if(sp>0.6){var want=Math.atan2(P.vx,P.vz),d=want-P.face;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;P.face+=d*Math.min(1,14*dt);}
  P.phase+=sp*dt*1.5;
  var k=Math.min(1,sp/SPEED),s=Math.sin(P.phase)*k;
  if(P.ground){legL.rotation.x=s*0.95;legR.rotation.x=-s*0.95;armL.rotation.x=-s*0.9;armR.rotation.x=s*0.9;armL.rotation.z=armR.rotation.z=0;bodyG.position.y=Math.abs(Math.cos(P.phase))*0.1*k;}
  else{legL.rotation.x=0.5;legR.rotation.x=-0.4;armL.rotation.x=armR.rotation.x=-2.6;armL.rotation.z=-0.3;armR.rotation.z=0.3;bodyG.position.y=0;}
  if(held){armL.rotation.x=armR.rotation.x=-3.0;armL.rotation.z=-0.15;armR.rotation.z=0.15;}
  bodyG.rotation.x=k*0.12;
  hero.position.set(P.x,P.y,P.z);hero.rotation.y=P.face;
}
function stepZones(){
  var z=null;
  if(P.y>-1)for(var i=0;i<ZONES.length;i++){var dx=P.x-ZONES[i].pad[0],dz=P.z-ZONES[i].pad[1];if(dx*dx+dz*dz<2.5*2.5){z=ZONES[i];break;}}
  if(z!==activeZone){
    activeZone=z;
    if(z){
      if(!found[z.id]){found[z.id]=1;foundN++;$('found').textContent='Found '+foundN+' of '+ZONES.length;if(foundN===ZONES.length)say('That\'s all 11. Thanks for exploring.');}
      $('btnOpen').textContent=z.title;prompt.hidden=isWide();
      if(isWide())openCard(z);
    }else{prompt.hidden=true;closeCard();}
  }
  if(knocked!==lastKnocked){lastKnocked=knocked;$('knocked').textContent='Bricks knocked '+knocked;}
}
function frame(){
  var dt=Math.min(clock.getDelta(),1/30);time+=dt;
  stepHero(dt);stepBodies(dt);stepZones();
  if(!reduced){
    for(var i=0;i<pads.length;i++){var s=1+Math.sin(time*3+i)*0.05;pads[i].scale.set(s,s,1);}
    for(i=0;i<spinners.length;i++)spinners[i].rotation.y=time*0.9;
  }
  marker.visible=!!nav;if(nav)marker.position.set(nav.body?nav.body.mesh.position.x:nav.x,STUD_H+0.07,nav.body?nav.body.mesh.position.z:nav.z);
  cam.x+=(P.x-cam.x)*Math.min(1,6*dt);cam.z+=(P.z-cam.z)*Math.min(1,6*dt);cam.y+=(Math.max(P.y,-2)-cam.y)*Math.min(1,4*dt);
  camera.position.set(cam.x,cam.y+24*zoom,cam.z+22*zoom);camera.lookAt(cam.x,cam.y+1,cam.z-2.5);
  sun.position.set(cam.x+14,cam.y+34,cam.z+12);sun.target.position.set(cam.x,cam.y,cam.z);
  renderer.render(scene,camera);
  requestAnimationFrame(frame);
}
/* debug hook for a one-off layout check */
window.__island={P:P,keys:keys,cam:cam};
canvas.focus();
frame();
})();
