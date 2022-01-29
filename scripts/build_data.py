import csv
import json
import os
from decimal import *
from timezonefinder import TimezoneFinder

NUMBER_OF_CITIES = 5000
US_ONLY = False

cwd = os.getcwd()
# Save some bytes
getcontext().prec = 5
getcontext().rounding = ROUND_HALF_DOWN
tf = TimezoneFinder(in_memory=True)

cities = []
countries = {}
timezones = []

population = 0

with open(os.path.join(cwd, "data/worldcities.csv")) as f:
    reader = csv.DictReader(f.readlines()[: NUMBER_OF_CITIES + 1])

    for row in reader:
        if US_ONLY and row["iso2"] != "US":
            continue

        if row["iso2"] not in countries:
            countries[row["iso2"]] = row["country"]

        lng = Decimal(row["lng"])
        lat = Decimal(row["lat"])

        timezone = tf.unique_timezone_at(lng=lng, lat=lat)
        if timezone is None:
            timezone = tf.timezone_at(lng=lng, lat=lat)
        if timezone is None:
            print(f"Timezone not found for {row}")
        if timezone not in timezones:
            timezones.append(timezone)
        timezone_index = timezones.index(timezone)

        cities.append(
            [
                row["city"],
                row["iso2"],
                row["admin_name"],
                "{0:f}".format(getcontext().create_decimal(lng)),
                "{0:f}".format(getcontext().create_decimal(lat)),
                timezone_index,
            ]
        )

        if row["population"]:
            population += int(float(row["population"]))

objects = [
    ("cities", cities),
    ("countries", countries),
    ("timezones", timezones),
]

for name, object in objects:
    with open(
        os.path.join(cwd, f"public/data/{name}.json"), "w", encoding="utf-8"
    ) as f:
        f.write(json.dumps(object, separators=(",", ":")))

print(f"Population covered: {'{:,}'.format(population)}")
