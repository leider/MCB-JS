import Vue from "vue";
import Vuetify from "vuetify";
import de from "vuetify/src/locale/de";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: "#4b46cb",
        secondary: "#424242",
        accent: "#82B1FF",
        error: "#b21f37",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107"
      }
    }
  },
  lang: {
    locales: { de },
    current: "de"
  },
  icons: {
    iconfont: "fa"
  }
});
