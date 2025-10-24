import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";
import BioPagesManager from "@/components/bio-pages-manager";

// Mock the API request function
jest.mock("@/lib/queryClient", () => ({
  apiRequest: jest.fn(),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithQueryClient = (component: ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe("BioPagesManager", () => {
  const mockUserId = "test-user-id";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders bio pages manager with create button", () => {
    renderWithQueryClient(<BioPagesManager userId={mockUserId} />);
    
    expect(screen.getByText("Bio Pages")).toBeInTheDocument();
    expect(screen.getByText("Manage your multiple bio pages")).toBeInTheDocument();
    expect(screen.getByText("Create New Page")).toBeInTheDocument();
  });

  it("opens create modal when create button is clicked", async () => {
    renderWithQueryClient(<BioPagesManager userId={mockUserId} />);
    
    const createButton = screen.getByText("Create New Page");
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText("Create New Bio Page")).toBeInTheDocument();
      expect(screen.getByLabelText("Page Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Display Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Bio")).toBeInTheDocument();
    });
  });

  it("shows page name preview in create modal", async () => {
    renderWithQueryClient(<BioPagesManager userId={mockUserId} />);
    
    const createButton = screen.getByText("Create New Page");
    fireEvent.click(createButton);
    
    await waitFor(() => {
      const pageNameInput = screen.getByLabelText("Page Name");
      fireEvent.change(pageNameInput, { target: { value: "test-page" } });
      
      expect(screen.getByText("yoursite.com/test-page")).toBeInTheDocument();
    });
  });
});
