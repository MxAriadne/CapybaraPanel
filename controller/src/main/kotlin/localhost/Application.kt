package localhost

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.google.gson.Gson
import io.github.cdimascio.dotenv.dotenv
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.plugins.cors.routing.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.net.HttpURLConnection
import java.net.URL
import java.sql.DriverManager

val client = HttpClient(CIO){
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
    }
}
fun main() {
    dotenv()
    println("Connected to database at ${dotenv()["DB_URL"]}")
    embeddedServer(Netty, port = 6969) {
        install(CORS) {
            allowHost("*")
            allowHeader(HttpHeaders.ContentType)
            allowMethod(HttpMethod.Get)
            allowMethod(HttpMethod.Post)
            allowMethod(HttpMethod.Delete)
            allowMethod(HttpMethod.Put)
            allowMethod(HttpMethod.Patch)
        }
        routing {
            get("/api/commands/{api_name}") {
                if (!call.parameters["api_name"].isNullOrEmpty()) {
                    val response = client.get("http://localhost:46449/containers/${call.parameters["api_name"]}")
                    call.respondText(response.bodyAsText())
                } else {
                    call.respondText(
                        "Error with requesting API - name not valid",
                        ContentType.Any,
                        HttpStatusCode.ExpectationFailed
                    )
                }
            }
            get("/api/commands/{name}/{command}") {
                val response: HttpResponse =
                    client.get("http://localhost:46449/containers/${call.parameters["name"].toString()}/${call.parameters["command"].toString()}")
                call.respondText(response.bodyAsText())
            }
            get("/api/node/{api_name}") {
                if (!call.parameters["api_name"].isNullOrEmpty()) {
                    val response = client.get("http://localhost:46449/node/${call.parameters["api_name"]}")
                    call.respondText(response.bodyAsText())
                } else {
                    call.respondText(
                        "Error with requesting API - name not valid",
                        ContentType.Any,
                        HttpStatusCode.ExpectationFailed
                    )
                }
            }
            get("/api/stats/{worker}") {
                call.respondText(sendStats(call.parameters["worker"].toString()))
            }
            get("/api/workers") {
                val gson = Gson()
                call.respond(gson.toJson(listWorkers()))
            }
            get ("/api/workers/{worker}") {
                val gson = Gson()
                call.respond(gson.toJson(call.parameters["worker"]?.let { it1 -> getWorker(it1.toInt()) }))
            }
            delete("/api/workers/{worker}") {
                // get the narwhalid of the worker
                val worker = getWorker(call.parameters["worker"]?.toInt() ?: -1)
                if(worker == null) {
                    call.respondText(
                        "Error with requesting worker - id not valid",
                        ContentType.Any,
                        HttpStatusCode.ExpectationFailed
                    )
                    return@delete
                }
                val narwhalId = worker.narwhalId
                // call narwhal api to delete worker
                val response = client.delete("http://localhost:46449/containers/${narwhalId}")
                if (!response.status.isSuccess()) {
                    call.respondText(
                        "Error with deleting worker - narwhalid not valid",
                        ContentType.Any,
                        HttpStatusCode.ExpectationFailed
                    )
                    return@delete
                }
                deleteWorker(worker.id)
                call.respondText(response.bodyAsText())
            }
            post("/api/commands/create") {
                val receivedDataJson = call.receive<String>()
                val receivedData = Json.decodeFromString<CreateWorker>(receivedDataJson)
                val resp = insertWorker(receivedData)
                if(resp.startsWith("Error response from daemon:")) {
                    call.respondText(resp, ContentType.Text.Plain, HttpStatusCode.BadRequest)
                } else {
                    call.respondText(resp, ContentType.Text.Plain, HttpStatusCode.OK)
                }
            }

            post("/api/commands/update") {
                val receivedDataJson = call.receive<String>()
                val receivedData = Json.decodeFromString<BaseDatabaseSchema>(receivedDataJson)
                updateWorker(receivedData.id, receivedData)
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