# Olymp Florbal Tréninky

Mobilní PWA pro trenéra florbalu (sestavovač tréninků, knihovna aktivit, 20týdenní plán).
Statický projekt bez build kroku: `index.html` (vše inline), `manifest.webmanifest`, `sw.js`, `icons/`, `vercel.json`.

## Lokální spuštění
```
python3 -m http.server 8000   # pak http://localhost:8000
```
Service worker funguje jen na `https://` nebo `localhost`.

## Nasazení na Vercel
Importuj GitHub repozitář ve Vercelu, Framework Preset „Other“, bez build příkazu a bez output directory (kořen repozitáře).

## Aktualizace
Při změně `index.html` zvyš `CACHE` v `sw.js` (např. `olymp-florbal-v2`), ať se zařízením nabídne nová verze.
Data se ukládají do `localStorage` v prohlížeči (klíč `olymp-florbal-v1`).
