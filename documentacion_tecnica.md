# Documentació Tècnica: WeMap

## 1. Introducció i Propòsit
WeMap és una plataforma social d'avantguarda dissenyada per transformar la manera en què els usuaris interactuen amb el seu entorn urbà, facilitant el descobriment i la creació de rutes personalitzades. El projecte neix de la necessitat de centralitzar en una sola eina la planificació d'itineraris, l'exploració de punts d'interès (POIs) i el component social que permet compartir experiències amb una comunitat activa.

El valor principal de WeMap resideix en la seva capacitat per oferir una experiència de navegació fluida i en temps real. L'aplicació ha estat optimitzada per a dos escenaris d'ús clarament diferenciats: la planificació detallada des d'un ordinador d'escriptori i l'ús pràctic en exteriors mitjançant dispositius mòbils. Per aconseguir-ho, s'ha implementat un enfocament de disseny responsiu basat en una arquitectura "Desktop-Side / Mobile-Bottom". Aquest sistema situa els controls en barres laterals en pantalles grans per aprofitar l'espai horitzontal, mentre que en mòbils utilitza panells inferiors lliscants (bottom sheets) que faciliten l'ús amb una sola mà.

---

## 2. Arquitectura d'Alt Nivell
L'ecosistema tècnic de WeMap es fonamenta en una estructura modular que garanteix un manteniment eficient i una escalabilitat progressiva de les seves funcionalitats. El sistema segueix el model MERN modernitzat, dividint-se en les següents capes:

*   **Frontend:** Desenvolupat amb React 19 i Vite, prioritzant el rendiment i la velocitat de càrrega. Per a l'estilisme s'utilitza Tailwind CSS, permetent un disseny altament personalitzable i adaptatiu, mentre que Framer Motion gestiona les transicions i animacions per oferir una interfície dinàmica.
*   **Backend:** Un servidor robust basat en Node.js i Express que gestiona la lògica de negoci. La comunicació bidireccional es realitza mitjançant Socket.io, permetent actualitzacions en temps real sense necessitat de recarregar la pàgina.
*   **Persistència de Dades:** S'ha optat per un sistema híbrid de base de dades per aprofitar el millor de cada tecnologia. S'utilitza MongoDB per a l'emmagatzematge de dades geogràfiques complexes (GeoJSON) i el contingut social flexible, mentre que MySQL gestiona l'estructura relacional d'usuaris, perfils i vincles de seguretat.
*   **Serveis Externs:**
    *   **OSRM (Open Source Routing Machine):** Motor de càlcul extern que processa les coordenades per retornar trajectòries precises i distàncies geogràfiques.
    *   **Gemini AI:** Integració amb els models de llenguatge avançats de Google per potenciar JARVIS, l'asistent virtual de la plataforma.

Tota la infraestructura està completament contenidoritzada mitjançant Docker, assegurant que l'entorn de desenvolupament sigui idèntic al de producció i evitant conflictes de dependències.

---

## 3. Guia d'Instal·lació i Configuració
El desplegament de WeMap s'ha simplificat al màxim per permetre que qualsevol desenvolupador pugui posar en marxa el projecte amb un esforç mínim de configuració manual.

### Requisits Previs
Abans de començar, cal assegurar-se de tenir instal·lats Docker i Docker Compose al sistema. Tot i que es pot executar de forma nativa amb Node.js v18 o superior, el mètode recomanat és l'ús de contenidors per garantir l'estabilitat del sistema.

### Passos per a l'Inici
1.  **Clonació del Projecte:** Descarregueu el repositori oficial en el vostre directori local de treball.
2.  **Configuració de l'Entorn:** Creeu un arxiu `.env` a la rel del projecte prenent com a referència l'arxiu `.env.example`. És imprescindible configurar correctament les credencials de MongoDB, Google OAuth i la clau de l'API de Gemini per al correcte funcionament de l'IA.
3.  **Desplegament:** Executeu l'ordre `docker-compose up --build`. Aquest procés aixecarà automàticament els següents serveis:
    *   **Frontend:** Accessible des del port 5173.
    *   **Backend API:** Operatiu al port 3000.
    *   **Base de Dades MySQL:** Gestionada al port 3307.
    *   **phpMyAdmin:** Interfície visual per a MySQL disponible al port 8081.

---

## 4. Estructura de Dades i API
La gestió de la informació es divideix estratègicament segons la naturalesa de les dades per optimitzar les consultes i la integritat del sistema.

### Gestió de Dades
*   **MongoDB:** S'encarrega d'emmagatzemar tota la informació dinàmica, com ara les rutes creades pels usuaris, les publicacions de la comunitat, els comentaris i els registres de les converses del xat. La seva naturalesa no relacional permet gestionar estructures GeoJSON complexes de forma nativa.
*   **MySQL:** S'utilitza per a dades que requereixen una consistència relacional estricta, com l'autenticació d'usuaris, les llistes de seguidors, les peticions d'amistat i l'historial d'activitat global.

### Comunicació
*   **REST API:** Defineix una sèrie de contractes clars per a la gestió de punts d'interès, autenticació, coleccions i el sistema de cerca unificada que integra resultats de múltiples fonts.
*   **WebSockets:** Mitjançant Socket.io, el sistema gestiona la presència en línia dels amics i l'enviament de notificacions instantànies, garantint que la informació que veu l'usuari estigui sempre actualitzada.

---

## 5. Mòduls i Lògica de Negoci
El desenvolupament de WeMap s'ha organitzat en mòduls funcionals clarament separats per facilitar el seu creixement i manteniment.

*   **Visualització Geogràfica:** Aquest mòdul, basat en la llibreria Leaflet, és el cor visual de l'aplicació. Permet la renderització de capes cartogràfiques interactives, la representació de punts d'interès amb iconografia personalitzada i el seguiment de la ubicació de l'usuari mitjançant el GPS del dispositiu.
*   **Motor de Rutes:** El backend actua com a pont de comunicació entre l'usuari i el servei extern OSRM. Quan un usuari selecciona diversos punts, el servidor processa aquestes coordenades, consulta al motor de rutes i retorna la geometria exacta que es dibuixarà com una línia continua sobre el mapa.
*   **Assistent JARVIS:** Aquest mòdul utilitza intel·ligència artificial per processar el llenguatge natural. Les consultes dels usuaris s'envien a l'endpoint de Gemini, el qual processa la informació tenint en compte el context de la plataforma per oferir suport tècnic i recomanacions personalitzades.

---

## 6. Flux de Treball a Git
Per garantir que el codi es mantingui estable i lliure d'errors en un entorn de col·laboració, s'apliquen de forma estricta les següents regles:

*   **Branca Principal:** La branca `main` és sagrada. Només conté codi que ha estat prèviament provat i aprovat. Està directament vinculada al cicle de producció.
*   **Desenvolupament de Funcionalitats:** Qualsevol tasca nova, ja sigui una funció o una correcció d'errors, s'ha de realitzar en una branca independent seguint la convenció `feature/nom-de-la-tasca` o `fix/nom-de-l-error`.
*   **Integració de Codi:** La incorporació de codi nou a la branca principal es realitza exclusivament mitjançant Pull Requests (PR). Aquestes requereixen una revisió manual per part d'altres membres de l'equip i la resolució de qualsevol conflicte en l'entorn local abans de procedir al merge definitiu.
