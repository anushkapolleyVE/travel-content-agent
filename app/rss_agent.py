import feedparser

RSS_FEEDS = [

    "https://www.lonelyplanet.com/news/rss.xml",

    "https://rss.nytimes.com/services/xml/rss/nyt/Travel.xml"
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