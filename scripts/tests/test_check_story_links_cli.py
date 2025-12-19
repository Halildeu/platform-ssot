import subprocess
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


class TestCheckStoryLinksCli(unittest.TestCase):
    def run_cmd(self, *args: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, *args],
            cwd=str(ROOT),
            text=True,
            capture_output=True,
        )

    def test_help_flag_exits_zero(self) -> None:
        proc = self.run_cmd("scripts/check_story_links.py", "--help")
        self.assertEqual(proc.returncode, 0, msg=proc.stderr or proc.stdout)
        self.assertIn("usage:", proc.stdout.lower())
        self.assertIn("check_story_links.py", proc.stdout)

    def test_short_help_flag_exits_zero(self) -> None:
        proc = self.run_cmd("scripts/check_story_links.py", "-h")
        self.assertEqual(proc.returncode, 0, msg=proc.stderr or proc.stdout)
        self.assertIn("usage:", proc.stdout.lower())

    def test_story_single_check_passes(self) -> None:
        proc = self.run_cmd("scripts/check_story_links.py", "STORY-0045")
        self.assertEqual(proc.returncode, 0, msg=proc.stderr or proc.stdout)
        self.assertIn("OK: STORY-0045", proc.stdout)


if __name__ == "__main__":
    unittest.main()

