// 3D Implicit Surface Grapher

const NAME = "spirulae.det.";

const builtinFunctions = [
    ["sphere", "x^2+y^2+z^2=3"],
];

function randomize_0(k) {
  // create random shift
  var c = random_rank_k_3x3_flat(k);
  var elem = document.getElementById("0-input");
  elem.value = vector_to_string(c);
}

function randomize_123() {
  // create random basis for linear space
  var fields = ["1-input", "2-input", "3-input"];
  var A = uniform_random_matrix(9,4);
  var U = cgs(A);
  for (let i in fields) {
    var elem = document.getElementById(fields[i]);
    elem.value = vector_to_string(get_column(U,i));
  }
}

function make_2D() {
  // make figure 2-D by setting M_3 = 0
  var elem = document.getElementById("3-input");
  elem.value = '0 0 0 0 0 0 0 0 0';
}

function figure() {
  // recreates figure where M is rank 1
  var elem0 = document.getElementById("0-input");
  var elem1 = document.getElementById("1-input");
  var elem2 = document.getElementById("2-input");
  var elem3 = document.getElementById("3-input");
  elem0.value = '0.7564380123623672 2.6931904821149795 0.42258789283126935 0.5107590799819726 1.818485415037938 0.28533812397918257 0.9569077978496514 3.4069347802628993 0.534581344827208';
  elem1.value = '-0.14553721072818404 0.35082849715057596 0.4288486374029933 0.44615310905091726 -0.0585577607380845 -0.5520048544960808 -0.15951117143831353 -0.3725238924073981 -0.020452393611625905';
  elem2.value = '0.3454334142045596 -0.4367421566499605 -0.36088905384657644 -0.09657490788346289 -0.03787208039912238 -0.5869752749613661 0.28265368084523823 -0.31382093142813644 -0.1612869329773258';
  elem3.value = '-0.20519929163951284 0.01653364538324228 -0.6923980984116569 0.3428809552731109 -0.07494199105764643 -0.11600351294914686 -0.461937959750608 0.07151340137224886 0.3508040062959568';
}

function updateDet() {
    // read matrices in flattened form
    var vec_M0 = parseFlattened(document.getElementById("0-input").value);
    var vec_M1 = parseFlattened(document.getElementById("1-input").value);
    var vec_M2 = parseFlattened(document.getElementById("2-input").value);
    var vec_M3 = parseFlattened(document.getElementById("3-input").value);
    console.log(vec_M0);
    // create implicit expression from matrices
    var expr = detImplicit(vec_M0,vec_M1,vec_M2,vec_M3);
    var eq_input = document.getElementById("equation-input");
    // set equation input field and force update
    eq_input.value = expr;
    console.log(expr);
    updateFunctionInput(true);
}

