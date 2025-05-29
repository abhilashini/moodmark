fetch('/data.json')
    .then(res => res.json())
    .then(entries => {
        const container = document.getElementById('entries');
        entries.forEach(entry => {
            const div = document.createElement('div');
            div.textContent = `${entry.date} - ${entry.habit} - ${entry.mood}`;
            container.appendChild(div);
        });
    });