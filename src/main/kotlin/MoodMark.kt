import java.io.File
import java.time.LocalDateTime
import kotlinx.serialization.*
import kotlinx.serialization.json.*

@Serializable
data class Entry(val mood: String, val timestamp: String)

val jsonFile = File("data.json")

fun main(args: Args<String>) {
    if (args.size >= 3 && args[0] == "log" && args[1] == "mood") {
        val mood = args[2]
        val file = File("data.json")
        val list = if (file.exists()) {
            Json.decodeFromString<List<Entry>>(file.readText())
        } else emptyList()
        val newEntry = Entry(mood, LocalDateTime.now().toString())
        val updated = list + newEntry
        file.writeText(Json.encodeToString(updated))
    }
}