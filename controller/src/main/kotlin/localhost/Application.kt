package localhost

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.google.gson.Gson
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.plugins.cors.routing.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.*
import java.net.HttpURLConnection
import java.net.URL
import java.sql.DriverManager

@Serializable
data class RequestData(
    val id: Int?=null,
    val name: String?="",
    val image: String,
    val disk: Int?=-1,
    val ram: Int?=-1,
    val cpu: Int?=-1,
    val port: Int?=-1,
    val startup: String?=""
)

val url = "jdbc:postgresql://localhost:5432/"
val user = "postgres"
val password = "Cabybara"

val client = HttpClient(CIO)

fun main() {
    embeddedServer(Netty, port = 6969) {
        install(CORS) {
            allowHost("*")
            allowHeader(HttpHeaders.ContentType)
        }
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
            get("/api/workers") {
                val gson = Gson()
                call.respond(gson.toJson(listWorkers()))
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

fun listWorkers(): List<Map<String, Any>> {
    DriverManager.getConnection(url, user, password).use { connection ->
        connection.createStatement().use { statement ->
            // Execute the query
            val resultSet = statement.executeQuery("SELECT * FROM workers")

            // Get metadata to retrieve column names
            val metaData = resultSet.metaData
            val columnCount = metaData.columnCount
            val columnNames = (1..columnCount).map { metaData.getColumnName(it) }

            // Process the results and convert to a list of Map<String, Any?>
            val records = mutableListOf<Map<String, Any>>()
            while (resultSet.next()) {
                val record = mutableMapOf<String, Any>()
                for (columnName in columnNames) {
                    val columnValue = resultSet.getObject(columnName)
                    record[columnName] = columnValue
                }
                records.add(record)
            }
            return records
        }
    }
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
        connection.prepareStatement("INSERT INTO workers (name, image, disk, ram, cpu, port, startup) VALUES (?, ?, ?, ?, ?, ?, ?)").use { statement ->
            statement.setString(1, input.name)
            statement.setString(2, input.image)
            input.disk?.let { statement.setInt(3, it) }
            input.ram?.let { statement.setInt(4, it) }
            input.cpu?.let { statement.setInt(5, it) }
            input.port?.let { statement.setInt(6, it) }
            statement.setString(7, input.startup)
            statement.executeUpdate()
        }
    }
}

fun updateRecord(input: RequestData) {
    DriverManager.getConnection(url, user, password).use { connection ->
        connection.prepareStatement(
            "UPDATE workers SET name=?, " +
                    "image=?, " +
                    "disk=?, " +
                    "ram=?, " +
                    "cpu=?, " +
                    "port=?, " +
                    "startup=? WHERE id=?"
        ).use { statement ->
            statement.setString(1, input.name)
            statement.setString(2, input.image)
            input.disk?.let { statement.setInt(3, it) }
            input.ram?.let { statement.setInt(4, it) }
            input.cpu?.let { statement.setInt(5, it) }
            input.port?.let { statement.setInt(6, it) }
            input.startup?.let { statement.setString(7, it) }
            input.id?.let { statement.setInt(8, it) }
            statement.executeUpdate()
        }
    }
}