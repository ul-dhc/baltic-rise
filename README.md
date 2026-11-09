# Baltic-RISE

English-language website for the Baltic-RISE research project at the University of Latvia, Faculty of Humanities.

## Website

A static website built with HTML, CSS and JavaScript. It includes twelve writer biographies with lifespan bars, an interactive birthplace map, project and team information, and image credits. The homepage selects three portraits from a six-person pool on each visit. Reading controls provide larger text and a dark theme.

Project descriptions and biographies follow the supplied website information document. Researcher and supervision roles reflect the project team’s instructions. Project number and implementation dates remain visible placeholders until confirmed.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` publishes the website when changes are pushed to `main`. In repository Settings → Pages, select GitHub Actions as the build source. The workflow uploads only the website files and assets.

For a custom domain, add it in repository Settings → Pages and configure the domain’s DNS records. Add a `CNAME` file containing the domain if required.

## Local preview

From the repository directory:

```sh
python3 -m http.server 8765
```

Open http://localhost:8765/.

## Files

- `index.html`: project, biographies, map, team and contact link.
- `credits.html`: portrait credits, reuse terms and map sources.
- `styles.css`: layout, themes, interaction states and responsive styles.
- `script.js`: navigation, search, reading controls and map interaction.
- `preferences.js`: saved reading choices.
- `portraits.js`: homepage portrait selection.
- `map-data.js` and `assets/places.json`: birthplace data.
- `assets/credits.json` and `assets/logos/sources.json`: asset provenance.

## Assets and accessibility

Image rights vary by source; see the credits page and asset records before reusing them. Institutional and funding logos use official colour artwork in light mode and official white transparent artwork in dark mode. UI icons are from Lucide under the ISC licence, included in `assets/LUCIDE-LICENSE.txt`.

The website supports keyboard navigation, visible focus, reduced motion, browser zoom and text-size controls. Biographies and source links work without JavaScript. Map coordinates are approximate, and borders are present-day. No formal accessibility conformance claim is made.

Reading preferences are stored locally in the visitor’s browser. The website has no analytics or contact form. Chiara Gianni’s mail icon opens the visitor’s email client.

Website by the [University of Latvia Digital Humanities Center](https://dhc.lu.lv).

## Archival imagery in the design

The opening portraits sit over a transparent mimosa cutout derived from Aspazija’s postcard, with no manuscript page behind them. The project introduction and digital corpus section use archival imagery from Aspazija’s correspondence and Ellen Key’s 1908 postcard. The original violet accent is retained; mimosa yellow from Aspazija’s postcard highlights hover and active states. No separate manuscript gallery is added. Credits and item-specific reuse statements are in `credits.html`; download URLs and references for the collected material are in `assets/manuscripts/sources.json`. Ellen Key’s provider CC BY statement is preserved in `assets/manuscripts/ellen-1908-rights.xml` (no version specified by the provider). Web files retain the full frame; CSS crops are used in the design.
