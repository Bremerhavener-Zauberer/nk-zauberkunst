# Anleitung zur Bearbeitung deiner Website

Herzlichen Glückwunsch zu deiner neuen Website! Sie ist nun live und dauerhaft kostenlos über GitHub Pages erreichbar.

**Deine Website-URL:** [https://bremerhavener-zauberer.github.io/nk-zauberkunst/](https://bremerhavener-zauberer.github.io/nk-zauberkunst/)

Da die Website auf deinem eigenen GitHub-Account liegt, hast **nur du** die Kontrolle darüber. Du kannst Texte, Bilder und Links jederzeit selbst anpassen, ohne programmieren zu müssen.

Hier ist eine einfache Schritt-für-Schritt-Anleitung, wie du Änderungen vornimmst.

---

## 1. Texte ändern (z. B. Über mich, Leistungen, Preise)

Alle Texte deiner Website befinden sich in der Datei `index.html`. Keine Sorge, du musst den Code nicht verstehen, um Texte zu ändern.

1. Gehe zu deinem GitHub-Repository: [https://github.com/Bremerhavener-Zauberer/nk-zauberkunst](https://github.com/Bremerhavener-Zauberer/nk-zauberkunst)
2. Klicke auf die Datei **`index.html`**.
3. Klicke oben rechts auf das **Stift-Symbol** (Edit this file).
4. Suche den Text, den du ändern möchtest (Tipp: Nutze `Strg + F` oder `Cmd + F` zum Suchen).
   * *Beispiel:* Suche nach "10+ Jahre Erfahrung" und ändere es in "15+ Jahre Erfahrung".
   * **Wichtig:** Ändere nur den normalen Text zwischen den spitzen Klammern (z. B. `<h3>Dein Text hier</h3>`), lösche keine Klammern `< >`.
5. Wenn du fertig bist, scrolle ganz nach unten.
6. Klicke auf den grünen Button **"Commit changes..."**.
7. Bestätige im Popup-Fenster erneut mit **"Commit changes"**.

Nach ca. 1-2 Minuten ist die Änderung automatisch auf deiner Live-Website sichtbar!

---

## 2. Bilder austauschen

Wenn du eigene Fotos verwenden möchtest (z. B. für die Galerie oder das "Über mich"-Bild), kannst du die aktuellen Bilder einfach überschreiben.

1. Gehe in deinem Repository in den Ordner **`assets`** und dann in **`images`**.
2. Dort siehst du alle Bilder (z. B. `closeup.jpg`, `hypnose.jpg`, `logo.png`).
3. Um ein Bild zu ersetzen, klicke oben rechts auf **"Add file"** und dann auf **"Upload files"**.
4. Wähle dein neues Bild von deinem Computer aus.
   * **Wichtig:** Dein neues Bild muss **exakt denselben Namen** und **dieselbe Dateiendung** haben wie das Bild, das du ersetzen willst (z. B. `closeup.jpg`).
5. Lade das Bild hoch.
6. Scrolle nach unten und klicke auf **"Commit changes"**.

Das alte Bild wird überschrieben und das neue erscheint nach kurzer Zeit auf der Website.

---

## 3. Farben anpassen (Optional)

Falls du das Violett oder andere Farben später ändern möchtest, geht das ganz einfach in der CSS-Datei.

1. Gehe in den Ordner **`assets`** -> **`css`** und öffne die Datei **`style.css`**.
2. Klicke auf das **Stift-Symbol**.
3. Ganz oben in der Datei findest du die Farb-Variablen:
   ```css
   :root {
     --color-primary:     #8b5cf6; /* Das ist das Haupt-Violett */
     --color-primary-light: #a78bfa;
     --color-primary-dark:  #6d28d9;
     /* ... */
   }
   ```
4. Du kannst die sogenannten "Hex-Codes" (z. B. `#8b5cf6`) durch andere Farben ersetzen.
5. Speichere die Änderung mit **"Commit changes"**.

---

## 4. Kontaktformular aktivieren

Das Kontaktformular sieht aktuell nur gut aus, sendet aber noch keine echten E-Mails (dafür bräuchte man einen Server). Da du die Seite kostenlos ohne Server betreibst, empfehle ich dir einen kostenlosen Service wie **Formspree**.

1. Gehe auf [formspree.io](https://formspree.io/) und erstelle einen kostenlosen Account.
2. Erstelle ein neues Formular (New Form) und gib deine E-Mail-Adresse an, an die die Anfragen gesendet werden sollen.
3. Du erhältst einen Link (z. B. `https://formspree.io/f/deine-id`).
4. Gehe in deine `index.html` auf GitHub.
5. Suche nach `<form class="kontakt-form" id="kontaktForm">`.
6. Ändere diese Zeile in:
   `<form class="kontakt-form" action="https://formspree.io/f/deine-id" method="POST">`
7. Speichere die Datei. Ab sofort landen alle Anfragen direkt in deinem E-Mail-Postfach!

---

## Häufige Fragen

**Hilfe, ich habe etwas kaputt gemacht!**
Keine Panik. GitHub speichert jede einzelne Änderung (Versionierung). Du kannst jederzeit auf den Reiter "Commits" klicken und eine alte, funktionierende Version wiederherstellen.

**Warum sehe ich meine Änderungen nicht sofort?**
GitHub Pages braucht nach einem "Commit" meistens 1 bis 3 Minuten, um die Seite neu zu bauen. Lade die Seite nach ein paar Minuten einfach neu (ggf. mit `Strg + F5` oder `Cmd + Shift + R`, um den Browser-Cache zu leeren).

Viel Erfolg mit deiner neuen Website!
