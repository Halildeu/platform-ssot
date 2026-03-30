"""Configure sys.path so `extractor` package with relative imports works."""
import sys
import os

# Project root (tools/schema-explorer/)
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)
