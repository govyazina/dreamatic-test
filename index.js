document.addEventListener('DOMContentLoaded', async () => {
    getListCurrencyTypes()
    let rate = 0
    document.querySelector('#currency_type_first').addEventListener('change', onChange)
    document.querySelector('#currency_type_second').addEventListener('change', onChange)
    const currencyRates = await getCurrencyRates()
    document.querySelector('.rate_data').innerHTML = currencyRates.date
    document.querySelector('#value_first').addEventListener('input', () => onInput(1))
    document.querySelector('#value_second').addEventListener('input', () => onInput(2))

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

    function onInput(i) {
        const firstValue = document.querySelector('#value_first').value
        const secondValue = document.querySelector('#value_second').value
        if (i === 1) {
            document.querySelector('#value_second').value = (firstValue * rate).toFixed(2)
        }
        else {
            document.querySelector('#value_first').value = (secondValue * rate).toFixed(2)
        }
    }


    async function getExchangeRate(firstCurrencyType, secondCurrencyType) {
        if (firstCurrencyType === 'EUR') {
            rate = (currencyRates.rates[secondCurrencyType]).toFixed(4)
        }
        else if (secondCurrencyType === 'EUR') {
            rate = (1 / currencyRates.rates[firstCurrencyType]).toFixed(4)
        }
        else {
            const rate1 = currencyRates.rates[firstCurrencyType]
            const rate2 = currencyRates.rates[secondCurrencyType]
            rate = ((1 / rate1) * rate2).toFixed(4)
        }
        document.querySelector('.first_currency').innerHTML = firstCurrencyType
        document.querySelector('.second_currency').innerHTML = secondCurrencyType
        document.querySelector('.second_currency_rate').innerHTML = Number(rate).toFixed(2)
    }
});

