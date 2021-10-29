

import debounce from 'lodash.debounce';

import API from './fetchCountries.js';
import { onOutputInfo, onNoCountry, onError } from './notify.js';

import countriesListTpl from '../templates/country_list.hbs';
import countriesCardTpl from '../templates/country_card.hbs';

const refs = {
  inputEL: document.querySelector('.country__input'),
  countriesEL: document.querySelector('.countries'),
  clearBtnEL: document.querySelector('.country__button'),
};

const { inputEL, countriesEL, clearBtnEL } = refs;

inputEL.addEventListener('input', debounce(onSearch, 500));
clearBtnEL.addEventListener('click', onClearCountry);

function onSearch() {
  if (!inputEL.value) {
    onClearCountry();
    return;
  }
  API(inputEL.value).then(countries => onCountrySearch(countries));
}

function onCountrySearch(countries) {
  if (countries.length === 1) {
    onClearCountry();
    return onAppendCountriesCard(countries);
  } else if (countries.length >= 2 && countries.length <= 10) {
    onClearCountry();
    return onAppendListCountries(countries);
  } else if (countries.length > 10) {
    return onOutputInfo();
  } else if (countries.status === 404) {
    return onNoCountry();
  } else {
    return onError();
  }
}

function onClearCountry() {
  inputEL.value = '';
  countriesEL.innerHTML = '';
}

function onAppendListCountries(countries) {
  countriesEL.insertAdjacentHTML('beforeend', countriesListTpl(countries));

  document.querySelector('.countries__list').addEventListener('click', onTargetValue);
}

function onAppendCountriesCard(countries) {
  countriesEL.insertAdjacentHTML('beforeend', countriesCardTpl(countries));
}

function onTargetValue(e) {
  if (e.target.nodeName !== 'LI') {
    return;
  }
  API(e.target.textContent).then(onCountrySearch);
}