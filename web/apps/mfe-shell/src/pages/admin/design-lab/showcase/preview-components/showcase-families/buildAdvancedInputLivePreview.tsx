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
  DesignLabTranslate,
  PreviewPanelComponent,
} from '../../showcaseTypes';

type AdvancedInputLivePreviewContext = {
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

export const buildAdvancedInputLivePreview = (
  componentName: string,
  context: AdvancedInputLivePreviewContext,
): React.ReactNode | null => {
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
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <PreviewPanel title={t('designlab.showcase.component.slider.live.controlled.title')}>
              <div className="flex flex-col gap-4">
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
              </div>
            </PreviewPanel>
            <PreviewPanel title={t('designlab.showcase.component.slider.live.stateMatrix.title')}>
              <div className="grid grid-cols-1 gap-3">
                <Slider
                  label={t('designlab.showcase.component.slider.live.stateMatrix.readonlyLabel')}
                  value={72}
                  access="readonly"
                  valueFormatter={(value) => `${value}%`}
                />
                <Slider
                  label={t('designlab.showcase.component.slider.live.stateMatrix.invalidLabel')}
                  defaultValue={36}
                  invalid
                  error={t('designlab.showcase.component.slider.live.stateMatrix.invalidError')}
                />
              </div>
            </PreviewPanel>
          </div>
        </div>
      );
    case 'DatePicker':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <PreviewPanel title={t('designlab.showcase.component.datePicker.live.controlled.title')}>
              <div className="flex flex-col gap-4">
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
              </div>
            </PreviewPanel>
            <PreviewPanel title={t('designlab.showcase.component.datePicker.live.stateMatrix.title')}>
              <div className="grid grid-cols-1 gap-3">
                <DatePicker
                  label={t('designlab.showcase.component.datePicker.live.stateMatrix.readonlyLabel')}
                  value="2026-03-09"
                  access="readonly"
                  messages={datePickerMessages}
                />
                <DatePicker
                  label={t('designlab.showcase.component.datePicker.live.stateMatrix.invalidLabel')}
                  defaultValue="2026-03-01"
                  invalid
                  error={t('designlab.showcase.component.datePicker.live.stateMatrix.invalidError')}
                  messages={datePickerMessages}
                />
              </div>
            </PreviewPanel>
          </div>
        </div>
      );
    case 'TimePicker':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <PreviewPanel title={t('designlab.showcase.component.timePicker.live.controlled.title')}>
              <div className="flex flex-col gap-4">
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
              </div>
            </PreviewPanel>
            <PreviewPanel title={t('designlab.showcase.component.timePicker.live.stateMatrix.title')}>
              <div className="grid grid-cols-1 gap-3">
                <TimePicker
                  label={t('designlab.showcase.component.timePicker.live.stateMatrix.readonlyLabel')}
                  value="18:45"
                  access="readonly"
                  messages={timePickerMessages}
                />
                <TimePicker
                  label={t('designlab.showcase.component.timePicker.live.stateMatrix.invalidLabel')}
                  defaultValue="23:30"
                  invalid
                  error={t('designlab.showcase.component.timePicker.live.stateMatrix.invalidError')}
                  messages={timePickerMessages}
                />
              </div>
            </PreviewPanel>
          </div>
        </div>
      );
    case 'Upload':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <PreviewPanel title="Controlled file list">
              <div className="flex flex-col gap-4">
                <Upload
                  label="Kanit paketi"
                  description="Release ve approval kanitlarini ayni yerden topla."
                  hint="PDF, XLSX ve ZIP desteklenir."
                  accept=".pdf,.xlsx,.zip"
                  multiple
                  maxFiles={4}
                  files={uploadFiles}
                  onFilesChange={setUploadFiles}
                />
              </div>
            </PreviewPanel>
            <PreviewPanel title="Current payload">
              <LibraryMetricCard
                label="Selected files"
                value={`${uploadFiles.length}`}
                note={uploadFiles.map((file) => file.name).join(', ')}
              />
            </PreviewPanel>
          </div>
        </div>
      );
    default:
      return null;
  }
};
