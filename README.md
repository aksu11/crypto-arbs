npm install
node server.js
npm run dev

# Crypto-Arbs – Monipörssinen arbitraasihaku

Tämä projekti on Node.js + React -sovellus, joka hakee reaaliaikaiset bid/ask-hinnat useista kryptopörsseistä ja etsii arbitraasimahdollisuuksia USDT-pareille.

## Tuetut pörssit

- Binance
- Bybit
- Kraken
- Coinbase
- MEXC
- Gate.io
- OKX
- Bitget

## Ominaisuudet

- Hakee bid/ask-hinnat kaikista tuetuista pörsseistä kymmenille USDT-pareille
- Näyttää vain arbitraasit, joissa voitto ylittää 0.1% (voit muuttaa koodista)
- Moderni React/Vite-käyttöliittymä
- Ei vaadi API-avaimia (vain julkiset REST-päätepisteet)

## Käyttöohje

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

Avaa selain osoitteeseen http://localhost:5173 (tai porttiin jonka Vite ilmoittaa) ja paina "Etsi arbitraatit"-nappia.

## Huomioita

- .env-tiedostoa ei tarvita eikä käytetä.
- Sovellus käyttää vain julkisia REST-päätepisteitä, joten API-avaimia ei tarvita.
- Jos jokin pörssi palauttaa null-arvoja, kyseinen pari ei ole tuettu kyseisessä pörssissä.

## Kehittäminen

Voit muokata tuettuja pörssejä ja valuuttapareja tiedostossa `server.js`.

Frontendin logiikka löytyy tiedostosta `src/App.jsx`.
