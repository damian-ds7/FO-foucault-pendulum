---
title: "Symulacja wahadła Foucaulta"
author: "Michał Szwejk, Damian D'Souza"
date: "2025-12-07"
---

## Założenia i cel projektu

Celem projektu jest stworzenie interaktywnej symulacji wahadła Foucaulta, która umożliwia:

- **Numeryczne rozwiązanie równań ruchu** wahadła w obracającym się układzie odniesienia związanym z Ziemią przy użyciu metody Rungego-Kutty 4. rzędu
- **Interaktywną kontrolę parametrów fizycznych**: szerokość geograficzna (0-90°), długość wahadła (5-100 m), amplituda początkowa, okres ruchu obrotowego Ziemii oraz prędkość animacji
- **Śledzenie trajektorii** ruchu masy wahadła w czasie rzeczywistym

## Wykorzystane oprogramowanie

- **p5.js** – biblioteka JavaScript do wizualizacji i animacji
- **JavaScript** – implementacja fizyki i logiki symulacji
- **HTML/CSS** – interfejs użytkownika i panel sterowania

### Metody numeryczne

Symulacja wykorzystuje metodę **Rungego-Kutty 4. rzędu** do numerycznego całkowania równań ruchu wahadła:

$$\frac{d^2x}{dt^2} = 2\omega\frac{dy}{dt}\sin\phi - \frac{g}{L}x$$

$$\frac{d^2y}{dt^2} = -2\omega\frac{dx}{dt}\sin\phi - \frac{g}{L}y$$

gdzie: $\omega$ – prędkość kątowa Ziemi, $\phi$ – szerokość geograficzna, $g$ – przyspieszenie ziemskie, $L$ – długość wahadła.

## Sposób uruchomienia

Aby uruchomić symulację, należy otworzyć plik **`index.html`** w przeglądarce internetowej (np. Chrome, Firefox, Edge).

### Obsługa aplikacji

Po uruchomieniu dostępne są następujące kontrolki:

- **Szerokość geograficzna** – wpływa na siłę efektu Coriolisa (0° = równik, 90° = biegun)
- **Długość wahadła** – określa okres drgań własnych
- **Amplituda początkowa** – wychylenie początkowe masy wahadła
- **Okres ruchu obrotowego Ziemi** – w symulacji skrócony dla lepszej wizualizacji efektu rotacji
- **Prędkość animacji** – przyspieszenie symulacji (1x-20x)
