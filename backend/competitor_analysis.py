# backend/competitor_analysis.py
from collections import Counter

def competitor_share(platform_products):
    """
    Count occurrences of each product/brand across platforms.
    platform_products: dict {platform: list_of_products}
    Returns: dict {platform: {product: count}}
    """
    result = {}
    for platform, products in platform_products.items():
        result[platform] = dict(Counter(products))
    return result
