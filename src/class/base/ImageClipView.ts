type ClipCoordinate = [number, number, number, number];
type CanvasClipArgs = [number, number, number, number];

export default class ImageClipView {
  image: HTMLImageElement;
  id: number;
  parent: ImageClipView | null;
  naturalWidth: number;
  naturalHeight: number;

  x0: number;
  y0: number;
  x1: number;
  y1: number;

  constructor(image: HTMLImageElement, id: number, parent?: ImageClipView) {
    this.image = image;
    this.id = id;
    this.parent = parent || null;

    this.naturalWidth = image.naturalWidth;
    this.naturalHeight = image.naturalHeight;

    this.x0 = 0;
    this.y0 = 0;
    this.x1 = this.naturalWidth;
    this.y1 = this.naturalHeight;
  }

  get width(): number {
    return this.x1 - this.x0;
  }

  get height(): number {
    return this.y1 - this.y0;
  }

  getCoordinate(): ClipCoordinate {
    return [this.x0, this.y0, this.x1, this.y1];
  }

  setCoordinate(...coordinate: ClipCoordinate) {
    [this.x0, this.y0, this.x1, this.y1] = coordinate;
  }

  moveBottomClipEdge(dy: number): boolean {
    const _y1 = this.y1 + dy;
    if (_y1 > this.naturalHeight || _y1 < this.y0) return false;
    this.y1 = _y1;
    return true;
  }

  moveTopClipEdge(dy: number) {
    const _y0 = this.y0 + dy;
    if (_y0 < 0 || _y0 > this.y1) return false;
    this.y0 = _y0;
    return true;
  }

  applyToParent(): void {
    if (this.parent === null)
      return console.warn("can only send message to parent");
    this.parent.setCoordinate(this.x0, this.y0, this.x1, this.y1);
  }

  getClipCanvasArgs(): CanvasClipArgs {
    return [this.x0, this.y0, this.width, this.height];
  }
}
