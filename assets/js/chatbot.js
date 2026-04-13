/* =====================================================
   NK ZAUBERKUNST – CHATBOT
   Kostenloser regelbasierter Assistent für Nicolas Käufer
   ===================================================== */

'use strict';

/* =====================================================
   WISSENSBASIS
   ===================================================== */
const KB = {
  name:        'Nicolas Käufer',
  beruf:       'Zauberkünstler',
  ort:         'Bremerhaven',
  einsatz:     'Deutschlandweit',
  email:       'nicolas@zauberer.jetzt',
  telefon:     '+49 156 78469675',
  instagram:   'https://www.instagram.com/zauberer_nico?igsh=MXZudGdjbmZudHExbQ==',
  buchung:     'https://www.sumupbookings.com/zauberkunstler',
  whatsapp:    'https://wa.me/4915678469675',
  wakanal:     'https://whatsapp.com/channel/0029Va9Gj7Y6LwHoOMuSMP1g',
  preisAb:     '100',
  reisekosten: '0,30',
  zahlung:     ['Kartenzahlung', 'Barzahlung'],
  leistungen:  ['Close-Up Magic', 'Street Magic'],
  zielgruppen: ['Firmen', 'Privatkunden', 'Hochzeiten', 'Geburtstage', 'Stadtfeste', 'Messen'],
  auftritte:   '500+',
};

/* =====================================================
   ANTWORT-DATENBANK
   Jeder Eintrag: { keywords: [...], answer: '...' }
   ===================================================== */