function detImplicit(M0,M1,M2,M3) {
    // given symbolic expression for det in a 3-D affine space, substitute
    // values for the 4 matrices to get implicit expression in terms of x, y, z
  var det_sym =
      "x**3*M1[0,0]*M1[1,1]*M1[2,2] - x**3*M1[0,0]*M1[1,2]*M1[2,1] - x**3*M1[0,1]*M1[1,0]*M1[2,2] + x**3*M1[0,1]*M1[1,2]*M1[2,0] + x**3*M1[0,2]*M1[1,0]*M1[2,1] - x**3*M1[0,2]*M1[1,1]*M1[2,0] + x**2*y*M1[0,0]*M1[1,1]*M2[2,2] - x**2*y*M1[0,0]*M1[1,2]*M2[2,1] - x**2*y*M1[0,0]*M1[2,1]*M2[1,2] + x**2*y*M1[0,0]*M1[2,2]*M2[1,1] - x**2*y*M1[0,1]*M1[1,0]*M2[2,2] + x**2*y*M1[0,1]*M1[1,2]*M2[2,0] + x**2*y*M1[0,1]*M1[2,0]*M2[1,2] - x**2*y*M1[0,1]*M1[2,2]*M2[1,0] + x**2*y*M1[0,2]*M1[1,0]*M2[2,1] - x**2*y*M1[0,2]*M1[1,1]*M2[2,0] - x**2*y*M1[0,2]*M1[2,0]*M2[1,1] + x**2*y*M1[0,2]*M1[2,1]*M2[1,0] + x**2*y*M1[1,0]*M1[2,1]*M2[0,2] - x**2*y*M1[1,0]*M1[2,2]*M2[0,1] - x**2*y*M1[1,1]*M1[2,0]*M2[0,2] + x**2*y*M1[1,1]*M1[2,2]*M2[0,0] + x**2*y*M1[1,2]*M1[2,0]*M2[0,1] - x**2*y*M1[1,2]*M1[2,1]*M2[0,0] + x**2*z*M1[0,0]*M1[1,1]*M3[2,2] - x**2*z*M1[0,0]*M1[1,2]*M3[2,1] - x**2*z*M1[0,0]*M1[2,1]*M3[1,2] + x**2*z*M1[0,0]*M1[2,2]*M3[1,1] - x**2*z*M1[0,1]*M1[1,0]*M3[2,2] + x**2*z*M1[0,1]*M1[1,2]*M3[2,0] + x**2*z*M1[0,1]*M1[2,0]*M3[1,2] - x**2*z*M1[0,1]*M1[2,2]*M3[1,0] + x**2*z*M1[0,2]*M1[1,0]*M3[2,1] - x**2*z*M1[0,2]*M1[1,1]*M3[2,0] - x**2*z*M1[0,2]*M1[2,0]*M3[1,1] + x**2*z*M1[0,2]*M1[2,1]*M3[1,0] + x**2*z*M1[1,0]*M1[2,1]*M3[0,2] - x**2*z*M1[1,0]*M1[2,2]*M3[0,1] - x**2*z*M1[1,1]*M1[2,0]*M3[0,2] + x**2*z*M1[1,1]*M1[2,2]*M3[0,0] + x**2*z*M1[1,2]*M1[2,0]*M3[0,1] - x**2*z*M1[1,2]*M1[2,1]*M3[0,0] + x**2*M0[0,0]*M1[1,1]*M1[2,2] - x**2*M0[0,0]*M1[1,2]*M1[2,1] - x**2*M0[0,1]*M1[1,0]*M1[2,2] + x**2*M0[0,1]*M1[1,2]*M1[2,0] + x**2*M0[0,2]*M1[1,0]*M1[2,1] - x**2*M0[0,2]*M1[1,1]*M1[2,0] - x**2*M0[1,0]*M1[0,1]*M1[2,2] + x**2*M0[1,0]*M1[0,2]*M1[2,1] + x**2*M0[1,1]*M1[0,0]*M1[2,2] - x**2*M0[1,1]*M1[0,2]*M1[2,0] - x**2*M0[1,2]*M1[0,0]*M1[2,1] + x**2*M0[1,2]*M1[0,1]*M1[2,0] + x**2*M0[2,0]*M1[0,1]*M1[1,2] - x**2*M0[2,0]*M1[0,2]*M1[1,1] - x**2*M0[2,1]*M1[0,0]*M1[1,2] + x**2*M0[2,1]*M1[0,2]*M1[1,0] + x**2*M0[2,2]*M1[0,0]*M1[1,1] - x**2*M0[2,2]*M1[0,1]*M1[1,0] + x*y**2*M1[0,0]*M2[1,1]*M2[2,2] - x*y**2*M1[0,0]*M2[1,2]*M2[2,1] - x*y**2*M1[0,1]*M2[1,0]*M2[2,2] + x*y**2*M1[0,1]*M2[1,2]*M2[2,0] + x*y**2*M1[0,2]*M2[1,0]*M2[2,1] - x*y**2*M1[0,2]*M2[1,1]*M2[2,0] - x*y**2*M1[1,0]*M2[0,1]*M2[2,2] + x*y**2*M1[1,0]*M2[0,2]*M2[2,1] + x*y**2*M1[1,1]*M2[0,0]*M2[2,2] - x*y**2*M1[1,1]*M2[0,2]*M2[2,0] - x*y**2*M1[1,2]*M2[0,0]*M2[2,1] + x*y**2*M1[1,2]*M2[0,1]*M2[2,0] + x*y**2*M1[2,0]*M2[0,1]*M2[1,2] - x*y**2*M1[2,0]*M2[0,2]*M2[1,1] - x*y**2*M1[2,1]*M2[0,0]*M2[1,2] + x*y**2*M1[2,1]*M2[0,2]*M2[1,0] + x*y**2*M1[2,2]*M2[0,0]*M2[1,1] - x*y**2*M1[2,2]*M2[0,1]*M2[1,0] + x*y*z*M1[0,0]*M2[1,1]*M3[2,2] - x*y*z*M1[0,0]*M2[1,2]*M3[2,1] - x*y*z*M1[0,0]*M2[2,1]*M3[1,2] + x*y*z*M1[0,0]*M2[2,2]*M3[1,1] - x*y*z*M1[0,1]*M2[1,0]*M3[2,2] + x*y*z*M1[0,1]*M2[1,2]*M3[2,0] + x*y*z*M1[0,1]*M2[2,0]*M3[1,2] - x*y*z*M1[0,1]*M2[2,2]*M3[1,0] + x*y*z*M1[0,2]*M2[1,0]*M3[2,1] - x*y*z*M1[0,2]*M2[1,1]*M3[2,0] - x*y*z*M1[0,2]*M2[2,0]*M3[1,1] + x*y*z*M1[0,2]*M2[2,1]*M3[1,0] - x*y*z*M1[1,0]*M2[0,1]*M3[2,2] + x*y*z*M1[1,0]*M2[0,2]*M3[2,1] + x*y*z*M1[1,0]*M2[2,1]*M3[0,2] - x*y*z*M1[1,0]*M2[2,2]*M3[0,1] + x*y*z*M1[1,1]*M2[0,0]*M3[2,2] - x*y*z*M1[1,1]*M2[0,2]*M3[2,0] - x*y*z*M1[1,1]*M2[2,0]*M3[0,2] + x*y*z*M1[1,1]*M2[2,2]*M3[0,0] - x*y*z*M1[1,2]*M2[0,0]*M3[2,1] + x*y*z*M1[1,2]*M2[0,1]*M3[2,0] + x*y*z*M1[1,2]*M2[2,0]*M3[0,1] - x*y*z*M1[1,2]*M2[2,1]*M3[0,0] + x*y*z*M1[2,0]*M2[0,1]*M3[1,2] - x*y*z*M1[2,0]*M2[0,2]*M3[1,1] - x*y*z*M1[2,0]*M2[1,1]*M3[0,2] + x*y*z*M1[2,0]*M2[1,2]*M3[0,1] - x*y*z*M1[2,1]*M2[0,0]*M3[1,2] + x*y*z*M1[2,1]*M2[0,2]*M3[1,0] + x*y*z*M1[2,1]*M2[1,0]*M3[0,2] - x*y*z*M1[2,1]*M2[1,2]*M3[0,0] + x*y*z*M1[2,2]*M2[0,0]*M3[1,1] - x*y*z*M1[2,2]*M2[0,1]*M3[1,0] - x*y*z*M1[2,2]*M2[1,0]*M3[0,1] + x*y*z*M1[2,2]*M2[1,1]*M3[0,0] + x*y*M0[0,0]*M1[1,1]*M2[2,2] - x*y*M0[0,0]*M1[1,2]*M2[2,1] - x*y*M0[0,0]*M1[2,1]*M2[1,2] + x*y*M0[0,0]*M1[2,2]*M2[1,1] - x*y*M0[0,1]*M1[1,0]*M2[2,2] + x*y*M0[0,1]*M1[1,2]*M2[2,0] + x*y*M0[0,1]*M1[2,0]*M2[1,2] - x*y*M0[0,1]*M1[2,2]*M2[1,0] + x*y*M0[0,2]*M1[1,0]*M2[2,1] - x*y*M0[0,2]*M1[1,1]*M2[2,0] - x*y*M0[0,2]*M1[2,0]*M2[1,1] + x*y*M0[0,2]*M1[2,1]*M2[1,0] - x*y*M0[1,0]*M1[0,1]*M2[2,2] + x*y*M0[1,0]*M1[0,2]*M2[2,1] + x*y*M0[1,0]*M1[2,1]*M2[0,2] - x*y*M0[1,0]*M1[2,2]*M2[0,1] + x*y*M0[1,1]*M1[0,0]*M2[2,2] - x*y*M0[1,1]*M1[0,2]*M2[2,0] - x*y*M0[1,1]*M1[2,0]*M2[0,2] + x*y*M0[1,1]*M1[2,2]*M2[0,0] - x*y*M0[1,2]*M1[0,0]*M2[2,1] + x*y*M0[1,2]*M1[0,1]*M2[2,0] + x*y*M0[1,2]*M1[2,0]*M2[0,1] - x*y*M0[1,2]*M1[2,1]*M2[0,0] + x*y*M0[2,0]*M1[0,1]*M2[1,2] - x*y*M0[2,0]*M1[0,2]*M2[1,1] - x*y*M0[2,0]*M1[1,1]*M2[0,2] + x*y*M0[2,0]*M1[1,2]*M2[0,1] - x*y*M0[2,1]*M1[0,0]*M2[1,2] + x*y*M0[2,1]*M1[0,2]*M2[1,0] + x*y*M0[2,1]*M1[1,0]*M2[0,2] - x*y*M0[2,1]*M1[1,2]*M2[0,0] + x*y*M0[2,2]*M1[0,0]*M2[1,1] - x*y*M0[2,2]*M1[0,1]*M2[1,0] - x*y*M0[2,2]*M1[1,0]*M2[0,1] + x*y*M0[2,2]*M1[1,1]*M2[0,0] + x*z**2*M1[0,0]*M3[1,1]*M3[2,2] - x*z**2*M1[0,0]*M3[1,2]*M3[2,1] - x*z**2*M1[0,1]*M3[1,0]*M3[2,2] + x*z**2*M1[0,1]*M3[1,2]*M3[2,0] + x*z**2*M1[0,2]*M3[1,0]*M3[2,1] - x*z**2*M1[0,2]*M3[1,1]*M3[2,0] - x*z**2*M1[1,0]*M3[0,1]*M3[2,2] + x*z**2*M1[1,0]*M3[0,2]*M3[2,1] + x*z**2*M1[1,1]*M3[0,0]*M3[2,2] - x*z**2*M1[1,1]*M3[0,2]*M3[2,0] - x*z**2*M1[1,2]*M3[0,0]*M3[2,1] + x*z**2*M1[1,2]*M3[0,1]*M3[2,0] + x*z**2*M1[2,0]*M3[0,1]*M3[1,2] - x*z**2*M1[2,0]*M3[0,2]*M3[1,1] - x*z**2*M1[2,1]*M3[0,0]*M3[1,2] + x*z**2*M1[2,1]*M3[0,2]*M3[1,0] + x*z**2*M1[2,2]*M3[0,0]*M3[1,1] - x*z**2*M1[2,2]*M3[0,1]*M3[1,0] + x*z*M0[0,0]*M1[1,1]*M3[2,2] - x*z*M0[0,0]*M1[1,2]*M3[2,1] - x*z*M0[0,0]*M1[2,1]*M3[1,2] + x*z*M0[0,0]*M1[2,2]*M3[1,1] - x*z*M0[0,1]*M1[1,0]*M3[2,2] + x*z*M0[0,1]*M1[1,2]*M3[2,0] + x*z*M0[0,1]*M1[2,0]*M3[1,2] - x*z*M0[0,1]*M1[2,2]*M3[1,0] + x*z*M0[0,2]*M1[1,0]*M3[2,1] - x*z*M0[0,2]*M1[1,1]*M3[2,0] - x*z*M0[0,2]*M1[2,0]*M3[1,1] + x*z*M0[0,2]*M1[2,1]*M3[1,0] - x*z*M0[1,0]*M1[0,1]*M3[2,2] + x*z*M0[1,0]*M1[0,2]*M3[2,1] + x*z*M0[1,0]*M1[2,1]*M3[0,2] - x*z*M0[1,0]*M1[2,2]*M3[0,1] + x*z*M0[1,1]*M1[0,0]*M3[2,2] - x*z*M0[1,1]*M1[0,2]*M3[2,0] - x*z*M0[1,1]*M1[2,0]*M3[0,2] + x*z*M0[1,1]*M1[2,2]*M3[0,0] - x*z*M0[1,2]*M1[0,0]*M3[2,1] + x*z*M0[1,2]*M1[0,1]*M3[2,0] + x*z*M0[1,2]*M1[2,0]*M3[0,1] - x*z*M0[1,2]*M1[2,1]*M3[0,0] + x*z*M0[2,0]*M1[0,1]*M3[1,2] - x*z*M0[2,0]*M1[0,2]*M3[1,1] - x*z*M0[2,0]*M1[1,1]*M3[0,2] + x*z*M0[2,0]*M1[1,2]*M3[0,1] - x*z*M0[2,1]*M1[0,0]*M3[1,2] + x*z*M0[2,1]*M1[0,2]*M3[1,0] + x*z*M0[2,1]*M1[1,0]*M3[0,2] - x*z*M0[2,1]*M1[1,2]*M3[0,0] + x*z*M0[2,2]*M1[0,0]*M3[1,1] - x*z*M0[2,2]*M1[0,1]*M3[1,0] - x*z*M0[2,2]*M1[1,0]*M3[0,1] + x*z*M0[2,2]*M1[1,1]*M3[0,0] + x*M0[0,0]*M0[1,1]*M1[2,2] - x*M0[0,0]*M0[1,2]*M1[2,1] - x*M0[0,0]*M0[2,1]*M1[1,2] + x*M0[0,0]*M0[2,2]*M1[1,1] - x*M0[0,1]*M0[1,0]*M1[2,2] + x*M0[0,1]*M0[1,2]*M1[2,0] + x*M0[0,1]*M0[2,0]*M1[1,2] - x*M0[0,1]*M0[2,2]*M1[1,0] + x*M0[0,2]*M0[1,0]*M1[2,1] - x*M0[0,2]*M0[1,1]*M1[2,0] - x*M0[0,2]*M0[2,0]*M1[1,1] + x*M0[0,2]*M0[2,1]*M1[1,0] + x*M0[1,0]*M0[2,1]*M1[0,2] - x*M0[1,0]*M0[2,2]*M1[0,1] - x*M0[1,1]*M0[2,0]*M1[0,2] + x*M0[1,1]*M0[2,2]*M1[0,0] + x*M0[1,2]*M0[2,0]*M1[0,1] - x*M0[1,2]*M0[2,1]*M1[0,0] + y**3*M2[0,0]*M2[1,1]*M2[2,2] - y**3*M2[0,0]*M2[1,2]*M2[2,1] - y**3*M2[0,1]*M2[1,0]*M2[2,2] + y**3*M2[0,1]*M2[1,2]*M2[2,0] + y**3*M2[0,2]*M2[1,0]*M2[2,1] - y**3*M2[0,2]*M2[1,1]*M2[2,0] + y**2*z*M2[0,0]*M2[1,1]*M3[2,2] - y**2*z*M2[0,0]*M2[1,2]*M3[2,1] - y**2*z*M2[0,0]*M2[2,1]*M3[1,2] + y**2*z*M2[0,0]*M2[2,2]*M3[1,1] - y**2*z*M2[0,1]*M2[1,0]*M3[2,2] + y**2*z*M2[0,1]*M2[1,2]*M3[2,0] + y**2*z*M2[0,1]*M2[2,0]*M3[1,2] - y**2*z*M2[0,1]*M2[2,2]*M3[1,0] + y**2*z*M2[0,2]*M2[1,0]*M3[2,1] - y**2*z*M2[0,2]*M2[1,1]*M3[2,0] - y**2*z*M2[0,2]*M2[2,0]*M3[1,1] + y**2*z*M2[0,2]*M2[2,1]*M3[1,0] + y**2*z*M2[1,0]*M2[2,1]*M3[0,2] - y**2*z*M2[1,0]*M2[2,2]*M3[0,1] - y**2*z*M2[1,1]*M2[2,0]*M3[0,2] + y**2*z*M2[1,1]*M2[2,2]*M3[0,0] + y**2*z*M2[1,2]*M2[2,0]*M3[0,1] - y**2*z*M2[1,2]*M2[2,1]*M3[0,0] + y**2*M0[0,0]*M2[1,1]*M2[2,2] - y**2*M0[0,0]*M2[1,2]*M2[2,1] - y**2*M0[0,1]*M2[1,0]*M2[2,2] + y**2*M0[0,1]*M2[1,2]*M2[2,0] + y**2*M0[0,2]*M2[1,0]*M2[2,1] - y**2*M0[0,2]*M2[1,1]*M2[2,0] - y**2*M0[1,0]*M2[0,1]*M2[2,2] + y**2*M0[1,0]*M2[0,2]*M2[2,1] + y**2*M0[1,1]*M2[0,0]*M2[2,2] - y**2*M0[1,1]*M2[0,2]*M2[2,0] - y**2*M0[1,2]*M2[0,0]*M2[2,1] + y**2*M0[1,2]*M2[0,1]*M2[2,0] + y**2*M0[2,0]*M2[0,1]*M2[1,2] - y**2*M0[2,0]*M2[0,2]*M2[1,1] - y**2*M0[2,1]*M2[0,0]*M2[1,2] + y**2*M0[2,1]*M2[0,2]*M2[1,0] + y**2*M0[2,2]*M2[0,0]*M2[1,1] - y**2*M0[2,2]*M2[0,1]*M2[1,0] + y*z**2*M2[0,0]*M3[1,1]*M3[2,2] - y*z**2*M2[0,0]*M3[1,2]*M3[2,1] - y*z**2*M2[0,1]*M3[1,0]*M3[2,2] + y*z**2*M2[0,1]*M3[1,2]*M3[2,0] + y*z**2*M2[0,2]*M3[1,0]*M3[2,1] - y*z**2*M2[0,2]*M3[1,1]*M3[2,0] - y*z**2*M2[1,0]*M3[0,1]*M3[2,2] + y*z**2*M2[1,0]*M3[0,2]*M3[2,1] + y*z**2*M2[1,1]*M3[0,0]*M3[2,2] - y*z**2*M2[1,1]*M3[0,2]*M3[2,0] - y*z**2*M2[1,2]*M3[0,0]*M3[2,1] + y*z**2*M2[1,2]*M3[0,1]*M3[2,0] + y*z**2*M2[2,0]*M3[0,1]*M3[1,2] - y*z**2*M2[2,0]*M3[0,2]*M3[1,1] - y*z**2*M2[2,1]*M3[0,0]*M3[1,2] + y*z**2*M2[2,1]*M3[0,2]*M3[1,0] + y*z**2*M2[2,2]*M3[0,0]*M3[1,1] - y*z**2*M2[2,2]*M3[0,1]*M3[1,0] + y*z*M0[0,0]*M2[1,1]*M3[2,2] - y*z*M0[0,0]*M2[1,2]*M3[2,1] - y*z*M0[0,0]*M2[2,1]*M3[1,2] + y*z*M0[0,0]*M2[2,2]*M3[1,1] - y*z*M0[0,1]*M2[1,0]*M3[2,2] + y*z*M0[0,1]*M2[1,2]*M3[2,0] + y*z*M0[0,1]*M2[2,0]*M3[1,2] - y*z*M0[0,1]*M2[2,2]*M3[1,0] + y*z*M0[0,2]*M2[1,0]*M3[2,1] - y*z*M0[0,2]*M2[1,1]*M3[2,0] - y*z*M0[0,2]*M2[2,0]*M3[1,1] + y*z*M0[0,2]*M2[2,1]*M3[1,0] - y*z*M0[1,0]*M2[0,1]*M3[2,2] + y*z*M0[1,0]*M2[0,2]*M3[2,1] + y*z*M0[1,0]*M2[2,1]*M3[0,2] - y*z*M0[1,0]*M2[2,2]*M3[0,1] + y*z*M0[1,1]*M2[0,0]*M3[2,2] - y*z*M0[1,1]*M2[0,2]*M3[2,0] - y*z*M0[1,1]*M2[2,0]*M3[0,2] + y*z*M0[1,1]*M2[2,2]*M3[0,0] - y*z*M0[1,2]*M2[0,0]*M3[2,1] + y*z*M0[1,2]*M2[0,1]*M3[2,0] + y*z*M0[1,2]*M2[2,0]*M3[0,1] - y*z*M0[1,2]*M2[2,1]*M3[0,0] + y*z*M0[2,0]*M2[0,1]*M3[1,2] - y*z*M0[2,0]*M2[0,2]*M3[1,1] - y*z*M0[2,0]*M2[1,1]*M3[0,2] + y*z*M0[2,0]*M2[1,2]*M3[0,1] - y*z*M0[2,1]*M2[0,0]*M3[1,2] + y*z*M0[2,1]*M2[0,2]*M3[1,0] + y*z*M0[2,1]*M2[1,0]*M3[0,2] - y*z*M0[2,1]*M2[1,2]*M3[0,0] + y*z*M0[2,2]*M2[0,0]*M3[1,1] - y*z*M0[2,2]*M2[0,1]*M3[1,0] - y*z*M0[2,2]*M2[1,0]*M3[0,1] + y*z*M0[2,2]*M2[1,1]*M3[0,0] + y*M0[0,0]*M0[1,1]*M2[2,2] - y*M0[0,0]*M0[1,2]*M2[2,1] - y*M0[0,0]*M0[2,1]*M2[1,2] + y*M0[0,0]*M0[2,2]*M2[1,1] - y*M0[0,1]*M0[1,0]*M2[2,2] + y*M0[0,1]*M0[1,2]*M2[2,0] + y*M0[0,1]*M0[2,0]*M2[1,2] - y*M0[0,1]*M0[2,2]*M2[1,0] + y*M0[0,2]*M0[1,0]*M2[2,1] - y*M0[0,2]*M0[1,1]*M2[2,0] - y*M0[0,2]*M0[2,0]*M2[1,1] + y*M0[0,2]*M0[2,1]*M2[1,0] + y*M0[1,0]*M0[2,1]*M2[0,2] - y*M0[1,0]*M0[2,2]*M2[0,1] - y*M0[1,1]*M0[2,0]*M2[0,2] + y*M0[1,1]*M0[2,2]*M2[0,0] + y*M0[1,2]*M0[2,0]*M2[0,1] - y*M0[1,2]*M0[2,1]*M2[0,0] + z**3*M3[0,0]*M3[1,1]*M3[2,2] - z**3*M3[0,0]*M3[1,2]*M3[2,1] - z**3*M3[0,1]*M3[1,0]*M3[2,2] + z**3*M3[0,1]*M3[1,2]*M3[2,0] + z**3*M3[0,2]*M3[1,0]*M3[2,1] - z**3*M3[0,2]*M3[1,1]*M3[2,0] + z**2*M0[0,0]*M3[1,1]*M3[2,2] - z**2*M0[0,0]*M3[1,2]*M3[2,1] - z**2*M0[0,1]*M3[1,0]*M3[2,2] + z**2*M0[0,1]*M3[1,2]*M3[2,0] + z**2*M0[0,2]*M3[1,0]*M3[2,1] - z**2*M0[0,2]*M3[1,1]*M3[2,0] - z**2*M0[1,0]*M3[0,1]*M3[2,2] + z**2*M0[1,0]*M3[0,2]*M3[2,1] + z**2*M0[1,1]*M3[0,0]*M3[2,2] - z**2*M0[1,1]*M3[0,2]*M3[2,0] - z**2*M0[1,2]*M3[0,0]*M3[2,1] + z**2*M0[1,2]*M3[0,1]*M3[2,0] + z**2*M0[2,0]*M3[0,1]*M3[1,2] - z**2*M0[2,0]*M3[0,2]*M3[1,1] - z**2*M0[2,1]*M3[0,0]*M3[1,2] + z**2*M0[2,1]*M3[0,2]*M3[1,0] + z**2*M0[2,2]*M3[0,0]*M3[1,1] - z**2*M0[2,2]*M3[0,1]*M3[1,0] + z*M0[0,0]*M0[1,1]*M3[2,2] - z*M0[0,0]*M0[1,2]*M3[2,1] - z*M0[0,0]*M0[2,1]*M3[1,2] + z*M0[0,0]*M0[2,2]*M3[1,1] - z*M0[0,1]*M0[1,0]*M3[2,2] + z*M0[0,1]*M0[1,2]*M3[2,0] + z*M0[0,1]*M0[2,0]*M3[1,2] - z*M0[0,1]*M0[2,2]*M3[1,0] + z*M0[0,2]*M0[1,0]*M3[2,1] - z*M0[0,2]*M0[1,1]*M3[2,0] - z*M0[0,2]*M0[2,0]*M3[1,1] + z*M0[0,2]*M0[2,1]*M3[1,0] + z*M0[1,0]*M0[2,1]*M3[0,2] - z*M0[1,0]*M0[2,2]*M3[0,1] - z*M0[1,1]*M0[2,0]*M3[0,2] + z*M0[1,1]*M0[2,2]*M3[0,0] + z*M0[1,2]*M0[2,0]*M3[0,1] - z*M0[1,2]*M0[2,1]*M3[0,0] + M0[0,0]*M0[1,1]*M0[2,2] - M0[0,0]*M0[1,2]*M0[2,1] - M0[0,1]*M0[1,0]*M0[2,2] + M0[0,1]*M0[1,2]*M0[2,0] + M0[0,2]*M0[1,0]*M0[2,1] - M0[0,2]*M0[1,1]*M0[2,0]"  ;
    var M_list = [M0,M1,M2,M3];
    var det_imp = det_sym;
    // substitute actual values into expression
    var ind_flat, elt_cur;
    for (let iM of [0,1,2,3]) {
        var Mcur = M_list[iM];
        for (let i of [0,1,2])  {
            for (let j of [0,1,2])  {
                ind_flat = i*3 + j;  // index into vec(Tcur)
                elt_cur = Mcur[ind_flat];
                det_imp = det_imp.replaceAll(`M${iM}[${i},${j}]`,
                                               elt_cur);
            }
        }
    }
    det_imp = combineFloats(det_imp);
    return det_imp;
}


