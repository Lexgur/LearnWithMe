/*
CREATE TABLE `user_courses` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `course_id` int UNSIGNED DEFAULT NULL,
  `progress` smallint UNSIGNED DEFAULT NULL,
  `finished` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
*/
import { faker } from "@faker-js/faker";

function createUserCourses(user_id, course_id, coursesPartCount, finished) {
  const { partCount } = coursesPartCount.find(c => course_id === c.course_id);

  return {
    user_id,
    course_id,
    progress: finished ? partCount : faker.number.int({min: 1, max: partCount}),
    finished
  }
}

export default function createAllUserCourses(usersCount, coursesPartCount, coursesCount) {

  const maxHasCourses = Math.ceil(coursesCount / 2)
  const finishedCourses  = [];

  for (let user_id = 1; user_id <= usersCount; user_id++){
    const hasCourses = faker.number.int({min: 0, max: maxHasCourses});

    const coursesIds = new Set();

    while (coursesIds.size < hasCourses) {
        coursesIds.add(faker.number.int({min: 1, max: coursesCount}))
    }
    
    coursesIds.forEach(course_id => {
      const finished = faker.number.int({min: 1, max: 5}) === 1 ? 1 : 0;
      if(finished) finishedCourses.push({user_id, course_id});
    });
  }
}