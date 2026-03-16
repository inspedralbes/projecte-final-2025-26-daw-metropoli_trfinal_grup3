# Llistat d'Implementacions i Millores

Aquest document recull les tasques pendents i les optimitzacions planificades per al desenvolupament del projecte, dividides per àrees d'actuació.

---

## 1. Experiència d'Usuari (UX) i Mapa
L'objectiu principal és millorar la interactivitat i la claredat visual de la funcionalitat principal del mapa.

* **Detalls de POI (Punts d'Interès):** Implementar vistes detallades que permetin a l'usuari consultar informació ampliada de cada punt.
* **Animació de rutes:** Desenvolupar una animació visual per al camí que s'ha de recórrer, millorant la guia de l'usuari cap a la seva destinació.

## 2. Qualitat del Codi i Arquitectura
Refactorització del sistema per garantir un manteniment eficient i una escalabilitat òptima.

* **Neteja de codi:** Identificació i eliminació de "codi mort" i fitxers no utilitzats.
* **Eliminació de duplicitats:** Auditar elements de la interfície i serveis del sistema per evitar la redundància.
* **Estandardització:** Verificar i aplicar una estructura de fitxers i de codi consistent en tot el projecte.

## 3. Internacionalització Dinàmica (i18n)
Evolució del sistema de traduccions per cobrir tot el contingut de l'aplicació.

* **Traducció de dades:** Implementar la lògica necessària per a que les dades servides des de la base de dades també disposin de versions en diferents idiomes segons la preferència de l'usuari.

## 4. Gestió d'Accessos i Autenticació
Seguretat i personalització de l'experiència segons el perfil d'usuari.

* **Tipus de Login:** Implementar diversos mètodes d'entrada al sistema.
* **Rutes protegides:** Restringir o permetre l'accés a vistes específiques segons el rol o el tipus de validació realitzat.

## 5. Distribució i Multiplataforma
Preparació del programari per a la seva distribució en diferents entorns i dispositius.

* **Conversió a PWA:** Configuració de Service Workers i manifest per transformar l'aplicació en una Progressive Web App.
* **Generació d'APK:** Preparació del codi i compilació per a la creació del fitxer executable per a dispositius Android.

---
