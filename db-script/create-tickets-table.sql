CREATE TABLE TICKETS (
    TICKETID SERIAL PRIMARY KEY,
    TITLE VARCHAR(255) NOT NULL,
    SUMMARY TEXT,
    SATISFACTION VARCHAR(50) NOT NULL
);
