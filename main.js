import { outlineMeshOnHover, createUI } from './helpers.js';

let canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true); // Create the BABYLON 3D engine

const createScene = async function () {
  const scene = new BABYLON.Scene(engine);
  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    BABYLON.Tools.ToRadians(115),
    BABYLON.Tools.ToRadians(65),
    10,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.7;

  // Create some in-built meshes for the scene
  const ground = BABYLON.MeshBuilder.CreateGround(
    'ground',
    { width: 6, height: 6 },
    scene
  );
  const geodisc = BABYLON.MeshBuilder.CreateGeodesic('disc', {}, scene);
  geodisc.position.y = 1;
  geodisc.position.x = 1;

  const sphere = BABYLON.MeshBuilder.CreateSphere(
    'sphere',
    { diameter: 2, segments: 32 },
    scene
  );
  sphere.position.y = 1;
  sphere.position.x = -1;
  sphere.position.z = -1;

  // Import a custom OBJ mesh
  await BABYLON.SceneLoader.ImportMeshAsync(
    '',
    './',
    'stanford-bunny.obj',
    scene
  )
    .then((meshes) => {
      const mesh = meshes.meshes[0];
      mesh.scaling = new BABYLON.Vector3(12, 12, 12);
    })
    .catch((err) => console.log('Error while loading the obj file: ', err));

  // Setting the outline details in an object for further use
  let outlineDetails = {
    outlineWidth: 5,
    outlineColor: new BABYLON.Color3(1.0, 0.0, 0.0),
  };
  createUI(outlineDetails);

  outlineMeshOnHover(engine, scene, camera, outlineDetails);

  return scene;
};

const scene = await createScene(); // Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener('resize', function () {
  engine.resize();
});
