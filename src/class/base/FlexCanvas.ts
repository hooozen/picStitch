import PicStitchCanvas from "./PicStitchCanvas";

export default class FlexCanvas extends PicStitchCanvas {

  _setHeight() {
    if (this.canvas === null) return console.warn('canvas not init!')
    this.canvas.height = this.imageViews
      .reduce((height, view) => height + view.height, 0);
    console.log('flex canvas height:', this.canvas!.height);
  }

  _setViewsOffset() {
    this.imageViews.reduce((height, view) => {
      view.setOffsetY(height);
      return height + view.height;
    }, 0);
  }
}