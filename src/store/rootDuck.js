import { combineReducers } from "redux";

import * as countries from "./ducks/countriesData.duck";
export const rootReducer = combineReducers({
  staticData: countries.reducer,
});

