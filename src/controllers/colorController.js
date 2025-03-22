// Función para convertir hexadecimal a RGB
const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
};

const rgbToHex = (r, g, b) => {
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
};

const getComplementaryColor = (r, g, b) => {
  return [255 - r, 255 - g, 255 - b];
};

const rotateHue = (r, g, b, degrees) => {
  const hsl = rgbToHsl(r, g, b);
  hsl[0] = (hsl[0] + degrees) % 360;
  const [newR, newG, newB] = hslToRgb(...hsl);
  return [newR, newG, newB];
};

const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return [h, s, l];
};

const hslToRgb = (h, s, l) => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h / 360 + 1 / 3);
    g = hue2rgb(p, q, h / 360);
    b = hue2rgb(p, q, h / 360 - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

export const getComplementaryColors = (req, res) => {
  const { hex } = req.body;

  if (!/^#[0-9A-F]{6}$/i.test(hex)) {
    return res.status(400).json({ error: "Código hexadecimal inválido" });
  }

  const [r, g, b] = hexToRgb(hex);

  const complementary = getComplementaryColor(r, g, b);
  const splitComplementary1 = rotateHue(r, g, b, 150);
  const splitComplementary2 = rotateHue(r, g, b, 210);
  const triadic = rotateHue(r, g, b, 120);
  const tetradic = rotateHue(r, g, b, 60);

  return res.json({
    original: hex,
    colors: [
      {
        "complementary": rgbToHex(...complementary)
      },
      {
        "splitComplementary1": rgbToHex(...splitComplementary1)
      },
      {
        "splitComplementary2": rgbToHex(...splitComplementary2)
      },
      {
        "triadic": rgbToHex(...triadic)
      },

      {
        "tetradic":rgbToHex(...tetradic)
      }   
    
    ],
  });
};
