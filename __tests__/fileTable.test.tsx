import {
  multipleSelectionFileTableField,
  singleSelectionFileTableField,
} from "@components/puck-fields/fileTable";
import { PuckContext } from "@measured/puck";
import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

jest.mock("@lib/filemanager/filemanager", () => {
  const mockFileManagerService = {
    deleteFile: jest.fn(),
    saveFile: jest.fn(),
    getFileUrl: jest.fn((name) => {
      return Promise.resolve(`https://mock-url.com/${name}`);
    }),
    getFile: jest.fn(),
    getFileNames: jest.fn(() => {
      return Promise.resolve([
        "test-file.txt",
        "another-file.png",
        "document.pdf",
      ]);
    }),
  };

  return {
    getFileManagerService: jest.fn(() =>
      Promise.resolve(mockFileManagerService)
    ),
  };
});

describe("singleSelectionFileTable component", () => {
  const renderWithQueryClient = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    queryClient.clear();
  });

  it("renders the component unchanged (snapshot)", async () => {
    const { container } = renderWithQueryClient(
      <singleSelectionFileTableField.render
        {...{
          field: singleSelectionFileTableField,
          id: "test-id",
          name: "test-name",
          value: {
            name: "test-file.txt",
            url: "https://mock-url.com/test-file.txt",
          },
          onChange: () => {},
          puck: {} as PuckContext,
        }}
      />
    );
    await screen.findByText("test-file.txt");
    expect(container).toMatchSnapshot();
  });

  it("renders a singleSelectionFileTable", async () => {
    renderWithQueryClient(
      <singleSelectionFileTableField.render
        {...{
          field: singleSelectionFileTableField,
          id: "test-id",
          name: "test-name",
          value: {
            name: "test-file.txt",
            url: "https://mock-url.com/test-file.txt",
          },
          onChange: () => {},
          puck: {} as PuckContext,
        }}
      />
    );
    expect(screen.getByText("loading...")).toBeInTheDocument();
    const textElement = await screen.findByText("test-file.txt");
    expect(textElement).toBeInTheDocument();
    expect(screen.queryByText("loading...")).not.toBeInTheDocument();
  });

  it("marks the file specified in 'value' as selected", async () => {
    const fileNameToTest = "test-file.txt";
    const fileUrlToTest = "https://test-url.com";

    renderWithQueryClient(
      <singleSelectionFileTableField.render
        {...{
          field: singleSelectionFileTableField,
          id: "test-id",
          name: "test-name",
          value: { name: fileNameToTest, url: fileUrlToTest },
          onChange: () => {},
          puck: {} as PuckContext,
        }}
      />
    );

    const fileNameElement = await screen.findByText(fileNameToTest);
    expect(fileNameElement).toBeInTheDocument();

    const rowElement = fileNameElement.closest("tr");
    expect(rowElement).toBeInTheDocument();

    expect(rowElement).toHaveAttribute("data-state", "selected");

    const radioButton = within(rowElement!).getByRole("radio");
    expect(radioButton).toBeInTheDocument();
    expect(radioButton).toBeChecked();
    expect(radioButton).toHaveAttribute("aria-checked", "true");
  });
});

describe("multipleSelectionFileTable component", () => {
  const renderWithQueryClient = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    queryClient.clear();
  });
  it("renders the component unchanged (snapshot)", async () => {
    const { container } = renderWithQueryClient(
      <multipleSelectionFileTableField.render
        {...{
          field: multipleSelectionFileTableField,
          id: "test-id",
          name: "test-name",
          value: [
            {
              name: "test-file.txt",
              url: "https://mock-url.com/test-file.txt",
            },
            {
              name: "another-file.png",
              url: "https://mock-url.com/another-file.png",
            },
          ],
          onChange: () => {},
          puck: {} as PuckContext,
        }}
      />
    );
    await screen.findByText("test-file.txt");
    expect(container).toMatchSnapshot();
  });

  it("renders a multipleSelectionFileTableField", async () => {
    renderWithQueryClient(
      <multipleSelectionFileTableField.render
        {...{
          field: multipleSelectionFileTableField,
          id: "test-id",
          name: "test-name",
          value: [
            {
              name: "test-file.txt",
              url: "https://mock-url.com/test-file.txt",
            },
            {
              name: "another-file.png",
              url: "https://mock-url.com/another-file.png",
            },
          ],
          onChange: () => {},
          puck: {} as PuckContext,
        }}
      />
    );
    expect(screen.getByText("loading...")).toBeInTheDocument();
    const textElement = await screen.findByText("test-file.txt");
    expect(textElement).toBeInTheDocument();
    expect(screen.queryByText("loading...")).not.toBeInTheDocument();
  });
});
