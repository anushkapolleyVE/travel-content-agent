import feedparser

RSS_FEEDS = [
    "https://rss.nytimes.com/services/xml/rss/nyt/Travel.xml",
    "https://www.lonelyplanet.com/news/rss.xml",
]

def get_articles():

    results = []

    for url in RSS_FEEDS:

        feed = feedparser.parse(url)

        for item in feed.entries:

            results.append(
                {
                    "title": item.title,
                    "link": item.link,
                    "summary": getattr(
                        item,
                        "summary",
                        ""
                    )
                }
            )

    return results