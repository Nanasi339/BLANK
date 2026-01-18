/**
 * REVOLVE! - Game Logic v2
 * Includes Skills, Duels, Passive Effects, and Unlock System
 */

// --- Constants & Enums ---

const BASE_ACTION = {
    SHOOT: 'SHOOT',
    DODGE: 'DODGE',
    RELOAD: 'RELOAD',
    NONE: 'NONE',
    FIZZLE: 'FIZZLE' // Used when action fails (e.g. no ammo)
};

const SKILL_TYPE = {
    ACTIVE: 'ACTIVE',   // Uses an action slot
    PASSIVE: 'PASSIVE', // Always active or triggers automatically
    TRIGGER: 'TRIGGER'  // Triggers on specific event (e.g. death)
};

// Skill Definitions
const SKILLS = {
    NONE: { id: 'NONE', name: 'No Skill', type: SKILL_TYPE.PASSIVE, desc: 'なし' },

    // Player Unlockable
    DODGE_SHOOT: {
        id: 'DODGE_SHOOT', name: '回避射撃', type: SKILL_TYPE.ACTIVE,
        cost: 1, desc: '回避しつつ射撃。命中50%。[1弾]', icon: '🤸'
    },
    SNIPE: {
        id: 'SNIPE', name: '狙撃', type: SKILL_TYPE.ACTIVE,
        cost: 1, desc: '回避貫通。次ターン行動不可。[1弾]', icon: '🎯'
    },
    RAPID_FIRE: {
        id: 'RAPID_FIRE', name: '速射', type: SKILL_TYPE.ACTIVE,
        cost: 2, desc: '2ダメ。回避時50%で1ダメ。[2弾]', icon: '💥'
    },
    SPRAY_PRAY: {
        id: 'SPRAY_PRAY', name: '乱射', type: SKILL_TYPE.ACTIVE,
        cost: 3, desc: '3連射(75/50/25%)。[3弾]', icon: '🌪️'
    },
    FINALE: {
        id: 'FINALE', name: 'フィナーレ', type: SKILL_TYPE.ACTIVE,
        cost: 'ALL', desc: '全弾消費ダメ。回避可。[全弾]', icon: '🏁'
    },
    ENCORE: {
        id: 'ENCORE', name: 'アンコール', type: SKILL_TYPE.ACTIVE,
        cost: 0, desc: 'ダイス目分リロード。', icon: '🎲'
    },
    CURTAIN_CALL: {
        id: 'CURTAIN_CALL', name: 'カーテンコール', type: SKILL_TYPE.TRIGGER,
        desc: 'HP0時、HP1で耐え全リロード。', icon: '🎭'
    },
    ROULETTE_FORTUNE: {
        id: 'ROULETTE_FORTUNE', name: '運命の輪', type: SKILL_TYPE.PASSIVE,
        desc: '毎Ｔ (敵弾%) で敵弾-1&1ダメ。', icon: '🎡'
    },

    // CPU Exclusive (or Debug)
    QUICK_DRAW: {
        id: 'QUICK_DRAW', name: 'クイックドロー', type: SKILL_TYPE.PASSIVE,
        desc: '射撃対決時、必中勝利（両者所持時は通常）。', icon: '🤠', cpuOnly: true
    },
    GRAND_FINALE: {
        id: 'GRAND_FINALE', name: 'G.フィナーレ', type: SKILL_TYPE.ACTIVE,
        cost: 1, desc: '即死攻撃。回避されたら自爆。[1弾]', icon: '💀', cpuOnly: true
    },
    REVOLUTION: {
        id: 'REVOLUTION', name: 'レボリューション', type: SKILL_TYPE.ACTIVE,
        cost: 0, desc: '全リロード。', icon: '✊', cpuOnly: true
    },
    ROULETTE_DEATH: {
        id: 'ROULETTE_DEATH', name: '死の輪', type: SKILL_TYPE.PASSIVE,
        desc: '毎Ｔ (敵弾%) で即死。', icon: '☠️', cpuOnly: true
    }
};

const ICONS = {
    [BASE_ACTION.SHOOT]: '🔫',
    [BASE_ACTION.DODGE]: '🛡️',
    [BASE_ACTION.RELOAD]: '🔋',
    [BASE_ACTION.NONE]: '',
    [BASE_ACTION.FIZZLE]: '❌',
    'SKILL': '⭐' // General skill fallback
};

const ACTION_DESC = {
    [BASE_ACTION.SHOOT]: '相手に1ダメージ与える(残弾-1)。',
    [BASE_ACTION.DODGE]: '相手の射撃を無効化する。',
    [BASE_ACTION.RELOAD]: '残弾を1回復する。',
};

const SE_FILES = {
    SHOOT: 'SE/拳銃を撃つ.mp3',
    RELOAD: 'SE/銃のリロード.mp3',
    DODGE: 'SE/剣の素振り3.mp3',
    EMPTY: 'SE/拳銃の弾切れ.mp3',
    SKILL: 'SE/拳銃をチャッと構える.mp3',
    SPECIAL: 'SE/魔の時計塔の鐘.mp3'
};

