/*
CREATE TABLE `parts` (
  `id` int UNSIGNED NOT NULL,
  `course_id` int UNSIGNED NOT NULL COMMENT 'Kam priklauso',
  `row_number` tinyint NOT NULL,
  `title` varchar(66) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
 */

import { faker } from "@faker-js/faker";

    function createPart(course_id, row_number){
        return {
            course_id,
            row_number,
            title: faker.food.dish(),
            description: faker.word.words({count: {min: 5, max: 40}}),
        }
    }

    export default function createAllParts(coursesCount) {

        const coursePartCount = [];
        const parts = [];

        for (let course_id = 1; course_id <= coursesCount; course_id++){
            const partCount = faker.number.int({min: 2, max: 22});
            coursePartCount.push({course_id, partCount});
            for (let row_number = 1; row_number <= partCount; row_number++){
                parts.push(createPart(course_id, row_number));
        }
        return { coursePartCount, parts}
    }
}
