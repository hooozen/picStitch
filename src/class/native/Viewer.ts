import FlexCanvas from "./FlexCanvas";
import ImageClipView from "./ImageClipView";
import ImageSeparator from "./ImageSeparator";

export default class Viewer {
  canvas: FlexCanvas
  sep: ImageSeparator
  imageViews: ImageClipView[]

  constructor(canvasEl: HTMLCanvasElement) {
    this.canvas = new FlexCanvas(canvasEl);
    this.sep = new ImageSeparator(canvasEl.parentElement!);
    this.imageViews = [];
  }

  assignViews2Canvas(imageViews: ImageClipView[]) {
    this.imageViews = imageViews;
    this.canvas.setCanvasViewsFromClipView(imageViews);
  }

  draw() {
    this.canvas.draw();
    this._addSep();
  }

  update() {
    this.canvas.update();
    this._addSep();
  }

  _addSep() {
    this.sep.cycSep();
    this.canvas.imageViews.reduce((pre, curt) => {
      this.sep.addSep(curt.offsetY / this.canvas.scaleRatio, [pre.clipView.id, curt.clipView.id]);
      return curt;
    });
  }
}