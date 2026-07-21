/** SVG文字列にxmlns属性がなければ付与する（シリアライズ結果をファイルとして単独で開けるようにするため） */
function ensureXmlns(svgString: string): string {
  if (svgString.includes('xmlns=')) return svgString;
  return svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('画像の読み込みに失敗しました。'));
    img.src = url;
  });
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // ダウンロード開始を確実にしてからblob URLを解放する
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** SVG要素をそのままSVGファイルとしてダウンロードする */
export function downloadSvgAsSvgFile(svg: SVGSVGElement, filename: string) {
  const source = ensureXmlns(new XMLSerializer().serializeToString(svg));
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  triggerDownload(URL.createObjectURL(blob), filename);
}

/** SVG要素をラスタライズしてPNGファイルとしてダウンロードする（背景は白で塗りつぶす） */
export async function downloadSvgAsPngFile(
  svg: SVGSVGElement,
  filename: string,
  scale = 2,
): Promise<void> {
  const source = ensureXmlns(new XMLSerializer().serializeToString(svg));
  const viewBox = svg.viewBox.baseVal;
  const width = (viewBox.width || svg.clientWidth || 640) * scale;
  const height = (viewBox.height || svg.clientHeight || 360) * scale;

  const svgUrl = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = await loadImage(svgUrl);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('このブラウザはCanvasに対応していません。');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('PNG画像の生成に失敗しました。');
    triggerDownload(URL.createObjectURL(blob), filename);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}
