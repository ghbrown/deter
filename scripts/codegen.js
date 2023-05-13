// Generate source code from postfix notations produced by parser.js

"use strict";

let CodeGenerator = {
    /* Supported programming languages
        @fun: function definition
        @defs: how to define an expression
        @inherit: inherit math function definitions from these languages if not specified
        @extensions: additional required functions/definitions, don't inherit
    */
    langsOrder: ['glsl', 'glslc', 'cppf', 'cppd'],
    langs: {}
};

// scalar-valued GLSL
CodeGenerator.langs.glsl = {
    fun: "float {%funname%}(float x, float y, float z) {\n\
{%funbody%}\n\
    return {%val%};\n\
}",
    prefixes: ['v'],
    defs: [
        "    float {%varname%} = {%expr%};"
    ],
    inherit: [],
    extensions: [
        {
            name: 'erf',
            source: "float mf_erf(float x) {\n\
    float t = 1.0/(1.0+0.3275911*abs(x));\n\
    float k = t*(0.254829592+t*(-0.284496736+t*(1.421413741+t*(-1.453152027+t*1.061405429))));\n\
    return sign(x)*(1.0-k*exp(-x*x));\n\
}"
        },
        {
            name: 'erfc',
            source: "float mf_erfc(float x) {\n\
    if (x <= 1.0) return 1.0-mf_erf(x);\n\
    float v = exp(-1.00382243*x*x+0.13228106*x+0.63881364-1.83299332*log(x+1.41509185));\n\
    if (x >= 2.0) return v;\n\
    return mix(1.0-mf_erf(x),v,smoothstep(1.0,2.0,x));\n\
}"
        },
        {
            name: 'erfinv',
            source: "float mf_erfinv(float x) {\n\
    float u = log(1.0-x*x);\n\
    float c = 0.5*u+4.3307;\n\
    return sign(x)*sqrt(sqrt(c*c-u/0.147)-c);\n\
}"
        },
        {
            name: 'mf_lgamma_1',
            source: "float mf_lgamma_1(float x) {\n\
    return (x-0.48925102)*log(x)-x+0.05778111/x+0.97482605-0.06191856*log(log(x+1.0)+1.0);\n\
}"
        },
        {
            name: 'gamma',
            source: "float mf_gamma(float x) {\n\
    const float pi = 3.14159265358979;\n\
    if (x >= 1.0) return exp(mf_lgamma_1(x));\n\
    if (x < 0.0) return pi/sin(pi*x)*exp(-mf_lgamma_1(1.0-x));\n\
    float s = min(1.0-x, 1.0);\n\
    s = s*s*s*(10.0-s*(15.0-6.0*s));\n\
    return exp(mix(mf_lgamma_1(x), log(pi/sin(pi*x))-mf_lgamma_1(1.0-x), s));\n\
}"
        },
        {
            name: 'loggamma',
            source: "float mf_loggamma(float x) {\n\
    const float pi = 3.14159265358979;\n\
    if (x >= 1.0) return mf_lgamma_1(x);\n\
    if (x < 0.0) return log(pi/abs(sin(pi*x)))-mf_lgamma_1(1.0-x);\n\
    float s = min(1.0-x, 1.0);\n\
    s = s*s*s*(10.0-s*(15.0-6.0*s));\n\
    return mix(mf_lgamma_1(x), log(pi/abs(sin(pi*x)))-mf_lgamma_1(1.0-x), s);\n\
}"
        },
        {
            name: 'beta',
            source: "float mf_beta(float x, float y) {\n\
    const float pi = 3.14159265358979;\n\
    if (x == round(x) && x <= 0.0) x += min(1e-6*(abs(x)+1.0), 1e-2);\n\
    if (y == round(y) && y <= 0.0) y += min(1e-6*(abs(y)+1.0), 1e-2);\n\
    float c = mf_loggamma(x)+mf_loggamma(y)-mf_loggamma(x+y);\n\
    float s = sign(sin(pi*min(x,0.5)))*sign(sin(pi*min(y,0.5)))*sign(sin(pi*min(x+y,0.5)));\n\
    return s*exp(c);\n\
}"
        },
        {
            name: 'permutation',
            source: "float mf_permutation(float x, float y) {\n\
    const float pi = 3.14159265358979;\n\
    if (x == round(x)) x += min(1e-6*(abs(x)+1.0), 1e-2);\n\
    if (y == round(y)) y -= min(1e-6*(abs(y)+1.0), 1e-2);\n\
    float c = mf_loggamma(x+1.0)-mf_loggamma(x-y+1.0);\n\
    float s = sign(sin(pi*min(x+1.0,0.5)))*sign(sin(pi*min(x-y+1.0,0.5)));\n\
    return s*exp(c);\n\
}"
        }
    ],
};

