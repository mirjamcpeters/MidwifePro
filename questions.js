// Fragenpool. Flache Struktur, damit sie später leicht aus Markdown/Text importiert
// werden kann (z. B. aus einem Google Doc generiert). Jede Frage: id, topic, type
// ('single' | 'multiple'), text, options[{key, text}], correct[keys], explanation, source.
const QUESTIONS = [
  {
    id: 'q01',
    topic: 'Physiologische Geburt',
    type: 'single',
    text: 'Welche Aussage zur Wehentätigkeit in der Eröffnungsphase ist richtig?',
    options: [
      { key: 'A', text: 'Wehen nehmen in Frequenz und Intensität kontinuierlich ab.' },
      { key: 'B', text: 'Wehen werden in Frequenz, Dauer und Intensität regelmäßig stärker.' },
      { key: 'C', text: 'Wehen bleiben während der gesamten Eröffnungsphase unverändert.' },
      { key: 'D', text: 'Wehen sind in der Frühphase stärker als in der Spätphase.' }
    ],
    correct: ['B'],
    explanation: 'In der Eröffnungsphase kommt es zu einer regelmäßigen Zunahme der Wehen in Frequenz, Dauer und Intensität. Dies führt zur zunehmenden Öffnung des Muttermundes. Am Ende der Eröffnungsphase treten die Wehen typischerweise alle 2–3 Minuten auf und dauern 60–90 Sekunden.',
    source: 'Huch & Dudenhausen, 2020'
  },
  {
    id: 'q02',
    topic: 'Physiologische Geburt',
    type: 'single',
    text: 'In welcher Reihenfolge laufen die vier Geburtsphasen ab?',
    options: [
      { key: 'A', text: 'Eröffnungsphase – Austreibungsphase – Übergangsphase – Nachgeburtsphase' },
      { key: 'B', text: 'Eröffnungsphase – Übergangsphase – Austreibungsphase – Nachgeburtsphase' },
      { key: 'C', text: 'Übergangsphase – Eröffnungsphase – Austreibungsphase – Nachgeburtsphase' },
      { key: 'D', text: 'Austreibungsphase – Eröffnungsphase – Übergangsphase – Nachgeburtsphase' }
    ],
    correct: ['B'],
    explanation: 'Auf die Eröffnungsphase (Muttermundseröffnung) folgt die Übergangsphase (vollständige Eröffnung bis zum Pressdrang), dann die Austreibungsphase (Geburt des Kindes) und zuletzt die Nachgeburtsphase (Ausstoßung der Plazenta).',
    source: 'Mändle & Opitz-Kreuter, Das Hebammenbuch, 2015'
  },
  {
    id: 'q03',
    topic: 'Neugeborenenbeurteilung',
    type: 'multiple',
    text: 'Welche Kriterien fließen in den APGAR-Score ein?',
    options: [
      { key: 'A', text: 'Herzfrequenz' },
      { key: 'B', text: 'Atmung' },
      { key: 'C', text: 'Muttermundsweite' },
      { key: 'D', text: 'Hautfarbe' }
    ],
    correct: ['A', 'B', 'D'],
    explanation: 'Der APGAR-Score bewertet Herzfrequenz, Atmung, Muskeltonus, Reflexe und Hautfarbe je nach 1, 5 und 10 Minuten. Die Muttermundsweite gehört nicht dazu, sie beschreibt den Geburtsfortschritt der Mutter.',
    source: 'Schneider, Husslein & Schneider, Die Geburtshilfe, 2016'
  },
  {
    id: 'q04',
    topic: 'Nachgeburtsphase',
    type: 'single',
    text: 'Woran erkennt man typischerweise die vollständige Ablösung der Plazenta?',
    options: [
      { key: 'A', text: 'Der Fundus steigt an und die Nabelschnur verlängert sich sichtbar vor der Vulva.' },
      { key: 'B', text: 'Die Herzfrequenz der Mutter sinkt deutlich ab.' },
      { key: 'C', text: 'Der Muttermund verengt sich vollständig.' },
      { key: 'D', text: 'Es tritt kein Blutverlust mehr auf.' }
    ],
    correct: ['A'],
    explanation: 'Anzeichen der Plazentalösung sind unter anderem ein Fundusanstieg, eine sichtbare Verlängerung der Nabelschnur vor der Vulva und eine kurze Lösungsblutung.',
    source: 'Mändle & Opitz-Kreuter, Das Hebammenbuch, 2015'
  },
  {
    id: 'q05',
    topic: 'Eröffnungsphase',
    type: 'multiple',
    text: 'Welche Anzeichen sprechen für den Beginn der Eröffnungsphase?',
    options: [
      { key: 'A', text: 'Regelmäßige, muttermundswirksame Wehen' },
      { key: 'B', text: 'Blasensprung' },
      { key: 'C', text: 'Übelkeit im ersten Trimester' },
      { key: 'D', text: 'Zunehmende Muttermundseröffnung' }
    ],
    correct: ['A', 'D'],
    explanation: 'Der Beginn der Eröffnungsphase zeigt sich an regelmäßigen, muttermundswirksamen Wehen und einer zunehmenden Muttermundseröffnung. Ein Blasensprung kann vorkommen, ist aber kein zwingendes Kriterium.',
    source: 'Schwarz & Stahl, Hebammenkunde, 2019'
  },
  {
    id: 'q06',
    topic: 'Übergangsphase',
    type: 'single',
    text: 'Wie wird die Übergangsphase (Transition) definiert?',
    options: [
      { key: 'A', text: 'Vom Blasensprung bis zur vollständigen Muttermundseröffnung' },
      { key: 'B', text: 'Von der vollständigen Muttermundseröffnung bis zum einsetzenden Pressdrang' },
      { key: 'C', text: 'Von der Geburt des Kindes bis zur Plazentageburt' },
      { key: 'D', text: 'Von den ersten Vorwehen bis zur regelmäßigen Wehentätigkeit' }
    ],
    correct: ['B'],
    explanation: 'Die Übergangsphase beginnt mit der vollständigen Muttermundseröffnung (10 cm) und endet mit dem Einsetzen des spontanen Pressdrangs. Sie gilt oft als besonders intensiv erlebte, aber kurze Phase.',
    source: 'Mändle & Opitz-Kreuter, Das Hebammenbuch, 2015'
  },
  {
    id: 'q07',
    topic: 'Austreibungsphase',
    type: 'single',
    text: 'Was kennzeichnet den physiologischen Pressdrang in der Austreibungsphase?',
    options: [
      { key: 'A', text: 'Er wird durch den Druck des vorangehenden Teils auf den Beckenboden ausgelöst.' },
      { key: 'B', text: 'Er tritt unabhängig von der Wehentätigkeit auf.' },
      { key: 'C', text: 'Er setzt bereits bei 5 cm Muttermundsweite ein.' },
      { key: 'D', text: 'Er wird ausschließlich willentlich gesteuert.' }
    ],
    correct: ['A'],
    explanation: 'Der spontane Pressdrang entsteht durch den Druck des vorangehenden Kindsteils auf Beckenboden, Rektum und Vagina (Ferguson-Reflex). Er ist reflektorisch und tritt typischerweise erst nach vollständiger Muttermundseröffnung auf.',
    source: 'Schneider, Husslein & Schneider, Die Geburtshilfe, 2016'
  },
  {
    id: 'q08',
    topic: 'Austreibungsphase',
    type: 'single',
    text: 'Was versteht man unter dem Dammschutz während der Geburt?',
    options: [
      { key: 'A', text: 'Das Anlegen eines Dammschnitts vor jeder Geburt' },
      { key: 'B', text: 'Die manuelle Unterstützung des Dammgewebes, um ein unkontrolliertes Einreißen zu vermeiden' },
      { key: 'C', text: 'Die medikamentöse Entspannung der Beckenbodenmuskulatur' },
      { key: 'D', text: 'Das Abwarten der Geburt ausschließlich in Rückenlage' }
    ],
    correct: ['B'],
    explanation: 'Beim Dammschutz unterstützt die Hebamme mit den Händen das Dammgewebe während des Kopfdurchtritts, um ein kontrolliertes, langsames Austreten zu ermöglichen und Verletzungen zu minimieren.',
    source: 'Mändle & Opitz-Kreuter, Das Hebammenbuch, 2015'
  },
  {
    id: 'q09',
    topic: 'Nachgeburtsphase',
    type: 'single',
    text: 'Wie hoch ist der physiologische Blutverlust bei einer vaginalen Geburt in der Regel?',
    options: [
      { key: 'A', text: 'Bis etwa 200 ml' },
      { key: 'B', text: 'Bis etwa 500 ml' },
      { key: 'C', text: 'Bis etwa 1000 ml' },
      { key: 'D', text: 'Bis etwa 1500 ml' }
    ],
    correct: ['B'],
    explanation: 'Ein Blutverlust von bis zu 500 ml gilt bei einer vaginalen Geburt als physiologisch. Ab 500 ml spricht man von einer postpartalen Hämorrhagie, die einer besonderen Beobachtung und ggf. Intervention bedarf.',
    source: 'Schneider, Husslein & Schneider, Die Geburtshilfe, 2016'
  },
  {
    id: 'q10',
    topic: 'Wehentätigkeit',
    type: 'multiple',
    text: 'Welche Wehenarten treten physiologischerweise vor und während der Geburt auf?',
    options: [
      { key: 'A', text: 'Senkwehen' },
      { key: 'B', text: 'Eröffnungswehen' },
      { key: 'C', text: 'Presswehen' },
      { key: 'D', text: 'Regelblutungswehen' }
    ],
    correct: ['A', 'B', 'C'],
    explanation: 'Senkwehen treten bereits vor der eigentlichen Geburt auf und bewirken das Tiefertreten des Kindes. Eröffnungswehen führen zur Muttermundseröffnung, Presswehen unterstützen die Austreibung. "Regelblutungswehen" existieren als Begriff nicht.',
    source: 'Schwarz & Stahl, Hebammenkunde, 2019'
  },
  {
    id: 'q11',
    topic: 'Eröffnungsphase',
    type: 'single',
    text: 'Was beschreibt der Begriff "Blasensprung"?',
    options: [
      { key: 'A', text: 'Das Platzen der Fruchtblase mit Abgang von Fruchtwasser' },
      { key: 'B', text: 'Das erste Auftreten von regelmäßigen Wehen' },
      { key: 'C', text: 'Den Zeitpunkt der vollständigen Muttermundseröffnung' },
      { key: 'D', text: 'Das Tiefertreten des Kopfes ins Becken' }
    ],
    correct: ['A'],
    explanation: 'Beim Blasensprung reißt die Fruchtblase und Fruchtwasser tritt ab. Er kann vor Wehenbeginn (vorzeitiger Blasensprung), während der Eröffnungsphase (frühzeitiger Blasensprung) oder erst bei vollständiger Eröffnung (rechtzeitiger Blasensprung) auftreten.',
    source: 'Mändle & Opitz-Kreuter, Das Hebammenbuch, 2015'
  },
  {
    id: 'q12',
    topic: 'Neugeborenenbeurteilung',
    type: 'single',
    text: 'Zu welchen Zeitpunkten wird der APGAR-Score standardmäßig erhoben?',
    options: [
      { key: 'A', text: 'Nach 1, 5 und 10 Minuten' },
      { key: 'B', text: 'Nach 2, 4 und 6 Minuten' },
      { key: 'C', text: 'Nur einmal, direkt nach der Geburt' },
      { key: 'D', text: 'Nach 5, 10 und 15 Minuten' }
    ],
    correct: ['A'],
    explanation: 'Der APGAR-Score wird standardmäßig 1, 5 und 10 Minuten nach der Geburt erhoben, um die Anpassung des Neugeborenen an das extrauterine Leben im Verlauf zu beurteilen.',
    source: 'Schneider, Husslein & Schneider, Die Geburtshilfe, 2016'
  },
  {
    id: 'q13',
    topic: 'Austreibungsphase',
    type: 'single',
    text: 'Wie wird der Vorgang bezeichnet, bei dem sich der kindliche Kopf beim Durchtritt durch das Becken der jeweiligen Beckenebene anpasst?',
    options: [
      { key: 'A', text: 'Kindsbewegung' },
      { key: 'B', text: 'Einstellung und Haltung' },
      { key: 'C', text: 'Plazentalösung' },
      { key: 'D', text: 'Nachgeburtsperiode' }
    ],
    correct: ['B'],
    explanation: 'Einstellung beschreibt die Beziehung des vorangehenden Kindsteils zum mütterlichen Becken, Haltung die Beziehung der kindlichen Körperteile zueinander (z. B. Beugehaltung). Beides passt sich während des Durchtritts den Beckenebenen an (Kardinalbewegungen).',
    source: 'Mändle & Opitz-Kreuter, Das Hebammenbuch, 2015'
  },
  {
    id: 'q14',
    topic: 'Nachgeburtsphase',
    type: 'single',
    text: 'Was ist der Vorteil des "Late Cord Clamping" (verzögertes Abnabeln)?',
    options: [
      { key: 'A', text: 'Es verringert das Risiko einer Nabelschnurumschlingung.' },
      { key: 'B', text: 'Es ermöglicht einen zusätzlichen plazentaren Blutübertritt zum Neugeborenen und verbessert die Eisenspeicher.' },
      { key: 'C', text: 'Es beschleunigt die Plazentalösung.' },
      { key: 'D', text: 'Es senkt den mütterlichen Blutverlust.' }
    ],
    correct: ['B'],
    explanation: 'Beim verzögerten Abnabeln (meist 1–3 Minuten nach der Geburt oder bis das Pulsieren aufhört) fließt zusätzliches plazentares Blut zum Kind, was die Eisenspeicher und den Hämatokrit in den ersten Lebensmonaten verbessern kann.',
    source: 'WHO-Empfehlung / Schneider, Husslein & Schneider, Die Geburtshilfe, 2016'
  },
  {
    id: 'q15',
    topic: 'Wehentätigkeit',
    type: 'single',
    text: 'Wie werden Nachwehen in den Tagen nach der Geburt am ehesten erklärt?',
    options: [
      { key: 'A', text: 'Als Zeichen einer beginnenden Infektion' },
      { key: 'B', text: 'Als Kontraktionen der Gebärmutter im Rahmen der Rückbildung (Involution)' },
      { key: 'C', text: 'Als erneut einsetzende Eröffnungswehen' },
      { key: 'D', text: 'Als Ausdruck eines zu niedrigen Blutdrucks' }
    ],
    correct: ['B'],
    explanation: 'Nachwehen sind Kontraktionen der Gebärmutter, die zur Rückbildung (Involution) des Uterus nach der Geburt beitragen. Sie sind bei Mehrgebärenden und beim Stillen (Oxytocinausschüttung) häufig stärker ausgeprägt.',
    source: 'Mändle & Opitz-Kreuter, Das Hebammenbuch, 2015'
  },
  {
    id: 'q16',
    topic: 'Eröffnungsphase',
    type: 'single',
    text: 'Was beschreibt der Begriff "Muttermundsrand"?',
    options: [
      { key: 'A', text: 'Den äußeren Muttermund vor der Schwangerschaft' },
      { key: 'B', text: 'Den tastbaren, verbliebenen Rand des Muttermunds kurz vor vollständiger Eröffnung' },
      { key: 'C', text: 'Den Übergang von der Vagina zur Vulva' },
      { key: 'D', text: 'Die Naht nach einem Dammschnitt' }
    ],
    correct: ['B'],
    explanation: 'Als Muttermundsrand bezeichnet man den schmalen, noch tastbaren Restrand des Muttermunds kurz vor der vollständigen Eröffnung (10 cm). Dieser Zustand wird bei der vaginalen Untersuchung dokumentiert.',
    source: 'Schwarz & Stahl, Hebammenkunde, 2019'
  },
  {
    id: 'q17',
    topic: 'Physiologische Geburt',
    type: 'multiple',
    text: 'Welche Maßnahmen unterstützen physiologischerweise den Geburtsverlauf und werden von Hebammen aktiv gefördert?',
    options: [
      { key: 'A', text: 'Freie Bewegung und Positionswechsel der Gebärenden' },
      { key: 'B', text: 'Kontinuierliche 1:1-Betreuung durch die Hebamme' },
      { key: 'C', text: 'Routinemäßige Einleitung bei jeder Geburt' },
      { key: 'D', text: 'Eine ruhige, vertraute Geburtsumgebung' }
    ],
    correct: ['A', 'B', 'D'],
    explanation: 'Freie Bewegung, kontinuierliche persönliche Betreuung und eine ruhige, vertraute Umgebung fördern nachweislich einen physiologischen Geburtsverlauf. Eine routinemäßige Einleitung ist keine physiologische, sondern eine medizinische Intervention und nur bei Indikation angezeigt.',
    source: 'Schwarz & Stahl, Hebammenkunde, 2019'
  },
  {
    id: 'q18',
    topic: 'Austreibungsphase',
    type: 'single',
    text: 'Welche kindliche Herztonveränderung gilt während einer Wehe typischerweise als unauffällig?',
    options: [
      { key: 'A', text: 'Eine kurze, sich rasch erholende Dezeleration synchron zur Wehe (frühe Dezeleration)' },
      { key: 'B', text: 'Eine späte Dezeleration nach Wehenende ohne Erholung' },
      { key: 'C', text: 'Eine anhaltende Bradykardie über mehrere Minuten' },
      { key: 'D', text: 'Ein völliger Verlust der Herzfrequenzvariabilität' }
    ],
    correct: ['A'],
    explanation: 'Frühe, kopfkompressionsbedingte Dezelerationen, die synchron zur Wehe auftreten und sich rasch wieder erholen, gelten als unauffällig. Späte Dezelerationen, anhaltende Bradykardien oder fehlende Variabilität sind Warnzeichen für eine mögliche fetale Beeinträchtigung.',
    source: 'Schneider, Husslein & Schneider, Die Geburtshilfe, 2016'
  },
  {
    id: 'q19',
    topic: 'Nachgeburtsphase',
    type: 'single',
    text: 'Was wird bei der Kontrolle der Plazenta nach der Geburt routinemäßig überprüft?',
    options: [
      { key: 'A', text: 'Nur das Gewicht der Plazenta' },
      { key: 'B', text: 'Vollständigkeit von Plazenta und Eihäuten sowie die Nabelschnurgefäße' },
      { key: 'C', text: 'Ausschließlich die Farbe der Nabelschnur' },
      { key: 'D', text: 'Die Blutgruppe des Kindes' }
    ],
    correct: ['B'],
    explanation: 'Nach der Geburt wird die Plazenta auf Vollständigkeit (mütterliche und kindliche Seite, Eihäute) sowie die Anzahl der Nabelschnurgefäße (normalerweise zwei Arterien, eine Vene) untersucht, um Rückschlüsse auf mögliche Plazentareste im Uterus zu ziehen.',
    source: 'Mändle & Opitz-Kreuter, Das Hebammenbuch, 2015'
  },
  {
    id: 'q20',
    topic: 'Physiologische Geburt',
    type: 'single',
    text: 'Wie wird der Fundusstand unmittelbar nach der Plazentageburt physiologischerweise beurteilt?',
    options: [
      { key: 'A', text: 'Der Fundus sollte deutlich oberhalb des Nabels und weich tastbar sein.' },
      { key: 'B', text: 'Der Fundus sollte etwa auf Nabelhöhe und gut kontrahiert, derb tastbar sein.' },
      { key: 'C', text: 'Der Fundus ist zu diesem Zeitpunkt nicht mehr tastbar.' },
      { key: 'D', text: 'Der Fundus sollte deutlich unterhalb der Symphyse liegen.' }
    ],
    correct: ['B'],
    explanation: 'Direkt nach der Plazentageburt sollte der Uterusfundus etwa auf Nabelhöhe stehen und sich derb, gut kontrahiert anfühlen. Ein weicher, schlecht kontrahierter Fundus ist ein Warnzeichen für eine Uterusatonie und erhöhte Blutungsgefahr.',
    source: 'Schneider, Husslein & Schneider, Die Geburtshilfe, 2016'
  }
];
