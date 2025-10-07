# find_masteris

## Projekto tikslas

Palengvinti naudotojams surasti tinkamą meistrą darbams, atsižvelgiant į meistro pateiktą informaciją bei gautus įvertinimus, o meistrui - palengvinti informacijos sklaidą dėl teikiamų paslaugų.

## Sistemos paleidimas

Iš projekto aplanko `./find-masteris-backend` paleisti `pip install ./requirements.txt`.

Sukurti failą `settings_db.py`, kuriame bus konstanta `DATABASES`, kuri aprašys standartinį Django duomenų bazės kintamąjį, saugantį prisijungimą į DB.

## Funkciniai reikalavimai
Neregistruotas sistemos naudotojas galės:
1. Peržiūrėti platformos reprezentacinį puslapį;
2. Prisijungti prie sistemos;
3. Registruotis prie sistemos;
Registruotas klientas galės:
1. Atsijungti nuo sistemos;
2. Peržiūrėti meistrus, kurie turi įsikėlę paslaugų pagal pasirinktą kategoriją;
3. Peržiūrėti meistro informaciją:
3.1. Kontaktinę informaciją;
3.2. Meistro įkeltus atliktų darbų įrašus pagal kategorijas ir paslaugas;
3.3. Kiekvieną esantį atsiliepimą, filtruojant pagal dominančią kategoriją bei paslaugą;
4. Pridėti atsiliepimą apie meistrą, pateikiant, kokios kategorijos paslauga yra vertinama;
Meistras galės:
1. Atsijungti nuo sistemos;
2. Užpildyti detalią informaciją apie save;
3. Valdyti paslaugų įrašus;
4. Peržiūrėti atsiliepimus apie save;
5. Siųsti užklausą administratoriui pridėti naują kategoriją arba kategorijos paslaugą;
Administratorius galės:
1. Atsijungti;
2. Valdyti priregistruotus naudotojus;
3. Valdyti kategorijas;
4. Valdyti paslaugas;
5. Valdyti visus paslaugų įrašus;
6. Valdyti visus atsiliepimus;
7. Valdyti gautas užklausas dėl kategorijų;
8. Valdyti gautas užklausas dėl kategorijos paslaugų;
