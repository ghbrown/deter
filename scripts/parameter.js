// Refactored from script.js's

function initHelpMenu() {
    let container = document.getElementById("help-menu");
    const errorMsg = "<h2 style='color:orange;'>Failed to load help content.</h2>";
    var req = new XMLHttpRequest();
    req.open("GET", "help.md");  // md instead of html because easier to edit on vscode
    req.onload = function () {
        var html = req.status == 200 ?
            req.responseText : errorMsg;
        container.innerHTML += `<div id="help-menu-links">
            <a href="https://harry7557558.github.io/spirulae/" target="_blank">Home</a> ⋅
            <a href="https://spirulae.github.io/gallery/" target="_blank">Gallery</a> ⋅
            <a href="https://github.com/harry7557558/spirulae/" target="_blank">GitHub</a>
        </div>` + html;
    };
    req.onerror = function () {
        container.innerHTML += errorMsg;
    };
    req.send();
    document.addEventListener("keydown", function (event) {
        if (event.key == "Escape") {
            event.preventDefault();
            container.style.visibility = "hidden";
        }
    });
}

// Built-in functions

function initBuiltInFunctions(builtinFunctions) {
    let funSelect = document.querySelector("#builtin-functions");
    funSelect.innerHTML += "<option value=''>Load example...</option>";
    for (var i = 0; i < builtinFunctions.length; i++) {
        let fun = builtinFunctions[i];
        funSelect.innerHTML += "<option value=" + fun[1] + ">" + fun[0] + "</option>"
    }
}


// name: start with a lowercase letter
//  - b/c: checkbox (boolean)
//  - s: selector
function GraphingParameter(name, id, callback=null) {
    this.element = document.getElementById(id);
    this.name = name;
    this.getValue = function () {
        if (this.name[0] == "b" || this.name[0] == 'c')
            return this.element.checked;
        if (this.name[0] == "s")
            return this.element.value;
        if (this.name[0] == "r")
            return this.element.value;
    };
    this.setValue = function (value) {
        if (this.name[0] == "b" || this.name[0] == 'c')
            this.element.checked = value;
        if (this.name[0] == "s")
            this.element.value = value;
    };
    this.callback = callback;
}

// a slider that controls a shader uniform
// not saved on local storage
function UniformSlider(name, id, vmin, vmax, v0) {
    this.name = name;
    this.element = document.getElementById(id);
    this.v0 = v0, this.vmin = vmin, this.vmax = vmax;
    this.element.min = 0;
    this.element.max = 1000;
    this.getValue = function () {
        var t = this.element.value / 1000;
        return this.vmin + (this.vmax - this.vmin) * t;
    };
    this.setValue = function (value) {
        var t = (value - this.vmin) / (this.vmax - this.vmin);
        this.element.value = Math.round(1000 * t);
        state[slider.name] = value;
        state.renderNeeded = true;
    };
    var slider = this;
    slider.setValue(v0);
    state[slider.name] = v0;
    state.renderNeeded = true;
    this.element.addEventListener("input", function (event) {
        updateFunctionInput(false, false);
        state[slider.name] = slider.getValue();
        state.renderNeeded = true;
    });
    this.element.addEventListener("contextmenu", function (event) {
        event.preventDefault();
        slider.setValue(slider.v0);
        updateFunctionInput(false, false);
    });
}

// add one on click
function ClickableObject(name, id, period) {
    this.name = name;
    this.element = document.getElementById(id);
    this.period = period;
    this.count = 0;
    var clicker = this;
    this.getValue = function () {
        return clicker.count % period;
    };
    this.setValue = function(value) {
        if (isFinite(value))
            clicker.count = value % period;
        state[clicker.name] = clicker.count;
        state.renderNeeded = true;
    };
    this.element.addEventListener('pointerdown', function() {
        clicker.count = (clicker.count + 1) % period;
        state[clicker.name] = clicker.count;
        state.renderNeeded = true;
        updateFunctionInput(false, false);
    });
    state[clicker.name] = clicker.count;
    state.renderNeeded = true;
}

var RawParameters = [];
var RawUniformSliders = [];

// for saving in the local storage
function parameterToDict(parameters) {
    var dict = {};
    for (var i = 0; i < parameters.length; i++) {
        dict[parameters[i].name] = parameters[i].getValue();
    }
    return dict;
}
function setParameters(parameters, dict) {
    for (var i = 0; i < parameters.length; i++) {
        var name = parameters[i].name;
        if (dict.hasOwnProperty(name) && dict[name] !== "")
            parameters[i].setValue(dict[name]);
    }
}

