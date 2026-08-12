# Gym-web-app – Edzőtermi tagság- és edzésnapló alkalmazás

## Csapat felépítése

* **Tóth Csanád** – Frontend fejlesztő, React keretrendszer
* **Varga Sándor** – Adatbázis fejlesztő
* **Csehely Dominik** – Backend fejlesztő és projektvezető

---

# Projekt leírás

A projektünk célja egy olyan **edzőtermi tagság- és edzésnapló webalkalmazás** elkészítése, amely segít az edzőterembe járó felhasználóknak az edzéseik és fejlődésük egyszerű nyomon követésében.

A probléma, amit meg szeretnénk oldani, hogy az edzőterembe járók sokszor nehezen tudják követni, hogy milyen gyakorlatokat végeztek, mekkora súllyal edzettek, hány ismétlést csináltak, illetve hogyan fejlődtek az idő során.

A rendszerben a felhasználók létrehozhatják saját profiljukat, edzésterveket készíthetnek, gyakorlatokat adhatnak hozzá, valamint rögzíthetik az edzéseik eredményeit. A korábbi adatok alapján a rendszer statisztikákat is készít, így a felhasználó könnyebben láthatja a fejlődését.

A célunk egy egyszerűen használható, átlátható és mobiltelefonon, valamint számítógépen is használható alkalmazás létrehozása.

---

# Főbb funkciók

* Felhasználói profil létrehozása és kezelése
* Edzéstervek létrehozása
* Edzéstervek módosítása és törlése
* Gyakorlatok kezelése
* Gyakorlatok hozzáadása edzéstervekhez
* Súlyok rögzítése
* Ismétlések rögzítése
* Edzések mentése
* Korábbi edzések megtekintése
* Fejlődési statisztikák készítése
* Eredmények lekérdezése
* Adatok módosítása és törlése

---

# Frontend

A frontend feladata az alkalmazás felhasználói felületének elkészítése.

A frontend fejlesztéséért **Tóth Csanád** felel.

A projektben a **React** keretrendszert fogjuk használni.

A frontend feladatai közé tartozik például:

* bejelentkezési és profiloldal elkészítése,
* edzéstervek megjelenítése,
* gyakorlatok kezelése,
* edzések rögzítésére szolgáló felület elkészítése,
* statisztikák megjelenítése,
* backend API-val való kommunikáció.

A felületet úgy tervezzük meg, hogy számítógépen és mobiltelefonon is könnyen használható legyen.

---

# Backend

A backend feladata az alkalmazás háttérben történő működésének biztosítása.

A backend fejlesztéséért **Csehely Dominik** felel, aki egyben a projekt vezetője is.

A backend feladatai:

* felhasználói adatok kezelése,
* edzéstervek kezelése,
* gyakorlatok kezelése,
* edzések és eredmények mentése,
* adatok módosítása és törlése,
* adatok lekérdezése,
* statisztikákhoz szükséges adatok biztosítása,
* frontend és adatbázis közötti kommunikáció biztosítása.

A backend RESTful API-n keresztül fog kommunikálni a frontenddel.

---

# Adatbázis

Az adatbázis megtervezéséért és elkészítéséért **Varga Sándor** felel.

Az adatbázisban tároljuk az alkalmazás működéséhez szükséges adatokat.

A főbb táblák például:

* **Felhasználók**
* **Edzéstervek**
* **Gyakorlatok**
* **Edzések**
* **Eredmények**

Az adatbázis segítségével a rendszer képes lesz az adatok mentésére, módosítására, törlésére és lekérdezésére.

Az adatbázis táblái között megfelelő kapcsolatok lesznek kialakítva, hogy az adatok rendezett és átlátható módon legyenek tárolva.

---

# Statisztikák és adatkezelés

A rendszer az elmentett edzésadatok alapján különböző statisztikákat fog készíteni.

A felhasználó például meg tudja nézni:

* hány edzésen vett részt,
* milyen gyakorlatokat végzett,
* milyen súlyokkal dolgozott,
* hány ismétlést végzett,
* hogyan változtak az eredményei,
* melyik gyakorlatban fejlődött a legtöbbet.

A statisztikák segítségével a felhasználó könnyebben követheti saját fejlődését.

---

# KKK elvárásainak teljesítése

## Valódi problémára ad megoldást

Az alkalmazás egy valós problémát old meg, mivel az edzőterembe járóknak gyakran nehéz nyomon követniük a korábbi edzéseiket és fejlődésüket.

A Gym-web-app segítségével ezeket az adatokat egyetlen rendszerben lehet tárolni és megtekinteni.

## Adatkezelés és adattárolás

A rendszer adatbázist használ.

Az adatbázisban a felhasználók, edzéstervek, gyakorlatok és edzéseredmények adatait tároljuk.

Az adatok:

* menthetők,
* módosíthatók,
* törölhetők,
* lekérdezhetők.

## RESTful architektúra

A rendszer két fő részből áll:

**Backend:**

* kezeli az adatokat,
* biztosítja a REST API-t,
* kommunikál az adatbázissal.

**Frontend:**

* biztosítja a felhasználói felületet,
* megjeleníti az adatokat,
* kommunikál a backend API-val.

## Több eszköz támogatása

A webalkalmazást reszponzív módon készítjük el, ezért számítógépen, laptopon, tableten és mobiltelefonon is használható lesz.

## Tiszta forráskód

A projekt során törekszünk a Clean Code alapelveinek betartására.

A kód legyen:

* átlátható,
* megfelelően tagolt,
* könnyen olvasható,
* könnyen módosítható,
* karbantartható.

A frontend, backend és adatbázis feladatait elkülönítve kezeljük.

## Dokumentáció

A projekthez részletes dokumentáció készül.

A dokumentáció bemutatja:

* a projekt célját,
* a projekt felépítését,
* a csapat tagjainak feladatait,
* a használt technológiákat,
* az adatbázis felépítését,
* a backend működését,
* a frontend működését,
* a telepítés menetét,
* az alkalmazás használatát.

---

# A leadandó csomag tartalma

## Forráskód

A projekt teljes frontend és backend forráskódja.

## Adatbázismodell-diagram

Az adatbázis tábláinak és azok kapcsolatainak diagramja.

## Adatbázis dump

Az adatbázis exportált változata, amelyből az adatbázis újra létrehozható.

## Dokumentáció

A projekt teljes dokumentációja, amely tartalmazza a rendszer működését, felépítését, a használt technológiákat, a telepítést és a használatot.

## Tesztkód

Automatikus tesztek, amelyekkel ellenőrizhető az alkalmazás megfelelő működése.

## Teszteredmények

A tesztek futtatásának eredményei, amelyek igazolják, hogy a rendszer megfelelően működik.
