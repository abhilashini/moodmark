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
    if (hour < 5) return "🌌 Late Night";
    if (hour < 11) return "☀️ Morning";
    if (hour < 16) return "🌤 Afternoon";
    if (hour < 20) return "🌆 Evening";
    return "🌙 Night";
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
loadData();

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

        await loadData();
    }
});

function loadData() {
    fetch(`/data.json?ts=${Date.now()}`)
        .then(res => res.json())
        .then(entries => {
            const moodCount = {};
            const tagGroups = {
                "🌌 Late Night": {},
                "☀️ Morning": {},
                "🌤 Afternoon": {},
                "🌆 Evening": {},
                "🌙 Night": {}
            };

            entries.forEach(entry => {
                const mood = entry.mood.toLowerCase();
                const tags = Array.isArray(entry.tags) ? entry.tags : [];

                // For mood cloud
                moodCount[mood] = (moodCount[mood] || 0) + 1;

                // For tag groups by time of day
                const label = getTimeOfDayLabel(entry.timestamp);
                if (!tagGroups[label]) {
                    console.warn("Unexpected label:", label);
                    return;
                }

                tags.forEach(tag => {
                    tagGroups[label][tag] = (tagGroups[label][tag] || 0) + 1;
                });
            });

            renderMoodCloud(moodCount);
            renderTagGroups(tagGroups);
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

function renderTagGroups(groupedTags) {
    const container = document.getElementById("tag-groups");
    container.innerHTML = "";

    Object.entries(groupedTags).forEach(([timeLabel, tags]) => {
        if (Object.keys(tags).length === 0) return;

        const wrapper = document.createElement("div");
        wrapper.className = "tag-group";

        const heading = document.createElement("h3");
        heading.textContent = timeLabel;

        const tagCloud = document.createElement("div");
        tagCloud.className = "tag-cloud";

        Object.entries(tags)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .forEach(([tag, count]) => {
                const chip = document.createElement("div");
                chip.className = "mood-chip";
                chip.textContent = `#${tag} (${count})`;
                tagCloud.appendChild(chip);
            });

        wrapper.appendChild(heading);
        wrapper.appendChild(tagCloud);
        container.appendChild(wrapper);
    });
}