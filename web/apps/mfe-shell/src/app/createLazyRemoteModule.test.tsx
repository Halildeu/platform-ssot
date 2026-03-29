// @vitest-environment jsdom
import React, { Suspense } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { createLazyRemoteModule } from "./createLazyRemoteModule";

describe("createLazyRemoteModule", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("loader basarili oldugunda remote modulunu render eder", async () => {
    const RemoteModule = createLazyRemoteModule("Users", async () => ({
      default: () => <div>Users module</div>,
    }));

    render(
      <Suspense fallback={<div>Yukleniyor</div>}>
        <RemoteModule />
      </Suspense>,
    );

    expect(await screen.findByText("Users module")).toBeInTheDocument();
  });

  it("loader hata verirse fallback kartini render eder", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const RemoteModule = createLazyRemoteModule("Reporting", async () => {
      throw new Error("remote offline");
    });

    render(
      <Suspense fallback={<div>Yukleniyor</div>}>
        <RemoteModule />
      </Suspense>,
    );

    expect(
      await screen.findByText("Reporting su anda kullanilamiyor"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Remote modulu yuklenemedi. Local remoteEntry baglantisini kontrol et.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("remote-module-fallback-reporting"),
    ).toBeInTheDocument();
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });
});
