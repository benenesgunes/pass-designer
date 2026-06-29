export function hexToRgbString(hex: string): string {
  const normalizedHex = hex.replace(/^#/, "");

  if (!/^[0-9a-fA-F]{6}$/.test(normalizedHex)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const red = Number.parseInt(normalizedHex.slice(0, 2), 16);
  const green = Number.parseInt(normalizedHex.slice(2, 4), 16);
  const blue = Number.parseInt(normalizedHex.slice(4, 6), 16);

  return `rgb(${red}, ${green}, ${blue})`;
}

