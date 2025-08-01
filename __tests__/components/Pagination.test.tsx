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

    // Should show current page info
    expect(screen.getByText(/page 1 of 5/i)).toBeInTheDocument()
  })

  it('disables previous button on first page', () => {
    render(
      <Pagination 
        currentPage={0} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    )

    const prevButton = screen.getByLabelText(/previous page/i)
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(
      <Pagination 
        currentPage={4} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    )

    const nextButton = screen.getByLabelText(/next page/i)
    expect(nextButton).toBeDisabled()
  })

  it('calls onPageChange when previous button is clicked', () => {
    render(
      <Pagination 
        currentPage={2} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    )

    const prevButton = screen.getByLabelText(/previous page/i)
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

    const nextButton = screen.getByLabelText(/next page/i)
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

    expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument()
    
    const prevButton = screen.getByLabelText(/previous page/i)
    const nextButton = screen.getByLabelText(/next page/i)
    
    expect(prevButton).toBeDisabled()
    expect(nextButton).toBeDisabled()
  })

  it('handles zero pages correctly', () => {
    render(
      <Pagination 
        currentPage={0} 
        totalPages={0} 
        onPageChange={mockOnPageChange} 
      />
    )

    expect(screen.getByText(/page 1 of 0/i)).toBeInTheDocument()
  })
})