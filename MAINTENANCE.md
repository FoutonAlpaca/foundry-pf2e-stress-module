# PF2e Stress Module — Maintenance & Release

This guide documents how to maintain the module, manage releases, and handle compatibility updates.

## For code-focused work
This document is secondary for release and compatibility workflow only. If you are changing core module behavior, prefer `ARCHITECTURE.md` first.

## Changelog Workflow

### Keeping Changelog Updated

The CHANGELOG.md follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

**As you develop** (before release):
1. Open `CHANGELOG.md`
2. Add entries under `## [Unreleased]` section
3. Categorize changes as: **Added**, **Fixed**, **Changed**, **Removed**, **Deprecated**

**Example**:
```markdown
## [Unreleased]

### Added
- New stress trigger when character fails a perception check
- Configuration option to adjust stress gain from dying

### Fixed
- Chat message now correctly displays stress change when stress is 0
- Party sheet stress display works with custom sheet layouts

### Changed
- Updated compatibility to FoundryVTT v13 and PF2e v7.0
```

**Before release**:
1. Review all entries under `[Unreleased]`
2. Move dated entries to a new version section: `## [1.5.0] - 2026-06-20`
3. Update `module.json` version number

## Release Checklist

Use this checklist before publishing a new release:

### 1. Pre-Release Preparation
- [ ] Run `npm audit` and review output. Run `npm audit fix` if vulnerable packages found.
- [ ] All features merged to main branch
- [ ] CHANGELOG.md updated with all changes
- [ ] Run `npm run lint` — all files pass linting checks
- [ ] Verify no console errors or warnings
- [ ] Test with supported FoundryVTT versions (at least latest stable)
- [ ] Test with supported PF2e system versions
- [ ] All i18n strings in `languages/en.json`

### 2. Testing
- [ ] **Manual testing in FoundryVTT**:
  - [ ] Create new character
  - [ ] Add stress via UI
  - [ ] Add stress via reroll
  - [ ] Check party sheet shows stress
  - [ ] Check chat messages display correctly
  - [ ] Reload world and verify stress persists
  - [ ] Test all configured roll types can reroll with stress
- [ ] **Compatibility testing**:
  - [ ] Test with minimum supported FoundryVTT version
  - [ ] Test with latest stable FoundryVTT version
  - [ ] Test with minimum supported PF2e version
  - [ ] Test with latest stable PF2e version
- [ ] **FoundryVTT modules**: Verify no conflicts with common modules (lib-wrapper, etc.)

### 3. Git & Versioning
- [ ] Tag release: `git tag v1.5.0`
- [ ] Push commits and tags: `git push && git push --tags`

### 4. GitHub Release
- [ ] Create GitHub release with the version tag
- [ ] Copy CHANGELOG.md entries to release notes
- [ ] Attach `build/release/module.zip` to release (create if needed)
  - Run `build\New-ReleasePackage.ps1` to generate ZIP
  - Verify ZIP contains correct structure and packs
- [ ] Mark as pre-release if applicable


## Compatibility Management

### FoundryVTT Compatibility

When FoundryVTT releases a new version:

1. **Review breaking changes** from FoundryVTT release notes
2. **Test locally** with new version:
   - [ ] Module loads without errors
   - [ ] All features work correctly
   - [ ] No console warnings or deprecations
3. **Update module.json** if needed:
   - Update `compatibility.verified` to new version
   - Update `compatibility.minimum` only if support for older versions is dropped
4. **Add CHANGELOG entry** under `## [Unreleased]`:
   ```markdown
   ### Changed
   - Updated compatibility to FoundryVTT v13.x.x
   ```

### PF2e System Compatibility

When PF2e system releases a new major version:

1. **Review PF2e release notes** for breaking changes
2. **Test with new PF2e version**:
   - [ ] Module loads
   - [ ] Stress can be added/removed
   - [ ] Reroll with stress works
   - [ ] Chat messages display correctly
   - [ ] Compendium entries are accessible
3. **Check for API changes**:
   - Has `Check.reroll()` changed?
   - Has `ChatLog._getEntryContextOptions()` changed?
   - Have flag structures changed?
4. **Update module.json** relationships if needed:
   - Update `relationships.systems[0].compatibility.verified`
   - Update `relationships.systems[0].compatibility.minimum` if dropping support
5. **Add CHANGELOG entry**:
   ```markdown
   ### Fixed
   - Updated compatibility with PF2e system v7.0
   ```

### libWrapper Compatibility

The module depends on [libWrapper](https://github.com/ruipin/fvtt-lib-wrapper/). Check for updates:

1. Visit libWrapper releases page
2. Update `module.json` compatibility if needed
3. Test that ChatLog wrapping still works
4. Update CHANGELOG if libWrapper minimum version changes
