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

function set_T0_canonical_form(evt) {
  var orbit = evt.target.value;
  var elem = document.getElementById("0-input");
  var T_0_str;
  switch(orbit) {
  case "D0":
    T_0_str = '0 0 0 0 0 0 0 0';
    break;
  case "D1":
    T_0_str = '1 0 0 0 0 0 0 0';
    break;
  case "D2":
    T_0_str = '1 0 0 0 0 0 1 0';
    break;
  case "D2'":
    T_0_str = '1 0 0 1 0 0 0 0';
    break;
  case "D2''":
    T_0_str = '1 0 0 0 0 1 0 0';
    break;
  case "D3":
    T_0_str = '1 0 0 1 0 1 0 0';
    break;
  case "G2":
    T_0_str = '1 0 0 0 0 0 0 1';
    break;
  case "G3":
    T_0_str = '1  0  0 -1  0  1  1  0';
    break;
  }
  elem.value = T_0_str;
}

function make_2D() {
  // make figure 2-D by setting T_3 = 0
  var elem = document.getElementById("3-input");
  elem.value = '0 0 0 0 0 0 0 0';
}

function figure_intro() {
  // recreates figure from paper intro
  var elem0 = document.getElementById("0-input");
  var elem1 = document.getElementById("1-input");
  var elem2 = document.getElementById("2-input");
  var elem3 = document.getElementById("3-input");
  elem0.value = '1 0 0 0 0 0 0 0';
  elem1.value = '0.3699028755376688 -0.13651929714511593 -0.13428336299326263 -0.4164630995001069 -0.42251782586814784 -0.35589386597178996 0.40482889560788954 0.4289436065756837';
  elem2.value = '0.4171376109583411 0.44458689728695816 -0.49507831724265566 0.3359199686967843 0.3153632406702115 0.06588061340545816 -0.08565759635814817 0.39907704282394196';
  elem3.value = '0.3281608206596769 -0.48671831699289647 0.0071010082651613545 0.020328648313804598 0.6164958417086177 0.0665918315109178 0.47809222455005307 -0.20464190036184568';
}

function figure_generic() {
  // recreates figure where T_0 generic
  var elem0 = document.getElementById("0-input");
  var elem1 = document.getElementById("1-input");
  var elem2 = document.getElementById("2-input");
  var elem3 = document.getElementById("3-input");
  elem0.value = '-0.839535091854257 -0.5433054661470507 -0.5433054661470504 0.8395350918542572 0.5433054661470504 -0.8395350918542571 -0.8395350918542571 -0.5433054661470507';
  elem1.value = '-0.012636260355930733 0.12923198614003284 0.6319369360463848 0.4223663907599999 0.4281812032832786 -0.15600096418106202 -0.15469508052666012 -0.41688817192325167';
  elem2.value = '-0.6458259791658184 -0.07050004357451671 0.5446141861484196 -0.35402942475999083 -0.20731901178845313 0.2021309767730084 0.25612938685333797 0.08097367418173082';
  elem3.value = '0.3254702483156671 -0.34168998448164734 0.3785966252838605 -0.008573022371909732 -0.6243973927694577 -0.2192076466028776 -0.43949033349690314 0.05321955386570221';
}

function figure_D2pp() {
  // recreates figure where T_0 in D_2''
  var elem0 = document.getElementById("0-input");
  var elem1 = document.getElementById("1-input");
  var elem2 = document.getElementById("2-input");
  var elem3 = document.getElementById("3-input");
  elem0.value = '0.056908699213785524 0.21309015453278546 0.07278201402080303 0.2725265351196668 -0.6738453793644295 0.5150537826459695 -0.8617983634543327 0.6587156647032593';
  elem1.value = '-0.330898964100377 -0.018785591096061333 0.204760407805931 -0.368838887659383 0.4449366170009567 -0.5579880674652773 0.3843895461557516 -0.23475397269075435';
  elem2.value = '0.5517060557304161 -0.166075369983456 -0.5336229733675131 -0.5679451795095194 0.08164504945367355 -0.11072501349920291 -0.14007936184630757 -0.14891616632051533';
  elem3.value = '0.18172043428552312 0.19870686447432048 -0.015431320939850562 -0.06515243251665752 -0.04677897663990812 0.5285822134009392 0.7233843042350077 -0.34371211798858603';
}

function updateHdet() {
    // force y-up (otherwise can be finicky)
    document.getElementById("checkbox-yup").checked = true;
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
