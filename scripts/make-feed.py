#!/usr/bin/env python3
"""Builds site/blog/feed.xml (RSS 2.0) from the posts in site/blog/<slug>/index.html.

Run it from the project root after adding or changing a post:  python3 scripts/make-feed.py
A post needs an <h1>, a <time datetime="YYYY-MM-DD"> and a meta description.
"""
import glob, html, re, os
from datetime import datetime, timezone
from email.utils import format_datetime

BASE = "https://goeasyerp.org"
posts = []
for path in glob.glob("site/blog/*/index.html"):
    slug = os.path.basename(os.path.dirname(path))
    s = open(path, encoding="utf-8").read()
    title = html.unescape(re.sub(r"<[^>]+>", "", re.search(r"<h1>(.*?)</h1>", s, re.S).group(1))).strip()
    date = re.search(r'<time datetime="(\d{4}-\d{2}-\d{2})"', s).group(1)
    desc = html.unescape(re.search(r'name="description" content="([^"]*)"', s).group(1))
    posts.append((date, slug, title, desc))
# newest first; within one day, the later-listed post in the index first is not known, so sort by slug
posts.sort(key=lambda p: (p[0], p[1]), reverse=True)

def rfc822(date):
    d = datetime.strptime(date, "%Y-%m-%d").replace(hour=12, tzinfo=timezone.utc)
    return format_datetime(d)

esc = lambda t: html.escape(t, quote=False)
items = []
for date, slug, title, desc in posts:
    url = f"{BASE}/blog/{slug}/"
    items.append(f"""    <item>
      <title>{esc(title)}</title>
      <link>{url}</link>
      <guid isPermaLink="true">{url}</guid>
      <pubDate>{rfc822(date)}</pubDate>
      <description>{esc(desc)}</description>
    </item>""")

now = format_datetime(datetime.now(timezone.utc))
feed = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>GoEasyERP Blog</title>
    <link>{BASE}/blog/</link>
    <atom:link href="{BASE}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <description>News, release notes and articles from the GoEasyERP project.</description>
    <language>en</language>
    <lastBuildDate>{now}</lastBuildDate>
{chr(10).join(items)}
  </channel>
</rss>
"""
open("site/blog/feed.xml", "w", encoding="utf-8").write(feed)
print(f"{len(posts)} posts written to site/blog/feed.xml")
