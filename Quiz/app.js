/**
 * Quiz Master - Application Logic
 */

const app = {
    state: {
        currentView: 'home',
        currentQuiz: {
            title: '',
            sections: [] // { title: '', questions: [] }
        },
        playing: {
            mode: 'instant',
            currentIndex: 0, // Flattened index for all questions
            flattenedQuestions: [], // [{ sectionTitle, sectionIndex, questionIndex, ...qData }]
            answers: [],
            isFinished: false
        }
    },

    init() {
        this.bindEvents();
        this.loadFromLocalStorage();
        this.renderRecentQuizzes();
    },

    bindEvents() {
        document.getElementById('nav-home').addEventListener('click', () => this.showView('home'));
        document.getElementById('nav-editor').addEventListener('click', () => this.showView('editor'));
        document.getElementById('nav-player').addEventListener('click', () => this.showView('player'));

        document.getElementById('add-section').addEventListener('click', () => this.addSectionUI());
        document.getElementById('save-quiz').addEventListener('click', () => this.saveQuiz());
        document.getElementById('clear-editor').addEventListener('click', () => this.clearEditor());

        document.getElementById('start-quiz').addEventListener('click', () => this.startQuiz());
        document.getElementById('submit-answer').addEventListener('click', () => this.submitAnswer());
        document.getElementById('next-question').addEventListener('click', () => this.nextQuestion());
        document.getElementById('finish-quiz').addEventListener('click', () => this.showResults());

        document.getElementById('file-loader').addEventListener('change', (e) => this.handleFileLoad(e));
        document.getElementById('download-report').addEventListener('click', () => this.downloadReport());
    },

    showView(viewName) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(`view-${viewName}`).classList.add('active');
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        const navBtn = document.getElementById(`nav-${viewName}`);
        if (navBtn) navBtn.classList.add('active');
        this.state.currentView = viewName;

        const totalQuestions = this.getFlattenedQuestions().length;
        if (viewName === 'player' && totalQuestions === 0) {
            document.getElementById('player-setup').innerHTML = `
                <h2>問題がありません</h2>
                <p>先に問題を作成するか、読み込んでください。</p>
                <button class="btn primary" onclick="app.showView('editor')">作成画面へ</button>
            `;
        }
    },

    // --- Editor Logic ---
    addSectionUI(data = null) {
        const container = document.getElementById('section-editor-list');
        const template = document.getElementById('tpl-section-editor');
        const clone = template.content.cloneNode(true);
        const sItem = clone.querySelector('.section-item');
        const sectionId = data?.id || Date.now() + Math.random();
        sItem.dataset.id = sectionId;

        const titleInput = sItem.querySelector('.s-title');
        const qListContainer = sItem.querySelector('.s-questions-list');

        if (data) {
            titleInput.value = data.title;
            data.questions.forEach(q => this.addQuestionUI(qListContainer, q));
        }

        sItem.querySelector('.add-q-to-s').addEventListener('click', () => this.addQuestionUI(qListContainer));
        sItem.querySelector('.delete-s').addEventListener('click', () => sItem.remove());

        container.appendChild(clone);
    },

    addQuestionUI(container, data = null) {
        const template = document.getElementById('tpl-question-editor');
        const clone = template.content.cloneNode(true);
        const qItem = clone.querySelector('.question-item');
        qItem.dataset.id = data?.id || Date.now() + Math.random();

        const typeSelect = qItem.querySelector('.q-type');
        const optList = qItem.querySelector('.options-list');
        const addOptBtn = qItem.querySelector('.add-option');
        const shortAnsEditor = qItem.querySelector('.short-answer-editor');
        const correctAnsInput = qItem.querySelector('.q-correct-answer');

        const updateTypeUI = (type) => {
            if (type === 'descriptive') {
                optList.style.display = 'none';
                addOptBtn.style.display = 'none';
                shortAnsEditor.style.display = 'block';
            } else {
                optList.style.display = 'block';
                addOptBtn.style.display = 'block';
                shortAnsEditor.style.display = 'none';
            }
        };

        typeSelect.addEventListener('change', (e) => updateTypeUI(e.target.value));

        if (data) {
            qItem.querySelector('.q-text').value = data.text;
            typeSelect.value = data.type || 'single';
            qItem.querySelector('.q-points').value = data.points;
            qItem.querySelector('.q-explanation').value = data.explanation || '';
            updateTypeUI(data.type);

            if (data.type === 'descriptive') {
                correctAnsInput.value = Array.isArray(data.correctAnswer) ? data.correctAnswer.join(', ') : (data.correctAnswer || '');
            } else {
                if (data.options) {
                    data.options.forEach(opt => this.addOptionUI(optList, opt));
                }
            }
        } else {
            this.addOptionUI(optList);
            this.addOptionUI(optList);
        }

        qItem.querySelector('.add-option').addEventListener('click', () => this.addOptionUI(optList));
        qItem.querySelector('.delete-q').addEventListener('click', () => qItem.remove());

        container.appendChild(clone);
    },

    addOptionUI(container, data = null) {
        const template = document.getElementById('tpl-option-editor');
        const clone = template.content.cloneNode(true);
        const optItem = clone.querySelector('.option-item');
        if (data) {
            optItem.querySelector('.option-text').value = data.text;
            optItem.querySelector('.is-correct').checked = data.isCorrect;
        }
        optItem.querySelector('.delete-option').addEventListener('click', () => optItem.remove());
        container.appendChild(clone);
    },

    saveQuiz() {
        const title = document.getElementById('quiz-title').value.trim();
        if (!title) return this.toast('タイトルを入力してください');

        const sectionElements = document.querySelectorAll('.section-item');
        const sections = [];

        for (const sEl of sectionElements) {
            const sTitle = sEl.querySelector('.s-title').value.trim();
            const questions = [];
            const qElements = sEl.querySelectorAll('.question-item');

            for (const qEl of qElements) {
                const text = qEl.querySelector('.q-text').value.trim();
                const type = qEl.querySelector('.q-type').value;
                const points = parseInt(qEl.querySelector('.q-points').value) || 0;
                const explanation = qEl.querySelector('.q-explanation').value.trim();

                if (!text) continue;

                if (type === 'descriptive') {
                    const ansStr = qEl.querySelector('.q-correct-answer').value.trim();
                    if (!ansStr) continue;
                    const correctAnswer = ansStr.split(',').map(s => s.trim()).filter(s => s !== '');

                    questions.push({
                        id: qEl.dataset.id, text, type, points, explanation, correctAnswer
                    });
                } else {
                    const options = [];
                    qEl.querySelectorAll('.option-item').forEach(optEl => {
                        options.push({
                            text: optEl.querySelector('.option-text').value.trim(),
                            isCorrect: optEl.querySelector('.is-correct').checked
                        });
                    });
                    if (options.length === 0) continue;
                    questions.push({
                        id: qEl.dataset.id, text, type, points, explanation, options
                    });
                }
            }

            if (questions.length > 0) {
                sections.push({ title: sTitle || 'Untitled Section', questions });
            }
        }

        if (sections.length === 0) return this.toast('問題を少なくとも1つ作成してください');

        this.state.currentQuiz = { title, sections };
        const blob = new Blob([JSON.stringify(this.state.currentQuiz, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.json`;
        a.click();

        this.toast('保存しました！');
        this.saveToLocalStorage();
        this.renderRecentQuizzes();
    },

    clearEditor() {
        if (confirm('入力をすべてクリアしますか？')) {
            document.getElementById('quiz-title').value = '';
            document.getElementById('section-editor-list').innerHTML = '';
        }
    },

    // --- Player Logic ---
    startQuiz() {
        const flattened = this.getFlattenedQuestions();
        if (flattened.length === 0) return this.toast('問題が読み込まれていません');

        const mode = document.querySelector('input[name="play-mode"]:checked').value;
        this.state.playing = {
            mode,
            currentIndex: 0,
            flattenedQuestions: flattened,
            answers: [],
            isFinished: false
        };

        document.getElementById('player-setup').style.display = 'none';
        document.getElementById('player-active').style.display = 'block';
        this.renderCurrentQuestion();
    },

    getFlattenedQuestions() {
        const flattened = [];
        if (!this.state.currentQuiz.sections) return [];
        this.state.currentQuiz.sections.forEach((s, sIdx) => {
            s.questions.forEach((q, qIdx) => {
                flattened.push({
                    ...q,
                    sectionTitle: s.title,
                    displayId: `${sIdx + 1}-${qIdx + 1}`
                });
            });
        });
        return flattened;
    },

    renderCurrentQuestion() {
        const q = this.state.playing.flattenedQuestions[this.state.playing.currentIndex];
        const container = document.getElementById('current-question-container');
        const total = this.state.playing.flattenedQuestions.length;

        const progress = (this.state.playing.currentIndex / total) * 100;
        document.getElementById('progress-bar').style.width = `${progress}%`;
        document.getElementById('player-progress-text').textContent = `${this.state.playing.currentIndex + 1} / ${total}`;

        let interactiveHtml = '';
        if (q.type === 'descriptive') {
            interactiveHtml = `
                <div class="descriptive-container">
                    <input type="text" id="player-short-answer" class="glass-input" placeholder="回答を入力してください..." autocomplete="off">
                </div>
            `;
        } else {
            let optionsHtml = '';
            q.options.forEach((opt, idx) => {
                const inputType = q.type === 'multiple' ? 'checkbox' : 'radio';
                optionsHtml += `
                    <label class="player-option glass-card-lite">
                        <input type="${inputType}" name="player-choice" value="${idx}">
                        <span class="opt-box"></span>
                        <span class="opt-text">${this.escapeHtml(opt.text)}</span>
                    </label>
                `;
            });
            interactiveHtml = `<div class="options-container">${optionsHtml}</div>`;
        }

        const typeLabel = q.type === 'descriptive' ? '記述式' : (q.type === 'multiple' ? '複数選択' : '単一選択');

        container.innerHTML = `
            <div class="q-display">
                <div class="q-section-badge">${this.escapeHtml(q.sectionTitle)}</div>
                <div class="q-badge">問題 ${q.displayId} ｜ ${typeLabel} ｜ ${q.points}点</div>
                <div class="q-text-large">${this.escapeHtml(q.text)}</div>
                ${interactiveHtml}
                <div id="feedback-area" style="display: none;" class="feedback"></div>
            </div>
        `;

        document.getElementById('submit-answer').style.display = 'inline-flex';
        document.getElementById('next-question').style.display = 'none';

        if (q.type === 'descriptive') {
            document.getElementById('player-short-answer').focus();
            document.getElementById('player-short-answer').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.submitAnswer();
            });
        }
    },

    submitAnswer() {
        const q = this.state.playing.flattenedQuestions[this.state.playing.currentIndex];
        let isCorrect = false;
        let userAnswerText = '';
        let selectedIndices = [];

        if (q.type === 'descriptive') {
            const input = document.getElementById('player-short-answer');
            userAnswerText = input.value.trim().toLowerCase();
            if (!userAnswerText) return this.toast('解答を入力してください');

            isCorrect = q.correctAnswer.some(ans => ans.toLowerCase().trim() === userAnswerText);
        } else {
            selectedIndices = Array.from(document.querySelectorAll('input[name="player-choice"]:checked')).map(i => parseInt(i.value));
            if (selectedIndices.length === 0) return this.toast('選択肢を選んでください');

            const correctIndices = q.options.map((o, i) => o.isCorrect ? i : null).filter(i => i !== null);
            isCorrect = selectedIndices.length === correctIndices.length && selectedIndices.every(val => correctIndices.includes(val));
            userAnswerText = selectedIndices.map(idx => q.options[idx].text).join(', ');
        }

        const pointsEarned = isCorrect ? q.points : 0;
        this.state.playing.answers.push({
            questionIndex: this.state.playing.currentIndex,
            selectedIndices,
            userAnswerText,
            isCorrect,
            pointsEarned
        });

        if (this.state.playing.mode === 'instant') {
            const feedback = document.getElementById('feedback-area');
            feedback.style.display = 'block';
            feedback.className = isCorrect ? 'feedback correct' : 'feedback wrong';

            let correctInfo = '';
            if (!isCorrect) {
                if (q.type === 'descriptive') {
                    correctInfo = `正解は: ${q.correctAnswer.join(' / ')}`;
                } else {
                    correctInfo = `正解は: ${q.options.filter(o => o.isCorrect).map(o => o.text).join(', ')}`;
                }
            }

            let feedbackHtml = isCorrect ? '<div>正解！</div>' : `<div>不正解... ${correctInfo}</div>`;
            if (q.explanation) {
                feedbackHtml += `<div class="explanation-box"><div class="exp-label">【解説】</div>${this.escapeHtml(q.explanation).replace(/\n/g, '<br>')}</div>`;
            }
            feedback.innerHTML = feedbackHtml;
            document.getElementById('submit-answer').style.display = 'none';
            if (this.state.playing.currentIndex < this.state.playing.flattenedQuestions.length - 1) {
                document.getElementById('next-question').style.display = 'inline-flex';
            } else {
                document.getElementById('finish-quiz').style.display = 'inline-flex';
            }
        } else {
            this.nextQuestion();
        }
    },

    nextQuestion() {
        this.state.playing.currentIndex++;
        if (this.state.playing.currentIndex < this.state.playing.flattenedQuestions.length) {
            this.renderCurrentQuestion();
        } else {
            this.showResults();
        }
    },

    showResults() {
        this.showView('results');
        const flattened = this.state.playing.flattenedQuestions;
        const totalPoints = flattened.reduce((sum, q) => sum + q.points, 0);
        const earnedPoints = this.state.playing.answers.reduce((sum, a) => sum + a.pointsEarned, 0);

        document.getElementById('score-value').textContent = earnedPoints;
        document.getElementById('score-total').textContent = `/ ${totalPoints}`;
        document.getElementById('result-title').textContent = this.state.currentQuiz.title;

        const sectionScores = {};
        this.state.currentQuiz.sections.forEach((s, idx) => {
            sectionScores[s.title] = { earned: 0, total: 0, index: idx + 1 };
        });
        this.state.playing.answers.forEach((ans) => {
            sectionScores[flattened[ans.questionIndex].sectionTitle].earned += ans.pointsEarned;
        });
        flattened.forEach((q) => {
            sectionScores[q.sectionTitle].total += q.points;
        });

        const summaryContainer = document.getElementById('result-summary');
        let summaryHtml = '<div class="section-scores-grid">';
        Object.keys(sectionScores).forEach(title => {
            const score = sectionScores[title];
            const percent = score.total > 0 ? Math.round((score.earned / score.total) * 100) : 0;
            summaryHtml += `
                <div class="section-score-card glass-card-lite">
                    <div class="ssc-title">${this.escapeHtml(title)}</div>
                    <div class="ssc-value">${score.earned} / ${score.total} <span class="ssc-percent">(${percent}%)</span></div>
                </div>
            `;
        });
        summaryHtml += '</div>';

        summaryHtml += '<div class="result-list">';
        this.state.playing.answers.forEach((ans, i) => {
            const q = flattened[ans.questionIndex];
            let correctStr = '';
            if (q.type === 'descriptive') {
                correctStr = q.correctAnswer.join(' / ');
            } else {
                correctStr = q.options.filter(o => o.isCorrect).map(o => o.text).join(', ');
            }

            summaryHtml += `
                <div class="result-item glass-card-lite ${ans.isCorrect ? 'is-correct' : 'is-wrong'}">
                    <div class="result-item-header">
                        <span class="res-num">${q.displayId} (${this.escapeHtml(q.sectionTitle)})</span>
                        <span class="res-status">${ans.isCorrect ? '○ 正解' : '× 不正解'} (${ans.pointsEarned}点)</span>
                    </div>
                    <div class="res-q-text">${this.escapeHtml(q.text)}</div>
                    <div class="res-answers">
                        <div class="res-your-ans">あなたの回答: ${this.escapeHtml(ans.userAnswerText || '')}</div>
                        ${!ans.isCorrect ? `<div class="res-correct-ans">正解: ${this.escapeHtml(correctStr)}</div>` : ''}
                    </div>
                    ${q.explanation ? `<div class="explanation-box"><div class="exp-label">【解説】</div>${this.escapeHtml(q.explanation).replace(/\n/g, '<br>')}</div>` : ''}
                </div>
            `;
        });
        summaryHtml += '</div>';
        summaryContainer.innerHTML = summaryHtml;

        document.getElementById('player-setup').style.display = 'block';
        document.getElementById('player-active').style.display = 'none';
        document.getElementById('finish-quiz').style.display = 'none';
        document.getElementById('progress-bar').style.width = '0%';
    },

    // --- Storage & Files ---
    saveToLocalStorage() {
        localStorage.setItem('last_quiz_v2', JSON.stringify(this.state.currentQuiz));
    },

    loadFromLocalStorage() {
        const lastV2 = localStorage.getItem('last_quiz_v2');
        if (lastV2) {
            this.state.currentQuiz = JSON.parse(lastV2);
        } else {
            const lastV1 = localStorage.getItem('last_quiz');
            if (lastV1) {
                const old = JSON.parse(lastV1);
                this.state.currentQuiz = {
                    title: old.title,
                    sections: [{ title: 'セクション 1', questions: old.questions || [] }]
                };
            }
        }
        this.loadIntoEditor(this.state.currentQuiz);
    },

    loadIntoEditor(quiz) {
        document.getElementById('quiz-title').value = quiz.title;
        document.getElementById('section-editor-list').innerHTML = '';
        if (quiz.sections) {
            quiz.sections.forEach(s => this.addSectionUI(s));
        } else if (quiz.questions) {
            this.addSectionUI({ title: 'セクション 1', questions: quiz.questions });
        }
        const info = document.getElementById('player-quiz-info');
        if (info) info.textContent = `タイトル: ${quiz.title} (${this.getFlattenedQuestions().length}問)`;
    },

    handleFileLoad(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                let quiz = JSON.parse(event.target.result);
                if (!quiz.sections && quiz.questions) {
                    quiz = { title: quiz.title, sections: [{ title: 'デフォルトセクション', questions: quiz.questions }] };
                }
                this.state.currentQuiz = quiz;
                this.loadIntoEditor(quiz);
                this.toast('読み込み完了');
                this.showView('editor');
            } catch (err) {
                this.toast('エラー: 不正なJSON形式です');
            }
        };
        reader.readAsText(file);
    },

    downloadReport() {
        const now = new Date();
        const timestamp = now.toLocaleString();
        const flattened = this.state.playing.flattenedQuestions;
        const earned = this.state.playing.answers.reduce((s, a) => s + a.pointsEarned, 0);
        const total = flattened.reduce((s, q) => s + q.points, 0);

        let report = `【クイズ結果レポート】\n`;
        report += `日時: ${timestamp}\n`;
        report += `タイトル: ${this.state.currentQuiz.title}\n`;
        report += `スコア: ${earned} / ${total}\n`;
        report += `-------------------------------\n\n`;

        report += `【セクション別得点】\n`;
        const sectionScores = {};
        this.state.currentQuiz.sections.forEach(s => sectionScores[s.title] = { earned: 0, total: 0 });
        this.state.playing.answers.forEach(a => sectionScores[flattened[a.questionIndex].sectionTitle].earned += a.pointsEarned);
        flattened.forEach(q => sectionScores[q.sectionTitle].total += q.points);
        Object.keys(sectionScores).forEach(title => {
            const s = sectionScores[title];
            report += `- ${title}: ${s.earned} / ${s.total}\n`;
        });
        report += `\n-------------------------------\n\n`;

        this.state.playing.answers.forEach((ans, i) => {
            const q = flattened[ans.questionIndex];
            report += `[${q.displayId}] ${q.sectionTitle}\n`;
            report += `${ans.isCorrect ? '○ 正解' : '× 不正解'} (${ans.pointsEarned}点)\n`;
            report += `問題: ${q.text}\n`;
            report += `あなたの回答: ${ans.userAnswerText}\n`;
            if (!ans.isCorrect) {
                const correctStr = q.type === 'descriptive' ? q.correctAnswer.join(' / ') : q.options.filter(o => o.isCorrect).map(o => o.text).join(', ');
                report += `正解: ${correctStr}\n`;
            }
            if (q.explanation) report += `解説: ${q.explanation}\n`;
            report += `\n`;
        });

        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `result_${this.state.currentQuiz.title}_${now.getTime()}.txt`;
        a.click();
    },

    toast(msg) {
        const container = document.getElementById('toast-container');
        const el = document.createElement('div');
        el.className = 'toast';
        el.textContent = msg;
        container.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    },

    renderRecentQuizzes() {
        const grid = document.getElementById('recent-quiz-list');
        const flattened = this.getFlattenedQuestions();
        const totalQ = flattened.length;
        if (this.state.currentQuiz.title) {
            grid.innerHTML = `
                <div class="glass-card quiz-card" onclick="app.showView('editor')">
                    <h3>${this.state.currentQuiz.title}</h3>
                    <p>${this.state.currentQuiz.sections.length} Sections / ${totalQ} Questions</p>
                </div>
            `;
        } else {
            grid.innerHTML = '<p style="text-align:center; color:gray;">最近のクイズはありません</p>';
        }
    },

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

window.addEventListener('DOMContentLoaded', () => app.init());
