# Propale, DCA Cockpit Web

Version web pro et indépendante de l'app iOS, avec compte utilisateur, calculateur de projection et monétisation AdMob.

---

## 1. Positionnement

**Nom produit suggéré :** DCA Cockpit (web), ou sous-marque type "DCA Cockpit, Pilot" pour distinguer du mobile.

**Promesse :** "Sachez quand et combien investir chaque mois, en 30 secondes."

**Cible :** Investisseurs particuliers débutants à intermédiaires (ETF, crypto), qui font du DCA mais doutent du moment et du montant.

**Différenciation vs app iOS :** Le web sert de point d'entrée SEO, pédagogique, avec calculateur de projection (fonction que l'app n'a pas). L'app iOS devient le "compagnon quotidien" vendu dans le dashboard du web.

---

## 2. Stack technique recommandée

**Reco : Next.js 14 (App Router) + Firebase**

Pourquoi Firebase plutôt que Supabase dans ton cas :

| Critère | Firebase | Supabase |
|---|---|---|
| Compte déjà en place | Oui | À créer |
| AdMob intégration | Native (même compte Google) | Externe |
| Analytics & A/B test | GA4 + Remote Config inclus | À ajouter |
| Auth Google/Apple/Email | Tout inclus | Inclus aussi |
| Courbe d'apprentissage | Faible (UI claire) | Moyenne (SQL) |
| Coût au démarrage | Gratuit (Spark plan) | Gratuit |

