#ifdef GL_ES
    precision mediump float;
#endif

varying vec2 vUV;

uniform sampler2D textureSampler;
uniform sampler2D passSampler;
uniform sampler2D maskSampler;

uniform vec3 outlineColor;
uniform float outlineWidth;

void main(void)
{
	vec4 mask = texture2D(maskSampler, vUV);
	vec4 orig = texture2D(passSampler, vUV);
	vec4 blur = texture2D(textureSampler, vUV);

    // Calculate the outline
	float outline = clamp((blur.r - mask.r) * outlineWidth, 0.0, 1.0);
	vec3 final = orig.rgb * (1.0 - outline) + (outlineColor.xyz * outline);

	gl_FragColor.rgb = final;
	gl_FragColor.a = orig.a;
}