const BGM_FILE = 'BGM/soul drive.mp3';

const CONFIG = {
    MAX_HP: 6,
    MAX_AMMO: 6,
    ACTIONS_PER_TURN: 6,
};

// --- State ---
// Saved progress
let unlockedSkills = ['DODGE_SHOOT', 'SNIPE', 'RAPID_FIRE', 'SPRAY_PRAY', 'FINALE', 'ENCORE', 'CURTAIN_CALL', 'ROULETTE_FORTUNE']; // Start with 1, unlock others? Or start with ALL as per recent request? 
// User requested: "通常スキルはCPUを撃破でアンロック"
// So initially, player has NONE or maybe one basic skill?
// Let's implement basics: NONE is always available.
// We'll unlock DODGE_SHOOT by default as a tutorial skill? Or pure basics first.
// Let's start with NONE and maybe DODGE_SHOOT.
unlockedSkills = ['DODGE_SHOOT'];

// Debug mode unlocks everything
let isDebug = false;

// --- DOM Elements ---
const ui = {
    screens: {
        setup: document.getElementById('setup-screen'),
        game: document.getElementById('game-ui')
    },
    setup: {
        skillSelect: document.getElementById('skill-select'),
        debugCheck: document.getElementById('debug-mode'),
        btnStart: document.getElementById('btn-start-game')
    },
    game: {
        roundCount: document.getElementById('round-count'),
        log: document.getElementById('message-log'),
        // Player
        pNameSkill: document.getElementById('player-skill-display'),
        pHp: document.getElementById('player-hp'),
        pHpBar: document.getElementById('player-hp-bar'),
        pAmmo: document.getElementById('player-ammo'),
        pSlots: Array.from(document.getElementById('player-slots').children),
        pStatus: document.getElementById('player-status-overlay'),
        // Opponent
        oNameSkill: document.getElementById('opp-skill-display'),
        oHp: document.getElementById('opponent-hp'),
        oHpBar: document.getElementById('opponent-hp-bar'),
        oAmmo: document.getElementById('opponent-ammo'),
        oSlots: Array.from(document.getElementById('opponent-slots').children),
        oStatus: document.getElementById('opp-status-overlay'),
        // Controls
        btnShoot: document.querySelector('.shoot-btn'),
        btnDodge: document.querySelector('.dodge-btn'),
        btnReload: document.querySelector('.reload-btn'),
        btnSkill: document.querySelector('.skill-btn'),
        btnClear: document.getElementById('clear-btn'),
        btnLockIn: document.getElementById('lock-in-btn'),
        // Overlay
        overlay: document.getElementById('game-overlay'),
        ovTitle: document.getElementById('overlay-title'),
        ovMsg: document.getElementById('overlay-message'),
        ovUnlock: document.getElementById('unlock-message'),
        btnRestart: document.getElementById('restart-btn')
    }
};

// --- Classes ---

class Player {
    constructor(name, isCPU = false) {
        this.name = name;
        this.isCPU = isCPU;
        this.hp = CONFIG.MAX_HP;
        this.ammo = CONFIG.MAX_AMMO;
        this.selectedActions = []; // Array of {type: 'BASE'|'SKILL', id: string}
        this.skill = SKILLS.NONE;
        this.skillUsedInTurn = false; // Limit 1 per turn
        this.curtainCallUsed = false;
        this.nextActionInvalid = false; // For SNIPE penalty
    }

    reset() {
        this.hp = CONFIG.MAX_HP;
        this.ammo = CONFIG.MAX_AMMO;
        this.selectedActions = [];
        this.skillUsedInTurn = false;
        this.curtainCallUsed = false;
        this.nextActionInvalid = false;
    }
}

class Game {
    constructor() {
        this.player = new Player('Player');
        this.opponent = new Player('Opponent', true);
        this.round = 1;
        this.isProcessingTurn = false;
        this.pendingUnlock = null;
        this.bgmAudio = null;

        this.initSetupScreen();
    }

    initSetupScreen() {
        ui.setup.btnStart.onclick = () => this.startGame();
        ui.game.btnRestart.onclick = () => this.returnToSetup();

        // Populate Skills
        this.renderSkillSelect();

        const updateSetupDesc = () => {
            const skill = SKILLS[ui.setup.skillSelect.value];
            document.getElementById('setup-description').textContent = skill ? skill.desc : '';
        };
        ui.setup.skillSelect.onchange = updateSetupDesc;
        updateSetupDesc(); // Initial check

        ui.setup.debugCheck.onchange = (e) => {
            isDebug = e.target.checked;
            this.renderSkillSelect();
            const cpuCont = document.getElementById('cpu-skill-container');
            if (isDebug) {
                cpuCont.classList.remove('hidden');
                this.renderCpuSkillSelect();
            } else {
                cpuCont.classList.add('hidden');
            }
        };
    }