const RESPONSES = [
  // --- Begrüßung ---
  {
    keywords: ['hallo', 'hi', 'hey', 'guten tag', 'guten morgen', 'guten abend', 'moin', 'servus', 'grüß'],
    answer: () => `Hallo! 👋 Schön, dass du da bist. Ich bin der Assistent von **Nicolas Käufer**, Zauberkünstler aus Bremerhaven. Wie kann ich dir helfen?\n\nDu kannst mich z. B. nach Leistungen, Preisen oder einer Buchung fragen.`
  },

  // --- Wer ist Nicolas ---
  {
    keywords: ['wer bist', 'wer ist nicolas', 'wer ist das', 'stell dich vor', 'über nicolas', 'über dich', 'erzähl mir'],
    answer: () => `**Nicolas Käufer** ist ein professioneller Zauberkünstler aus Bremerhaven mit über ${KB.auftritte} Auftritten. Er begeistert Publikum deutschlandweit mit Close-Up Magic und Street Magic – bei Firmenevents, Hochzeiten, Geburtstagen und vielem mehr. 🎩✨`
  },

  // --- Leistungen allgemein ---
  {
    keywords: ['leistung', 'was machst', 'was bietest', 'was kannst', 'was gibt es', 'angebot', 'programm', 'show', 'auftritte', 'was für'],
    answer: () => `Nicolas bietet folgende Leistungen an:\n\n🃏 **Close-Up Magic** – Hautnah und direkt vor euren Augen mit Karten, Münzen und Alltagsgegenständen. Perfekt für Empfänge, Dinner und exklusive Events.\n\n🌆 **Street Magic** – Spontan und mitten unter den Menschen. Ideal für Stadtfeste, Märkte und Outdoor-Events.\n\nBeide Formate sind für Firmen und Privatkunden buchbar – deutschlandweit.`
  },

  // --- Close-Up ---
  {
    keywords: ['close up', 'close-up', 'tischmagie', 'karten', 'münzen', 'nahzauber', 'tisch', 'dinner', 'empfang'],
    answer: () => `**Close-Up Magic** ist Nicolas' Spezialität! 🃏\n\nEr geht von Tisch zu Tisch und verzaubert kleine Gruppen direkt vor ihren Augen – mit Karten, Münzen und alltäglichen Gegenständen. Perfekt für:\n• Firmenempfänge & Galadinner\n• Hochzeiten\n• Exklusive Privatfeiern\n\nMöchtest du direkt buchen? → [Jetzt buchen](${KB.buchung})`
  },

  // --- Street Magic ---
  {
    keywords: ['street magic', 'street', 'straße', 'outdoor', 'stadtfest', 'markt', 'festival', 'spontan'],
    answer: () => `**Street Magic** – Magie mitten im Leben! 🌆\n\nNicolas tritt spontan unter Menschen auf und begeistert Passanten auf Stadtfesten, Märkten und Outdoor-Events. Keine Bühne nötig – die Straße ist seine Bühne.\n\nPerfekt für:\n• Stadtfeste & Straßenfestivals\n• Märkte & Messen\n• Outdoor-Veranstaltungen\n\n[Jetzt buchen](${KB.buchung})`
  },

  // --- Firmen ---
  {
    keywords: ['firma', 'firmen', 'unternehmen', 'betrieb', 'corporate', 'business', 'weihnachtsfeier', 'firmenevent', 'betriebsfeier', 'messe', 'kongress', 'teambuilding', 'galadinner', 'produktpräsentation'],
    answer: () => `Für **Firmenveranstaltungen** ist Nicolas der perfekte Entertainer! 🏢✨\n\nEr sorgt für unvergessliche Momente bei:\n• Weihnachtsfeiern & Firmenjubiläen\n• Messen & Kongresse\n• Galadinner & Empfänge\n• Teambuilding-Events\n• Produktpräsentationen\n\nSeine Auftritte sind professionell, charmant und immer auf eure Veranstaltung abgestimmt.\n\n[Jetzt anfragen](${KB.buchung})`
  },

  // --- Privat ---
  {
    keywords: ['privat', 'hochzeit', 'geburtstag', 'jubiläum', 'taufe', 'familienfeier', 'party', 'feier', 'privatfeier', 'überraschung'],
    answer: () => `Für **Privatveranstaltungen** bringt Nicolas Magie direkt zu euch nach Hause! 🎉\n\nEr begeistert bei:\n• Hochzeiten\n• Geburtstagen & Jubiläen\n• Taufen & Familienfeiern\n• Private Partys\n\nNicolas passt sein Programm immer an das Publikum an – von Kindern bis zu Großeltern ist für jeden etwas dabei.\n\n[Jetzt buchen](${KB.buchung})`
  },

  // --- Preise ---
  {
    keywords: ['preis', 'kosten', 'honorar', 'was kostet', 'wie viel', 'wieviel', 'tarif', 'gebühr', 'bezahlen', 'euro', 'budget'],
    answer: () => `Die Preise starten **ab ca. ${KB.preisAb} €** – je nach Art der Veranstaltung, Dauer und Reiseaufwand. 💰\n\n📍 **Reisekosten:** Für Auftritte außerhalb von Bremerhaven werden ca. **${KB.reisekosten} € pro Kilometer** (An- und Abfahrt) berechnet.\n\n💳 **Zahlung:** Sowohl **Kartenzahlung als auch Barzahlung** sind möglich.\n\nFür ein **individuelles Angebot** einfach anfragen – Antwort innerhalb von 24 Stunden:\n\n📅 [Jetzt anfragen](${KB.buchung})\n📧 [${KB.email}](mailto:${KB.email})\n💬 [WhatsApp](${KB.whatsapp})`
  },

  // --- Zahlung ---
  {
    keywords: ['zahlung', 'zahlen', 'karte', 'kartenzahlung', 'bar', 'barzahlung', 'cash', 'überweisung', 'paypal', 'bezahlen'],
    answer: () => `Kein Problem! Nicolas akzeptiert:\n\n💳 **Kartenzahlung** (EC- & Kreditkarte)\n💵 **Barzahlung**\n\nBeide Optionen sind vor Ort möglich. Bei Fragen zur Abrechnung einfach kurz anfragen:\n\n💬 [WhatsApp](${KB.whatsapp})\n📧 [${KB.email}](mailto:${KB.email})`
  },

  // --- Reisekosten ---
  {
    keywords: ['reisekosten', 'fahrtkosten', 'kilometer', 'anfahrt', 'abfahrt', 'entfernung', 'km', 'fahrt'],
    answer: () => `Für Auftritte **außerhalb von Bremerhaven** werden Reisekosten von ca. **${KB.reisekosten} € pro Kilometer** (An- und Abfahrt) berechnet. 🚗\n\nDie genauen Kosten werden individuell besprochen. Einfach anfragen:\n\n📅 [Jetzt anfragen](${KB.buchung})\n💬 [WhatsApp](${KB.whatsapp})`
  },

  // --- Buchung ---
  {
    keywords: ['buchen', 'buchung', 'anfrage', 'reservieren', 'termin', 'anfragen', 'beauftragen', 'engagieren', 'wie kann ich'],
    answer: () => `Eine Buchung ist ganz einfach! 📅\n\n**Option 1:** Direkt online buchen:\n→ [Buchungsformular öffnen](${KB.buchung})\n\n**Option 2:** Per WhatsApp:\n💬 [Jetzt auf WhatsApp schreiben](${KB.whatsapp})\n\n**Option 3:** Kontakt aufnehmen:\n📧 [${KB.email}](mailto:${KB.email})\n📞 [${KB.telefon}](tel:+4915678469675)\n\nNicolas meldet sich innerhalb von **24 Stunden** mit einem individuellen Angebot.`
  },

  // --- Verfügbarkeit / Vorlaufzeit ---
  {
    keywords: ['verfügbar', 'wann', 'vorlaufzeit', 'kurzfristig', 'wie früh', 'wie weit', 'voraus', 'spontan buchen', 'frei'],
    answer: () => `Für Firmenveranstaltungen und Hochzeiten empfiehlt Nicolas eine Buchung **mindestens 4–8 Wochen im Voraus**.\n\nFür kurzfristige Anfragen ist er aber auch gerne erreichbar – einfach direkt anfragen:\n\n📅 [Jetzt anfragen](${KB.buchung})\n📞 [${KB.telefon}](tel:+4915678469675)`
  },

  // --- Einsatzgebiet ---
  {
    keywords: ['wo', 'wohin', 'reist', 'deutschland', 'deutschlandweit', 'bundesweit', 'hamburg', 'berlin', 'münchen', 'bremen', 'bremerhaven', 'reisekosten', 'entfernung', 'weit'],
    answer: () => `Nicolas ist **deutschlandweit** buchbar! 🗺️\n\nEgal ob Hamburg, Berlin, München, Köln oder Bremerhaven – er reist zu euch. Reisekosten werden individuell besprochen.\n\nEinfach anfragen: [Jetzt buchen](${KB.buchung})`
  },

  // --- Personenanzahl ---
  {
    keywords: ['wie viele', 'personen', 'gäste', 'gruppe', 'groß', 'klein', 'anzahl', 'leute', 'teilnehmer'],
    answer: () => `Nicolas' Close-Up Magic eignet sich ideal für Gruppen von **10 bis 200 Personen**.\n\nFür größere Veranstaltungen bietet er auch mehrere Auftrittsphasen an. Individuelle Absprachen sind immer möglich.\n\n[Jetzt anfragen](${KB.buchung})`
  },

  // --- Dauer ---
  {
    keywords: ['dauer', 'wie lange', 'stunden', 'minuten', 'auftritt', 'zeitraum', 'länge'],
    answer: () => `Die Dauer eines Auftritts richtet sich nach euren Wünschen und der Art der Veranstaltung. Typischerweise:\n\n• **Close-Up Magic:** 1–3 Stunden (Walking Act)\n• **Street Magic:** flexibel, je nach Event\n\nAlles wird individuell abgestimmt. Einfach anfragen:\n📅 [Jetzt buchen](${KB.buchung})`
  },

  // --- Technik / Anforderungen ---
  {
    keywords: ['technik', 'bühne', 'mikrofon', 'licht', 'ton', 'aufbau', 'benötigt', 'braucht', 'voraussetzung', 'anforderung', 'was braucht'],
    answer: () => `Nicolas ist sehr unkompliziert! 🎩\n\n• **Close-Up Magic:** Kein Aufbau nötig – nur etwas Platz zwischen den Gästen.\n• **Street Magic:** Vollständig selbstversorgt, keine Technik erforderlich.\n\nAlle Details werden im Vorfeld besprochen. Einfach anfragen:\n[Jetzt buchen](${KB.buchung})`
  },

  // --- Kinder ---
  {
    keywords: ['kinder', 'kind', 'kindershow', 'familie', 'jugendliche', 'jung', 'alt', 'altersgruppe', 'familienfreundlich'],
    answer: () => `Ja! Nicolas begeistert **alle Altersgruppen** – von Kindern bis zu Großeltern. 🎉\n\nEr passt sein Programm immer an das jeweilige Publikum an. Kinderfreundliche Magie ist natürlich dabei!\n\n[Jetzt buchen](${KB.buchung})`
  },

  // --- Kontakt ---
  {
    keywords: ['kontakt', 'erreichen', 'schreiben', 'email', 'mail', 'telefon', 'anrufen', 'nachricht', 'melden', 'kontaktieren'],
    answer: () => `Du erreichst Nicolas so:\n\n💬 WhatsApp: [Jetzt schreiben](${KB.whatsapp})\n📧 E-Mail: [${KB.email}](mailto:${KB.email})\n📞 Telefon: [${KB.telefon}](tel:+4915678469675)\n📅 Online buchen: [Buchungsformular](${KB.buchung})\n📸 Instagram: [@zauberer_nico](${KB.instagram})\n\nNicolas meldet sich innerhalb von **24 Stunden**!`
  },

  // --- WhatsApp ---
  {
    keywords: ['whatsapp', 'wa', 'chat', 'nachricht schreiben', 'direkt schreiben', 'kanal'],
    answer: () => `Klar! Du kannst Nicolas direkt per WhatsApp erreichen:\n\n💬 [Jetzt auf WhatsApp schreiben](${KB.whatsapp})\n\nOder folge dem **WhatsApp-Kanal** für aktuelle Infos & Einblicke hinter die Kulissen:\n📢 [Kanal folgen](${KB.wakanal})\n\nNicolas antwortet in der Regel sehr schnell! 😊`
  },

  // --- Instagram / Social Media ---
  {
    keywords: ['instagram', 'social media', 'social', 'insta', 'follower', 'fotos', 'videos', '@'],
    answer: () => `Nicolas ist auf Instagram aktiv! 📸\n\n→ [@zauberer_nico](${KB.instagram})\n\nDort findest du Einblicke in seine Auftritte, Tricks und mehr. Schau gerne vorbei!`
  },

  // --- Bewertungen ---
  {
    keywords: ['bewertung', 'rezension', 'erfahrung', 'meinung', 'feedback', 'referenz', 'empfehlung', 'gut', 'zufrieden'],
    answer: () => `Nicolas hat bereits über **${KB.auftritte} Auftritte** absolviert und begeistert sein Publikum immer wieder aufs Neue. 🌟\n\nAuf der Website findest du echte Kundenbewertungen – und du kannst selbst eine hinterlassen!\n\n→ [Zu den Bewertungen](#referenzen)`
  },

  // --- Danke ---
  {
    keywords: ['danke', 'dankeschön', 'super', 'toll', 'klasse', 'prima', 'perfekt', 'top', 'cool', 'nice', 'gut'],
    answer: () => `Sehr gerne! 😊 Wenn du noch weitere Fragen hast, stehe ich jederzeit zur Verfügung. Ich wünsche dir einen zauberhaften Tag! ✨`
  },

  // --- Tschüss ---
  {
    keywords: ['tschüss', 'auf wiedersehen', 'bye', 'ciao', 'bis dann', 'tschau', 'mach\'s gut'],
    answer: () => `Auf Wiedersehen! 👋 Falls du noch Fragen hast, bin ich jederzeit hier. Viel Spaß bei deiner Veranstaltung! ✨`
  },
];

