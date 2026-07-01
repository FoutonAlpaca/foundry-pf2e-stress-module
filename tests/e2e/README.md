# Manual Foundry VTT Setup for E2E Tests

## Prerequisites

Before the e2e tests can be run a world must be configured based on the following:

- Foundry VTT v13.0+ installed at `C:\Program Files\Foundry Virtual Tabletop\`
- World with PF2e system installed
- lib-wrapper module installed (required dependency)
- Module installed at: `%LOCALAPPDATA%\FoundryVTT\Data\modules\pf2e-stress`
- Load world as Gamemaster (no password)
- Create 3 actors:
  - Bob
  - Reroller
  - DamageActor
    - Set DamageActor's attributes all to 4 (or any value above 1)
    - Set DamageActor's wounded state to 1
- Create a scene (any name)
- Add DamageActor to the scene (only actor on scene)
- Start the foundry server, but do not login.
- Run all tests using npm test:e2e

Bob is used for the [stress-system-actor-management.spec.ts](stress-system-actor-management.spec.ts)
Reroller is used for [stress-system.interactions.spec.ts - Reroll mechanic](stress-system-interactions.spec.ts)
DamageActor is used for [stress-system.interactions.spec.ts - Stress on zero hp](stress-system-interactions.spec.ts)

Future Todos:
- Add more test coverage (settings, other roll types)
- Avoid hardcoded test assumptions (actor names, hit points, wounded state, etc.,)
- Setup the world using the docker approach in [docker-orchestrator.md](https://github.com/TheFehr/foundry-playwright/blob/main/docs/architecture/docker-orchestrator.md)