    renderSkillSelect() {
        ui.setup.skillSelect.innerHTML = '';
        const opts = [SKILLS.NONE];

        // Add unlocked
        unlockedSkills.forEach(id => {
            if (SKILLS[id]) opts.push(SKILLS[id]);
        });

        // Debug adds all
        if (isDebug) {
            Object.values(SKILLS).forEach(s => {
                if (!opts.find(o => o.id === s.id)) opts.push(s);
            });
        }

        opts.forEach(s => {
            const el = document.createElement('option');
            el.value = s.id;
            el.textContent = `${s.name} ${s.cpuOnly ? '[CPU]' : ''}`;
            ui.setup.skillSelect.appendChild(el);
        });
    }

    renderCpuSkillSelect() {
        const sel = document.getElementById('cpu-skill-select');
        if (!sel) return;
        sel.innerHTML = '';
        Object.values(SKILLS).forEach(s => {
            const el = document.createElement('option');
            el.value = s.id;
            el.textContent = `${s.name} ${s.cpuOnly ? '[CPU]' : ''}`;
            sel.appendChild(el);
        });
    }

    returnToSetup() {
        this.stopBGM();
        ui.game.overlay.classList.add('hidden');
        ui.screens.game.classList.add('hidden');
        ui.screens.setup.classList.remove('hidden');
        this.renderSkillSelect(); // Refresh in case of unlocks
        if (isDebug) this.renderCpuSkillSelect();
    }

    startGame() {
        const skillId = ui.setup.skillSelect.value;
        this.player.skill = SKILLS[skillId];

        if (isDebug) {
            const cpuSkillId = document.getElementById('cpu-skill-select').value;
            this.opponent.skill = SKILLS[cpuSkillId] || SKILLS.NONE;
        } else {
            // Pick CPU Skill (Random from pool, stronger if round/win count high? For now random)
            // Pool includes CPU exclusives
            const activeCpuSkills = Object.values(SKILLS).filter(s => s.type === SKILL_TYPE.ACTIVE && s.id !== 'NONE');
            const randomSkill = activeCpuSkills[Math.floor(Math.random() * activeCpuSkills.length)];
            this.opponent.skill = randomSkill || SKILLS.NONE;
        }

        // Also CPU could have Passive skills? 
        // Logic simplifies: One main skill.

        ui.screens.setup.classList.add('hidden');
        ui.screens.game.classList.remove('hidden');

        this.round = 1;
        this.isProcessingTurn = false; // Force reset input lock
        this.player.reset();
        this.opponent.reset();

        this.playBGM();

        // Bind Controls
        this.setupControls();

        this.updateUI();
        this.updatePlayerSlots(); // Reset player slots visual
        this.checkLockIn();       // Reset LockBtn
        ui.game.oSlots.forEach(s => { s.className = 'slot unknown'; s.textContent = '?'; }); // Reset Opponent slots

        this.log("MISSION START");


        // Check initial PASSIVE skills if any? (Not needed for current set)
    }

    setupControls() {
        // Clear old listeners to avoid dupes (simple way: override onclick)
        ui.game.btnShoot.onclick = () => this.addAction(BASE_ACTION.SHOOT);
        ui.game.btnDodge.onclick = () => this.addAction(BASE_ACTION.DODGE);
        ui.game.btnReload.onclick = () => this.addAction(BASE_ACTION.RELOAD);

        const setBattleDesc = (text) => {
            const el = document.getElementById('battle-description');
            el.textContent = text;
            el.classList.remove('hidden');
        };
        const clearBattleDesc = () => {
            document.getElementById('battle-description').classList.add('hidden');
        };

        const attachHover = (btn, text) => {
            btn.onmouseenter = () => setBattleDesc(text);
            btn.onmouseleave = clearBattleDesc;
        }

        attachHover(ui.game.btnShoot, ACTION_DESC[BASE_ACTION.SHOOT]);
        attachHover(ui.game.btnDodge, ACTION_DESC[BASE_ACTION.DODGE]);
        attachHover(ui.game.btnReload, ACTION_DESC[BASE_ACTION.RELOAD]);

        ui.game.btnSkill.onclick = () => {
            if (this.player.skill.type === SKILL_TYPE.ACTIVE) {
                if (this.player.selectedActions.filter(a => a.id === this.player.skill.id).length > 0) {
                    this.log("Skill limit: Once per turn!");
                    return;
                }
                this.addAction(this.player.skill.id, true);
            }
        };
        // Skill hover dynamic
        ui.game.btnSkill.onmouseenter = () => setBattleDesc(this.player.skill.desc);
        ui.game.btnSkill.onmouseleave = clearBattleDesc;

        ui.game.btnClear.onclick = () => {
            if (this.isProcessingTurn) return;
            this.player.selectedActions = [];
            this.updatePlayerSlots();
            this.checkLockIn();
        };

        ui.game.btnLockIn.onclick = () => {
            if (this.player.selectedActions.length === CONFIG.ACTIONS_PER_TURN) {
                this.resolveTurn();
            }
        };

        // Remove slot on click
        ui.game.pSlots.forEach((slot, i) => {
            slot.onclick = () => {
                if (this.isProcessingTurn) return;
                if (i < this.player.selectedActions.length) {
                    this.player.selectedActions.splice(i, 1);
                    this.updatePlayerSlots();
                    this.checkLockIn();
                }
            };
            // Slot hover? only action slots
            slot.onmouseenter = () => {
                const act = this.player.selectedActions[i];
                if (act) {
                    const desc = act.isSkill ? SKILLS[act.id].desc : ACTION_DESC[act.id];
                    setBattleDesc(desc);
                }
            };
            slot.onmouseleave = clearBattleDesc;
        });

        // Skill Button State
        if (this.player.skill.type !== SKILL_TYPE.ACTIVE) {
            ui.game.btnSkill.disabled = true;
            ui.game.btnSkill.style.opacity = 0.5;
        } else {
            ui.game.btnSkill.disabled = false;
            ui.game.btnSkill.querySelector('.icon').textContent = this.player.skill.icon || '⭐';
            ui.game.btnSkill.lastChild.textContent = ' ' + this.player.skill.id.replace('_', ' '); // Simplified name
        }
    }

