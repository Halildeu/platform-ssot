import { describe, it, expect } from 'vitest';
import { predictComponents, extractComponents } from '../predictive-engine';
import { PAGE_PATTERNS, COMBINATION_RULES } from '../component-patterns';

/* ================================================================== */
/*  extractComponents                                                  */
/* ================================================================== */

describe('extractComponents', () => {
  it('extracts named imports', () => {
    const code = `import { Button, Card } from '@mfe/design-system';`;
    const result = extractComponents(code);
    expect(result).toContain('Button');
    expect(result).toContain('Card');
  });

  it('extracts JSX component usage', () => {
    const code = `return <MyComponent><ChildWidget /></MyComponent>`;
    const result = extractComponents(code);
    expect(result).toContain('MyComponent');
    expect(result).toContain('ChildWidget');
  });

  it('ignores lowercase HTML elements', () => {
    const code = `return <div><span>hello</span></div>`;
    const result = extractComponents(code);
    expect(result).not.toContain('div');
    expect(result).not.toContain('span');
  });

  it('deduplicates components', () => {
    const code = `import { Button } from '@mfe/design-system';\n<Button /><Button />`;
    const result = extractComponents(code);
    expect(result.filter(c => c === 'Button').length).toBe(1);
  });

  it('handles aliased imports', () => {
    const code = `import { Button as Btn } from '@mfe/design-system';`;
    const result = extractComponents(code);
    expect(result).toContain('Button');
  });

  it('returns empty array for no components', () => {
    const code = `const x = 1; const y = 2;`;
    const result = extractComponents(code);
    expect(result.length).toBe(0);
  });
});

/* ================================================================== */
/*  PAGE_PATTERNS definitions                                          */
/* ================================================================== */

describe('PAGE_PATTERNS', () => {
  it('has 9 patterns defined', () => {
    expect(PAGE_PATTERNS.length).toBe(9);
  });

  it('each pattern has required fields', () => {
    for (const p of PAGE_PATTERNS) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.signals.length).toBeGreaterThan(0);
      expect(p.expectedComponents.length).toBeGreaterThan(0);
    }
  });

  it('each expected component has name, importance, and bundleKB', () => {
    for (const p of PAGE_PATTERNS) {
      for (const c of p.expectedComponents) {
        expect(c.name).toBeTruthy();
        expect(['required', 'recommended', 'optional']).toContain(c.importance);
        expect(c.bundleKB).toBeGreaterThan(0);
      }
    }
  });
});

/* ================================================================== */
/*  COMBINATION_RULES definitions                                      */
/* ================================================================== */

describe('COMBINATION_RULES', () => {
  it('has 10 rules defined', () => {
    expect(COMBINATION_RULES.length).toBe(10);
  });

  it('each rule has valid confidence between 0 and 1', () => {
    for (const r of COMBINATION_RULES) {
      expect(r.confidence).toBeGreaterThan(0);
      expect(r.confidence).toBeLessThanOrEqual(1);
    }
  });

  it('each rule has if, then, and reason', () => {
    for (const r of COMBINATION_RULES) {
      expect(r.if).toBeTruthy();
      expect(r.then).toBeTruthy();
      expect(r.reason).toBeTruthy();
    }
  });
});

/* ================================================================== */
/*  Pattern detection: Dashboard                                       */
/* ================================================================== */

describe('dashboard pattern detection', () => {
  it('detects dashboard pattern from code', () => {
    const code = `
      import { SmartDashboard } from '@mfe/design-system';
      const Dashboard = () => <SmartDashboard><KPICard metric={100} /></SmartDashboard>;
    `;
    const report = predictComponents(code);
    expect(report.detectedPattern).not.toBeNull();
    expect(report.detectedPattern?.id).toBe('dashboard');
  });

  it('suggests missing dashboard components', () => {
    const code = `
      import { SmartDashboard } from '@mfe/design-system';
      const Dashboard = () => <SmartDashboard><BarChart data={data} /></SmartDashboard>;
    `;
    const report = predictComponents(code);
    const names = report.predictions.map(p => p.component);
    expect(names).toContain('DateRangePicker');
  });
});

/* ================================================================== */
/*  Pattern detection: CRUD List                                       */
/* ================================================================== */

