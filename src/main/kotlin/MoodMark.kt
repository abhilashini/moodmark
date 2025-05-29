import java.io.File
import kotlinx.serialization.*
import kotlinx.serialization.json.*

@Serializable
data class LogEntry(val date: String, val habit: String, val mood: String)

val jsonFile = File("data.json")

fun main() {
    println("Enter habit: ")
    val habit = readLn()
    println("How do you feel today?")
    val mood = readLn()
    
    val date = java.time.LocalDate.now().toString()
    val entry = LogEntry(date, habit, mood)

    val existing = if (jsonFile.exists()) {
        Json.decodeFromString<List<LogEntry>>(jsonFile.readText())
    } else emptyList()
    val updated = existing + entry

    jsonFile.writeText(Json.encodeToString(updated))
    println("Entry saved!")
}