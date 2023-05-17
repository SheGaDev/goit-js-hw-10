const BASE_URL = "https://restcountries.com/";
const VERSION_API = "v3.1";
const ENDPOINT = "name";
async function fetchCountries(name) {
    try {
        const res = await fetch(`${BASE_URL}/${VERSION_API}/${ENDPOINT}/${name}?fields=name,capital,population,flags,languages`);
        if (res.status === 404) return { status: "invalidName", message: "Oops, there is no country with that name" };
        return res.json();
    } catch (O_o) { }
}

export { fetchCountries }