# PF2e Stress Module — Architecture & Design

This document explains the internal structure, data flow, and design decisions for the pf2e-stress module.

## Recommended reading order
1. Overview
2. File responsibilities
3. Integration points
4. Configuration
5. Design decisions

## Overview

The pf2e-stress module replaces FoundryVTT hero points with a stress system. Characters accumulate stress through in game actions like re-rolling a dice (same as hero point) and being knocked to 0 hp.

**Key concept**: Stress is stored as a persistent flag on actor documents, modified through UI interactions, and synchronized across character sheets, party frames, and chat messages.

## High-Level Flow

```
User action (e.g. reroll menu click)
  ↓
pf2e-stress.js (event handling)
  ↓
StressResourceData (business logic)
  ↓
StressDataFlagApi (flag persistence)
  ↓
Foundry actor flags
  ↓
UI updates (character sheet, party sheet, chat)
```

## Core interaction flows

### Flow 1: Add Stress via reroll
1. User selects "Reroll with Stress" in chat.
2. `addRerollWithStressContextOption()` sets a reroll marker in `flags.pf2e`.
3. The module calls `game.pf2e.Check.rerollFromMessage(message)`.
4. After reroll completes, update hooks run.
5. `StressResourceData.addStressToActor()` calculates and saves stress.
6. A chat message is created and UI updates.

**Why the workaround flag?** pf2e clones `flags.pf2e` during rerolls but not module-specific flags, so the reroll marker is stored there.

### Flow 2: Manually set stress on character sheet
1. Character sheet renders and `addStressValueToCharacterSheet()` injects an input.
2. The player changes the value.
3. On blur, the module calls `StressResourceData.setStressValueForActor()`.
4. The value is validated and persisted.
5. A chat message is sent and the sheet updates.

### Flow 3: Add stress when reduced to 0 HP
1. `updateActor` fires after actor damage.
2. `addStressIfDying()` detects a dying character.
3. Stress is calculated based on wounded value.
4. `StressResourceData.addStressToActor()` persists the change.

## File responsibilities

### `scripts/pf2e-stress.js`
- UI orchestration and hook registration
- ChatLog context menu patching (`Reroll with Stress`)
- Character sheet and party sheet UI injection
- Chat message annotations for rerolls
- Dying-condition stress triggers

### `scripts/module.js`
- Module constants and enums
- Localization and actor lookup helpers
- Settings registration for reroll costs
- Reroll cost retrieval by roll type
- Flag name definitions

### `scripts/actor-stress-resource-data.js`
- Stress read/write operations
- Validation of stress values
- Stress change persistence
- Chat message creation
- Change-source handling (character sheet, reroll, dying)

### `scripts/stress-data-flag-api.js`
- Flag read/write operations
- Reroll workaround flag handling
- Main stress storage path: `actor.flags['pf2e-stress'].stressData`
- Workaround path: `actor.flags.pf2e['pf2e-stress']`

## Integration points with PF2e

### Hooks used
- `Hooks.once('init')` — initialize module, patch ChatLog, register settings
- `Hooks.once('ready')` — validate `lib-wrapper`
- `Hooks.on('renderCharacterSheetPF2e')` — inject character sheet stress input
- `Hooks.on('renderPartySheetPF2e')` — add party sheet stress displays
- `Hooks.on('renderChatMessageHTML')` — update reroll chat messages
- `Hooks.on('updateActor')` — detect dying actor stress

### libWrapper usage
- Target: `ChatLog.prototype._getEntryContextOptions`
- Purpose: add the reroll-with-stress context menu item safely

### Flag storage
- Module stress data: `actor.flags['pf2e-stress'].stressData`
- Reroll marker workaround: `actor.flags.pf2e['pf2e-stress']`

## Configuration

The module registers reroll cost settings for each PF2e roll type. These are read at runtime when processing reroll stress.

## Design Decisions

### Why Static Classes (Singleton Pattern)?

All exported classes use `static` methods only. No instances are created.

**Rationale**:
- Module state is tied to the FoundryVTT game object (global singleton)
- Static classes provide a clean namespace without instantiation overhead
- Consistent with FoundryVTT module patterns (many modules use this approach)
- Prevents accidental multiple instances

### Why a Workaround for Reroll Flags?

The `setWorkaroundPf2eFlag()` method stores reroll markers in `flags.pf2e` instead of `flags[MODULE_ID]`.

