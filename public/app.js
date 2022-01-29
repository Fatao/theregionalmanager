const CITIES = 5;
const LOCALE = "en-US";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

const cities = fetch("data/cities.json").then((response) => response.json());
const countries = fetch("data/countries.json").then((response) =>
    response.json()
);
const timezones = fetch("data/timezones.json").then((response) =>
    response.json()
);
const weatherCodes = fetch("data/weatherCodes.json").then((response) =>
    response.json()
);

const getFlagEmoji = (countryCode) => {
    return String.fromCodePoint(
        ...countryCode
            .toUpperCase()
            .split("")
            .map((char) => 127397 + char.charCodeAt())
    );
};

window.addEventListener("load", () => {
    const app = document.getElementById("app");

    let p = document.createElement("p");
    p.appendChild(
        document.createTextNode(
            `Hello there! I am the Assistant (to the) Regional Manager.`
        )
    );
    app.appendChild(p);

    p = document.createElement("p");
    p.appendChild(
        document.createTextNode(
            `Here is a list of ${CITIES} random cities with their country, local time, and local weather forecast.`
        )
    );
    app.appendChild(p);

    let button = document.createElement("button");
    button.appendChild(document.createTextNode(`♻️ Reload`));
    app.appendChild(button);
    button.onclick = loadWeather;

    loadWeather();
});

const loadWeather = async () => {
    Promise.all([cities, countries, timezones, weatherCodes]).then(
        async ([cities, countries, timezones, weatherCodes]) => {
            const element = document.getElementById("cities");
            if (element) {
                element.remove();
            }

            const div = document.createElement("div");
            div.id = "cities";
            app.appendChild(div);

            for (let i = 0; i < CITIES; i++) {
                const city = cities[Math.floor(Math.random() * cities.length)];
                const [
                    name,
                    countryCode,
                    adminName,
                    longitude,
                    latitude,
                    timezoneIndex,
                ] = city;
                const country = countries[countryCode];
                const flag = getFlagEmoji(countryCode);
                const timezone = timezones[timezoneIndex];
                const dateTime = new Date().toLocaleString(LOCALE, {
                    timeZone: timezone,
                    dateStyle: "short",
                    timeStyle: "short",
                });

                const weather = await fetch(
                    WEATHER_API_URL +
                        "?" +
                        new URLSearchParams({
                            latitude,
                            longitude,
                            daily: "weathercode",
                            timezone,
                            past_days: "1",
                        })
                ).then((response) => response.json());

                let symbols = "";
                for (const key in weather["daily"]["weathercode"]) {
                    const code = weather["daily"]["weathercode"][key];
                    symbols += weatherCodes[code]["symbol"];
                }

                const cityDiv = document.createElement("div");

                const flagSpan = document.createElement("span");
                flagSpan.appendChild(document.createTextNode(flag));
                flagSpan.classList.add("flag");
                cityDiv.appendChild(flagSpan);

                cityDiv.appendChild(
                    document.createTextNode(`${name}, ${country}`)
                );

                const timeDiv = document.createElement("div");
                timeDiv.appendChild(document.createTextNode(dateTime));
                timeDiv.classList.add("time");
                cityDiv.appendChild(timeDiv);

                const weatherDiv = document.createElement("div");
                weatherDiv.appendChild(document.createTextNode(symbols));
                weatherDiv.classList.add("weather");
                cityDiv.appendChild(weatherDiv);

                div.appendChild(cityDiv);
            }
        }
    );
};
