import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// DOĞRU YÖNTEM
export default Button;

// Testleri bir 'describe' bloğu ile gruplıyoruz
describe('Button Bileşeni', () => {

  // 1. Test: Butonun doğru metinle render edilip edilmediğini kontrol et
  test('içindeki metin ile doğru bir şekilde render edilir', () => {
    render(<Button>Tıkla Bana</Button>);

    // Ekranda "Tıkla Bana" metnini içeren bir element ara
    const buttonElement = screen.getByText(/Tıkla Bana/i);
    
    // Elementin ekranda olduğunu doğrula
    expect(buttonElement).toBeInTheDocument();
  });

  // 2. Test: Butona tıklandığında onClick fonksiyonunun çağrılıp çağrılmadığını kontrol et
  test('tıklandığında onClick fonksiyonunu çağırır', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn(); // Jest'in sahte (mock) fonksiyonunu oluştur

    render(<Button onClick={handleClick}>Tıkla Bana</Button>);

    // Butonu bul ve tıkla
    const buttonElement = screen.getByText(/Tıkla Bana/i);
    await user.click(buttonElement);

    // handleClick fonksiyonunun 1 kez çağrıldığını doğrula
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});