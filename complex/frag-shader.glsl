#version 300 es
precision highp float;

in vec2 vXy;
out vec4 fragColor;

uniform vec2 iResolution;
uniform vec2 xyMin;
uniform vec2 xyMax;

uniform float rBrightness;

#define ZERO 0.0
// #define ZETA_FAST
#include "../shaders/complex.glsl"

// function
{%FUN%}
#define fun(z) funRaw(z)

#line 22

// grid
float grid1(vec2 p, float w) {
    vec2 a = 1.0 - abs(1.0-2.0*fract(p));
    a = a / w - 1. - (step(abs(p),vec2(.5))-1.);
    a = clamp(a, 0., 1.);
    return ((a.x+1.)*(a.y+1.)-1.)/3.;
}
float grid(vec2 p) {
    float scale = 16.0/length(xyMax-xyMin);
    float ls = log(scale) / log(10.);
    float fs = pow(ls - floor(ls), 1.0);
    float es = pow(10., floor(ls));
    vec2 q0 = es*p;
    vec2 q1 = 10.*q0;
    vec2 q2 = 10.*q1;
    float w0 = (30./sqrt(iResolution.x*iResolution.y))*es/scale;
    float w1 = mix(1.,10.,fs)*w0;
    float g0 = grid1(q0, w0);
    float g1 = grid1(q1, w1);
    float g2 = grid1(q2, 5.*w1);
    return min(min(mix(0.75,1.0,g0), mix(mix(0.95,0.75,fs), 1.0, g1)), mix(mix(1.0,0.95,fs), 1.0, g2));
}

// HSL to RGB conversion
float hue2rgb(float p, float q, float t) {
    if (t < 0.) t += 1.;
    if (t > 1.) t -= 1.;
    if (t < 1./6.) return p + (q - p) * 6. * t;
    if (t < 1./2.) return q;
    if (t < 2./3.) return p + (q - p) * (2./3. - t) * 6.;
    return p;
}
vec3 hslToRgb(float h, float s, float l) {
    if (s == 0.) return vec3(l);
    // float q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
    float q = -0.05*log(exp(-20.*(l*(1.+s)))+exp(-20.*(l+s-l*s)));
    float p = 2. * l - q;
    return vec3(
        hue2rgb(p, q, h + 1./3.),
        hue2rgb(p, q, h),
        hue2rgb(p, q, h - 1./3.)
    );
}

void main(void) {
    vec2 uv = vXy;
    vec2 z = mix(xyMin, xyMax, 0.5+0.5*uv);

    vec3 tot_col = vec3(0.0);

    #ifdef NO_AA
    #define AA 1
    #else
    #define AA 2
    #endif

    for (int i = 0; i < AA; i++)
        for (int j = 0; j < AA; j++) {
            vec2 dz = ((vec2(i,j)+0.5)/float(AA)-0.5) * (xyMax-xyMin)/iResolution.xy;

    vec2 fz = fun(z+dz);

    float h = atan(fz.y, fz.x) * 0.15915494309189535;
    float s = 1.0;
#if {%CONTOUR_LINEAR%}
    s = min(s, 0.5 + 0.5 * pow(abs(sin(3.141592653569793 * length(fz))), 0.3));
#endif
#if {%CONTOUR_LOG%}
    s = min(s, 0.5 + 0.5 * pow(abs(sin(1.3643763538418412 * log(length(fz)))), 0.4));
#endif
    float k = 0.7+0.8*rBrightness;
    k = 2.5 * (k-1.0) + 1.0;  // comment this line when using the second l
    float bri = pow(rBrightness,k)/(pow(rBrightness,k)+pow(1.-rBrightness,k));
    float l = 1.0 - pow(1.0-bri, log(log(length(fz) + 1.0) + 1.05));
    // float l = 1.0 - pow(0.5, log(log(pow(length(fz)+1., bri/(1.0-bri))-1. + 1.0) + 1.05));
    vec3 col = hslToRgb(h, s, l);

    if (isnan(dot(col, vec3(1)))) col = vec3(1);

    tot_col += col;
    }
    vec3 col = tot_col/float(AA*AA);

#if {%GRID%}
    col = mix(vec3(0.35,0.3,0.25), col, 0.1+0.9*pow(grid(z), 2.));
#endif

    fragColor = vec4(clamp(col,0.,1.), 1.0);
}
