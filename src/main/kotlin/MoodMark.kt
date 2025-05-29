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

fun main(args: Array<String>) {
    if (args.size >= 3 && args[0] == "log" && args[1] == "mood") {
        val mood = args[2] ?: "neutral"
        val tags = if (args.size > 3) args.slice(3 until args.size) else emptyList()
        
        val entries = if (jsonFile.exists()) {
            val content = jsonFile.readText()
            if (content.isNotBlank()) {
                json.decodeFromString<List<Entry>>(content)
            } else {
                emptyList()
            }
        } else {
            emptyList()
        }

        val newEntry = Entry(mood, LocalDateTime.now().toString(), tags)
        val updated = entries + newEntry
        jsonFile.writeText(json.encodeToString(updated))
    }
}