    addAction(actionId, isSkill = false) {
        if (this.isProcessingTurn) return;
        if (this.player.selectedActions.length < CONFIG.ACTIONS_PER_TURN) {
            this.player.selectedActions.push({ id: actionId, isSkill });
            this.updatePlayerSlots();
            this.checkLockIn();
        }
    }

    checkLockIn() {
        ui.game.btnLockIn.disabled = this.player.selectedActions.length !== CONFIG.ACTIONS_PER_TURN;
    }

    updatePlayerSlots() {
        ui.game.pSlots.forEach((slot, i) => {
            const act = this.player.selectedActions[i];
            slot.className = 'slot';
            slot.textContent = '';

            if (act) {
                if (act.isSkill) {
                    slot.classList.add('skill');
                    const skill = SKILLS[act.id];
                    slot.textContent = skill.icon;
                } else {
                    slot.classList.add(act.id.toLowerCase());
                    slot.textContent = ICONS[act.id];
                }
            } else {
                slot.classList.add('empty');
            }
        });
    }

    updateUI() {
        ui.game.roundCount.textContent = this.round;

        // Player
        ui.game.pHp.textContent = this.player.hp;
        ui.game.pHpBar.style.width = Math.max(0, (this.player.hp / CONFIG.MAX_HP) * 100) + '%';
        this.renderAmmo(ui.game.pAmmo, this.player.ammo);
        ui.game.pNameSkill.textContent = this.player.skill.id !== 'NONE' ? `[${this.player.skill.name}]` : '';

        // Opponent
        ui.game.oHp.textContent = this.opponent.hp;
        ui.game.oHpBar.style.width = Math.max(0, (this.opponent.hp / CONFIG.MAX_HP) * 100) + '%';
        this.renderAmmo(ui.game.oAmmo, this.opponent.ammo);
        ui.game.oNameSkill.textContent = this.opponent.skill.id !== 'NONE' ? `[${this.opponent.skill.name}]` : '';
    }

    renderAmmo(container, amount) {
        container.innerHTML = '';
        for (let i = 0; i < CONFIG.MAX_AMMO; i++) {
            const pip = document.createElement('div');
            pip.className = `ammo-pip ${i < amount ? 'active' : ''}`;
            container.appendChild(pip);
        }
    }

    // --- AI Logic ---
    generateCPUActions() {
        const ops = [];
        const hasActiveSkill = this.opponent.skill.type === SKILL_TYPE.ACTIVE;
        let skillUsed = false;

        for (let i = 0; i < CONFIG.ACTIONS_PER_TURN; i++) {
            let choice = BASE_ACTION.SHOOT; // default
            const ammoEst = this.opponent.ammo + ops.filter(a => a.id === BASE_ACTION.RELOAD).length - ops.filter(a => a.id === BASE_ACTION.SHOOT || (a.isSkill && SKILLS[a.id].cost !== 0)).length;

            // Basic Brain
            const roll = Math.random();
            if (ammoEst <= 0) {
                choice = BASE_ACTION.RELOAD; // Must reload
            } else if (ammoEst >= 5) {
                choice = BASE_ACTION.SHOOT; // Dump ammo
            } else {
                // Random mix
                if (roll < 0.4) choice = BASE_ACTION.SHOOT;
                else if (roll < 0.7) choice = BASE_ACTION.DODGE;
                else choice = BASE_ACTION.RELOAD;
            }

            // Try to use Skill?
            if (hasActiveSkill && !skillUsed && Math.random() < 0.4) {
                // Check cost
                const skill = this.opponent.skill;
                let costOK = true;
                if (typeof skill.cost === 'number' && ammoEst < skill.cost) costOK = false;
                if (skill.cost === 'ALL' && ammoEst < 1) costOK = false;

                if (costOK) {
                    ops.push({ id: skill.id, isSkill: true });
                    skillUsed = true;
                    continue;
                }
            }

            ops.push({ id: choice, isSkill: false });
        }
        this.opponent.selectedActions = ops;
    }

