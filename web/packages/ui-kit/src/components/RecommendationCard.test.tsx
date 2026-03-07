import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import RecommendationCard from './RecommendationCard';

describe('RecommendationCard', () => {
  test('summary, rationale ve confidence bilgisini birlikte gosterir', () => {
    render(
      <RecommendationCard
        title="Rollout recommendation"
        summary="Canary yuzdesi kademeli artirilmali."
        rationale={['Error budget stabil', 'Gateway smoke PASS']}
        citations={['trace:canary-441', 'doctor:frontend']}
        confidenceLevel="high"
        confidenceScore={84}
        sourceCount={3}
      />,
    );

    expect(screen.getByText('Rollout recommendation')).toBeInTheDocument();
    expect(screen.getByText('Canary yuzdesi kademeli artirilmali.')).toBeInTheDocument();
    expect(screen.getByText('Error budget stabil')).toBeInTheDocument();
    expect(screen.getByText('High confidence · 84% · 3 sources')).toBeInTheDocument();
  });

  test('primary ve secondary action callbacklerini uretir', () => {
    const onPrimaryAction = jest.fn();
    const onSecondaryAction = jest.fn();

    render(
      <RecommendationCard
        title="Policy suggestion"
        summary="Onaya gondermeden once ek review iste."
        onPrimaryAction={onPrimaryAction}
        onSecondaryAction={onSecondaryAction}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    fireEvent.click(screen.getByRole('button', { name: 'Review' }));

    expect(onPrimaryAction).toHaveBeenCalledTimes(1);
    expect(onSecondaryAction).toHaveBeenCalledTimes(1);
  });

  test('readonly access durumunda aksiyonlari bloke eder', () => {
    const onPrimaryAction = jest.fn();

    render(
      <RecommendationCard
        title="Readonly recommendation"
        summary="Policy lock acik."
        access="readonly"
        onPrimaryAction={onPrimaryAction}
      />,
    );

    const button = screen.getByRole('button', { name: 'Apply' });
    expect(button).toHaveAttribute('aria-readonly', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(button);
    expect(onPrimaryAction).not.toHaveBeenCalled();
  });
});