// complex-valued GLSL
CodeGenerator.langs.glslc = {
    fun: "vec2 {%funname%}(vec2 z) {\n\
{%funbody%}\n\
    return {%val%};\n\
}",
    prefixes: ['v'],
    defs: [
        "    vec2 {%varname%} = {%expr%};"
    ],
    inherit: [],
    extensions: [
        {
            name: 'mc_gamma',
            source: ""
        },
        {
            name: 'mc_lgamma',
            source: ""
        },
        {
            name: 'mc_zeta',
            source: ""
        },
        {
            name: 'mc_lzeta',
            source: ""
        }
    ],
};

// scalar-valued C++, float
CodeGenerator.langs.cppf = {
    fun: "float {%funname%}(float x, float y, float z) {\n\
{%funbody%}\n\
    return {%val%};\n\
}",
    prefixes: ['v'],
    defs: [
        "    float {%varname%} = {%expr%};"
    ],
    inherit: ['glsl'],
    extensions: [
        {
            name: 'iTime',
            source: "float iTime = 0.0f;"
        },
        {
            name: 'erfinv',
            source: "float erfinv(float x) {\n\
    float u = log(1.0f-x*x);\n\
    float c = 0.5f*u+4.3307f;\n\
    return (x>0.0f?1.0f:-1.0f)*sqrt(sqrt(c*c-u/0.147f)-c);\n\
}"
        }
    ],
};

// scalar-valued C++, double
CodeGenerator.langs.cppd = {
    fun: "double {%funname%}(double x, double y, double z) {\n\
{%funbody%}\n\
    return {%val%};\n\
}",
    prefixes: ['v'],
    defs: [
        "    double {%varname%} = {%expr%};"
    ],
    inherit: ['glsl', 'cppf'],
    extensions: [
        {
            name: 'iTime',
            source: "double iTime = 0.0;"
        },
        {
            name: 'erfinv',
            source: "double erfinv(double x) {\n\
    float u = log(1.0-x*x);\n\
    float c = 0.5*u+4.3307;\n\
    return (x>0.?1.:-1.)*sqrt(sqrt(c*c-u/0.147)-c);\n\
}"
        }
    ],
};


CodeGenerator.initFunctionGradients = function () {
    for (var name in MathFunctions) {
        for (var nparam in MathFunctions[name]) {
            var fun = MathFunctions[name][nparam];
            fun.grad = null;
            if (!fun.langs.hasOwnProperty("D"))
                continue;
            var parsed = MathParser.exprToPostfix(fun.langs.D, MathFunctions);
            for (var i = 0; i < parsed.length; i++)
                if (parsed[i].type == 'variable')
                    parsed[i].str = parsed[i].str.replace("_", "@");
            // console.log(name, nparam, parsed);
            fun.grad = parsed;
        }
    }
}


