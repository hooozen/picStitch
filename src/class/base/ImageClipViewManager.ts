import ImageClipView from "./ImageClipView";

export default class ImageViewManager {
  images: HTMLImageElement[]
  views: { [id: number]: ImageClipView }
  viewCnt: number
  inited: boolean

  constructor() {
    this.images = [];
    this.views = {};
    this.viewCnt = 0;
    this.inited = false;
  }

  initViews(urls: string[]) {
    return Promise.all(
      urls.map(url => new Promise<HTMLImageElement>((resolve, _) => {
        const image = new Image();
        image.src = url;
        // image.onload = () => resolve(image);
        image.addEventListener('load', () => resolve(image));
      }))).then(images => {
        this.inited = true;
        this.images = images;
        return this.generateClipViews();
      });
  }

  generateClipViews(): ImageClipView[] {
    this.viewCnt = 0
    this.views = {}
    return this.images.map(img => {
      const view = new ImageClipView(img, this.viewCnt);
      this.views[this.viewCnt++] = view;
      return view;
    });
  }

  copyImageView(...viewIDs: number[]): ImageClipView[] {
    return viewIDs.map(id => {
      const parent = this.views[id];
      const child = new ImageClipView(parent.image, this.viewCnt, parent);
      child.setCoordinate(...parent.getCoordinate());
      this.views[this.viewCnt++] = child;
      return child;
    });
  }
}
