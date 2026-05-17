console.log("Hey bigmoney");
let button = document.querySelector("#myButton");
let roles = document.querySelectorAll(".role");

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

// Handle the "Lock In" button
button.addEventListener("click", function() {
    let selected = document.querySelector(".role.selected");

    if (selected) {
        let roleName = selected.querySelector("h2").innerText;

        // Hide selection, show game
        document.querySelector("#selection-screen").style.display = "none";
        const gameScreen = document.querySelector("#game-screen");
        gameScreen.style.display = "flex";

        const status = document.querySelector("#status-message");
        status.innerText = "Prepare for battle as: " + roleName;

        // Data Definitions
        const allStats = {
            "Warrior": { HP: 150, ATK: 15, DEF: 20 },
            "Barbarian": { HP: 120, ATK: 25, DEF: 5 },
            "Paladin": { HP: 130, ATK: 12, DEF: 15 }
        };

        const roleColors = {
            "Warrior": "dodgerblue",
            "Barbarian": "crimson", 
            "Paladin": "lime"
        };

        const statsContainer = document.querySelector("#stats-container");
        const stats = allStats[roleName];

        // Apply Visuals
        const color = roleColors[roleName] || "white";
        status.style.color = color;
        statsContainer.style.borderLeft = `4px solid ${color}`;

        // Inject Stats into the Container
      

        statsContainer.innerHTML = `
            <div class="stat-row"><strong>HP:</strong> ${stats.HP}</div>
            <div class="stat-row"><strong>ATK:</strong> ${stats.ATK}</div>
            <div class="stat-row"><strong>DEF:</strong> ${stats.DEF}</div>
        `;

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