// init input and parameters, returns parameters
function initParameters(parameters) {
    RawParameters = parameters;
    // set event listeners
    for (var i = 0; i < RawParameters.length; i++) {
        if (/^r/.test(RawParameters[i].name));
        else RawParameters[i].element.addEventListener("input", function (event) {
            updateFunctionInput(false);
        });
    }
    // get parameters and input from local storage
    try {
        var params = JSON.parse(localStorage.getItem(NAME + "params"));
        if (params != null) setParameters(RawParameters, params);
    }
    catch (e) { console.error(e); }
    let funSelect = document.getElementById("builtin-functions");
    let funInput = document.getElementById("equation-input");
    var initialExpr = "";
    try {  // check if input is a built-in function
        initialExpr = localStorage.getItem(NAME + "input");
        if (initialExpr == null) throw initialExpr;
        funSelect.childNodes[0].setAttribute("value", initialExpr);
        var selectId = 0;
        for (var i = 1; i < funSelect.childNodes.length; i++) {
            var value = funSelect.childNodes[i].value.replace(/\;/g, '\n');
            if (value == initialExpr.trim())
                selectId = i;
        }
        funSelect.childNodes[selectId].selected = true;
    }
    catch (e) {
        funSelect.childNodes[1].selected = true;
    }
    // event listeners
    let domObject = document.getElementById("canvas");
    if (domObject) domObject.addEventListener("webglcontextlost", function (event) {
        event.preventDefault();
        setTimeout(function () {  // comment input when WebGL context lost
            var input = funInput.value.split('\n');
            for (var i = 0; i < input.length; i++) {
                if (MathParser.testLine(input[i]).type == "main")
                    input[i] = '####' + input[i];
            }
            input = input.join('\n');
            localStorage.setItem(NAME + "input", input);
        }, 100);
    });
    domObject = document.getElementById("button-update");
    if (domObject) domObject.addEventListener("click",
        function (event) { updateFunctionInput(true); });
    funSelect.addEventListener("input", function (event) {
        // selecting a new function
        resetState();
        funInput.value = funSelect.value.replaceAll(";", "\n");
        updateFunctionInput(true);
    });
    funInput.addEventListener("input", function (event) {
        // typing
        funSelect.value = initialExpr;
        updateFunctionInput(false);
    });
    window.addEventListener("keydown", function (event) {
        // Ctrl/Alt + Enter update function
        if (event.key == "Enter" && (event.altKey || event.ctrlKey)) {
            event.preventDefault();
            updateFunctionInput(true);
        }
        // Ctrl + / hide control
        else if (event.key == "/" && event.ctrlKey) {
            let control = document.getElementById("control");
            let fps = document.getElementById("fps");
            if (control.style.display == "none")
                fps.style.display = control.style.display = "block";
            else fps.style.display = control.style.display = "none";
        }
    });
    funInput.value = funSelect.value.replaceAll(";", "\n");
}


// Error/warning messages
function messageError(msg) {
    let container = document.getElementById("error-message");
    container.style.display = "inline-block";
    container.style.backgroundColor = "rgba(255,255,0,1.0)";
    container.style.color = "red";
    container.innerHTML = msg;
}
function messageWarning(msg) {
    let container = document.getElementById("error-message");
    container.style.display = "inline-block";
    container.style.backgroundColor = "rgba(0,0,0,0.4)";
    container.style.color = "orange";
    container.innerHTML = msg;
}
function messageUpdate() {
    let container = document.getElementById("error-message");
    container.style.display = "inline-block";
    container.style.backgroundColor = "#00000000";
    container.style.color = "white";
    container.innerHTML = "Parameter(s) may have been changed. Click \"update\" to recompile shader.";
}
function messageNone(event) {
    if (event) event.preventDefault();
    let container = document.getElementById("error-message");
    container.style.display = "none";
    container.style.backgroundColor = "#00000000";
}
document.getElementById("error-message").addEventListener("click", messageNone);
document.getElementById("error-message").addEventListener("contextmenu", messageNone);


// Main

var UpdateFunctionInputConfig = {
    complexMode: false,
    implicitMode: true,  // add =0 to the end
    enableMain: true,  // requires a main equation
    warnNaN: true,
    useGL: true,
    jsFunName: null,
    callbackBefore: null,
    callbackAfter: null
};

var WarningStack = [];

