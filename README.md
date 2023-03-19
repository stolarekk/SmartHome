System sterowania elementami inteligentnego domu z wykorzystaniem technologii chmurowych

Celem pracy było zaprojektowanie i stworzenie systemu sterowania elementami inteligentnego domu z wykorzystaniem technologii chmurowych. System składa się z aplikacji internetowej napisanej w językach HTML, CSS oraz JavaScript z wykorzystaniem frameworku React.js, serwera aplikacji napisanego w języku JavaScript z wykorzystaniem środowiska Node.js, platformy chmurowej stworzonej w chmurze Amazon Web Services oraz mikrokontrolerów z rodziny ESP, które symulują urządzenia inteligentnego domu.

Korzystając z aplikacji użytkownik ma możliwość sterowania urządzeniami inteligentnego domu, takimi jak oświetlenie, zamek drzwi czy piec grzewczy. Dodatkowo w aplikacji wyświetlane są dane z czujników oraz aktualny obraz z kamery. Wszystkie dane zapisywane są także w bazie danych AWS DynamoDB, a następnie wizualizowane w aplikacji w postaci wykresów.

Część analityczna pracy zajmuje się problemem optymalnego dostosowania ogrzewania domu w zależności od obecności domowników w domu. Obraz z kamery zamontowanej w inteligentnym domu jest na bieżąco analizowany w chmurze w celu wykrycia obecności domowników. Wyniki analizy trafiają do bazy danych, a następnie raz w tygodniu są automatycznie analizowane przez chmurę AWS z wykorzystaniem języka Python i biblioteki Pandas. Po przeanalizowaniu danych wypracowany zostaje plan ogrzewania domu na kolejny tydzień.   

![Alt text](./diagram.png?raw=true "Diagram systemu")

![Alt text](./home.png?raw=true "Główny widok aplikacji")
