import { App, Plugin } from "vue";
import Tip from "./src/method";

(Tip as unknown as Plugin).install = (app: App) => {
  Tip._context = app._context;
  app.config.globalProperties["tip"] = Tip;
};

export default Tip as typeof Tip & Plugin;
