import React from 'react';
import {
  DatePicker,
  Slider,
  TimePicker,
  Upload,
} from '@mfe/design-system';
import {
  LibraryMetricCard,
} from '../../../../../../../../../packages/design-system/src/catalog/design-lab-internals';
import type {
  ComponentShowcaseSection,
  DesignLabTranslate,
  PreviewPanelComponent,
} from '../../showcaseTypes';

type AdvancedInputShowcaseContext = {
  PreviewPanel: PreviewPanelComponent;
  datePickerMessages: React.ComponentProps<typeof DatePicker>['messages'];
  dateValue: string;
  setDateValue: (nextValue: string) => void;
  setSliderValue: (nextValue: number) => void;
  setTimeValue: (nextValue: string) => void;
  setUploadFiles: (nextValue: NonNullable<React.ComponentProps<typeof Upload>['files']>) => void;
  sliderValue: number;
  t: DesignLabTranslate;
  timePickerMessages: React.ComponentProps<typeof TimePicker>['messages'];
  timeValue: string;
  uploadFiles: NonNullable<React.ComponentProps<typeof Upload>['files']>;
};

export const buildAdvancedInputShowcaseSections = (
  componentName: string,
  context: AdvancedInputShowcaseContext,
): ComponentShowcaseSection[] | null => {
  const {
    PreviewPanel,
    datePickerMessages,
    dateValue,
    setDateValue,
    setSliderValue,
    setTimeValue,
    setUploadFiles,
    sliderValue,
    t,
    timePickerMessages,
    timeValue,
    uploadFiles,
  } = context;

  switch (componentName) {
    case 'Slider':
      return [
        {
          id: 'slider-density',
          eyebrow: t('designlab.showcase.component.slider.sections.density.eyebrow'),
          title: t('designlab.showcase.component.slider.sections.density.title'),
          description: t('designlab.showcase.component.slider.sections.density.description'),
          badges: [
            t('designlab.showcase.component.slider.sections.density.badge.range'),
            t('designlab.showcase.component.slider.sections.density.badge.controlled'),
            t('designlab.showcase.component.slider.sections.density.badge.density'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.slider.sections.density.panelControlled')}>
                <Slider
                  label={t('designlab.showcase.component.slider.live.controlled.label')}
                  description={t('designlab.showcase.component.slider.live.controlled.description')}
                  hint={t('designlab.showcase.component.slider.live.controlled.hint')}
                  min={20}
                  max={100}
                  step={4}
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  minLabel={t('designlab.showcase.component.slider.live.controlled.minLabel')}
                  maxLabel={t('designlab.showcase.component.slider.live.controlled.maxLabel')}
                  valueFormatter={(value) => `${value}%`}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.slider.sections.density.panelCurrentValue')}>
                <LibraryMetricCard
                  label={t('designlab.showcase.component.slider.sections.density.currentValue.label')}
                  value={`${sliderValue}%`}
                  note={t('designlab.showcase.component.slider.sections.density.currentValue.note')}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'slider-states',
          eyebrow: t('designlab.showcase.component.slider.sections.states.eyebrow'),
          title: t('designlab.showcase.component.slider.sections.states.title'),
          description: t('designlab.showcase.component.slider.sections.states.description'),
          badges: [
            t('designlab.showcase.component.slider.sections.states.badge.readonly'),
            t('designlab.showcase.component.slider.sections.states.badge.invalid'),
            t('designlab.showcase.component.slider.sections.states.badge.policy'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.slider.sections.states.panelReadonly')}>
                <Slider
                  label={t('designlab.showcase.component.slider.live.stateMatrix.readonlyLabel')}
                  value={72}
                  access="readonly"
                  valueFormatter={(value) => `${value}%`}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.slider.sections.states.panelPolicyBlocked')}>
                <Slider
                  label={t('designlab.showcase.component.slider.live.stateMatrix.invalidLabel')}
                  defaultValue={36}
                  invalid
                  error={t('designlab.showcase.component.slider.live.stateMatrix.invalidError')}
                />
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'DatePicker':
      return [
        {
          id: 'datepicker-milestone',
          eyebrow: t('designlab.showcase.component.datePicker.sections.milestone.eyebrow'),
          title: t('designlab.showcase.component.datePicker.sections.milestone.title'),
          description: t('designlab.showcase.component.datePicker.sections.milestone.description'),
          badges: [
            t('designlab.showcase.component.datePicker.sections.milestone.badge.calendar'),
            t('designlab.showcase.component.datePicker.sections.milestone.badge.milestone'),
            t('designlab.showcase.component.datePicker.sections.milestone.badge.controlled'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.datePicker.sections.milestone.panelControlled')}>
                <DatePicker
                  label={t('designlab.showcase.component.datePicker.live.controlled.label')}
                  description={t('designlab.showcase.component.datePicker.live.controlled.description')}
                  hint={t('designlab.showcase.component.datePicker.live.controlled.hint')}
                  value={dateValue}
                  min="2026-03-08"
                  max="2026-04-30"
                  onValueChange={setDateValue}
                  messages={datePickerMessages}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.datePicker.sections.milestone.panelSelected')}>
                <LibraryMetricCard
                  label={t('designlab.showcase.component.datePicker.sections.milestone.selected.label')}
                  value={dateValue}
                  note={t('designlab.showcase.component.datePicker.sections.milestone.selected.note')}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'datepicker-states',
          eyebrow: t('designlab.showcase.component.datePicker.sections.states.eyebrow'),
          title: t('designlab.showcase.component.datePicker.sections.states.title'),
          description: t('designlab.showcase.component.datePicker.sections.states.description'),
          badges: [
            t('designlab.showcase.component.datePicker.sections.states.badge.readonly'),
            t('designlab.showcase.component.datePicker.sections.states.badge.invalid'),
            t('designlab.showcase.component.datePicker.sections.states.badge.dateEntry'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.datePicker.sections.states.panelReadonly')}>
                <DatePicker
                  label={t('designlab.showcase.component.datePicker.live.stateMatrix.readonlyLabel')}
                  value="2026-03-09"
                  access="readonly"
                  messages={datePickerMessages}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.datePicker.sections.states.panelInvalid')}>
                <DatePicker
                  label={t('designlab.showcase.component.datePicker.live.stateMatrix.invalidLabel')}
                  defaultValue="2026-03-01"
                  invalid
                  error={t('designlab.showcase.component.datePicker.live.stateMatrix.invalidError')}
                  messages={datePickerMessages}
                />
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'TimePicker':
      return [
        {
          id: 'timepicker-cutover-window',
          eyebrow: t('designlab.showcase.component.timePicker.sections.window.eyebrow'),
          title: t('designlab.showcase.component.timePicker.sections.window.title'),
          description: t('designlab.showcase.component.timePicker.sections.window.description'),
          badges: [
            t('designlab.showcase.component.timePicker.sections.window.badge.timeEntry'),
            t('designlab.showcase.component.timePicker.sections.window.badge.controlled'),
            t('designlab.showcase.component.timePicker.sections.window.badge.releaseWindow'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.timePicker.sections.window.panelControlled')}>
                <TimePicker
                  label={t('designlab.showcase.component.timePicker.live.controlled.label')}
                  description={t('designlab.showcase.component.timePicker.live.controlled.description')}
                  hint={t('designlab.showcase.component.timePicker.live.controlled.hint')}
                  value={timeValue}
                  min="09:00"
                  max="22:00"
                  step={900}
                  onValueChange={setTimeValue}
                  messages={timePickerMessages}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.timePicker.sections.window.panelSelected')}>
                <LibraryMetricCard
                  label={t('designlab.showcase.component.timePicker.sections.window.selected.label')}
                  value={timeValue}
                  note={t('designlab.showcase.component.timePicker.sections.window.selected.note')}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'timepicker-state-matrix',
          eyebrow: t('designlab.showcase.component.timePicker.sections.states.eyebrow'),
          title: t('designlab.showcase.component.timePicker.sections.states.title'),
          description: t('designlab.showcase.component.timePicker.sections.states.description'),
          badges: [
            t('designlab.showcase.component.timePicker.sections.states.badge.readonly'),
            t('designlab.showcase.component.timePicker.sections.states.badge.invalid'),
            t('designlab.showcase.component.timePicker.sections.states.badge.governedInput'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.timePicker.sections.states.panelReadonly')}>
                <TimePicker
                  label={t('designlab.showcase.component.timePicker.live.stateMatrix.readonlyLabel')}
                  value="18:45"
                  access="readonly"
                  messages={timePickerMessages}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.timePicker.sections.states.panelInvalid')}>
                <TimePicker
                  label={t('designlab.showcase.component.timePicker.live.stateMatrix.invalidLabel')}
                  defaultValue="23:30"
                  invalid
                  error={t('designlab.showcase.component.timePicker.live.stateMatrix.invalidError')}
                  messages={timePickerMessages}
                />
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'Upload':
      return [
        {
          id: 'upload-evidence-pack',
          eyebrow: t('designlab.showcase.component.upload.sections.evidence.eyebrow'),
          title: t('designlab.showcase.component.upload.sections.evidence.title'),
          description: t('designlab.showcase.component.upload.sections.evidence.description'),
          badges: [
            t('designlab.showcase.component.upload.sections.evidence.badge.files'),
            t('designlab.showcase.component.upload.sections.evidence.badge.multiple'),
            t('designlab.showcase.component.upload.sections.evidence.badge.evidence'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.upload.sections.evidence.panelControlled')}>
                <Upload
                  label={t('designlab.showcase.component.upload.sections.evidence.controlled.label')}
                  description={t('designlab.showcase.component.upload.sections.evidence.controlled.description')}
                  hint={t('designlab.showcase.component.upload.sections.evidence.controlled.hint')}
                  accept=".pdf,.xlsx,.zip"
                  multiple
                  maxFiles={4}
                  files={uploadFiles}
                  onFilesChange={setUploadFiles}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.upload.sections.evidence.panelSummary')}>
                <LibraryMetricCard
                  label={t('designlab.showcase.component.upload.sections.evidence.summary.label')}
                  value={`${uploadFiles.length}`}
                  note={uploadFiles.map((file) => file.name).join(', ')}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'upload-governed-states',
          eyebrow: t('designlab.showcase.component.upload.sections.states.eyebrow'),
          title: t('designlab.showcase.component.upload.sections.states.title'),
          description: t('designlab.showcase.component.upload.sections.states.description'),
          badges: [
            t('designlab.showcase.component.upload.sections.states.badge.readonly'),
            t('designlab.showcase.component.upload.sections.states.badge.disabled'),
            t('designlab.showcase.component.upload.sections.states.badge.invalid'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title={t('designlab.showcase.component.upload.sections.states.panelReadonly')}>
                <Upload label={t('designlab.showcase.component.upload.sections.states.readonlyLabel')} files={uploadFiles} access="readonly" />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.upload.sections.states.panelDisabled')}>
                <Upload label={t('designlab.showcase.component.upload.sections.states.disabledLabel')} access="disabled" />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.upload.sections.states.panelInvalid')}>
                <Upload
                  label={t('designlab.showcase.component.upload.sections.states.invalidLabel')}
                  invalid
                  error={t('designlab.showcase.component.upload.sections.states.invalidError')}
                />
              </PreviewPanel>
            </div>
          ),
        },
      ];
    default:
      return null;
  }
};
