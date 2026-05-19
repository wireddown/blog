<h1 style="display: flex; text-align: center;">
  <img src="favicon.png" width="32" height="32" />
  <div style="margin-top: -6px; margin-left: 9px;">Down to the Wire</div>
</h1>

This repository represents and hosts my blog [downtothewire.io/blog](https://downtothewire.io/blog)

### License

The following directories and their contents are Copyright Joe Friedrichsen and licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/legalcode).

    all_collections/
    assets/gallery/

The site customizes [sharadcodes/jekyll-theme-serial-programmer](https://github.com/sharadcodes/jekyll-theme-serial-programmer), which is [MIT Licensed](https://github.com/sharadcodes/jekyll-theme-serial-programmer/blob/main/LICENSE), and uses the [same license](https://github.com/wireddown/blog/blob/main/LICENSE).

### Quick start

```pwsh
# Install ruby and native build tools
winget install --exact --id=RubyInstallerTeam.Ruby.3.4
ridk install 1,3
ridk enable

# Initialize the build environment
bundle install

# Serve locally
bundle exec jekyll serve --port 4001
start  http://127.0.0.1:4001/blog/
```
