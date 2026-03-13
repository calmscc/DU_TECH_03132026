import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

platforms = {
    "ChatGPT":"gpt-4o-mini",
    "Gemini":"gpt-4o-mini",
    "Copilot":"gpt-4o-mini"
}

def query_ai(product):

    query = f"What are the most popular brands or products for {product}? Give a ranked list."

    results = {}

    for platform, model in platforms.items():

        try:

            response = client.chat.completions.create(
                model=model,
                messages=[{"role":"user","content":query}]
            )

            results[platform] = response.choices[0].message.content

        except Exception as e:

            results[platform] = str(e)

    return results
