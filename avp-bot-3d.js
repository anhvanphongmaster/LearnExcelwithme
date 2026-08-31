(function(){
  if(window.__avpBot3D)return;
  window.__avpBot3D=true;

  function loadThree(){
    return new Promise(function(ok,fail){
      if(window.THREE)return ok();
      var s=document.createElement("script");
      s.src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      s.onload=ok;s.onerror=fail;
      document.head.appendChild(s);
    });
  }

  function texAVP(){
    var c=document.createElement("canvas");
    c.width=256;c.height=256;
    var g=c.getContext("2d");
    g.fillStyle="#217346";g.fillRect(0,0,256,256);
    g.fillStyle="#f4fff7";
    g.fillRect(38,88,180,80);
    g.fillStyle="#217346";
    g.font="bold 72px system-ui,Arial";
    g.textAlign="center";g.textBaseline="middle";
    g.fillText("AVP",128,132);
    var t=new THREE.CanvasTexture(c);
    t.needsUpdate=true;
    return t;
  }

  function boot(){
    var host=document.getElementById("avpBot3d");
    var launcher=document.getElementById("avpEdgeLauncher");
    if(!host||!window.THREE||!launcher)return;

    var W=96,H=120;
    var scene=new THREE.Scene();
    var cam=new THREE.PerspectiveCamera(32,W/H,0.1,50);
    cam.position.set(0,1.15,6.2);
    var renderer=new THREE.WebGLRenderer({canvas:host,alpha:true,antialias:true});
    renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
    renderer.setSize(W,H,false);
    renderer.setClearColor(0x000000,0);

    scene.add(new THREE.HemisphereLight(0xffffff,0x163d28,1.05));
    var key=new THREE.DirectionalLight(0xffffff,0.95);
    key.position.set(2.4,4,3);
    scene.add(key);
    var rim=new THREE.DirectionalLight(0xb8ffd0,0.35);
    rim.position.set(-3,1,-2);
    scene.add(rim);

    var green=new THREE.MeshPhongMaterial({color:0x2f9a5c,shininess:90,specular:0x88ffbb});
    var dark=new THREE.MeshPhongMaterial({color:0x0f3d28,shininess:40});
    var silver=new THREE.MeshPhongMaterial({color:0xb7c4c0,shininess:120,specular:0xffffff});
    var face=new THREE.MeshPhongMaterial({color:0x0b2418,shininess:20});
    var chest=new THREE.MeshPhongMaterial({map:texAVP(),shininess:50});

    var root=new THREE.Group();
    scene.add(root);

    var body=new THREE.Mesh(new THREE.SphereGeometry(0.92,24,24),green);
    body.scale.set(1,1.12,0.85);
    body.position.y=0.55;
    root.add(body);
    var plate=new THREE.Mesh(new THREE.PlaneGeometry(0.95,0.42),chest);
    plate.position.set(0,0.52,0.72);
    root.add(plate);

    var head=new THREE.Mesh(new THREE.SphereGeometry(0.62,24,24),green);
    head.position.y=1.72;
    root.add(head);
    var visor=new THREE.Mesh(new THREE.SphereGeometry(0.42,16,16,0,Math.PI),face);
    visor.rotation.y=Math.PI;
    visor.position.set(0,1.72,0.28);
    visor.scale.set(1,0.72,0.55);
    root.add(visor);
    function eye(x){
      var e=new THREE.Mesh(new THREE.SphereGeometry(0.09,12,12),new THREE.MeshPhongMaterial({color:0xd8ffe8,emissive:0x3cff8a,emissiveIntensity:0.35}));
      e.position.set(x,1.76,0.52);
      root.add(e);
      return e;
    }
    eye(-0.16);eye(0.16);
    var smile=new THREE.Mesh(new THREE.TorusGeometry(0.12,0.025,8,16,Math.PI),new THREE.MeshPhongMaterial({color:0xb7ffd0}));
    smile.position.set(0,1.58,0.54);
    smile.rotation.x=Math.PI;
    root.add(smile);
    var ant=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.035,0.38,8),green);
    ant.position.y=2.28;
    root.add(ant);
    var ball=new THREE.Mesh(new THREE.SphereGeometry(0.08,10,10),green);
    ball.position.y=2.5;
    root.add(ball);

    function limb(len,thick,mat){
      var m=new THREE.Mesh(new THREE.CylinderGeometry(thick,thick*0.85,len,10),mat);
      m.geometry.translate(0,-len/2,0);
      return m;
    }
    var armL=new THREE.Group();armL.position.set(-0.95,1.05,0);
    var armR=new THREE.Group();armR.position.set(0.95,1.05,0);
    armL.add(limb(0.85,0.13,green));
    armR.add(limb(0.85,0.13,green));
    var handL=new THREE.Mesh(new THREE.SphereGeometry(0.12,10,10),green);
    handL.position.y=-0.85;armL.add(handL);
    var handR=new THREE.Mesh(new THREE.SphereGeometry(0.12,10,10),green);
    handR.position.y=-0.85;armR.add(handR);
    root.add(armL);root.add(armR);

    var legL=new THREE.Group();legL.position.set(-0.32,-0.15,0);
    var legR=new THREE.Group();legR.position.set(0.32,-0.15,0);
    legL.add(limb(0.7,0.14,dark));
    legR.add(limb(0.7,0.14,dark));
    var footL=new THREE.Mesh(new THREE.BoxGeometry(0.28,0.14,0.4),green);
    footL.position.set(0,-0.72,0.06);legL.add(footL);
    var footR=footL.clone();legR.add(footR);
    root.add(legL);root.add(legR);

    var tears=[];
    function addTear(x){
      var d=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,8),new THREE.MeshPhongMaterial({color:0x2aa7ff,transparent:true,opacity:0.9}));
      d.position.set(x,1.62,0.55);
      d.visible=false;
      root.add(d);tears.push({m:d,x:x,t:Math.random()});
    }
    addTear(-0.18);addTear(0.18);

    function state(){
      if(launcher.classList.contains("is-crying")||launcher.classList.contains("is-lifted"))return "cry";
      if(launcher.classList.contains("open")||launcher.classList.contains("is-greeting"))return "wave";
      return "walk";
    }

    var t0=performance.now();
    function tick(now){
      var t=(now-t0)/1000;
      var st=state();
      root.rotation.y = launcher.classList.contains("face-left") ? 0.55 : -0.35;
      root.position.y=0;
      smile.visible=st!=="cry";
      tears.forEach(function(d){d.m.visible=st==="cry"});

      if(st==="walk"){
        var s=Math.sin(t*8);
        legL.rotation.x=s*0.7;
        legR.rotation.x=-s*0.7;
        armL.rotation.x=-s*0.6;
        armR.rotation.x=s*0.6;
        root.position.y=Math.abs(s)*0.06;
      }else if(st==="wave"){
        root.rotation.y=0;
        legL.rotation.x=legR.rotation.x=0.08;
        armL.rotation.x=0.15;
        armR.rotation.x=-0.2;
        armR.rotation.z=-0.9+Math.sin(t*10)*0.55;
      }else{
        root.rotation.y=0;
        root.position.y=0.35+Math.sin(t*18)*0.08;
        root.rotation.z=Math.sin(t*16)*0.18;
        armL.rotation.z=0.7;armR.rotation.z=-0.7;
        armL.rotation.x=armR.rotation.x=0.4;
        legL.rotation.x=0.5;legR.rotation.x=-0.2;
        tears.forEach(function(d){
          d.t+=0.04;
          if(d.t>1)d.t=0;
          d.m.position.set(d.x,1.55-d.t*0.9,0.55);
          d.m.scale.setScalar(1-d.t*0.5);
        });
      }
      renderer.render(scene,cam);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function start(){
    loadThree().then(boot).catch(function(){});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);
  else start();
})();
