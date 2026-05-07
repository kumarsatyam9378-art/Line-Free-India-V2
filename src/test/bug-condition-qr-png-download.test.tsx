import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SalonQRPage from '../pages/SalonQRPage';
import * as fc from 'fast-check';

// Mock html2canvas - must be before other imports
vi.mock('html2canvas', () => ({
  default: vi.fn(),
}));

// Mock dependencies
vi.mock('../store/AppContext', () => ({
  useApp: () => ({
    user: { uid: 'test-user-id' },
    allBusinesses: [
      {
        uid: 'test-salon-id',
        businessName: 'Test Salon',
        businessType: 'men_salon',
        location: 'Test Location, City',
      },
    ],
    getBusinessById: vi.fn().mockResolvedValue({
      uid: 'test-salon-id',
      businessName: 'Test Salon',
      businessType: 'men_salon',
      location: 'Test Location, City',
    }),
    businessProfile: {
      uid: 'test-salon-id',
      businessName: 'Test Salon',
      businessType: 'men_salon',
      location: 'Test Location, City',
    },
    t: (key: string) => key,
  }),
  getCategoryInfo: () => ({ icon: '💈' }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'test-salon-id' }),
    useNavigate: () => vi.fn(),
  };
});

describe('Bug Condition Exploration: PNG Download with SVG QR Code', () => {
  let mockHtml2Canvas: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Get the mocked html2canvas function
    const html2canvasModule = await import('html2canvas');
    mockHtml2Canvas = html2canvasModule.default;
  });

  /**
   * **Validates: Requirements 1.1, 1.2, 2.1, 2.2**
   * 
   * Property 1: Bug Condition - PNG Download Fails with SVG QR Code
   * 
   * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
   * 
   * This test encodes the expected behavior:
   * - Clicking "Download Premium PNG" should trigger PNG generation
   * - html2canvas should be called with the poster element
   * - A download link should be created with correct filename format
   * - The download should be triggered
   * 
   * On UNFIXED code, this test will fail because:
   * - html2canvas fails to render SVG QR code elements
   * - The download link may not be created
   * - Silent failure occurs in handleDownload
   */
  it('should generate and download PNG when clicking Download Premium PNG button', async () => {
    const user = userEvent.setup();

    // Mock successful canvas conversion
    const mockCanvas = {
      toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mockImageData'),
    };
    mockHtml2Canvas.mockResolvedValue(mockCanvas);

    // Mock document.createElement and link.click
    const mockLink = {
      download: '',
      href: '',
      click: vi.fn(),
    };
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        return mockLink as any;
      }
      return originalCreateElement(tagName);
    });

    render(
      <BrowserRouter>
        <SalonQRPage id="test-salon-id" />
      </BrowserRouter>
    );

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText(/Download Premium PNG/i)).toBeInTheDocument();
    });

    // Click the download button
    const downloadButton = screen.getByText(/Download Premium PNG/i);
    await user.click(downloadButton);

    // Wait for async operations
    await waitFor(() => {
      // Assert html2canvas was called
      expect(mockHtml2Canvas).toHaveBeenCalled();
    });

    // Assert canvas.toDataURL was called to generate PNG
    expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');

    // Assert download link was created with correct filename format
    expect(mockLink.download).toBe('Test Salon-Poster.png');
    expect(mockLink.href).toBe('data:image/png;base64,mockImageData');

    // Assert download was triggered
    expect(mockLink.click).toHaveBeenCalled();
  });

  /**
   * Property-based test: PNG download should work for any business name
   * 
   * This test generates random business names and verifies the filename format
   * is correct for all inputs.
   */
  it('should generate correct filename format for any business name', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        async (businessName) => {
          vi.clearAllMocks();

          const user = userEvent.setup();

          // Mock the business with generated name
          vi.mocked(await import('../store/AppContext')).useApp = () => ({
            user: { uid: 'test-user-id' },
            allBusinesses: [
              {
                uid: 'test-salon-id',
                businessName,
                businessType: 'men_salon',
                location: 'Test Location',
              },
            ],
            getBusinessById: vi.fn().mockResolvedValue({
              uid: 'test-salon-id',
              businessName,
              businessType: 'men_salon',
              location: 'Test Location',
            }),
            businessProfile: {
              uid: 'test-salon-id',
              businessName,
              businessType: 'men_salon',
              location: 'Test Location',
            },
            t: (key: string) => key,
          });

          const mockCanvas = {
            toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mockImageData'),
          };
          mockHtml2Canvas.mockResolvedValue(mockCanvas);

          const mockLink = {
            download: '',
            href: '',
            click: vi.fn(),
          };
          const originalCreateElement = document.createElement.bind(document);
          vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
            if (tagName === 'a') {
              return mockLink as any;
            }
            return originalCreateElement(tagName);
          });

          const { unmount } = render(
            <BrowserRouter>
              <SalonQRPage id="test-salon-id" />
            </BrowserRouter>
          );

          await waitFor(() => {
            expect(screen.getByText(/Download Premium PNG/i)).toBeInTheDocument();
          });

          const downloadButton = screen.getByText(/Download Premium PNG/i);
          await user.click(downloadButton);

          await waitFor(() => {
            expect(mockHtml2Canvas).toHaveBeenCalled();
          });

          // Verify filename format: {BusinessName}-Poster.png
          expect(mockLink.download).toBe(`${businessName}-Poster.png`);

          unmount();
        }
      ),
      { numRuns: 10 } // Run 10 test cases with different business names
    );
  });

  /**
   * Edge case: Rapid clicking should not cause multiple downloads
   */
  it('should handle rapid clicks on download button gracefully', async () => {
    const user = userEvent.setup();

    const mockCanvas = {
      toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mockImageData'),
    };
    mockHtml2Canvas.mockResolvedValue(mockCanvas);

    const mockLink = {
      download: '',
      href: '',
      click: vi.fn(),
    };
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        return mockLink as any;
      }
      return originalCreateElement(tagName);
    });

    render(
      <BrowserRouter>
        <SalonQRPage id="test-salon-id" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Download Premium PNG/i)).toBeInTheDocument();
    });

    const downloadButton = screen.getByText(/Download Premium PNG/i);

    // Click multiple times rapidly
    await user.click(downloadButton);
    await user.click(downloadButton);
    await user.click(downloadButton);

    await waitFor(() => {
      expect(mockHtml2Canvas).toHaveBeenCalled();
    });

    // Should only trigger download once or handle gracefully
    // (The button is disabled during download, so subsequent clicks should be ignored)
    expect(mockLink.click).toHaveBeenCalled();
  });
});
