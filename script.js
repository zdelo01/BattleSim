console.log("Hey bigmoney");
let button = document.querySelector("#myButton");
let roles = document.querySelectorAll(".role");
let pHP, pAtk, pDef, eHP, eAtk, eDef;

// Handle clicking a role
for (let role of roles) {
    role.addEventListener("click", function() {
        for (let r of roles) {
            r.classList.remove("selected");
        }
        role.classList.add("selected");

        // Save using the key "selectedRole"
        let roleName = role.querySelector("h2").innerText;
        localStorage.setItem("selectedRole", roleName);
    });
}

// Handles game logic when player locks in a role
button.addEventListener("click", function() {
    let selected = document.querySelector(".role.selected");

    if (selected) {
        let roleName = selected.querySelector("h2").innerText;

        // Hide selection, show game
        document.querySelector("#selection-screen").style.display = "none";
        const gameScreen = document.querySelector("#game-screen");
        gameScreen.style.display = "flex";

        // Status message
        const status = document.querySelector("#status-message");
        status.innerText = "Prove your worth " + roleName + "!";

        // Defines Hero Stats + container
        const allStats = {
            "Warrior": { HP: 150, ATK: 15, DEF: 20 },
            "Barbarian": { HP: 120, ATK: 25, DEF: 5 },
            "Paladin": { HP: 130, ATK: 12, DEF: 15 }
        };

        const statsContainer = document.querySelector("#stats-container");
        const stats = allStats[roleName];
        const playerTitle = document.querySelector("#player-title");

        // Defines Enemy, encounter, and container
        const enemies = [
            { name: "Skeleton", HP: 80, ATK: 12, DEF: 5, color: "#bdc3c7" },
            { name: "Orc", HP: 120, ATK: 18, DEF: 10, color: "#2ecc71" },
            { name: "Demon", HP: 200, ATK: 25, DEF: 15, color: "#e74c3c"}
        ];

        const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
        const enemyContainer = document.querySelector("#enemy-stats-container");
        const enemyTitle = document.querySelector("#enemy-title");

        // Apply Visuals ------------------
        // Roles
        const roleColors = {
            "Warrior": "dodgerblue",
            "Barbarian": "crimson", 
            "Paladin": "lime"
        };
        // Hero
        const color = roleColors[roleName] || "white";
        status.style.color = color;
        statsContainer.parentElement.style.borderLeftColor = color;
        statsContainer.style.borderLeft = `4px solid ${color}`;
        playerTitle.innerText = roleName;
        playerTitle.style.color = color;   

        // Enemy
        enemyTitle.innerText = randomEnemy.name;
        enemyTitle.style.color = randomEnemy.color;
        enemyContainer.parentElement.style.borderLeftColor = randomEnemy.color;
        enemyContainer.style.borderLeft = `4px solid ${randomEnemy.color}`;

        // Inject Stats into the Container
        // Hero
        statsContainer.innerHTML = `
            <div class="stat-row"><strong>HP:</strong> ${stats.HP}</div>
            <div class="stat-row"><strong>ATK:</strong> ${stats.ATK}</div>
            <div class="stat-row"><strong>DEF:</strong> ${stats.DEF}</div>
        `;
        // Enemy
        enemyContainer.innerHTML = `
            <div class="stat-row"><strong>HP:</strong> ${randomEnemy.HP}</div>
            <div class="stat-row"><strong>ATK:</strong> ${randomEnemy.ATK}</div>
            <div class="stat-row"><strong>DEF:</strong> ${randomEnemy.DEF}</div>
        `;

        // Setting global variables for the battle
        pHP = stats.HP;
        pAtk = stats.ATK;
        pDef = stats.DEF;

        eHP = randomEnemy.HP;
        eAtk = randomEnemy.ATK;
        eDef = randomEnemy.DEF;
         
        // Attack button logic
        const attackBtn = document.querySelector("#attack-btn");

        attackBtn.onclick = function() {
            // Calculate and store damage
            let damageToEnemy = Math.max(1, pAtk - eDef);
            let damageToPlayer = Math.max(1, eAtk - pDef);

            // Update gladiator health
            eHP -= damageToEnemy;
            pHP -= damageToPlayer;

            // Update log
            const log = document.querySelector("#battle-log");
            log.innerHTML = `<p> You hit for ${damageToEnemy}! 
                Enemy hits back for ${damageToPlayer}.</p>` + log.innerHTML;
            
            // Refresh Screen
            updateDisplay();
            checkWinStatus();
        }

        function updateDisplay() {
            // Update Hero Stats 
            const statsContainer = document.querySelector("#stats-container");
            statsContainer.innerHTML = `
                <div class = "stat-row"><strong>HP:</strong> ${Math.max(0, pHP)}</div>
                <div class = "stat-row"><strong>ATK:</strong> ${pAtk}</div>
                <div class = "stat-row"><strong>DEF:</strong> ${pDef}</div>
            `;

            // Update enemy stats
            const enemyContainer = document.querySelector("#enemy-stats-container");
            enemyContainer.innerHTML = `
                <div class="stat-row"><strong>HP:</strong> ${Math.max(0, eHP)}</div>
                <div class="stat-row"><strong>ATK:</strong> ${eAtk}</div>
                <div class="stat-row"><strong>DEF:</strong> ${eDef}</div>
            `;
        }

        function checkWinStatus() {
            const status = document.querySelector("#status-message");

            // Only run this logic if someone has 0 or less HP
            if (pHP <= 0 || eHP <= 0) {
        
                if (pHP <= 0 && eHP <= 0) {
                    status.innerText = "MUTUAL DESTRUCTION...";
                } else if (eHP <= 0) {
                    status.innerText = "VICTORY!";
                    document.body.classList.add("victory-glow");
                } else {
                    status.innerText = "HA! YOU DIED!";
                    document.body.classList.add("defeat-glow");
                }
                endGame();
            }
        }

        function endGame() {
            // Disable the attack button so the player can't keep fighting a corpse
        document.querySelector("#attack-btn").disabled = true;
        document.querySelector("#attack-btn").style.opacity = "0.5";
        document.querySelector("#attack-btn").innerText = "GAME OVER";
        }

    } else {
        alert("Please pick a role first!");
    }
});

// Load the selection when the page opens
let saved = localStorage.getItem("selectedRole"); // Match the key used above

if (saved) {
    for (let role of roles) {
        if (role.querySelector("h2").innerText === saved) {
            role.classList.add("selected");
        }
    }
}