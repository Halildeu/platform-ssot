#!/usr/bin/env python3
from __future__ import annotations

from ui_library_checks import ensure_dict, ensure_exists, ensure_list, fail, load_json, ok, read_web_scripts


SCRIPT = "check_ui_library_visual_contract"


def main() -> int:
    required = [
        "web/apps/mfe-shell/src/pages/admin/design-lab.index.json",
        "docs/02-architecture/context/ui-library-visual-review.contract.v1.json",
        "web/.storybook/main.ts",
        "web/.storybook/preview.ts",
        "web/storybook.config.mjs",
        "web/stories/_chromatic-trigger.ts",
        "web/storybook-static/index.html",
    ]
    missing = ensure_exists(*required)
    if missing:
        return fail(SCRIPT, [f"missing-file:{path}" for path in missing])

    index = load_json(required[0])
    scripts = read_web_scripts()
    visual = ensure_dict(index.get("visualRegression"))
    storybook = ensure_dict(visual.get("storybook"))
    summary = ensure_dict(visual.get("summary"))
    required_harnesses = ensure_list(visual.get("requiredHarnesses"))
    review_channel = ensure_dict(visual.get("reviewChannel"))
    review_contract = load_json(required[1])
    problems: list[str] = []

    for script_name in ["build-storybook", "chromatic", "gate:ui-library-visual"]:
        if script_name not in scripts:
            problems.append(f"missing-web-script:{script_name}")

    required_harness_count = int(summary.get("requiredHarnessCount") or 0)
    required_harness_present_count = int(summary.get("requiredHarnessPresentCount") or 0)
    if required_harness_count <= 0:
        problems.append("missing-required-visual-harnesses")
    if required_harness_count != required_harness_present_count:
        problems.append(
            f"required-visual-harness-drift:{required_harness_present_count}/{required_harness_count}"
        )

    missing_harnesses = [
        str(item.get("path") or "").strip()
        for item in required_harnesses
        if isinstance(item, dict) and not bool(item.get("present"))
    ]
    if missing_harnesses:
        problems.append("missing-visual-harness:" + ",".join(sorted(path for path in missing_harnesses if path)))

    if int(summary.get("designLabLiveDemoExports") or 0) <= 0:
        problems.append("missing-live-demo-coverage")
    if int(summary.get("storybookStoryFiles") or 0) <= 0:
        problems.append("missing-storybook-story-files")
    if int(summary.get("visualizableComponents") or 0) <= 0:
        problems.append("missing-visualizable-components")
    if int(summary.get("storybookCoveredComponents") or 0) <= 0:
        problems.append("missing-story-covered-components")
    if int(summary.get("releaseReadyComponents") or 0) <= 0:
        problems.append("missing-release-ready-components")
    if int(summary.get("releaseReadyStoryCoveredComponents") or 0) <= 0:
        problems.append("missing-release-ready-story-coverage")
    if storybook.get("staticOutputPath") != "web/storybook-static/index.html":
        problems.append("storybook-static-output-drift")
    if storybook.get("performanceHints") != "disabled-for-docs-build":
        problems.append("storybook-performance-hints-policy-drift")
    if storybook.get("performanceBudgetOwner") != "app-and-package-bundle-gates":
        problems.append("storybook-performance-budget-owner-drift")
    if review_channel.get("provider") != review_contract.get("provider"):
        problems.append("visual-review-provider-drift")
    if review_channel.get("contractPath") != required[1]:
        problems.append("visual-review-contract-path-drift")
    if not bool(review_channel.get("configured")):
        problems.append("visual-review-channel-unconfigured")
    if review_channel.get("reviewScript") != review_contract.get("review_script"):
        problems.append("visual-review-script-drift")
    if review_channel.get("storybookBuildScript") != review_contract.get("storybook_build_script"):
        problems.append("visual-review-build-script-drift")
    if review_channel.get("secretEnvVar") != review_contract.get("secret_env_var"):
        problems.append("visual-review-secret-env-drift")
    if review_channel.get("fallbackMode") != review_contract.get("review_mode_when_secret_missing"):
        problems.append("visual-review-fallback-mode-drift")
    if review_channel.get("staticArtifactPath") != review_contract.get("storybook_static_path"):
        problems.append("visual-review-static-artifact-drift")
    if review_channel.get("chromaticTriggerPath") != review_contract.get("chromatic_trigger_path"):
        problems.append("visual-review-trigger-path-drift")
    if review_channel.get("reviewMode") not in {
        review_contract.get("review_mode_when_secret_present"),
        review_contract.get("review_mode_when_secret_missing"),
    }:
        problems.append("visual-review-mode-invalid")

    if problems:
        return fail(SCRIPT, problems)
    return ok(
        SCRIPT,
        "stories=%d mdx=%d harness=%d/%d"
        % (
            int(summary.get("storybookStoryFiles") or 0),
            int(summary.get("mdxDocFiles") or 0),
            required_harness_present_count,
            required_harness_count,
        ),
    )


if __name__ == "__main__":
    raise SystemExit(main())
