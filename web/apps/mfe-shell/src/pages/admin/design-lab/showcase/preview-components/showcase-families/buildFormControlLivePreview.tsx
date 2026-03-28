import React from 'react';
import {
  Checkbox,
  Radio,
  Switch,
  Text,
  TextArea,
} from '@mfe/design-system';
import type {
  DesignLabTranslate,
  PreviewPanelComponent,
} from '../../showcaseTypes';

type FormControlLivePreviewContext = {
  PreviewPanel: PreviewPanelComponent;
  checkboxValue: boolean;
  radioValue: string;
  setCheckboxValue: (nextValue: boolean) => void;
  setRadioValue: (nextValue: string) => void;
  setSwitchValue: (nextValue: boolean) => void;
  setTextAreaValue: (nextValue: string) => void;
  switchValue: boolean;
  t: DesignLabTranslate;
  textAreaValue: string;
};

export const buildFormControlLivePreview = (
  componentName: string,
  context: FormControlLivePreviewContext,
): React.ReactNode | null => {
  const {
    PreviewPanel,
    checkboxValue,
    radioValue,
    setCheckboxValue,
    setRadioValue,
    setSwitchValue,
    setTextAreaValue,
    switchValue,
    t,
    textAreaValue,
  } = context;

  switch (componentName) {
    case 'TextArea':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <PreviewPanel title={t('designlab.showcase.component.textArea.live.authoring.title')}>
              <div className="flex flex-col gap-4">
                <TextArea
                  label={t('designlab.showcase.component.textArea.live.authoring.label')}
                  description={t('designlab.showcase.component.textArea.live.authoring.description')}
                  hint={t('designlab.showcase.component.textArea.live.authoring.hint')}
                  value={textAreaValue}
                  rows={3}
                  maxLength={180}
                  showCount
                  resize="auto"
                  onValueChange={setTextAreaValue}
                />
              </div>
            </PreviewPanel>
            <PreviewPanel title={t('designlab.showcase.component.textArea.live.stateMatrix.title')}>
              <div className="grid grid-cols-1 gap-3">
                <TextArea
                  label={t('designlab.showcase.component.textArea.live.stateMatrix.invalidLabel')}
                  defaultValue={t('designlab.showcase.component.textArea.live.stateMatrix.invalidValue')}
                  invalid
                  error={t('designlab.showcase.component.textArea.live.stateMatrix.invalidError')}
                  rows={3}
                />
                <TextArea
                  label={t('designlab.showcase.component.textArea.live.stateMatrix.readonlyLabel')}
                  defaultValue={t('designlab.showcase.component.textArea.live.stateMatrix.readonlyValue')}
                  access="readonly"
                  rows={3}
                />
                <TextArea
                  label={t('designlab.showcase.component.textArea.live.stateMatrix.disabledLabel')}
                  defaultValue={t('designlab.showcase.component.textArea.live.stateMatrix.disabledValue')}
                  access="disabled"
                  rows={3}
                />
              </div>
            </PreviewPanel>
          </div>
        </div>
      );
    case 'Checkbox':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <PreviewPanel title={t('designlab.showcase.component.checkbox.live.controlled.title')}>
              <div className="flex flex-col gap-4">
                <Checkbox
                  label={t('designlab.showcase.component.checkbox.live.controlled.label')}
                  description={t('designlab.showcase.component.checkbox.live.controlled.description')}
                  hint={t('designlab.showcase.component.checkbox.live.controlled.hint')}
                  checked={checkboxValue}
                  onCheckedChange={setCheckboxValue}
                />
                <Text variant="secondary" className="block">
                  {t('designlab.showcase.component.checkbox.live.controlled.activeValue', {
                    state: checkboxValue
                      ? t('designlab.showcase.component.checkbox.live.controlled.stateOn')
                      : t('designlab.showcase.component.checkbox.live.controlled.stateOff'),
                  })}
                </Text>
              </div>
            </PreviewPanel>
            <PreviewPanel title={t('designlab.showcase.component.checkbox.live.stateMatrix.title')}>
              <div className="grid grid-cols-1 gap-3">
                <Checkbox
                  label={t('designlab.showcase.component.checkbox.live.stateMatrix.invalidLabel')}
                  error
                />
                <Checkbox
                  label={t('designlab.showcase.component.checkbox.live.stateMatrix.indeterminateLabel')}
                  indeterminate
                  hint={t('designlab.showcase.component.checkbox.live.stateMatrix.indeterminateHint')}
                />
                <Checkbox label={t('designlab.showcase.component.checkbox.live.stateMatrix.readonlyLabel')} defaultChecked access="readonly" />
                <Checkbox label={t('designlab.showcase.component.checkbox.live.stateMatrix.disabledLabel')} access="disabled" />
              </div>
            </PreviewPanel>
          </div>
        </div>
      );
    case 'Radio':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <PreviewPanel title={t('designlab.showcase.component.radio.live.controlled.title')}>
              <div className="flex flex-col gap-3">
                <Radio
                  name="wave-3-radio-demo"
                  value="design"
                  label={t('designlab.showcase.component.radio.live.controlled.design.label')}
                  description={t('designlab.showcase.component.radio.live.controlled.design.description')}
                  checked={radioValue === 'design'}
                  onChange={() => setRadioValue('design')}
                />
                <Radio
                  name="wave-3-radio-demo"
                  value="ops"
                  label={t('designlab.showcase.component.radio.live.controlled.ops.label')}
                  description={t('designlab.showcase.component.radio.live.controlled.ops.description')}
                  checked={radioValue === 'ops'}
                  onChange={() => setRadioValue('ops')}
                />
                <Radio
                  name="wave-3-radio-demo"
                  value="delivery"
                  label={t('designlab.showcase.component.radio.live.controlled.delivery.label')}
                  description={t('designlab.showcase.component.radio.live.controlled.delivery.description')}
                  checked={radioValue === 'delivery'}
                  onChange={() => setRadioValue('delivery')}
                />
              </div>
            </PreviewPanel>
            <PreviewPanel title={t('designlab.showcase.component.radio.live.stateMatrix.title')}>
              <div className="grid grid-cols-1 gap-3">
                <Radio
                  name="wave-3-radio-state"
                  value="default"
                  label={t('designlab.showcase.component.radio.live.stateMatrix.defaultLabel')}
                  defaultChecked
                />
                <Radio
                  name="wave-3-radio-state"
                  value="invalid"
                  label={t('designlab.showcase.component.radio.live.stateMatrix.invalidLabel')}
                  error
                />
                <Radio
                  name="wave-3-radio-state"
                  value="readonly"
                  label={t('designlab.showcase.component.radio.live.stateMatrix.readonlyLabel')}
                  readOnly
                />
                <Radio
                  name="wave-3-radio-state"
                  value="disabled"
                  label={t('designlab.showcase.component.radio.live.stateMatrix.disabledLabel')}
                  disabled
                />
              </div>
            </PreviewPanel>
          </div>
        </div>
      );
    case 'Switch':
      return (
        <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <PreviewPanel title={t('designlab.showcase.component.switch.live.controlled.title')}>
              <div className="flex flex-col gap-4">
                <Switch
                  label={t('designlab.showcase.component.switch.live.controlled.label')}
                  description={t('designlab.showcase.component.switch.live.controlled.description')}
                  checked={switchValue}
                  onCheckedChange={setSwitchValue}
                />
                <Text variant="secondary" className="block">
                  {t('designlab.showcase.component.switch.live.controlled.activeStatus', {
                    state: switchValue
                      ? t('designlab.showcase.component.switch.live.controlled.stateOn')
                      : t('designlab.showcase.component.switch.live.controlled.stateOff'),
                  })}
                </Text>
              </div>
            </PreviewPanel>
            <PreviewPanel title={t('designlab.showcase.component.switch.live.stateMatrix.title')}>
              <div className="grid grid-cols-1 gap-3">
                <Switch label={t('designlab.showcase.component.switch.live.stateMatrix.readonlyLabel')} defaultChecked readOnly />
                <Switch label={t('designlab.showcase.component.switch.live.stateMatrix.disabledLabel')} disabled />
                <Switch
                  label={t('designlab.showcase.component.switch.live.stateMatrix.invalidLabel')}
                />
              </div>
            </PreviewPanel>
          </div>
        </div>
      );
    default:
      return null;
  }
};
