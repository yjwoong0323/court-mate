-- data.sql

-- admin
INSERT INTO team (name, password) VALUES ('tempo', '0000');
INSERT INTO team (name, password) VALUES ('이재웅', '9874');

-- court
INSERT INTO court (name, court_type) VALUES ('1', 'ACTIVE');
INSERT INTO court (name, court_type) VALUES ('2', 'ACTIVE');
INSERT INTO court (name, court_type) VALUES ('3', 'ACTIVE');
INSERT INTO court (name, court_type) VALUES ('4', 'ACTIVE');
INSERT INTO court (name, court_type) VALUES ('W1', 'WAITING');
INSERT INTO court (name, court_type) VALUES ('W2', 'WAITING');

-- player
INSERT INTO player (name, sex, level, team_id) VALUES ('이재웅', 'M', 'A', 1);
INSERT INTO player (name, sex, level, team_id) VALUES ('이다윤', 'W', 'S', 1);
INSERT INTO player (name, sex, level, team_id) VALUES ('김범근', 'M', 'A', 1);
INSERT INTO player (name, sex, level, team_id) VALUES ('이승주', 'W', 'A', 1);
INSERT INTO player (name, sex, level, team_id) VALUES ('허시원', 'M', 'A', 1);
INSERT INTO player (name, sex, level, team_id) VALUES ('나예림', 'W', 'A', 1);
INSERT INTO player (name, sex, level, team_id) VALUES ('안종식', 'M', 'A', 1);
INSERT INTO player (name, sex, level, team_id) VALUES ('장하연', 'W', 'B', 1);
INSERT INTO player (name, sex, level, team_id) VALUES ('정호재', 'M', 'A', 1);
INSERT INTO player (name, sex, level, team_id) VALUES ('원영민', 'W', 'B', 1);
INSERT INTO player (name, sex, level, team_id) VALUES ('전정훈', 'M', 'A', 1);
INSERT INTO player (name, sex, level, team_id) VALUES ('이승진', 'W', 'A', 1);
INSERT INTO player (name, sex, level, team_id) VALUES ('오병선', 'M', 'A', 1);
INSERT INTO player (name, sex, level, team_id) VALUES ('권준형', 'M', 'A', 1);
INSERT INTO player (name, sex, level, team_id) VALUES ('김혁', 'M', 'A', 1);
INSERT INTO player (name, sex, level, team_id) VALUES ('김아영', 'W', 'B', 1);
INSERT INTO player (name, sex, level, team_id) VALUES ('김도연', 'W', 'B', 1);

UPDATE team
SET leader_id = 1
WHERE id = 1;


commit;