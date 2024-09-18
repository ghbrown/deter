// 3D Implicit Surface Grapher

const NAME = "spirulae.hdet.";

const builtinFunctions = [
    ["sphere", "x^2+y^2+z^2=3"],
];

function randomize_0() {
  // create random shift
  var c = uniform_random_vector(2*2*2)
  console.log(c);
  var elem = document.getElementById("0-input");
  elem.value = vector_to_string(c);
}

function randomize_123() {
  // create random basis for linear space
  var fields = ["1-input", "2-input", "3-input"];
  var A = uniform_random_matrix(8,4);
  var U = cgs(A);
  for (let i in fields) {
    var elem = document.getElementById(fields[i]);
    elem.value = vector_to_string(get_column(U,i));
  }
}

function updateHdet() {
    // read flattened tensors
    var vec_T0 = parseFlattened(document.getElementById("0-input").value);
    var vec_T1 = parseFlattened(document.getElementById("1-input").value);
    var vec_T2 = parseFlattened(document.getElementById("2-input").value);
    var vec_T3 = parseFlattened(document.getElementById("3-input").value);
    // create implicit expression from tensors
    var expr = hdetImplicit(vec_T0,vec_T1,vec_T2,vec_T3);
    var eq_input = document.getElementById("equation-input");
    // set equation input field and force update
    eq_input.value = expr;
    updateFunctionInput(true);
}

