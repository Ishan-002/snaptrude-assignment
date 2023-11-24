// Enables outline on hover for all meshes in the scene. Uses post processing with multiple passes to achieve the effect.
export function outlineMeshOnHover(engine, scene, camera, outlineDetails) {
  let selectedMesh = null;

  // First pass: Create a render target as a step for creating the plain color buffer for all selected meshes, used further in the post process
  let renderTarget = new BABYLON.RenderTargetTexture(
    'depth',
    { ratio: engine.getRenderWidth() / engine.getRenderHeight() },
    scene,
    false
  );
  scene.customRenderTargets.push(renderTarget);

  let outlineMaterial = new BABYLON.StandardMaterial('outlineMaterial', scene);
  outlineMaterial.emissiveColor = BABYLON.Color3.White();

  renderTarget.onBeforeRender = function () {
    for (let index = 0; index < renderTarget.renderList.length; index++) {
      renderTarget.renderList[index].savedMaterial =
        renderTarget.renderList[index].material; // storing the material in savedMaterial
      renderTarget.renderList[index].material = outlineMaterial;
    }
  };

  renderTarget.onAfterRender = function () {
    for (let index = 0; index < renderTarget.renderList.length; index++) {
      renderTarget.renderList[index].material =
        renderTarget.renderList[index].savedMaterial; // using the savedMaterial here
    }
  };

  // Simple pass post process to save the original scene colors
  let passPostProcess = new BABYLON.PassPostProcess('pass', 1.0, camera);

  // Set the renderTarget as the texture in the display pass post process, so that it can be used for the blur passes
  let displayPass = new BABYLON.DisplayPassPostProcess(
    'displayRenderTarget',
    1.0,
    camera
  );
  displayPass.onApply = function (pEffect) {
    pEffect.setTexture('passSampler', renderTarget);
  };

  // 2-pass blur to expand the single color silhoutte buffer; horizontal and vertical
  new BABYLON.BlurPostProcess(
    'blurH',
    new BABYLON.Vector2(1.0, 0),
    16.0,
    0.5,
    camera
  );
  new BABYLON.BlurPostProcess(
    'blurV',
    new BABYLON.Vector2(0, 1.0),
    16.0,
    0.5,
    camera
  );

  // Final post process to combine the blurred silhoutte with the original colors to get an outline
  let combinePostProcess = new BABYLON.PostProcess(
    'combine',
    './outline',
    ['outlineColor', 'outlineWidth'],
    ['maskSampler', 'passSampler'],
    1.0,
    camera
  );
  combinePostProcess.onApply = function (effect) {
    effect.setTexture('maskSampler', renderTarget);
    effect.setTextureFromPostProcess('passSampler', passPostProcess);
    effect.setFloat3(
      'outlineColor',
      outlineDetails.outlineColor.r,
      outlineDetails.outlineColor.g,
      outlineDetails.outlineColor.b
    );
    effect.setFloat('outlineWidth', outlineDetails.outlineWidth);
  };

  // Registering hover actions for all meshes
  scene.meshes.forEach((mesh) => {
    mesh.actionManager = new BABYLON.ActionManager(scene);

    // Adding the mesh to render list on pointer over
    mesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOverTrigger,
        function (event) {
          if (
            renderTarget.renderList.find(function (element) {
              return element == mesh;
            }) == null
          ) {
            selectedMesh = mesh;
            renderTarget.renderList.push(mesh);
          }
        }
      )
    );

    // Removing the mesh from render list on pointer out
    mesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOutTrigger,
        function (event) {
          selectedMesh = null;
          renderTarget.renderList.splice(0);
        }
      )
    );
  });
  return selectedMesh;
}

// Creates the UI for the scene (outline width slider and color picker)
export function createUI(outlineDetails) {
  const advancedTexture =
    BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');

  const panel = new BABYLON.GUI.StackPanel();
  panel.width = '220px';
  panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  panel.paddingTopInPixels = '20px';
  advancedTexture.addControl(panel);

  // Text block to display outline width
  const header = new BABYLON.GUI.TextBlock();
  header.text = 'Outline Width: ' + outlineDetails.outlineWidth;
  header.height = '30px';
  header.color = 'white';
  panel.addControl(header);

  // Slider to set outline width
  var slider = new BABYLON.GUI.Slider();
  slider.minimum = 1;
  slider.maximum = 8;
  slider.value = outlineDetails.outlineWidth;
  slider.height = '20px';
  slider.width = '200px';
  slider.onValueChangedObservable.add(function (value) {
    header.text = 'Outline Width: ' + Math.round(value * 10) / 10;
    outlineDetails.outlineWidth = value;
  });
  panel.addControl(slider);

  // Color picker to set outline color
  let picker = new BABYLON.GUI.ColorPicker();
  picker.value = outlineDetails.outlineColor;
  picker.height = '150px';
  picker.width = '150px';
  picker.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  picker.onValueChangedObservable.add(function (value) {
    outlineDetails.outlineColor.copyFromFloats(value.r, value.g, value.b);
  });
  panel.addControl(picker);
}
