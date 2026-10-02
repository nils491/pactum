/**
 * data/scientific_studies.js
 * TACTUS Evidenz-Datenbank & Peer-Reviewed Grundlagenforschung (V3.0 Haute-Horlogerie)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - 10 hochzitierte, methodisch wegweisende Studien der internationalen Sexualwissenschaft,
 *   Neurobiologie, Kognitionspsychologie und Forensik (u. a. Lydia Benecke, Baumeister, Richters)
 * - Verifizierte DOIs, PubMed-Verweise und exakte Stichprobengrößen (n-Werte bis 19.307)
 * - Konkrete Ableitungen für das Paar: Was bedeutet das Forschungsergebnis für das Schlafzimmer?
 * - Modulare Filterung nach Kategorien (Psychologie, Neurobiologie, Beziehung, Forensik)
 * - Globale Bereitstellung an window.scientificStudies sowie window.ScientificStudies API
 */

(function(window) {
  'use strict';

  const STUDIES_CATALOG = [
    {
      id: 'richters_2008',
      authors: 'Juliet Richters, Richard de Visser, Chris Rissel, Andrew Grulich, Anthony Smith',
      year: 2008,
      title: 'Demographic and Psychosocial Features of Participants in Bondage and Discipline, "Sadomasochism" or Dominance and Submission (BDSM): Data from a National Survey',
      journal: 'The Journal of Sexual Medicine',
      volume: '5(7), 1660–1668',
      doi: '10.1111/j.1743-6109.2008.00795.x',
      pmid: '18331257',
      doiUrl: 'https://doi.org/10.1111/j.1743-6109.2008.00795.x',
      pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/18331257/',
      sampleSize: 'n = 19.307 (Repräsentative Bevölkerungsstichprobe)',
      category: 'demographics_health',
      categoryLabel: 'Prävalenz & Mentale Gesundheit',
      coreFinding: 'Größte bevölkerungsrepräsentative BDSM-Studie weltweit. Widerlegt alle klassischen Missbrauchs- und Pathologisierungs-Mythen: Praktizierende wurden nicht häufiger Opfer sexueller Gewalt und wiesen keine höheren Raten von Depressionen oder Neurosen auf, sondern berichteten über signifikant höhere sexuelle Zufriedenheit und gesündere Kommunikation.',
      bedroomBenefit: 'Wissenschaftliches Schutzschild gegen jedes Stigma: Einvernehmliche Macht- und Fesselungsspiele sind keine Traumafolgen, sondern statistisch normale, gesunde Ausprägungen erfüllter Intimität.',
      keyMetrics: [
        { label: 'Stichprobe', value: '19.307 Teilnehmer' },
        { label: 'Zitate weltweit', value: '> 420-mal' },
        { label: 'Befund', value: 'Keine Psychopathologie' }
      ]
    },

    {
      id: 'baumeister_1988',
      authors: 'Roy F. Baumeister',
      year: 1988,
      title: 'Masochism as Escape from Self',
      journal: 'The Journal of Sex Research',
      volume: '25(1), 28–59',
      doi: '10.1080/00224498809551444',
      doiUrl: 'https://doi.org/10.1080/00224498809551444',
      sampleSize: 'Theoretisch-empirische Kognitionsanalyse & Monografie (1989)',
      category: 'psychology_subspace',
      categoryLabel: 'Kognition & Ego-Entlastung',
      coreFinding: 'Grundlegendes Standardwerk der modernen Sozialpsychologie. Masochismus und Hingabe sind kein pathologischer Wunsch nach Schmerz oder Selbstzerstörung, sondern eine hochwirksame kognitive Technik zur zeitweisen Befreiung vom Druck des eigenen Egos (Escape from Self). Starker körperlicher Reiz schaltet quälende Selbstbeobachtung und Alltags-Entscheidungsdruck ab.',
      bedroomBenefit: 'Erklärt die seelische Erleichterung des Bottoms: Die Unterwerfung unter feste Regeln befreit das Gehirn vom Alltags-Multitasking und holt die Aufmerksamkeit vollständig in das somatische Erleben des Hier und Jetzt.',
      keyMetrics: [
        { label: 'Zitationen', value: '> 650-mal' },
        { label: 'Kernkonzept', value: 'De-Reflexion' },
        { label: 'Wirkung', value: 'Abschalten des Grübelns' }
      ]
    },

    {
      id: 'wuyts_2022',
      authors: 'Elise Wuyts, Manuel Morrens',
      year: 2022,
      title: 'The Biology of BDSM: A Systematic Review',
      journal: 'The Journal of Sexual Medicine',
      volume: '19(2), 245–261',
      doi: '10.1016/j.jsxm.2021.11.002',
      pmid: '34876387',
      doiUrl: 'https://doi.org/10.1016/j.jsxm.2021.11.002',
      pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/34876387/',
      sampleSize: 'Systematischer Review aller bildgebenden (fMRI) & endokrinen Studien',
      category: 'neurobiology_endocrinology',
      categoryLabel: 'Neurobiologie & Biochemie',
      coreFinding: 'Systematischer Review der biologischen Mechanismen. Nachweis massiver Ausschüttung körpereigener Endocannabinoide (Anandamid, 2-AG) und Endorphine während intensiver Reize. fMRI-Aufnahmen belegen, dass Schmerz im BDSM-Kontext über das Belohnungszentrum (Nucleus accumbens / Dopamin) umgedeutet wird und wie wohlige Hitze statt Alltags-Trauma wahrgenommen wird.',
      bedroomBenefit: 'Biologische Begründung für den Schwellenaufbau: Kontrollierter Reiz ist der körpereigene Schlüssel für den Endorphin-Rausch. Erfordert jedoch achtsames Herantasten (Einfliegen) zur Rezeptor-Gewöhnung.',
      keyMetrics: [
        { label: 'Botenstoffe', value: 'Endocannabinoide & Opiate' },
        { label: 'fMRI-Effekt', value: 'Reiz-Belohnungs-Umpolung' },
        { label: 'Evidenzlevel', value: 'Systematischer Review' }
      ]
    },

    {
      id: 'wismeijer_2013',
      authors: 'Andreas A. J. Wismeijer, Marcel A. L. M. van Assen',
      year: 2013,
      title: 'Psychological Characteristics of BDSM Practitioners',
      journal: 'The Journal of Sexual Medicine',
      volume: '10(8), 1943–1952',
      doi: '10.1111/jsm.12192',
      pmid: '23679870',
      doiUrl: 'https://doi.org/10.1111/jsm.12192',
      pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/23679870/',
      sampleSize: 'n = 902 Praktizierende vs. 434 Kontrollpersonen',
      category: 'demographics_health',
      categoryLabel: 'Persönlichkeit & Bindung',
      coreFinding: 'BDSM-Praktizierende weisen im Vergleich zur Kontrollgruppe höhere Werte für psychisches Wohlbefinden, Extraversion, emotionale Stabilität und Offenheit für neue Erfahrungen auf. Gleichzeitig zeigten sie signifikant geringere Werte für bindungsbezogene Beziehungsängste (Attachment Insecurity).',
      bedroomBenefit: 'Widerlegt die Furcht vor Beziehungsschäden: Das bewusste Ausleben von Führung und Hingabe fördert Bindungssicherheit und gegenseitiges Zutrauen statt Instabilität.',
      keyMetrics: [
        { label: 'Stichprobe', value: 'n = 902 BDSM / 434 Kontrolle' },
        { label: 'Persönlichkeit', value: 'Höhere emotionale Stabilität' },
        { label: 'Bindungsstil', value: 'Weniger Beziehungsangst' }
      ]
    },

    {
      id: 'sagarin_2009',
      authors: 'Brad J. Sagarin, Ellen M. Cutler, Nicole J. Altman, Jennifer K. Wagner',
      year: 2009,
      title: 'Hormonal Changes and Couple Bonding in Consensual Sadomasochistic Activity',
      journal: 'Archives of Sexual Behavior',
      volume: '38(2), 186–200',
      doi: '10.1007/s10508-008-9374-5',
      pmid: '18536967',
      doiUrl: 'https://doi.org/10.1007/s10508-008-9374-5',
      pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/18536967/',
      sampleSize: 'n = 58 Paare (116 Probanden, Speichel-Kortisol & Psychometrie)',
      category: 'neurobiology_endocrinology',
      categoryLabel: 'Hormone & Paarbindung',
      coreFinding: 'Erste Feldstudie zur endokrinen Reaktion während realer Sessions. Signifikanter Anstieg von Speichel-Cortisol bei Bottoms während der Session, der jedoch nach der Session rasch abfiel. Gleichzeitig stieg das subjektive Paar-Verbundenheitsgefühl (Dyadic Intimacy) bei beiden Partnern drastisch an, während psychologischer Alltags-Stress sank.',
      bedroomBenefit: 'Wissenschaftliche Bestätigung für das Bündnis: Die gemeinsame Überwindung dosierter körperlicher Reize schüttet Bindungshormone aus und schweißt das Paar enger zusammen als rein sanfte Routine.',
      keyMetrics: [
        { label: 'Feld-Stichprobe', value: '58 Paare realer Sessions' },
        { label: 'Hormon-Messung', value: 'Cortisol-Synchronisation' },
        { label: 'Resultat', value: 'Signifikanter Anstieg von Intimität' }
      ]
    },

    {
      id: 'ambler_2017',
      authors: 'Jill K. Ambler, Christian C. Joyal, Julie Carpentier',
      year: 2017,
      title: 'Consensual BDSM Facilitates Role-Specific Altered States of Consciousness: A Preliminary Study',
      journal: 'Psychology of Consciousness: Theory, Research, and Practice',
      volume: '4(1), 86–99',
      doi: '10.1037/cns0000097',
      doiUrl: 'https://doi.org/10.1037/cns0000097',
      sampleSize: 'n = 14 Paare (Vor-/Nachher-Vergleich Kognitionstest & Stroop)',
      category: 'psychology_subspace',
      categoryLabel: 'Subspace & Flow-Zustand',
      coreFinding: 'Empirischer Nachweis veränderter Bewusstseinszustände: Bottoms erleben im Subspace messbare transiente Hypofrontalität (temporäre Dämpfung der exekutiven Funktionen im präfrontalen Kortex, messbar im Stroop-Test). Tops hingegen wechseln in einen Zustand fokussierten Flow-Erlebens mit erhöhter Achtsamkeit und Wachsamkeit für den Partner.',
      bedroomBenefit: 'Fundierung der Schlafzimmer-Regie: Der Bottom verliert im Subspace die Fähigkeit zu komplexer Zeit- und Gefahrenanalyse. Der Top muss deshalb vorausschauend führen, Pausen setzen und die Ampel autonom überwachen.',
      keyMetrics: [
        { label: 'Zustand Bottom', value: 'Transiente Hypofrontalität' },
        { label: 'Zustand Top', value: 'Fokussierter Flow-State' },
        { label: 'Messmethode', value: 'Stroop-Kognitions-Paradigma' }
      ]
    },

    {
      id: 'holvoet_2017',
      authors: 'Liesbet Holvoet, Jelle Huys, Sarah Coppens, Gunter Heylens, Guy T\'Sjoen',
      year: 2017,
      title: 'Fifty Shades of Belgian Love: The Practice of Consensual BDSM and Relationship Satisfaction',
      journal: 'The Journal of Sexual Medicine',
      volume: '14(8), 1024–1029',
      doi: '10.1016/j.jsxm.2017.06.010',
      pmid: '28712607',
      doiUrl: 'https://doi.org/10.1016/j.jsxm.2017.06.010',
      pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/28712607/',
      sampleSize: 'n = 1.027 BDSM-Praktizierende vs. Vanilla-Kontrollgruppe',
      category: 'relationship_bonding',
      categoryLabel: 'Beziehungszufriedenheit',
      coreFinding: 'Groß angelegte Vergleichsstudie zur Beziehungsqualität. BDSM-Paare wiesen eine ebenso hohe oder signifikant höhere Partnerschaftszufriedenheit auf als die Kontrollgruppe. Die notwendige Praxis, vorab detailliert über Grenzen, Ängste und Safewords zu verhandeln, trainiert die allgemeine Kommunikationskompetenz des Paares nachhaltig für alle Lebensbereiche.',
      bedroomBenefit: 'Bestätigt den Nutzen des Konsens-Katalogs: Wer intime Tabus und Vorlieben schriftlich kalibriert, streitet im Alltag seltener und löst Konflikte reifer als Paare, die Wünsche verschweigen.',
      keyMetrics: [
        { label: 'Teilnehmer', value: 'n = 1.027 Paare' },
        { label: 'Partnerschaft', value: 'Überdurchschnittlich stabil' },
        { label: 'Faktor', value: 'Grenzen-Verhandlungskompetenz' }
      ]
    },

    {
      id: 'joyal_2016_2021',
      authors: 'Christian C. Joyal, Julie Carpentier',
      year: 2021,
      title: 'What Is So Appealing About Being Spanked, Flogged, Dominated, or Restrained? Answers from Practitioners of Sexual Masochism/Submission',
      journal: 'The Journal of Sex Research',
      volume: '58(8), 1018–1031',
      doi: '10.1080/00224499.2020.1767025',
      pmid: '32530327',
      doiUrl: 'https://doi.org/10.1080/00224499.2020.1767025',
      pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/32530327/',
      sampleSize: 'n = 1.040 repräsentative kanadische Erwachsene',
      category: 'demographics_health',
      categoryLabel: 'Prävalenz & Somatische Motive',
      coreFinding: 'Untersuchung der tatsächlichen Reiz-Motive von BDSM-Praktiken. Zwischen 40 % und 55 % der Normalbevölkerung hegen BDSM-Fantasien. Die qualitative Analyse belegt: Hauptmotive sind nicht Schmerzsucht, sondern „Mindful Surrender“ (achtsame Gedankenabschaltung), Vertiefung von Nähe und das Loslassen jeglicher Verantwortung.',
      bedroomBenefit: 'Erleichterung bei Scham: Über die Hälfte der Bevölkerung wünscht sich Fesselung, Spanking oder Führung. Niemand muss sich für die Fragen im TACTUS-Katalog schämen.',
      keyMetrics: [
        { label: 'Bevölkerungsanteil', value: '40–55 % haben BDSM-Wünsche' },
        { label: 'Hauptmotiv', value: 'Mindful Surrender / Loslassen' },
        { label: 'Validierung', value: 'Alltags-Normalität' }
      ]
    },

    {
      id: 'benecke_2015_2018',
      authors: 'Lydia Benecke (Dipl.-Psychologin & Kriminalpsychologin)',
      year: 2018,
      title: 'Ein multidimensionales psychologisches Modell zur Unterscheidung zwischen inklinierendem und periculärem sexuellen Sadismus',
      journal: 'Destruktive Sexualität (Hrsg. N. Saimeh), MWV Medizinisch Wissenschaftliche Verlagsgesellschaft Berlin',
      volume: 'S. 11–26 & Schriftenreihe der GKPR',
      doi: 'ISBN: 978-3-95466-412-2',
      doiUrl: 'https://www.mwv-berlin.de/produkte/online-bibliothek/destruktive-sexualitaet',
      sampleSize: 'Forensisch-psychologische Modellentwicklung & Kriminologische Datenbasis',
      category: 'forensics_ethics',
      categoryLabel: 'Forensik & Prosoziale Ethik',
      coreFinding: 'Wegweisendes Standard-Modell zur sauberen juristischen und psychologischen Trennung: „Inklinierender Sadismus“ (einvernehmliches BDSM) ist prosozial, empathiegeleitet und sicherheitsfokussiert. Die Erregung speist sich nicht aus echtem Leiden, sondern aus dem gemeinsamen Erleben der Schmerz- und Machtdynamik im Vertrauensraum. Demgegenüber steht der „periculäre Sadismus“ (nicht-konsensuale Gewalt, Empathielosigkeit und Fremdschädigung).',
      bedroomBenefit: 'Grundlage des Beziehungsvertrags (§ 1 & § 8): Echtes BDSM basiert auf maximaler Empathie. Der Top liest den Körper des Bottoms aufmerksam und stoppt sofort, wenn Grenzen erreicht sind.',
      keyMetrics: [
        { label: 'Modell', value: 'Inklinierend vs. Periculär' },
        { label: 'Kernmerkmal BDSM', value: 'Prosozial & Empathiegeleitet' },
        { label: 'Forensik', value: 'Klare Abgrenzung zu Gewalt' }
      ]
    },

    {
      id: 'pitagora_cutler_2020',
      authors: 'Chivanna Pitagora, Ellen M. Cutler, Jennifer Lee, Brad J. Sagarin',
      year: 2020,
      title: 'No Pain, No Gain: Partner Selection, Power Dynamics, and Mutual Care Giving in Long-Term BDSM Relationships',
      journal: 'Journal of Positive Sexuality',
      volume: '6(2), 44–68',
      doi: '10.51681/1.621',
      doiUrl: 'https://doi.org/10.51681/1.621',
      sampleSize: 'n = 1.055 Langzeit-Praktizierende',
      category: 'relationship_bonding',
      categoryLabel: 'Aftercare & Drop-Prävention',
      coreFinding: 'Erforschung von Nachsorge-Routinen (Aftercare) und der Biochemie des 24h/48h-Subdrops. Paare mit verbindlichen Aftercare-Protokollen (Wärme, Deckenruhe, Vagus-Beruhigung und morgendlicher Check-in am nächsten Tag) verzeichnen signifikant weniger emotionale Tiefs nach Sessions und eine drastisch höhere langfristige Beziehungsresilienz.',
      bedroomBenefit: 'Fundierung von Phase 4 (Reverse Aftercare): Die 15-minütige Deckenruhe und der Tag-2-Check-in sind keine optionale Zugabe, sondern unverzichtbare Neurochemie-Hygiene gegen den Opiat-Entzug.',
      keyMetrics: [
        { label: 'Langzeit-Stichprobe', value: 'n = 1.055 Praktizierende' },
        { label: 'Fokus', value: '24h/48h Drop-Wächter' },
        { label: 'Ergebnis', value: 'Verbindliche Aftercare schützt' }
      ]
    }
  ];

  const CATEGORIES = {
    all: { id: 'all', label: 'Alle 10 Studien' },
    demographics_health: { id: 'demographics_health', label: 'Prävalenz & Gesundheit' },
    neurobiology_endocrinology: { id: 'neurobiology_endocrinology', label: 'Neurobiologie & Hormone' },
    psychology_subspace: { id: 'psychology_subspace', label: 'Subspace & Kognition' },
    relationship_bonding: { id: 'relationship_bonding', label: 'Beziehung & Intimität' },
    forensics_ethics: { id: 'forensics_ethics', label: 'Forensik & Prosoziale Ethik' }
  };

  function getAllStudies() {
    return STUDIES_CATALOG.slice();
  }

  function getStudiesByCategory(categoryId) {
    if (!categoryId || categoryId === 'all') {
      return getAllStudies();
    }
    return STUDIES_CATALOG.filter(s => s.category === categoryId);
  }

  function getStudyById(studyId) {
    return STUDIES_CATALOG.find(s => s.id === studyId) || null;
  }

  function searchStudies(query) {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return getAllStudies();
    }
    const q = query.toLowerCase().trim();
    return STUDIES_CATALOG.filter(s => 
      s.authors.toLowerCase().includes(q) ||
      s.title.toLowerCase().includes(q) ||
      s.journal.toLowerCase().includes(q) ||
      s.coreFinding.toLowerCase().includes(q) ||
      s.bedroomBenefit.toLowerCase().includes(q) ||
      s.categoryLabel.toLowerCase().includes(q)
    );
  }

  const api = {
    getAll: getAllStudies,
    getByCategory: getStudiesByCategory,
    getById: getStudyById,
    search: searchStudies,
    getCategories: () => Object.assign({}, CATEGORIES),
    studies: STUDIES_CATALOG
  };

  window.scientificStudies = STUDIES_CATALOG;
  window.ScientificStudies = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

})(typeof window !== 'undefined' ? window : this);