describe('CRUD list pattern detection', () => {
  it('detects CRUD list pattern', () => {
    const code = `
      import { AgGridServer } from '@mfe/design-system';
      const columns = [{ field: 'name' }];
      const List = () => <AgGridServer columns={columns} />;
    `;
    const report = predictComponents(code);
    expect(report.detectedPattern?.id).toBe('crud-list');
  });

  it('suggests Pagination for grid', () => {
    const code = `
      import { AgGridServer } from '@mfe/design-system';
      const List = () => <AgGridServer columns={columns} />;
    `;
    const report = predictComponents(code);
    const names = report.predictions.map(p => p.component);
    expect(names).toContain('Pagination');
  });
});

/* ================================================================== */
/*  Pattern detection: Detail                                          */
/* ================================================================== */

describe('detail pattern detection', () => {
  it('detects detail page pattern', () => {
    const code = `
      import { DetailDrawer, Descriptions } from '@mfe/design-system';
      const Detail = () => <DetailDrawer><Descriptions items={items} /></DetailDrawer>;
    `;
    const report = predictComponents(code);
    expect(report.detectedPattern?.id).toBe('detail');
  });
});

/* ================================================================== */
/*  Pattern detection: Form                                            */
/* ================================================================== */

describe('form pattern detection', () => {
  it('detects form page pattern', () => {
    const code = `
      import { ConnectedInput } from '@mfe/design-system';
      const { handleSubmit } = useForm({ resolver: zodResolver(schema) });
    `;
    const report = predictComponents(code);
    expect(report.detectedPattern?.id).toBe('form');
  });

  it('suggests Button for forms', () => {
    const code = `
      import { ConnectedInput } from '@mfe/design-system';
      const { handleSubmit } = useForm();
    `;
    const report = predictComponents(code);
    const names = report.predictions.map(p => p.component);
    expect(names).toContain('Button');
  });
});

/* ================================================================== */
/*  Pattern detection: Settings                                        */
/* ================================================================== */

describe('settings pattern detection', () => {
  it('detects settings page pattern', () => {
    const code = `
      import { Switch, Card } from '@mfe/design-system';
      const Settings = () => <Card><Switch /></Card>;
    `;
    const report = predictComponents(code);
    expect(report.detectedPattern?.id).toBe('settings');
  });
});

/* ================================================================== */
/*  Pattern detection: Auth                                            */
/* ================================================================== */

describe('auth pattern detection', () => {
  it('detects auth page pattern', () => {
    const code = `
      const LoginPage = () => {
        const handleLogin = () => {};
        return <form><input type="password" /><button>Login</button></form>;
      };
    `;
    const report = predictComponents(code);
    expect(report.detectedPattern?.id).toBe('auth');
  });
});

/* ================================================================== */
/*  Pattern detection: Analytics                                       */
/* ================================================================== */

describe('analytics pattern detection', () => {
  it('detects analytics page pattern', () => {
    const code = `
      import { BarChart, LineChart } from '@mfe/design-system';
      const Analytics = () => <div><BarChart /><LineChart /></div>;
    `;
    const report = predictComponents(code);
    expect(report.detectedPattern?.id).toBe('analytics');
  });
});

/* ================================================================== */
/*  Pattern detection: Workflow                                        */
/* ================================================================== */

describe('workflow pattern detection', () => {
  it('detects workflow page pattern', () => {
    const code = `
      import { Steps, Button } from '@mfe/design-system';
      const Workflow = () => <Steps current={step}><Button onClick={approve}>Approve</Button></Steps>;
    `;
    const report = predictComponents(code);
    expect(report.detectedPattern?.id).toBe('workflow');
  });
});

/* ================================================================== */
/*  Pattern detection: Risk                                            */
/* ================================================================== */

describe('risk pattern detection', () => {
  it('detects risk management page pattern', () => {
    const code = `
      import { Badge } from '@mfe/design-system';
      const RiskDashboard = () => <div>
        <h1>Risk & Compliance</h1>
        <Badge severity="high">Critical</Badge>
      </div>;
    `;
    const report = predictComponents(code);
    expect(report.detectedPattern?.id).toBe('risk');
  });
});

/* ================================================================== */
/*  Combination rules                                                  */
/* ================================================================== */

