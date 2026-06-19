-- data.sql

-- admin
INSERT INTO admin (name, password) VALUES ('이재웅', '9874');
INSERT INTO admin (name, password) VALUES ('tempo', '0000');
INSERT INTO admin (name, password) VALUES ('jsp', '0000');

-- court
INSERT INTO court (name, court_type) VALUES ('1', 'ACTIVE');
INSERT INTO court (name, court_type) VALUES ('2', 'ACTIVE');
INSERT INTO court (name, court_type) VALUES ('3', 'ACTIVE');
INSERT INTO court (name, court_type) VALUES ('4', 'ACTIVE');
INSERT INTO court (name, court_type) VALUES ('W1', 'WAITING');
INSERT INTO court (name, court_type) VALUES ('W2', 'WAITING');

-- player
INSERT INTO player (name, sex, level) VALUES ('이재웅', 'M', 'A');
INSERT INTO player (name, sex, level) VALUES ('이다윤', 'W', 'S');
INSERT INTO player (name, sex, level) VALUES ('김범근', 'M', 'A');
INSERT INTO player (name, sex, level) VALUES ('이승주', 'W', 'A');
INSERT INTO player (name, sex, level) VALUES ('허시원', 'M', 'A');
INSERT INTO player (name, sex, level) VALUES ('나예림', 'W', 'A');
INSERT INTO player (name, sex, level) VALUES ('안종식', 'M', 'A');
INSERT INTO player (name, sex, level) VALUES ('장하연', 'W', 'B');
INSERT INTO player (name, sex, level) VALUES ('정호재', 'M', 'A');
INSERT INTO player (name, sex, level) VALUES ('원영민', 'W', 'B');
INSERT INTO player (name, sex, level) VALUES ('전정훈', 'M', 'A');
INSERT INTO player (name, sex, level) VALUES ('이승진', 'W', 'A');
INSERT INTO player (name, sex, level) VALUES ('오병선', 'M', 'A');
INSERT INTO player (name, sex, level) VALUES ('권준형', 'M', 'A');
INSERT INTO player (name, sex, level) VALUES ('김혁', 'M', 'A');
INSERT INTO player (name, sex, level) VALUES ('김아영', 'W', 'B');
INSERT INTO player (name, sex, level) VALUES ('김도연', 'W', 'B');


commit;