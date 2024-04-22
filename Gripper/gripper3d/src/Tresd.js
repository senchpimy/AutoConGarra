import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
const width = window.innerWidth, height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
camera.position.z = 1;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
const material = new THREE.MeshNormalMaterial();

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setAnimationLoop(animation);
//----Poscicion
function canvas() {
  const element = document.createElement("div")
  element.id = "canvas";
  return element

}
let r = canvas()
document.body.appendChild(r);
const conatiner = document.getElementById("canvas");
conatiner.appendChild(renderer.domElement)

//----Controles
const controls = new OrbitControls(camera, renderer.domElement)
//controls.enableDamping = true

//----Malla
//var size = 14, step = 1;
//var g = new THREE.BufferGeometry()
//const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
//var arr = []
//for (var i = -size; i <= size; i += step) {
//  arr.push(-size, -0.04, i)
//  arr.push(size, -0.04, i)
//
//  arr.push(i, -0.04, -size)
//  arr.push(i, -0.04, size)
//}
//const target = new THREE.Float32BufferAttribute(arr, 3)
//
//g.
function createGrid(size, divisions) {
  var grid = new THREE.Group();

  var gridHelper = new THREE.GridHelper(size, divisions);
  grid.add(gridHelper);

  return grid;
}

var line = createGrid(5, 20)


scene.add(line)
//----Archivos
const loader = new STLLoader()
loader.load(
  './models/example.stl',
  function(geometry) {
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
  },
  (error) => {
    console.log(error)
  }
)

function Tresd() {

  return (
    <div>
    </div>
  );
}

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.render(scene, camera)
}
function animation(time) {

  //mesh.rotation.x = time / 2000;
  //mesh.rotation.y = time / 1000;
  controls.update()

  renderer.render(scene, camera);

}


export default Tresd;
