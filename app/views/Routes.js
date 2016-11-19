'use strict';

import Home from "./Home";
import UserInfo from "./UserInfo";

const Routes = {
  Home,
  UserInfo,

  start : Home,
};

for (const component in Routes) {
  if (Routes.hasOwnProperty(component)) {
    Routes[component] = { component : Routes[component] };
  }
}
export default Object.freeze(Routes);