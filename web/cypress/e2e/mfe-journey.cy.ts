describe('Mikro-Frontend Kullanıcı Yolculuğu', () => {
  it('Shell, Ethic ve paylaşılan statein doğru çalışmasını test eder', () => {
    // 1. Ana sayfayı ziyaret et
    cy.visit('http://localhost:3000');

    // 2. Shell ana sayfasının render edildiğini doğrula
    cy.contains('h4', 'Ana Sayfaya Hoş Geldiniz');

    // 3. Header'daki "Ethic" linkine tıkla
    cy.contains('a', 'Ethic').click();

    // 4. URL'in doğru değiştiğini doğrula
    cy.url().should('include', '/ethic');

    // 5. Ethic MFE'sinin başlığının ekrana geldiğini doğrula
    cy.contains('h2', 'Burası "Ethic" Mikro Uygulaması');

    // 6. Asenkron olarak yüklenen ürünlerin listelendiğini doğrula
    cy.contains('li', 'Laptop', { timeout: 5000 });
    cy.contains('li', 'Klavye');
    cy.contains('li', 'Mouse');

    // 7. Paylaşılan sayaç değerinin başlangıçta 0 olduğunu doğrula
    cy.contains('h3', 'Paylaşılan Sayaç Değeri: 0');

    // 8. Ethic MFE'sindeki butona tıklayarak Redux state'ini değiştir
    cy.contains('button', "Shell'deki Sayacı Azalt").click();

    // 9. Paylaşılan sayaç değerinin güncellendiğini doğrula
    cy.contains('h3', 'Paylaşılan Sayaç Değeri: -1');
  });
});
