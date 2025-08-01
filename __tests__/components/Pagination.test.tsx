import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from '@/components/Pagination'

describe('Pagination Component', () => {
  const mockOnPageChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with basic props', () => {
    render(
      <Pagination 
        currentPage={0} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    )

    // Should show page 1 button (currentPage 0 = display page 1)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
  })

  it('disables previous button on first page', () => {
    render(
      <Pagination 
        currentPage={0} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    )

    const prevButton = screen.getByText('Previous')
    expect(prevButton.closest('button')).toHaveClass('cursor-not-allowed')
  })

  it('disables next button on last page', () => {
    render(
      <Pagination 
        currentPage={4} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    )

    const nextButton = screen.getByText('Next')
    expect(nextButton.closest('button')).toHaveClass('cursor-not-allowed')
  })

  it('calls onPageChange when previous button is clicked', () => {
    render(
      <Pagination 
        currentPage={2} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    )

    const prevButton = screen.getByText('Previous')
    fireEvent.click(prevButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(1)
  })

  it('calls onPageChange when next button is clicked', () => {
    render(
      <Pagination 
        currentPage={2} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    )

    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(3)
  })

  it('renders correctly with single page', () => {
    render(
      <Pagination 
        currentPage={0} 
        totalPages={1} 
        onPageChange={mockOnPageChange} 
      />
    )

    expect(screen.getByText('1')).toBeInTheDocument()
    
    const prevButton = screen.getByText('Previous')
    const nextButton = screen.getByText('Next')
    
    // Previous should be disabled (can't be clicked)
    expect(prevButton.closest('button')).toHaveClass('cursor-not-allowed')
    // Next should also be disabled (can't be clicked) 
    expect(nextButton.closest('button')).toHaveClass('cursor-not-allowed')
  })

  it('handles zero pages correctly', () => {
    render(
      <Pagination 
        currentPage={0} 
        totalPages={0} 
        onPageChange={mockOnPageChange} 
      />
    )

    // With 0 pages, no page buttons should be rendered
    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
    
    // Both buttons should be disabled
    const prevButton = screen.getByText('Previous')
    const nextButton = screen.getByText('Next')
    expect(prevButton.closest('button')).toHaveClass('cursor-not-allowed')
    expect(nextButton.closest('button')).toHaveClass('cursor-not-allowed')
  })
})