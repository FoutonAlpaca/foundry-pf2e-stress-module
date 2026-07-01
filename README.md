FoundryVTT module for the PF2e system, which replaces hero points for a Stress value. Stress can be used in campaigns where PCs face being ground down by factors over long periods of time.

Each character has a stress value beginning at 0. When they perform an action that requires them to take stress, the stress value is increased by one.

When a character reaches 10 stress they take a Trauma which is a negative condition that can only be removed by long term recovery.

## Features
- Replaces Hero Point pips on the Character Sheet with a Stress value
- Current Stress value of all characters can be seen on the Party sheet
- Context menu to reroll using a point of stress
- Configuration settings to specify the stress cost to reroll specific dice roll types
- Compendium entries for all available actions and a journal entry for system reference
- Stress is added when a character is reduced to 0 HP

## Getting Started

### For Players
1. Install the module in your FoundryVTT world
2. Your character sheet will show a **Stress** counter in place of Hero Points
3. Stress ranges from **0 to 10**
4. When stress reaches **10**, your character gains a **Trauma** condition (contact your GM for details)
5. You can **reroll using stress** by right-clicking on a roll in the chat and selecting "Reroll with Stress"

### For Game Masters
1. Install the module in your FoundryVTT world with the PF2e system
2. Open **Settings → Module Settings** and find **Pathfinder 2e stress variant rule**
3. Configure the stress cost for each roll type (attack rolls, saving throws, etc.)
   - Default: 1 stress per reroll, configurable per roll type
4. Players can now reroll using stress instead of hero points
5. When a PC is reduced to 0 HP, they automatically gain 1 stress (or more if wounded)

### For Developers
See [ARCHITECTURE.md](ARCHITECTURE.md) for a complete overview of the module design and data flow. For extending or contributing, see [EXTENDING.md](EXTENDING.md).

## Configuration

### Reroll Costs

By default, rerolling with stress costs **1 stress**. You can customize this per roll type:

1. In FoundryVTT, go to **Settings → Module Settings**
2. Find **Pathfinder 2e stress variant rule**
3. Adjust costs for each roll type:
   - **Attack Roll Stress Cost** — Cost to reroll an attack roll
   - **Check Stress Cost** — Cost to reroll a general check
   - **Initiative Stress Cost** — Cost to reroll initiative
   - **Saving Throw Stress Cost** — Cost to reroll a save
   - And more for other roll types...

Each type can be set independently (e.g., attack rolls cost 1 stress, saving throws cost 2 stress).

## Limitations
- No undo for stress value changes
- No mechanism to apply Trauma conditions
- Limited automation for compendium entries

## Documentation

For more information, see:

- **[ARCHITECTURE.md](ARCHITECTURE.md)** — Module design, data flow, and design rationale
- **[EXTENDING.md](EXTENDING.md)** — Guide for adding features or customizing behavior
- **[COMPENDIUM.md](COMPENDIUM.md)** — How to manage and edit compendium packs
- **[MAINTENANCE.md](MAINTENANCE.md)** — Release process, testing, and maintenance procedures
