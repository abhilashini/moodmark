import java.io.File
import java.time.LocalDateTime
import kotlinx.serialization.*
import kotlinx.serialization.json.*

@Serializable
data class Entry(val mood: String, val timestamp: String, val tags: List<String> = emptyList())

val jsonFile = File("data.json")

val json = Json {
    ignoreUnknownKeys = true
    prettyPrint = true
}

fun logMood(
    mood: String,
    tags: List<String> = emptyList(),
    file: File = File("data.json"),
    timestampProvider: () -> String = { LocalDateTime.now().toString() }
) {
    val entries = if (file.exists()) {
        val content = file.readText()
        if (content.isNotBlank()) {
            json.decodeFromString<List<Entry>>(content)
        } else emptyList()
    } else emptyList()

    val newEntry = Entry(mood, timestampProvider(), tags)
    val updated = entries + newEntry
    file.writeText(json.encodeToString(updated))
}

fun main(args: Array<String>) {
    if (args.size >= 3 && args[0] == "log" && args[1] == "mood") {
        val mood = args[2]
        val tags = if (args.size > 3) args.slice(3 until args.size) else emptyList()
        logMood(mood, tags)
    }
}