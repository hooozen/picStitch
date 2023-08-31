import PicStitchCanvas from "./PicStitchCanvas";

export default class JointCanvas extends PicStitchCanvas {

  init(el: HTMLCanvasElement, width?: number, height?: number) {
    super.init(el)
    if (width) this.canvas!.width = width;
    if (height) this.canvas!.height = height;
  }

  get halfHeight(): number {
    if (!this.canvas) return 0
    return Math.floor(this.canvas.height / 2);
  }

  dragImage(startY: number, dy: number) {
    if (this.canvas === null) return console.warn('canvas not init!')
    const i = +(startY > this.canvas.offsetHeight / 2);
    dy *= this.scaleRatio;
    console.log(i, startY, dy, this.scaleRatio)
    if (i === 0 && this.imageViews[0].moveBottomClipEdge(-dy))
      this.update();
    else if (i === 1 && this.imageViews[1].moveTopClipEdge(-dy))
      this.update();
  }

  _setHeight() {
    if (this.canvas === null) return console.warn('canvas not init!')
    this.canvas.height = this.canvas.offsetHeight * this.scaleRatio;
    console.log('joint canvas height:', this.canvas.height);
  }

  _setViewsOffset() {
    this.imageViews[0].setOffsetY(this.halfHeight - this.imageViews[0].height);
    this.imageViews[1].setOffsetY(this.halfHeight);
  }
}