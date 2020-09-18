import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './App.css';
import { appServices } from './App.services'
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';


function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  /**
   * https://disease.sh/v3/covid-19/countries
   * API to get countries Data
   */

  /**
   * UseEffect hook runs a code based on changes in the array params or once if the array param is empty
   */
  useEffect(() => {
    getCountriesData();
    getDataByCountry('all');
  }, [])

  /**
   * Method to get the countries data
   * @param {String} countryCode
   */
  const getCountriesData = async (countryCode = undefined) => {
    // console.log('are we here!');
    const result = await appServices.getCountriesData(countryCode);
    if (result && result.status === 200) {
      const countries = result.data.map((country) => ({
        name: country.country,
        value: country?.countryInfo?.iso2
      }));
      setTableData(result.data)
      setCountries(countries)
    }

  }


    /**
   * Method to get the countries data
   * @param {String} countryCode
   */
  const getDataByCountry = async (countryCode = undefined) => {
    // console.log('are we here!');
    const result = await appServices.getDataByCountry(countryCode);
    if (result && result.status === 200) {
      setCountryInfo(result.data)
    }

  }

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    console.log('country previously', country);
    await setCountry(countryCode);
    console.log('country afterwards', country);
    await getDataByCountry(countryCode === 'worldwide'? 'all': countryCode);
    
  }

  console.log('tableDAta', tableData);


  return (
    <div className="app">

      <div className="app__left">

        {/* Header */}
        {/* Title + Select input dropdown field */}
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>

          <FormControl className='app__dropdown'>
            <Select
              variant='outlined'
              value={country}
              onChange={onCountryChange}
            >

              {/* Loop through all the countries and show them in the dropdown */}
              <MenuItem key={`RAND1`} value={`worldwide`}>{`Worldwide`}</MenuItem>
              {countries.map((country, index) => (
                <MenuItem key={country.value + index} value={country.value}>{country.name}</MenuItem>
              ))}

            </Select>
          </FormControl>
        </div>

        <div className="app__stats">

          {/* InfoBoxes */}
          <InfoBox title='Coronavirus Cases' cases={countryInfo?.todayCases} total={countryInfo?.cases} />
          <InfoBox title='Recovered' cases={countryInfo?.todayRecovered} total={countryInfo?.recovered} />
          <InfoBox title='Deaths' cases={countryInfo?.todayDeaths} total= {countryInfo?.deaths} />
        </div>
        {/* Map */}
        <Map />


      </div>

      <Card className="app__right">
        <CardContent>
          {/* Table */}
          <h3>Live Cases by Country</h3>

          <Table countries = {tableData} />

          {/* Graph */}
          <h3>Worldwide new cases</h3>

        </CardContent>
      </Card>
    </div>
  );
}

export default App;
