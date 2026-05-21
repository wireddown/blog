---
layout: default
title: Posts
---

## All posts

{% for post in site.posts %}
* <small>`{{ post.date | date_to_string }}`</small> <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
{% endfor %}

<br />
