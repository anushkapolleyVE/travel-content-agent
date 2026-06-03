from app.rss_agent import get_articles

articles = get_articles()

for article in articles[:5]:
    print(article["title"])