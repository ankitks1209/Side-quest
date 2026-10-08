---
name: quest-engine
description: Maintain SideQuest quest contracts, curated fixtures, approved primitives, and deterministic safety boundaries. Use for quest-domain changes.
---

# Quest engine contract

Approved primitives: PHOTO_OBJECT, FIND_NATURE, OBSERVE_PATTERN, OBSERVE_COLOR, COMPARE, LISTEN, WALK_DURATION, REFLECT.

Every quest contains 2–3 tasks, exactly one photo-verifiable task with a criterion; others are self-reported. Respect selected 15/30/60 minute duration, explore/relax/move/notice mood and city/park/anywhere environment. Avoid exact location dependency, purchases and special equipment. Minimize interaction; observe from safe public paths. Follow every prohibited activity in RULES.md.

Validate schema → primitives → deterministic safety before approval. Curated Plan 1 fixtures are not a general model safety system. To add a primitive: require explicit human instruction; describe its purpose, verification and safety constraints; update RULES.md, DATA_MODEL.md, schemas, fixtures and tests together. Do not add primitives to work around unfinished features.
