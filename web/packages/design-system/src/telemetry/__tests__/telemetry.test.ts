// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initTelemetry, trackComponent, flush, getBuffer, resetTelemetry, getAdoptionReport } from '../index';

describe('Telemetry', () => {
  beforeEach(() => resetTelemetry());

  it('does nothing when disabled', () => {
    trackComponent('Button');
    expect(getBuffer()).toEqual([]);
  });

  it('records events when enabled', () => {
    initTelemetry({ enabled: true });
    trackComponent('Button');
    trackComponent('Input');
    expect(getBuffer().length).toBe(2);
  });

  it('flush calls onFlush with events', () => {
    const onFlush = vi.fn();
    initTelemetry({ enabled: true, onFlush });
    trackComponent('Button');
    trackComponent('Input');
    flush();
    expect(onFlush).toHaveBeenCalledOnce();
    expect(onFlush.mock.calls[0][0].length).toBe(2);
  });

  it('flush clears buffer', () => {
    initTelemetry({ enabled: true });
    trackComponent('Button');
    flush();
    expect(getBuffer()).toEqual([]);
  });

  it('auto-flushes at batchSize', () => {
    const onFlush = vi.fn();
    initTelemetry({ enabled: true, batchSize: 2, onFlush });
    trackComponent('A');
    trackComponent('B'); // triggers flush at batchSize=2
    expect(onFlush).toHaveBeenCalledOnce();
  });

  it('events have correct shape', () => {
    initTelemetry({ enabled: true });
    trackComponent('Button', 'mount');
    const events = getBuffer();
    expect(events[0].component).toBe('Button');
    expect(events[0].action).toBe('mount');
    expect(events[0].timestamp).toBeTypeOf('number');
  });

  it('resetTelemetry clears everything', () => {
    initTelemetry({ enabled: true });
    trackComponent('Button');
    resetTelemetry();
    expect(getBuffer()).toEqual([]);
  });

  it('getAdoptionReport counts by component', () => {
    const events = [
      { component: 'Button', action: 'render' as const, timestamp: 1 },
      { component: 'Button', action: 'render' as const, timestamp: 2 },
      { component: 'Input', action: 'render' as const, timestamp: 3 },
    ];
    const report = getAdoptionReport(events);
    expect(report.Button).toBe(2);
    expect(report.Input).toBe(1);
  });

  it('does not collect PII', () => {
    initTelemetry({ enabled: true });
    trackComponent('Button');
    const events = getBuffer();
    // Events should only have component, action, timestamp — no user data
    const keys = Object.keys(events[0]);
    expect(keys).toEqual(['component', 'action', 'timestamp']);
  });
});