**Rationale**:
- **pf2e cloning behavior**: When a Check is rerolled, pf2e clones `flags.pf2e` to the new roll message, but does NOT clone other flags
- **Problem**: If we stored the reroll marker in `flags[MODULE_ID]`, it would be lost after reroll
- **Solution**: Store marker in `flags.pf2e` so it survives the clone
- **Reference**: [pf2e Check reroll code](https://github.com/foundryvtt/pf2e/blob/c77984e99cb2de5f3747f4ef1ae896a79410c9dd/src/module/system/check/check.ts#L462)
- **Future**: If pf2e changes its cloning behavior, this workaround can be removed

### Why libWrapper for ChatLog Patching?

The module uses `libWrapper` to safely override ChatLog's context menu system, rather than directly replacing ChatLog methods.

**Rationale**:
- **Safety**: `libWrapper` provides version compatibility and allows multiple modules to patch the same target
- **Robustness**: If pf2e updates ChatLog, libWrapper handles the compatibility
- **Modularity**: Other modules can also patch ChatLog without conflicts
- **Alternative**: Direct override would be fragile and break if pf2e changes its internal structure

### Why Configuration Per Roll Type?

Settings allow GMs to specify stress cost for different roll types (attack rolls, saving throws, etc.) independently.

**Rationale**:
- **Campaign balance**: Different roll types have different stakes
- **Customization**: Campaign-specific stress economy
- **Extensibility**: Easy to add new roll types without code changes

## Configuration System

The module registers **8 settings** dynamically at initialization:

```
reroll-cost-attack-roll
reroll-cost-check
reroll-cost-counteract-check
reroll-cost-flat-check
reroll-cost-initiative
reroll-cost-perception-check
reroll-cost-saving-throw
reroll-cost-skill-check
```

Each setting:
- **Type**: Number (default: 1)
- **Scope**: World (GM-only)
- **UI**: Registered with FoundryVTT settings UI (automatically appears in module settings)

GMs modify these via the FoundryVTT Settings dialog. The module queries `game.settings.get()` at runtime when processing rerolls.

## Compendium Structure

The module includes two compendium packs:

### `pf2e-stress-actions`
- **Type**: Items (representing available actions)
- **Purpose**: Reference items for stress-related actions
- **Visibility**: Players (OBSERVER), Assistants (OWNER)
- **Content**: Populated manually in FoundryVTT UI

### `pf2e-stress-rules`
- **Type**: Journal Entries (reference documents)
- **Purpose**: System rules, trauma mechanics, recovery guidelines
- **Visibility**: Players (OBSERVER), Assistants (OWNER)
- **Content**: Rules text and guidance (populated manually)

**Note**: Packs are stored as LevelDB databases (`packs/*.ldb` files) and are opaque to direct editing. They must be modified through FoundryVTT's UI.

## Integration Points with PF2e

### Hooks Used

- **`Hooks.once('init')`** — Initialize module, register settings, patch ChatLog
- **`Hooks.once('ready')`** — Verify libWrapper dependency
- **`Hooks.on('renderCharacterSheetPF2e')`** — Inject stress UI on character sheet
- **`Hooks.on('renderPartySheetPF2e')`** — Add stress column to party sheet
- **`Hooks.on('renderChatMessageHTML')`** — Label reroll messages with stress context
- **`Hooks.on('updateActor')`** — Detect dying condition and dying-triggered stress

### libWrapper Wrapping

- **Target**: `ChatLog.prototype._getEntryContextOptions`
- **Purpose**: Inject "Reroll with Stress" button into context menu
- **Wrapper Type**: `libWrapper.WRAPPER` (wraps the original function, can call it)

### Flag Storage

- **Module flags**: `actor.flags['pf2e-stress'].stressData` — Main stress value storage
- **pf2e flags**: `actor.flags.pf2e['pf2e-stress']` — Temporary reroll marker (workaround)

### PF2e System Assumptions

- Actor type support: `character`, `familiar`
- Chat message structure: Assumes pf2e's Check messages with roll data
- Dying condition: Module checks for `dying` condition to trigger stress on 0 HP
- Wounded condition: Module reads `actor.conditions.wounded` to calculate stress when dying

## Localization

The module uses hierarchical i18n keys stored in `languages/en.json`:

Helper: `module.localize(key, data)` handles both translation and formatting.

## Future Considerations

### Trauma Condition Application
Currently, stress reaches 10 but trauma is not automatically applied. Implementing this would require:
1. Create a "Trauma" condition item in PF2e
2. In `StressResourceData.setStressValueForActor()`, check if new stress >= 10
3. If so, apply the trauma condition to the actor
4. Reset stress to 0

### Undo System
The module currently lacks an undo mechanism. Implementing undo would require:
1. Store a history of stress changes (with timestamps, actor, old/new values)
2. Add undo button to character sheet
3. Retrieve previous state and revert actor flags

## Extending the Module

See [EXTENDING.md](EXTENDING.md) for a guide on adding new features, triggering stress from custom events, or customizing behavior.
