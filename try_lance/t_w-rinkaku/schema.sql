


CREATE TABLE PostRelation(fgbg VARCHAR PRIMARY KEY, fg VARCHAR NOT NULL, bg VARCHAR NOT NULL);
CREATE TABLE Post(kno VARCHAR PRIMARY KEY, title VARCHAR NOT NULL, body_text_content VARCHAR NOT NULL, body_html VARCHAR NOT NULL, posted_at TIMESTAMP NOT NULL, crawled_at TIMESTAMP NOT NULL);


CREATE INDEX post_relation_fg_index ON PostRelation (fg);
CREATE INDEX post_relation_bg_index ON PostRelation (bg);
CREATE INDEX post_relation_index ON PostRelation (fg, bg)
;


