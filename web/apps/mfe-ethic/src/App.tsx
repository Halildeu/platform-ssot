import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CounterState, ProductsState, Product } from '@mfe/shared-types';
// GÜNCELLENDİ: 'decrement' action'ı artık shell'den import ediliyor.
import { decrement } from 'mfe_shell/logic';

// RootState arayüzü, hem counter hem de products dilimini içeriyor.
interface RootState {
  counter: CounterState;
  products: ProductsState;
}

const App = () => {
  // Hem sayaç hem de ürünler için state'i Redux'tan alıyoruz.
  const count = useSelector((state: RootState) => state.counter.value);
  const { items, status } = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch();

  let content;

  // Veri çekme durumuna göre ürünler için içerik oluşturuyoruz.
  if (status === 'loading') {
    content = <div>Ürünler Yükleniyor...</div>;
  } else if (status === 'succeeded') {
    content = (
      <ul>
        {items.map((product: Product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    );
  } else if (status === 'failed') {
    content = <div>Hata: Ürünler yüklenemedi.</div>;
  }

  return (
    <div style={{ padding: '1em', border: '2px dashed green' }}>
      <h2>Burası "Ethic" Mikro Uygulaması</h2>
      <p>Bu alan mfe-ethic tarafından yönetiliyor ve 3002 portundan sunuluyor.</p>
      
      {/* Ürünleri gösterme bölümü */}
      <p>API'dan Gelen ve Shell Tarafından Yönetilen Ürünler:</p>
      {content}

      <hr />
      
      {/* Sayaç gösterme ve değiştirme bölümü */}
      <h3>Paylaşılan Sayaç Değeri: {count}</h3>
      <button onClick={() => dispatch(decrement())}>
        Shell'deki Sayacı Azalt
      </button>
    </div>
  );
};

export default App;