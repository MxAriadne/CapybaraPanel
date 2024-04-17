import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.net.HttpURLConnection
import java.net.URL

data class DatabaseRequest(val query: String)

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
    val requestData = DatabaseRequest("SELECT * FROM workers;",)
    val json = jacksonObjectMapper().writeValueAsString(requestData)
    val baseUrl = "http://localhost:6969/api/db"

    val url = URL(baseUrl)
    val connection = url.openConnection() as HttpURLConnection
    connection.requestMethod = "POST"
    connection.doOutput = true
    connection.setRequestProperty("Content-Type", "application/json")
    connection.setRequestProperty("Accept", "application/json") // Set Accept header
    connection.outputStream.use { outputStream ->
        outputStream.write(json.toByteArray())
    }

    println("Request JSON: $json")

    //val responseCode = connection.responseCode
    //println("Response Code : $responseCode")

    val response = connection.inputStream.bufferedReader().use { it.readText() }
    println("Response from server: $response")

    connection.disconnect()
}

