# Image Specifications Guide

## Logo Images

### Display Size
- **CSS Size**: `w-12 h-12` = **48px × 48px** (3rem × 3rem)
- **Container**: Square with padding and border

### Recommended Source Image Size
- **Optimal**: **256px × 256px** (for Retina/High-DPI displays)
- **Minimum**: **128px × 128px**
- **Maximum**: **512px × 512px** (to avoid unnecessarily large files)

### Format & Quality
- **Format**: PNG (with transparency) - **Recommended**
  - Best for logos with transparent backgrounds
  - Supports crisp edges and text
- **Alternative**: SVG (if available) - **Best quality**
  - Scalable, small file size
  - Perfect for simple logos
- **Fallback**: JPG (only if logo has background)
  - Use quality 85-90%

### File Size Target
- **PNG**: 20-50 KB per logo
- **SVG**: 5-20 KB per logo
- **JPG**: 10-30 KB per logo

### Technical Details
- **Aspect Ratio**: 1:1 (square)
- **Background**: Transparent (preferred) or white
- **Color Space**: sRGB
- **Resolution**: 72-144 DPI (web standard)

---

## Banner Images

### Display Size
- **Height**: Minimum **90px** (`minHeight: '90px'`)
- **Width**: Full width of container (responsive)
- **Container Max Width**: 1280px (`max-w-7xl`)
- **Aspect Ratio**: Approximately **8:1 to 10:1** (wide rectangle)

### Recommended Source Image Size
- **Optimal**: **1200px × 150px** (8:1 ratio)
  - Works well for standard desktop displays
  - Scales down nicely for mobile
- **Alternative Sizes**:
  - **728px × 90px** (Standard banner size, IAB standard)
  - **1600px × 200px** (For high-DPI displays)
  - **1920px × 240px** (Ultra-wide displays)

### Format & Quality
- **Format**: JPG - **Recommended**
  - Best for photos and complex graphics
  - Smaller file size than PNG
  - Quality: 80-85% (good balance)
- **Alternative**: PNG (if transparency needed)
  - Use for graphics with transparency
  - Higher file size, use sparingly
- **WebP**: **Best option** (if supported)
  - 25-35% smaller than JPG
  - Better quality at same file size

### File Size Target
- **JPG**: 50-150 KB per banner
- **PNG**: 100-300 KB per banner
- **WebP**: 30-100 KB per banner

### Technical Details
- **Aspect Ratio**: 8:1 to 10:1 (wide rectangle)
- **Background**: Solid color or gradient (no transparency needed for JPG)
- **Color Space**: sRGB
- **Resolution**: 72 DPI (web standard)

### Design Guidelines
- **Safe Zone**: Keep important text/graphics within 90% of the image
- **Text Readability**: Ensure text is large enough (minimum 14px font size)
- **Mobile Consideration**: Test how banner looks when scaled down
- **CTA Placement**: Place call-to-action buttons/text in center or right side

---

## File Naming Convention

### Logos
```
/logos/{exchange-name}.png
/logos/{exchange-name}.svg  (if available)
```

Examples:
- `/logos/binance.png`
- `/logos/coinbase.png`
- `/logos/kraken.png`

### Banners
```
/banners/{exchange-name}.jpg
/banners/{exchange-name}.webp  (if using WebP)
```

Examples:
- `/banners/binance.jpg`
- `/banners/coinbase.jpg`
- `/banners/kraken.jpg`

---

## Optimization Tips

### For Logos (PNG)
1. Use tools like **TinyPNG** or **ImageOptim** to compress
2. Remove unnecessary metadata
3. Use indexed color if logo has <256 colors
4. Consider SVG for simple logos

### For Banners (JPG)
1. Use **Photoshop** or **GIMP** with quality 80-85%
2. Progressive JPG for better perceived loading
3. Strip EXIF data to reduce file size
4. Consider WebP format for modern browsers

### Tools Recommendation
- **Image Optimization**: TinyPNG, ImageOptim, Squoosh
- **Format Conversion**: CloudConvert, Online-Convert
- **SVG Optimization**: SVGO

---

## Quick Reference Table

| Type | Display Size | Source Size | Format | File Size | Aspect Ratio |
|------|-------------|-------------|--------|-----------|--------------|
| **Logo** | 48×48px | 256×256px | PNG/SVG | 20-50 KB | 1:1 (square) |
| **Banner** | Full width × 90px min | 1200×150px | JPG/WebP | 50-150 KB | 8:1 (wide) |

---

## Notes

- **Retina/High-DPI**: Source images should be 2x-3x the display size for crisp rendering
- **Lazy Loading**: Both logos and banners use `loading="lazy"` for performance
- **Error Handling**: Images gracefully fail if missing (no broken image icons)
- **Responsive**: Banners scale with container width, maintaining aspect ratio


