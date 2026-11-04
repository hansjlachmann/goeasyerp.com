# goeasyerp.com

Static landing page for [GoEasyERP](https://github.com/hansjlachmann/goeasyerp), packaged as a
small nginx container (linux/arm64 and linux/amd64).

- `site/` – HTML, CSS, logos, favicons and self-hosted fonts (Inter, IBM Plex Mono; SIL OFL)
- `nginx.conf`, `security-headers.inc` – server config (gzip, caching, security headers, `/healthz`)
- `Dockerfile` – `nginxinc/nginx-unprivileged:alpine`, listens on 8080, non-root

## Run locally

```sh
docker build -t goeasyerp-web .
docker run --rm -p 8080:8080 goeasyerp-web
```

Open <http://localhost:8080>; health check at <http://localhost:8080/healthz>.

## Image

GitHub Actions builds and pushes `ghcr.io/hansjlachmann/goeasyerp.com` on every push to `main`
(`latest`) and on `v*` tags (the version).

## Licence

MIT, see [LICENSE](LICENSE). Fonts keep their own SIL Open Font Licence (see `site/assets/fonts/`).
