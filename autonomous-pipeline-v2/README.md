# autonomous-orchestrator (v0)

Bu repo, deterministik **control plane** + kısıtlı **execution plane** yaklaşımıyla
WF-CORE mini workflow’unu koşturan “orchestrator v0” iskeletini içerir.

## Hızlı Başlangıç

WF-CORE (process executor):

```bash
python3 runner/run_wf_core.py \
  --request examples/request.WF-CORE.v1.json \
  --executor-isolation process \
  --out-root .autopilot-tmp/runs \
  --force
```

High-risk (suspend üretir) + resume:

```bash
python3 runner/run_wf_core.py --request examples/request.WF-CORE.v1.high_risk.json --out-root .autopilot-tmp/runs --force
python3 runner/run_resume.py --run <run_id> --out-root .autopilot-tmp/runs --decision approve
```
