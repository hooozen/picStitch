import { App, Plugin } from "vue";

import Loading from "./src/method";

(Loading as unknown as Plugin).install = (app: App) => {
  Loading._context = app._context;
};

export default Loading;