document.body.onload = function (event) {
    console.log("onload");

    // init built-in functions
    initBuiltInFunctions(builtinFunctions);

    // init parser
    BuiltInMathFunctions.initMathFunctions(
        BuiltInMathFunctions.rawMathFunctionsShared
            .concat(BuiltInMathFunctions.rawMathFunctionsR)
    );
    MathParser.IndependentVariables = {
        'x': "x",
        'y': "y",
        'z': "z"
    };
    MathParser.DependentVariables = {
        0: {
            'val': true,
        },
        1: {
            'val': true,
            'c_rgb': true,
        },
        2: {
            'val': true,
            'c_hsv': true,
        },
        3: {
            'val': true,
            'c_hsl': true,
        },
        'c_rgb': { type: 'vec3' },
        'c_hsv': { type: 'vec3' },
        'c_hsl': { type: 'vec3' },
    };

    CodeGenerator.langs.glsl.config = {
        fun: [
            "float {%funname%}(float x, float y, float z) {\n\
    float {%funbody%};\n\
    return {%val%};\n\
}",
            "#define CUSTOM_COLOR rgb2rgb\n\
float {%funname%}(float x, float y, float z) {\n\
    float {%funbody%};\n\
    return {%val%};\n\
}\n\
vec4 {%funname%}C(float x, float y, float z) {\n\
    float {%funbody%};\n\
    return vec4({%c_rgb[0]%},{%c_rgb[1]%},{%c_rgb[2]%},{%val%});\n\
}",
            "#define CUSTOM_COLOR hsv2rgb\n\
float {%funname%}(float x, float y, float z) {\n\
    float {%funbody%};\n\
    return {%val%};\n\
}\n\
vec4 {%funname%}C(float x, float y, float z) {\n\
    float {%funbody%};\n\
    return vec4({%c_hsv[0]%},{%c_hsv[1]%},{%c_hsv[2]%},{%val%});\n\
}",
            "#define CUSTOM_COLOR hsl2rgb\n\
float {%funname%}(float x, float y, float z) {\n\
    float {%funbody%};\n\
    return {%val%};\n\
}\n\
vec4 {%funname%}C(float x, float y, float z) {\n\
    float {%funbody%};\n\
    return vec4({%c_hsl[0]%},{%c_hsl[1]%},{%c_hsl[2]%},{%val%});\n\
}",
        ],
        prefix: 'v',
        def: "{%varname%}={%expr%}",
        joiner: ", "
    };

    // init parameters
    initParameters([
        new GraphingParameter("sStep", "select-step"),
        new GraphingParameter("bLight", "checkbox-light"),
        new GraphingParameter("bYup", "checkbox-yup"),
        new GraphingParameter("sClip", "select-clip"),
        new GraphingParameter("bClipFixed", "checkbox-clip-fixed"),
        new GraphingParameter("sField", "select-field"),
        new GraphingParameter("bGrid", "checkbox-grid"),
        new GraphingParameter("sColor", "select-color"),
        new GraphingParameter("bTransparency", "checkbox-transparency"),
        new GraphingParameter("bDiscontinuity", "checkbox-discontinuity"),
        new GraphingParameter("cLatex", "checkbox-latex"),
        new GraphingParameter("cAutoUpdate", "checkbox-auto-compile"),
        new UniformSlider("rTheta", "slider-theta", -0.5 * Math.PI, 1.5 * Math.PI, Math.PI / 6.0),
        new UniformSlider("rPhi", "slider-phi", 0, Math.PI, Math.PI / 6.0),
        new ClickableObject('lAxes', 'axis-circle', 4),
    ]);
    UpdateFunctionInputConfig.complexMode = false;
    UpdateFunctionInputConfig.implicitMode = true;
    UpdateFunctionInputConfig.warnNaN = true;

    // init viewport
    resetState({
        rz: -0.9 * Math.PI,
        rx: -0.4 * Math.PI,
        scale: 0.5,
        clipSize: [2.0, 2.0, 2.0]
    }, false);

    // main
    initMain([
        "../shaders/vert-pixel.glsl",
        "frag-premarch.glsl",
        "../shaders/frag-pool.glsl",
        "frag-raymarch.glsl",
        "../shaders/frag-imggrad.glsl",
        "../shaders/frag-aa.glsl",
        "../shaders/complex-zeta.glsl",
        "../shaders/complex.glsl",
    ]);
    updateDet();
};


