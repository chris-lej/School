import { Color3, DynamicTexture, MeshBuilder, StandardMaterial, TransformNode, Vector3 } from '@babylonjs/core'
import store from '@/store/store'

/**
 * Opt-in visual blockout for School Saga.
 * Deliberately does not change the imported Lola level, collisions, camera or controller.
 */
export default function addSchoolCourtyard(): void {
  const scene = globalThis.scene
  const foot = scene.getMeshById('playerFoot_' + store.getSelfPlayerId())
  if (!foot) {
    console.warn('School courtyard skipped: player spawn is unavailable')
    return
  }

  // Place the first blockout in front of the original spawn, keeping the
  // starter level untouched. This is an exploratory visual, not a new level.
  const root = new TransformNode('school_courtyard_blockout', scene)
  root.position = foot.getAbsolutePosition().add(new Vector3(0, 0, 16))

  const material = (name: string, color: string) => {
    const result = new StandardMaterial(name, scene)
    result.diffuseColor = Color3.FromHexString(color)
    result.specularColor = Color3.Black()
    return result
  }
  const concrete = material('school_concrete', '#C8BBA7')
  const walls = material('school_walls', '#F0D9AC')
  const trim = material('school_trim', '#377A86')
  const roof = material('school_roof', '#B9654A')
  const glass = material('school_windows', '#46768A')
  const green = material('school_garden', '#5A8055')

  function box(name: string, size: [number, number, number], position: [number, number, number], mat: StandardMaterial) {
    const mesh = MeshBuilder.CreateBox(name, { width: size[0], height: size[1], depth: size[2] }, scene)
    mesh.parent = root
    mesh.position = new Vector3(...position)
    mesh.material = mat
    mesh.isPickable = false
    return mesh
  }

  box('courtyard_paving', [22, 0.12, 18], [0, -0.1, 0], concrete)
  box('school_main_building', [18, 7, 2.5], [0, 3.5, 7], walls)
  box('school_roofline', [19, 0.45, 3.2], [0, 7.2, 7], roof)
  box('school_blue_band', [18.2, 0.45, 2.65], [0, 1.2, 7], trim)
  box('school_entrance', [3, 3.2, 0.14], [0, 1.6, 5.67], trim)

  for (const x of [-7, -4.5, 4.5, 7]) {
    for (const y of [2.8, 5.3]) {
      box('school_classroom_window', [1.45, 1.35, 0.12], [x, y, 5.67], glass)
    }
  }
  for (const x of [-9, 9]) {
    box('courtyard_planter', [2, 0.55, 3.5], [x, 0.28, -1], roof)
    box('courtyard_shrub', [1.7, 0.2, 3.2], [x, 0.66, -1], green)
  }
  for (const x of [-4, 4]) {
    box('courtyard_bench_seat', [2.8, 0.18, 0.8], [x, 0.55, -4], roof)
    for (const dx of [-1.1, 1.1]) {
      box('courtyard_bench_leg', [0.18, 0.55, 0.65], [x + dx, 0.27, -4], trim)
    }
  }

  const signTexture = new DynamicTexture('school_sign_texture', { width: 1024, height: 256 }, scene, false)
  signTexture.hasAlpha = false
  signTexture.drawText('ESCOLA ESTADUAL', null, 168, 'bold 86px Arial', '#153B46', '#F6E9C9', true)
  const signMaterial = new StandardMaterial('school_sign_material', scene)
  signMaterial.diffuseTexture = signTexture
  signMaterial.emissiveColor = new Color3(0.25, 0.25, 0.25)
  const sign = box('school_entrance_sign', [6.5, 1.1, 0.08], [0, 4.7, 5.58], signMaterial)
  sign.isPickable = false
}
