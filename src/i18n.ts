import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import esItems from "./locales/es-items.json";
import frItems from "./locales/fr-items.json";
import { languageFromPath } from "./lib/route";

const resources = {
  fr: {
    translation: {
      nav: {
        home: "Accueil",
        tracker: "Tracker",
        forum: "Forum",
        map: "Carte",
        site: "Site",
        progress: "Progression",
        skip: "Aller au contenu",
        menu: "Ouvrir les sections",
        close: "Fermer les sections",
        soon: "Bientot",
      },
      ui: {
        remaining: "{{count}} restants",
        complete: "Accompli",
        confirmReset: "Effacer toute la progression ?",
      },
      coming: {
        forum: "Un espace pour parler des runs et des shells.",
      },
      hero: {
        privacy: "La progression reste dans ton navigateur. Une save est optionnelle et n'est jamais envoyée.",
      },
      home: {
        kicker: "Tracker communautaire",
        title: "Checklist Mortal Shell II",
        intro:
          "Retrouve les succès, shells, armes, boss, beacons, fragments et tarstones. Coche ta progression à la main ou importe ta sauvegarde localement, sans compte et sans envoi de fichier.",
        cta: "Ouvrir la checklist",
        sectionsTitle: "Tout suivre dans Mortal Shell II",
        itemCount: "{{count}} éléments",
        aboutTitle: "Pensé pour le 100 %",
        aboutText:
          "MS2 Checklist est un fan site indépendant construit avec la communauté pour centraliser les découvertes, signaler les objectifs manquables et aider chaque joueur à terminer sa partie.",
      },
      seo: {
        title: "La checklist communautaire pour Mortal Shell II",
        description:
          "Prépare ton 100 %, retrouve les succès manquables et suis les shells, armes, boss, beacons, fragments et tarstones dans un seul outil gratuit.",
        achievementsTitle: "Achievements et succès",
        achievementsText:
          "Consulte la liste des achievements de Mortal Shell II, filtre les objectifs missables et coche chaque succès terminé.",
        saveTitle: "Tracker de sauvegarde privé",
        saveText:
          "Importe ton fichier WorldState directement dans ton navigateur. Son contenu reste sur ton appareil et n'est envoyé à aucun serveur.",
        communityTitle: "Construit avec la communauté",
        communityText:
          "MS2 Checklist est un fan site indépendant pensé pour partager les découvertes, corriger les emplacements et aider les joueurs à terminer le jeu.",
      },
      upload: {
        loading: "Lecture...",
        import: "Importer une save",
        drop: "Deposer ou cliquer",
      },
      checklist: {
        heading: "Checklist Mortal Shell II : {{section}}",
        intro: "Suis ta progression dans Mortal Shell II, coche chaque élément ou importe ta sauvegarde localement. Aucune donnée n'est envoyée.",
        beaconIntro: "Les 46 beacons à purifier pour le succès So Fresh, So Clean. Marrowkeep, Widow's Overlook et Outskirts of Mammon ne comptent pas.",
        beaconNote: "Cette liste n'est pas liée à l'import de save. Coche les beacons à la main.",
        search: "Filtrer...",
        hideDone: "Masquer ce qui est fait",
        onlyMissable: "Missables",
        before: "Avant {{when}}. {{text}}",
        reset: "Effacer la progression",
        empty: "Rien dans ce filtre.",
        allDone: "Tout est fait.",
        groups: {
          Support: "Soutien",
          Combat: "Combat",
          Infusion: "Infusion",
          Ability: "Aptitude",
        },
        sections: {
          achievements: "Succès",
          boss: "Boss",
          shell: "Shells",
          weapon: "Armes",
          sidearm: "Armes secondaires",
          fragment: "Fragments",
          beacon: "Beacons",
          tarstone: "Tarstones",
        },
      },
      toast: { unlocked: "Succès débloqué" },
      map: {
        filters: "Filtres de carte",
        allPins: "Tout",
        imageAlt: "Carte de Fallgrim",
        help: "Filtre un type, puis clique un pin pour le cocher.",
        kinds: {
          beacon: "Beacons",
          tarstone: "Tarstones",
          boss: "Boss",
          shell: "Shells",
          weapon: "Armes",
          sidearm: "Armes secondaires",
          fragment: "Fragments",
        },
      },
      errors: { upload: "Echec de l'import.", notGvas: "Ce fichier n'est pas une save Unreal GVAS." },
      items: frItems,
    },
  },
  en: {
    translation: {
      nav: {
        home: "Home",
        tracker: "Tracker",
        forum: "Forum",
        map: "Map",
        site: "Site",
        progress: "Progress",
        skip: "Skip to content",
        menu: "Open sections",
        close: "Close sections",
        soon: "Soon",
      },
      ui: {
        remaining: "{{count}} remaining",
        complete: "Complete",
        confirmReset: "Erase all progress?",
      },
      coming: {
        forum: "A place to talk runs and shells.",
      },
      hero: {
        privacy: "Progress stays in your browser. A save is optional and never uploaded.",
      },
      home: {
        kicker: "Community tracker",
        title: "Mortal Shell II Checklist",
        intro:
          "Track achievements, shells, weapons, bosses, beacons, fragments and tarstones. Check progress manually or import your save locally, with no account and no file upload.",
        cta: "Open the checklist",
        sectionsTitle: "Track everything in Mortal Shell II",
        itemCount: "{{count}} items",
        aboutTitle: "Built for 100% completion",
        aboutText:
          "MS2 Checklist is an independent fan site built with the community to gather discoveries, flag missable objectives and help every player complete the game.",
      },
      seo: {
        title: "The community checklist for Mortal Shell II",
        description:
          "Plan your 100% run, find missable achievements and track every shell, weapon, boss, beacon, fragment and tarstone in one free tool.",
        achievementsTitle: "Achievements and completion",
        achievementsText:
          "Browse the Mortal Shell II achievement list, filter missable objectives and check off every completed achievement.",
        saveTitle: "Private save tracker",
        saveText:
          "Import your WorldState file directly in your browser. It stays on your device and is never uploaded to a server.",
        communityTitle: "Built with the community",
        communityText:
          "MS2 Checklist is an independent fan site for sharing discoveries, correcting locations and helping players complete the game.",
      },
      upload: {
        loading: "Reading...",
        import: "Import save",
        drop: "Drop or click",
      },
      checklist: {
        heading: "Mortal Shell II Checklist: {{section}}",
        intro: "Track your Mortal Shell II progress, check off every item or import your save locally. No data ever leaves your browser.",
        beaconIntro: "The 46 beacons you need to cleanse for So Fresh, So Clean. Marrowkeep, Widow's Overlook and Outskirts of Mammon do not count.",
        beaconNote: "This list is not linked to save import. Check beacons off by hand.",
        search: "Filter...",
        hideDone: "Hide completed",
        onlyMissable: "Missables",
        before: "Before {{when}}. {{text}}",
        reset: "Clear progress",
        empty: "Nothing in this filter.",
        allDone: "Everything is done.",
        groups: {
          Support: "Support",
          Combat: "Combat",
          Infusion: "Infusion",
          Ability: "Ability",
        },
        sections: {
          achievements: "Achievements",
          boss: "Bosses",
          shell: "Shells",
          weapon: "Weapons",
          sidearm: "Sidearms",
          fragment: "Fragments",
          beacon: "Beacons",
          tarstone: "Tarstones",
        },
      },
      toast: { unlocked: "Achievement Unlocked" },
      map: {
        filters: "Map filters",
        allPins: "All",
        imageAlt: "Fallgrim map",
        help: "Filter a type, then click a pin to check it.",
        kinds: {
          beacon: "Beacons",
          tarstone: "Tarstones",
          boss: "Bosses",
          shell: "Shells",
          weapon: "Weapons",
          sidearm: "Sidearms",
          fragment: "Fragments",
        },
      },
      errors: { upload: "Import failed.", notGvas: "This file is not an Unreal GVAS save." },
      items: {},
    },
  },
  es: {
    translation: {
      nav: {
        home: "Inicio",
        tracker: "Tracker",
        forum: "Foro",
        map: "Mapa",
        site: "Sitio",
        progress: "Progreso",
        skip: "Saltar al contenido",
        menu: "Abrir secciones",
        close: "Cerrar secciones",
        soon: "Pronto",
      },
      ui: {
        remaining: "{{count}} pendientes",
        complete: "Completado",
        confirmReset: "¿Borrar todo el progreso?",
      },
      coming: {
        forum: "Un espacio para hablar de runs y shells.",
      },
      hero: {
        privacy: "El progreso se guarda en tu navegador. La partida es opcional y nunca se envia.",
      },
      home: {
        kicker: "Tracker comunitario",
        title: "Checklist de Mortal Shell II",
        intro:
          "Sigue logros, shells, armas, jefes, beacons, fragmentos y tarstones. Marca tu progreso o importa tu partida localmente, sin cuenta y sin enviar archivos.",
        cta: "Abrir la checklist",
        sectionsTitle: "Sigue todo en Mortal Shell II",
        itemCount: "{{count}} elementos",
        aboutTitle: "Creada para completar el 100 %",
        aboutText:
          "MS2 Checklist es un fan site independiente creado con la comunidad para reunir descubrimientos, señalar objetivos perdibles y ayudar a completar el juego.",
      },
      seo: {
        title: "La checklist comunitaria de Mortal Shell II",
        description:
          "Prepara tu partida al 100 %, encuentra logros perdibles y sigue shells, armas, jefes, beacons, fragmentos y tarstones en una herramienta gratuita.",
        achievementsTitle: "Logros y progreso",
        achievementsText:
          "Consulta la lista de logros de Mortal Shell II, filtra los objetivos perdibles y marca cada logro completado.",
        saveTitle: "Tracker de partida privado",
        saveText:
          "Importa tu archivo WorldState directamente en el navegador. Permanece en tu dispositivo y nunca se envía a un servidor.",
        communityTitle: "Creado con la comunidad",
        communityText:
          "MS2 Checklist es un fan site independiente para compartir descubrimientos, corregir ubicaciones y ayudar a los jugadores a completar el juego.",
      },
      upload: {
        loading: "Leyendo...",
        import: "Importar partida",
        drop: "Soltar o clic",
      },
      checklist: {
        heading: "Checklist de Mortal Shell II: {{section}}",
        intro: "Sigue tu progreso en Mortal Shell II, marca cada elemento o importa tu partida localmente. Ningún dato sale de tu navegador.",
        beaconIntro: "Los 46 beacons que hay que purificar para So Fresh, So Clean. Fortuétano, Widow's Overlook y Outskirts of Mammon no cuentan.",
        beaconNote: "Esta lista no está ligada a la importación de partida. Márcalos a mano.",
        search: "Filtrar...",
        hideDone: "Ocultar lo completado",
        onlyMissable: "Missables",
        before: "Antes de {{when}}. {{text}}",
        reset: "Borrar el progreso",
        empty: "Nada en este filtro.",
        allDone: "Todo esta hecho.",
        groups: {
          Support: "Apoyo",
          Combat: "Combate",
          Infusion: "Infusion",
          Ability: "Habilidad",
        },
        sections: {
          achievements: "Logros",
          boss: "Jefes",
          shell: "Shells",
          weapon: "Armas",
          sidearm: "Armas secundarias",
          fragment: "Fragmentos",
          beacon: "Beacons",
          tarstone: "Tarstones",
        },
      },
      toast: { unlocked: "Logro desbloqueado" },
      map: {
        filters: "Filtros del mapa",
        allPins: "Todo",
        imageAlt: "Mapa de Fallgrim",
        help: "Filtra un tipo y pulsa un pin para marcarlo.",
        kinds: {
          beacon: "Beacons",
          tarstone: "Tarstones",
          boss: "Jefes",
          shell: "Shells",
          weapon: "Armas",
          sidearm: "Armas secundarias",
          fragment: "Fragmentos",
        },
      },
      errors: { upload: "Error al importar.", notGvas: "Este archivo no es una partida Unreal GVAS." },
      items: esItems,
    },
  },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: languageFromPath(globalThis.location.pathname),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  initAsync: false,
  react: { useSuspense: false },
});

export default i18n;
