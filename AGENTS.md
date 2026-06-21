Foundry VTT module for Pathfinder 2e system.

Docs:
- **[ARCHITECTURE.md](ARCHITECTURE.md)** — Code structure, data flow, and design rationale
- **[EXTENDING.md](EXTENDING.md)** — Extension patterns and public APIs
- **[COMPENDIUM.md](COMPENDIUM.md)** — Pack management and editing workflow
- **[MAINTENANCE.md](MAINTENANCE.md)** — Release process, testing, and compatibility procedures

## Best docs for code work
1. `ARCHITECTURE.md` — primary entry point for understanding the code layout and runtime behavior
2. `EXTENDING.md` — how to add features or customize behavior safely
3. `README.md` — feature summary and quick onboarding
4. `AGENTS.md` — repo conventions, tests, and deployment guidance

**Note:** `COMPENDIUM.md` and `MAINTENANCE.md` are secondary and only needed when working on pack management or release tasks.

## Testing Rules
**Always run tests after making any changes.** Before committing or completing a task, execute the test suite to verify your changes don't break existing functionality.

```bash
# Run all unit and e2e tests
npm test:all
```

## Deployment Rules (After Source Code Changes)
**When modifying source files in `scripts/`, `languages/`, or `styles/`:**

1. **Deploy updated module:**
   ```powershell
   # From project root:
   powershell -ExecutionPolicy Bypass -File .\Copy-ModuleToFoundry.ps1 `
     -FoundryModuleDirectory 'C:/Users/Martin/AppData/Local/FoundryVTT/Data/modules/pf2e-stress' `
     -SkipPacks

   # Or use the npm script:
   npx pwsh -File .\Copy-ModuleToFoundry.ps1 -FoundryModuleDirectory './foundry-modules/pf2e-stress' -SkipPacks
   ```

**Note:** Module uses hot reload - no restart needed after deployment.

## Code Style Rules
- **Avoid redundant comments**: Don't comment what the code clearly expresses (e.g., "click body to blur")
- **Use clear variable names**: `currentStress` instead of `currentValue` when context is obvious
- **Extract functions for complex logic**: If a step isn't self-explanatory, make it a named function
