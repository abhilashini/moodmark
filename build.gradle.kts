plugins {
    kotlin("jvm") version "1.9.22"          // Kotlin compiler
    kotlin("plugin.serialization") version "1.9.22" // for kotlinx-serialization
    id("application")                       // lets Gradle run the app
    id("com.github.johnrengelman.shadow") version "8.1.1"  //  adds shadowJar
}

group = "dev.moodmark"
version = "0.1.0"

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.0")

    testImplementation(kotlin("test")) // <- basic test library (kotlin.test)
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5:1.9.22")
}

tasks.test {
    useJUnitPlatform()
}

application {
    // fully-qualified main class name
    mainClass.set("MoodMarkKt")
}