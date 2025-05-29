const FA_AVAILABLE = new Set([
    "happy", "sad", "angry", "excited", "tired", "neutral", "surprised", "anxious", "confused"
]);

function getMoodIconClass(mood) {
    const map = {
        happy: "fa-face-smile",
        sad: "fa-face-frown",
        angry: "fa-face-angry",
        tired: "fa-bed",
        excited: "fa-star",
        relaxed: "fa-spa",
        anxious: "fa-heart-crack",
        neutral: "fa-face-meh",
        love: "fa-heart",
        bored: "fa-face-meh-blank",
        productive: "fa-circle-check",
        stressed: "fa-bolt",
        sick: "fa-face-dizzy",
        calm: "fa-cloud",
        energetic: "fa-bolt-lightning",
        sleepy: "fa-moon",
        surprised: "fa-face-surprise",
        confused: "fa-question"
    };

    return map[mood] || "fa-pen";
}

function getTimeOfDayLabel(timestamp) {
    const hour = new Date(timestamp).getHours();
    if (hour < 5) return "Late Night 🌌";
    if (hour < 12) return "Morning ☀️";
    if (hour < 17) return "Afternoon 🌤";
    if (hour < 21) return "Evening 🌆";
    return "Night 🌙";
}

function setDynamicHeader() {
    const header = document.getElementById("header");
    const hour = new Date().getHours();

    let greeting = "Moodmark";
    if (hour < 5) greeting = "🌌 Late Night Feels";
    else if (hour < 12) greeting = "☀️ Good Morning!";
    else if (hour < 17) greeting = "🌤 Afternoon Vibes";
    else if (hour < 21) greeting = "🌆 Evening Mood";
    else greeting = "🌙 Nighttime Reflections";

    header.textContent = greeting;
}

setDynamicHeader();

document.getElementById("command").addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        const input = e.target.value.trim();
        e.target.value = "";

        if (!input) return;

        const parts = input.split(" ");
        const mood = parts[0] || "neutral";
        const tags = parts.slice(1);

        await fetch("/log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mood, tags }),
        });

        await loadTimeline();
    }
});

function loadTimeline() {
    fetch(`/data.json?ts=${Date.now()}`)
        .then(res => res.json())
        .then(entries => {
            const timeline = document.getElementById("timeline");
            timeline.innerHTML = "";

            const moodCount = {};

            entries.slice().reverse().forEach(entry => {
                const mood = entry.mood.toLowerCase();
                const moodClass = getMoodIconClass(mood);
                const tags = Array.isArray(entry.tags) ? entry.tags : [];

                moodCount[mood] = (moodCount[mood] || 0) + 1;

                const div = document.createElement("div");
                div.className = "entry";
                div.innerHTML = `
          <div class="icon"><i class="fas ${moodClass}"></i></div>
          <div class="content">
            <div class="mood-row">
              <strong>${entry.mood}</strong>
              <div class="tags">
                ${tags.map(tag => `<span class="tag">#${tag}</span>`).join(" ")}
              </div>
            </div>
            <small>${getTimeOfDayLabel(entry.timestamp)}</small>
          </div>
        `;
                timeline.appendChild(div);
            });

            renderMoodCloud(moodCount);
        });
}

function renderMoodCloud(moodCount) {
    const cloud = document.getElementById("mood-cloud");
    cloud.innerHTML = "";

    Object.entries(moodCount).forEach(([mood, count]) => {
        const iconClass = getMoodIconClass(mood);
        const chip = document.createElement("div");
        chip.className = "mood-chip";
        chip.innerHTML = `<i class="fas ${iconClass}"></i> ${mood} (${count})`;
        cloud.appendChild(chip);
    });
}

loadTimeline();
