---
---

const tags = { {% for tag in site.tags %}{% capture tag_name %}{{ tag | first }}{% endcapture %}{{ tag_name | replace: " ", "_" | replace: "-", "__" }}: [{% for post in site.tags[tag_name] %}{ url: `{{ site.baseurl }}{{ post.url }}`, date: `{{post.date | date_to_string}}`, title: `{{post.title}}`},{% endfor %}],{% endfor %} }

window.onload = function () {
  document.querySelectorAll(".tag").forEach((tag) => {
    tag.addEventListener("click", function (e) {
      const lower_name = e.target.innerText.replace(" ","_").replace("-", "__");
      const tag_keys = Object.keys(tags);
      const lower_keys = tag_keys.map((k) => k.toLocaleLowerCase());
      const key_index = lower_keys.indexOf(lower_name);
      const tag_name = tag_keys[key_index];
      const posts = tags[tag_name];
      let html = ``
      posts.forEach(post=>{
        html += `
        <a class="modal-article" href="${post.url}">
          <h4 class="modal-article-title">${post.title}</h4>
          <small class="modal-article-date">${post.date}</small>
        </a>
        `
      })
      document.querySelector("#tag-modal-title").innerText = tag_name.replace("__","-").replace("_", " ");
      document.querySelector("#tag-modal-content").innerHTML = html;
      document.querySelector("#tag-modal-bg").classList.toggle("open");
      document.querySelector("#tag-modal").classList.toggle("open");
    });
  });

  document.querySelector("#tag-modal-bg").addEventListener("click", function(){
    document.querySelector("#tag-modal-title").innerText = "";
    document.querySelector("#tag-modal-content").innerHTML = "";
    document.querySelector("#tag-modal-bg").classList.toggle("open");
    document.querySelector("#tag-modal").classList.toggle("open");
  })
};
