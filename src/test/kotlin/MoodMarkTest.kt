import kotlin.test.*
import java.io.File
import kotlinx.serialization.encodeToString
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.json.*

class MoodLoggerTest {

    private lateinit var tempFile: File

    @BeforeTest
    fun setup() {
        tempFile = File.createTempFile("test-data", ".json")
        tempFile.writeText("[]")
    }

    @AfterTest
    fun teardown() {
        tempFile.delete()
    }

    @Test
    fun testLogMood_createsEntryCorrectly() {
        val fakeTimestamp = "2024-01-01T12:00:00"
        logMood("happy", listOf("sunny", "outside"), tempFile) { fakeTimestamp }

        val content = tempFile.readText()
        val entries = json.decodeFromString<List<Entry>>(content)

        assertEquals(1, entries.size)
        val entry = entries[0]
        assertEquals("happy", entry.mood)
        assertEquals(fakeTimestamp, entry.timestamp)
        assertEquals(listOf("sunny", "outside"), entry.tags)
    }

    @Test
    fun testLogMood_appendsToExistingFile() {
        val initialEntry = Entry("sad", "2024-01-01T09:00:00")
        tempFile.writeText(json.encodeToString(ListSerializer(Entry.serializer()), listOf(initialEntry)))

        logMood("excited", emptyList(), tempFile) { "2024-01-01T10:00:00" }

        val entries = json.decodeFromString<List<Entry>>(tempFile.readText())
        assertEquals(2, entries.size)
        assertEquals("excited", entries[1].mood)
    }
}
