# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.4.0] - 2025-01-17

### Added
- Module settings to specify the cost to reroll each 'roll type' when doing a reroll
- Chat message now shows the previous stress value and the new value to help track the amount changed by the settings
- Compendium items for all actions, recovery options and trauma entries
- Compendium journal entry for describing the system, actions, trauma and recovery rules.
- Updated compatibility for Foundry V12.133 and pf2e v6.8.2

### Fixed
- Update CSS path to correctly replace hero points with stress in the party sheet
- Updated npm packages to latest

## [1.3.0] - 2024-07-21

### Added
- When reduced to zero hp, new formula is 1 + the current wounded value (if any)

### Fixed
- Correctly format the message when changing stress from the character sheet

## [1.2.0] - 2024-07-12

### Added
- Send chat message when stress value is changed

## [1.1.0] - 2024-07-12

### Added
- Add one point of stress when a character is reduced to 0 HP.
- Update compatibility for Foundry V12 and pf2e v6

## [1.0.0] - 2024-06-09

### Changed
- ***Module now depends on [libWrapper](https://foundryvtt.com/packages/lib-wrapper/)***
- Added a stress icon to all stress labels.

### Added
- Right-Click context menu to reroll using a point of stress. This will reroll and add one point of stress to the character.

## [0.1.2] - 2024-02-11

### Fixed
- Removed debug logging

## [0.1.1] - 2024-01-28

### Fixed
- Fix changelog GitHub references
- Added missing download link in module.json

## [0.1.0] - 2024-01-28

### Added

- Created module with ability to set stress value on a character sheet and show the current value on the party sheet

[Unreleased]: https://github.com/FoutonAlpaca/foundry-pf2e-stress-module/compare/1.4.0...HEAD
[1.4.0]: https://github.com/FoutonAlpaca/foundry-pf2e-stress-module/releases/tag/1.4.0
[1.3.0]: https://github.com/FoutonAlpaca/foundry-pf2e-stress-module/releases/tag/1.3.0
[1.2.0]: https://github.com/FoutonAlpaca/foundry-pf2e-stress-module/releases/tag/1.2.0
[1.1.0]: https://github.com/FoutonAlpaca/foundry-pf2e-stress-module/releases/tag/1.1.0
[1.0.0]: https://github.com/FoutonAlpaca/foundry-pf2e-stress-module/releases/tag/1.0.0
[0.1.2]: https://github.com/FoutonAlpaca/foundry-pf2e-stress-module/releases/tag/0.1.2
[0.1.1]: https://github.com/FoutonAlpaca/foundry-pf2e-stress-module/releases/tag/0.1.1
[0.1.0]: https://github.com/FoutonAlpaca/foundry-pf2e-stress-module/releases/tag/0.1.0
