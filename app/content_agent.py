from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def generate_blog(title, summary):

    prompt = f"""
    Write a travel article.

    Title:
    {title}

    Summary:
    {summary}

    Create:
    - Blog article
    - SEO friendly
    - 500 words
    """

    response = client.chat.completions.create(
        model="qwen/qwen3.8-27b",
        messages=[
            {
                "role":"user",
                "content":prompt
            }
        ]
    )

    return response.choices[0].message.content