// http://data.fixer.io/api/latest?access_key=74862ddc35eb9cd50dab455a68c6b8c3
document.addEventListener('DOMContentLoaded', getListCurrencyTypes)
async function getListCurrencyTypes() {
    const url = new URL("http://data.fixer.io/api/symbols");
    url.searchParams.set("access_key", '74862ddc35eb9cd50dab455a68c6b8c3');
    let currencyList = await fetch(url)
        .then(response => response.json())
        .then(result => result.symbols);
    let stringOptions = ''
    for (const currency in currencyList) {
        stringOptions += `<option value="${currency}">${currencyList[currency]}</option>`
    }
    document.querySelector('#currency_type_first').innerHTML = stringOptions;
    document.querySelector('#currency_type_second').innerHTML = stringOptions;
}
