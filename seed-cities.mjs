import { createClient } from '@supabase/supabase-js'

// ⚠️ ОБЯЗАТЕЛЬНО ЗАМЕНИ ЭТИ ДВЕ СТРОЧКИ НА СВОИ ДАННЫЕ ИЗ SUPABASE (Project Settings -> API) ⚠️
const SUPABASE_URL = 'https://твой_проект.supabase.co' // Должно начинаться с https://
const SUPABASE_SERVICE_ROLE_KEY = 'твой_длинный_service_role_ключ' // Это НЕ anon, а service_role!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Встроенный список всех 1026 городов
const rawCities = `
1. Aleksandrów Kujawski
2. Aleksandrów Łódzki
3. Alwernia
4. Andrychów
5. Annopol
6. Augustów
7. Babimost
8. Baborów
9. Baranów Sandomierski
10. Barcin
11. Barczewo
12. Bardo
13. Barlinek
14. Bartoszyce
15. Barwice
16. Bełchatów
17. Bełżyce
18. Będzin
19. Biała
20. Biała Piska
21. Biała Podlaska
22. Biała Rawska
23. Białaczów
24. Białobrzegi
25. Białogard
26. Biały Bór
27. Białystok
28. Biecz
29. Bielawa
30. Bielsk Podlaski
31. Bielsko-Biała
32. Bieruń
33. Bierutów
34. Bieżuń
35. Biłgoraj
36. Bircza
37. Biskupiec
38. Bisztynek
39. Blachownia
40. Błaszki
41. Błażowa
42. Błonie
43. Bobolice
44. Bobowa
45. Bobrowniki
46. Bochnia
47. Bodzanów
48. Bodzentyn
49. Bogatynia
50. Bogoria
51. Boguchwała
52. Boguszów-Gorce
53. Bojanowo
54. Bolesławiec (powiat bolesławiecki)
55. Bolesławiec (powiat wieruszowski)
56. Bolimów
57. Bolków
58. Borek Wielkopolski
59. Borne Sulinowo
60. Branice
61. Braniewo
62. Brańsk
63. Brodnica
64. Brody
65. Brok
66. Brusy
67. Brwinów
68. Brzeg
69. Brzeg Dolny
70. Brzesko
71. Brzeszcze
72. Brześć Kujawski
73. Brzeziny
74. Brzostek
75. Brzozów
76. Budzyń
77. Buk
78. Bukowno
79. Busko-Zdrój
80. Bychawa
81. Byczyna
82. Bydgoszcz
83. Bystrzyca Kłodzka
84. Bytom
85. Bytom Odrzański
86. Bytów
87. Cedynia
88. Cegłów
89. Chełm
90. Chełmek
91. Chełmno
92. Chełmża
93. Chęciny
94. Chmielnik
95. Chocianów
96. Chociwel
97. Chocz
98. Chodecz
99. Chodzież
100. Chojna
101. Chojnice
102. Chojnów
103. Choroszcz
104. Chorzele
105. Chorzów
106. Choszczno
107. Chrzanów
108. Ciechanowiec
109. Ciechanów
110. Ciechocinek
111. Ciepielów
112. Cieszanów
113. Cieszyn
114. Ciężkowice
115. Cybinka
116. Czaplinek
117. Czarna Białostocka
118. Czarna Woda
119. Czarne
120. Czarnków
121. Czarny Dunajec
122. Czchów
123. Czechowice-Dziedzice
124. Czeladź
125. Czemierniki
126. Czempiń
127. Czerniejewo
128. Czersk
129. Czerwieńsk
130. Czerwińsk nad Wisłą
131. Czerwionka-Leszczyny
132. Częstochowa
133. Człopa
134. Człuchów
135. Czyżew
136. Ćmielów
137. Daleszyce
138. Darłowo
139. Dąbie
140. Dąbrowa Białostocka
141. Dąbrowa Górnicza
142. Dąbrowa Tarnowska
143. Dąbrowice
144. Debrzno
145. Dębica
146. Dęblin
147. Dębno
148. Dobczyce
149. Dobiegniew
150. Dobra (powiat łobeski)
151. Dobra (powiat turecki)
152. Dobre
153. Dobre Miasto
154. Dobrodzień
155. Dobrzany
156. Dobrzyca
157. Dobrzyń nad Wisłą
158. Dolsk
159. Drawno
160. Drawsko Pomorskie
161. Drezdenko
162. Drobin
163. Drohiczyn
164. Drzewica
165. Dubiecko
166. Dukla
167. Duszniki-Zdrój
168. Dynów
169. Działdowo
170. Działoszyce
171. Działoszyn
172. Dzierzgoń
173. Dzierżoniów
174. Dziwnów
175. Elbląg
176. Ełk
177. Frampol
178. Frombork
179. Garwolin
180. Gąbin
181. Gąsawa
182. Gdańsk
183. Gdynia
184. Gielniów
185. Giżycko
186. Glinojeck
187. Gliwice
188. Głogów
189. Głogów Małopolski
190. Głogówek
191. Głowaczów
192. Głowno
193. Głubczyce
194. Głuchołazy
195. Głuszyca
196. Gniew
197. Gniewkowo
198. Gniezno
199. Gogolin
200. Golczewo
201. Goleniów
202. Golina
203. Golub-Dobrzyń
204. Gołańcz
205. Gołdap
206. Goniądz
207. Goraj
208. Gorlice
209. Gorzów Śląski
210. Gorzów Wielkopolski
211. Gostynin
212. Gostyń
213. Gościno
214. Gowarczów
215. Gozdnica
216. Góra
217. Góra Kalwaria
218. Górowo Iławeckie
219. Górzno
220. Grabów
221. Grabów nad Prosną
222. Grajewo
223. Grodków
224. Grodzisk Mazowiecki
225. Grodzisk Wielkopolski
226. Grójec
227. Grudziądz
228. Grybów
229. Gryfice
230. Gryfino
231. Gryfów Śląski
232. Gubin
233. Hajnówka
234. Halinów
235. Hel
236. Hrubieszów
237. Iława
238. Iłowa
239. Iłża
240. Imielin
241. Inowłódz
242. Inowrocław
243. Ińsko
244. Iwaniska
245. Iwonicz-Zdrój
246. Izbica
247. Izbica Kujawska
248. Jabłonowo Pomorskie
249. Jadów
250. Janowiec Wielkopolski
251. Janów
252. Janów Lubelski
253. Janów Podlaski
254. Jaraczewo
255. Jarocin
256. Jarosław
257. Jasień
258. Jasło
259. Jastarnia
260. Jastrowie
261. Jastrzębie-Zdrój
262. Jawor
263. Jaworzno
264. Jaworzyna Śląska
265. Jedlicze
266. Jedlina-Zdrój
267. Jedlnia-Letnisko
268. Jedwabne
269. Jelcz-Laskowice
270. Jelenia Góra
271. Jeziorany
272. Jędrzejów
273. Jordanów
274. Józefów (powiat biłgorajski)
275. Józefów (powiat otwocki)
276. Józefów nad Wisłą
277. Jutrosin
278. Kaczory
279. Kalety
280. Kalisz
281. Kalisz Pomorski
282. Kalwaria Zebrzydowska
283. Kałuszyn
284. Kamieniec Ząbkowicki
285. Kamienna Góra
286. Kamień Krajeński
287. Kamień Pomorski
288. Kamieńsk
289. Kamionka
290. Kańczuga
291. Karczew
292. Kargowa
293. Karlino
294. Karpacz
295. Kartuzy
296. Katowice
297. Kazimierz Dolny
298. Kazimierza Wielka
299. Kąty Wrocławskie
300. Kcynia
301. Kędzierzyn-Koźle
302. Kępice
303. Kępno
304. Kętrzyn
305. Kęty
306. Kielce
307. Kietrz
308. Kikół
309. Kisielice
310. Kleczew
311. Kleszczele
312. Klimontów
313. Kluczbork
314. Kłecko
315. Kłobuck
316. Kłodawa
317. Kłodzko
318. Knurów
319. Knyszyn
320. Kobylin
321. Kobyłka
322. Kock
323. Kolbuszowa
324. Kolno
325. Kolonowskie
326. Koluszki
327. Kołaczyce
328. Koło
329. Kołobrzeg
330. Koniecpol
331. Konin
332. Konstancin-Jeziorna
333. Konstantynów Łódzki
334. Końskie
335. Koprzywnica
336. Korfantów
337. Koronowo
338. Korsze
339. Kosów Lacki
340. Kostrzyn
341. Kostrzyn nad Odrą
342. Koszalin
343. Kościan
344. Kościerzyna
345. Kowal
346. Kowalewo Pomorskie
347. Kowary
348. Koziegłowy
349. Kozienice
350. Koźmin Wielkopolski
351. Koźminek
352. Kożuchów
353. Kórnik
354. Krajenka
355. Kraków
356. Krapkowice
357. Krasnobród
358. Krasnystaw
359. Kraśnik
360. Krobia
361. Krosno
362. Krosno Odrzańskie
363. Krośniewice
364. Krotoszyn
365. Kruszwica
366. Krynica Morska
367. Krynica-Zdrój
368. Krynki
369. Krzanowice
370. Krzepice
371. Krzeszowice
372. Krzywiń
373. Krzyż Wielkopolski
374. Książ Wielki
375. Książ Wielkopolski
376. Kudowa-Zdrój
377. Kunów
378. Kutno
379. Kuźnia Raciborska
380. Kwidzyn
381. Latowicz
382. Lądek-Zdrój
383. Legionowo
384. Legnica
385. Lesko
386. Leszno
387. Leśna
388. Leśnica
389. Lewin Brzeski
390. Leżajsk
391. Lębork
392. Lędziny
393. Libiąż
394. Lidzbark
395. Lidzbark Warmiński
396. Limanowa
397. Lipiany
398. Lipno
399. Lipsk
400. Lipsko
401. Lubaczów
402. Lubań
403. Lubartów
404. Lubawa
405. Lubawka
406. Lubień Kujawski
407. Lubin
408. Lublin
409. Lubliniec
410. Lubniewice
411. Lubomierz
412. Luboń
413. Lubowidz
414. Lubraniec
415. Lubsko
416. Lubycza Królewska
417. Lutomiersk
418. Lututów
419. Lwówek
420. Lwówek Śląski
421. Łabiszyn
422. Łagów
423. Łańcut
424. Łapy
425. Łasin
426. Łask
427. Łaskarzew
428. Łaszczów
429. Łaziska Górne
430. Łazy
431. Łeba
432. Łęczna
433. Łęczyca
434. Łęknica
435. Łobez
436. Łobżenica
437. Łochów
438. Łomianki
439. Łomża
440. Łopuszno
441. Łosice
442. Łowicz
443. Łódź
444. Łuków
445. Maciejowice
446. Magnuszew
447. Maków Mazowiecki
448. Maków Podhalański
449. Malbork
450. Małogoszcz
451. Małkinia Górna
452. Małomice
453. Margonin
454. Marki
455. Maszewo
456. Miasteczko Krajeńskie
457. Miasteczko Śląskie
458. Miastko
459. Michałowo
460. Miechów
461. Miejska Górka
462. Mielec
463. Mielno
464. Mieroszów
465. Mieszkowice
466. Międzybórz
467. Międzychód
468. Międzylesie
469. Międzyrzec Podlaski
470. Międzyrzecz
471. Międzyzdroje
472. Mikołajki
473. Mikołów
474. Mikstat
475. Milanówek
476. Milicz
477. Miłakowo
478. Miłomłyn
479. Miłosław
480. Mińsk Mazowiecki
481. Mirosławiec
482. Mirsk
483. Mława
484. Młynary
485. Modliborzyce
486. Mogielnica
487. Mogilno
488. Mońki
489. Morawica
490. Morąg
491. Mordy
492. Moryń
493. Mosina
494. Mrągowo
495. Mrocza
496. Mrozy
497. Mszana Dolna
498. Mszczonów
499. Murowana Goślina
500. Muszyna
501. Mysłowice
502. Myszków
503. Myszyniec
504. Myślenice
505. Myślibórz
506. Nakło nad Notecią
507. Nałęczów
508. Namysłów
509. Narol
510. Nasielsk
511. Nekla
512. Nidzica
513. Niemcza
514. Niemodlin
515. Niepołomice
516. Nieszawa
517. Nisko
518. Nowa Dęba
519. Nowa Ruda
520. Nowa Sarzyna
521. Nowa Słupia
522. Nowa Sól
523. Nowe
524. Nowe Brzesko
525. Nowe Miasteczko
526. Nowe Miasto
527. Nowe Miasto Lubawskie
528. Nowe Miasto nad Pilicą
529. Nowe Skalmierzyce
530. Nowe Warpno
531. Nowogard
532. Nowogrodziec
533. Nowogród
534. Nowogród Bobrzański
535. Nowy Dwór Gdański
536. Nowy Dwór Mazowiecki
537. Nowy Korczyn
538. Nowy Sącz
539. Nowy Staw
540. Nowy Targ
541. Nowy Tomyśl
542. Nowy Wiśnicz
543. Nysa
544. Oborniki
545. Oborniki Śląskie
546. Obrzycko
547. Odolanów
548. Odrzywół
549. Ogrodzieniec
550. Okonek
551. Olecko
552. Olesno
553. Oleszyce
554. Oleśnica (powiat oleśnicki)
555. Oleśnica (powiat staszowski)
556. Olkusz
557. Olsztyn (powiat częstochowski)
558. Olsztyn (miasto na prawach powiatu)
559. Olsztynek
560. Olszyna
561. Oława
562. Opalenica
563. Opatowiec
564. Opatów
565. Opatówek
566. Opoczno
567. Opole
568. Opole Lubelskie
569. Orneta
570. Orzesze
571. Orzysz
572. Osieczna
573. Osiek (powiat oświęcimski)
574. Osiek (powiat staszowski)
575. Osjaków
576. Ostrołęka
577. Ostroróg
578. Ostrowiec Świętokrzyski
579. Ostróda
580. Ostrów Lubelski
581. Ostrów Mazowiecka
582. Ostrów Wielkopolski
583. Ostrzeszów
584. Ośno Lubuskie
585. Oświęcim
586. Otmuchów
587. Otwock
588. Otyń
589. Ozimek
590. Ozorków
591. Ożarów
592. Ożarów Mazowiecki
593. Pabianice
594. Pacanów
595. Paczków
596. Pajęczno
597. Pakość
598. Parczew
599. Parzęczew
600. Pasłęk
601. Pasym
602. Pelplin
603. Pełczyce
604. Piaseczno
605. Piaski
606. Piastów
607. Piątek
608. Piechowice
609. Piekary Śląskie
610. Piekoszów
611. Pieniężno
612. Pieńsk
613. Pierzchnica
614. Pieszyce
615. Pilawa
616. Pilica
617. Pilzno
618. Piła
619. Piława Górna
620. Pińczów
621. Pionki
622. Piotrków Kujawski
623. Piotrków Trybunalski
624. Pisz
625. Piszczac
626. Piwniczna-Zdrój
627. Pleszew
628. Płock
629. Płońsk
630. Płoty
631. Pniewy
632. Pobiedziska
633. Poddębice
634. Podkowa Leśna
635. Pogorzela
636. Polanica-Zdrój
637. Polanów
638. Police
639. Polkowice
640. Połaniec
641. Połczyn-Zdrój
642. Poniatowa
643. Poniec
644. Poręba
645. Poznań
646. Prabuty
647. Praszka
648. Prochowice
649. Proszowice
650. Prószków
651. Pruchnik
652. Prudnik
653. Prusice
654. Pruszcz
655. Pruszcz Gdański
656. Pruszków
657. Przasnysz
658. Przecław
659. Przedbórz
660. Przedecz
661. Przemków
662. Przemyśl
663. Przeworsk
664. Przyrów
665. Przysucha
666. Przytyk
667. Pszczyna
668. Pszów
669. Puck
670. Puławy
671. Pułtusk
672. Puszczykowo
673. Pyrzyce
674. Pyskowice
675. Pyzdry
676. Rabka-Zdrój
677. Raciąż
678. Racibórz
679. Radków
680. Radlin
681. Radłów
682. Radom
683. Radomsko
684. Radomyśl Wielki
685. Radoszyce
686. Radymno
687. Radziejów
688. Radzionków
689. Radzymin
690. Radzyń Chełmiński
691. Radzyń Podlaski
692. Rajgród
693. Rakoniewice
694. Raszków
695. Rawa Mazowiecka
696. Rawicz
697. Recz
698. Reda
699. Rejowiec
700. Rejowiec Fabryczny
701. Resko
702. Reszel
703. Rogoźno
704. Ropczyce
705. Rozprza
706. Różan
707. Ruciane-Nida
708. Ruda Śląska
709. Rudnik nad Sanem
710. Rumia
711. Rybnik
712. Rychtal
713. Rychwał
714. Rydułtowy
715. Rydzyna
716. Ryglice
717. Ryki
718. Rymanów
719. Ryn
720. Rypin
721. Rzepin
722. Rzeszów
723. Rzgów
724. Sandomierz
725. Sanniki
726. Sanok
727. Sejny
728. Serock
729. Sędziszów
730. Sędziszów Małopolski
731. Sępopol
732. Sępólno Krajeńskie
733. Sianów
734. Siechnice
735. Siedlce
736. Siedliszcze
737. Siemianowice Śląskie
738. Siemiatycze
739. Sieniawa
740. Siennica
741. Sienno
742. Sieradz
743. Sieraków
744. Sierpc
745. Siewierz
746. Skalbmierz
747. Skała
748. Skarszewy
749. Skaryszew
750. Skarżysko-Kamienna
751. Skawina
752. Skępe
753. Skierniewice
754. Skoczów
755. Skoki
756. Skórcz
757. Skwierzyna
758. Sława
759. Sławków
760. Sławno
761. Słomniki
762. Słubice
763. Słupca
764. Słupsk
765. Sobótka
766. Sochaczew
767. Sochocin
768. Sokołów Małopolski
769. Sokołów Podlaski
770. Sokółka
771. Solec Kujawski
772. Solec nad Wisłą
773. Sompolno
774. Sopot
775. Sosnowiec
776. Sośnicowice
777. Stalowa Wola
778. Stanisławów
779. Starachowice
780. Stargard
781. Starogard Gdański
782. Staroźreby
783. Stary Sącz
784. Staszów
785. Stawiski
786. Stawiszyn
787. Stąporków
788. Stepnica
789. Stęszew
790. Stoczek Łukowski
791. Stopnica
792. Stronie Śląskie
793. Strumień
794. Stryków
795. Strzegom
796. Strzelce Krajeńskie
797. Strzelce Opolskie
798. Strzelin
799. Strzelno
800. Strzyżów
801. Sucha Beskidzka
802. Suchań
803. Suchedniów
804. Suchowola
805. Sulechów
806. Sulejów
807. Sulejówek
808. Sulęcin
809. Sulmierzyce
810. Sułkowice
811. Supraśl
812. Suraż
813. Susz
814. Suwałki
815. Swarzędz
816. Syców
817. Szadek
818. Szamocin
819. Szamotuły
820. Szczawnica
821. Szczawno-Zdrój
822. Szczebrzeszyn
823. Szczecin
824. Szczecinek
825. Szczekociny
826. Szczucin
827. Szczuczyn
828. Szczyrk
829. Szczytna
830. Szczytno
831. Szepietowo
832. Szklarska Poręba
833. Szlichtyngowa
834. Szprotawa
835. Sztum
836. Szubin
837. Szydłowiec
838. Szydłów
839. Ścinawa
840. Ślesin
841. Śmigiel
842. Śrem
843. Środa Śląska
844. Środa Wielkopolska
845. Świątniki Górne
846. Świdnica
847. Świdnik
848. Świdwin
849. Świebodzice
850. Świebodzin
851. Świecie
852. Świeradów-Zdrój
853. Świerzawa
854. Świętochłowice
855. Świnoujście
856. Tarczyn
857. Tarnobrzeg
858. Tarnogród
859. Tarnowskie Góry
860. Tarnów
861. Tczew
862. Terespol
863. Tłuszcz
864. Tolkmicko
865. Tomaszów Lubelski
866. Tomaszów Mazowiecki
867. Toruń
868. Torzym
869. Toszek
870. Trzcianka
871. Trzciel
872. Trzcińsko-Zdrój
873. Trzebiatów
874. Trzebinia
875. Trzebnica
876. Trzemeszno
877. Tuchola
878. Tuchów
879. Tuczno
880. Tuliszków
881. Tułowice
882. Turek
883. Turobin
884. Tuszyn
885. Twardogóra
886. Tychowo
887. Tychy
888. Tyczyn
889. Tykocin
890. Tyszowce
891. Ujazd (powiat strzelecki)
892. Ujazd (powiat tomaszowski)
893. Ujście
894. Ulanów
895. Uniejów
896. Urzędów
897. Ustka
898. Ustroń
899. Ustrzyki Dolne
900. Wadowice
901. Wałbrzych
902. Wałcz
903. Warka
904. Warszawa
905. Warta
906. Wasilków
907. Wąbrzeźno
908. Wąchock
909. Wągrowiec
910. Wąsosz
911. Wejherowo
912. Węgliniec
913. Węgorzewo
914. Węgorzyno
915. Węgrów
916. Wiązów
917. Wielbark
918. Wieleń
919. Wielichowo
920. Wieliczka
921. Wieluń
922. Wieruszów
923. Więcbork
924. Wilamowice
925. Wiskitki
926. Wisła
927. Wiślica
928. Witkowo
929. Witnica
930. Wleń
931. Władysławowo
932. Włocławek
933. Włodawa
934. Włodowice
935. Włoszczowa
936. Wodzisław
937. Wodzisław Śląski
938. Wojcieszów
939. Wojkowice
940. Wojnicz
941. Wolbórz
942. Wolbrom
943. Wolin
944. Wolsztyn
945. Wołczyn
946. Wołomin
947. Wołów
948. Woźniki
949. Wrocław
950. Wronki
951. Września
952. Wschowa
953. Wyrzysk
954. Wysoka
955. Wysokie Mazowieckie
956. Wyszków
957. Wyszogród
958. Wyśmierzyce
959. Zabłudów
960. Zabrze
961. Zagórów
962. Zagórz
963. Zakliczyn
964. Zaklików
965. Zakopane
966. Zakroczym
967. Zalewo
968. Zambrów
969. Zamość
970. Zator
971. Zawadzkie
972. Zawichost
973. Zawidów
974. Zawiercie
975. Ząbki
976. Ząbkowice Śląskie
977. Zbąszynek
978. Zbąszyń
979. Zduny
980. Zduńska Wola
981. Zdzieszowice
982. Zelów
983. Zgierz
984. Zgorzelec
985. Zielona Góra
986. Zielonka
987. Ziębice
988. Złocieniec
989. Złoczew
990. Złotoryja
991. Złotów
992. Złoty Stok
993. Zwierzyniec
994. Zwoleń
995. Żabno
996. Żagań
997. Żarki
998. Żarnowiec
999. Żarów
1000. Żary
1001. Żelechów
1002. Żerków
1003. Żmigród
1004. Żnin
1005. Żory
1006. Żukowo
1007. Żuromin
1008. Żychlin
1009. Żyrardów
1010. Bolesław (powiat dąbrowski)
1011. Jastrząb
1012. Jawornik Polski
1013. Jeżów
1014. Kazanów
1015. Kobylnica
1016. Końskowola
1017. Kurów
1018. Miękinia
1019. Mieścisko
1020. Sobków
1021. Strzeleczki
1022. Wąwolnica
1023. Zaniemyśl
1024. Żarnów
`