**Firebase = choix logique** parce que tu as déjà le compte, AdMob est Google, et ton objectif est "automatiser au max". Firestore (NoSQL) suffit largement pour le use case (profils, paramètres, historique d'investissement).

**Stack complète :**
- **Frontend :** Next.js 14 + TypeScript + Tailwind CSS
- **UI kit :** shadcn/ui (composants pro, personnalisables, open source)
- **Auth :** Firebase Auth (Google + Apple + Email/MDP)
- **Base de données :** Firestore
- **Hébergement :** Vercel (gratuit jusqu'à 100k visites/mois, déploiement auto via Git)
- **Domaine :** à réserver (suggestion, dcacockpit.com ou dca-cockpit.app)
- **Publicité :** Google AdSense pour le web (AdMob = mobile uniquement). Même compte Google.
- **Analytics :** Firebase Analytics + Vercel Analytics

**Coût mensuel estimé au démarrage :** 0 à 15€ (domaine mutualisé).

---

## 3. Arborescence du site

```
/                      Landing page publique
/calculator            Calculateur de projection (public, sans login)
/dashboard             Dashboard utilisateur (login requis)
/signal                Signal DCA du jour (login requis, cœur produit)
/history               Historique des investissements saisis (login requis)
/learn                 Pages pédagogiques (public, SEO)
  /learn/fear-greed
  /learn/msci-drawdown
  /learn/dca-strategy
/app                   Landing "version iOS native" avec lien App Store
/pricing               Gratuit vs Premium (sans pub)
/login
/signup
/account               Paramètres, suppression de compte
/privacy, /terms
```

---

## 4. Fonctionnalités cœur

### 4.1. Signal DCA du jour (page `/signal`)

Refonte pédagogique de ce qui existe dans l'app iOS. **Objectif : zéro infobulle nécessaire.**

**Écran :**

> **Aujourd'hui, investissez 1,5x votre montant habituel.**
> 
> Si vous mettez habituellement 200€, mettez 300€ ce mois-ci.

Sous le verdict, 2 cartes explicatives, avec icônes et phrases simples :

- **Le marché crypto a peur** (Fear & Greed = 25/100)
  "Les investisseurs sont inquiets, c'est souvent le bon moment pour acheter."
- **Les actions mondiales ont baissé de 8%**
  "Par rapport à leur plus haut récent. Les prix sont plus intéressants."

Plus un bouton "Comment ce signal est calculé ?" qui ouvre la page `/learn/dca-strategy`.

### 4.2. Calculateur de projection (page `/calculator`)

Fonction nouvelle, absente de l'app iOS, à fort potentiel SEO.

**Inputs :**
- Montant par période (€)
- Fréquence (mensuelle / hebdomadaire)
- Durée (années)
- Rendement annuel estimé (slider, 4% à 12%, défaut 7% pour ETF World)

**Outputs :**
- Capital final
- Total investi vs gains
- Graphique d'évolution interactif (Recharts)
- Tableau année par année (exportable CSV pour Premium)
- CTA "Recevez le signal DCA chaque mois, créez votre compte"

### 4.3. Dashboard (page `/dashboard`)

Persistance des paramètres utilisateur :
- Montant de DCA habituel
- Fréquence
- Allocation (% crypto, % ETF)
- Historique des investissements réellement effectués (saisie manuelle, ou import CSV en v2)
- Courbe d'évolution perso
- Rappel du signal du mois

### 4.4. Pages Learn (SEO)

Articles pédagogiques de 600 à 1200 mots sur :
- Qu'est-ce que le DCA ?
- Comment lire le Fear & Greed Index ?
- Le MSCI World, à quoi ça sert ?
- DCA vs Lump Sum, que dit la recherche ?

**Objectif :** trafic organique gratuit = revenu pub sans payer d'acquisition.

---

## 5. Design system (hybride clair/sombre)

**Principe :** landing claire et éditoriale (confiance, sérieux), dashboard sombre (focus, look "cockpit"). Toggle dispo dans les 2.

**Palette :**
- Sombre, fond `#0B0F14`, accents `#2DD4BF` (teal) et `#F59E0B` (amber signal)
- Clair, fond `#FAFAF9`, accents `#0F766E` (teal foncé) et `#D97706` (amber foncé)
- Typographie, **Inter** pour le corps, **Geist Mono** pour les chiffres (très pro, très lisible)

**Règles anti "site fait par IA" :**
1. Aucun emoji décoratif dans l'UI
2. Aucune card avec gradient violet/rose
3. Pas de hero avec photo stock type "homme souriant devant ordinateur"
4. Données réelles dès le hero (screenshot du signal du jour, pas une illustration)
5. Microtypo soignée (kerning chiffres tabulaires, espaces insécables avant les %)
6. Animations discrètes uniquement (fade in, pas de scroll parallax tape-à-l'œil)

**Inspirations visuelles :** Linear, Raycast, Trading212 (version pro), Wealthfront.

---

## 6. Monétisation

### 6.1. Publicité Google AdSense

**Important :** AdMob = mobile uniquement. Pour le web, c'est **AdSense**, même compte Google, même paiement, approbation séparée.

**Emplacements prévus :**
- Landing, 1 bannière en bas de page (après le contenu utile)
- Pages Learn, bannière in-article après le 1er scroll
- Calculateur, bannière sous les résultats
- Dashboard, **aucune pub** (utilisateur connecté = mieux engagé, pub premium contre plus tard)

**Revenus estimés :** 1€ à 5€ pour 1000 pages vues (finance = niche bien payée). Premier objectif, 10 000 visites/mois = 20 à 50€/mois.

### 6.2. Premium (v2, après validation du trafic)

- 2,99€/mois ou 24€/an
- Supprime les pubs
- Historique illimité et export CSV
- Alertes email quand le signal change de niveau
- Processeur, Stripe (simple, pas de RevenueCat nécessaire sur web)

### 6.3. Cross-sell app iOS

Bannière native dans le dashboard :
> "Recevez le signal du jour sur votre iPhone, notifications, widget, **Télécharger l'app**"

---

## 7. Roadmap MVP

### v1 (4 à 6 semaines, livrable minimum viable)
- Landing + Calculateur + Signal + Auth Google/Apple/Email
- Dashboard basique (paramètres persistés)
- 3 pages Learn pour SEO
- Hébergé sur Vercel avec domaine custom
- AdSense en demande d'approbation

### v2 (+4 semaines)
- Historique des investissements (saisie manuelle)
- Graphique d'évolution perso
- Alertes email
- Stripe + plan Premium

### v3 (plus tard)
- Import CSV des relevés broker
- Comparateur de stratégies
- API publique (DCA multiplier as a service)

---

## 8. Risques et points d'attention

| Risque | Mitigation |
|---|---|
| Approbation AdSense lente (2 à 4 semaines) | Déposer la demande dès la v1 en ligne, contenu Learn obligatoire avant candidature |
| Responsabilité "conseil en investissement" | Disclaimer clair partout, pas de recommandation de titres, "information éducative uniquement" |
| SEO concurrentiel (DCA, investissement) | Jouer sur le niche (calculateur + signal), pas la guerre directe sur "DCA" |
| Abandon au signup | Auth Google en 1 clic en premier, email/MDP en repli |

---

## 9. Prochaines étapes si tu valides

1. **Réserver le domaine** (je te donne 3 suggestions dispo)
2. **Créer le projet Firebase** (nouvelle app dans ta console, pas réutiliser celle de l'iOS)
3. **Setup du repo Next.js** (je génère la structure complète)
4. **Maquette visuelle** (1 landing + 1 dashboard en HTML statique pour validation avant dev)
5. **Dev v1** en itératif, page par page

**Temps de dev estimé, côté moi :** 25 à 40 heures pour la v1 complète.

---

**Go / no-go ?** Si go, je propose qu'on commence par l'étape 4, une maquette visuelle statique en HTML pour bloquer le style avant d'écrire du code React. C'est le moyen le plus efficace pour éviter le "ça fait IA".

---

## 10. Feature Diagnostic IA (itération 2)

**Principe.** Une fois par mois, quand l'utilisateur ouvre son dashboard, un encart "Diagnostic de portefeuille" propose une relecture de son allocation par Claude Haiku.

**Inputs minimum.** Liste des supports détenus (saisie manuelle ou import CSV simplifié), montant par support, horizon et profil. Rien de sensible, rien qui demande un broker sync.

**Output attendu.** Deux à trois observations brèves et factuelles, pas de recommandation personnalisée réglementée. Exemples:
- "Trois ETF MSCI World détectés, 92 % de lignes communes, la diversification apparente ne réduit pas le risque."
- "Concentration US à 68 %, supérieure à une allocation équilibrée, un ETF Marchés Émergents ramènerait ce chiffre autour de 54 %."
- "Allocation crypto à 8 %, cohérente avec un profil long terme modéré."

**Stack technique.**
- Modèle, `claude-haiku-4-5-20251001`, environ 0,0008 € par analyse (300 tokens input + 400 output).
- Déclenchement, button ou cron mensuel, jamais à chaque pageview.
- Prompt figé, injection d'un system prompt avec disclaimer "informatif, non personnalisé", guardrails sur le ton.
- Cache, on stocke la dernière analyse en Firestore, 30 jours de TTL, sert de fallback si l'API tombe.

**Coût estimé.** 1 000 utilisateurs actifs, 1 analyse par mois = 1 000 appels = 0,80 € / mois. Rentable dès la v1.

**Positionnement réglementaire.** Jamais de recommandation de titre précis ("achetez CW8"), toujours du commentaire structurel ("votre allocation est concentrée sur X, voici ce que dit la littérature"). Disclaimer permanent affiché sous le bloc.

---

## 11. Features prioritaires (simple et éducatif)

Règle générale, si ça ressemble à un Finary bis, c'est hors scope. On reste sur du pédagogique, du signal, et de la projection.

| Feature | V1 | V2 | V3 | Pourquoi |
|---|---|---|---|---|
| Signal mensuel + explication | Oui | | | Cœur du produit |
| Calculateur 3 scénarios | Oui | | | Aimant SEO + valeur perçue |
| Encart "Loi des crachs" | Oui | | | Rassure l'utilisateur |
| Saisie manuelle versements | Oui | | | Base du dashboard perso |
| Glossaire intégré (infobulles) | Oui | | | Remplace le Fear & Greed imbuvable |
| Archive historique du signal | Oui | | | Prouve que la méthode a fonctionné |
| Diagnostic IA (Haiku) | | Oui | | Différenciateur fort, faible coût |
| Comparateur DCA vs Lump Sum | | Oui | | Contenu SEO à fort potentiel |
| Alertes email (changement de palier) | | Oui | | Rétention |
| Export CSV, historique perso | | Oui | | Feature Premium |
| Import CSV broker (Trade Republic, Boursorama) | | | Oui | Complexité réelle, à décaler |
| API publique du signal | | | Oui | Créer de l'autorité |

**Ce qu'on ne fait pas, délibérément.**
- Pas de sync broker en temps réel (Finary déjà là, hors promesse).
- Pas de calcul fiscal (PEA, PFU) dans la v1.
- Pas de watchlist ou tracker de cours.
- Pas de forum ni social features.

---

## 12. Stratégie SEO organique (pas de budget marketing)

**Pari.** 95 % du trafic doit venir de la recherche organique. Deux leviers, content et tech.

### 12.1. Content, pages taillées pour la longue traîne

Pages programmatiques à partir du calculateur:
- `/simulateur-dca-300-euros-par-mois-20-ans`
- `/simulateur-dca-500-euros-par-mois-15-ans`
- `/combien-investir-par-mois-pour-avoir-500000-euros`

Pages éditoriales (2 par mois, 800 à 1 500 mots):
- "DCA, qu'en dit la recherche ? (Vanguard, Swensen, Bogle)"
- "Fear & Greed Index, guide complet 2026"
- "MSCI World vs S&P 500, que choisir pour son DCA ?"
- "Lump Sum vs DCA, les chiffres qui tranchent"
- "Comment construire un ETF mondial diversifié pour 10 €/mois"

Pages hub (structure en silo):
- Hub "DCA", toutes les pages DCA pointent dedans.
- Hub "ETF", toutes les pages ETF.
- Hub "Crypto", idem.

### 12.2. Technique, SEO propre dès le jour 1

- Next.js App Router en SSG pour toutes les pages statiques, TTFB < 200 ms.
- Sitemap.xml généré automatiquement.
- Structured data (JSON-LD), `Article`, `FAQPage`, `BreadcrumbList`.
- Open Graph et Twitter cards sur chaque page.
- Core Web Vitals, objectif LCP < 1,5 s, CLS < 0,05 (sans pub lourde en top of page).
- Canonical tags.
- Cohérence URL, trailing slash ou non, choisir et s'y tenir.
- Fichier robots.txt précis.

### 12.3. Calendrier éditorial minimum viable

Mois 1, publier 10 articles fondateurs (les hubs + 6 longs formats).
Mois 2 à 6, 2 articles par mois + 1 page programmatique par semaine.
Mois 7+, cadence cruise, 1 article par mois + mise à jour des anciens.

**Gain attendu.** 6 à 9 mois pour sortir en première page sur les requêtes longue traîne. 12 à 18 mois pour les requêtes moyennes ("calculateur DCA", "signal DCA"). 24 mois pour les requêtes concurrentielles ("DCA").

### 12.4. Backlinks sans budget

- Guest posts sur blogs finance francophones, Epargnant 3.0, Xolali, Finary Talks.
- Présence HelloAsso / Indie Hackers / ProductHunt au lancement.
- Citation par les agrégateurs fintech FR, Moneyvox, JDN.
- Répondre aux questions Reddit r/vosfinances et Quora, avec lien vers articles éducatifs (pas commerciaux).
- Créer une data story annuelle ("Rapport DCA, 2026"), reprise par les médias finance.

### 12.5. Mesure

Outils gratuits au démarrage, Google Search Console, Bing Webmaster Tools, Ahrefs Webmaster (gratuit), Vercel Analytics. Objectifs trimestriels, 500 sessions organiques à M+3, 2 000 à M+6, 8 000 à M+12.

---

## 13. Sous-domaine

Nom de domaine disponible, `rocapp.eu` (Cloudflare), un sous-domaine déjà utilisé pour la landing iOS de DCA Cockpit.

**Propositions de sous-domaine pour le web app:**
1. `cockpit.rocapp.eu` (propre, court, cohérent avec la marque)
2. `dca-web.rocapp.eu` (explicite mais moins élégant)
3. `app.rocapp.eu` (générique, réserve la possibilité d'autres produits)
4. `signal.rocapp.eu` (positionnement, met en avant le cœur du produit)

**Reco,** `cockpit.rocapp.eu`. Court, brandé, SEO-friendly (le mot "cockpit" est unique et facile à référencer).

---

## 14. Stratégie jackpot, AdSense et éditorial

Le calculateur et le signal sont des outils transactionnels courts, faible nombre de pages vues par session, AdSense rentabilise mal. La vraie monétisation vient du **contenu long et evergreen**, où l'utilisateur reste 3 à 8 minutes et voit 2 à 4 annonces in-article. Finance est la **niche AdSense la mieux payée en Europe** (CPC 0,50 € à 3 € en français, RPM 8 € à 25 € pour 1 000 pages vues sur les sujets "money").

### 14.1. Architecture de site orientée revenu

Deux surfaces distinctes, avec rôles clairs.

| Surface | Rôle | Pub | RPM attendu |
|---|---|---|---|
| App (signal, dashboard, calculateur) | Convertir, fidéliser | Zéro (UX premium, + cross-sell iOS) | 0 € |
| Blog (/learn, /guides, /comparatifs) | Aspirer du trafic SEO, monétiser | AdSense + affiliation | 15 à 25 € |

**Règle,** l'app ne porte **jamais** de pub AdSense. Le blog porte **toute** la charge publicitaire. Utilisateur connecté, dashboard propre, pub uniquement sur les pages publiques d'acquisition.

### 14.2. Emplacements AdSense optimaux (blog)

Règle Google, maximum 3 annonces par page (recommandation officielle, au-delà, pénalité qualité).

| Position | Format | Densité | Remarque |
|---|---|---|---|
| Sous le H1, avant le 1er paragraphe | Display responsive | Une | Forte viewability, CTR élevé |
| Milieu d'article, après 40 % de scroll | In-article | Une | Ad la plus cliquée historiquement |
| Bas d'article, avant les articles liés | Multiplex (grille native) | Une | Recirculation + revenu simultané |

**À proscrire,** sticky latérale (MAL notée Core Web Vitals), popups, auto-ads (CPC massacré, UX dégradée, privilégier les emplacements manuels).

### 14.3. Matrice des sujets haute valeur CPC

Les requêtes à haute intention commerciale paient le plus. Classement par CPC estimé (AdSense finance FR, ordre de grandeur).

| CPC | Thème | Exemples de requêtes |
|---|---|---|
| 2,00 à 3,50 € | Assurance vie, PER, PEA | "meilleure assurance vie 2026", "PEA Boursorama vs Trade Republic" |
| 1,50 à 2,50 € | Courtiers, brokers | "ouvrir compte Trade Republic", "frais Degiro 2026" |
| 1,20 à 2,00 € | ETF comparatifs | "CW8 vs SWDA vs WLD", "meilleur ETF S&P 500 PEA" |
| 1,00 à 1,80 € | Crypto investissement | "acheter BTC long terme 2026", "PEA crypto possible" |
| 0,80 à 1,50 € | Calculateurs | "calculateur intérêts composés", "simulateur PEA 20 ans" |
| 0,30 à 0,80 € | Éducatif pur | "qu'est-ce que le DCA", "définition MSCI World" |

**Stratégie,** ne pas écrire uniquement de l'éducatif (CPC faible). Écrire **60 % comparatifs / 30 % guides transactionnels / 10 % éducatif pur**, l'éducatif sert de pilier de maillage interne.

### 14.4. Calendrier éditorial jackpot, 12 mois

Objectif, 80 articles publiés en 12 mois, soit 6 à 7 par mois (sous-traitable à un rédacteur SEO à 60 à 100 € par article, ou rédigé par Claude puis relu).

**Mois 1 à 3, fondations (pilier + comparatifs brokers).**
- 3 piliers de 2 500 mots, "DCA, guide complet 2026", "ETF, guide complet PEA et CTO", "Crypto en DCA, stratégie long terme"
- 5 comparatifs brokers, Trade Republic vs Boursorama vs Saxo vs Degiro vs Fortuneo, 1 500 mots chacun
- 3 guides pratiques, "Ouvrir un PEA en 10 minutes", "Choisir son premier ETF", "Automatiser son DCA"

**Mois 4 à 6, pages programmatiques.**
- 30 pages `/simulateur-dca-XX-euros-XX-ans` générées à partir du calculateur, chacune indexée individuellement
- 10 pages `/comparaison-ETF-X-vs-Y` générées à partir d'une base 30 ETF populaires

**Mois 7 à 12, actualité + saisonnalité.**
- 1 article par mois type "Retour sur le signal DCA de [mois]", reprise des data du produit, contenu unique impossible à copier
- Articles saisonniers, "PEA 2027, nouveautés fiscales" (novembre), "Bilan DCA 2026" (décembre), "Où investir en 2027" (janvier)

### 14.5. Affiliation brokers, le vrai jackpot

AdSense paie bien, l'affiliation paie 10 à 50 fois mieux pour un volume équivalent.

| Broker | Commission | Programme |
|---|---|---|
| Trade Republic | 15 à 50 € par inscription active | Direct ou via Heyflow |
| Saxo Banque | 100 à 250 € par compte financé | Awin |
| Boursorama | 80 à 150 € par ouverture PEA/CTO | Affilinet / direct |
| Degiro | 20 à 40 € par compte validé | Awin |
| Fortuneo | 60 à 120 € par ouverture | Direct |
| Swissquote | 100 à 200 € par compte financé | Kwanko |
| Binance, Kraken, Bitpanda | 20 à 50 % des frais à vie (crypto) | Direct |

**Calcul réaliste,** un article "Trade Republic avis 2026" bien positionné, 3 000 visites/mois, 2 % de conversion affiliation = 60 inscriptions, 25 € moyens = **1 500 €/mois sur un seul article**. À comparer à 40 à 80 €/mois AdSense sur le même trafic.

**Implémentation,** disclaimer affiliation clair en haut d'article (obligation DGCCRF en France depuis 2023 pour les influenceurs, appliqué par prudence), liens UTM trackés, dashboard Notion de suivi.

### 14.6. Newsletter, l'asset qui compose

L'AdSense est loué, la newsletter est possédée. Aimant email, "Recevez le signal DCA chaque 1er du mois, gratuit", opt-in sur chaque page d'article.

**Stack,** Beehiiv (gratuit jusqu'à 2 500 abonnés, monétisation intégrée par le réseau Beehiiv Ads qui paie 25 à 50 € par 1 000 ouvertures), ou Substack.

**Projection,** 500 abonnés à M+6, 3 000 à M+12, 10 000 à M+24. À 10 000 abonnés, 40 % de taux d'ouverture, 4 000 ouvertures × 4 emails/mois = 16 000 ouvertures/mois × 35 € RPM = **560 €/mois** de revenu newsletter seule.

### 14.7. Projection revenus 12 mois

Hypothèses prudentes, trafic organique + affiliation + AdSense.

| Mois | Sessions/mois | AdSense | Affiliation | Newsletter | Total/mois |
|---|---|---|---|---|---|
| M+3 | 1 500 | 25 € | 0 € | 0 € | 25 € |
| M+6 | 6 000 | 100 € | 200 € | 50 € | 350 € |
| M+9 | 18 000 | 300 € | 900 € | 180 € | 1 380 € |
| M+12 | 40 000 | 700 € | 2 500 € | 400 € | 3 600 € |
| M+18 | 100 000 | 1 800 € | 7 000 € | 900 € | 9 700 € |
| M+24 | 180 000 | 3 500 € | 15 000 € | 1 800 € | 20 300 € |

**Caveat.** Ces chiffres dépendent à 80 % de la qualité et la régularité du contenu publié. Zéro article = zéro revenu, quel que soit le stack.

### 14.8. Multiplicateurs secondaires

À activer une fois le trafic installé (M+9 minimum).

- **Ebook vendu** (Gumroad), "Le guide complet du DCA pour investisseur français", 19 €, 50 ventes/mois à partir de M+12 = 950 €/mois, zéro effort après rédaction.
- **Cours vidéo** (Thrive ou Podia), "Construire son DCA, méthode complète", 79 €, 15 ventes/mois à partir de M+15 = 1 185 €/mois.
- **Tier Premium DCA Cockpit** (plan abonnement mensuel, 4,99 €), supprime les pubs, débloque les alertes email avancées, export CSV, backtesting personnalisé. 1 000 abonnés à M+24 = **5 000 €/mois récurrents**.
- **API publique du signal** (offre B2B, 49 à 199 €/mois par client), pour neo-brokers et bloggers finance. Volume faible mais marge 95 %.

### 14.9. Règles d'or pour éviter le ban AdSense

1. **Disclaimers clairs** sur toutes les pages "information éducative, pas de conseil en investissement".
2. **Pas de contenu incitatif "get rich quick"**, Google pénalise lourdement les promesses de rendement garanti.
3. **Pas de clickbait**, titres factuels ("Trade Republic, avis complet 2026") et non "Comment j'ai gagné 100 000 € avec ce broker".
4. **Politique de confidentialité et mentions légales** obligatoires, bannière consentement cookies conforme RGPD (Tarte au citron ou Cookiebot).
5. **Contenu original à 100 %**, jamais de spun content ou traduction brute d'articles anglais (détection AdSense très efficace).
6. **ads.txt** à la racine du domaine dès la validation AdSense.

### 14.10. Stack final monétisation

| Besoin | Outil | Coût |
|---|---|---|
| Ads web | Google AdSense | 0 € |
| Affiliation | Awin + programmes directs | 0 € |
| Newsletter | Beehiiv (puis payant au volume) | 0 à 49 € |
| Analytics | Plausible (RGPD) ou GA4 | 9 € ou 0 € |
| SEO tracking | Google Search Console + Ahrefs Webmaster | 0 € |
| Consentement cookies | Tarte au citron | 0 € |
| Paiement abonnement | Stripe | 2,9 % + 0,30 € par transaction |
| Ebook | Gumroad | 10 % par vente |
| **Total fixe mensuel** | | **0 à 50 €** |

**Objectif réaliste à M+24,** 15 000 à 25 000 €/mois de revenus combinés, avec 6 à 10 heures de travail par semaine (rédaction, mise à jour, SEO). C'est la trajectoire qui sert ton objectif retraite anticipée.
