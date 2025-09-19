import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActivitiesPage from '@/app/page';
import MapModal from '@/components/MapModal';
import AllLocationsModal from '@/components/AllLocationsModal';
import CalendarModal from '@/components/CalendarModal';


// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock window.location
Object.defineProperty(window, 'location', {
  value: { href: '' },
  writable: true,
});

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

describe('Component Compilation Tests', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  test('ActivitiesPage renders without errors', () => {
    render(<ActivitiesPage />);
    expect(screen.getByText('Moments')).toBeInTheDocument();
  });

  test('MapModal renders without errors', () => {
    render(<MapModal address="Test Address" onClose={() => {}} />);
    expect(screen.getByText('Test Address')).toBeInTheDocument();
  });

  test('AllLocationsModal renders without errors', () => {
    const activities = [
      { id: 1, title: 'Test', address: 'Test Address', labels: [], ayoubRating: 5, medinaRating: 5, date: '2024-01-01' }
    ];
    render(<AllLocationsModal activities={activities} onClose={() => {}} />);
    expect(screen.getByText('All Activity Locations')).toBeInTheDocument();
  });

  test('CalendarModal renders without errors', () => {
    const activities = [
      { id: 1, title: 'Test', labels: [], ayoubRating: 5, medinaRating: 5, date: '2024-01-01' }
    ];
    render(<CalendarModal activities={activities} onClose={() => {}} onActivityClick={() => {}} />);
    expect(screen.getByText('Month')).toBeInTheDocument();
  });


});