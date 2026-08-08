(function () {
  'use strict';

  var STORAGE_KEY = 'midwifepro:v1';
  var QUESTIONS_PER_DAY = 5;
  var AUTO_ADVANCE_DELAY = 350;

  var ICONS = {
    clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    back: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>',
    arrowRight: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    check: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.5h5a3 3 0 013 3v12a2.5 2.5 0 00-2.5-2.5H3z"/><path d="M21 4.5h-5a3 3 0 00-3 3v12a2.5 2.5 0 012.5-2.5H21z"/><path d="M5 8h3M5 11h3M5 14h3" stroke-width="1.1"/><path d="M16 8h3M16 11h3M16 14h3" stroke-width="1.1"/></svg>',
    target: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>',
    sprout: '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 21c-3.6 0-6.5-2.6-6.5-6 0-2.6 1.6-4.6 3-6.6.3 2 1.3 3 2.3 3-.6-2.6.7-4.7 2.6-6.5.4 2.4-.2 4.1 1.1 5.7.8-.7 1.3-1.9 1.3-3.1 1.8 2 2.7 4.8 2.7 7.5 0 3.4-2.9 6-6.5 6z" fill="currentColor"/></svg>',
    checkmark: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12l5 5L20 7"/></svg>',
    cross: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    lightbulb: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.5.4.8 1 .8 1.6v.5h5.4v-.5c0-.6.3-1.2.8-1.6A6 6 0 0012 3z"/></svg>',
    book: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5c3-1.5 6-1.5 8 0 2-1.5 5-1.5 8 0v13c-3-1.5-6-1.5-8 0-2-1.5-5-1.5-8 0V5z"/></svg>',
    chevronRight: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>'
  };

  // ---------- Datum-Hilfsfunktionen ----------
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function isYesterday(dateStr, refToday) {
    var d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    var next = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    return next === refToday;
  }

  // ---------- Persistenz ----------
  function loadState() {
    var raw = null;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    var state = raw ? JSON.parse(raw) : null;
    if (!state) {
      state = {
        progress: {},
        streakDays: 0,
        lastCompletedDate: null,
        screen: 'start',
        session: null
      };
    }
    // Sitzung vom Vortag ist ungültig -> zurück zum Start
    if (state.session && state.session.date !== todayStr()) {
      state.session = null;
      state.screen = 'start';
    }
    return state;
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  var state = loadState();

  // ---------- Fachlogik: Fragenauswahl ----------
  function weightFor(qid) {
    var p = state.progress[qid];
    var streak = p ? p.correctStreak : 0;
    if (streak >= 3) return 0;
    if (streak === 2) return 1;
    return 3;
  }

  function weightedSample(pool, n) {
    var items = pool.map(function (q) { return { q: q, w: weightFor(q.id) }; });
    var result = [];
    while (result.length < n && items.length) {
      var total = items.reduce(function (s, it) { return s + it.w; }, 0);
      var r = Math.random() * total;
      var idx = 0;
      for (; idx < items.length; idx++) {
        r -= items[idx].w;
        if (r <= 0) break;
      }
      if (idx >= items.length) idx = items.length - 1;
      result.push(items[idx].q);
      items.splice(idx, 1);
    }
    return result;
  }

  function pickDailyQuestionIds() {
    var pool = QUESTIONS.filter(function (q) { return weightFor(q.id) > 0; });
    var picks = weightedSample(pool, QUESTIONS_PER_DAY);
    if (picks.length < QUESTIONS_PER_DAY) {
      var pickedIds = {};
      picks.forEach(function (q) { pickedIds[q.id] = true; });
      var remaining = QUESTIONS.filter(function (q) { return !pickedIds[q.id]; });
      remaining.sort(function () { return Math.random() - 0.5; });
      for (var i = 0; i < remaining.length && picks.length < QUESTIONS_PER_DAY; i++) {
        picks.push(remaining[i]);
      }
    }
    return picks.map(function (q) { return q.id; });
  }

  function questionById(id) {
    for (var i = 0; i < QUESTIONS.length; i++) if (QUESTIONS[i].id === id) return QUESTIONS[i];
    return null;
  }

  // ---------- Lifetime-Statistik ----------
  function lifetimeStats() {
    var answered = 0, correct = 0, distinct = 0;
    Object.keys(state.progress).forEach(function (id) {
      var p = state.progress[id];
      if (p.timesAnswered > 0) distinct++;
      answered += p.timesAnswered;
      correct += p.timesCorrect;
    });
    var pct = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    return { distinct: distinct, total: QUESTIONS.length, pct: pct };
  }

  // ---------- Aktionen ----------
  var Actions = {
    startLearning: function () {
      // Jeder Klick auf "Lerneinheit starten" beginnt eine frische Runde mit 5 neu gezogenen
      // Fragen - so sind auch mehrere Lerneinheiten am selben Tag möglich. Die Lernserie
      // (finalizeDay) zählt trotzdem nur einmal pro Kalendertag.
      state.session = { date: todayStr(), questionIds: pickDailyQuestionIds(), index: 0, selected: [], results: [] };
      state.screen = 'question';
      saveState();
      render();
    },
    goStart: function () {
      state.screen = 'start';
      saveState();
      render();
    },
    restart: function () {
      state.screen = 'start';
      saveState();
      render();
    },
    selectOption: function (key) {
      var s = state.session;
      var q = questionById(s.questionIds[s.index]);
      if (q.type === 'single') {
        if (s.selected.length) return;
        s.selected = [key];
        saveState();
        render();
        setTimeout(function () { Actions.submitAnswer(); }, AUTO_ADVANCE_DELAY);
      } else {
        var pos = s.selected.indexOf(key);
        if (pos >= 0) s.selected.splice(pos, 1); else s.selected.push(key);
        saveState();
        render();
      }
    },
    submitAnswer: function () {
      var s = state.session;
      var q = questionById(s.questionIds[s.index]);
      var sel = s.selected.slice().sort();
      var exp = q.correct.slice().sort();
      var correct = sel.length === exp.length && sel.every(function (k, i) { return k === exp[i]; });

      var p = state.progress[q.id] || { correctStreak: 0, timesAnswered: 0, timesCorrect: 0 };
      p.timesAnswered += 1;
      if (correct) { p.timesCorrect += 1; p.correctStreak = Math.min(p.correctStreak + 1, 3); }
      else { p.correctStreak = 0; }
      state.progress[q.id] = p;

      s.results.push(correct);
      state.screen = 'feedback';
      saveState();
      render();
    },
    checkAnswer: function () {
      var s = state.session;
      if (!s.selected.length) return;
      Actions.submitAnswer();
    },
    skipQuestion: function () {
      var s = state.session;
      s.results.push(false);
      s.selected = [];
      var next = s.index + 1;
      if (next < s.questionIds.length) {
        s.index = next;
        state.screen = 'question';
      } else {
        finalizeDay();
        state.screen = 'complete';
      }
      saveState();
      render();
    },
    nextQuestion: function () {
      var s = state.session;
      var next = s.index + 1;
      if (next < s.questionIds.length) {
        s.index = next;
        s.selected = [];
        state.screen = 'question';
      } else {
        finalizeDay();
        state.screen = 'complete';
      }
      saveState();
      render();
    }
  };
  window.App = Actions;

  function finalizeDay() {
    var today = todayStr();
    if (state.lastCompletedDate === today) return;
    if (state.lastCompletedDate && isYesterday(state.lastCompletedDate, today)) {
      state.streakDays += 1;
    } else {
      state.streakDays = 1;
    }
    state.lastCompletedDate = today;
  }

  // ---------- Rendering ----------
  var root = document.getElementById('app');

  function render() {
    if (state.screen === 'question' || state.screen === 'feedback') {
      root.innerHTML = renderQuestionOrFeedback();
    } else if (state.screen === 'complete') {
      root.innerHTML = renderComplete();
    } else {
      root.innerHTML = renderStart();
    }
  }

  function renderStart() {
    var stats = lifetimeStats();
    var circumference = 289.0;
    var ringOffset = circumference - (stats.pct / 100) * circumference;
    var topic = QUESTIONS[0] ? QUESTIONS[0].topic : '';

    return (
      '<div class="screen">' +
        '<div class="header-row"><div class="brand">MidwifePro</div></div>' +
        '<h1 class="greeting-title">Schön,<br/>dass du da bist.</h1>' +
        '<div class="greeting-sub">Bereit für 5 Minuten Lernen?</div>' +
        '<div class="start-card">' +
          '<div class="start-card-title">5 Fragen<br/>warten auf dich.</div>' +
          '<div class="start-meta">' + ICONS.clock + '<span>ca. 5 Minuten</span><span class="dot"></span><span>' + topic + '</span></div>' +
          '<button class="btn-primary" onclick="App.startLearning()"><span>Lerneinheit starten</span>' + ICONS.arrowRight + '</button>' +
        '</div>' +
        '<div class="stats-row">' +
          '<div class="ring-wrap"><div class="ring-box">' +
            '<svg width="104" height="104" viewBox="0 0 104 104" style="transform:rotate(-90deg);">' +
              '<circle cx="52" cy="52" r="46" fill="none" stroke="var(--line)" stroke-width="6"/>' +
              '<circle cx="52" cy="52" r="46" fill="none" stroke="var(--teal)" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + circumference + '" stroke-dashoffset="' + ringOffset + '"/>' +
            '</svg>' +
            '<div class="ring-center"><div class="ring-value">' + stats.pct + '%</div><div class="ring-label">Trefferquote</div></div>' +
          '</div></div>' +
          '<div class="vdivider"></div>' +
          '<div class="stats-list">' +
            '<div class="stat-item"><div class="stat-icon" style="color:var(--teal);">' + ICONS.check + '</div><div><div class="stat-value">' + stats.distinct + ' / ' + stats.total + '</div><div class="stat-label">Fragen beantwortet</div></div></div>' +
            '<div class="stat-divider"></div>' +
            '<div class="stat-item"><div class="stat-icon" style="color:var(--teal);">' + ICONS.target + '</div><div><div class="stat-value">' + stats.pct + ' %</div><div class="stat-label">Trefferquote</div></div></div>' +
            '<div class="stat-divider"></div>' +
            '<div class="stat-item"><div class="stat-icon" style="color:var(--teal);">' + ICONS.sprout + '</div><div><div class="stat-value">' + state.streakDays + '</div><div class="stat-label">Tage Lernserie</div></div></div>' +
          '</div>' +
        '</div>' +
        '<div class="footer-note">Evidenz. Beziehung. Befähigung.</div>' +
      '</div>'
    );
  }

  function renderQuestionOrFeedback() {
    var s = state.session;
    var q = questionById(s.questionIds[s.index]);
    var total = s.questionIds.length;
    var isSingle = q.type === 'single';
    var isFeedback = state.screen === 'feedback';
    var radius = isSingle ? 'round' : 'square';

    var answeredCount = s.index + (isFeedback ? 1 : 0);
    var progressPct = Math.round((answeredCount / total) * 100);

    var html = '<div class="screen">';
    html += '<div class="header-row with-back"><button class="icon-btn" onclick="App.goStart()">' + ICONS.back + '</button><div class="brand">MidwifePro</div></div>';
    html += '<div class="progress-meta"><span>Frage ' + (s.index + 1) + ' von ' + total + '</span><span class="eta">' + ICONS.clock + 'ca. 1 Min.</span></div>';
    html += '<div class="progress-track"><div class="progress-fill" style="width:' + progressPct + '%;"></div></div>';

    if (!isFeedback) {
      html += '<div class="q-topic">' + q.topic + '</div>';
      html += '<div class="q-text">' + q.text + '</div>';
      html += '<div class="q-instruction">' + (isSingle ? 'Wähle die zutreffende Antwort.' : 'Wähle die zutreffenden Antworten.') + '</div>';
      html += '<div class="options">';
      q.options.forEach(function (o) {
        var isSel = s.selected.indexOf(o.key) >= 0;
        html += '<button class="option-card' + (isSel ? ' selected' : '') + '" onclick="App.selectOption(\'' + o.key + '\')">' +
          '<div class="badge ' + radius + (isSel ? ' on' : '') + '">' + o.key + '</div>' +
          '<div class="option-text">' + o.text + '</div>' +
        '</button>';
      });
      html += '</div>';
      html += '<div class="question-footer">';
      if (!isSingle) {
        var canCheck = s.selected.length > 0;
        html += '<button class="btn-primary" ' + (canCheck ? '' : 'disabled') + ' onclick="App.checkAnswer()"><span>Antwort überprüfen</span>' + ICONS.arrowRight + '</button>';
      }
      html += '<button class="skip-link" onclick="App.skipQuestion()">Frage überspringen</button>';
      html += '</div>';
    } else {
      var lastCorrect = s.results[s.results.length - 1];
      var optByKey = function (k) { for (var i = 0; i < q.options.length; i++) if (q.options[i].key === k) return q.options[i]; return null; };

      html += '<div class="feedback-center">';
      html += '<div class="feedback-icon-wrap ' + (lastCorrect ? 'ok' : 'no') + '">' + (lastCorrect ? ICONS.checkmark : ICONS.cross) + '</div>';
      html += '<div class="feedback-headline ' + (lastCorrect ? 'ok' : 'no') + '">' + (lastCorrect ? 'Richtig!' : 'Noch nicht richtig.') + '</div>';
      html += '</div>';

      html += '<div class="feedback-body">';

      html += s.selected.map(function (k, i) {
        var right = q.correct.indexOf(k) >= 0;
        var opt = optByKey(k);
        var cls = right ? 'ok' : 'no';
        var badgeRadius = isSingle ? 'round' : 'square';
        var card = '<div class="answer-card ' + cls + '">';
        if (i === 0) card += '<div class="answer-card-label ' + cls + '">Deine Antwort</div>';
        card += '<div class="answer-card-row"><div class="badge ' + badgeRadius + ' ' + (right ? 'on-correct' : 'on-wrong') + '">' + k + '</div><div class="option-text">' + opt.text + '</div></div>';
        card += '</div>';
        return card;
      }).join('');

      if (!lastCorrect) {
        var missing = q.correct.filter(function (k) { return s.selected.indexOf(k) < 0; });
        html += missing.map(function (k, i) {
          var opt = optByKey(k);
          var badgeRadius = isSingle ? 'round' : 'square';
          var card = '<div class="answer-card ok">';
          if (i === 0) card += '<div class="answer-card-label ok">Richtige Antwort</div>';
          card += '<div class="answer-card-row"><div class="badge ' + badgeRadius + ' on-correct">' + k + '</div><div class="option-text">' + opt.text + '</div></div>';
          card += '</div>';
          return card;
        }).join('');
      }

      html += '<div class="explanation-row"><div class="explanation-icon" style="color:var(--teal);">' + ICONS.lightbulb + '</div><div class="explanation-text">' + q.explanation + '</div></div>';
      html += '<div class="source-row" style="color:var(--teal);">' + ICONS.book + '<span>Quelle: ' + q.source + '</span></div>';

      html += '</div>';

      var nextLabel = (s.index + 1 < total) ? 'Nächste Frage' : 'Ergebnis ansehen';
      html += '<div class="feedback-footer"><button class="btn-primary" onclick="App.nextQuestion()"><span>' + nextLabel + '</span>' + ICONS.arrowRight + '</button></div>';
    }

    html += '</div>';
    return html;
  }

  function renderConfetti(count) {
    var colors = ['var(--teal)', 'var(--orange)', 'var(--line)', 'var(--teal-dark)', 'var(--orange-dark)'];
    var pieces = '';
    for (var i = 0; i < count; i++) {
      var angle = (i / count) * Math.PI * 2 + (i % 2 ? 0.18 : -0.18);
      var distance = 46 + ((i * 37) % 40);
      var dx = Math.round(Math.cos(angle) * distance);
      var dy = Math.round(Math.sin(angle) * distance) - 10;
      var rot = ((i * 53) % 70) - 35;
      var isRound = i % 3 === 0;
      var size = isRound ? (6 + (i % 3)) : 5;
      var w = isRound ? size : 5 + (i % 2) * 2;
      var h = isRound ? size : 9 + (i % 3);
      var color = colors[i % colors.length];
      var delay = ((i * 47) % 260) / 1000;
      var duration = 0.95 + ((i * 31) % 45) / 100;
      pieces += '<div class="confetti-piece" style="width:' + w + 'px;height:' + h + 'px;background:' + color + ';' +
        (isRound ? 'border-radius:50%;' : '') +
        '--cf-dx:' + dx + 'px;--cf-dy:' + dy + 'px;--cf-rot:' + rot + 'deg;--cf-delay:' + delay + 's;--cf-duration:' + duration + 's;"></div>';
    }
    return pieces;
  }

  function renderComplete() {
    var s = state.session;
    var total = s.questionIds.length;
    var correctCount = s.results.filter(Boolean).length;
    var resultPct = total ? Math.round((correctCount / total) * 100) : 0;
    var resultCircumference = 201.1;
    var resultRingOffset = resultCircumference - (resultPct / 100) * resultCircumference;

    return (
      '<div class="screen">' +
        '<div class="complete-header"><div class="brand">MidwifePro</div></div>' +
        '<div class="complete-center">' +
          '<div class="confetti-badge">' +
            '<div class="confetti-circle" style="color:var(--teal);">' + ICONS.checkmark + '</div>' +
            renderConfetti(22) +
          '</div>' +
          '<div class="complete-title">Gut gemacht!</div>' +
          '<div class="complete-sub">Du hast deine Lerneinheit für heute abgeschlossen.</div>' +
        '</div>' +
        '<div class="result-card">' +
          '<div class="result-card-title">Deine Ergebnisse</div>' +
          '<div class="result-row">' +
            '<div class="result-ring-box"><svg width="76" height="76" viewBox="0 0 76 76" style="transform:rotate(-90deg);">' +
              '<circle cx="38" cy="38" r="32" fill="none" stroke="var(--line)" stroke-width="5"/>' +
              '<circle cx="38" cy="38" r="32" fill="none" stroke="var(--teal)" stroke-width="5" stroke-linecap="round" stroke-dasharray="' + resultCircumference + '" stroke-dashoffset="' + resultRingOffset + '"/>' +
            '</svg><div class="result-ring-center"><div class="result-ring-value">' + resultPct + '%</div><div class="result-ring-label">Trefferquote</div></div></div>' +
            '<div class="vdivider" style="align-self:stretch;"></div>' +
            '<div class="result-block"><div class="result-block-value">' + correctCount + '/' + total + '</div><div class="result-block-label">Fragen richtig beantwortet</div></div>' +
            '<div class="vdivider" style="align-self:stretch;"></div>' +
            '<div class="result-block" style="color:var(--teal);">' + ICONS.sprout + '<div class="result-block-value-sm">' + state.streakDays + ' Tage</div><div class="result-block-label">Lernserie</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="encourage-card"><div class="encourage-text">Jeden Tag ein kleines Stück besser.<br/>Du machst einen Unterschied.</div></div>' +
        '<div class="complete-footer"><button class="btn-primary" onclick="App.restart()"><span>Zurück zum Start</span>' + ICONS.arrowRight + '</button></div>' +
      '</div>'
    );
  }

  render();
})();
