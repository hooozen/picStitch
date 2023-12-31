import ImageCanvasView from "./ImageCanvasView";
import ImageClipView from "./ImageClipView";

export default class PicStitchCanvas {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  scaleRatio: number;
  imageViews: ImageCanvasView[];

  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.scaleRatio = 1;
    this.imageViews = [];
  }

  init(el: HTMLCanvasElement) {
    this.canvas = el;
    this.ctx = this.canvas.getContext("2d")!;
  }

  setCanvasViewsFromClipView(imageViews: ImageClipView[]) {
    this.imageViews = imageViews.map((view) => new ImageCanvasView(view));
    this.resizeCanvas();
  }

  update() {
    this.resizeCanvas();
    this.draw();
  }

  resizeCanvas() {
    this._setWidth();
    this._setViewsWidth();
    this._setHeight();
    this._setViewsOffset();
  }

  draw() {
    if (this.ctx === null)
      return console.warn("init is required before drawing!");
    this.imageViews.forEach((view) => {
      this.ctx!.drawImage(...view.getDrawArgs());
    });
  }

  save(
    type: string = "image/png",
    quality: number = 0.9
  ): Promise<string | ArrayBuffer | null> | void {
    if (this.ctx === null) return console.warn("init is required before save!");
    return new Promise((resolve, _) => {
      this.canvas!.toBlob(
        // resolve,
        (blob: Blob | null) => {
          var reader = new FileReader();
          reader.onload = function () {
            resolve(reader.result);
          };
          reader.readAsDataURL(blob!);
        },
        type,
        quality
      );
    });
  }

  _setWidth() {
    if (this.canvas === null) return console.warn("canvas not init!");
    this.canvas.width = this.imageViews.reduce(
      (width, view) => Math.min(width, view.clipView.width),
      Infinity
    );
    this.scaleRatio = this.canvas.width / this.canvas.offsetWidth;
  }
  _setViewsWidth() {
    if (this.canvas === null) return console.warn("canvas not init!");
    this.imageViews.forEach((view) => {
      view.setWidth(this.canvas!.width);
    });
  }
  _setViewsOffset() {}
  _setHeight() {}
  _scaleViews() {}
}
