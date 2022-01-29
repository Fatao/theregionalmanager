# Assistant (to the) Regional Manager

[https://assistant.to.theregionalmanager.com/](https://assistant.to.theregionalmanager.com/)

## Stack

-   [GitHub](https://github.com/ummcheng/theregionalmanager) for code hosting
-   [Netlify](https://www.netlify.com/) for continuous deployment
-   Plain HTML, CSS, and JavaScript for app

## Generating data

Geographical data is downloaded from [https://simplemaps.com/data/world-cities](https://simplemaps.com/data/world-cities). Then, timezone data is added by [`timezonefinder`](https://github.com/jannikmi/timezonefinder).

To update the generated data:

1. Prerequisites: Python 3, `pip`.
1. Create a virtual environment and install dependency.
    ```
    python3 -m venv .venv
    source .venv/bin/
    pip install timezonefinder
    ```
1. Download the [free basic database](https://simplemaps.com/data/world-cities) from simplemaps and extract `worldcities.csv` to `data`.
1. Run `python3 scripts/build_data.py`.

Data for the top 5000 cities, covering ~3.76B population should result in a < 300 KB JSON file.

## Notes

Weather data comes from the [Open-Meteo.com](https://open-meteo.com/) weather API since it is free and appears to be accurate, comprehensive, and robust.

Weather code data is built manually per the [documentation](https://open-meteo.com/en/docs).

## Credits

-   Idea from [@eanakashima](https://twitter.com/eanakashima/status/1487171747577094145) and [@jglovier](https://twitter.com/jglovier/status/1487210630088060933).
-   Weather data by [Open-Meteo.com](https://open-meteo.com/).
