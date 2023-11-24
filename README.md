# SnapTrude Graphics Assignment

This is the submission of the Graphics Shader Assignment for Snaptrude.

## How to install/run
1. Clone the repo and run
   ```bash
   npm install local-web-server
   ```
   This installs a simple web server to run the application.
2. Now, run `npx ws` ws to run the server and use the url address then displayed in your browser to open index.html.
3. All the tasks will been rendered on index.html

## Tasks done
- [x] Task 1: Create a scene with meshes using the mesh builder and load a custom obj (bunny model) mesh into the scene. (See `createScene()` in main.js)
      ![image](https://github.com/Ishan-002/snaptrude-assignment/assets/58972469/dda1c48a-181e-4fac-b3e9-45be3d0ef4d7)

- [x] Task 2: <br>
         - Return a mesh object when the mouse hovers over it. (See `outlineMeshOnHover()` in helpers.js). <br>
         - Outline a mesh on hover, using a shader. (See `outlineMeshOnHover()` in helpers.js). <br>
      Demo: [outline.webm](https://github.com/Ishan-002/snaptrude-assignment/assets/58972469/ad02fabc-98df-4993-887f-c81bd00abb1b)
      
- [x] Addtional task: Create a UI to set the oulline width and color (See `createUI()` helpers.js) <br>
      Demo: [ui.webm](https://github.com/Ishan-002/snaptrude-assignment/assets/58972469/a2cccbe8-85d5-414c-888a-b75a4f25509b)

## Approach
The outlining has bene done using post processing with multiple passes. A silhoutte buffer is created to render all selected meshes to a specific color (something like a mask). Another blurred buffer is created to expand the silhoutte and then finally the blurred silhoutte is merged with the original textures to form the outline.
References:
1. https://ameye.dev/notes/rendering-outlines/
2. https://gamedev.stackexchange.com/questions/68401/how-can-i-draw-outlines-around-3d-models
3. And obvioulsy, the Babylon.js documentation and community forum.
