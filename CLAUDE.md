# DCA Cockpit — contexte projet pour Claude

Ce fichier est lu automatiquement par Claude Code (et utile à toute session Claude). Il contient le contexte essentiel pour ne rien réexpliquer.

## Vision produit

**DCA Cockpit** est un side project d'Hubert (Account Executive en SaaS data protection). Objectif : outil web + app iOS qui donne aux investisseurs particuliers un **multiplicateur DCA hebdomadaire** indiquant combien investir cette semaine selon la peur du marché et le drawdown des indices.

**Modèle économique** : freemium.
- Plan gratuit : signal hebdo, 1 portefeuille, AdSense en bas
- Plan premium (1,99 €/mois early adopters, puis 2,99 €/mois) : multi-portefeuilles, alertes push, backtest, export fiscal
- Affiliation brokers (Trade Republic, Bitpanda, Shares) en parallèle

**Nom de domaine** : `cockpit.rocapp.eu`

## Stack technique

- **Framework** : Next.js 16.2.4, App Router, React 19, TypeScript
- **Styling** : Tailwind v4 + Lightning CSS + `@theme inline`, design system custom (cool off-white / warm anthracite, fonts Fraunces + Geist + JetBrains Mono)
- **Auth + DB** : Firebase (Auth Email + Google, Firestore région eur3)
- **Hosting** : Cloudflare Workers (static assets, gratuit illimité), domaine custom `cockpit.rocapp.eu`
- **Repo** : `github.com/RocApp-eu/dca-cockpit` (public)
- **Code Next.js** : sous-dossier `web/`
- **Build** : `cd web && npm ci && npm run build` (export statique vers `web/out/`)
- **Deploy** : `npx wrangler deploy` lit `wrangler.toml` à la racine, pointe vers `./web/out`

Pas de SSR, pas d'API routes, pas de server actions. Tout est static export, le dynamic est côté client (Firebase).

## Décision clé : signal hebdomadaire (pas mensuel)

Le signal était initialement mensuel, **passé en hebdomadaire le 2026-04-23**. Voir `memory/project_cadence_hebdo.md` côté Cowork. Résumé :

- Publication chaque **dimanche 20h** via cron GitHub Actions
- Formule lissée anti-whipsaw : `multi_semaine = 0,6 × multi_calculé + 0,4 × multi_semaine_précédente`, bande morte si diff < 0,1
- Dual-display dans le cockpit : signal hebdo + moyenne mensuelle courante + tendance 4 semaines
- Framing : "multiplicateur valide pour cette semaine", éviter la perception day-trading
- Pages SEO : `/signal/semaine-XX-AAAA`, archive 12 dernières semaines + vue groupée par mois

## Conventions de code

- **`"use client"`** obligatoire sur tout fichier qui utilise hooks React (useState, useEffect, etc.). Tous les composants côté client sont déjà annotés.
- **Pas de virgules typographiques (`—`)** dans les textes utilisateurs ou commentaires. Utiliser de vraies virgules.
- **Mobile responsive** : breakpoint principal à 1024px, défini dans `globals.css` sous `@media (max-width: 1024px)`.
- **Components dashboard** : un fichier par composant dans `web/src/components/dashboard/`, exports nommés.
- **Components landing** : pareil dans `web/src/components/landing/`.
- **Math DCA** : centralisé dans `web/src/lib/dca-math.ts`.

## Documents projet à connaître

- `PROGRAMME-ACQUISITION.md` — guide hebdo pré-mâché 12 semaines (Phase 0 prep, Phase 1 launch, Phase 2 routine, Phase 3 SEO programmatique)
- `PROPALE_DCA_COCKPIT_WEB.md` — propale technique initiale (peut être obsolète sur certains points)
- `editorial/` — drafts éditoriaux
- `mockup/` — mockups Figma exportés HTML

## Profil utilisateur (Hubert)

- **Account Executive** en SaaS data protection
- **Pas développeur**, attend qu'on lui mâche le travail technique mais aime garder le contrôle des décisions stratégiques
- **Préfère** réponses **courtes, structurées, sans détour, sans tirets `—` à la place des virgules**
- Veut un **conseiller critique** pas un exécutant : challenger ses choix et proposer des alternatives en amont
- Travaille avec **GitHub Desktop** (pas la CLI), Mac, Chrome, VS Code dispo si besoin
- Compte GitHub : `RocApp-eu`
- Compte Cloudflare actif sur `rocapp.eu`

## Roadmap immédiate (2026-04-23+)

Tâches en cours, ordre suggéré :

1. **Pivot UI cockpit** : mois → semaine, dual-display dans SignalHero, TrustDataCard historique 8 dernières semaines
2. **Formule lissée** : implémenter dans `web/src/lib/dca-math.ts`
3. **MAJ PROGRAMME-ACQUISITION.md** : rituel signal mensuel → hebdo
4. **GitHub Actions cron** : `.github/workflows/weekly-signal.yml`, dimanche 20h, fetch APIs + write Firestore + commit
5. **SEO programmatique** : 14 actifs × 8 montants = 112 pages `/dca/[actif]/[montant]`, plus pages méthode
6. **V2** : plan DCA personnalisé selon patrimoine (Premium only, post-launch)

## Quand l'utilisateur demande "où on en est"

Lire `memory/MEMORY.md` côté Cowork ou parcourir les commits récents du repo via `git log --oneline -20`. Les TaskList Cowork tiennent à jour la roadmap fine.