/* Fallback-Antworten (zufällig) */
const FALLBACKS = [
  () => `Das kann ich leider nicht genau beantworten. Für alle Details erreichst du Nicolas direkt:\n\n📧 [${KB.email}](mailto:${KB.email})\n📞 [${KB.telefon}](tel:+4915678469675)\n📅 [Jetzt buchen](${KB.buchung})`,
  () => `Gute Frage! Am besten fragst du Nicolas direkt – er antwortet innerhalb von 24 Stunden:\n\n📧 [${KB.email}](mailto:${KB.email})\n📅 [Buchungsformular](${KB.buchung})`,
  () => `Dafür bin ich leider nicht ausgerüstet 😊 Aber Nicolas hilft dir gerne persönlich weiter:\n\n📞 [${KB.telefon}](tel:+4915678469675)\n📧 [${KB.email}](mailto:${KB.email})`,
];

/* Schnellvorschläge */
const QUICK_SUGGESTIONS = [
  'Was kostet ein Auftritt?',
  'Wie kann ich buchen?',
  'Welche Leistungen gibt es?',
  'Per WhatsApp kontaktieren',
  'Für Firmenevents geeignet?',
];

/* =====================================================
   CHATBOT ENGINE
   ===================================================== */
class NKChatbot {
  constructor() {
    this.isOpen    = false;
    this.hasOpened = false;

    this.widget    = document.getElementById('chatbot-widget');
    this.toggle    = document.getElementById('chatbot-toggle');
    this.window    = document.getElementById('chatbot-window');
    this.messages  = document.getElementById('chatbot-messages');
    this.input     = document.getElementById('chatbot-input');
    this.sendBtn   = document.getElementById('chatbot-send');
    this.closeBtn  = document.getElementById('chatbot-close-btn');
    this.suggestEl = document.getElementById('chatbot-suggestions');
    this.badge     = document.getElementById('chatbot-badge');
    this.iconOpen  = document.getElementById('chatbot-icon-open');
    this.iconClose = document.getElementById('chatbot-icon-close');

    this._bindEvents();
  }

