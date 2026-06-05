import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { VariantSelector } from '../src/components/VariantSelector/VariantSelector'
import type { ColorOption, SizeOption } from '../src/types'

const colors: ColorOption[] = [
  { name: 'Black', hex: '#000' },
  { name: 'White', hex: '#fff' },
]

const sizes: SizeOption[] = [
  { label: 'S', status: 'available' },
  { label: 'M', status: 'low-stock' },
  { label: 'L', status: 'sold-out' },
]

function renderVariantSelector(overrides?: Partial<Parameters<typeof VariantSelector>[0]>) {
  const onChange = vi.fn()
  render(
    <VariantSelector
      colors={colors}
      sizes={sizes}
      selected={{ color: 'Black', size: 'S' }}
      onChange={onChange}
      {...overrides}
    />
  )
  return { onChange }
}

describe('VariantSelector', () => {
  it('renders all size options', () => {
    renderVariantSelector()
    expect(screen.getByRole('option', { name: 'S' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'M' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'L' })).toBeInTheDocument()
  })

  it('sold-out size button is disabled', () => {
    renderVariantSelector()
    const soldOutBtn = screen.getByRole('option', { name: 'L' })
    expect(soldOutBtn).toBeDisabled()
  })

  it('clicking a sold-out size does not call onChange', async () => {
    const { onChange } = renderVariantSelector()
    const soldOutBtn = screen.getByRole('option', { name: 'L' })
    await userEvent.click(soldOutBtn)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('clicking an available size calls onChange with that size', async () => {
    const { onChange } = renderVariantSelector()
    await userEvent.click(screen.getByRole('option', { name: 'S' }))
    expect(onChange).toHaveBeenCalledWith({ size: 'S' })
  })

  it('shows low stock hint when selected size is low-stock', () => {
    renderVariantSelector({ selected: { color: 'Black', size: 'M' } })
    expect(screen.getByText('Only a few left!')).toBeInTheDocument()
  })

  it('does not show low stock hint when selected size is available', () => {
    renderVariantSelector({ selected: { color: 'Black', size: 'S' } })
    expect(screen.queryByText('Only a few left!')).not.toBeInTheDocument()
  })

  it('selected size button has aria-selected true', () => {
    renderVariantSelector({ selected: { color: 'Black', size: 'M' } })
    const selectedBtn = screen.getByRole('option', { name: 'M' })
    expect(selectedBtn).toHaveAttribute('aria-selected', 'true')
  })

  it('clicking a color calls onChange with that color', async () => {
    const { onChange } = renderVariantSelector()
    await userEvent.click(screen.getByRole('option', { name: 'White' }))
    expect(onChange).toHaveBeenCalledWith({ color: 'White' })
  })
})
