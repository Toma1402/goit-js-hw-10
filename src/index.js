import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
const listRef = document.querySelector('.country-list');
const countryRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  const searchedCountry = evt.target.value.trim();

  fetchCountries(searchedCountry)
    .then(resp => {
      console.log(resp);
      if (resp.length >= 2 && resp.length <= 10) {
        createMarkup(resp);
      }
      if (resp.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (resp.length === 1) {
        getCountryInfo(resp);
      }
    })
    .catch(err => Notify.failure('Oops, there is no country with that name'));
}

function createMarkup(arr) {
  const markup = arr
    .map(
      ({ flags, name }) =>
        `<li class="list-item">
        <img src="${flags.svg}" alt="flag" width = '40' height = '30'>
        <p>${name.common}</p>
      </li>`
    )
    .join('');
  listRef.innerHTML = markup;
  countryRef.innerHTML = '';
}
function getCountryInfo(arr) {
  const template = arr
    .map(
      ({
        flags,
        name,
        capital,
        population,
        languages,
      }) => `<div class="country-card">
        <img src="${flags.svg}" alt="flag" width="40" height="30" />
        <p>${name.common}</p>
      </div>
      <h5>Capital: ${capital}</span></h5>
      <h5>Population: ${population}</span></h5>
      <h5>Languages: ${Object.values(languages)}</span></h5>`
    )
    .join('');
  listRef.innerHTML = '';
  countryRef.innerHTML = template;
}
