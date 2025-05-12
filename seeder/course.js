/*
CREATE TABLE `courses` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `teacher_id` int UNSIGNED DEFAULT NULL,
  `topic_id` int UNSIGNED NOT NULL,
  `req_plan` set('free','silver','gold') NOT NULL,
  `rating` decimal(3,2) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
 */
import { faker } from "@faker-js/faker";

function createCourse(teacherIds, topicsCount) {
  return {
    title: faker.book.title(),
    description: faker.word.words({count: {min: 15, max: 150}}),
    teacher_id: faker.number.int({min: teacherIds[0], max: teacherIds[1]}),
    topic_id: faker.number.int({ min: 1 ,max: topicsCount }),
    req_plan: faker.helpers.arrayElement([
      'Free',
      'Silver',
      'Gold',
    ]),
    rating: 0
  };
}

export default function createAllCourses(teacherIds, topicsCount) {
    const courses = [];
    const coursesCount = 27;

    for (let i = 0; i < coursesCount; i++) {
    courses.push(createCourse(teacherIds, topicsCount));
  }

  return {
    courses,
    coursesCount
  };
}