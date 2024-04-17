package localhost.plugins

import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

data class RequestData(val message: String)

fun Application.configureRouting() {
    routing {
        post("/api/json") {
            val requestData = call.receive<RequestData>()
            println("Received JSON: ${requestData.message}")
            // Do something with the received JSON
            println("Fucking kill me now")

            call.respond("JSON received successfully")
        }
    }
}