// Convert a postfix math expression to LaTeX code
CodeGenerator.postfixToLatex = function (queue) {
    const operators = {
        '-': 1, '+': 1,
        '*': 2, '/': 2,
        '^': 3
    };
    function varnameToLatex(varname) {
        if (varname.length >= 2 && varname[1] != "_")
            varname = varname[0] + "_" + varname.substring(1, varname.length);
        if (/_/.test(varname)) {
            var j = varname.search('_');
            varname = varname.substring(0, j + 1) + "{" + varname.substring(j + 1, varname.length) + "}";
        }
        for (var i = 0; i < MathParser.greekLetters.length; i++) {
            var gl = MathParser.greekLetters[i];
            varname = varname.replaceAll(gl[1], "\\" + gl[0] + " ");
            varname = varname.replaceAll('\\phi', '\\varphi');
        }
        varname = varname.replace(" }", "}").replace(" _", "_");
        return varname.trim();
    }
    var stack = [];
    for (var i = 0; i < queue.length; i++) {
        var token = queue[i];
        // number
        if (token.type == 'number') {
            var s = token.str.replace(/\.0*$/, "");
            if (s == "" || s[0] == ".") s = "0" + s;
            stack.push(new EvalLatexObject([token], s, Infinity));
        }
        // variable
        else if (token.type == "variable") {
            var s = varnameToLatex(token.str);
            if (s == "e") s = "\\operatorname{e}";
            if (s == "π") s = "\\pi";
            stack.push(new EvalLatexObject([token], s, Infinity));
        }
        // operators
        else if (token.type == "operator") {
            var precedence = operators[token.str];
            var v1 = stack[stack.length - 2];
            var v2 = stack[stack.length - 1];
            stack.pop(); stack.pop();
            var tex1 = v1.latex, tex2 = v2.latex;
            if (token.str != "/") {
                if (precedence > v1.precedence)
                    tex1 = "\\left(" + tex1 + "\\right)";
                if (precedence >= v2.precedence)
                    tex2 = "\\left(" + tex2 + "\\right)";
            }
            var latex = "";
            if (token.str == "-") {
                if (v1.latex == "0") latex = "-" + tex2;
                else latex = tex1 + "-" + tex2;
            }
            else if (token.str == "+") {
                latex = tex1 + "+" + tex2;
            }
            else if (token.str == "*") {
                if (/^[\{\s]*[\d\.]/.test(tex2))
                    latex = "{" + tex1 + "}\\cdot{" + tex2 + "}";
                else latex = "{" + tex1 + "}{" + tex2 + "}";
            }
            else if (token.str == "/") {
                latex = "\\frac{" + tex1 + "}{" + tex2 + "}";
            }
            else if (token.str == "^") {
                latex = "{" + tex1 + "}^{" + tex2 + "}";
                if (token.str == "^" && tex1 == "\\operatorname{e}" && false)
                    latex = MathFunctions['exp']['1'].subLatex([v2]);
            }
            else throw new Error("Unrecognized operator" + token.str);
            var obj = new EvalLatexObject(
                v1.postfix.concat(v2.postfix).concat([token]),
                latex, precedence);
            stack.push(obj);
        }
        // function
        else if (token.type == 'function') {
            var numArgs = token.numArgs;
            var args = [];
            for (var j = numArgs; j > 0; j--)
                args.push(stack[stack.length - j]);
            for (var j = 0; j < numArgs; j++)
                stack.pop();
            var fun = MathFunctions[token.str];
            if (fun != undefined) {
                if (fun['' + numArgs] == undefined) fun = fun['0'];
                else fun = fun['' + numArgs];
                if (fun == undefined) throw new Error(
                    "Incorrect number of function arguments for function `" + token.str + "`");
                stack.push(new EvalLatexObject(
                    args.concat([token]), fun.subLatex(args), Infinity));
            }
            else {
                var argsLatex = [];
                for (var j = 0; j < numArgs; j++) argsLatex.push(args[j].latex);
                stack.push(new EvalLatexObject(
                    args.concat([token]),
                    varnameToLatex(token.str) + "\\left(" + argsLatex.join(',') + "\\right)",
                    Infinity
                ));
            }
        }
        else {
            throw new Error("Unrecognized token `" + equ[i] + "`");
        }
    }
    if (stack.length != 1)
        throw new Error("Result stack length is not 1");
    return stack[0].latex;
}


// Convert a single postfix math expression to source code, used by `postfixToSource`
CodeGenerator._postfixToSource = function (queues, funname, lang, extensionMap) {
    let langpack = this.langs[lang];

    let requireGrad = {
        'x': true,
        'y': true,
        'z': true
    };

    // handle repeated evaluations
    var subtreesLength = 0;
    var subtrees = {};
    var intermediates = [];
    function addSubtree(evalobj, evalobjAlt = null) {
        let postfix = evalobj.postfix, postfixAlt = null;
        var key = [], keyAlt = [];
        for (var i = 0; i < postfix.length; i++)
            key.push(postfix[i].str);
        key = key.join(',');
        if (evalobjAlt != null) {
            postfixAlt = evalobjAlt.postfix;
            for (var i = 0; i < postfixAlt.length; i++)
                keyAlt.push(postfixAlt[i].str);
            keyAlt = keyAlt.join(',');
        }
        if (!subtrees.hasOwnProperty(key) &&
            (evalobjAlt == null || !subtrees.hasOwnProperty(keyAlt))
        ) {
            if (evalobj.code[0] == langpack.prefixes[0]
                && /\d+/.test(evalobj.code.slice(1))) {
                    if (Number(evalobj.code.slice(1)) < intermediates.length)
                        return '$' + evalobj.code.slice(1);
                }
            var id = '$' + subtreesLength;
            subtrees[key] = {
                id: id,
                length: postfix.length,
                postfix: postfix,
            };
            intermediates.push({
                id: id,
                obj: { ...evalobj }
            });
            subtreesLength += 1;
        }
        return subtrees.hasOwnProperty(key) ?
            subtrees[key].id : subtrees[keyAlt].id;
    }

    function addToken(stack, token, gradOrders = [], args = null) {
        let constexpr = MathFunctions['CONST'][1].langs[lang];
        var obj = null, fun = null;
        var funArgs = [];
        // ??
        if (token.type == "variable" && /@/.test(token.str)) {
            throw new Error();
        }
        // number
        else if (token.type == 'number') {
            var s = token.str;
            if (!/\./.test(s)) s += '.';
            obj = new EvalObject([token],
                constexpr.replaceAll("%1", s),
                true, new Interval(Number(s), Number(s)), true);
            // grad
            for (var vi = 0; vi < gradOrders.length; vi++) {
                var gradname = gradOrders.slice(0, vi + 1).join(',');
                obj.grad[gradname] = new EvalObject(
                    [new Token("number", '0.0')],
                    constexpr.replaceAll("%1", "0"),
                    true, new Interval(0, 0), true);
            }
            stack.push(obj);
            return;
        }
        // variable
        else if (token.type == "variable") {
            var s = token.str;
            var isNumeric = false;
            var interval = new Interval();
            if (MathParser.isIndependentVariable(s)) {
                s = MathParser.IndependentVariables[s];
            }
            else if (s == "e") {
                s = constexpr.replaceAll("%1", Math.E);
                isNumeric = true;
                interval.x0 = interval.x1 = Math.E;
            }
            else if (s == "π") {
                s = constexpr.replaceAll("%1", Math.PI);
                isNumeric = true;
                interval.x0 = interval.x1 = Math.PI;
            }
            else {
                throw "Undeclared variable " + s;
            }
            obj = new EvalObject(
                [token], s, isNumeric, interval, true);
            // grad
            var sofar = 2.0;
            for (var vi = 0; vi < gradOrders.length; vi++) {
                var gradname = gradOrders.slice(0, vi + 1).join(',');
                var v = gradOrders[vi];
                if (v == s) sofar = Math.max(sofar - 1.0, 0.0);
                else sofar = 0.0;
                obj.grad[gradname] = new EvalObject(
                    [new Token("number", sofar.toFixed(1))],
                    constexpr.replaceAll("%1", sofar.toFixed(1)),
                    true, new Interval(1, 1), true);
            }
            stack.push(obj);
            return;
        }
        // operators
        else if (token.type == "operator") {
            var objAlt = null;
            var v1 = stack[stack.length - 2];
            var v2 = stack[stack.length - 1];
            stack.pop(); stack.pop();
            funArgs = [v1, v2];
            // get object
            if (token.str == "^")
                obj = FunctionSubs.powEvalObjects(v1, v2, lang);
            else if (token.str == "+") {
                obj = FunctionSubs.addEvalObjects(v1, v2, lang);
                objAlt = FunctionSubs.addEvalObjects(v2, v1, lang);
            }
            else if (token.str == "-")
                obj = FunctionSubs.subEvalObjects(v1, v2, lang);
                else if (token.str == "*") {
                obj = FunctionSubs.mulEvalObjects(v1, v2, lang);
                objAlt = FunctionSubs.mulEvalObjects(v2, v1, lang);
            }
            else if (token.str == "/")
                obj = FunctionSubs.divEvalObjects(v1, v2, lang);
            // get gradient expression
            fun = MathFunctions[
                { '+': "ADD", '-': "SUB", '*': "MUL", '/': "DIV", '^': "pow" }[token.str]
            ][2];
            var id = addSubtree(obj, objAlt);
            // var idn = Number(id.slice(1));
            // console.log(intermediates[idn].obj, obj, objAlt);
            // obj = intermediates[idn].obj.code == obj.code ? obj :
            //     intermediates[idn].obj.code == objAlt.code ? objAlt :
            //     null;
            obj.postfix = [new Token('variable', id)];
            obj.code = langpack.prefixes[0] + id.slice(1);
            // addExpression(stack, obj, funArgs);
        }
        // function
        else if (token.type == 'function') {
            fun = MathFunctions[token.str];
            var numArgs = token.numArgs;
            for (var j = numArgs; j > 0; j--)
                funArgs.push(stack[stack.length - j]);
            for (var j = 0; j < numArgs; j++)
                stack.pop();
            if (fun['' + numArgs] == undefined) fun = fun['0'];
            else fun = fun['' + numArgs];
            if (fun == undefined) throw new Error(
                "Incorrect number of arguments for function `" + token.str + "`");
            if (fun.langs.hasOwnProperty(lang + 'Ext')) {
                let exts = fun.langs[lang + 'Ext'];
                for (var _ = 0; _ < exts.length; _++)
                    extensionMap[exts[_]].used = true;
            }
            obj = fun.subSource(funArgs, lang);
            var id = addSubtree(obj);
            obj.postfix = [new Token('variable', id)];
            obj.code = langpack.prefixes[0] + id.slice(1);
        }
        else {
            throw new Error("Unrecognized token `" + token + "`");
        }

        if (gradOrders.length == 0) {
            stack.push(obj);
            return;
        }

        // handle function gradient
        var diffs = [];
        // first time differentiate
        for (var vi = 0; vi <= gradOrders.length; vi++) {
            var gradname = gradOrders.slice(0, vi).join(',');
            var args1 = [];
            for (var i = 0; i < funArgs.length; i++) {
                args1.push(vi == 0 ? funArgs[i] : funArgs[i].grad[gradname]);
            }
            diffs.push(args1);
        }
        console.log(diffs.slice());
        var diffs1 = [];
        for (var vi = 0; vi + 1 < diffs.length; vi++) {
            var v = gradOrders[vi];
            var gradname = gradOrders.slice(0, vi + 1).join(',');
            var grad = fun.grad.slice();
            var stack1 = [];
            for (var i = 0; i < grad.length; i++) {
                if (grad[i].type == "variable" && /@/.test(grad[i].str)) {
                    var parts = grad[i].str.split('@');
                    var parami = Number(parts[1]) - 1;
                    stack1.push(diffs[vi + (parts[0] == 'g')][parami]);
                }
                else addToken(stack1, grad[i], [], args1);
            }
            if (stack1.length != 1)
                throw new Error("Result1 stack length is not 1");
            obj.grad[gradname] = stack1[0];
            diffs1.push(stack1[0]);
        }
        console.log(diffs1.slice());
        if (gradOrders.length > 0)
            console.log(token.str, obj.code);
        stack.push(obj);
        for (var ui = 0; ui < gradOrders.length; ui++) {
        }
    }

    // postfix evaluation
    var qmap = {};
    var isCompatible = true;
    for (var qi in queues) {
        var queue = queues[qi];
        var stack = [];  // EvalObject objects
        for (var i = 0; i < queue.length; i++) {
            // addToken(stack, queue[i], ['x', 'x'], null);
            addToken(stack, queue[i], [], null);
        }
        if (stack.length != 1)
            throw new Error("Result stack length is not 1");
        // console.log(stack[0]);
        qmap[qi] = stack[0].code;
        isCompatible = isCompatible && stack[0].isCompatible;
    }
    // console.log(subtrees);

    // get result
    var result = {
        code: '',
        isCompatible: isCompatible
    };
    var lines = [];
    for (var i = 0; i < intermediates.length; i++) {
        var varname = langpack.prefixes[0] + i;
        var v = langpack.defs[0]
            .replaceAll("{%varname%}", varname)
            .replaceAll("{%expr%}", intermediates[i].obj.code);
        lines.push(v);
    }
    result.code = langpack.fun
        .replaceAll("{%funname%}", funname)
        .replaceAll("{%funbody%}", lines.join('\n'));
    for (var qi in queues)
        result.code = result.code.replaceAll("{%" + qi + "%}", qmap[qi]);
    return result;
}

// Convert a postfix expressions to source code
CodeGenerator.postfixToSource = function (exprs, funnames, lang) {
    if (exprs.length != funnames.length)
        throw new Error("`exprs` and `funnames` have different lengths.");
    let langpack = this.langs[lang];
    if (langpack == undefined)
        throw new Error("Unsupported language `" + lang + "`");

    // extension counter
    var extensionMap = {};
    for (var i = 0; i < langpack.extensions.length; i++) {
        var ext = langpack.extensions[i];
        extensionMap[ext.name] = {
            index: i,
            source: ext.source,
            used: false
        };
    }

    // generate a function for each expression
    var functions = [], isCompatible = [];
    for (var i = 0; i < exprs.length; i++) {
        var r = this._postfixToSource(exprs[i], funnames[i], lang, extensionMap);
        functions.push(r.code);
        isCompatible.push(r.isCompatible);
    }

    // collect used extensions
    var exts = [];
    for (var key in extensionMap) {
        if (extensionMap[key].used)
            exts.push(extensionMap[key]);
    }
    exts.sort((a, b) => (a.index - b.index));
    for (var i = 0; i < exts.length; i++)
        exts[i] = exts[i].source;
    return {
        source: exts.concat(functions).join('\n\n').trim(),
        exts: exts,
        isCompatible: isCompatible,
    };
}

