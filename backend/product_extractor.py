import json
from backend.config import client

def extract_products(text):

    prompt = f"""
Extract product or brand names from this text.

Return ONLY valid JSON like this:
{{"products":["brand1","brand2","brand3"]}}

Text:
{text}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "Return only valid JSON."},
            {"role": "user", "content": prompt}
        ]
    )

    content = response.choices[0].message.content
    print("AI returned:", content)  # helps debugging

    try:
        data = json.loads(content)
        return data.get("products", [])
    except json.JSONDecodeError:
        # fallback: try splitting lines if AI didn't return JSON
        lines = content.split("\n")
        products = []
        for line in lines:
            # remove numbering if present
            line = line.strip()
            if line and any(c.isalnum() for c in line):
                line = line.split(".")[-1].strip()
                products.append(line)
        return products