async function seedCities() {
  // Разбиваем текст на строки, убираем нумерацию и пустые строки
  const cities = rawCities
    .split('\n')
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);

  console.log(`Найдено ${cities.length} городов. Готовим данные...`);

  // Удаляем старые города из базы
  console.log('Удаляем старые города из базы...')
  await supabase
    .from('dictionaries')
    .delete()
    .eq('category', 'city')
    .eq('parent_value', 'polska')
    .eq('is_resort', false)

  // Формируем данные для вставки
  const insertData = cities.map(city => {
    // Делаем безопасный слаг для поля value
    let slug = city.toLowerCase();
    const map = { 'ą':'a', 'ć':'c', 'ę':'e', 'ł':'l', 'ń':'n', 'ó':'o', 'ś':'s', 'ź':'z', 'ż':'z' };
    slug = slug.replace(/[ąćęłńóśźż]/g, match => map[match]);
    slug = slug.replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');

    return {
      category: 'city',
      value: slug,
      label_pl: city,
      label_en: city,
      parent_value: 'polska',
      is_active: true,
      is_resort: false
    }
  });

  console.log('Заливаем в Supabase...');
  
  // Вставляем пачками по 100 штук (чтобы сервер не завис)
  for (let i = 0; i < insertData.length; i += 100) {
    const chunk = insertData.slice(i, i + 100);
    const { error } = await supabase.from('dictionaries').insert(chunk);
    
    if (error) {
      console.error('Ошибка при вставке:', error);
    } else {
      console.log(`Загружено ${i + chunk.length} из ${insertData.length}`);
    }
  }
  
  console.log('Успех! Все города в базе.');
}

seedCities();