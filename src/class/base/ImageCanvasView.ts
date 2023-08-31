import ImageClipView from "./ImageClipView";


type CanvasDrawArgs = [HTMLImageElement, number, number, number, number, number, number, number, number]

export default class ImageCanvasView {

  clipView: ImageClipView
  width: number
  offsetY: number
  offsetX: number

  constructor(clipView: ImageClipView) {
    this.clipView = clipView;
    this.width = this.clipView.width;
    this.offsetY = 0;
    this.offsetX = 0
  }

  setWidth(width: number) {
    this.width = width;
  }

  setOffsetY(oy: number) {
    this.offsetY = oy;
  }

  setOffsetX(ox: number) {
    this.offsetX = ox;
  }

  get scaleRatio(): number {
    return this.clipView.width / this.width;
  }

  get height(): number {
    return this.clipView.height / this.scaleRatio;
  }

  moveBottomClipEdge(dy: number): boolean {
    return this.clipView.moveBottomClipEdge(dy * this.scaleRatio);
  }

  moveTopClipEdge(dy: number): boolean {
    return this.clipView.moveTopClipEdge(dy * this.scaleRatio);
  }

  getDrawArgs(): CanvasDrawArgs {
    return [
      this.clipView.image,
      ...this.clipView.getClipCanvasArgs(),
      this.offsetX, this.offsetY,
      this.width, this.height
    ];
  }
};
