package localhost

import io.github.cdimascio.dotenv.dotenv
import kotlinx.serialization.Serializable
import java.sql.DriverManager
import java.sql.SQLException
import java.sql.Types

@Serializable
data class BaseDatabaseSchema(
    val id: Int,
    val narwhalId: String?=null,
    val name: String?=null,
    val image: String,
    val disk: Int?=null,
    val ram: Int?=null,
    val cpu: Int?=null,
    val port: String?=null,
    val startup: String?=null,
)

@Serializable
data class CreateWorker(
    val name: String?=null,
    val image: String,
    val disk: Int?=null,
    val ram: Int?=null,
    val cpu: Int?=null,
    val port: String?=null,
    val startup: String?=null,
)

fun deleteWorker(workerName: Int) {
    val conn = DriverManager.getConnection(dotenv()["DB_URL"])
    val statement = conn.prepareStatement("DELETE FROM workers WHERE id = ?")
    statement.setInt(1, workerName)
    statement.execute()
}

fun updateWorker(workerId: Int, workerConfig: BaseDatabaseSchema) {
    val conn = DriverManager.getConnection(dotenv()["DB_URL"])
    val statement = conn.prepareStatement("UPDATE workers SET name = ?, image = ?, disk = ?, ram = ?, cpu = ?, port = ?, startup = ? WHERE id = ?")
    statement.setString(1, workerConfig.name)
    statement.setString(2, workerConfig.image)
    workerConfig.disk?.let { statement.setInt(3, it) }
    workerConfig.ram?.let { statement.setInt(4, it) }
    workerConfig.cpu?.let { statement.setInt(5, it) }
    workerConfig.port?.let { statement.setString(6, it) }
    workerConfig.startup?.let { statement.setString(7, it) }
    statement.setInt(8, workerId)
    statement.execute()
    conn.close()
}

fun getWorker(workerId: Int): BaseDatabaseSchema? {
    val conn = DriverManager.getConnection(dotenv()["DB_URL"])
    val statement = conn.prepareStatement("SELECT * FROM workers WHERE id = ?")
    statement.setInt(1, workerId)
    val resultSet = statement.executeQuery()

    var worker: BaseDatabaseSchema? = null

    if (resultSet.next()) {
        val id = resultSet.getInt("id")
        val narwhalId = resultSet.getString("narwhalId")
        val name = resultSet.getString("name")
        val image = resultSet.getString("image")
        val disk = resultSet.getInt("disk")
        val ram = resultSet.getInt("ram")
        val cpu = resultSet.getInt("cpu")
        val port = resultSet.getString("port")
        val startup = resultSet.getString("startup")

        worker = BaseDatabaseSchema(id, narwhalId, name, image, disk, ram, cpu, port, startup)
    }

    resultSet.close()
    statement.close()
    conn.close()

    return worker
}

fun listWorkers(): List<Map<String, Any>> {
    val conn = DriverManager.getConnection(dotenv()["DB_URL"])
    val statement = conn.prepareStatement("SELECT * FROM workers")
    val resultSet = statement.executeQuery()

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

suspend fun insertWorker(workerConfig: CreateWorker) : String {

    // Execute the SQL query using JDBC
    try {
        val conn = DriverManager.getConnection(dotenv()["DB_URL"])

        val createWorkerRes = createWorker(workerConfig)

        println("create worker: $createWorkerRes")
        val errorMessage = createWorkerRes?.message?.ifEmpty { null }
        if(errorMessage != null) {
            println("Error when making worker: $errorMessage")
            return errorMessage
        }

        val statement = conn.prepareStatement("INSERT INTO workers (name, narwhalid, image, ram, cpu, port, startup) VALUES (?, ?, ?, ?, ?, ?, ?)")
        statement.setString(1, workerConfig.name)
        createWorkerRes?.id.let { statement.setString(2, it) }
        workerConfig.image.let { statement.setString(3, it) }
        workerConfig.ram.let {
            if (it != null) {
                statement.setInt(4, it)
            } else {
                statement.setNull(4, Types.INTEGER)
            }
        }
        workerConfig.cpu.let {
            if (it != null) {
                statement.setInt(5, it)
            } else {
                statement.setNull(5, Types.INTEGER)
            }
        }
        workerConfig.port.let {
            if (it != null) {
                statement.setString(6, it)
            } else {
                statement.setNull(6, Types.VARCHAR)
            }
        }
        workerConfig.startup.let { statement.setString(7, it) }
        statement.execute()
        conn.close()

        return createWorkerRes!!.id
    } catch (e: SQLException) {
        println(e.message)
    }

    return "Error"
}