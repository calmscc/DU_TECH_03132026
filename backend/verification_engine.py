def verify_product_accuracy(platform_products, expected_brand):

    incorrect_mentions = []

    for platform, products in platform_products.items():

        if expected_brand not in products:

            incorrect_mentions.append(platform)

    accuracy_score = (
        (len(platform_products) - len(incorrect_mentions))
        / len(platform_products)
    ) * 100

    return {
        "accuracy_score": round(accuracy_score,2),
        "missing_platforms": incorrect_mentions
    }
