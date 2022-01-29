const CITIES = 5;
const LOCALE = "en-US";
const TEMPERATURE_UNIT = "fahrenheit";
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

const createNode = ({
    tag = "div",
    id = null,
    className = null,
    text = null,
    parent = null,
} = {}) => {
    const node = document.createElement(tag);
    if (id != null) {
        node.id = id;
    }
    if (className != null) {
        node.classList.add(className);
    }
    if (text != null) {
        node.appendChild(document.createTextNode(text));
    }
    if (parent != null) {
        parent.appendChild(node);
    }
    return node;
};

window.addEventListener("load", () => {
    const app = document.getElementById("app");
    createNode({
        tag: "p",
        text: `Hello there! I am the Assistant (to the) Regional Manager.`,
        parent: app,
    });
    createNode({
        tag: "p",
        text: `Here is a list of ${CITIES} random cities with their country, local time, and local weather forecast.`,
        parent: app,
    });

    let button = createNode({ tag: "button", text: `♻️ Reload`, parent: app });
    button.onclick = loadWeather;

    loadWeather();
});

const loadWeather = async () => {
    Promise.all([cities, countries, timezones, weatherCodes]).then(
        async ([cities, countries, timezones, weatherCodes]) => {
            let citiesDiv = document.getElementById("cities");
            if (citiesDiv) {
                citiesDiv.remove();
            }
            createNode({ tag: "div", id: "cities", parent: app });

            for (let i = 0; i < CITIES; i++) {
                const city = cities[Math.floor(Math.random() * cities.length)];
                addCity(city, countries, timezones, weatherCodes);
            }
        }
    );
};

const addCity = async (city, countries, timezones, weatherCodes) => {
    let citiesDiv = document.getElementById("cities");
    const [name, countryCode, adminName, longitude, latitude, timezoneIndex] =
        city;
    const country = countries[countryCode];
    const flag = getFlagEmoji(countryCode);
    const timezone = timezones[timezoneIndex];
    const dateTime = new Date()
        .toLocaleString(LOCALE, {
            timeZone: timezone,
            dateStyle: "full",
            timeStyle: "short",
        })
        .split(",");
    const date = dateTime[0] + ", " + dateTime[1];
    const time = " " + dateTime[2].split(" at ")[1];

    const weatherData = await fetch(
        WEATHER_API_URL +
            "?" +
            new URLSearchParams({
                latitude,
                longitude,
                timezone,
                temperature_unit: TEMPERATURE_UNIT,
                past_days: "1",
            }) +
            "&daily=weathercode,temperature_2m_max,temperature_2m_min"
    ).then((response) => response.json());

    let weather = [];
    for (let key in ["0", "1", "2"]) {
        const code = weatherData["daily"]["weathercode"][key];
        let date;
        switch (key) {
            case "0":
                date = "yesterday";
                break;
            case "1":
                date = "today";
                break;
            case "2":
                date = "tomorrow";
        }

        const day = {
            date,
            symbol: weatherCodes[code]["symbol"],
            description: weatherCodes[code]["modifier"]
                ? `${weatherCodes[code]["modifier"]} ${weatherCodes[code]["category"]}`
                : weatherCodes[code]["category"],
            min: Math.round(weatherData["daily"]["temperature_2m_min"][key]),
            max: Math.round(weatherData["daily"]["temperature_2m_max"][key]),
        };
        weather.push(day);
    }

    const cityDiv = createNode({
        tag: "div",
        className: "city",
        parent: citiesDiv,
    });
    const cityHeader = createNode({
        tag: "div",
        className: "cityHeader",
        parent: cityDiv,
    });
    createNode({
        tag: "div",
        className: "flag",
        text: flag,
        parent: cityHeader,
    });
    createNode({
        tag: "div",
        className: "place",
        text: `${name}, ${country}`,
        parent: cityHeader,
    });
    const dateTimeDiv = createNode({
        tag: "div",
        className: "dateTime",
        parent: cityHeader,
    });
    createNode({
        tag: "div",
        className: "time",
        text: time,
        parent: dateTimeDiv,
    });
    createNode({
        tag: "div",
        className: "date",
        text: date,
        parent: dateTimeDiv,
    });

    const weatherDiv = createNode({
        tag: "div",
        className: "weather",
        parent: cityDiv,
    });
    for (const day in weather) {
        const dayDiv = createNode({ className: "day", parent: weatherDiv });
        createNode({
            text: `${weather[day]["date"]}`,
            className: "relativeDay",
            parent: dayDiv,
        });
        createNode({
            text: `${weather[day]["symbol"]}`,
            className: "symbol",
            parent: dayDiv,
        });
        createNode({
            className: "description",
            text: `${weather[day]["description"]}`,
            parent: dayDiv,
        });
        createNode({
            className: "temperature",
            text: `${weather[day]["min"]} 📈 ${weather[day]["max"]} °F`,
            parent: dayDiv,
        });
    }
};