    // --- Core Resolution ---
    async resolveTurn() {
        this.isProcessingTurn = true;
        this.lockControls();
        this.generateCPUActions();

        // Hide Opponent Slots
        ui.game.oSlots.forEach(s => { s.className = 'slot unknown'; s.textContent = '?'; });

        this.log(`ROUND ${this.round} EXECUTE`);
        await this.wait(800);

        for (let i = 0; i < CONFIG.ACTIONS_PER_TURN; i++) {
            const pAct = this.player.selectedActions[i];
            const oAct = this.opponent.selectedActions[i];

            // Highlight
            ui.game.pSlots[i].classList.add('active-slot');
            ui.game.oSlots[i].classList.add('active-slot');
            this.revealOpponentSlot(i, oAct);

            await this.wait(500);

            await this.resolveStep(pAct, oAct, i);
            this.updateUI();

            // Check Death
            const gameOver = this.checkGameOver();
            if (gameOver) {
                // Check Curtain Call (Revive) logic if not checked already inside checkGameOver?
                // Actually checkGameOver handles the "Game Ends" state.
                // We need to check triggers BEFORE game over returns true.
                // Implemented inside checkTriggers called by checkGameOver?
                // Let's do it in checkGameOver logic.
                return;
            }

            await this.wait(800);
            ui.game.pSlots[i].classList.remove('active-slot');
            ui.game.oSlots[i].classList.remove('active-slot');
        }

        // End of Turn Triggers
        await this.resolveEndTurn();
        if (this.checkGameOver()) return;

        // Reset for next round
        this.round++;
        this.player.selectedActions = [];
        this.opponent.selectedActions = [];
        this.player.skillUsedInTurn = false;
        this.opponent.skillUsedInTurn = false;

        this.updatePlayerSlots();
        this.checkLockIn();
        ui.game.oSlots.forEach(s => { s.className = 'slot unknown'; s.textContent = '?'; });

        this.log("SELECT ACTIONS");
        this.isProcessingTurn = false;
        this.unlockControls();
    }

