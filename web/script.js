document.getElementById("command").addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        const input = e.target.value.trim();
        e.target.value = "";

        if (input.startsWith("/log")) {
            const parts = input.split(" ");
            const mood = parts[2] || "neutral";

            await fetch("/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mood }),
            });

            loadTimeline();
        }
    }
});

async function loadTimeline() {
    const res = await fetch("/data.json");
    const entries = await res.json();

    const timeline = document.getElementById("timeline");
    timeline.innerHTML = "";

    entries.slice().reverse().forEach((entry) => {
        const moodIcon = {
            happy: "😊",
            sad: "😔",
            neutral: "😐",
        }[entry.mood] || "📝";

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
