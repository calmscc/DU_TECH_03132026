import random

retailers = [
"Amazon",
"Walmart",
"Best Buy",
"Target",
"Costco",
"Newegg",
"Apple Store",
"Micro Center"
]

phrases = [
"The best place to buy PRODUCT is STORE.",
"Many shoppers buy PRODUCT from STORE.",
"Consumers recommend STORE for PRODUCT.",
"Top retailers selling PRODUCT include STORE.",
"You can purchase PRODUCT at STORE.",
"STORE offers competitive prices for PRODUCT.",
"Experts recommend STORE when shopping for PRODUCT.",
"Many reviews mention STORE for PRODUCT."
]

extras = [
"because of pricing.",
"because of discounts.",
"because of fast shipping.",
"because of availability.",
"because of quality.",
"because of return policies."
]

responses = []

for store in retailers:

    for phrase in phrases:

        for extra in extras:

            text = phrase.replace("STORE",store)

            responses.append(text + " " + extra)


def query_ai(prompt):

    response = random.choice(responses)

    return response
