<h2>$3 \times 3$ determinant visualizer</h2>

<p>This tool visualizes the zero surface of the matrix determinant for $3 \times 3$ matrices. Specifically, it visualizes the zero surface in a configurable 3-D slice of the full 9-D space. Type (vectorized) matrices in the input boxes or randomize them. Matrices are written one row after another (C-style vectorization):</p>

<pre><code>
  a_11 a_12 a_13 a_21 a_22 a_23 a_31 a_32 a_33
</pre></code>

<p>Together $(\mathbf{M}_0,\mathbf{M}_1,\mathbf{M}_2,\mathbf{M}_3)$ define a 3-D slice through the space. $\mathbf{M}_0$ gives the base point through which the slice will pass, while other three matrices define directions one can move within the slice.</p>

<p>Drag the canvas to rotate the surface, and scroll to zoom in/out. Drag while holding <code>Shift</code> to move the graph on the screen. Try to play with selectors, checkboxes, and sliders.</p>

<p>You need a device/browser that supports <a href="https://webglreport.com/?v=2" target="_blank">WebGL 2</a> to run this tool.</p>

<h3>Graphing parameters</h3>

<p><b>Quality</b>: A higher quality means a smaller raymarching step, which is slower but usually produces a more accurate image.</p>

<p><b>Light theme</b>: Check <code>☼</code> to use light background instead of the default dark background.</p>

<p><b>Clip</b>: Restrict the domain of the function for better visualization and accelerated rendering.</p>


<p><b>Grid</b>: When checked, this tool will display an adaptive grid on the surface, making it easier to see the size of the object and read the coordinates of a point.</p>

<p><b>Lighting angles</b>: As the <i>θ<sub>light</sub></i> slider is dragged from left to right, the light moves from bottom to bottom counter-clockwise. As the <i>φ<sub>light</sub></i> slider is dragged from left to right, the light moves from front to back. The light rotates to fit this description as the viewport rotates. Right-click a slider to reset a lighting angle to default.</p>

<h3>Coloring modes</h3>

<p><b>Default</b>: (not really the default mode) This mode displays a light gray, glazed surface. You may or may not see a slight tint depending on your device's display setting.</p>

<p><b>Normal</b>: This mode calculates the albedo of the surface based on the surface normal (normalized gradient). Red corresponds the <i>x</i>-direction, green corresponds the <i>y</i>-direction, blue corresponds the <i>z</i>-direction. When the component of the normal is more positive along a direction, the corresponding color component is stronger. Visually, the green part has the most positive <i>y</i> normal.</p>

<p><b>Gradient</b>: This mode colors the surface based on the magnitude of the gradient. The surface appears bluer when the magnitude of the gradient is closer to an integer power of 100, like 0.01, 1, 100, and more orange as it departs. For a perfect SDF, you should see a clean dark blue color. For where the gradient approaches zero or infinity, there may be alternating blue and orange "stripes." (check the "A6 heart" example)</p>

<h3>Technical details</h3>

<p>This tool implements the raymarching algorithm in WebGL fragment shaders. It casts rays from the camera and numerically finds its intersections with the surface. The raymarching step size is calculated by dividing the value of the scalar field by the magnitude of the directional derivative along the ray (in screen space) and clamped based on a given step size, which can be changed through the "quality" selector.</p>

<p>In the first pass, it marches along the ray to determine an interval where intersections may exist. Then, the result is pooled using min/max functions with neighboring pixels to avoid missing intersections. These two passes are done in 0.25x of the screen resolution.</p>

<p>The main raymarching function checks intersections within the calculated intervals. For opaque surfaces, a bisection search is performed when the first sign change is detected, and the color is calculated and returned. For a semi-transparent surface, it approximates intersections using linear interpolation and calculates and accumulates the color each time a sign change is detected.</p>

<p>The rendered image goes through an anti-aliasing pass. This pass uses a filter based on linear regression to anti-alias the image. A description and implementation of the algorithm can be found <a href="https://www.shadertoy.com/view/sllczM" target="_blank">here</a>.</p>

<p>The source code of this tool can be found on <a href="https://github.com/ghbrown.net/deter/" target="_blank">GitHub</a>, and was built on top of Harry Chen's <a href="https://github.com/harry7557558/spirulae/tree/master/implicit3" target="_blank">Spirulae 3D implicit surface grapher</a>.</p>
