---
layout: default
title: Tags
---

## All tags

<div class="tags">
{% for c in site.tags %}
  <a href="#!" class="tag">{{c[0] | downcase}}</a>
{% endfor %}
</div>

## Posts by tag

{% for tag_pair in site.tags %}

#### {{ tag_pair[0] }}

{% for post in tag_pair[1] %}
* <small>`{{ post.date | date_to_string }}`</small> <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
{% endfor %}

{% endfor %}

<br />
