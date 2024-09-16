## (hyper)determinant visualizations
Highly interactive visualizations of the determinant 0 surface of 3x3 matrices and the hyperdeterminant 0 surface of 2x2x2 tensors.
Check them out [here](https://ghbrown.net/spirulae).

## Run locally
If you just want to run the website locally or hack on it a bit, that's easy too:
- clone this source using `git clone`
- move into the cloned directory and start a webserver with Python via
```bash
cd spirulae/; python -m http.server
```
- use a web browser to open the link in the Python command's output (i.e `http://0.0.0.0:8000/` or `localhost:8000` perhaps with a different number than 8000)

## Open source history
These visualizations are enabled by Harry Chen's [Spirulae](https://github.com/harry7557558/spirulae/), a set of tools for interactive mathematical visualization in the browser.
This project only uses a specialized version of the 3-D implicit function visualizer, but you can see and use this and all the other Spirulae apps [here](https://harry7557558.github.io/spirulae/)

Many dependencies, extraneous functionality, and unused assets were remove in the process of specializing this code for the given visualizations.

## How it works
### How Spirulae's 3-D implicit function visualizer works
Spirulae's various readmes cover this topic, but in four simple lines:
- parse mathematical expression for `f(x,y,z)=0` from an input box
- translate parsed expression for `f(x,y,z)` into a sequence of simple operations in [GLSL](https://www.khronos.org/opengl/wiki/Core_Language_(GLSL))
- inject the GLSL version of `f` into a [fragment shader](https://www.khronos.org/opengl/wiki/Fragment_Shader) which renders the implicit surface using [ray marching](https://en.wikipedia.org/wiki/Ray_marching)
- compile the function-specific GLSL function to [WebAssembly](https://webassembly.org/) using [emscripten](https://emscripten.org/), and run the compiled shader on the GPU to render an image
### How we changed things
We hijack Spirulae early in this process, essentially before the first step above.
By substituting user specified matrices/tensors in a symbolic expression, we assemble an implicit mathematical function of only `(x,y,z)` whose zeros are those of the (hyper)determinant.
We then feed this mathematical expression into the input box behind the scenes, as well as exposing fields and options for specifying the 4 matrices/tensors defining the affine slice of the ambient space.
