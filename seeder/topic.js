/*
CREATE TABLE topics (
  id int UNSIGNED NOT NULL,
  title varchar(98) NOT NULL,
  topic_type set('Programming','Design','Cyber Security','Game development') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
*/
import { faker } from '@faker-js/faker';

function createTopic() {
    return {
        title: faker.hacker.phrase(),
        topic_type: faker.helpers.arrayElement(['Programming', 'Design', 'Cyber Security', 'Gaming'])
    }
}

export default function createAllTopic() {
    const topics = [];
    const topicsCount = 11;

    for (let i = 0; i < topicsCount; i++) {
        topics.push(createTopic());
    }

    return { topics, topicsCount };
}