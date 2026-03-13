# backend/analysis_engine.py

from collections import Counter
import itertools

def visibility_score(platform_products, brand):
    """
    Returns a visibility score per platform.
    If the brand exists in the product list, score = 1, else 0.
    """
    score = {}
    for platform, products in platform_products.items():
        if not isinstance(products, list):
            products = list(products)  # fallback in case it's not a list
        score[platform] = 1 if brand in products else 0
    return score


def accuracy_score():
    """
    Placeholder function for AI accuracy.
    Replace with your real logic if needed.
    """
    # Example: fixed dummy accuracy for now
    return 0.85


def competitor_share(platform_products):
    """
    Count occurrences of each product/brand across platforms.
    Returns a dictionary of {platform: {product: count}}
    """
    result = {}
    for platform, products in platform_products.items():
        if not isinstance(products, list):
            products = list(products)  # fallback
        counts = Counter(products)
        result[platform] = dict(counts)
    return result


def heatmap(platform_products):
    """
    Generate a simple heatmap-style frequency for all products.
    Returns a dict of {product: total_count_across_platforms}
    """
    all_products = list(itertools.chain.from_iterable(platform_products.values()))
    counts = Counter(all_products)
    return dict(counts)
