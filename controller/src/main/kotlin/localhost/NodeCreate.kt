package localhost

import com.google.gson.Gson
import kotlinx.serialization.*
import kotlinx.serialization.builtins.serializer
import kotlinx.serialization.json.*
import io.ktor.http.*
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import java.net.HttpURLConnection

@Serializable
data class NodeCreate (
    val image: String,
    val cmd: JsonArray? = null,
    val name: String? = null,
    val config: Config? = null,

    @SerialName("needs_gpu")
    val needsGPU: Boolean? = null,

    @SerialName("start_on_create")
    val startOnCreate: Boolean? = null
)

@Serializable
data class Config (
    @SerialName("port_bindings")
    val portBindings: Map<String, List<Long>>? = null,

    val resources: Resources? = null,

    @SerialName("auto_remove")
    val autoRemove: Boolean? = false
)

@Serializable
data class Resources (
    val memory: Long? = null,

    @SerialName("NanoCpus")
    val nanoCpus: Long? = null
)


@Serializable
data class NodeCreateResponse (
    @SerialName("Id")
    val id: String = "",
    @SerialName("Warnings")
    val warnings: List<String> = emptyList(),
    val message: String?=null
)

fun String.toWords(): List<String> =
    trim().splitToSequence(' ')
        .filter { it.isNotEmpty() }
        .toList()

suspend fun createWorker(worker: CreateWorker): NodeCreateResponse? {
    // cmd is a list of strings
    val cmd = null//JsonArray(Gson().toJson(worker.startup?.toWords()?.toList()))
    // port binding comes in as a string "8080:80", we convert it to json "{"8080":[80]}"
    val hostPort = worker.port?.split(":")
    val portBinding = mutableMapOf<String, List<Long>>()
    hostPort?.let {
        portBinding[it[0]] = listOf(it[1].toLong())
    }
    val config = Config(portBindings = portBinding.toMap(), resources = Resources(worker.ram?.toLong(), worker.cpu?.toLong()), autoRemove = false)
    val create = NodeCreate(worker.image, cmd, worker.name!!, config, needsGPU = false, startOnCreate = true)
    try {
        // Actually create the worker
        val response = client.post("http://localhost:46449/containers/create_simple") {
            contentType(ContentType.Application.Json)
            setBody(create)
        }
        println("response: $response")
        // decode json
        val responseJson = response.body<JsonObject>()
        return Json.decodeFromJsonElement(NodeCreateResponse.serializer(), responseJson)
    } catch (e: Exception) {
        println(e.message)
        return null
    }
}