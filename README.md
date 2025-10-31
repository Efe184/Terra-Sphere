# 🌌 Terra Sphere 3D - İnteraktif Gezegen Görselleştirme

Three.js ve WebGL shader teknolojileri kullanılarak geliştirilmiş, tam interaktif 3D gezegen görselleştirme projesi. Modern web teknolojileri ile offline çalışabilir yapıda kurulmuştur.

🚀 **[Canlı Demo'yu İncele](https://terra-sphere-gamma.vercel.app/)**

> Geliştirici: **Ahmet Efe Şıltak**

## ✨ Özellikler

- 🪐 **İnteraktif 3D Sphere**: Mouse kontrolü ile 360° döndürülebilir gezegen modeli
- ⭐ **Celestial Field**: Procedural olarak oluşturulan dinamik yıldız sistemi
- 🎨 **Custom Shader System**: WebGL vertex ve fragment shader'ları ile gerçekçi görselleştirme
- 🖱️ **Surface Interaction**: Fareyle gezegen yüzeyinde rainbow efekti oluşturma
- 🎯 **Raycasting**: Hassas yüzey tespiti ve UV mapping
- 📱 **Fully Responsive**: Tüm ekran boyutlarına optimize edilmiş tasarım
- 🚀 **Vite Powered**: Lightning-fast HMR ve optimized build
- 📦 **Offline Ready**: CDN bağımlılığı olmadan npm paketleri ile çalışır

## 🛠️ Teknoloji Stack

- **Vite** (v7.1.7) - Next-gen build tool
- **Three.js** (v0.180.0) - 3D graphics library
- **Terser** - Production minification
- **WebGL Shaders** - Custom vertex & fragment shaders
- **ES Modules** - Modern JavaScript module system
- **TypeScript Ready** - Type support hazır

## 🚀 Kurulum ve Başlatma

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn veya pnpm

### Adımlar

```bash
# Bağımlılıkları yükle
npm install

# Development server'ı başlat (http://localhost:5173)
npm run dev

# Production build oluştur
npm run build

# Build'i önizle
npm run preview
```

## 📁 Proje Mimarisi

```
terra-sphere-3d/
├── public/
│   └── assets/               # Texture ve görseller
│       ├── 00_earthmap1k.jpg    # Surface color map
│       ├── 01_earthbump1k.jpg   # Height/elevation map
│       ├── 02_earthspec1k.jpg   # Specular/ocean mask
│       ├── 03_earthlights1k.jpg # Night lights (opsiyonel)
│       ├── 04_rainbow1k.jpg     # Interactive effect texture
│       └── circle.png           # Star particle sprite
├── src/
│   ├── app.js                # Ana uygulama ve scene setup
│   ├── celestialField.js     # Yıldız alanı generator modülü
│   └── styles.css            # Global stil tanımlamaları
├── index.html                # Entry point
├── package.json              # Dependencies ve scripts
└── README.md                 # Bu dosya
```

## 🎮 Kullanım Kılavuzu

### Kontroller
- **Sol Klik + Sürükle**: Gezegeni döndür
- **Mouse Tekerleği**: Yakınlaştır / Uzaklaştır
- **Sağ Klik + Sürükle**: Kamerayı pan yap
- **Fare Hareketi**: Yüzey üzerinde rainbow efekti oluştur

### Performans
- Otomatik pixel ratio ayarlaması
- Anti-aliasing aktif
- Orbit controls damping ile smooth hareket

## 🎨 Özelleştirme Rehberi

### Dönüş Hızını Ayarlama
`src/app.js` dosyasında:
```javascript
sphereContainer.rotation.y += 0.002; // Değeri artırın/azaltın
```

### Yıldız Sayısını Değiştirme
`src/app.js` dosyasında:
```javascript
const celestialParticles = createCelestialField({ 
  starCount: 4500,  // İstediğiniz değer
  starSprite: particleSprite 
});
```

### Partikül Boyutu
`src/app.js` dosyasında:
```javascript
const shaderUniforms = {
  particleSize: { type: "f", value: 4.0 }, // Boyutu ayarlayın
  // ...
};
```

### İnteraksiyon Threshold'u
`src/app.js` dosyasında shader içinde:
```javascript
float threshold = 0.04; // Bu değeri değiştirin (0.01 - 0.1 arası)
```

### Shader Customization
Vertex ve Fragment shader'ları `src/app.js` içinde bulabilirsiniz:
- `terrainVertexShader`: Position, elevation, interaction logic
- `terrainFragmentShader`: Color mixing, visibility, alpha

## 🎯 Teknik Detaylar

### Shader Pipeline
1. **Vertex Shader**:
   - UV coordinates hesaplama
   - Height map'ten elevation okuma
   - Normal-based visibility check
   - Mouse proximity'ye göre displacement
   
2. **Fragment Shader**:
   - Multi-texture blending
   - Dynamic color mixing
   - Proximity-based effect application
   - Alpha masking (ocean areas)

### Geometry
- IcosahedronGeometry (1 radius, detail level: 16-120)
- Buffer attribute optimization
- UV mapping support

### Lighting
- HemisphereLight (sky + ground color)
- Ambient lighting setup

## 🐛 Troubleshooting

### Siyah ekran görünüyorsa:
- Console'da hata kontrolü yapın
- Texture yollarının doğru olduğundan emin olun
- WebGL desteğini kontrol edin

### Performans sorunları:
- `particleDetail` değerini düşürün (120 → 60)
- `starCount` değerini azaltın
- Anti-aliasing'i kapatın

### Canvas görünmüyorsa:
- `index.html`'de canvas ID'sinin `terra-canvas` olduğundan emin olun
- CSS'de display ve sizing ayarlarını kontrol edin

## 📝 Lisans

Bu proje MIT lisansı altında açık kaynaklıdır.

## 🙏 Teşekkürler

- **Three.js Team** - Muhteşem 3D library için
- **NASA** - Yüksek kaliteli dünya texture'ları için
- **WebGL Community** - Shader örnekleri ve dokümantasyon için

## 🔗 İlgili Kaynaklar

- [Three.js Documentation](https://threejs.org/docs/)
- [WebGL Fundamentals](https://webglfundamentals.org/)
- [Shader Tutorial](https://thebookofshaders.com/)

---

**Geliştirici**: Ahmet Efe Şıltak  
**Versiyon**: 1.0.0  
**Son Güncelleme**: 2025  
**Live Demo**: [https://terra-sphere-gamma.vercel.app/](https://terra-sphere-gamma.vercel.app/)

---

*Made with ❤️ using Three.js and WebGL*
