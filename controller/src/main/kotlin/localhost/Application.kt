package localhost

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.net.HttpURLConnection
import java.net.URL
import java.sql.DriverManager

@Serializable
data class RequestData(
    val id: Int,
    val name: String,
    val image: String,
    val disk: String,
    val ram: String,
    val cpu: String,
    val port: String,
    val startup: String
)

val url = "jdbc:postgresql://localhost:5432/"
val user = "postgres"
val password = "Cabybara"

val client = HttpClient(CIO)

fun main() {
    embeddedServer(Netty, port = 6969) {
        routing {
            get("/api/commands/{name}/{command}") {
                if (call.parameters["command"].equals("delete", true)) {
                    client.get("http://localhost:46449/containers/${call.parameters["name"].toString()}/${call.parameters["command"].toString()}")
                    deleteRecord(call.parameters["name"].toString())
                } else {
                    val response: HttpResponse = client.get("http://localhost:46449/containers/${call.parameters["name"].toString()}/${call.parameters["command"].toString()}")
                    call.respondText(response.bodyAsText())
                }
            }
            get("/api/stats/{worker}") {
                call.respondText(sendStats(call.parameters["worker"].toString()))
            }
            post("/api/commands/create") {
                val receivedDataJson = call.receive<String>()
                val receivedData = Json.decodeFromString<RequestData>(receivedDataJson)
                createRecord(receivedData)
            }
            post("/api/commands/update") {
                val receivedDataJson = call.receive<String>()
                val receivedData = Json.decodeFromString<RequestData>(receivedDataJson)
                updateRecord(receivedData)
            }
        }
    }.start(wait = true)
}

fun sendStats(worker: String): String {
    val json = jacksonObjectMapper().writeValueAsString(worker)
    val baseUrl = "http://localhost:46449/containers/${worker}"

    val url = URL(baseUrl)
    val connection = url.openConnection() as HttpURLConnection
    connection.requestMethod = "POST"
    connection.doOutput = true
    connection.setRequestProperty("Content-Type", "application/json")
    connection.outputStream.use { outputStream ->
        outputStream.write(json.toByteArray())
    }

    val response = connection.inputStream.bufferedReader().use { it.readText() }
    return response
}

fun deleteRecord(id: String) {
    DriverManager.getConnection(url, user, password).use { connection ->
        connection.createStatement().use { statement ->
            statement.executeQuery("DELETE FROM workers WHERE id=${id}")
        }
    }
}

fun createRecord(input: RequestData) {
    DriverManager.getConnection(url, user, password).use { connection ->
        connection.createStatement().use { statement ->
            statement.executeQuery("INSERT INTO workers (name, image, disk, ram, cpu, port, startup) " +
                    "VALUES (${input.name}, ${input.image}, ${input.disk}, ${input.ram}, ${input.cpu}, ${input.port}, ${input.startup})")
        }
    }
}

fun updateRecord(input: RequestData) {
    DriverManager.getConnection(url, user, password).use { connection ->
        connection.createStatement().use { statement ->
            statement.executeQuery(
                "UPDATE workers SET (name=${input.name}, " +
                    "image=${input.image}, " +
                    "disk=${input.disk}, " +
                    "ram=${input.ram}, " +
                    "cpu=${input.cpu}, " +
                    "port=${input.port}, " +
                    "startup=${input.startup} WHERE id=${input.id})"
            )
        }
    }
}