    async resolveStep(pActObj, oActObj, phaseIndex) {
        // Visualize Action Desc logic
        if (pActObj.isSkill) {
            this.log(`PLAYER: ${SKILLS[pActObj.id].name}\n${SKILLS[pActObj.id].desc}`);
        } else {
            this.log(`PLAYER: ${pActObj.id}\n${ACTION_DESC[pActObj.id]}`);
        }

        if (oActObj.isSkill) {
            await this.wait(600);
            this.log(`OPPONENT: ${SKILLS[oActObj.id].name}`); // Hide opp desc? Or show? keeping simple
        } else {
            // Optional: Show opponent action?
        }
        await this.wait(400);

        // 1. Validate / Pay Costs
        // Player
        let pReal = this.processCost(this.player, pActObj);
        // Opponent
        let oReal = this.processCost(this.opponent, oActObj);

        // --- Sound Effects ---
        // --- Sound Effects ---
        // --- Sound Effects ---
        const isDuel = pReal.id === BASE_ACTION.SHOOT && oReal.id === BASE_ACTION.SHOOT;

        const triggerSE = (entity, realAct, isSkill) => {
            if (realAct.id === BASE_ACTION.FIZZLE || realAct.id === 'RECOIL') {
                this.playSE('EMPTY');
                return;
            }

            // Skill Specific Sounds
            if (isSkill) {
                // Attack Skills -> SHOOT
                if (['DODGE_SHOOT', 'SNIPE'].includes(realAct.id)) {
                    this.playSE('SHOOT');
                } else if (realAct.id === 'RAPID_FIRE') {
                    this.playSE('SHOOT');
                    setTimeout(() => this.playSE('SHOOT'), 150);
                } else if (realAct.id === 'SPRAY_PRAY') {
                    this.playSE('SHOOT');
                    setTimeout(() => this.playSE('SHOOT'), 120);
                    setTimeout(() => this.playSE('SHOOT'), 240);
                } else if (realAct.id === 'FINALE') {
                    const count = entity.lastCostPaid || 1;
                    for (let i = 0; i < count; i++) {
                        setTimeout(() => this.playSE('SHOOT'), i * 100);
                    }
                } else if (realAct.id === 'GRAND_FINALE') {
                    this.playSE('SHOOT');
                }
                // Reload Skills -> RELOAD
                else if (['ENCORE', 'REVOLUTION', 'CURTAIN_CALL'].includes(realAct.id)) {
                    this.playSE('RELOAD');
                } else {
                    // Fallback
                    this.playSE('SKILL');
                }
                return;
            }

            // Base Actions
            if (realAct.id === BASE_ACTION.SHOOT) {
                if (!isDuel) this.playSE('SHOOT');
            } else if (realAct.id === BASE_ACTION.RELOAD) {
                this.playSE('RELOAD');
            } else if (realAct.id === BASE_ACTION.DODGE) {
                this.playSE('DODGE');
            }
        };

        triggerSE(this.player, pReal, pActObj.isSkill);
        // Delay Opponent SE slightly or play together? 
        // Let's play together for chaos/impact
        setTimeout(() => triggerSE(this.opponent, oReal, oActObj.isSkill), 100);


        // If FIZZLE, update UI to show failure?
        if (pReal.id === BASE_ACTION.FIZZLE) {
            ui.game.pSlots[phaseIndex].classList.add('fizzle');
            this.log("PLAYER ACTION FAILED (No Ammo)");
        }
        if (pReal.id === 'RECOIL') {
            ui.game.pSlots[phaseIndex].classList.add('fizzle');
            this.log("PLAYER CANNOT ACT (Recoil)");
        }

        if (oReal.id === BASE_ACTION.FIZZLE) {
            ui.game.oSlots[phaseIndex].classList.add('fizzle');
        }
        if (oReal.id === 'RECOIL') {
            ui.game.oSlots[phaseIndex].classList.add('fizzle');
            this.log("OPPONENT CANNOT ACT (Recoil)");
        }

        // 2. Check Duel (Shoot vs Shoot)
        // Conditions: Both are SHOOT (or equivalent skill acting as shoot?)
        // Rules say: "Shoot action". Skills might counts as shoot? 
        // "Both Shoot Action" -> Base SHOOT.
        // Skills like "Rapid Fire" are technically specific actions.
        // Let's limit Duel to pure SHOOT vs SHOOT for now, OR skills that say "Counts as Shoot".
        // Quick Draw vs Shoot interaction implies Quick Draw wins duel.

        const pIsShoot = pReal.id === BASE_ACTION.SHOOT;
        const oIsShoot = oReal.id === BASE_ACTION.SHOOT;

        if (pIsShoot && oIsShoot) {
            // Handle Duel logic
            await this.resolveDuel(pReal, oReal);
            return;
        }

        // 3. Normal Resolution (Simultaneous)
        // We calculate damage pending, then apply.
        let pDmg = 0;
        let oDmg = 0;

        // --- Player Action Effects ---
        if (pReal.id === BASE_ACTION.RELOAD) this.modAmmo(this.player, 1);
        if (pReal.id === 'ENCORE') this.modAmmo(this.player, 1 + Math.floor(Math.random() * 6));
        if (pReal.id === 'REVOLUTION') this.player.ammo = CONFIG.MAX_AMMO;

        switch (pReal.id) {
            case BASE_ACTION.SHOOT:
                if (oReal.id === BASE_ACTION.DODGE || oReal.id === 'DODGE_SHOOT') pDmg = 0;
                else pDmg = 1;
                break;
            case 'DODGE_SHOOT':
                if (!(oReal.id === BASE_ACTION.DODGE || oReal.id === 'DODGE_SHOOT')) {
                    if (Math.random() < 0.5) pDmg = 1;
                }
                break;
            case 'SNIPE':
                // Penetrates Dodge
                pDmg = 1;
                this.player.nextActionInvalid = true;
                this.log("SNIPE ACTIVATED!");
                break;
            case 'RAPID_FIRE':
                if (oReal.id === BASE_ACTION.DODGE || oReal.id === 'DODGE_SHOOT') {
                    if (Math.random() < 0.5) pDmg = 1;
                } else {
                    pDmg = 2;
                }
                break;
            case 'SPRAY_PRAY':
                if (Math.random() < 0.75) pDmg++;
                if (Math.random() < 0.50) pDmg++;
                if (Math.random() < 0.25) pDmg++;
                if (oReal.id === BASE_ACTION.DODGE || oReal.id === 'DODGE_SHOOT') pDmg = 0;
                break;
            case 'FINALE':
                const dmg = this.player.lastCostPaid || 0;
                if (oReal.id === BASE_ACTION.DODGE || oReal.id === 'DODGE_SHOOT') pDmg = 0;
                else pDmg = dmg;
                break;
            case 'GRAND_FINALE':
                if (oReal.id === BASE_ACTION.DODGE || oReal.id === 'DODGE_SHOOT') {
                    this.player.hp = 0;
                    this.log("GF BLOCKED! BACKFIRE!");
                } else {
                    pDmg = 999;
                }
                break;
        }

        // --- Opponent Action Effects ---
        // Mirror logic
        if (oReal.id === BASE_ACTION.RELOAD) this.modAmmo(this.opponent, 1);
        if (oReal.id === 'REVOLUTION') this.opponent.ammo = CONFIG.MAX_AMMO;

        switch (oReal.id) {
            case BASE_ACTION.SHOOT:
                if (pReal.id === BASE_ACTION.DODGE || pReal.id === 'DODGE_SHOOT') oDmg = 0;
                else oDmg = 1;
                break;
            case 'DODGE_SHOOT':
                if (!(pReal.id === BASE_ACTION.DODGE || pReal.id === 'DODGE_SHOOT')) {
                    if (Math.random() < 0.5) oDmg = 1;
                }
                break;
            case 'SNIPE':
                // Penetrates Dodge
                oDmg = 1;
                // Opponent next action invalid handling? 
                // Currently CPU generation doesn't handle validity check statefully across turns well 
                // but we should set flag if we ever want to enforce it.
                this.opponent.nextActionInvalid = true;
                this.log("OPP SNIPE ACTIVATED!");
                break;
            case 'GRAND_FINALE':
                if (pReal.id === BASE_ACTION.DODGE || pReal.id === 'DODGE_SHOOT') {
                    this.opponent.hp = 0;
                    this.log("GF BLOCKED! CPU SELF-DESTRUCT!");
                } else {
                    oDmg = 999;
                }
                break;
        }

        // Apply Damage
        if (pDmg > 0) {
            this.opponent.hp -= pDmg;
            // Visual
            ui.game.oSlots[phaseIndex].classList.add('hit');
        }
        if (oDmg > 0) {
            this.player.hp -= oDmg;
            ui.game.pSlots[phaseIndex].classList.add('hit');
        }
    }

