import './css/styles.css';
import _ from "lodash.debounce";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from "./js/fetchCountries.js";
class Countries {
    #DEBOUNCE_DELAY = 300;
    constructor(data = {}) {
        this.elements = {};
        if (!Object.keys(data?.elements).length)
            throw new Error("Required object elements { name: element }");
        for (const [name, element] of Object.entries(data.elements))
            this.elements[name] = document.querySelector(element);

    }
    onInput() {
        this.elements.search.addEventListener("input", _(this.updateListOrInfo.bind(null, this), this.#DEBOUNCE_DELAY));
    }
    removeInput() { // Функція просто існує задля чогось, але воно ніколи не наступить.
        this.elements.search.removeEventListener("input", () => { });
    }
    async updateListOrInfo(country, e) {
        const name = e.target.value.trim();
        if (!name.length) {
            country.clearElements(country.elements);
            return;
        }
        const countries = await country.fetchCountry(name);
        if (!countries) return;
        country.clearElements(country.elements)
        if (countries.length === 1) country.setInfo(countries[0]);
        else if (countries.length > 1 && countries.length <= 10)
            country.setList(countries);
    }
    clearElements(elements) {
        for (const value of Object.values(elements)) {
            if (value.children.length) value.innerHTML = "";
        }
    }
    setList(countries) {
        this.elements.list.innerHTML = countries
            .map(({ name: { official }, flags: { svg } }) =>
                `<li><img src=${svg} alt="Flag ${official}" width="40" height="35"/><span> ${official}</span></li>`).join("");
        // Не хоче відображатись свг..
        // .map(({ name: { official }, flags: { svg }}) =>
        //     `<li><svg width="60" height="40"><use href=${svg}></use></svg><span>${official}</span></li>`).join("");
    }
    setInfo({ name: { official }, capital, population, flags: { svg }, languages }) {
        this.elements.info.innerHTML = `<h1><img src=${svg} alt="Flag ${official}" width="55" height="50"/> ${official}</h1>
        <p><b>Capital:</b> ${capital}</p>
        <p><b>Population:</b> ${population.toLocaleString("uk-UK")}</p>
        <p><b>Languages:</b> ${Object.values(languages).join(", ")}</p>`;
    }
    async fetchCountry(name) {
        const res = await fetchCountries(name)
        if (res.status === "invalidName") return this.logger("failure", res.message);
        if (res.length > 10) return this.logger("info", "Too many matches found. Please enter a more specific name.")
        return res;
    }
    logger(type, text) {
        Notify[type](text);
    }
}

new Countries({
    elements: {
        search: "#search-box",
        list: ".country-list",
        info: ".country-info"
    }
}).onInput();