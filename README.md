# larypsed.com

personal website and portfolio of georgi dimitrov, built with jekyll and hosted on github pages.

## content

all site content lives in `_data/`. edit these files to update the site — no code changes needed.

| file | what it controls |
|------|-----------------|
| `paintings.yml` | paintings gallery (slug, title, caption, file, optional thumb) |
| `drawings.yml` | drawings gallery (slug, title, caption, file) |
| `space.yml` | installation views (slug, title, caption, file) |
| `about.yml` | bio, activities, and exhibition history |
| `contacts.yml` | phone number and social links |

**to add a painting or drawing:**
1. upload the image to `images/YYYY/` (paintings) or `images/drawing/` (drawings)
2. add an entry at the top of the relevant yml file
3. commit — github pages rebuilds automatically

**thumb** is optional for paintings and space entries — if omitted, the full image is used as the thumbnail.

## development

```bash
bundle exec jekyll serve
```
