'use strict';

import Home from "./Home";
import Tesseract from "./Tesseract";

const Routes = {
  Home,
  Tesseract,

  start : Home,
};

for (const component in Routes) {
  if (Routes.hasOwnProperty(component)) {
    Routes[component] = { component : Routes[component] };
  }
}
export default Object.freeze(Routes);