    async resolveDuel(pAct, oAct) {
        this.log("⚔️ DUEL INIT! ⚔️");
        await this.wait(600);

        const pHasQD = this.player.skill.id === 'QUICK_DRAW';
        const oHasQD = this.opponent.skill.id === 'QUICK_DRAW';

        // Check Quick Draw
        if (pHasQD && !oHasQD) {
            this.log("PLAYER QUICK DRAW (PASSIVE)!");
            this.opponent.hp -= 1;
            // Quick Draw win consumes ammo? Duel logic says winner pays cost.
            // Shoot cost already paid in processCost.
            return;
        }
        if (oHasQD && !pHasQD) {
            this.log("OPP QUICK DRAW (PASSIVE)!");
            this.player.hp -= 1;
            return;
        }
        if (pHasQD && oHasQD) {
            this.log("QUICK DRAW CLASH! DUEL!");
        }

        // Coin Toss Loop
        let resolved = false;
        while (!resolved) {
            // Flip
            this.log("COIN TOSS...");
            await this.wait(800);

            const pCoin = Math.random() < 0.5; // True = Head
            const oCoin = Math.random() < 0.5;

            let msg = "";
            let pWin = false;
            let oWin = false;

            if (pCoin && !oCoin) {
                msg = "PLAYER WINS DUEL!";
                // Player keeps cost (-1 total). Opponent gets refund (0 total).
                this.modAmmo(this.opponent, 1);
                this.opponent.hp -= 1;
                this.playSE('SHOOT');
                resolved = true;
            } else if (!pCoin && oCoin) {
                msg = "OPPONENT WINS DUEL!";
                // Opponent keeps cost. Player gets refund.
                this.modAmmo(this.player, 1);
                this.player.hp -= 1;
                this.playSE('SHOOT');
                resolved = true;
            } else if (pCoin && oCoin) {
                // Both Hit?
                // Both keep cost (-1) and take damage.
                msg = "DOUBLE HIT!";
                this.player.hp -= 1;
                this.opponent.hp -= 1;
                this.playSE('SHOOT');
                setTimeout(() => this.playSE('SHOOT'), 150);
                resolved = true;
            } else {
                msg = "BOTH MISSED! AGAIN!";
            }

            this.log(msg);
            await this.wait(1000);
        }
    }

    processCost(entity, actionObj) {
        if (entity.nextActionInvalid) {
            entity.nextActionInvalid = false;
            return { id: 'RECOIL' };
        }

        const id = actionObj.id;
        let cost = 0;

        if (id === BASE_ACTION.SHOOT) cost = 1;
        else if (actionObj.isSkill) {
            const def = SKILLS[id];
            if (def.cost === 'ALL') {
                cost = entity.ammo;
                entity.lastCostPaid = cost; // Special tracking for Finale
            } else {
                cost = def.cost || 0;
                entity.lastCostPaid = cost;
            }
        }
        // Dodge/Reload cost 0

        if (entity.ammo >= cost) {
            // Special check: Shoot needs >0 ammo? Already covered by cost=1.
            // But if cost=0 (Reload), we check max ammo? No, reload adds.
            if (id === BASE_ACTION.RELOAD && entity.ammo >= CONFIG.MAX_AMMO) {
                // Tactical reload? Allowed but wastes slot. Not fizzle.
            }
            // Consume
            entity.ammo -= cost;
            return actionObj;
        } else {
            return { id: BASE_ACTION.FIZZLE };
        }
    }

    modAmmo(entity, amount, allowNeg = false) {
        entity.ammo += amount;
        if (!allowNeg && entity.ammo < 0) entity.ammo = 0;
        if (entity.ammo > CONFIG.MAX_AMMO) entity.ammo = CONFIG.MAX_AMMO;
    }

