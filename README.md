# Crypto-Arbs Binance API Test

Tämä projekti on yksinkertainen Node.js + React -sovellus, joka hakee BTCUSDT-hinnan Binancesta ja näyttää sen JSON-muodossa.

## Käynnistys

1. Asenna riippuvuudet:
   ```
npm install
   ```
2. Käynnistä backend (Express):
   ```
node server.js
   ```
3. Käynnistä frontend (Vite):
   ```
npm run dev
   ```

Avaa selain osoitteeseen http://localhost:5173 ja paina nappia hakeaksesi hinnan Binancesta.

---

# React + Vite

Tämä template tarjoaa minimiasetukset Reactin ja Viten käyttöön.

Tällä hetkellä on saatavilla kaksi virallista liitintä:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) käyttää [Babel](https://babeljs.io/) -työkalua Fast Refreshia varten
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) käyttää [SWC](https://swc.rs/) -työkalua Fast Refreshia varten

## ESLint-konfiguraation laajentaminen

Jos kehität tuotantokäyttöön tarkoitettua sovellusta, suosittelemme TypeScriptin käyttöä, jossa on käytössä tyyppitietoisten lint-sääntöjen tuki. Katso lisätietoja [TS-mallista](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) ja [`typescript-eslint`](https://typescript-eslint.io) -sivustolta projektisi integroimiseksi TypeScriptin kanssa.
