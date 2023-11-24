# SnapTrude Graphics Assignment

This is the submission of the Graphics Shader Assignment for Snaptrude.

## How to install/run
1. Clone the repo and run
   ```bash
   npm install local-web-server
   ```
   This installs a simple web server to run the application.
2. Now, run `npx ws` to run the server and use the url address then displayed in your browser to open index.html.
3. All the tasks will been rendered on index.html

## Tasks done
- [x] Task 1: Create a scene with meshes using the mesh builder and load a custom obj (bunny model) mesh into the scene. (See `createScene()` in main.js)
      ![image](https://github.com/Ishan-002/snaptrude-assignment/assets/58972469/e1f4c239-a5a5-4b89-b11a-2b897fa219a3)


- [x] Task 2: <br>
         - Return a mesh object when the mouse hovers over it. (See `outlineMeshOnHover()` in helpers.js). <br>
         - Outline a mesh on hover, using a shader. (See `outlineMeshOnHover()` in helpers.js). <br>
      Demo: [outline.webm](https://github.com/Ishan-002/snaptrude-assignment/assets/58972469/58274795-b593-4dd5-b19e-d9a1ea753f6d)

      
- [x] Addtional task: Create a UI to set the oulline width and color (See `createUI()` helpers.js) <br>
      Demo: [ui.webm](https://github.com/Ishan-002/snaptrude-assignment/assets/58972469/4a48d0c3-f4df-4024-8908-200f61a0f75e)


## Approach
The outlining has bene done using post processing with multiple passes. A silhoutte buffer is created to render all selected meshes to a specific color (something like a mask). Another blurred buffer is created to expand the silhoutte and then finally the blurred silhoutte is merged with the original textures to form the outline.
References:
1. https://ameye.dev/notes/rendering-outlines/
2. https://gamedev.stackexchange.com/questions/68401/how-can-i-draw-outlines-around-3d-models
3. And obvioulsy, the Babylon.js documentation and community forum.
