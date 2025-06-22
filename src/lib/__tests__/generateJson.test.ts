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
})
