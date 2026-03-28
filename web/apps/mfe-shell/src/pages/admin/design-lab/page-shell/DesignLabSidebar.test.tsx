// @vitest-environment jsdom

import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DesignLabSidebar } from "./DesignLabSidebar";

vi.mock("../useDesignLabI18n", () => ({
  useDesignLabI18n: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      if (params?.count !== undefined) {
        return `${key}:${String(params.count)}`;
      }
      if (params?.query !== undefined) {
        return `${key}:${String(params.query)}`;
      }
      if (params?.lens !== undefined) {
        return `${key}:${String(params.lens)}`;
      }
      return key;
    },
  }),
}));

describe("DesignLabSidebar", () => {
  const ProductTreeComponent = () => <div data-testid="product-tree">tree</div>;
  const SectionBadgeComponent = ({ label }: { label: React.ReactNode }) => (
    <span>{label}</span>
  );

  const createProps = () => ({
    activeLayerId: "components",
    sidebarHelpText: "yardim",
    sidebarSearchValue: "",
    sidebarSearchPlaceholder: "Ara",
    activeTaxonomySectionTitle: "Components",
    componentFamilyTitle: "Navigation",
    componentFamilyDescription: "Menu Bar / Navigation Rail",
    componentFamilyBadges: ["Components", "Navigation", "6 item"],
    familyItems: [
      {
        familyId: "family-nav-shell",
        recipeId: "recipe-nav-shell",
        title: "Navigation shell",
        clusterTitle: "Review & Approval",
        clusterDescription: "Detay ve karar akislarini toplar",
        intent: "Shell akisi",
        ownerBlocks: ["shell", "navigation"],
        primarySectionTitle: "Navigation",
      },
      {
        familyId: "family-search-listing",
        recipeId: "recipe-search-listing",
        title: "Search listing",
        clusterTitle: "Search & Listing",
        clusterDescription: "Arama ve listing akislarini toplar",
        intent: "Liste akisi",
        ownerBlocks: ["search", "listing"],
        primarySectionTitle: "Recipes",
      },
    ],
    selectedFamilyId: null,
    onFamilySelect: vi.fn(),
    onSearchChange: vi.fn(),
    treeTracks: [],
    treeSelection: null,
    onTreeSelectionChange: vi.fn(),
    ProductTreeComponent,
    SectionBadgeComponent,
  });

  afterEach(() => {
    cleanup();
  });

  it("component katmaninda component tree ve secili baglami gorunur tutar", () => {
    const baseProps = createProps();
    render(<DesignLabSidebar {...baseProps} />);

    expect(
      screen.queryByTestId("design-lab-section-foundations"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("design-lab-workspace-components"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("design-lab-workspace-recipes"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId("design-lab-component-family-card"),
    ).toHaveTextContent("Navigation");
    expect(screen.getByText("designlab.sidebar.productTree.title")).toBeInTheDocument();
    expect(screen.getByTestId("product-tree")).toBeInTheDocument();
    expect(
      screen.getByText("designlab.sidebar.context.title"),
    ).toBeInTheDocument();
    expect(screen.getByText("Menu Bar / Navigation Rail")).toBeInTheDocument();
    expect(screen.getAllByText("Components").length).toBeGreaterThan(0);
    expect(screen.getByText("6 item")).toBeInTheDocument();
  });

  it("foundations katmaninda foundations-ozel tree renderer kullanir", () => {
    const baseProps = createProps();
    render(
      <DesignLabSidebar
        {...baseProps}
        activeLayerId="foundations"
        activeTaxonomySectionTitle="Foundations"
      />,
    );

    expect(
      screen.getByTestId("design-lab-foundation-family-card"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("design-lab-foundation-tree")).toBeInTheDocument();
    expect(
      screen.queryByTestId("design-lab-component-family-card"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("design-lab-recipe-list"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("designlab.sidebar.foundationTree.title"),
    ).toBeInTheDocument();
  });

  it("recipe katmaninda cluster ve recipe baglamini gorunur tutar", () => {
    const baseProps = createProps();
    render(
      <DesignLabSidebar
        {...baseProps}
        activeLayerId="recipes"
        sidebarSearchValue="nav"
        selectedFamilyId="family-nav-shell"
      />,
    );

    expect(screen.getByTestId("design-lab-recipe-list")).toBeInTheDocument();
    expect(
      screen.getByTestId("design-lab-recipe-family-nav-shell"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("design-lab-recipe-cluster-review-approval"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("design-lab-recipe-cluster-search-listing"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Detay ve karar akislarini toplar"),
    ).toBeInTheDocument();
    expect(screen.getByText("Navigation / Shell akisi")).toBeInTheDocument();
    expect(
      screen.getByLabelText("designlab.sidebar.context.title"),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("design-lab-search"), {
      target: { value: "shell" },
    });

    expect(baseProps.onSearchChange).toHaveBeenCalledWith("shell");
  });

  it("pages katmaninda recipe liste yerine page-template listesi kullanir", () => {
    const baseProps = createProps();
    render(
      <DesignLabSidebar
        {...baseProps}
        activeLayerId="pages"
        activeTaxonomySectionTitle="Pages"
        selectedFamilyId="family-nav-shell"
      />,
    );

    expect(
      screen.queryByTestId("design-lab-recipe-list"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId("design-lab-page-template-list"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("design-lab-page-family-review-approval"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("design-lab-page-template-family-nav-shell"),
    ).toBeInTheDocument();
    expect(screen.getByText("designlab.sidebar.pageList.title")).toBeInTheDocument();
    expect(screen.getAllByText("Pages")).not.toHaveLength(0);
  });
});
