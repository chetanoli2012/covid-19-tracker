import axiosInstance from "./axiosInstance";

/**
 * Method to get countries data
 */
async function getCountriesData() {
    try {
        let countriesUrl = `https://disease.sh/v3/covid-19/countries`;
        const result = await axiosInstance.get(`${countriesUrl}`);
        return result;
    } catch (err) {
        console.error('error in getCountriesData ', err);
    }

}

/**
 * Method to get countries data
 * @param {String} countryCode
 */
async function getDataByCountry(countryCode) {
    try {
        let dataByCountryUrl = `https://disease.sh/v3/covid-19/countries/${countryCode}`;
        if (countryCode === `all`) {
            dataByCountryUrl = `https://disease.sh/v3/covid-19/${countryCode}`;
        }
        const result = await axiosInstance.get(`${dataByCountryUrl}`);
        return result;
    } catch (err) {
        console.error('error in getDataByCountry ', err);
    }

}

export const appServices = {
    getCountriesData,
    getDataByCountry
};