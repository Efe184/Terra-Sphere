import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import createCelestialField from "./celestialField.js";
import './styles.css';

// Sahne oluşturma
const appScene = new THREE.Scene();
const mainCamera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
mainCamera.position.set(0, 0, 4);

// Renderer kurulumu
const webglRenderer = new THREE.WebGLRenderer({ 
  antialias: true,
  canvas: document.getElementById('terra-canvas')
});
webglRenderer.setSize(innerWidth, innerHeight);
webglRenderer.setPixelRatio(window.devicePixelRatio);

// Orbit kontrolü
const sphereControl = new OrbitControls(mainCamera, webglRenderer.domElement);
sphereControl.enableDamping = true;
sphereControl.dampingFactor = 0.05;

// Raycaster ve mouse pozisyonu
const rayIntersector = new THREE.Raycaster();
const cursorPosition = new THREE.Vector2();
const surfaceUV = new THREE.Vector2();

// Texture yükleyici
const assetLoader = new THREE.TextureLoader();
const particleSprite = assetLoader.load("/assets/circle.png");
const effectTexture = assetLoader.load("/assets/04_rainbow1k.jpg");
const surfaceColorMap = assetLoader.load("/assets/00_earthmap1k.jpg");
const heightMapTexture = assetLoader.load("/assets/01_earthbump1k.jpg");
const specularMapTexture = assetLoader.load("/assets/02_earthspec1k.jpg");

// Ana gezegen grubu
const sphereContainer = new THREE.Group();
appScene.add(sphereContainer);

// Wireframe sphere (scaffold)
const sphereGeometry = new THREE.IcosahedronGeometry(1, 16);
const wireframeMaterial = new THREE.MeshBasicMaterial({ 
  color: 0x00aaff,
  wireframe: true,
  transparent: true,
  opacity: 0.12
});
const scaffoldSphere = new THREE.Mesh(sphereGeometry, wireframeMaterial);
sphereContainer.add(scaffoldSphere);

// Partikül sistemi
const particleDetail = 120;
const particleGeometry = new THREE.IcosahedronGeometry(1, particleDetail);

// Vertex Shader
const terrainVertexShader = `
  uniform float particleSize;
  uniform sampler2D heightMap;
  uniform vec2 interactionUV;

  varying vec2 vTexCoord;
  varying float vVisibility;
  varying float vProximity;

  void main() {
    vTexCoord = uv;
    vec4 modelViewPos = modelViewMatrix * vec4( position, 1.0 );
    float elevation = texture2D(heightMap, vTexCoord).r;
    vec3 transformedNormal = normalMatrix * normal;
    vVisibility = step(0.0, dot( -normalize(modelViewPos.xyz), normalize(transformedNormal)));
    modelViewPos.z += 0.35 * elevation;

    float proximity = distance(interactionUV, vTexCoord);
    float zOffset = 0.0;
    float threshold = 0.04;
    if (proximity < threshold) {
      zOffset = (threshold - proximity) * 10.0;
    }
    vProximity = proximity;
    modelViewPos.z += zOffset;

    gl_PointSize = particleSize;
    gl_Position = projectionMatrix * modelViewPos;
  }
`;

// Fragment Shader
const terrainFragmentShader = `
  uniform sampler2D surfaceColor;
  uniform sampler2D oceanMask;
  uniform sampler2D effectColor;

  varying vec2 vTexCoord;
  varying float vVisibility;
  varying float vProximity;

  void main() {
    if (floor(vVisibility + 0.1) == 0.0) discard;
    float alpha = 1.0 - texture2D(oceanMask, vTexCoord).r;
    vec3 baseColor = texture2D(surfaceColor, vTexCoord).rgb;
    vec3 highlightColor = texture2D(effectColor, vTexCoord).rgb;
    float threshold = 0.04;
    if (vProximity < threshold) {
      baseColor = mix(baseColor, highlightColor, (threshold - vProximity) * 50.0);
    }
    gl_FragColor = vec4(baseColor, alpha);
  }
`;

// Shader uniformları
const shaderUniforms = {
  particleSize: { type: "f", value: 4.0 },
  surfaceColor: { type: "t", value: surfaceColorMap },
  effectColor: { type: "t", value: effectTexture },
  heightMap: { type: "t", value: heightMapTexture },
  oceanMask: { type: "t", value: specularMapTexture },
  interactionUV: { type: "v2", value: new THREE.Vector2(0.0, 0.0) },
};

const terrainMaterial = new THREE.ShaderMaterial({
  uniforms: shaderUniforms,
  vertexShader: terrainVertexShader,
  fragmentShader: terrainFragmentShader,
  transparent: true
});

const particleSystem = new THREE.Points(particleGeometry, terrainMaterial);
sphereContainer.add(particleSystem);

// Işıklandırma
const ambientLight = new THREE.HemisphereLight(0xffffff, 0x0a0a28, 3);
appScene.add(ambientLight);

// Yıldız alanı
const celestialParticles = createCelestialField({ 
  starCount: 4500, 
  starSprite: particleSprite 
});
appScene.add(celestialParticles);

// Raycasting işlemi
function checkSurfaceInteraction() {
  rayIntersector.setFromCamera(cursorPosition, mainCamera);
  const intersections = rayIntersector.intersectObjects([scaffoldSphere], false);
  if (intersections.length > 0) {
    surfaceUV.copy(intersections[0].uv);
  }
  shaderUniforms.interactionUV.value = surfaceUV;
}

// Animasyon döngüsü
function renderLoop() {
  webglRenderer.render(appScene, mainCamera);
  sphereContainer.rotation.y += 0.002;
  checkSurfaceInteraction();
  requestAnimationFrame(renderLoop);
  sphereControl.update();
}
renderLoop();

// Event listeners
window.addEventListener('mousemove', (event) => {
  cursorPosition.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
});

window.addEventListener('resize', function () {
  mainCamera.aspect = window.innerWidth / window.innerHeight;
  mainCamera.updateProjectionMatrix();
  webglRenderer.setSize(window.innerWidth, window.innerHeight);
}, false);

