import * as THREE from "three";

/**
 * Gök küresi için yıldız alanı oluşturur
 * @param {Object} options - Yapılandırma seçenekleri
 * @param {number} options.starCount - Oluşturulacak yıldız sayısı
 * @param {THREE.Texture} options.starSprite - Yıldız sprite texture'ı
 * @returns {THREE.Points} Yıldız partikül sistemi
 */
export default function createCelestialField({ starCount = 500, starSprite } = {}) {
  
  function generateRandomStarPosition() {
    const orbitRadius = Math.random() * 25 + 25;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    
    const xCoord = orbitRadius * Math.sin(phi) * Math.cos(theta);
    const yCoord = orbitRadius * Math.sin(phi) * Math.sin(theta);
    const zCoord = orbitRadius * Math.cos(phi);

    return {
      position: new THREE.Vector3(xCoord, yCoord, zCoord),
      colorHue: 0.6,
      minDistance: orbitRadius,
    };
  }
  
  const vertexPositions = [];
  const vertexColors = [];
  const starData = [];
  let colorInstance;
  
  for (let i = 0; i < starCount; i += 1) {
    const starInfo = generateRandomStarPosition();
    const { position, colorHue } = starInfo;
    starData.push(starInfo);
    
    colorInstance = new THREE.Color().setHSL(colorHue, 0.2, Math.random());
    vertexPositions.push(position.x, position.y, position.z);
    vertexColors.push(colorInstance.r, colorInstance.g, colorInstance.b);
  }
  
  const celestialGeometry = new THREE.BufferGeometry();
  celestialGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertexPositions, 3));
  celestialGeometry.setAttribute("color", new THREE.Float32BufferAttribute(vertexColors, 3));
  
  const starMaterial = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    map: starSprite,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });
  
  const celestialPoints = new THREE.Points(celestialGeometry, starMaterial);
  return celestialPoints;
}

