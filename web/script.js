const input = document.getElementById("input");
const output = document.getElementById("output");

input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const command = input.value.trim();
    output.textContent += `\n> ${command}`;
    input.value = "";

    if (command.startsWith("log mood")) {
      const parts = command.split(" ");
      const mood = parts[2];
      const tags = parts.slice(3).map(t => t.replace("#", ""));

      const payload = {
        mood: mood,
        tags: tags,
        timestamp: new Date().toISOString()
      };

      try {
        const res = await fetch("/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        output.textContent += `\nLogged: ${JSON.stringify(result.logged)}`;
      } catch (err) {
        output.textContent += `\nError: ${err.message}`;
      }
    } else {
      output.textContent += "\nUnknown command.";
    }
  }
});