import json
import matplotlib.pyplot as plt

colorMapping = [
'blue'
,'green'
,'red'
,'cyan'
,'magenta'
,'yellow'
,'black'
,'white']

# some JSON:
jsonString =  '''[
    {
        "lat": 100,
        "lng": 10,
        "ateco": 1
    },
    {
        "lat": 10,
        "lng": 50,
        "ateco": 2
    }
]'''

data = json.loads(jsonString)

def coordinates(data):
    lats = []
    lngs = []
    colors = []
    for element in data:
        lats.append(element["lat"])
        lngs.append(element["lng"])
        colors.append(colorMapping[element["ateco"]])
    return (lats, lngs, colors)

lats, lngs, colors = coordinates(data)
print(lats)
print(lngs)
plt.scatter(lats,lngs, color=colors)
plt.show()