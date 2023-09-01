export default class ImageSeparator {
  parentEl: HTMLElement;
  pool: HTMLDivElement[];
  using: HTMLDivElement[];

  constructor(parentEl: HTMLElement) {
    this.parentEl = parentEl;
    this.pool = [];
    this.using = [];
  }

  _getSep(offsetY: number, ids: number[]): HTMLDivElement {
    let sepEl;
    if (this.pool.length < 1) {
      sepEl = document.createElement("div");
      sepEl.className = "image-sep";
    } else {
      sepEl = this.pool.pop()!;
    }
    sepEl.style.top = `${offsetY}px`;
    sepEl.setAttribute("data-image-id", ids.toString());
    this.using.push(sepEl);
    return sepEl;
  }

  addSep(offsetY: number, ids: number[]) {
    this.parentEl.append(this._getSep(offsetY, ids));
  }

  cycSep() {
    if (this.using.length === 0) return;
    console.log("cycle sep:", this.using);
    this.using.forEach((sep) => sep.remove());
    this.pool.push(...this.using);
    this.using = [];
  }
}
