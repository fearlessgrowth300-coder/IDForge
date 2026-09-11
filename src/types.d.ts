declare module 'jsqr' {
  const jsQR: (
    data: Uint8ClampedArray | Uint8Array | Uint32Array,
    width: number,
    height: number
  ) => { data: string; location: unknown } | null;
  export default jsQR;
}
