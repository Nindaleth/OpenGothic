#version 450
#extension GL_ARB_separate_shader_objects : enable
#extension GL_GOOGLE_include_directive : enable

#include "sky_common.glsl"

layout(std140, push_constant) uniform Push {
  vec2 viewportSize;
  };
layout(binding = 5) uniform sampler2D textureDayL0;
layout(binding = 6) uniform sampler2D textureDayL1;
layout(binding = 7) uniform sampler2D textureNightL0;
layout(binding = 8) uniform sampler2D textureNightL1;

layout(location = 0) out vec4 outColor;

const int sunTransmittanceSteps = 40;

vec3 sunTransmittance(vec3 pos, vec3 sunDir) {
  if(rayIntersect(pos, sunDir, RPlanet) > 0.0)
    return vec3(0.0);

  float atmoDist = rayIntersect(pos, sunDir, RAtmos);
  float t = 0.0;

  vec3 transmittance = vec3(1.0);
  for(int i=1; i<=sunTransmittanceSteps; ++i) {
    float t  = (float(i)/sunTransmittanceSteps)*atmoDist;
    float dt = atmoDist/sunTransmittanceSteps;

    vec3 newPos = pos + t*sunDir;

    const ScatteringValues sc = scatteringValues(newPos, 0);
    transmittance *= exp(-dt*sc.extinction);
    }
  return transmittance;
  }

void main() {
  vec2  uv          = vec2(gl_FragCoord.xy)/vec2(viewportSize);
  float sunCosTheta = 2.0*uv.x - 1.0;
  float sunTheta    = safeacos(sunCosTheta);
  float height      = mix(RPlanet, RAtmos, uv.y);

  vec3  pos         = vec3(0.0, height, 0.0);
  vec3  sunDir      = normalize(vec3(0.0, sunCosTheta, -sin(sunTheta)));

  outColor          = vec4(sunTransmittance(pos, sunDir), 1.0);
  }
