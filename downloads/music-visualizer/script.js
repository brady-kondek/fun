//////////////////////////////////////////////////////
// Set up scene
let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({alpha: true,antialias:true});
let camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
scene.add(camera);
camera.rotation.x = Math.PI/180*90

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls(camera, renderer.domElement);

//////////////////////////////////////////////////////
// on window resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


//////////////////////////////////////////////////////
// btn fx stuff
let o, o1, l1, circle,
    counter = 0,planeCounter = 0, increase = .06;

let [b1,b2,b3,b4] = [false,false,false,false];

let btn = document.querySelectorAll("button");
function btn1(){
  b1 = !b1;
}
function btn2(){
  b2 = !b2;
}
function btn3(){
  b3 = !b3;
}
function btn4(){
  b4 = !b4;
}
//////////////////////////////////////////////////////
// audio stuff
let audio = document.querySelector("audio");
let vert = [];
let play = false;
function playAudio(){
  play ? ( play = false, audio.pause()) :(play = true, audio.play());
}

file.onchange = function() {
  let audioContext = window.webkitAudioContext || window.AudioContext;
        let files = this.files;
        audio.src = URL.createObjectURL(files[0]);
        audio.load();
        audio.play();
        play = true;
        let context = new audioContext();
        let src = context.createMediaElementSource(audio);
        let analyser = context.createAnalyser();

        src.connect(analyser);
        analyser.connect(context.destination);

        let bufferLength = analyser.frequencyBinCount;

        let frequencyData = new Uint8Array(bufferLength);
  
  makeScene()
  
  function makeScene(){
    makePlane();
    makeCircle();
    makeLight();
  }

  function makePlane() {
    let g = new THREE.PlaneGeometry(200,200,50,50);
    let m = new THREE.MeshStandardMaterial({flatShading:1,
                                              wireframe:1,
                                              color:0x06414c,
                                              emissive: 0x03223d,
                                              emissiveIntensity:.8,
                                              metalness:.9,
                                              roughness:.5});
     o = new THREE.Mesh(g,m);
    o.rotation.x = Math.PI * 270 / 180;
    o.position.y = -5;
    scene.add(o);

    // collect vertices


    // Distort plane
    for (let x = 0; x < o.geometry.vertices.length; x++) {

      let v = o.geometry.vertices[x];

      let distanceFromCenterY = Math.abs(v.x)/100;

      v.z += distanceFromCenterY > .2 ? 
        (Math.random() * (20 - .15) + .15) * distanceFromCenterY*2 : 
        ((Math.random() * (.8 - .2) + .2) + distanceFromCenterY);

      vert[x] = v;
    }

    //create separate wireframe
    let wireframe = o.clone();
    wireframe.material = new THREE.MeshBasicMaterial({wireframe:true,
                                                     color:0x00ffff});
    scene.add(wireframe)
    wireframe.scale.multiplyScalar(1.001);
  }

  function makeCircle() {
    let g = new THREE.CircleGeometry( 18, 32 );
    let m = new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe:false } );
    circle = new THREE.Mesh( g, m );
    circle.position.z = -100;
    scene.add( circle );

    let g1 = new THREE.SphereGeometry( 22,32, 32 );
    let m1 = new THREE.MeshBasicMaterial( { color: 0xff00ff,wireframe:false } );
     o1 = new THREE.Mesh( g1, m1 );
    o1.position.z = -118;
   // scene.add( o1 );

    camera.position.z = -20;
    //camera.lookAt(0,0,-100);
    controls.target.set(0,0,-100)
   controls.update();
  }

  function makeLight() {
    l1 = new THREE.SpotLight( 0xff00ff ,5,150,10,0,2);
    let l2 = new THREE.HemisphereLight( 0x000000, 0xffffff, 1 );
    let l3 = new THREE.PointLight( 0xff00ff,.6, 250 );

    l1.position.set( 0, 50, -130 );
    l1.lookAt(o1)

    l3.position.set(0, 50, -150 );

    scene.add(l1)
    scene.add( l2 );
    scene.add( l3 );
  }

  function visualize() {
    analyser.getByteFrequencyData(frequencyData);

  //  circle.scale.set(sine*1.4,sine*1.4,sine*1.4)
    //o1.rotation.z += .03; 

    // freq * distance x from 0 * random
    if (b1 || b2 || b3 ) {
 
      avg = frequencyData[10]/200 ;
      avg *= avg;
      
      b1 ? (circle.scale.set(avg,avg,avg),
            l1.intensity = avg*avg*20) : 0;

planeSine = Math.sin(planeCounter);
  let f1 = frequencyData[1]

      for (let x = 0; x < o.geometry.vertices.length; x++) {

        let v = o.geometry.vertices[x];

        //b2 ? v.z += Math.sin(frequencyData[Math.floor(x/3)] * vert[x].z) : 0;
        b2 ? v.z = 
          Math.abs( /* keep waves above 0 */
             Math.sin( (v.z+1) /*keep waves alive when paused*/ / 50 /*40 - height of wave*/) * 
             (frequencyData[Math.floor(x/3)] * /*sample spread*/
             (vert[x].x/100) * 2 - 2) /* */
          ) / 2.5 /*brings waves closer to center*/ : 0;

      // b2 ? v.z -= Math.sin((Math.random() * (20 - .15) + .15) * vert[x] *avg): 0
        // b2 ? v.z = (Math.sin(frequencyData[x]) * (20 - .15) + .15) : 0; 
          ;
      b3 ? v.x += Math.sin(planeCounter) * (f1)*.00005  * v.x : 0; //breathe
        //b3 ? v.x += v.x : 0;
       //b4 ? v.x += planeSine * -.3 * (v.z) * 2 : 0; //sway

      }  
      o.geometry.computeFaceNormals();	
      o.geometry.normalsNeedUpdate = true;  
      o.geometry.verticesNeedUpdate = true;


      counter += increase;
      
    }
    planeCounter += .06;
  }

  //////////////////////////////////////////////////////
  // Render it
  let count = 1;
  let countInterval = Math.PI/250; // time of sine cycle
  camera.position.z = -40;
  function render() {
    camera.translateZ(Math.sin(count*.55) * .6); // distance / multiplier
    count += countInterval;
    visualize()

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
  render();
}