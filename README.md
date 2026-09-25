# MS2 Checklist

Je construis [ms2checklist.com](https://ms2checklist.com) en public.

C'est un tracker pour Mortal Shell II. Succès, shells, armes, armes secondaires, beacons, tarstones, boss, fragments. Tu coches à la main, ou tu droppes ton `WorldState_*.sav` et le site lit le fichier **dans ton navigateur**. Rien n'est envoyé. Pas de compte. La progression reste dans `localStorage`.

FR / EN / ES.

## Pourquoi

J'en avais marre de jongler entre le wiki, Steam et un tableau. Je voulais un truc simple, utilisable sur téléphone, et qui puisse lire une save sans que mon fichier parte quelque part.

Le site n'est pas un guide pas à pas. C'est la checklist à côté du jeu. Le guide Steam, c'est pour les missables et le lien. Ici, c'est pour cocher.

## Run

```bash
npm install
npm run dev
```

http://localhost:5173

## Save (Windows)

`%LOCALAPPDATA%\MortalShell2\Saved\SaveGames`

Fichier typique: `WorldState_0.sav`

Ne commitez jamais de `.sav`.

## Comment c'est bâti

App React 19 + TypeScript + Vite. Zéro backend.

- Les sections viennent d'un catalogue (`src/data/sections.ts`). Tu ajoutes une entrée, le rail, les images et l'import suivent.
- Les items viennent des JSON / pins. Un item a un id, une section, un nom, éventuellement un groupe, une image, des aliases.
- Les règles de save et des succès dérivés sont isolées (`src/data/rules.ts`). Le matching save, c'est de la data, pas du UI.
- L'UI (checklist, rail, drop de save) ne connaît pas Mortal Shell. Elle affiche ce qu'on lui passe.

Ajouter un item: data + image `.webp` + éventuellement un id de save. Pas besoin de retoucher les composants.

## En cours

- Tracker utilisable, import save, 3 langues, responsive
- Forum: plus tard
- Carte: les pins sont là, l'UI pas encore branchée
- Le matching save n'est pas magique. Si un tarstone ou un beacon ne coche pas, dis-le, je mappe l'id

## Build in public

Je poste au fur et à mesure. Si tu 100% le jeu, si un succès est râtable, ou si ta save ne matche pas, ouvre un issue ou laisse un commentaire sur le guide Steam.
