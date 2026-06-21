# PF2e Stress Module — Compendium Management

This guide explains how to manage and edit the pf2e-stress compendium packs.

## For code-focused work
This document is secondary for pack management only. If you are modifying core module behavior, start with `ARCHITECTURE.md` and `EXTENDING.md` instead.

## Overview

The module includes two compendium packs distributed with every release:

| Pack Name | Type | Purpose |
|-----------|------|---------|
| `pf2e-stress-actions` | Items | Available actions related to stress management |
| `pf2e-stress-rules` | Journal Entries | Rules reference, trauma mechanics, recovery guidelines |

Both packs are stored as **LevelDB databases** in the `packs/` directory and are **opaque to direct editing**—they must be modified through FoundryVTT's UI.

See [Foundry - Compendium documentation](https://foundryvtt.com/article/compendium/) for more details.

## Editing Packs

### Step 1: Enable Compendium Sidebar

1. Launch FoundryVTT and open a world with the pf2e-stress module enabled
2. On the right sidebar, click the **Compendium** tab (looks like stacked books)
3. You should see two entries:
   - `pf2e-stress.pf2e-stress-actions` — Items pack
   - `pf2e-stress.pf2e-stress-rules` — Journal entries pack

### Step 2: Edit an Existing Entry

**To edit an item in `pf2e-stress-actions`**:
1. Click on `pf2e-stress.pf2e-stress-actions` to expand it
2. Hover over an entry and click the **edit icon** (pencil)
3. Modify the item as needed
4. Click **Save** (changes are automatically persisted to the pack file)

**To edit a journal entry in `pf2e-stress-rules`**:
1. Click on `pf2e-stress.pf2e-stress-rules` to expand it
2. Hover over an entry and click the **edit icon**
3. Edit the journal entry content
4. Click **Save**

### Step 3: Add a New Entry

**To add a new item to `pf2e-stress-actions`**:
1. Click the **+** icon next to `pf2e-stress.pf2e-stress-actions`
2. A new item creation dialog appears (choose item type, e.g., "Action")
3. Fill in name and details
4. Click **Create** — the item is added to the pack

**To add a new journal entry to `pf2e-stress-rules`**:
1. Click the **+** icon next to `pf2e-stress.pf2e-stress-rules`
2. A journal entry creation dialog appears
3. Fill in title and content
4. Click **Create**

### Step 4: Delete an Entry

1. Hover over an entry
2. Click the **trash icon**
3. Confirm deletion

**Warning**: Deletion is permanent and affects the pack file.

## Recommended Content

### `pf2e-stress-actions` — Items

This pack should contain action items available to players. Example entries:

| Name | Type | Description |
|------|------|-------------|
| Stress Recovery | Action | 1-action activity to recover from stress during downtime |
| Crisis Moment | Reaction | React to an ally's stress increase |
| Meditate for Composure | 10-minute activity | Recover stress through meditation |

**Item Structure**:
- **Name**: Clear action title
- **Type**: Action (or other item type as appropriate)
- **Traits**: Include "stress" trait if relevant
- **Description**: Explain the effect, cost, and how it relates to stress
- **Frequency**: If applicable (e.g., "once per day")

### `pf2e-stress-rules` — Journal Entries

This pack should contain reference documents. Example entries:

| Name | Content |
|------|---------|
| Stress System Overview | Explanation of how stress works, 0–10 scale, trauma at 10 |
| Trauma Conditions | Details on trauma effects, recovery mechanics |
| Stress Triggers | Events that cause stress gain (0 HP, critical failure, etc.) |
| Recovery Procedures | Long-term recovery rules for stress and trauma |

**Journal Entry Structure**:
- **Title**: Clear section heading
- **Content**: Use Markdown formatting for readability
- **Links**: Reference related entries using internal links if needed

## Build & Release Process

### Source vs. Build Packs

The repository maintains two parallel pack directories:

```
/packs/                          ← Source packs (working directory)
  pf2e-stress-actions/
  pf2e-stress-rules/

/build/package/packs/            ← Build packs (release distribution)
  pf2e-stress-actions/
  pf2e-stress-rules/
```

**Workflow**:
1. Edit packs in FoundryVTT (saves to `/packs/`)
2. Before release, run the build script:
   ```powershell
   .\build\New-ReleasePackage.ps1
   ```
3. Build script copies `/packs/` → `/build/package/packs/`
4. Release ZIP is created from `/build/package/` directory
5. Users download and extract the release ZIP, which includes the `/build/package/packs/` copies

**Why duplicates?**
- Keeps source packs in the repo root for easy local editing
- Keeps release packs in `/build/package/` so that zipped releases have the correct structure
- Build script automates the sync

### Before Committing Changes

If you edit packs locally:
1. **Verify changes**: Open FoundryVTT and confirm edits look correct
2. **Commit source packs**: Commit the updated `/packs/` files to git
3. **Build for release** (when ready): Run `build\New-ReleasePackage.ps1` to sync `/build/package/packs/`
4. **Tag version**: Create a git tag for the release

### Version Migrations

When the pack schema changes between versions:

1. **Plan the migration**:
   - Document what's changing (e.g., adding new trait, removing field)
   - Create a migration guide for users

2. **Update packs**:
   - Edit all affected entries in FoundryVTT
   - Test with a clean world to verify compatibility

3. **Update CHANGELOG.md**:
   - Add entry: "Migrated packs for compatibility with PF2e v6.x"
   - Note any manual steps users must take

4. **Bump version**: Update `module.json` version number (follow semantic versioning)

## LevelDB Format Details

Compendium packs are stored as **LevelDB databases** (binary format). Files in each pack directory:

| File | Purpose |
|------|---------|
| `*.ldb` | Data blocks (binary encoded entries) |
| `MANIFEST-*` | Manifest file listing pack contents |
| `CURRENT` | Pointer to current manifest |
| `LOCK` | File lock (prevents simultaneous writes) |
| `LOG` | Operation log |
| `LOG.old` | Previous operation log |

**Important**: Do NOT edit these files directly. Always use FoundryVTT's UI.

## Troubleshooting

**Q**: Pack won't load in FoundryVTT
**A**:
- Verify the pack name in `module.json` matches the directory name
- Check that the `/packs/` directory has proper LevelDB structure
- Clear FoundryVTT cache and reload world

**Q**: Changes to packs aren't persisting
**A**:
- Verify you have GM permissions
- Check browser console for errors (F12)
- Ensure the `/packs/` directory is writable by FoundryVTT process
- Try editing a journal entry (journal entries are simpler than items)

**Q**: How do I rename a pack?
**A**:
- Rename the directory in `/packs/`
- Update `module.json` to reference the new name
- Run `build\New-ReleasePackage.ps1` to sync
- Users will need to reimport if they have the old pack cached

**Q**: How do I export a pack for sharing?
**A**:
- In FoundryVTT, right-click the pack in the Compendium sidebar
- Select "Export" (if available in your FoundryVTT version)
- Or, zip the `/packs/{pack-name}/` directory and share directly

**Q**: Can I merge two packs?
**A**:
- Currently, the module supports two fixed packs. If you need more:
  1. Add new pack entries to `module.json`
  2. Create new directories in `/packs/`
  3. Create new pack entries in FoundryVTT (drag items/journals to new pack)
  4. Commit new pack files to repo

## Accessing Packs Programmatically

If you're developing features that interact with pack contents, use FoundryVTT's Pack API:

```javascript
// Get a pack by name
const pack = game.packs.get('pf2e-stress.pf2e-stress-actions')

// List all items in the pack
const items = await pack.getDocuments()

// Search for an item by name
const item = items.find(i => i.name === 'Stress Recovery')

// Get a single item by ID
const specificItem = await pack.getDocument('item-id-here')
```

See [EXTENDING.md](EXTENDING.md) for patterns on using pack data in custom features.
