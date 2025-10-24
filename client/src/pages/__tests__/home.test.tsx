import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock UI and other heavy components used by the page
vi.mock('@/components/ui/button', () => ({ Button: (props: any) => <button {...props} /> }));
vi.mock('@/components/profile-section', () => ({ default: (props: any) => <div data-testid="profile-section">{props.isEditMode ? 'edit' : 'view'}</div> }));
vi.mock('@/components/social-links-list', () => ({ default: (props: any) => <ul data-testid="links">{props.links?.map((l:any)=> <li key={l.id}>{l.title}</li>)}</ul> }));
vi.mock('lucide-react', () => ({ Edit: () => <span />, Eye: () => <span />, BarChart3: () => <span /> }));
vi.mock('wouter', async () => {
  return {
    useParams: () => ({ username: 'john' }),
    useLocation: () => [window.location.pathname, vi.fn()],
    Link: ({ href, children }: any) => <a href={href}>{children}</a>,
  };
});

// Mock react-query's useQuery to drive page states
const useQueryMock = vi.fn();
vi.mock('@tanstack/react-query', async (orig) => {
  const mod: any = await (orig as any)();
  return {
    ...mod,
    useQuery: (...args: any[]) => useQueryMock(...args),
  };
});

import Home from '@/pages/home';

describe('Home page (current branch)', () => {
  const realClipboard = navigator.clipboard;
  const realOpen = window.open;

  beforeEach(() => {
    useQueryMock.mockReset();
    (navigator as any).clipboard = { writeText: vi.fn().mockResolvedValue(void 0) };
    window.open = vi.fn();
    // default URL to include edit permission
    Object.defineProperty(window, 'location', {
      value: new URL('http://localhost/john?edit=shivam'),
      writable: true,
    });
  });

  afterEach(() => {
    (navigator as any).clipboard = realClipboard;
    window.open = realOpen;
  });

  it('renders "Profile Not Found" when query errors or no data', () => {
    useQueryMock.mockReturnValue({ isLoading: false, error: new Error('x'), data: undefined });
    render(<Home />);
    expect(screen.getByText(/Profile Not Found/i)).toBeInTheDocument();
  });

  it('shows edit toggle when URL has edit permission and toggles label', async () => {
    const data = {
      profile: { id: 'p1', username: 'john', displayName: 'John', bio: '' },
      links: [{ id: 'l1', title: 'GitHub', url: 'https://github.com/john' }],
    };
    useQueryMock.mockReturnValue({ isLoading: false, error: null, data });
    render(<Home />);
    const toggle = screen.getByTestId('button-edit-mode');
    expect(toggle).toBeInTheDocument();
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    fireEvent.click(toggle);
    expect(screen.getByText('View Mode')).toBeInTheDocument();
  });

  it('copies share URL to clipboard', async () => {
    const data = {
      profile: { id: 'p1', username: 'john', displayName: 'John', bio: '' },
      links: [],
    };
    useQueryMock.mockReturnValue({ isLoading: false, error: null, data });
    render(<Home />);
    fireEvent.click(screen.getByTestId('button-copy-url'));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://localhost/john');
  });

  it('opens social share window for Twitter', async () => {
    const data = {
      profile: { id: 'p1', username: 'john', displayName: 'John', bio: '' },
      links: [],
    };
    useQueryMock.mockReturnValue({ isLoading: false, error: null, data });
    render(<Home />);
    fireEvent.click(screen.getByTestId('button-share-twitter'));
    expect(window.open).toHaveBeenCalled();
  });
});