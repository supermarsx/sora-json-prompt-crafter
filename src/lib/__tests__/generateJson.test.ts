import { generateJson } from '../generateJson'
import { DEFAULT_OPTIONS } from '../defaultOptions'

function parse(json: string) {
  return JSON.parse(json) as Record<string, unknown>
}

describe('generateJson', () => {
  test('includes negative_prompt when enabled', () => {
    const opts = { ...DEFAULT_OPTIONS, use_negative_prompt: true }
    const obj = parse(generateJson(opts))
    expect(obj.negative_prompt).toBeDefined()
  })

  test('omits negative_prompt when disabled', () => {
    const opts = { ...DEFAULT_OPTIONS, use_negative_prompt: false }
    const obj = parse(generateJson(opts))
    expect(obj.negative_prompt).toBeUndefined()
  })

  test('omits all dimension fields when format disabled', () => {
    const opts = {
      ...DEFAULT_OPTIONS,
      use_dimensions_format: false,
    }
    const obj = parse(generateJson(opts))
    expect(obj.width).toBeUndefined()
    expect(obj.height).toBeUndefined()
    expect(obj.aspect_ratio).toBeUndefined()
    expect(obj.output_format).toBeUndefined()
  })

  test('keeps aspect ratio when dimensions disabled but format enabled', () => {
    const opts = {
      ...DEFAULT_OPTIONS,
      use_dimensions_format: true,
      use_dimensions: false,
    }
    const obj = parse(generateJson(opts))
    expect(obj.width).toBeUndefined()
    expect(obj.height).toBeUndefined()
    expect(obj.aspect_ratio).toBeDefined()
  })

  test('removes style_preset when toggled off', () => {
    const opts = { ...DEFAULT_OPTIONS, use_style_preset: false }
    const obj = parse(generateJson(opts))
    expect(obj.style_preset).toBeUndefined()
  })

  test('removes material fields when use_material is false', () => {
    const opts = { ...DEFAULT_OPTIONS, use_material: false }
    const obj = parse(generateJson(opts))
    expect(obj.made_out_of).toBeUndefined()
    expect(obj.secondary_material).toBeUndefined()
  })

  test('removes motion fields when use_motion_animation is false', () => {
    const opts = { ...DEFAULT_OPTIONS, use_motion_animation: false }
    const obj = parse(generateJson(opts))
    expect(obj.duration_seconds).toBeUndefined()
    expect(obj.fps).toBeUndefined()
    expect(obj.motion_strength).toBeUndefined()
    expect(obj.camera_motion).toBeUndefined()
    expect(obj.motion_direction).toBeUndefined()
    expect(obj.frame_interpolation).toBeUndefined()
  })

  test('keeps material and motion fields when enabled', () => {
    const opts = {
      ...DEFAULT_OPTIONS,
      use_material: true,
      use_secondary_material: true,
      secondary_material: 'wood',
      use_motion_animation: true,
      use_duration: true,
    }
    const obj = parse(generateJson(opts))
    expect(obj.made_out_of).toBeDefined()
    expect(obj.secondary_material).toBeDefined()
    expect(obj.duration_seconds).toBeDefined()
    expect(obj.fps).toBeDefined()
    expect(obj.motion_strength).toBeDefined()
    expect(obj.camera_motion).toBeDefined()
    expect(obj.motion_direction).toBeDefined()
    expect(obj.frame_interpolation).toBeDefined()
  })
})
