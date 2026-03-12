from collections import Counter

def competitor_share(results):

    all_products = []

    for r in results:
        all_products.extend(r["products"])

    counts = Counter(all_products)

    return dict(counts)
