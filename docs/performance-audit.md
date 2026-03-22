# Auditoria de Performance do Site IBR Music

Data da análise: 20 de março de 2026

## Resumo executivo

- O gargalo dominante do site era entrega de imagem: `public/` tinha 265 MB e a home referenciava fotos individuais de 12 MB a 22 MB.
- O site agora usa o bucket público `site-assets` no projeto Supabase `huxrqluykzicckxjgchf`.
- Os assets otimizados foram publicados em `site/v1`, com favicons e logos servidos pelo Storage e fotos da galeria carregadas sob demanda.
- A saída otimizada caiu de 265 MB para 10,0 MB.
- Na home, o Lighthouse ficou em `78/100` em performance, com `873 KB` transferidos e `14` requests no carregamento auditado.

## Baseline encontrado

- `public/` total: 265 MB.
- Arquivos de foto originais: 16.
- Total de tags `<img>` no site: 46.
- Maiores arquivos:
  - `DSC09849.jpg`: 22 MB
  - `DSC07901-Enhanced-NR.jpg`: 22 MB
  - `DSC00792-Enhanced-NR.jpg`: 21 MB
- Dimensões originais recorrentes:
  - `6000x4000`
  - `4000x6000`
  - `4550x3033`
- Gargalos de código:
  - Home carregava hero, fundo da seção seguinte, fundo da seção de features e slides da galeria no HTML inicial.
  - `main.js` e `animations.js` aplicavam parallax em paralelo no hero.
  - Não havia lazy loading controlado para slides.
  - Não existia integração atual com Supabase Storage para imagens/favicons.

## O que foi implementado

### Storage Supabase

- Bucket criado/atualizado: `site-assets`
- Base pública:
  - `https://huxrqluykzicckxjgchf.supabase.co/storage/v1/object/public/site-assets/site/v1`
- Estrutura publicada:
  - `images/`
  - `logos/`
  - `icons/`

### Otimização de assets

- Script: `scripts/optimize-assets.mjs`
- Saída gerada em: `supabase/.generated/site-assets`
- Relatório detalhado: `docs/asset-optimization-summary.json`
- Estratégia:
  - fotos com duas variantes (`sm` e `lg`)
  - logos e favicons redimensionados
  - slugs ASCII padronizados para URL

### Integração no frontend

- Favicons e logos passaram a apontar para o Storage do Supabase.
- Hero principal usa preload e `srcset`.
- Slides da galeria passaram a usar `data-asset-photo` com carregamento controlado por JS.
- A galeria só começa a baixar imagens quando entra próximo do viewport.
- Imagens abaixo da dobra usam lazy loading por `IntersectionObserver`.
- O parallax duplicado no hero foi removido.
- Parallax respeita `prefers-reduced-motion`.

## Resultado medido

### Assets

- Origem: `277.413.296` bytes
- Otimizado: `10.442.181` bytes
- Redução aproximada: `96,2%`

Exemplos:

- `DSC07901-Enhanced-NR.jpg`: de `22,6 MB` para `676 KB` na variante `lg`
- `DSC09849.jpg`: de `23,3 MB` para `568 KB` na variante `lg`
- `SFP03553.jpg`: de `20,0 MB` para `580 KB` na variante `lg`

### Lighthouse da home

Arquivo: `docs/lighthouse-home.json`

- Performance: `78/100`
- FCP: `1,5 s`
- LCP: `6,0 s`
- Speed Index: `1,6 s`
- TBT: `40 ms`
- CLS: `0`
- Requests: `14`
- Transferência total: `873.302` bytes

Principais recursos ainda mais pesados no carregamento auditado:

- Hero principal: `677 KB`
- `css/pages.css`: `59 KB`
- Logo hero: `50 KB`

## Próximos ganhos recomendados

- Converter o hero principal e a logo hero para `WebP` ou `AVIF`. Hoje o hero ainda domina o LCP.
- Introduzir minificação de CSS e JS. O Lighthouse estimou economia de cerca de `22 KiB` em CSS e `8 KiB` em JS.
- Revisar `pages.css` para remoção de CSS não usado. A auditoria estimou `40 KiB` de sobra.
- Validar a política de cache no endpoint público do Storage. O asset está servindo corretamente, mas o header observado foi `cache-control: no-cache`, o que merece revisão se o objetivo for cache forte no browser.
- Se houver tempo, substituir o slider da home por menos imagens iniciais ou por uma primeira imagem fixa com hidratação posterior.

## Operação

Gerar os assets novamente:

```bash
node scripts/optimize-assets.mjs
```

Publicar no Supabase:

```bash
SUPABASE_ACCESS_TOKEN=... node scripts/sync-supabase-storage.mjs
```
