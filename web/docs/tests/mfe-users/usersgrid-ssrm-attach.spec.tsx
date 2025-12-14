/**
 * Amaç: UsersGrid bileşeninde SSRM datasource attach işleminin yalnızca 1 kez yapılmasını doğrulamak.
 * Yöntem: AgGridReact'i mock'layıp `onGridReady` çağrısına sahte api veriyoruz, `setGridOption('serverSideDatasource', ds)` çağrı sayısını ölçüyoruz.
 * Notlar:
 * - Bu test bir şablondur. UsersGrid bileşeninizi doğru path ile import edip, zorunlu props'larını doldurun.
 * - Eğer bileşen SSRM datasource'u hem `onGridReady` içinde hem de `useEffect` ile bağlıyorsa, çağrı 2 olabilir. Hedef 1'dir.
 * - React.StrictMode dev'de mount efektlerini iki kez tetikleyebilir; prod build'te bu olmaz.
 */

import React from 'react';
import { render } from '@testing-library/react';

// TODO: Kendi gerçek bileşen yolunuzu girin
// import { UsersGrid } from 'apps/mfe-users/src/widgets/user-management/ui/UsersGrid.ui';
// Geçici dummy bileşen (şablon açıklaması için). Projede gerçek UsersGrid'i import edin.
const UsersGrid: React.FC<any> = () => <div>UsersGrid</div>;

// AgGridReact'i mock’la: render sırasında onGridReady'yi bir kez tetikle ve sahte api dön
const setGridOptionMock = jest.fn();

jest.mock('ag-grid-react', () => ({
  AgGridReact: (props: any) => {
    const fakeEvent = {
      api: {
        setGridOption: setGridOptionMock,
      },
      columnApi: {},
    };
    // onGridReady verilmişse bir kez tetikle
    if (typeof props.onGridReady === 'function') {
      props.onGridReady(fakeEvent);
    }
    return null;
  },
}));

describe('UsersGrid SSRM attach', () => {
  beforeEach(() => setGridOptionMock.mockClear());

  it('serverSideDatasource sadece 1 kez bağlanmalı', () => {
    // TODO: bileşenin gerektirdiği props’ları doldurun
    render(
      // StrictMode kapalı tutmak daha deterministik sonuç verir
      <UsersGrid />
    );

    // SSRM attach için setGridOption('serverSideDatasource', ds) beklenir
    const calls = setGridOptionMock.mock.calls.filter(
      (args) => args?.[0] === 'serverSideDatasource'
    );
    expect(calls.length).toBe(1);
  });
});

