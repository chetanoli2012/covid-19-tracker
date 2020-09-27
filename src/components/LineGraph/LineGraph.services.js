import axiosInstance from "../../axiosInstance";

/**
 * Method to get countries data
 */
async function getHistoricalData() {
    try {
        let historicalDataUrl = `https://disease.sh/v3/covid-19/historical/all?lastdays=30`;
        const result = await axiosInstance.get(`${historicalDataUrl}`);
        return result;
    } catch (err) {
        console.error('error in getHistoricalData ', err);
    }

}

export const lineGraphServices = {
    getHistoricalData
};