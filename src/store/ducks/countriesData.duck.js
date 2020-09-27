import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
    countriesDataLoad: "[Load Countries Data] Action"
};

const initialState = {
    countriesData: undefined,
};

export const reducer = persistReducer(
    { storage, key: "countriesData", whitelist: ['countriesData'] },
    (state = initialState, action) => {
        switch (action.type) {
            case actionTypes.countriesDataLoad: {
                const { countriesData } = action.payload
                return { ...state, countriesData: countriesData };
            }
            default:
                return state;
        }
    }
);

export const actions = {
    loadCountriesData: countriesData => ({ type: actionTypes.countriesDataLoad, payload: { countriesData } })
};

