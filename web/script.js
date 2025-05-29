document.getElementById("command").addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        const input = e.target.value.trim();
        e.target.value = "";

        if (input.startsWith("/log")) {
            const parts = input.split(" ");
            // parts[0] = "/log"
            // parts[1] = "mood"
            // parts[2] = actual mood
            // parts[3..] = tags (optional)

            const mood = parts[2] || "neutral";
            const tags = parts.length > 3 ? parts.slice(3) : [];

            await fetch("/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mood, tags }),
            });

            await loadTimeline();
            console.log("Timeline updated");
        }
    }
});

async function loadTimeline() {
    const res = await fetch(`/data.json?ts=${Date.now()}`); // ✅ avoid caching
    const entries = await res.json();
    console.log("Fetched entries:", entries);

    const timeline = document.getElementById("timeline");
    timeline.innerHTML = "";

    entries.slice().reverse().forEach((entry) => {
        const moodIcon = {
            happy: "😊",
            sad: "😔",
            angry: "😡",
            excited: "🤩",
            tired: "😴",
            neutral: "😐",
        }[entry.mood.toLowerCase()] || "📝";

        const div = document.createElement("div");
        div.className = "entry";
        div.innerHTML = `
          <div class="icon">${moodIcon}</div>
          <div>
            <strong>${entry.mood}</strong><br />
            <small>${entry.timestamp}</small>
          </div>
        `;
        timeline.appendChild(div);
    });
}

loadTimeline();