  _bindEvents() {
    this.toggle.addEventListener('click', () => this.toggleChat());
    this.closeBtn.addEventListener('click', () => this.closeChat());
    this.sendBtn.addEventListener('click', () => this._handleSend());
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this._handleSend();
    });
  }

  toggleChat() {
    this.isOpen ? this.closeChat() : this.openChat();
  }

  openChat() {
    this.isOpen = true;
    this.window.classList.add('open');
    this.iconOpen.style.display  = 'none';
    this.iconClose.style.display = 'flex';
    this.badge.classList.add('hidden');

    if (!this.hasOpened) {
      this.hasOpened = true;
      this._showWelcome();
    }
    setTimeout(() => this.input.focus(), 350);
  }

  closeChat() {
    this.isOpen = false;
    this.window.classList.remove('open');
    this.iconOpen.style.display  = 'flex';
    this.iconClose.style.display = 'none';
  }

  _showWelcome() {
    this._addBotMsg(`Hallo! 👋 Ich bin der Assistent von **Nicolas Käufer**.\n\nWie kann ich dir helfen? Du kannst mich nach Leistungen, Preisen, Buchung und mehr fragen!`);
    setTimeout(() => this._renderSuggestions(QUICK_SUGGESTIONS), 600);
  }

  _handleSend() {
    const text = this.input.value.trim();
    if (!text) return;
    this.input.value = '';
    this._addUserMsg(text);
    this.suggestEl.innerHTML = '';
    this._showTyping();
    setTimeout(() => {
      this._removeTyping();
      const answer = this._findAnswer(text);
      this._addBotMsg(answer);
      this._renderSuggestions(this._getFollowUpSuggestions(text));
    }, 700 + Math.random() * 400);
  }

  _findAnswer(text) {
    const lower = text.toLowerCase()
      .replace(/[äöüÄÖÜß]/g, c => ({'ä':'ae','ö':'oe','ü':'ue','Ä':'ae','Ö':'oe','Ü':'ue','ß':'ss'}[c]||c));

    for (const entry of RESPONSES) {
      if (entry.keywords.some(kw => lower.includes(kw))) {
        return entry.answer();
      }
    }
    return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)]();
  }

  _getFollowUpSuggestions(text) {
    const lower = text.toLowerCase();
    if (lower.includes('preis') || lower.includes('kostet')) {
      return ['Wie kann ich buchen?', 'Welche Leistungen gibt es?', 'Kontakt aufnehmen'];
    }
    if (lower.includes('buch') || lower.includes('termin')) {
      return ['Was kostet ein Auftritt?', 'Wie weit im Voraus buchen?', 'Kontakt aufnehmen'];
    }
    if (lower.includes('leistung') || lower.includes('show') || lower.includes('programm')) {
      return ['Was kostet ein Auftritt?', 'Für Firmenevents geeignet?', 'Wie kann ich buchen?'];
    }
    return ['Was kostet ein Auftritt?', 'Wie kann ich buchen?', 'Kontakt aufnehmen'];
  }

  _addUserMsg(text) {
    const div = document.createElement('div');
    div.className = 'chat-msg user';
    div.innerHTML = `<div class="msg-bubble">${this._escape(text)}</div>`;
    this.messages.appendChild(div);
    this._scrollBottom();
  }

  _addBotMsg(text) {
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.innerHTML = `
      <div class="msg-avatar">NK</div>
      <div class="msg-bubble">${this._parseMarkdown(text)}</div>
    `;
    this.messages.appendChild(div);
    this._scrollBottom();
  }

  _showTyping() {
    const div = document.createElement('div');
    div.className = 'chat-msg bot typing-indicator';
    div.id = 'typing-indicator';
    div.innerHTML = `
      <div class="msg-avatar">NK</div>
      <div class="msg-bubble">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    this.messages.appendChild(div);
    this._scrollBottom();
  }

  _removeTyping() {
    const t = document.getElementById('typing-indicator');
    if (t) t.remove();
  }

  _renderSuggestions(chips) {
    this.suggestEl.innerHTML = '';
    chips.forEach(label => {
      const btn = document.createElement('button');
      btn.className = 'suggestion-chip';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        this.input.value = label;
        this._handleSend();
      });
      this.suggestEl.appendChild(btn);
    });
  }

  _scrollBottom() {
    requestAnimationFrame(() => {
      this.messages.scrollTop = this.messages.scrollHeight;
    });
  }

  /* Simple Markdown: **bold**, \n newline, [text](url) links */
  _parseMarkdown(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\[([^\]]+)\]\((#[^\)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\[([^\]]+)\]\((mailto:[^\)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\[([^\]]+)\]\((tel:[^\)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\n/g, '<br>');
  }

  _escape(text) {
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
}

/* =====================================================
   INIT
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  new NKChatbot();
});
