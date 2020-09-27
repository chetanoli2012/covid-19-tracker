import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './App.css';
import { appServices } from './App.services'
import InfoBox from './components/InfoBox/InfoBox';
import LineGraph from './components/LineGraph/LineGraph';
import Map from './components/Map/Map';
import Table from './components/Table/Table';
import { prettyPrintStat, sortData } from './util';
import 'leaflet/dist/leaflet.css';
import { connect } from "react-redux";

import * as countries from "./store/ducks/countriesData.duck";


function App(props) {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.10746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

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
    let result = {};
    const {countriesData} = props;
    if(countriesData){
      result.data = countriesData;
      result.status = 200;
    }else{
      result= await appServices.getCountriesData(countryCode);
    }
    if (result && result.status === 200) {
      const countries = result.data.map((country) => ({
        name: country.country,
        value: country?.countryInfo?.iso2
      }));
      props.loadCountriesData(result.data);
      setMapCountries(result.data);
      const sortedData = sortData(result.data)
      setCountries(countries)
      setTableData(sortedData)
    }

  }


  /**
 * Method to get the countries data
 * @param {String} countryCode
 */
  const getDataByCountry = async (countryCode = undefined) => {
    const result = await appServices.getDataByCountry(countryCode);
    if (result && result.status === 200) {
      setCountryInfo(result.data);
      await setMapCenter([result.data?.countryInfo?.lat || 34.10746, result.data?.countryInfo?.long || -40.4796]);
      await setMapZoom(result.data?.countryInfo?.lat ? 4 : 3);
    }

  }

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    await setCountry(countryCode);
    await getDataByCountry(countryCode === 'worldwide' ? 'all' : countryCode);

  }

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
          <InfoBox
            isRed
            active={casesType === 'cases'}
            onClick={e => setCasesType('cases')}
            title='Coronavirus Cases'
            cases={prettyPrintStat(countryInfo?.todayCases)}
            total={countryInfo?.cases}
          />
          <InfoBox
            active={casesType === 'recovered'}
            onClick={e => setCasesType('recovered')}
            title='Recovered'
            cases={prettyPrintStat(countryInfo?.todayRecovered)}
            total={countryInfo?.recovered}
          />
          <InfoBox
            isRed
            active={casesType === 'deaths'}
            onClick={e => setCasesType('deaths')}
            title='Deaths'
            cases={prettyPrintStat(countryInfo?.todayDeaths)}
            total={countryInfo?.deaths}
          />
        </div>
        {/* Map */}
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />


      </div>

      <Card className="app__right">
        <CardContent>
          {/* Table */}
          <h3>Live Cases by Country</h3>

          <Table countries={tableData} />

          {/* Graph */}
          <h3 className='app__graphTitle'>Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType} />

        </CardContent>
      </Card>
    </div>
  );
}

const mapStateToProps = state => ({
  countriesData: state.staticData && state.staticData.countriesData
});


export default connect(
  mapStateToProps,
  countries.actions
)(App)