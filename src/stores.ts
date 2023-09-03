import { defineStore } from "pinia";
import ImageClipView from "./class/base/ImageClipView";

type mainStore = {
  imageClipViews: ImageClipView[];
};

export const useStore = defineStore("main", {
  state: () => {
    return {
      imageClipViews: [],
    } as mainStore;
  },
});