// for local testing

function exportAllFunctions(lang, grad = false) {
    let langpack = CodeGenerator.langs[lang];
    let oldConfig = langpack.config;
    langpack.config = langpack.presets[grad ? 'implicit3g_compact' : 'implicit3_compact'];
    var funs = builtinFunctions;
    var names = [], exprs = [];
    for (var i = 0; i < funs.length; i++) {
        var name = 'fun' + funs[i][0].replace(/[^\w]/g, '');
        console.log(name);
        var str = funs[i][1].replaceAll("&#32;", ' ')
        var expr = MathParser.parseInput(str);
        names.push(name);
        exprs.push({ val: expr.val[0] });
    }
    var res = CodeGenerator.postfixToSource(exprs, names, lang);
    console.log(res.source);
    langpack.config = oldConfig;
}

function exportCurrentFunction(lang, grad = false) {
    let langpack = CodeGenerator.langs[lang];
    let oldConfig = langpack.config;
    langpack.config = langpack.presets[grad ? 'implicit3g' : 'implicit3'];
    var str = document.getElementById("equation-input").value;
    var expr = MathParser.parseInput(str).val[0];
    var res = CodeGenerator.postfixToSource(
        [{ val: expr }], ["fun"], lang);
    console.log(res.source);
    langpack.config = oldConfig;
}
