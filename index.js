document.addEventListener('DOMContentLoaded', async () => {
    const store = {}
    const firstCurrency = document.querySelector('#currency_type_first');
    const secondCurrency = document.querySelector('#currency_type_second');
    const currentDate = document.querySelector('.rate_date');
    const firstAmount = document.querySelector('#value_first');
    const secondAmount = document.querySelector('#value_second');

    const [currencyRates] = await Promise.all([getCurrencyRates(), getListCurrencyTypes()])

    firstCurrency.value = 'EUR'
    secondCurrency.value = 'USD'
    currentDate.innerHTML = currencyRates.date
    onChange()

    firstCurrency.addEventListener('change', onChange)
    secondCurrency.addEventListener('change', onChange)
    firstAmount.addEventListener('input', () => onInput(1))
    secondAmount.addEventListener('input', () => onInput(2))

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
        firstCurrency.innerHTML = stringOptions;
        secondCurrency.innerHTML = stringOptions;
    }

    async function getCurrencyRates() {
        const url = new URL("http://data.fixer.io/api/latest");
        url.searchParams.set("access_key", '74862ddc35eb9cd50dab455a68c6b8c3');
        return await fetch(url)
            .then(response => response.json())
            .then(result => result);
    }

    function onChange() {
        store.firstCurrencyType = firstCurrency.value
        store.secondCurrencyType = secondCurrency.value
        getExchangeRate()
    }

    function onInput(i) {
        store.i = i
        store.firstValue = firstAmount.value
        store.secondValue = secondAmount.value
        showRate()
    }


    async function getExchangeRate() {
        const {firstCurrencyType, secondCurrencyType} = store
        if (firstCurrencyType === 'EUR') {
            store.rate = (currencyRates.rates[secondCurrencyType]).toFixed(4)
        } else if (secondCurrencyType === 'EUR') {
            store.rate = (1 / currencyRates.rates[firstCurrencyType]).toFixed(4)
        } else {
            const rate1 = currencyRates.rates[firstCurrencyType]
            const rate2 = currencyRates.rates[secondCurrencyType]
            store.rate = ((1 / rate1) * rate2).toFixed(4)
        }
        showRate()
    }

    function showRate() {
        document.querySelector('.first_currency').innerHTML = store.firstCurrencyType
        document.querySelector('.second_currency').innerHTML = store.secondCurrencyType
        document.querySelector('.second_currency_rate').innerHTML = Number(store.rate).toFixed(2)
        if (store.i === 1) {
            secondAmount.value = (store.firstValue * store.rate).toFixed(2)
        } else if (store.i === 2) {
            firstAmount.value = (store.secondValue * store.rate).toFixed(2)
        }
    }
});

