const url = 'https://countries.trevorblades.com'
const countrySelect = document.getElementById('country-select')
const errorDisplayer = document.getElementById('error-displayer')
const selectedCountry = document.getElementById('selected-country')

countrySelect.addEventListener('change', (e) => {
  getCountryByCode(e.target.value)
})

const getBooksQuery = (keyword) =>
  `{ allBooks(filter: { q:"${keyword}"}) { author title url } }`

const queries = {
  getCountrysQuery: () => `
    query {
        countries {
            name
            code
        }
    }
    `,
  getCountryByCode: () => `
    query getCountry ($code: ID!) {
        country (code: $code) {
        name
        phone
        capital
        languages {
            name
        }
        }
    }
    `,
}

const painResult = (result) => {
  if (!result) return
  result?.data?.countries?.map((item) => {
    const option = document.createElement('option')
    option.value = item?.code
    option.textContent = item?.name
    countrySelect.append(option)
  })
}

const getCountryByCode = (cCode) => {
  queryFetch(queries.getCountryByCode(), { code: cCode })
    .then((data) => {
      const country = data?.data?.country
      selectedCountry.textContent =
        'language' +
        country?.capital +
        ', phone: ' +
        country?.phone +
        ', capital: ' +
        country?.capital
      console.log('data', data)
    })
    .catch((e) => {
      console.log(e)
      errorDisplayer.textContent = e.message
    })
}

const queryFetch = async (query, variables) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  }).then((result) => result.json())
}

queryFetch(queries.getCountrysQuery())
  .then((data) => painResult(data))
  .catch((e) => {
    console.log(e)
    errorDisplayer.textContent = e.message
  })
