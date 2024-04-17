package localhost

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
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
data class DatabaseRequest(val query: String)

@Serializable
data class RequestData(
    // Flag used represents the action taken by the controller node.
    // 1 =
    val flag: Int,
    val name: String,
    val image: String,
    val disk: String,
    val ram: String,
    val cpu: String,
    val port: String,
    val startup: String
)

fun main() {
    embeddedServer(Netty, port = 6969) {
        routing {
            post("/api/json") {
                val receivedDataJson = call.receive<String>()
                val receivedData = Json.decodeFromString<RequestData>(receivedDataJson)
                println("Received JSON: $receivedData")
                // Handle the received data here as needed
            }
            post("/api/stats") {
                val receivedDataJson = call.receive<String>()
                val receivedData = Json.decodeFromString<RequestData>(receivedDataJson)
                println("Received JSON: $receivedData")
                // Handle the received data here as needed
            }
            post("/api/db") {
                // Take in the database request
                val receivedDataJson = call.receive<String>()
                // Decode JSON into DatabaseRequest object
                val receivedData = Json.decodeFromString<DatabaseRequest>(receivedDataJson)
                // Debug print
                println("Received JSON: $receivedData")
                // Handle database query
                val records = alterDatabase(receivedData)
                // Send back to client
                call.respond(records.toString())
            }
        }
    }.start(wait = true)
}

fun alterDatabase(request: DatabaseRequest): List<Map<String, Any>> {
    val url = "jdbc:postgresql://localhost:5432/"
    val user = "postgres"
    val password = "Cabybara"

    // Establish database connection
    DriverManager.getConnection(url, user, password).use { connection ->
        connection.createStatement().use { statement ->
            // Execute the query
            val resultSet = statement.executeQuery(request.query)

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

fun requestStats() {
    val requestData = DatabaseRequest("SELECT * FROM workers;",)
    val json = jacksonObjectMapper().writeValueAsString(requestData)
    val baseUrl = "http://localhost:46449/api/db"

    val url = URL(baseUrl)
    val connection = url.openConnection() as HttpURLConnection
    connection.requestMethod = "POST"
    connection.doOutput = true
    connection.setRequestProperty("Content-Type", "application/json")
    connection.outputStream.use { outputStream ->
        outputStream.write(json.toByteArray())
    }
}
