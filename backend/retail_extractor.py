retailers = [
"amazon",
"walmart",
"best buy",
"target",
"costco",
"newegg",
"apple store",
"micro center"
]

def extract_retailers(text):

    found = []

    for store in retailers:

        if store in text.lower():
            found.append(store)

    return found
