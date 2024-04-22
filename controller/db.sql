CREATE TABLE workers (
    id SERIAL,
    narwhalId int NOT NULL,
    name TEXT,
    image TEXT NOT NULL,
    disk INT,
    ram INT,
    cpu INT,
    port INT,
    startup TEXT
)

