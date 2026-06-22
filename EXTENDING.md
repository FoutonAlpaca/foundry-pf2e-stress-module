# PF2e Stress Module — Extending & Contributing

This guide explains how to add new features, customize behavior, or contribute to the pf2e-stress module.

## Recommended start
1. Read [ARCHITECTURE.md](ARCHITECTURE.md) first for the module layout and runtime behavior.
2. Then use this doc for implementation patterns and extension examples.
3. The main entrypoint for code changes is usually `scripts/pf2e-stress.js` or `scripts/actor-stress-resource-data.js`.
4. Familiarize yourself with [FoundryVTT's Hooks system](https://foundryvtt.com/article/hooks/) and [libWrapper](https://github.com/ruipin/fvtt-lib-wrapper/)

## Module Boundaries

The module's public API consists of three exported classes:

### `StressResourceData` — Business Logic
**Location**: `scripts/actor-stress-resource-data.js`

**Public Methods**:
- `getStressValueForActorOrDefault(actorId)` — Retrieve current stress (or 0 if unset)
- `getStressDataForActor(actorId)` — Get full stress flag data
- `addStressToActor(changeType, actorId, amount = 1)` — Add stress with change tracking
- `setStressValueForActor(changeType, actorId, stressValue)` — Set absolute stress value
- `sendStressChangeChatMessage(changeType, actorName, oldValue, stressValue)` — Create chat notification

**Use this for**: Calculating stress changes, applying stress from custom events, querying current stress

**Example**:
```javascript
import { StressResourceData } from './scripts/actor-stress-resource-data.js'

// Add 2 stress to an actor
StressResourceData.addStressToActor('customEvent', actorId, 2)

// Set stress to exactly 5
StressResourceData.setStressValueForActor('customEvent', actorId, 5)

// Get current stress
const currentStress = StressResourceData.getStressValueForActorOrDefault(actorId)
```

### `StressDataFlagApi` — Persistence Layer
**Location**: `scripts/stress-data-flag-api.js`

**Public Methods**:
- `getFlag(document)` — Read stress flag from actor
- `setFlag(document, flagData)` — Write stress flag to actor

**Use this for**: Direct flag manipulation (rarely needed; use `StressResourceData` instead)

**Note**: This is a low-level API. Most custom code should use `StressResourceData` instead.

### `module` — Configuration & Helpers
**Location**: `scripts/module.js`

**Public Methods**:
- `localize(term, data)` — Translate and format i18n strings
- `getActorById(actorId)` — Look up actor by ID
- `getRerollCostForRollCheckType(rollCheckType)` — Get GM-configured stress cost for a roll type

**Public Constants**:
- `module.MODULE_ID` — 'pf2e-stress'
- `module.MIN_STRESS` — Minimum stress value (0)
- `module.STRESS_ICON` — Font Awesome icon class
- `module.ACTOR_TYPES` — Enum: {Character, Familiar}
- `module.STRESS_VALUE_CHANGE_SOURCE` — Enum: {CharacterSheet, Reroll, Dying, Undo, Unspecified}
- `module.DICE_ROLL_CHECK_TYPE` — Enum: {AttackRoll, Check, Initiative, etc.}

**Use this for**: Constants, configuration, and i18n access

## Common Extension Patterns

### Pattern 1: Trigger Stress from a Custom Event

**Goal**: Add stress when a character fails a perception check.

**Approach**: Hook into a custom event or existing FoundryVTT hook.

**Code**:
```javascript
// In your custom module/hook
import { StressResourceData } from './scripts/actor-stress-resource-data.js'
import { module } from './scripts/module.js'

Hooks.on('yourCustomEvent', (actor, result) => {
  if (result.isCriticalFailure) {
    const changeSource = 'customEvent' // Custom source identifier
    StressResourceData.addStressToActor(changeSource, actor.id, 1)
    console.log(`${actor.name} gained 1 stress for critical failure`)
  }
})
```

**What happens**:
1. Stress is incremented by 1
2. Chat message is sent: "{Actor} stress changed from X to Y"
3. Character sheet and party sheet automatically update

### Pattern 2: Add a New Reroll Cost Configuration

**Goal**: Allow GMs to configure stress cost for a custom roll type.

**Approach**: Add a new roll type constant and register a setting.

**Steps**:

1. In `scripts/module.js`, add your roll type to `DICE_ROLL_CHECK_TYPE`:
   ```javascript
   static DICE_ROLL_CHECK_TYPE = {
     // ... existing types ...
     CustomRoll: 'custom-roll'
   }
   ```

2. In `languages/en.json`, add i18n for the setting:
   ```json
   "settings": {
     "stress-reroll-cost": {
       "custom-roll": {
         "name": "Custom Roll Stress Cost",
         "hint": "Stress cost when rerolling a custom roll type"
       }
     }
   }
   ```

3. The setting is automatically registered by `module.registerRerollCostConfigurationSettings()` in `pf2e-stress.js`

4. When processing a reroll, query the cost:
   ```javascript
   const cost = module.getRerollCostForRollCheckType('custom-roll')
   ```

### Pattern 3: Add a Custom Stress UI Element

**Goal**: Add a stress counter to a custom sheet or sidebar.

**Approach**: Hook into sheet rendering and add HTML elements.

**Code**:
```javascript
import { StressResourceData } from './scripts/actor-stress-resource-data.js'

Hooks.on('renderMyCustomSheet', (sheet, html) => {
  const actor = sheet.object
  const currentStress = StressResourceData.getStressValueForActorOrDefault(actor.id)

  // Add stress display to your sheet
  const stressDisplay = `<div class="stress-display">Stress: ${currentStress}/10</div>`
  html.find('.my-custom-location').append(stressDisplay)
})
```

### Pattern 4: Detect When Stress Reaches Thresholds

**Goal**: Trigger an event when stress hits 5, 7, or 10.

**Approach**: Hook into actor updates and check stress changes.

**Code**:
```javascript
import { StressResourceData } from './scripts/actor-stress-resource-data.js'

let previousStressValues = {}

Hooks.on('updateActor', (actor, data, diff) => {
  const oldStress = previousStressValues[actor.id] || 0
  const newStress = StressResourceData.getStressValueForActorOrDefault(actor.id)

  previousStressValues[actor.id] = newStress

  if (newStress === 5 && oldStress < 5) {
    console.log(`${actor.name} reached moderate stress (5)`)
    // Trigger custom behavior here
  }

  if (newStress === 10 && oldStress < 10) {
    console.log(`${actor.name} reached maximum stress (10)`)
    // This is where Trauma would be applied (future feature)
  }
})
```

## Code Style Guidelines

### Naming Conventions
Follow [standard JS](https://standardjs.com/)

### Handler Functions
Handlers registered via `Hooks.on()` or `Hooks.once()` are typically private to the module where they're defined. Do not export them. Instead:
- If you need to trigger similar behavior, use `StressResourceData` methods
- If you need to extend behavior, add a new Hook listener in your own code

## Localization

When adding new user-facing strings, add them to `languages/en.json`:

```json
{
  "pf2e-stress": {
    "terms": {
      "your-new-term": "Display text here"
    }
  }
}
```

Then use `module.localize()` to access them:

```javascript
const label = module.localize('terms.your-new-term')
```

## Testing Your Changes

### Linting

Always lint your code before committing or proposing changes. Run ESLint to check for syntax errors and style issues:

```bash
# Check for linting errors
npm run lint

# Automatically fix fixable issues
npm run lint:fix
```

Both the StandardJS linter and VS Code are configured to catch common issues automatically. If `npm run lint` reports errors, fix them before proceeding.

### Manual Testing
1. Copy the module to the local foundry folder (run `Copy-ModuleToFoundry.ps1 -Path`)
1. Open FoundryVTT and load a world with pf2e system
2. Enable the pf2e-stress module
3. Open the browser console (F12) and check for errors
4. Test your feature by interacting with the UI
5. Check `console.log()` statements to verify behavior
6. Verify changes persist by reloading the page

### Running Tests
Run the test suite to verify your changes don't break existing functionality:

```bash
# Run all tests
npm test

# Run specific test file
npm test -- actor-stress-resource-data.spec.js

# Run with verbose output
npm test -- --verbose

# Run with coverage report
npm test -- --coverage
```

Tests are located in the `tests/` directory and use Jest. Always run tests after making changes before committing or completing a task.

### Debugging
- Use `console.log()` to trace execution
- Use `debugger;` statement and step through in DevTools
- Inspect actor flags: `actor.flags` in console
- Inspect module settings: `game.settings.get('pf2e-stress', 'setting-name')` in console

### Compatibility Testing
Test with the module's target versions:
- **FoundryVTT**: v11.0–v12.331 (adjust based on `module.json` compatibility)
- **PF2e System**: v5.12.7–v6.8.2 (adjust based on `module.json` relationships)

## Contributing Back

To contribute improvements:

1. **Fork** the repository on GitHub
2. **Create a feature branch**: `git checkout -b feature/my-feature`
3. **Make your changes** following the guidelines above
4. **Update CHANGELOG.md**: Add entry under `## [Unreleased]` section
5. **Test thoroughly** in multiple FoundryVTT versions if possible
6. **Submit a pull request** with a clear description of changes

### PR Checklist
- [ ] Changes follow code style guidelines
- [ ] Changelog updated with your changes
- [ ] All new user-facing strings added to i18n
- [ ] Changes tested in supported FoundryVTT/PF2e versions
- [ ] No console errors or warnings

## Architecture Constraints to Remember

1. **Don't bypass the data layer**: Always use `StressResourceData` for stress changes, not direct flag manipulation
2. **Workaround is intentional**: The pf2e flag workaround for rerolls exists because pf2e clones only `flags.pf2e`. Don't try to "fix" it without understanding pf2e's architecture
3. **Handler functions are private**: The 5 handlers in `pf2e-stress.js` are intentionally not exported. Use Hooks to extend behavior, not by importing handlers
4. **Immutability of actor ID**: Once an actor is created, its ID doesn't change. Safe to store and retrieve later
5. **Async operations**: Actor flag operations are async. Always `await` setFlag operations where needed

## Troubleshooting

**Q**: How do I add stress to an actor without sending a chat message?
**A**: Currently, `StressResourceData.setStressValueForActor()` always sends a message. To avoid this, directly use `StressDataFlagApi.setFlag()` (low-level API, not recommended). Future versions may add a flag to skip chat notifications.

**Q**: Can I negative stress or stress over 10?
**A**: The module enforces `stress >= MIN_STRESS (0)` and doesn't prevent stress > 10, but trauma logic assumes stress reaches 10. Consider implementing max-stress bounds if needed.

**Q**: How do I reset stress to 0?
**A**: Use `StressResourceData.setStressValueForActor('reset', actorId, 0)`

**Q**: Where do I add new event hooks?
**A**: Add them to `pf2e-stress.js` in the `Hooks.on()` section. Keep handler functions private to that file.
