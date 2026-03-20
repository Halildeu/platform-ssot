import React from 'react';
import {
  Checkbox,
  Radio,
  Switch,
  Text,
  TextArea,
} from '@mfe/design-system';
import {
  LibraryMetricCard,
} from '../../../../../../../../../packages/design-system/src/catalog/design-lab-internals';
import type {
  ComponentShowcaseSection,
  DesignLabTranslate,
  PreviewPanelComponent,
} from '../../showcaseTypes';

type FormControlShowcaseContext = {
  commentValue: string;
  PreviewPanel: PreviewPanelComponent;
  checkboxValue: boolean;
  radioValue: string;
  setCommentValue: (nextValue: string) => void;
  setCheckboxValue: (nextValue: boolean) => void;
  setRadioValue: (nextValue: string) => void;
  setSwitchValue: (nextValue: boolean) => void;
  setTextAreaValue: (nextValue: string) => void;
  switchValue: boolean;
  t: DesignLabTranslate;
  textAreaValue: string;
};

export const buildFormControlShowcaseSections = (
  componentName: string,
  context: FormControlShowcaseContext,
): ComponentShowcaseSection[] | null => {
  const {
    commentValue,
    PreviewPanel,
    checkboxValue,
    radioValue,
    setCommentValue,
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
      return [
        {
          id: 'text-area-authoring',
          eyebrow: t('designlab.showcase.component.textArea.sections.authoring.eyebrow'),
          title: t('designlab.showcase.component.textArea.sections.authoring.title'),
          description: t('designlab.showcase.component.textArea.sections.authoring.description'),
          badges: [
            t('designlab.showcase.component.textArea.sections.authoring.badge.authoring'),
            t('designlab.showcase.component.textArea.sections.authoring.badge.autoResize'),
            t('designlab.showcase.component.textArea.sections.authoring.badge.liveCount'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <PreviewPanel title={t('designlab.showcase.component.textArea.sections.authoring.panelComposer')}>
                <TextArea
                  label={t('designlab.showcase.component.textArea.live.authoring.label')}
                  description={t('designlab.showcase.component.textArea.live.authoring.description')}
                  hint={t('designlab.showcase.component.textArea.live.authoring.hint')}
                  value={commentValue}
                  rows={4}
                  maxLength={180}
                  showCount
                  resize="auto"
                  onValueChange={setCommentValue}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.textArea.sections.authoring.panelState')}>
                <LibraryMetricCard
                  label={t('designlab.showcase.component.textArea.sections.authoring.counter.label')}
                  value={`${commentValue.length}`}
                  note={t('designlab.showcase.component.textArea.sections.authoring.counter.note')}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'text-area-validation',
          eyebrow: t('designlab.showcase.component.textArea.sections.validation.eyebrow'),
          title: t('designlab.showcase.component.textArea.sections.validation.title'),
          description: t('designlab.showcase.component.textArea.sections.validation.description'),
          badges: [
            t('designlab.showcase.component.textArea.sections.validation.badge.invalid'),
            t('designlab.showcase.component.textArea.sections.validation.badge.readonly'),
            t('designlab.showcase.component.textArea.sections.validation.badge.disabled'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title={t('designlab.showcase.component.textArea.sections.validation.panelInvalid')}>
                <TextArea
                  label={t('designlab.showcase.component.textArea.live.stateMatrix.invalidLabel')}
                  defaultValue={t('designlab.showcase.component.textArea.live.stateMatrix.invalidValue')}
                  invalid
                  error={t('designlab.showcase.component.textArea.live.stateMatrix.invalidError')}
                  rows={3}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.textArea.sections.validation.panelReadonly')}>
                <TextArea
                  label={t('designlab.showcase.component.textArea.live.stateMatrix.readonlyLabel')}
                  defaultValue={t('designlab.showcase.component.textArea.live.stateMatrix.readonlyValue')}
                  access="readonly"
                  rows={3}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.textArea.sections.validation.panelDisabled')}>
                <TextArea
                  label={t('designlab.showcase.component.textArea.live.stateMatrix.disabledLabel')}
                  defaultValue={t('designlab.showcase.component.textArea.live.stateMatrix.disabledValue')}
                  access="disabled"
                  rows={3}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'text-area-layout',
          eyebrow: t('designlab.showcase.component.textArea.sections.layout.eyebrow'),
          title: t('designlab.showcase.component.textArea.sections.layout.title'),
          description: t('designlab.showcase.component.textArea.sections.layout.description'),
          badges: [
            t('designlab.showcase.component.textArea.sections.layout.badge.layout'),
            t('designlab.showcase.component.textArea.sections.layout.badge.panel'),
            t('designlab.showcase.component.textArea.sections.layout.badge.responsive'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.8fr_1.2fr]">
              <PreviewPanel title={t('designlab.showcase.component.textArea.sections.layout.panelSide')}>
                <TextArea
                  label={t('designlab.showcase.component.textArea.sections.layout.sideLabel')}
                  defaultValue={t('designlab.showcase.component.textArea.sections.layout.sideValue')}
                  rows={3}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.textArea.sections.layout.panelPrimary')}>
                <TextArea
                  label={t('designlab.showcase.component.textArea.sections.layout.primaryLabel')}
                  defaultValue={t('designlab.showcase.component.textArea.sections.layout.primaryValue')}
                  rows={6}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'text-area-recipes',
          eyebrow: t('designlab.showcase.component.textArea.sections.recipes.eyebrow'),
          title: t('designlab.showcase.component.textArea.sections.recipes.title'),
          description: t('designlab.showcase.component.textArea.sections.recipes.description'),
          badges: [
            t('designlab.showcase.component.textArea.sections.recipes.badge.recipes'),
            t('designlab.showcase.component.textArea.sections.recipes.badge.selectionGuide'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <LibraryMetricCard
                label={t('designlab.showcase.component.textArea.sections.recipes.comment.label')}
                value={t('designlab.showcase.component.textArea.sections.recipes.comment.value')}
                note={t('designlab.showcase.component.textArea.sections.recipes.comment.note')}
              />
              <LibraryMetricCard
                label={t('designlab.showcase.component.textArea.sections.recipes.audit.label')}
                value={t('designlab.showcase.component.textArea.sections.recipes.audit.value')}
                note={t('designlab.showcase.component.textArea.sections.recipes.audit.note')}
              />
              <LibraryMetricCard
                label={t('designlab.showcase.component.textArea.sections.recipes.policy.label')}
                value={t('designlab.showcase.component.textArea.sections.recipes.policy.value')}
                note={t('designlab.showcase.component.textArea.sections.recipes.policy.note')}
              />
            </div>
          ),
        },
        {
          id: 'text-area-review-compare',
          eyebrow: 'Review & authoring',
          title: 'Karsilastirmali not alani',
          description: 'Canli yorum, readonly ozet ve invalid policy notunu ayni grid icinde gostererek daha urunlesmis text area alternatifleri sunar.',
          badges: ['review', 'readonly', 'invalid'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title="Canli not">
                <TextArea
                  label="Reviewer notu"
                  value={textAreaValue}
                  onValueChange={setTextAreaValue}
                  rows={4}
                  resize="auto"
                  showCount
                  maxLength={220}
                  hint="Yayin oncesi karar gerekcelerini bu alanda topla."
                />
              </PreviewPanel>
              <PreviewPanel title="Readonly ozet">
                <TextArea
                  label="Sistem ozeti"
                  defaultValue="Bu bilesen icin release, policy ve usage evidence yuzeyleri tamamlandi."
                  rows={4}
                  access="readonly"
                  resize="none"
                />
              </PreviewPanel>
              <PreviewPanel title="Policy uyarisi">
                <TextArea
                  label="Eksik metadata"
                  defaultValue="SEO/GEO metadata alanlari eksik."
                  rows={4}
                  invalid
                  error="Public surface acilmadan once title, description ve canonical URL tamamlanmali."
                />
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'Checkbox':
      return [
        {
          id: 'checkbox-single',
          eyebrow: t('designlab.showcase.component.checkbox.sections.single.eyebrow'),
          title: t('designlab.showcase.component.checkbox.sections.single.title'),
          description: t('designlab.showcase.component.checkbox.sections.single.description'),
          badges: [
            t('designlab.showcase.component.checkbox.sections.single.badge.consent'),
            t('designlab.showcase.component.checkbox.sections.single.badge.singleChoice'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.checkbox.sections.single.panelControlled')}>
                <Checkbox
                  label={t('designlab.showcase.component.checkbox.live.controlled.label')}
                  description={t('designlab.showcase.component.checkbox.live.controlled.description')}
                  hint={t('designlab.showcase.component.checkbox.live.controlled.hint')}
                  checked={checkboxValue}
                  onCheckedChange={setCheckboxValue}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.checkbox.sections.single.panelRule')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.checkbox.sections.single.rule')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'checkbox-states',
          eyebrow: t('designlab.showcase.component.checkbox.sections.states.eyebrow'),
          title: t('designlab.showcase.component.checkbox.sections.states.title'),
          description: t('designlab.showcase.component.checkbox.sections.states.description'),
          badges: [
            t('designlab.showcase.component.checkbox.sections.states.badge.invalid'),
            t('designlab.showcase.component.checkbox.sections.states.badge.indeterminate'),
            t('designlab.showcase.component.checkbox.sections.states.badge.access'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
              <PreviewPanel title={t('designlab.showcase.component.checkbox.sections.states.panelInvalid')}>
                <Checkbox
                  label={t('designlab.showcase.component.checkbox.live.stateMatrix.invalidLabel')}
                  invalid
                  error
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.checkbox.sections.states.panelIndeterminate')}>
                <Checkbox
                  label={t('designlab.showcase.component.checkbox.live.stateMatrix.indeterminateLabel')}
                  indeterminate
                  hint={t('designlab.showcase.component.checkbox.live.stateMatrix.indeterminateHint')}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.checkbox.sections.states.panelReadonly')}>
                <Checkbox label={t('designlab.showcase.component.checkbox.live.stateMatrix.readonlyLabel')} defaultChecked access="readonly" />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.checkbox.sections.states.panelDisabled')}>
                <Checkbox label={t('designlab.showcase.component.checkbox.live.stateMatrix.disabledLabel')} access="disabled" />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'checkbox-bulk-review',
          eyebrow: 'Bulk selection',
          title: 'Toplu review listesi',
          description: 'Bulk secim, policy kabul ve release checklist kalibini tek bir kartta gosterir.',
          badges: ['bulk', 'review', 'checklist'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title="Checklist">
                <div className="space-y-3">
                  <Checkbox
                    label="SEO metadata tamam"
                    description="Title, description ve canonical URL kaniti hazir."
                    checked={checkboxValue}
                    onCheckedChange={setCheckboxValue}
                  />
                  <Checkbox
                    label="GEO summary eklendi"
                    description="Sayfa ustunde alintilanabilir ozet ve ana cikarimlar var."
                    defaultChecked
                  />
                  <Checkbox
                    label="Consumer smoke gecti"
                    description="Adoption sonrasi hedefli smoke ve visual check tamamladi."
                    indeterminate
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Not">
                <Text variant="secondary" className="block leading-7">
                  Checkbox listeleri toplu review akislari icin iyi calisir; ama secim agirligini artirdikca aciklama uzunluklarini kontrollu tutmak gerekir.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'Radio':
      return [
        {
          id: 'radio-choice',
          eyebrow: t('designlab.showcase.component.radio.sections.choice.eyebrow'),
          title: t('designlab.showcase.component.radio.sections.choice.title'),
          description: t('designlab.showcase.component.radio.sections.choice.description'),
          badges: [
            t('designlab.showcase.component.radio.sections.choice.badge.singleChoice'),
            t('designlab.showcase.component.radio.sections.choice.badge.decision'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.radio.sections.choice.panelControlled')}>
                <div className="space-y-3">
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
              <PreviewPanel title={t('designlab.showcase.component.radio.sections.choice.panelSelected')}>
                <LibraryMetricCard
                  label={t('designlab.showcase.component.radio.sections.choice.selected.label')}
                  value={radioValue}
                  note={t('designlab.showcase.component.radio.sections.choice.selected.note')}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'radio-states',
          eyebrow: t('designlab.showcase.component.radio.sections.states.eyebrow'),
          title: t('designlab.showcase.component.radio.sections.states.title'),
          description: t('designlab.showcase.component.radio.sections.states.description'),
          badges: [
            t('designlab.showcase.component.radio.sections.states.badge.invalid'),
            t('designlab.showcase.component.radio.sections.states.badge.readonly'),
            t('designlab.showcase.component.radio.sections.states.badge.disabled'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
              <PreviewPanel title={t('designlab.showcase.component.radio.sections.states.panelDefault')}>
                <Radio
                  name="wave-3-radio-state"
                  value="default"
                  label={t('designlab.showcase.component.radio.live.stateMatrix.defaultLabel')}
                  defaultChecked
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.radio.sections.states.panelInvalid')}>
                <Radio
                  name="wave-3-radio-state"
                  value="invalid"
                  label={t('designlab.showcase.component.radio.live.stateMatrix.invalidLabel')}
                  error
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.radio.sections.states.panelReadonly')}>
                <Radio
                  name="wave-3-radio-state"
                  value="readonly"
                  label={t('designlab.showcase.component.radio.live.stateMatrix.readonlyLabel')}
                  readOnly
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.radio.sections.states.panelDisabled')}>
                <Radio
                  name="wave-3-radio-state"
                  value="disabled"
                  label={t('designlab.showcase.component.radio.live.stateMatrix.disabledLabel')}
                  disabled
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'radio-governance-lanes',
          eyebrow: 'Governed decisions',
          title: 'Lane secim matrisi',
          description: 'Tek secimli governance kararlarinda radio ailesinin daha urunlesmis kullanimini gosterir.',
          badges: ['lane', 'decision', 'governance'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <PreviewPanel title="Lane secimi">
                <div className="space-y-3">
                  <Radio
                    name="lane-choice"
                    value="standard"
                    label="Standard lane"
                    description="Genel component rollout ve docs update akislari."
                    checked={radioValue === 'standard'}
                    onChange={() => setRadioValue('standard')}
                  />
                  <Radio
                    name="lane-choice"
                    value="regulated"
                    label="Regulated lane"
                    description="Compliance, audit ve kritik release yuzeyleri."
                    checked={radioValue === 'regulated'}
                    onChange={() => setRadioValue('regulated')}
                  />
                  <Radio
                    name="lane-choice"
                    value="experimental"
                    label="Experimental lane"
                    description="Design Lab ve internal alpha varyantlar."
                    checked={radioValue === 'experimental'}
                    onChange={() => setRadioValue('experimental')}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Kural">
                <Text variant="secondary" className="block leading-7">
                  Radio secimleri, segmented yuzeylere gore daha uzun aciklama tasimaya izin verdigi icin tek kararli governance akislari icin daha uygundur.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'Switch':
      return [
        {
          id: 'switch-live-toggle',
          eyebrow: t('designlab.showcase.component.switch.sections.toggle.eyebrow'),
          title: t('designlab.showcase.component.switch.sections.toggle.title'),
          description: t('designlab.showcase.component.switch.sections.toggle.description'),
          badges: [
            t('designlab.showcase.component.switch.sections.toggle.badge.toggle'),
            t('designlab.showcase.component.switch.sections.toggle.badge.controlled'),
            t('designlab.showcase.component.switch.sections.toggle.badge.release'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.switch.sections.toggle.panelControlled')}>
                <Switch
                  label={t('designlab.showcase.component.switch.live.controlled.label')}
                  description={t('designlab.showcase.component.switch.live.controlled.description')}
                  checked={switchValue}
                  onCheckedChange={setSwitchValue}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.switch.sections.toggle.panelStatus')}>
                <LibraryMetricCard
                  label={t('designlab.showcase.component.switch.sections.toggle.status.label')}
                  value={switchValue ? t('designlab.showcase.component.switch.live.controlled.stateOn') : t('designlab.showcase.component.switch.live.controlled.stateOff')}
                  note={t('designlab.showcase.component.switch.sections.toggle.status.note')}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'switch-states',
          eyebrow: t('designlab.showcase.component.switch.sections.states.eyebrow'),
          title: t('designlab.showcase.component.switch.sections.states.title'),
          description: t('designlab.showcase.component.switch.sections.states.description'),
          badges: [
            t('designlab.showcase.component.switch.sections.states.badge.readonly'),
            t('designlab.showcase.component.switch.sections.states.badge.disabled'),
            t('designlab.showcase.component.switch.sections.states.badge.invalid'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title={t('designlab.showcase.component.switch.sections.states.panelReadonly')}>
                <Switch label={t('designlab.showcase.component.switch.live.stateMatrix.readonlyLabel')} defaultChecked readOnly />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.switch.sections.states.panelDisabled')}>
                <Switch label={t('designlab.showcase.component.switch.live.stateMatrix.disabledLabel')} disabled />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.switch.sections.states.panelPolicyBlocked')}>
                <Switch
                  label={t('designlab.showcase.component.switch.live.stateMatrix.invalidLabel')}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'switch-release-controls',
          eyebrow: 'Release controls',
          title: 'Inline release kontrol satiri',
          description: 'Birden fazla binary karari ayni kartta toplayan daha operasyonel bir switch alternatifini gosterir.',
          badges: ['release', 'inline', 'ops'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title="Canli feature">
                <Switch
                  label="Feature acik"
                  description="Yeni showcase ailesini kullanicilara ac."
                  checked={switchValue}
                  onCheckedChange={setSwitchValue}
                />
              </PreviewPanel>
              <PreviewPanel title="Readonly gate">
                <Switch
                  label="Policy lock"
                  description="Core policy dosyalari degisimden once kilitli kalir."
                  defaultChecked
                  readOnly
                />
              </PreviewPanel>
              <PreviewPanel title="Blocked rollout">
                <Switch
                  label="External publish"
                  description="SEO/GEO evidence eksikken public rollout acilmaz."
                  disabled
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