    async resolveEndTurn() {
        const runPassive = async (user, target) => {
            const skill = user.skill;

            if (skill.id === 'ROULETTE_FORTUNE') {
                const chance = target.ammo / CONFIG.MAX_AMMO;
                if (Math.random() < chance) {
                    this.log(`${user.name} ROULETTE: HIT!`);
                    this.playSE('SPECIAL');
                    await this.wait(500);
                    target.hp -= 1;
                    this.modAmmo(target, -1);
                }
            } else if (skill.id === 'ROULETTE_DEATH') {
                const chance = target.ammo / CONFIG.MAX_AMMO;
                if (Math.random() < chance) {
                    this.log(`${user.name} DEATH ROULETTE...`);
                    this.playSE('SPECIAL');
                    await this.wait(800);
                    target.hp = 0;
                }
            }
        };

        // Check triggers for both sides
        await runPassive(this.player, this.opponent);
        await runPassive(this.opponent, this.player);

        this.updateUI();
    }

    checkGameOver() {
        // Curtain Call Check (Before Death)
        const checkCurtain = (entity) => {
            if (entity.hp <= 0 && entity.skill.id === 'CURTAIN_CALL' && !entity.curtainCallUsed) {
                // Trigger!
                entity.curtainCallUsed = true;
                entity.hp = 1;
                entity.ammo = CONFIG.MAX_AMMO;
                this.updateUI(); // Immediate visual update
                this.playSE('SPECIAL');
                this.log(`${entity.name}'s CURTAIN CALL! (One time only)`);
                return true; // Saved
            }
            return false;
        };

        if (this.player.hp <= 0) checkCurtain(this.player);
        if (this.opponent.hp <= 0) checkCurtain(this.opponent);

        if (this.player.hp <= 0 && this.opponent.hp <= 0) {
            this.stopBGM();
            this.showOverlay("DRAW", "DOUBLE KO!");
            this.playSE('SPECIAL');
            return true;
        } else if (this.player.hp <= 0) {
            this.stopBGM();
            this.showOverlay("MISSION FAILED", "YOU DIED.");
            this.playSE('SPECIAL');
            return true;
        } else if (this.opponent.hp <= 0) {
            this.stopBGM();
            // Unlock!
            if (this.opponent.skill.id !== 'NONE' && !unlockedSkills.includes(this.opponent.skill.id) && !this.opponent.skill.cpuOnly) {
                unlockedSkills.push(this.opponent.skill.id);
                this.pendingUnlock = this.opponent.skill.name;
            }
            this.showOverlay("MISSION ACCOMPLISHED", "TARGET SILENCED.");
            this.playSE('SPECIAL');
            return true;
        }
        return false;
    }

    // --- Helper Utils ---

    playSE(key) {
        if (SE_FILES[key]) {
            const audio = new Audio(SE_FILES[key]);
            audio.volume = 0.5;
            audio.play().catch(e => console.warn('SE Play Failed', e));
        }
    }

    playBGM() {
        if (this.bgmAudio) return; // Already playing
        this.bgmAudio = new Audio(BGM_FILE);
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = 0.3; // Lower volume for BGM
        this.bgmAudio.play().catch(e => console.warn('BGM Play Failed', e));
    }

    stopBGM() {
        if (this.bgmAudio) {
            this.bgmAudio.pause();
            this.bgmAudio.currentTime = 0;
            this.bgmAudio = null;
        }
    }

    revealOpponentSlot(idx, actionObj) {
        const el = ui.game.oSlots[idx];
        el.className = 'slot';
        el.textContent = '';

        if (actionObj.isSkill) {
            el.classList.add('skill');
            el.textContent = SKILLS[actionObj.id].icon;
        } else {
            el.classList.add(actionObj.id.toLowerCase());
            el.textContent = ICONS[actionObj.id];
        }
    }

    log(msg) {
        ui.game.log.textContent = msg;
        ui.game.log.style.opacity = 0.5;
        setTimeout(() => ui.game.log.style.opacity = 1, 100);
    }

    wait(ms) { return new Promise(r => setTimeout(r, ms)); }

    lockControls() {
        ui.game.btnLockIn.disabled = true;
        ui.game.btnClear.disabled = true;
        document.body.style.cursor = 'wait';
    }

    unlockControls() {
        this.checkLockIn();
        ui.game.btnClear.disabled = false;
        document.body.style.cursor = 'default';
    }

    showOverlay(title, msg) {
        ui.game.ovTitle.textContent = title;
        ui.game.ovMsg.textContent = msg;
        if (this.pendingUnlock) {
            ui.game.ovUnlock.textContent = `UNLOCKED: ${this.pendingUnlock}`;
            ui.game.ovUnlock.classList.remove('hidden');
            this.pendingUnlock = null;
        } else {
            ui.game.ovUnlock.classList.add('hidden');
        }
        ui.game.overlay.classList.remove('hidden');
    }
}

// Start
const game = new Game();
