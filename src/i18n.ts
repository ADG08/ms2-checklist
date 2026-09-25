import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import esItems from "./locales/es-items.json";
import frItems from "./locales/fr-items.json";

const resources = {
  fr: {
    translation: {
      nav: {
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
      upload: {
        loading: "Lecture...",
        import: "Importer une save",
        drop: "Deposer ou cliquer",
      },
      checklist: {
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
      upload: {
        loading: "Reading...",
        import: "Import save",
        drop: "Drop or click",
      },
      checklist: {
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
      upload: {
        loading: "Leyendo...",
        import: "Importar partida",
        drop: "Soltar o clic",
      },
      checklist: {
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
  lng: localStorage.getItem("ms2-language") ?? "fr",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  initAsync: false,
  react: { useSuspense: false },
});

export default i18n;