function hdetImplicit(T0,T1,T2,T3) {
    // given symbolic expression for hdet in a 3-D affine space, substitute
    // values for the 4 tensors to get implicit expression in terms of x, y, z
    var hdet_sym =
        "-(4*x**2*T1[0,0,0]*T1[1,1,0] - 4*x**2*T1[0,1,0]*T1[1,0,0] + 4*x*y*T1[0,0,0]*T2[1,1,0] - 4*x*y*T1[0,1,0]*T2[1,0,0] - 4*x*y*T1[1,0,0]*T2[0,1,0] + 4*x*y*T1[1,1,0]*T2[0,0,0] + 4*x*z*T1[0,0,0]*T3[1,1,0] - 4*x*z*T1[0,1,0]*T3[1,0,0] - 4*x*z*T1[1,0,0]*T3[0,1,0] + 4*x*z*T1[1,1,0]*T3[0,0,0] + 4*x*T0[0,0,0]*T1[1,1,0] - 4*x*T0[0,1,0]*T1[1,0,0] - 4*x*T0[1,0,0]*T1[0,1,0] + 4*x*T0[1,1,0]*T1[0,0,0] + 4*y**2*T2[0,0,0]*T2[1,1,0] - 4*y**2*T2[0,1,0]*T2[1,0,0] + 4*y*z*T2[0,0,0]*T3[1,1,0] - 4*y*z*T2[0,1,0]*T3[1,0,0] - 4*y*z*T2[1,0,0]*T3[0,1,0] + 4*y*z*T2[1,1,0]*T3[0,0,0] + 4*y*T0[0,0,0]*T2[1,1,0] - 4*y*T0[0,1,0]*T2[1,0,0] - 4*y*T0[1,0,0]*T2[0,1,0] + 4*y*T0[1,1,0]*T2[0,0,0] + 4*z**2*T3[0,0,0]*T3[1,1,0] - 4*z**2*T3[0,1,0]*T3[1,0,0] + 4*z*T0[0,0,0]*T3[1,1,0] - 4*z*T0[0,1,0]*T3[1,0,0] - 4*z*T0[1,0,0]*T3[0,1,0] + 4*z*T0[1,1,0]*T3[0,0,0] + 4*T0[0,0,0]*T0[1,1,0] - 4*T0[0,1,0]*T0[1,0,0])*(x**2*T1[0,0,1]*T1[1,1,1] - x**2*T1[0,1,1]*T1[1,0,1] + x*y*T1[0,0,1]*T2[1,1,1] - x*y*T1[0,1,1]*T2[1,0,1] - x*y*T1[1,0,1]*T2[0,1,1] + x*y*T1[1,1,1]*T2[0,0,1] + x*z*T1[0,0,1]*T3[1,1,1] - x*z*T1[0,1,1]*T3[1,0,1] - x*z*T1[1,0,1]*T3[0,1,1] + x*z*T1[1,1,1]*T3[0,0,1] + x*T0[0,0,1]*T1[1,1,1] - x*T0[0,1,1]*T1[1,0,1] - x*T0[1,0,1]*T1[0,1,1] + x*T0[1,1,1]*T1[0,0,1] + y**2*T2[0,0,1]*T2[1,1,1] - y**2*T2[0,1,1]*T2[1,0,1] + y*z*T2[0,0,1]*T3[1,1,1] - y*z*T2[0,1,1]*T3[1,0,1] - y*z*T2[1,0,1]*T3[0,1,1] + y*z*T2[1,1,1]*T3[0,0,1] + y*T0[0,0,1]*T2[1,1,1] - y*T0[0,1,1]*T2[1,0,1] - y*T0[1,0,1]*T2[0,1,1] + y*T0[1,1,1]*T2[0,0,1] + z**2*T3[0,0,1]*T3[1,1,1] - z**2*T3[0,1,1]*T3[1,0,1] + z*T0[0,0,1]*T3[1,1,1] - z*T0[0,1,1]*T3[1,0,1] - z*T0[1,0,1]*T3[0,1,1] + z*T0[1,1,1]*T3[0,0,1] + T0[0,0,1]*T0[1,1,1] - T0[0,1,1]*T0[1,0,1]) + (x**2*T1[0,0,0]*T1[1,1,1] + x**2*T1[0,0,1]*T1[1,1,0] - x**2*T1[0,1,0]*T1[1,0,1] - x**2*T1[0,1,1]*T1[1,0,0] + x*y*T1[0,0,0]*T2[1,1,1] + x*y*T1[0,0,1]*T2[1,1,0] - x*y*T1[0,1,0]*T2[1,0,1] - x*y*T1[0,1,1]*T2[1,0,0] - x*y*T1[1,0,0]*T2[0,1,1] - x*y*T1[1,0,1]*T2[0,1,0] + x*y*T1[1,1,0]*T2[0,0,1] + x*y*T1[1,1,1]*T2[0,0,0] + x*z*T1[0,0,0]*T3[1,1,1] + x*z*T1[0,0,1]*T3[1,1,0] - x*z*T1[0,1,0]*T3[1,0,1] - x*z*T1[0,1,1]*T3[1,0,0] - x*z*T1[1,0,0]*T3[0,1,1] - x*z*T1[1,0,1]*T3[0,1,0] + x*z*T1[1,1,0]*T3[0,0,1] + x*z*T1[1,1,1]*T3[0,0,0] + x*T0[0,0,0]*T1[1,1,1] + x*T0[0,0,1]*T1[1,1,0] - x*T0[0,1,0]*T1[1,0,1] - x*T0[0,1,1]*T1[1,0,0] - x*T0[1,0,0]*T1[0,1,1] - x*T0[1,0,1]*T1[0,1,0] + x*T0[1,1,0]*T1[0,0,1] + x*T0[1,1,1]*T1[0,0,0] + y**2*T2[0,0,0]*T2[1,1,1] + y**2*T2[0,0,1]*T2[1,1,0] - y**2*T2[0,1,0]*T2[1,0,1] - y**2*T2[0,1,1]*T2[1,0,0] + y*z*T2[0,0,0]*T3[1,1,1] + y*z*T2[0,0,1]*T3[1,1,0] - y*z*T2[0,1,0]*T3[1,0,1] - y*z*T2[0,1,1]*T3[1,0,0] - y*z*T2[1,0,0]*T3[0,1,1] - y*z*T2[1,0,1]*T3[0,1,0] + y*z*T2[1,1,0]*T3[0,0,1] + y*z*T2[1,1,1]*T3[0,0,0] + y*T0[0,0,0]*T2[1,1,1] + y*T0[0,0,1]*T2[1,1,0] - y*T0[0,1,0]*T2[1,0,1] - y*T0[0,1,1]*T2[1,0,0] - y*T0[1,0,0]*T2[0,1,1] - y*T0[1,0,1]*T2[0,1,0] + y*T0[1,1,0]*T2[0,0,1] + y*T0[1,1,1]*T2[0,0,0] + z**2*T3[0,0,0]*T3[1,1,1] + z**2*T3[0,0,1]*T3[1,1,0] - z**2*T3[0,1,0]*T3[1,0,1] - z**2*T3[0,1,1]*T3[1,0,0] + z*T0[0,0,0]*T3[1,1,1] + z*T0[0,0,1]*T3[1,1,0] - z*T0[0,1,0]*T3[1,0,1] - z*T0[0,1,1]*T3[1,0,0] - z*T0[1,0,0]*T3[0,1,1] - z*T0[1,0,1]*T3[0,1,0] + z*T0[1,1,0]*T3[0,0,1] + z*T0[1,1,1]*T3[0,0,0] + T0[0,0,0]*T0[1,1,1] + T0[0,0,1]*T0[1,1,0] - T0[0,1,0]*T0[1,0,1] - T0[0,1,1]*T0[1,0,0])**2";

    var T_list = [T0,T1,T2,T3];
    var hdet_imp = hdet_sym;
    // substitute actual values into expression
    var ind_flat, elt_cur;
    for (let iT of [0,1,2,3]) {
        var Tcur = T_list[iT];
        for (let i of [0,1])  {
          for (let j of [0,1])  {
            for (let k of [0,1])  {
              ind_flat = i*4 + j*2 + k*1;  // index into vec(Tcur)
              elt_cur = Tcur[ind_flat];
              hdet_imp = hdet_imp.replaceAll(`T${iT}[${i},${j},${k}]`,
                                             elt_cur);
          }
        }
      }
    }
    // hdet_imp = combineFloats(hdet_imp);
    return hdet_imp;
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
    updateHdet();
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
