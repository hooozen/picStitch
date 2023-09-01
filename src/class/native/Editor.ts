import ImageClipView from "../base/ImageClipView";
import JointCanvas from "../base/JointCanvas";

export default class Editor {
  canvas: JointCanvas;
  imageViews: ImageClipView[];

  constructor(canvasEl: HTMLCanvasElement) {
    this.canvas = new JointCanvas(canvasEl);
    this.imageViews = [];
  }

  assignViews2Canvas(imageViews: ImageClipView[]) {
    this.imageViews = imageViews;
    this.canvas.setCanvasViewsFromClipView(imageViews);
  }

  draw() {
    this.canvas.draw();
  }

  drag(startY: number, dy: number) {
    if (dy === 0) return;
    this.canvas.dragImage(startY, dy);
  }

  save() {
    this.imageViews.forEach((view) => view.applyToParent());
  }
}
