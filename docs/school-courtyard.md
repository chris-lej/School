# School Saga courtyard blockout

Open the deployed game with `?schoolPrototype=1` (or `&schoolPrototype=1` if the URL already has query parameters), then start the level.

This opt-in experiment adds a procedurally modeled Brazilian school facade, courtyard, planters and benches near the original Lola player spawn. It uses Babylon.js primitives and a generated sign, requiring no Blender assets.

**Limitations:** This is a visual blockout, not a complete replacement level. It is positioned 16 world units along +Z from the spawn; depending on the existing Lola map geometry it may overlap structures or be out of view. New geometry has no collision or interaction logic. The original controller, camera, level, and gameplay remain unchanged. Once the blockout is validated visually, the next iteration should build a dedicated school level with a defined spawn, proper collision surfaces, hallway, classroom and interactions.
