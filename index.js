document.addEventListener('DOMContentLoaded', async () => {
    getListCurrencyTypes()
    document.querySelector('#currency_type_first').addEventListener('change', onChange)
    document.querySelector('#currency_type_second').addEventListener('change', onChange)
    const currencyRates = await getCurrencyRates()
    document.querySelector('.rate_data').innerHTML = currencyRates.date

    async function getListCurrencyTypes() {
        const url = new URL("http://data.fixer.io/api/symbols");
        url.searchParams.set("access_key", '74862ddc35eb9cd50dab455a68c6b8c3');
        let currencyList = await fetch(url)
            .then(response => response.json())
            .then(result => result.symbols);
        let stringOptions = '';
        for (const currency in currencyList) {
            stringOptions += `<option value="${currency}">${currencyList[currency]}</option>`
        }
        document.querySelector('#currency_type_first').innerHTML = stringOptions;
        document.querySelector('#currency_type_second').innerHTML = stringOptions;
    }

    async function getCurrencyRates() {
        const url = new URL("http://data.fixer.io/api/latest");
        url.searchParams.set("access_key", '74862ddc35eb9cd50dab455a68c6b8c3');
        return await fetch(url)
            .then(response => response.json())
            .then(result => result);
    }

    function onChange() {
        const firstCurrencyType = document.querySelector('#currency_type_first').value
        const secondCurrencyType = document.querySelector('#currency_type_second').value
        getExchangeRate(firstCurrencyType, secondCurrencyType)
    }


    async function getExchangeRate(firstCurrencyType, secondCurrencyType) {
        let rate = 0
        if (firstCurrencyType === 'EUR') {
            rate = currencyRates.rates[secondCurrencyType]
        }
        if (secondCurrencyType === 'EUR') {
            rate = 1 / currencyRates.rates[firstCurrencyType]
        }
        document.querySelector('.first_currency').innerHTML = firstCurrencyType
        document.querySelector('.second_currency').innerHTML = secondCurrencyType
        document.querySelector('.second_currency_rate').innerHTML = rate
    }
});

