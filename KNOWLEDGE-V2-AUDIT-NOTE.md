# Knowledge V2 audit evidence

Temporary staging workflows were used during implementation and removed before merge.

Final verified contracts:

- 24 lessons total; unique IDs/orders; orders 1–24.
- Four zones with exactly six lessons each: foundation, skills, analysis, advanced.
- Every lesson has at least five sections; every section has at least two questions and an explanation of at least 20 characters.
- Reader does not load legacy course completion/XP UI.
- Skill Map does not depend on XP, quiz or hard-lock state and uses a balanced two-column desktop layout.
- Global Search contains all 24 Knowledge routes and preserves unrelated site entries including Playground, Achievements, Practice Lab, Master Excel mobile and practice downloads.
- Knowledge V2 assets are included in the service worker.

Latest full final-audit run before workflow cleanup: GitHub Actions run 34394471494 — all syntax, curriculum, reader/map, search-regression and product-scope steps passed.
