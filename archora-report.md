# Archora - Detective Drive

Scanned 2026-11-22T23:28:23.062Z in 108 ms.

## Review brief

| Item | Value |
|---|---|
| Status | **needs review** |
| Fix first | inspect impact for `src/scenes/GameScene.js` before changing its public surface |
| Affected areas | `vehicles`, `controls`, `scenes`, `config` |
| Rules config | not configured |
| CI gate suggestion | `grade:D` |
| Confidence | 2 analyzer warning(s) need review |

## Guided review

| Step | Target | Action | Verify |
|---|---|---|---|
| Review hotspot impact | src/scenes/GameScene.js | Open impact before changing this module. | Run impact for this module and check the top importers before editing. |

## Review checklist

- [ ] Inspect impact for hotspot src/scenes/GameScene.js
  - evidence: archora impact --module src/scenes/GameScene.js; fan-out 4: check outgoing dependencies before moving this module.

## Affected areas

| Area | Modules | Findings | Risk |
|---|---:|---:|---:|
| `vehicles` | 3 | 2 | 30.5 |
| `controls` | 3 | 2 | 28.9 |
| `scenes` | 1 | 1 | 17.8 |
| `config` | 1 | 1 | 14.8 |
| `settings` | 1 | 0 | 5.0 |
| `app` | 1 | 0 | 1.0 |
| `assets` | 1 | 0 | 1.0 |
| `.dependency-cruiser` | 1 | 0 | 0.0 |

## Summary

| Metric | Value |
|---|---:|
| Modules | 15 |
| Edges | 14 |
| Cycles | 0 |
| Hot zones | 6 |
| Layer violations | 0 |
| Contract violations | 0 |
| Rules config | not configured |
| Signals | 0 |
| Recommendations | 0 |
| Architecture grade | **B** (19/100) |

## Risk buckets

| Bucket | Count | What it means |
|---|---:|---|
| High | 0 | Contract or layer errors that can block CI. |
| Medium | 0 | Cycles and warning-level architecture issues. |
| Low | 6 | Hotspots to review after blocking issues. |
