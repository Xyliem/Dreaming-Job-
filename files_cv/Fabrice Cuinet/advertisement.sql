CREATE TABLE ADVERTISEMENT
(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(250),
    description MEDIUMTEXT,
    type MEDIUMTEXT,
    profile MEDIUMTEXT,
    info_sup MEDIUMTEXT,
    a_fournir MEDIUMTEXT,
    date_publication DATE,
    Salaire INT,
    people_In_Charge INT,
    compagnie_Id INT,
    CONSTRAINT pkAD PRIMARY KEY (id),
    FOREIGN KEY (people_In_Charge) REFERENCES PEOPLE(id_people) ON DELETE CASCADE,
    FOREIGN KEY (compagnie_Id) REFERENCES COMPAGNIES(id_comp) ON DELETE CASCADE
);