function updateFunctionInput(forceRecompile = false, updateFunction = true) {
    let checkboxLatex = document.getElementById("checkbox-latex");
    let checkboxAutoCompile = document.getElementById("checkbox-auto-compile");
    let texContainer = document.getElementById("mathjax-preview");
    if (!checkboxLatex.checked) texContainer.innerHTML = "";
    var parameters = parameterToDict(RawParameters);
    for (var i = 0; i < RawParameters.length; i++)
        if (RawParameters[i].callback)
            RawParameters[i].callback(RawParameters[i].getValue());
    var expr = document.getElementById("equation-input").value;
    try {
        localStorage.setItem(NAME + "input", expr);
        localStorage.setItem(NAME + "params", JSON.stringify(parameters));
    } catch (e) { console.error(e); }
    if (!updateFunction) return;
    WarningStack = [];

    if (UpdateFunctionInputConfig.callbackBefore)
        UpdateFunctionInputConfig.callbackBefore();

    // parse input
    var parsed = null;
    try {
        try {
            parsed = MathParser.parseInput(expr);
        } catch (e) {
            texContainer.style.color = "red";
            throw e;
        }
        var errmsg = "";
        if (UpdateFunctionInputConfig.implicitMode && parsed.val.length == 0)
            errmsg = "No function to graph.";
        if (parsed.val.length > 1)
            errmsg = "Multiple main equations found.";
        parsed.val.push([]);
        parsed.val = parsed.val[0];
        if (UpdateFunctionInputConfig.complexMode) {
            var variables = MathParser.getVariables(parsed.val, false);
            if (variables.has('x') && variables.has('z'))
                errmsg = "Cannot have both x and z as the independent variable.";
        }
        var extraVariables = MathParser.getVariables(parsed.val, true);
        extraVariables.delete('e');
        extraVariables.delete('π');
        if (extraVariables.size != 0)
            errmsg = "Definition not found: " + Array.from(extraVariables);
        if (!UpdateFunctionInputConfig.implicitMode) {
            for (var i = 0; i < parsed.latex.length; i++)
                parsed.latex[i] = parsed.latex[i].replace(/=0$/, '');
        }
        if (errmsg != "") {
            messageError(errmsg);
            updateShaderFunction(null);
            if (checkboxLatex.checked)
                updateLatex(parsed.latex);
            return;
        }
        if (checkboxLatex.checked)
            updateLatex(parsed.latex);
    }
    catch (e) {
        console.error(e);
        messageError(e);
        updateShaderFunction(null);
        if (parsed != null && checkboxLatex.checked)
            updateLatex(parsed.latex, "red");
        return;
    }

    // compile shader
    if (!(checkboxAutoCompile.checked || forceRecompile === true)) {
        messageUpdate();
        return;
    }
    try {
        messageNone();
        console.log(expr.trim().replace(/\r?\n/g, ';').replace(/\s/g, "&#32;"));
        if (checkboxLatex.checked) {
            console.log(parsed.latex.join(' \\\\\n'));
            updateLatex(parsed.latex);
        }
        // shader function
        var expr = {};
        if (UpdateFunctionInputConfig.enableMain)
            expr.val = parsed.val;
        for (var varname in parsed)
            if (varname != 'val' && varname != 'latex')
                expr[varname] = parsed[varname];
        if (UpdateFunctionInputConfig.useGL) {
            result = CodeGenerator.postfixToSource(
                [expr], ["funRaw"],
                UpdateFunctionInputConfig.complexMode ? 'glslc' : 'glsl'
            );
            var code = result.source;
            console.log(code);
            code = "uniform float iTime;\n\n" + code;
            if (UpdateFunctionInputConfig.warnNaN && !result.isCompatible[0])
                console.warn("Graph may be incorrect due to undefined values.");
            if (result.exts.length != 0)
                console.warn("Function evaluation involves numerical approximation.");
            if (WarningStack.length != 0)
                messageWarning(WarningStack.join('\n'));
            try { updateShaderFunction(code, null, parameters); }
            catch(e) { console.error(e); messageError(e); }
        }
        // JS function
        if (UpdateFunctionInputConfig.jsFunName) {
            var funname = UpdateFunctionInputConfig.jsFunName;
            try {
                var result = CodeGenerator.postfixToSource([expr], [funname], 'js');
                eval('window.'+funname+'='+result.source);
            } catch(e) {
                eval('window.'+funname+'=null');
            }
            let display = document.getElementById("value-display");
            if (display) display.style.display = 'none';
            if (!UpdateFunctionInputConfig.useGL) {
                try { updateShaderFunction(result.source, null, parameters); }
                catch(e) { console.error(e); messageError(e); }
            }
        }
    } catch (e) {
        console.error(e);
        messageError(e);
        updateShaderFunction(null);
        if (checkboxLatex.checked)
            updateLatex(parsed.latex, "red");
    }

    if (UpdateFunctionInputConfig.callbackAfter)
        UpdateFunctionInputConfig.callbackAfter();
}


function initMain(preloadShaderSources) {
    // do this at the start
    initHelpMenu();

    MathParser.initGreekLetters();

    // https://stackoverflow.com/a/49248484
    function myCustomWarn(...args) {
        var messages = args.join('\n');
        if (WarningStack.indexOf(messages) == -1)
            WarningStack.push(messages);
        return console.oldWarn(...args);
    };
    console.oldWarn = console.warn;
    console.warn = myCustomWarn;

    // load shaders and init WebGL
    if (typeof window.state == 'undefined') {
        initMathjax();
        return;
    }
    if (UpdateFunctionInputConfig.useGL) {
        loadShaderSources(preloadShaderSources, function () {
            console.log("shaders loaded");
            try {
                state.name = NAME + "state";
                initWebGL();
                updateFunctionInput(true);
                initRenderer();
            } catch (e) {
                console.error(e);
                document.body.innerHTML = "<h1 style='color:red;'>" + e + "</h1>";
            }
        });
        initMathjax();
    }
    else {
        initMathjax();
        try {
            state.name = NAME + "state";
            initRenderer0();
            updateFunctionInput(true);
            initRenderer();
        } catch (e) {
            console.error(e);
            document.body.innerHTML = "<h1 style='color:red;'>" + e + "</h1>";
        }
    }

}