describe('combination rules', () => {
  it('suggests Pagination when AgGridServer is present', () => {
    const code = `import { AgGridServer } from '@mfe/design-system';\n<AgGridServer />`;
    const report = predictComponents(code);
    const paginationPred = report.predictions.find(p => p.component === 'Pagination');
    expect(paginationPred).toBeDefined();
    expect(paginationPred!.confidence).toBeGreaterThan(0);
  });

  it('suggests DataExportDialog when AgGridServer is present', () => {
    const code = `import { AgGridServer } from '@mfe/design-system';\n<AgGridServer />`;
    const report = predictComponents(code);
    const exportPred = report.predictions.find(p => p.component === 'DataExportDialog');
    expect(exportPred).toBeDefined();
  });

  it('does not suggest already-present components', () => {
    const code = `import { AgGridServer, Pagination } from '@mfe/design-system';\n<AgGridServer /><Pagination />`;
    const report = predictComponents(code);
    const paginationPred = report.predictions.find(p => p.component === 'Pagination');
    expect(paginationPred).toBeUndefined();
  });

  it('suggests Button when ConnectedInput is present', () => {
    const code = `import { ConnectedInput } from '@mfe/design-system';\nconst { handleSubmit } = useForm();`;
    const report = predictComponents(code);
    const buttonPred = report.predictions.find(p => p.component === 'Button');
    expect(buttonPred).toBeDefined();
  });
});

/* ================================================================== */
/*  Confidence scoring                                                 */
/* ================================================================== */

describe('confidence scoring', () => {
  it('gives higher confidence to required components', () => {
    const code = `
      import { SmartDashboard } from '@mfe/design-system';
      const Dashboard = () => <SmartDashboard><KPICard metric={100} widget /></SmartDashboard>;
    `;
    const report = predictComponents(code);
    const required = report.predictions.find(p => p.category === 'missing');
    const optional = report.predictions.find(p => p.category === 'optional');
    if (required && optional) {
      expect(required.confidence).toBeGreaterThanOrEqual(optional.confidence);
    }
  });

  it('sorts predictions by weighted score descending', () => {
    const code = `
      import { SmartDashboard } from '@mfe/design-system';
      const Dashboard = () => <SmartDashboard><BarChart /><KPICard metric={100} /></SmartDashboard>;
    `;
    const report = predictComponents(code);
    if (report.predictions.length >= 2) {
      const categoryWeight: Record<string, number> = { missing: 3, recommended: 2, optional: 1 };
      for (let i = 0; i < report.predictions.length - 1; i++) {
        const a = report.predictions[i];
        const b = report.predictions[i + 1];
        const scoreA = a.confidence * categoryWeight[a.category];
        const scoreB = b.confidence * categoryWeight[b.category];
        expect(scoreA).toBeGreaterThanOrEqual(scoreB);
      }
    }
  });
});

/* ================================================================== */
/*  Bundle impact                                                      */
/* ================================================================== */

describe('bundle impact', () => {
  it('calculates total bundle impact', () => {
    const code = `
      import { SmartDashboard } from '@mfe/design-system';
      const Dashboard = () => <SmartDashboard><KPICard metric={100} widget /></SmartDashboard>;
    `;
    const report = predictComponents(code);
    expect(report.totalBundleImpactKB).toBeGreaterThan(0);
    const sumKB = report.predictions.reduce((s, p) => s + p.bundleImpactKB, 0);
    expect(report.totalBundleImpactKB).toBeCloseTo(sumKB, 0);
  });

  it('includes import statement in predictions', () => {
    const code = `
      import { SmartDashboard } from '@mfe/design-system';
      const Dashboard = () => <SmartDashboard><KPICard metric={100} widget /></SmartDashboard>;
    `;
    const report = predictComponents(code);
    for (const pred of report.predictions) {
      expect(pred.importStatement).toContain('@mfe/design-system');
      expect(pred.importStatement).toContain(pred.component);
    }
  });
});

/* ================================================================== */
/*  Edge cases                                                         */
/* ================================================================== */

describe('edge cases', () => {
  it('returns null pattern for unrecognizable code', () => {
    const code = `const x = 1; const y = 2;`;
    const report = predictComponents(code);
    expect(report.detectedPattern).toBeNull();
    expect(report.predictions.length).toBe(0);
  });

  it('returns existing components', () => {
    const code = `import { Button, Card } from '@mfe/design-system';\n<Button /><Card />`;
    const report = predictComponents(code);
    expect(report.existingComponents).toContain('Button');
    expect(report.existingComponents).toContain('Card');
  });

  it('handles empty code', () => {
    const report = predictComponents('');
    expect(report.detectedPattern).toBeNull();
    expect(report.predictions.length).toBe(0);
    expect(report.existingComponents.length).toBe(0);
  });
});
