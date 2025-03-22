import tinycolor from "tinycolor2";

// Complementario
export function getComplementaryColors(hex) {
  const baseColor = tinycolor(hex);
  const complementaryColor = baseColor.complement();
  return [baseColor.toHexString(), complementaryColor.toHexString()];
}

// Complementario Dividido
export function getSplitComplementaryColors(hex) {
  const baseColor = tinycolor(hex);
  const splitColors = baseColor.splitcomplement();
  return splitColors.map((color) => color.toHexString());
}

// Triádico
export function getTriadicColors(hex) {
  const baseColor = tinycolor(hex);
  const triadicColors = baseColor.triad();
  return triadicColors.map((color) => color.toHexString());
}

// Tetrádico
export function getTetradicColors(hex) {
  const baseColor = tinycolor(hex);
  const tetradicColors = baseColor.tetrad();
  return tetradicColors.map((color) => color.toHexString());
}

// Monocromático
export function getMonochromaticColors(hex) {
  const baseColor = tinycolor(hex);
  const monochromaticColors = baseColor.monochromatic();
  return monochromaticColors.map((color) => color.toHexString());
}

// Análogo
export function getAnalogousColors(hex) {
  const baseColor = tinycolor(hex);
  const analogousColors = baseColor.analogous();
  return analogousColors.map((color) => color.toHexString());
}
